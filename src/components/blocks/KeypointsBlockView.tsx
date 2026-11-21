import type { KeypointsBlock } from '@/content';
import RichTextView from './RichTextView';
import ChapterIcon from '@/components/ChapterIcon';
import { SourceRefGroup } from '@/components/atoms';

/** keypoints 要点卡片组（section.md §4.2） */
export default function KeypointsBlockView({
  block,
  hue,
}: {
  block: KeypointsBlock;
  hue: string;
}) {
  const { layout = 'grid-2', items, sourceRefs } = block.payload;
  const gridClass =
    layout === 'grid-3'
      ? 'grid gap-4 md:grid-cols-3'
      : layout === 'list'
        ? 'flex flex-col gap-3'
        : 'grid gap-4 md:grid-cols-2';

  return (
    <div>
      <div className={gridClass}>
        {items.map((item, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-card border border-line bg-surface p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            <span
              className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
              style={{ backgroundColor: hue }}
              aria-hidden="true"
            />
            <div className="flex items-center gap-2">
              {item.icon ? (
                <ChapterIcon icon={item.icon} size={18} color={hue} />
              ) : (
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: hue }}
                  aria-hidden="true"
                />
              )}
              <h4 className="text-body font-bold text-ink">{item.title}</h4>
            </div>
            <p className="mt-2 text-body text-ink-2">
              <RichTextView content={item.description} />
            </p>
            {item.sourceRefs && <SourceRefGroup sourceRefs={item.sourceRefs} />}
          </div>
        ))}
      </div>
      {sourceRefs && <SourceRefGroup sourceRefs={sourceRefs} />}
    </div>
  );
}
