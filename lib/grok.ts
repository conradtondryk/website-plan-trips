import {
  TripFormInput,
  TripPlan,
  GrokChatRequest,
  GrokChatResponse,
} from "./types";
import {
  TripperError,
  ERROR_MESSAGES,
  logError,
  isRateLimitError,
  isNetworkError,
  getHttpErrorMessage,
} from "./errors";

const GROK_API_URL = "https://api.x.ai/v1/chat/completions";
// Model options: "grok-2", "grok-2-latest", "grok-2-1212", "grok-beta"
// Can be overridden via GROK_MODEL environment variable
const GROK_MODEL = process.env.GROK_MODEL || "grok-2";

/**
 * Build the system prompt for trip planning
 */
function buildSystemPrompt(): string {
  return `You are a travel planning assistant for Tripper. Generate detailed, personalized trip plans based on user input.

TRIP TYPE CONTEXT:
- "date": Focus on romantic restaurants, scenic spots, intimate experiences, couple-friendly activities
- "holiday": Tourist attractions, local experiences, cultural sites, mix of popular and unique spots
- "friends": Group activities, nightlife options, adventure activities, social dining spots

RESPONSE FORMAT (JSON only, no markdown):
{
  "tripName": "string - creative name for this trip",
  "location": {
    "name": "string",
    "coordinates": { "lat": number, "lng": number }
  },
  "days": [
    {
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "id": "unique-id",
          "time": "HH:MM",
          "name": "string",
          "type": "restaurant" | "museum" | "activity" | "attraction" | "nightlife" | "scenic",
          "description": "string - 1-2 sentences",
          "coordinates": { "lat": number, "lng": number },
          "priceRange": "$" | "$$" | "$$$" | "$$$$",
          "isHiddenGem": boolean,
          "hiddenGemReason": "string - only if isHiddenGem is true"
        }
      ]
    }
  ],
  "budgetBreakdown": {
    "estimated": number,
    "currency": "string",
    "withinBudget": boolean
  },
  "tips": ["string - 2-3 helpful tips"]
}

REQUIREMENTS:
- Generate 3-6 activities per day
- Include mix of popular locations AND hidden gems (highly-rated but lesser-known spots)
- Mark hidden gems with isHiddenGem: true and explain why in hiddenGemReason
- Tailor all suggestions to the trip type
- Keep suggestions within the stated budget
- Ensure coordinates are accurate for map plotting
- If location is invalid or too vague, respond with: { "error": "Please enter a valid location" }

Respond ONLY with valid JSON, no additional text.`;
}

/**
 * Build the user prompt for trip planning
 */
function buildUserPrompt(input: TripFormInput): string {
  return `Plan a trip with the following details:

Location: ${input.location}
Trip Type: ${input.tripType}
Dates: ${input.startDate} to ${input.endDate}
Budget: ${input.budget}
${input.preferences ? `Preferences: ${input.preferences}` : ""}

Generate a complete trip plan in JSON format.`;
}

/**
 * Parse and validate the Grok API response
 */
function parseGrokResponse(content: string): TripPlan {
  try {
    // Remove any markdown code blocks if present
    let cleanContent = content.trim();
    if (cleanContent.startsWith("```json")) {
      cleanContent = cleanContent.slice(7);
    }
    if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent.slice(3);
    }
    if (cleanContent.endsWith("```")) {
      cleanContent = cleanContent.slice(0, -3);
    }
    cleanContent = cleanContent.trim();

    const parsed = JSON.parse(cleanContent);

    // Check for error response from Grok
    if (parsed.error) {
      // Check if it's a location-related error
      const errorLower = parsed.error.toLowerCase();
      if (errorLower.includes("location") || errorLower.includes("valid") || errorLower.includes("vague")) {
        throw new TripperError(
          parsed.error,
          `Grok returned location error: ${parsed.error}`,
          400
        );
      }
      throw new TripperError(
        parsed.error,
        `Grok returned error: ${parsed.error}`,
        400
      );
    }

    // Validate required fields with specific error messages
    if (!parsed.tripName) {
      logError("Parse Error", new Error("Missing tripName"), { content: cleanContent.substring(0, 200) });
      throw new TripperError(
        ERROR_MESSAGES.GROK_RESPONSE_INVALID,
        "Response missing tripName field",
        500
      );
    }

    if (!parsed.location || !parsed.location.name || !parsed.location.coordinates) {
      logError("Parse Error", new Error("Missing or invalid location"), { content: cleanContent.substring(0, 200) });
      throw new TripperError(
        ERROR_MESSAGES.GROK_RESPONSE_INVALID,
        "Response missing or invalid location field",
        500
      );
    }

    if (!parsed.days || !Array.isArray(parsed.days) || parsed.days.length === 0) {
      logError("Parse Error", new Error("Missing or empty days"), { content: cleanContent.substring(0, 200) });
      throw new TripperError(
        ERROR_MESSAGES.GROK_RESPONSE_INVALID,
        "Response missing or empty days array",
        500
      );
    }

    return parsed as TripPlan;
  } catch (error) {
    if (error instanceof TripperError) {
      throw error;
    }

    // Specific JSON parse errors
    if (error instanceof SyntaxError) {
      logError("JSON Parse Error", error, { content: content.substring(0, 500) });
      throw new TripperError(
        ERROR_MESSAGES.GROK_RESPONSE_INVALID,
        `Failed to parse JSON: ${error.message}`,
        500
      );
    }

    throw new TripperError(
      ERROR_MESSAGES.GROK_RESPONSE_INVALID,
      `Failed to parse Grok response: ${error instanceof Error ? error.message : "Unknown error"}`,
      500
    );
  }
}

/**
 * Generate a trip plan using Grok API
 */
export async function generateTripPlan(input: TripFormInput): Promise<TripPlan> {
  const apiKey = process.env.GROK_API_KEY;

  if (!apiKey) {
    logError("generateTripPlan", new Error("GROK_API_KEY not set"), { input });
    throw new TripperError(
      ERROR_MESSAGES.API_KEY_MISSING,
      "GROK_API_KEY environment variable is not set",
      500
    );
  }

  // Validate API key format (basic check)
  if (apiKey.length < 10 || apiKey === "your_grok_api_key_here") {
    logError("generateTripPlan", new Error("Invalid API key format"), { keyLength: apiKey.length });
    throw new TripperError(
      ERROR_MESSAGES.API_KEY_INVALID,
      "GROK_API_KEY appears to be invalid or placeholder",
      500
    );
  }

  const requestBody: GrokChatRequest = {
    model: GROK_MODEL,
    messages: [
      {
        role: "system",
        content: buildSystemPrompt(),
      },
      {
        role: "user",
        content: buildUserPrompt(input),
      },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  };

  try {
    const response = await fetch(GROK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logError("Grok API Error", new Error(errorText), {
        status: response.status,
        statusText: response.statusText,
        location: input.location,
        model: GROK_MODEL,
        apiUrl: GROK_API_URL,
      });

      // Parse error response if JSON
      let errorDetail = "";
      try {
        const errorJson = JSON.parse(errorText);
        errorDetail = errorJson.error?.message || errorJson.message || "";
      } catch {
        errorDetail = errorText;
      }

      // Check for specific error conditions
      if (response.status === 401) {
        throw new TripperError(
          ERROR_MESSAGES.API_KEY_INVALID,
          `Authentication failed: ${errorDetail}`,
          401
        );
      }

      if (response.status === 429) {
        throw new TripperError(
          ERROR_MESSAGES.GROK_RATE_LIMIT,
          `Rate limited: ${errorDetail}`,
          429
        );
      }

      // Check for model-specific errors
      if (errorDetail.toLowerCase().includes("model") &&
          (errorDetail.toLowerCase().includes("not found") ||
           errorDetail.toLowerCase().includes("unavailable"))) {
        throw new TripperError(
          ERROR_MESSAGES.GROK_MODEL_UNAVAILABLE,
          `Model error: ${errorDetail}`,
          response.status
        );
      }

      // Use status-specific error message
      throw new TripperError(
        getHttpErrorMessage(response.status),
        `Grok API returned ${response.status}: ${errorDetail}`,
        response.status
      );
    }

    const data: GrokChatResponse = await response.json();

    if (!data.choices || data.choices.length === 0) {
      logError("Grok API Empty Response", new Error("No choices returned"), { data });
      throw new TripperError(
        ERROR_MESSAGES.GROK_RESPONSE_INVALID,
        "Grok API returned empty response",
        500
      );
    }

    const content = data.choices[0].message.content;

    if (!content || content.trim() === "") {
      logError("Grok API Empty Content", new Error("Empty content"), { data });
      throw new TripperError(
        ERROR_MESSAGES.GROK_RESPONSE_INVALID,
        "Grok API returned empty content",
        500
      );
    }

    return parseGrokResponse(content);
  } catch (error) {
    if (error instanceof TripperError) {
      throw error;
    }

    if (isRateLimitError(error)) {
      throw new TripperError(
        ERROR_MESSAGES.GROK_RATE_LIMIT,
        `Rate limit error: ${error instanceof Error ? error.message : "Unknown"}`,
        429
      );
    }

    if (isNetworkError(error)) {
      throw new TripperError(
        ERROR_MESSAGES.NETWORK_ERROR,
        `Network error: ${error instanceof Error ? error.message : "Unknown"}`,
        503
      );
    }

    // Check for timeout errors
    if (error instanceof Error &&
        (error.name === "AbortError" ||
         error.message.toLowerCase().includes("timeout") ||
         error.message.toLowerCase().includes("timed out"))) {
      throw new TripperError(
        ERROR_MESSAGES.GROK_TIMEOUT,
        `Timeout error: ${error.message}`,
        408
      );
    }

    logError("generateTripPlan", error, { input });

    // For any other error, provide a more helpful message
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new TripperError(
      `We couldn't generate your trip: ${errorMessage.substring(0, 100)}`,
      `Unexpected error: ${errorMessage}`,
      500
    );
  }
}
