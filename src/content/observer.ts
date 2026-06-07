let timer: ReturnType<typeof setTimeout> | undefined;

function debounce(fn: () => void, ms: number): () => void {
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, ms);
  };
}

/**
 * Watches the results container for DOM changes and calls `callback` on each
 * batch of changes (debounced). Also patches history APIs to catch SPA
 * route changes that don't fire a full page load.
 */
export function observeResults(
  containerSelector: string,
  callback: () => void,
  debounceMs = 400,
): MutationObserver {
  const fire = debounce(callback, debounceMs);
  const observer = new MutationObserver(fire);

  const attach = () => {
    const root = document.querySelector(containerSelector) ?? document.body;
    observer.observe(root, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attach, { once: true });
  } else {
    attach();
  }

  // Intercept SPA navigation
  const wrap = (original: typeof history.pushState) =>
    function (this: History, ...args: Parameters<typeof history.pushState>) {
      original.apply(this, args);
      fire();
    };

  history.pushState = wrap(history.pushState);
  history.replaceState = wrap(history.replaceState);
  window.addEventListener('popstate', fire);

  return observer;
}
