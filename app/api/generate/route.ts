import { NextRequest, NextResponse } from "next/server";
import { generateTripPlan } from "@/lib/grok";
import { TripFormInput } from "@/lib/types";
import { TripperError, logError, createErrorResponse, ERROR_MESSAGES } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate required fields
    const { location, tripType, startDate, endDate, budget, preferences } = body as TripFormInput;

    if (!location || !tripType || !startDate || !endDate || !budget) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.VALIDATION_ERROR },
        { status: 400 }
      );
    }

    // Validate trip type
    if (!["date", "holiday", "friends"].includes(tripType)) {
      return NextResponse.json(
        { success: false, error: "Invalid trip type" },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
      return NextResponse.json(
        { success: false, error: "Invalid date range" },
        { status: 400 }
      );
    }

    // Validate budget
    if (typeof budget !== "number" || budget <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid budget" },
        { status: 400 }
      );
    }

    // Generate trip plan using Grok
    const formInput: TripFormInput = {
      location,
      tripType,
      startDate,
      endDate,
      budget,
      preferences,
    };

    const plan = await generateTripPlan(formInput);

    return NextResponse.json({
      success: true,
      plan,
    });
  } catch (error) {
    // Log the full error server-side
    logError("POST /api/generate", error, {
      url: request.url,
    });

    // Return sanitized error to client
    const { error: errorMessage, status } = createErrorResponse(error);

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status }
    );
  }
}
