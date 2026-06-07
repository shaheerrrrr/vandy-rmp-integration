import { injectStyles, createBadge, createLoadingBadge } from './badge';
import { observeResults } from './observer';
import { YES_CONFIG, extractInstructorName } from './yes-selectors';
import { isPlaceholder } from '../shared/nameNormalize';
import type { MessageToSW, RMPResult } from '../shared/types';

injectStyles();

function getProfessor(name: string): Promise<RMPResult | null> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'GET_PROFESSOR', name } satisfies MessageToSW, (response) => {
      if (chrome.runtime.lastError) {
        resolve(null);
        return;
      }
      resolve((response as { result: RMPResult | null } | undefined)?.result ?? null);
    });
  });
}

async function processElement(el: Element): Promise<void> {
  const name = extractInstructorName(el);
  if (!name || isPlaceholder(name)) return;

  el.setAttribute(YES_CONFIG.processedAttr, 'true');

  const loading = createLoadingBadge();
  el.appendChild(loading);

  const result = await getProfessor(name);
  loading.replaceWith(createBadge(result));
}

function processAll(): void {
  const unprocessed = document.querySelectorAll(
    `${YES_CONFIG.instructorCell}:not([${YES_CONFIG.processedAttr}])`,
  );
  unprocessed.forEach((el) => void processElement(el));
}

processAll();
observeResults(YES_CONFIG.resultsContainer, processAll);
