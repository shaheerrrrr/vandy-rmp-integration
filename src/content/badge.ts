import type { RMPResult } from '../shared/types';

const STYLES = `
.rmp-badge {
  display: inline-flex;
  align-items: center;
  margin-left: 6px;
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.5;
  white-space: nowrap;
  vertical-align: middle;
  text-decoration: none !important;
  cursor: pointer;
  position: relative;
  border: 1px solid transparent;
  user-select: none;
}
.rmp-high  { background:#d1fae5; color:#065f46; border-color:#6ee7b7; }
.rmp-mid   { background:#fef3c7; color:#92400e; border-color:#fcd34d; }
.rmp-low   { background:#fee2e2; color:#991b1b; border-color:#fca5a5; }
.rmp-none  { background:#f1f5f9; color:#64748b; border-color:#cbd5e1; }
.rmp-uncertain { border-style: dashed !important; }

.rmp-tip {
  display: none;
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  min-width: 220px;
  background: #1e293b;
  color: #f1f5f9;
  border-radius: 6px;
  padding: 9px 12px;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.7;
  white-space: pre;
  z-index: 2147483647;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0,0,0,.35);
}
.rmp-tip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 12px;
  border: 6px solid transparent;
  border-top-color: #1e293b;
}
.rmp-badge:hover .rmp-tip { display: block; }
`;

let injected = false;

export function injectStyles(): void {
  if (injected) return;
  const style = document.createElement('style');
  style.id = 'rmp-styles';
  style.textContent = STYLES;
  (document.head ?? document.documentElement).appendChild(style);
  injected = true;
}

function ratingColorClass(rating: number, numRatings: number): string {
  if (numRatings === 0) return 'rmp-none';
  if (rating >= 4.0) return 'rmp-high';
  if (rating >= 3.0) return 'rmp-mid';
  return 'rmp-low';
}

function tooltipText(result: RMPResult): string {
  const lines: string[] = [
    `${result.firstName} ${result.lastName}  —  ${result.department}`,
    `Rating:      ${result.avgRating.toFixed(1)} / 5  (${result.numRatings} ratings)`,
    `Difficulty:  ${result.avgDifficulty.toFixed(1)} / 5`,
  ];
  if (result.wouldTakeAgainPercent >= 0) {
    lines.push(`Again:       ${Math.round(result.wouldTakeAgainPercent)}%`);
  }
  if (result.confidence === 'low') {
    lines.push('');
    lines.push('⚠  Possible name mismatch — verify on RMP');
  }
  return lines.join('\n');
}

function makeTip(text: string): HTMLSpanElement {
  const tip = document.createElement('span');
  tip.className = 'rmp-tip';
  tip.textContent = text;
  return tip;
}

export function createBadge(result: RMPResult | null): HTMLElement {
  const badge = document.createElement('a');
  badge.className = 'rmp-badge';
  badge.target = '_blank';
  badge.rel = 'noopener noreferrer';

  if (!result) {
    badge.classList.add('rmp-none');
    badge.textContent = 'No RMP';
    badge.removeAttribute('href');
    badge.appendChild(makeTip('No Rate My Professors profile found'));
    return badge;
  }

  badge.href = result.profileUrl;
  badge.classList.add(ratingColorClass(result.avgRating, result.numRatings));
  if (result.confidence === 'low') badge.classList.add('rmp-uncertain');

  if (result.numRatings === 0) {
    badge.textContent = 'RMP (0)';
    badge.appendChild(makeTip(`${result.firstName} ${result.lastName} — no ratings yet\nView profile on RMP`));
    return badge;
  }

  badge.textContent = `★ ${result.avgRating.toFixed(1)}`;
  badge.appendChild(makeTip(tooltipText(result)));
  return badge;
}

export function createLoadingBadge(): HTMLSpanElement {
  const el = document.createElement('span');
  el.className = 'rmp-badge rmp-none';
  el.textContent = '…';
  return el;
}
