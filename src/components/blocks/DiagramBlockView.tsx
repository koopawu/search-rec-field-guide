import type { DiagramBlock } from '@/content';
import { DiagramFigure } from '@/components/diagrams/DiagramRegistry';

/** diagram 图示（section.md §4.6）：surface 卡 + DiagramRegistry 查表渲染 + 图题 */
export default function DiagramBlockView({
  block,
  hue,
  tint,
}: {
  block: DiagramBlock;
  hue: string;
  tint: string;
}) {
  const { diagramId, caption, altText } = block.payload;
  return (
    <div className="rounded-figure border border-line bg-surface p-6 shadow-card">
      <DiagramFigure diagramId={diagramId} caption={caption} altText={altText} hue={hue} tint={tint} />
    </div>
  );
}
