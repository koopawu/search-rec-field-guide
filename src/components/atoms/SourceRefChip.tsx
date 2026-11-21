import type { SourceRef } from '@/content';
import { ExternalLink } from 'lucide-react';

/** SourceRefChip：来源引用 chip（`[D2·核心概念框架§1]` 小灰签，
 *  hover 显示外部链接 tooltip，可点击跳转外链） */
export default function SourceRefChip({ sourceRef }: { sourceRef: SourceRef }) {
  const label = `[${sourceRef.briefId}${sourceRef.briefSection ? `·${sourceRef.briefSection}` : ''}]`;
  const chip = (
    <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium tracking-wide text-ink-3 transition-colors hover:text-ink-2">
      {label}
      {sourceRef.externalUrl && <ExternalLink size={10} strokeWidth={1.5} aria-hidden="true" />}
    </span>
  );
  if (sourceRef.externalUrl) {
    return (
      <a
        href={sourceRef.externalUrl}
        target="_blank"
        rel="noreferrer noopener"
        title={sourceRef.externalTitle ?? sourceRef.externalUrl}
        className="inline-flex"
      >
        {chip}
      </a>
    );
  }
  return <span title={sourceRef.externalTitle}>{chip}</span>;
}

/** 一组引用 chip（段末右对齐） */
export function SourceRefGroup({ sourceRefs }: { sourceRefs: SourceRef[] }) {
  if (!sourceRefs.length) return null;
  return (
    <span className="mt-2 flex flex-wrap items-center justify-end gap-1.5">
      {sourceRefs.map((ref, i) => (
        <SourceRefChip key={`${ref.briefId}-${i}`} sourceRef={ref} />
      ))}
    </span>
  );
}
