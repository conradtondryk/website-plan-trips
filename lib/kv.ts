import { Redis } from "@upstash/redis";
import { SharedTrip, TripPlan, TripFormInput } from "./types";
import { TripperError, ERROR_MESSAGES, logError } from "./errors";
import { generateId } from "./utils";

/**
 * KV Storage using Upstash Redis
 */

// Expiration time: 30 days in seconds
const EXPIRATION_SECONDS = 30 * 24 * 60 * 60;

// Lazy-initialized Redis client
let redisClient: Redis | null = null;

/**
 * Get or create Redis client
 */
function getRedis(): Redis | null {
  // Return cached client if exists
  if (redisClient) {
    return redisClient;
  }

  // Try different env var combinations
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.log("[KV] Redis not configured - missing URL or token");
    return null;
  }

  try {
    redisClient = new Redis({
      url,
      token,
    });
    console.log("[KV] Redis client created successfully");
    return redisClient;
  } catch (error) {
    console.error("[KV] Failed to create Redis client:", error);
    return null;
  }
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
  const expiresAt = new Date(now.getTime() + EXPIRATION_SECONDS * 1000);

  const sharedTrip: SharedTrip = {
    id,
    plan,
    formInput,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  const redis = getRedis();

  if (!redis) {
    throw new TripperError(
      "Share feature is not available. Please try again later.",
      "Redis not configured",
      503
    );
  }

  try {
    const key = `trip:${id}`;
    const value = JSON.stringify(sharedTrip);

    await redis.set(key, value, { ex: EXPIRATION_SECONDS });
    console.log(`[KV] Stored trip ${id}`);

    return id;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[KV] Failed to store trip ${id}:`, errorMsg);
    logError("storeSharedTrip", error, { id });
    throw new TripperError(
      ERROR_MESSAGES.KV_STORAGE_FAILURE,
      `Failed to store trip: ${errorMsg}`,
      500
    );
  }
}

/**
 * Retrieve a shared trip by ID
 */
export async function getSharedTrip(id: string): Promise<SharedTrip | null> {
  const redis = getRedis();

  if (!redis) {
    return null;
  }

  try {
    const data = await redis.get<string>(`trip:${id}`);

    if (!data) {
      return null;
    }

    const sharedTrip: SharedTrip = typeof data === "string" ? JSON.parse(data) : data;

    // Check if expired
    if (new Date(sharedTrip.expiresAt) < new Date()) {
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
  const redis = getRedis();

  if (!redis) {
    return false;
  }

  try {
    await redis.del(`trip:${id}`);
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
  const redis = getRedis();

  if (!redis) {
    return false;
  }

  try {
    return (await redis.exists(`trip:${id}`)) > 0;
  } catch (error) {
    logError("tripExists", error, { id });
    return false;
  }
}

/**
 * Get the share URL for a trip
 */
export function getShareUrl(id: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
  return `${baseUrl}/trip/${id}`;
}
