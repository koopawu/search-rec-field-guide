import type { CaseBlock } from '@/content';
import RichTextView from './RichTextView';
import { SourceRefGroup } from '@/components/atoms';

/** case 大厂案例卡（section.md §4.7） */
export default function CaseBlockView({
  block,
  hue,
  tint,
}: {
  block: CaseBlock;
  hue: string;
  tint: string;
}) {
  const { company, scenario, background, approach, results, lesson, sourceRefs } = block.payload;
  return (
    <div
      className="overflow-hidden rounded-card border border-line bg-surface shadow-card"
      style={{ borderLeft: `4px solid ${hue}` }}
    >
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-full font-serif text-body font-bold text-[#FFFDF9]"
            style={{ backgroundColor: hue }}
            aria-hidden="true"
          >
            {company.slice(0, 1)}
          </span>
          <h4 className="text-h3 font-serif text-ink">{company}</h4>
          <span
            className="rounded-full px-2.5 py-1 text-label"
            style={{ backgroundColor: tint, color: hue }}
          >
            {scenario}
          </span>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-label text-ink-3">背景</p>
            <p className="mt-1.5 text-body text-ink-2">
              <RichTextView content={background} />
            </p>
          </div>
          <div>
            <p className="text-label text-ink-3">做法</p>
            <p className="mt-1.5 text-body text-ink">
              <RichTextView content={approach} />
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {results.map((r, i) => (
            <div key={i} className="rounded-lg bg-surface-2 px-4 py-2.5">
              <p className="font-mono text-[15px] font-medium" style={{ color: hue }}>
                {r.value}
              </p>
              <p className="mt-0.5 text-[11px] text-ink-3">{r.metric}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg py-3 pl-4 pr-5" style={{ backgroundColor: 'var(--mark)' }}>
          <p className="text-label text-ink-2">给策略 PM 的启示</p>
          <p className="mt-1 text-body text-ink">{lesson}</p>
        </div>

        <SourceRefGroup sourceRefs={sourceRefs} />
      </div>
    </div>
  );
}
