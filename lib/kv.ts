import { SharedTrip, TripPlan, TripFormInput } from "./types";
import { TripperError, ERROR_MESSAGES, logError } from "./errors";
import { generateId } from "./utils";

/**
 * KV Storage abstraction
 * Currently uses in-memory storage (localStorage on client, Map on server)
 * Ready to swap to Vercel KV when configured
 */

// In-memory storage for server-side (development/fallback)
const memoryStore = new Map<string, string>();

// Expiration time: 30 days in milliseconds
const EXPIRATION_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Check if Vercel KV is configured
 */
function isVercelKVConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

/**
 * Store a shared trip
 */
export async function storeSharedTrip(
  plan: TripPlan,
  formInput: TripFormInput
): Promise<string> {
  const id = generateId();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + EXPIRATION_MS);

  const sharedTrip: SharedTrip = {
    id,
    plan,
    formInput,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  try {
    if (isVercelKVConfigured()) {
      // Use Vercel KV when available
      const { kv } = await import("@vercel/kv");
      await kv.set(`trip:${id}`, JSON.stringify(sharedTrip), {
        ex: Math.floor(EXPIRATION_MS / 1000), // seconds
      });
    } else {
      // Fallback to in-memory storage
      memoryStore.set(`trip:${id}`, JSON.stringify(sharedTrip));
      console.log(`[KV Mock] Stored trip ${id} in memory`);
    }

    return id;
  } catch (error) {
    logError("storeSharedTrip", error, { id });
    throw new TripperError(
      ERROR_MESSAGES.KV_STORAGE_FAILURE,
      `Failed to store trip: ${error instanceof Error ? error.message : "Unknown"}`,
      500
    );
  }
}

/**
 * Retrieve a shared trip by ID
 */
export async function getSharedTrip(id: string): Promise<SharedTrip | null> {
  try {
    let data: string | null = null;

    if (isVercelKVConfigured()) {
      const { kv } = await import("@vercel/kv");
      data = await kv.get<string>(`trip:${id}`);
    } else {
      data = memoryStore.get(`trip:${id}`) ?? null;
    }

    if (!data) {
      return null;
    }

    const sharedTrip: SharedTrip = typeof data === "string" ? JSON.parse(data) : data;

    // Check if expired
    if (new Date(sharedTrip.expiresAt) < new Date()) {
      // Clean up expired entry
      await deleteSharedTrip(id);
      return null;
    }

    return sharedTrip;
  } catch (error) {
    logError("getSharedTrip", error, { id });
    return null;
  }
}

/**
 * Delete a shared trip by ID
 */
export async function deleteSharedTrip(id: string): Promise<boolean> {
  try {
    if (isVercelKVConfigured()) {
      const { kv } = await import("@vercel/kv");
      await kv.del(`trip:${id}`);
    } else {
      memoryStore.delete(`trip:${id}`);
    }
    return true;
  } catch (error) {
    logError("deleteSharedTrip", error, { id });
    return false;
  }
}

/**
 * Check if a trip exists
 */
export async function tripExists(id: string): Promise<boolean> {
  try {
    if (isVercelKVConfigured()) {
      const { kv } = await import("@vercel/kv");
      return (await kv.exists(`trip:${id}`)) > 0;
    } else {
      return memoryStore.has(`trip:${id}`);
    }
  } catch (error) {
    logError("tripExists", error, { id });
    return false;
  }
}

/**
 * Get the share URL for a trip
 */
export function getShareUrl(id: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return `${baseUrl}/trip/${id}`;
}
