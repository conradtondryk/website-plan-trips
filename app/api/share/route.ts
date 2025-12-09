import { NextRequest, NextResponse } from "next/server";
import { storeSharedTrip, getSharedTrip, getShareUrl } from "@/lib/kv";
import { TripPlan, TripFormInput } from "@/lib/types";
import { logError, createErrorResponse, ERROR_MESSAGES } from "@/lib/errors";

// POST - Create a new shared trip
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, formInput } = body as { plan: TripPlan; formInput: TripFormInput };

    // Validate required fields
    if (!plan || !formInput) {
      return NextResponse.json(
        { success: false, error: "Missing plan or form input" },
        { status: 400 }
      );
    }

    // Store the shared trip
    const shareId = await storeSharedTrip(plan, formInput);
    const shareUrl = getShareUrl(shareId);

    return NextResponse.json({
      success: true,
      shareId,
      shareUrl,
    });
  } catch (error) {
    logError("POST /api/share", error);
    const { error: errorMessage, status } = createErrorResponse(
      error,
      ERROR_MESSAGES.KV_STORAGE_FAILURE
    );

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status }
    );
  }
}

// GET - Retrieve a shared trip by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing trip ID" },
        { status: 400 }
      );
    }

    const sharedTrip = await getSharedTrip(id);

    if (!sharedTrip) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.INVALID_SHARE_ID },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      trip: sharedTrip,
    });
  } catch (error) {
    logError("GET /api/share", error);
    const { error: errorMessage, status } = createErrorResponse(error);

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status }
    );
  }
}
