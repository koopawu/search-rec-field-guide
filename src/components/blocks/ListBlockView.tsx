import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { ListBlock } from '@/content';
import RichTextView from './RichTextView';
import { SourceRefGroup } from '@/components/atoms';

/** list 清单（section.md §4.9）：normal / ordered / checklist / myths */
export default function ListBlockView({
  block,
  hue,
  sectionId,
}: {
  block: ListBlock;
  hue: string;
  /** checklist 的 localStorage 记忆需要小节 id 做 key */
  sectionId?: string;
}) {
  const { ordered = false, items, variant = 'normal', sourceRefs } = block.payload;

  if (variant === 'checklist') {
    return <Checklist block={block} hue={hue} sectionId={sectionId} />;
  }

  if (variant === 'myths') {
    return (
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex gap-3 rounded-card border border-line bg-surface p-4 shadow-card">
            <span
              className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-danger text-[#FFFDF9]"
              aria-hidden="true"
            >
              <X size={12} strokeWidth={2.5} />
            </span>
            <p className="text-body text-ink-2">
              <RichTextView content={item} />
            </p>
          </div>
        ))}
        {sourceRefs && <SourceRefGroup sourceRefs={sourceRefs} />}
      </div>
    );
  }

  const Tag = ordered ? 'ol' : 'ul';
  return (
    <div>
      <Tag className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-body-l text-ink">
            {ordered ? (
              <span className="shrink-0 font-serif font-bold" style={{ color: hue }}>
                {i + 1}.
              </span>
            ) : (
              <span
                className="mt-[0.85em] h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: hue }}
                aria-hidden="true"
              />
            )}
            <span>
              <RichTextView content={item} />
            </span>
          </li>
        ))}
      </Tag>
      {sourceRefs && <SourceRefGroup sourceRefs={sourceRefs} />}
    </div>
  );
}

/** checklist：可勾选清单，localStorage 记忆（纯自测用途） */
function Checklist({
  block,
  hue,
  sectionId,
}: {
  block: ListBlock;
  hue: string;
  sectionId?: string;
}) {
  const storageKey = `srkb:checklist:${sectionId ?? 'global'}:${block.blockId}`;
  const [checked, setChecked] = useState<boolean[]>(() => block.payload.items.map(() => false));

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) setChecked(JSON.parse(saved));
    } catch {
      /* localStorage 不可用时静默降级 */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = prev.map((v, idx) => (idx === i ? !v : v));
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <div className="rounded-card border border-line bg-surface p-5 shadow-card">
      <ul className="space-y-2.5">
        {block.payload.items.map((item, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => toggle(i)}
              className="flex w-full items-start gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-surface-2"
              aria-pressed={checked[i]}
            >
              <span
                className="mt-1 inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border-[1.5px] text-[#FFFDF9]"
                style={{
                  borderColor: hue,
                  backgroundColor: checked[i] ? hue : 'transparent',
                }}
                aria-hidden="true"
              >
                {checked[i] && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4 L3.5 6.5 L9 1" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                )}
              </span>
              <span className={`text-body ${checked[i] ? 'text-ink-3 line-through' : 'text-ink'}`}>
                <RichTextView content={item} />
              </span>
            </button>
          </li>
        ))}
      </ul>
      {block.payload.sourceRefs && <SourceRefGroup sourceRefs={block.payload.sourceRefs} />}
    </div>
  );
}
