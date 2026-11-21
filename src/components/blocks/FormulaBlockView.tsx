import type { FormulaBlock } from '@/content';
import RichTextView from './RichTextView';
import { SourceRefGroup } from '@/components/atoms';

/** formula 公式示意（section.md §4.5）：纯文本表达式 + 逐项直觉解释 */
export default function FormulaBlockView({ block, hue }: { block: FormulaBlock; hue: string }) {
  const { name, expression, symbolNotes, intuition, sourceRefs } = block.payload;
  return (
    <div className="rounded-card border border-line bg-surface p-6 shadow-card">
      <h4 className="flex items-center gap-2 text-h3 font-serif text-ink">
        <span className="font-mono text-[15px] italic" style={{ color: hue }} aria-hidden="true">
          ƒx
        </span>
        {name}
      </h4>
      <div className="mt-4 overflow-x-auto rounded-lg bg-code-bg px-5 py-4">
        <code className="whitespace-nowrap font-mono text-[15px] text-ink">{expression}</code>
      </div>
      <dl className="mt-4 space-y-2">
        {symbolNotes.map((note) => (
          <div key={note.symbol} className="flex gap-3 text-body">
            <dt className="shrink-0 font-mono" style={{ color: hue }}>
              {note.symbol}
            </dt>
            <dd className="text-ink-2">{note.meaning}</dd>
          </div>
        ))}
      </dl>
      <div
        className="mt-4 rounded-lg bg-surface-2 py-4 pl-4 pr-5"
        style={{ borderLeft: '3px solid var(--line-strong)' }}
      >
        <p className="text-label text-ink-3">💡 直觉</p>
        <p className="mt-1.5 text-body text-ink-2">
          <RichTextView content={intuition} />
        </p>
      </div>
      {sourceRefs && <SourceRefGroup sourceRefs={sourceRefs} />}
    </div>
  );
}
