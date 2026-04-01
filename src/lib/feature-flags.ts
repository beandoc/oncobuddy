import { prisma } from './prisma';
import { redis } from './redis';
import { Role } from '@prisma/client';

const FLAG_CACHE_PREFIX = 'flag:';
const CACHE_TTL = 60; // 60 seconds (Section 10)

/**
 * Platform Feature Flag Engine (Technical Guidance Section 10).
 * Provides server-side gating with high-performance Redis caching.
 */
export async function isFeatureEnabled(
  flagKey: string,
  context?: { role?: Role; userId?: string }
): Promise<boolean> {
  const cacheKey = `${FLAG_CACHE_PREFIX}${flagKey}`;

  try {
    // 1. Check Redis Cache First
    const cached = await redis.get(cacheKey);
    let flag;

    if (cached) {
      flag = JSON.parse(cached);
    } else {
      // 2. Fallback to DB
      flag = await prisma.featureFlag.findUnique({
        where: { flagKey }
      });

      if (flag) {
        // 3. Populate Cache
        await redis.set(cacheKey, JSON.stringify(flag), 'EX', CACHE_TTL);
      }
    }

    if (!flag || !flag.isEnabled) return false;

    // 4. Role-based Gating
    if (context?.role && flag.enabledForRoles.length > 0) {
      if (!flag.enabledForRoles.includes(context.role)) return false;
    }

    // 5. User-specific Targeting/Beta Gating
    if (context?.userId && flag.enabledForUserIds.length > 0) {
      if (!flag.enabledForUserIds.includes(context.userId)) return false;
    }

    // 6. Percentage Rollout (Section 10)
    if (flag.enabledPercent > 0 && context?.userId) {
      // Deterministic hash of userId to check against rollout percent
      const hash = Array.from(context.userId).reduce((acc, char) => acc + char.charCodeAt(0), 0);
      if ((hash % 100) >= flag.enabledPercent) return false;
    }

    return true;
  } catch (error) {
    // Section 9: Structured Fail-safe Logging
    console.error(` [FEATURE_FLAG_FAULT] [${flagKey}] `, error);
    // Fail closed for clinical safety
    return false;
  }
}
