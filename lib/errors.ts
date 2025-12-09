/**
 * Custom error class for Tripper application
 * Separates user-facing messages from internal error details
 */
export class TripperError extends Error {
  constructor(
    public userMessage: string,
    public internalMessage: string,
    public statusCode: number = 500
  ) {
    super(internalMessage);
    this.name = "TripperError";
  }
}

/**
 * Error messages for different scenarios
 */
export const ERROR_MESSAGES = {
  // Location errors
  INVALID_LOCATION: "Please enter a valid location",
  LOCATION_TOO_VAGUE: "Please be more specific about your destination (e.g., 'Paris, France' instead of just 'Paris')",

  // API configuration errors
  API_KEY_MISSING: "Trip planning service is not configured. Please contact support.",
  API_KEY_INVALID: "Trip planning service authentication failed. Please contact support.",

  // Grok API errors
  GROK_API_FAILURE: "We couldn't generate your trip. Please try again.",
  GROK_RATE_LIMIT: "We're experiencing high demand. Please try again in a moment.",
  GROK_TIMEOUT: "The request took too long. Please try again with a shorter trip duration.",
  GROK_RESPONSE_INVALID: "We received an unexpected response. Please try again.",
  GROK_MODEL_UNAVAILABLE: "The AI service is temporarily unavailable. Please try again later.",

  // HTTP status-specific errors
  HTTP_400: "Invalid request. Please check your trip details and try again.",
  HTTP_401: "Authentication failed. Please contact support.",
  HTTP_403: "Access denied. Please contact support.",
  HTTP_404: "AI model not found. The service may be temporarily unavailable or misconfigured.",
  HTTP_500: "The AI service encountered an error. Please try again.",
  HTTP_502: "The AI service is temporarily unavailable. Please try again.",
  HTTP_503: "The AI service is under maintenance. Please try again later.",

  // Storage errors
  KV_STORAGE_FAILURE: "Couldn't create share link. Please try again.",
  INVALID_SHARE_ID: "This trip link has expired or doesn't exist.",

  // Network errors
  NETWORK_ERROR: "Connection error. Please check your internet and try again.",
  NETWORK_TIMEOUT: "Connection timed out. Please check your internet and try again.",

  // Generic errors
  GENERIC_ERROR: "Something went wrong. Please try again.",
  VALIDATION_ERROR: "Please fill in all required fields.",
} as const;

/**
 * Get user-friendly error message based on HTTP status code
 */
export function getHttpErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return ERROR_MESSAGES.HTTP_400;
    case 401:
      return ERROR_MESSAGES.HTTP_401;
    case 403:
      return ERROR_MESSAGES.HTTP_403;
    case 404:
      return ERROR_MESSAGES.HTTP_404;
    case 429:
      return ERROR_MESSAGES.GROK_RATE_LIMIT;
    case 500:
      return ERROR_MESSAGES.HTTP_500;
    case 502:
      return ERROR_MESSAGES.HTTP_502;
    case 503:
      return ERROR_MESSAGES.HTTP_503;
    default:
      return ERROR_MESSAGES.GROK_API_FAILURE;
  }
}

/**
 * Log error with context (server-side only)
 */
export function logError(
  context: string,
  error: unknown,
  additionalData?: Record<string, unknown>
): void {
  const timestamp = new Date().toISOString();
  const errorDetails = {
    context,
    timestamp,
    error:
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : error,
    ...additionalData,
  };

  console.error(`[Tripper Error] ${context}:`, JSON.stringify(errorDetails, null, 2));
}

/**
 * Create a standardized error response for API routes
 */
export function createErrorResponse(
  error: unknown,
  defaultMessage: string = ERROR_MESSAGES.GENERIC_ERROR
): { error: string; status: number } {
  if (error instanceof TripperError) {
    return {
      error: error.userMessage,
      status: error.statusCode,
    };
  }

  return {
    error: defaultMessage,
    status: 500,
  };
}

/**
 * Check if an error is a rate limit error
 */
export function isRateLimitError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.toLowerCase().includes("rate limit") ||
      error.message.includes("429")
    );
  }
  return false;
}

/**
 * Check if an error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.toLowerCase().includes("network") ||
      error.message.toLowerCase().includes("fetch") ||
      error.message.toLowerCase().includes("econnrefused")
    );
  }
  return false;
}
