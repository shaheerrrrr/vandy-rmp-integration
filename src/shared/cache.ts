import type { CachedEntry, RMPResult } from './types';

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const KEY_PREFIX = 'rmp_v1_';

export async function getCached(cacheKey: string): Promise<RMPResult | null | undefined> {
  const storageKey = KEY_PREFIX + cacheKey;
  const data = await chrome.storage.local.get(storageKey);
  const entry = data[storageKey] as CachedEntry | undefined;

  if (!entry) return undefined; // cache miss

  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    void chrome.storage.local.remove(storageKey);
    return undefined; // expired
  }

  return entry.result; // null = confirmed no RMP profile
}

export async function setCached(cacheKey: string, result: RMPResult | null): Promise<void> {
  const storageKey = KEY_PREFIX + cacheKey;
  const entry: CachedEntry = { result, timestamp: Date.now() };
  await chrome.storage.local.set({ [storageKey]: entry });
}
