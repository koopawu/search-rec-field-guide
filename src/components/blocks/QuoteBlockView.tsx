import type { QuoteBlock } from '@/content';
import { SourceRefGroup } from '@/components/atoms';

/** quote 金句/原则（section.md §4.8）：居中大引用，超大悬挂引号 */
export default function QuoteBlockView({ block, hue }: { block: QuoteBlock; hue: string }) {
  const { text, attribution, variant = 'principle', sourceRefs } = block.payload;
  const barColor =
    variant === 'warning' ? '#A94438' : variant === 'insight' ? '#4E7A72' : hue;
  return (
    <blockquote
      className="relative rounded-card px-12 py-8"
      style={{
        backgroundColor: variant === 'warning' ? '#FAEEE8' : 'transparent',
        borderLeft: `4px solid ${barColor}`,
      }}
    >
      <span
        className="pointer-events-none absolute -top-4 left-4 font-serif text-[96px] leading-none"
        style={{ color: barColor, opacity: 0.2 }}
        aria-hidden="true"
      >
        “
      </span>
      <p className="relative text-center font-serif text-[22px] font-semibold leading-[1.6] text-ink">
        {text}
      </p>
      {attribution && (
        <footer className="mt-3 text-right text-small text-ink-3">—— {attribution}</footer>
      )}
      {sourceRefs && <SourceRefGroup sourceRefs={sourceRefs} />}
    </blockquote>
  );
}
