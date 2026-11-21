// ============================================================
// 命中词高亮：把 text 中命中 query（含 token 与 bigram）的片段
// 包裹为 <mark>（--mark 马克笔底色，design.md §6 选中态同款）
// ============================================================

import type { ReactNode } from 'react';
import { parseQuery } from './index';

interface Range {
  start: number;
  end: number;
}

/** 计算 text 内所有命中区间（大小写不敏感），合并重叠/相邻区间 */
export function hitRanges(text: string, query: string): Range[] {
  const { full, grams } = parseQuery(query);
  if (!full) return [];
  const terms = [...new Set([full, ...grams])]
    .filter((t) => t.length > 0)
    // 长词优先，避免 bigram 抢先截断完整命中
    .sort((a, b) => b.length - a.length);
  const lower = text.toLowerCase();
  const ranges: Range[] = [];
  for (const term of terms) {
    let idx = lower.indexOf(term);
    while (idx !== -1) {
      ranges.push({ start: idx, end: idx + term.length });
      idx = lower.indexOf(term, idx + term.length);
    }
  }
  if (ranges.length === 0) return [];
  ranges.sort((a, b) => a.start - b.start || b.end - a.end);
  const merged: Range[] = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r.start <= last.end) {
      last.end = Math.max(last.end, r.end);
    } else {
      merged.push({ ...r });
    }
  }
  return merged;
}

/** 渲染高亮片段；无命中时原样返回字符串 */
export function highlightText(text: string, query: string): ReactNode {
  const ranges = hitRanges(text, query);
  if (ranges.length === 0) return text;
  const nodes: ReactNode[] = [];
  let cursor = 0;
  ranges.forEach((r, i) => {
    if (r.start > cursor) nodes.push(text.slice(cursor, r.start));
    nodes.push(
      <mark key={i} className="rounded-[2px] bg-mark px-[1px] text-inherit">
        {text.slice(r.start, r.end)}
      </mark>,
    );
    cursor = r.end;
  });
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}
