import { searchProfessor } from './rmpClient';
import { getCached, setCached } from '../shared/cache';
import { normalizeName } from '../shared/nameNormalize';
import type { MessageToSW } from '../shared/types';

const MAX_CONCURRENT = 3;
let active = 0;
const pending: Array<() => void> = [];

function drainQueue() {
  while (pending.length > 0 && active < MAX_CONCURRENT) {
    const next = pending.shift()!;
    next();
  }
}

async function lookup(rawName: string) {
  const normalized = normalizeName(rawName);
  if (!normalized) return null;

  const cacheKey = `${normalized.last}_${normalized.first}`;

  const cached = await getCached(cacheKey);
  if (cached !== undefined) return cached;

  active++;
  try {
    const result = await searchProfessor(rawName);
    await setCached(cacheKey, result);
    return result;
  } finally {
    active--;
    drainQueue();
  }
}

function enqueuedLookup(rawName: string): Promise<ReturnType<typeof lookup>> {
  return new Promise((resolve) => {
    const run = () => resolve(lookup(rawName));
    if (active < MAX_CONCURRENT) {
      run();
    } else {
      pending.push(run);
    }
  });
}

chrome.runtime.onMessage.addListener((message: MessageToSW, _sender, sendResponse) => {
  if (message.type !== 'GET_PROFESSOR') return false;

  enqueuedLookup(message.name)
    .then((result) => sendResponse({ type: 'PROFESSOR_RESULT', name: message.name, result }))
    .catch((err) =>
      sendResponse({ type: 'PROFESSOR_RESULT', name: message.name, result: null, error: String(err) }),
    );

  return true; // keep message channel open for async response
});
