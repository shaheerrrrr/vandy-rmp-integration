// =============================================================================
// YES-SPECIFIC SELECTORS
// All Vanderbilt YES DOM knowledge lives here. When YES changes its markup,
// update only this file.
// =============================================================================

export const YES_CONFIG = {
  /**
   * Selector for the element that wraps all course-search results.
   * The MutationObserver is anchored here.
   * UPDATE THIS when YES changes its results container.
   */
  resultsContainer: '#searchClassSectionsResults',

  /**
   * Selector for individual instructor name elements within a result row.
   * These are the elements that will receive an RMP badge.
   * UPDATE THIS when YES changes how instructor names are rendered.
   *
   * Matches: <td class="classInstructor">Last, First M.</td>
   */
  instructorCell: 'td.classInstructor',

  /** Data attribute stamped on elements we have already handled. */
  processedAttr: 'data-rmp-done',
} as const;

/**
 * Extracts the instructor's display name from an element matched by
 * YES_CONFIG.instructorCell.
 *
 * YES may wrap the name in a child <span>, <a>, or similar — adjust here.
 * Returns null if the element contains no usable text.
 */
export function extractInstructorName(el: Element): string | null {
  // YES wraps names in whitespace-heavy text nodes; collapse all whitespace.
  const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
  return text || null;
}
