import 'server-only';

/**
 * Simple in-memory rate limiting for production.
 * 
 * In production deployments, replace with Redis or database-backed
 * rate limiting for distributed systems. This implementation provides
 * basic protection against abuse for single-instance deployments.
 * 
 * Attributes:
 *   requests: Map storing request counts and reset times per identifier
 *   windowMs: Time window in milliseconds for rate limit enforcement
 */

const requests = new Map<string, { count: number; resetTime: number }>();

/**
 * Checks if an identifier has exceeded the rate limit.
 * 
 * Args:
 *   identifier: Unique string identifying the user (IP, email, etc.)
 *   limit: Maximum requests allowed in the time window
 *   windowMs: Time window duration in milliseconds
 * 
 * Returns:
 *   boolean: True if rate limited, False if request allowed
 * 
 * Edge Cases:
 *   - Expired windows reset automatically
 *   - New identifiers start fresh
 *   - Memory usage grows with unique identifiers
 */
export function isRateLimited(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000 // 1 minute
): boolean {
  const now = Date.now();
  const key = identifier;
  const existing = requests.get(key);

  if (!existing || now > existing.resetTime) {
    // New window or expired
    requests.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (existing.count >= limit) {
    return true; // Rate limited
  }

  existing.count++;
  return false;
}

/**
 * Generates HTTP headers for rate limit responses.
 * 
 * Args:
 *   identifier: Unique string identifying the user
 *   limit: Maximum requests allowed in the time window
 *   windowMs: Time window duration in milliseconds
 * 
 * Returns:
 *   Record<string, string>: Headers for rate limit status
 * 
 * Headers:
 *   X-RateLimit-Limit: Maximum requests allowed
 *   X-RateLimit-Remaining: Requests left in current window
 *   X-RateLimit-Reset: When the window resets (UTC string)
 */
export function getRateLimitHeaders(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): Record<string, string> {
  const now = Date.now();
  const key = identifier;
  const existing = requests.get(key);

  const remaining = existing ? Math.max(0, limit - existing.count) : limit;
  const resetTime = existing ? existing.resetTime : now + windowMs;

  return {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': new Date(resetTime).toUTCString()
  };
}
