// ============================================================
// BlockRenderer：按 block.type 分发到 9 种渲染组件
// 未知 type 降级为 paragraph（site_ia.md §3.3-6）
// 块级 heading 统一渲染为 H3（前导篇章色 8px 方块），id 供右栏目录锚点
// ============================================================

import type { ChapterSlug, ContentBlock, ParagraphBlock as ParagraphBlockType } from '@/content';
import { CHAPTER_THEMES, getBlockHeading } from '@/content';
import ParagraphBlockView from './ParagraphBlockView';
import KeypointsBlockView from './KeypointsBlockView';
import TableBlockView from './TableBlockView';
import StepsBlockView from './StepsBlockView';
import FormulaBlockView from './FormulaBlockView';
import DiagramBlockView from './DiagramBlockView';
import CaseBlockView from './CaseBlockView';
import QuoteBlockView from './QuoteBlockView';
import ListBlockView from './ListBlockView';

export interface BlockRendererProps {
  block: ContentBlock;
  /** 篇章 slug：决定 hue/tint 强调色 */
  chapterSlug: ChapterSlug;
  sectionId?: string;
}

export default function BlockRenderer({ block, chapterSlug, sectionId }: BlockRendererProps) {
  const theme = CHAPTER_THEMES[chapterSlug];
  const hue = theme.hue;
  const tint = theme.tint;
  const heading = getBlockHeading(block);

  let body: React.ReactNode;
  switch (block.type) {
    case 'paragraph':
      body = <ParagraphBlockView block={block} />;
      break;
    case 'keypoints':
      body = <KeypointsBlockView block={block} hue={hue} />;
      break;
    case 'table':
      body = <TableBlockView block={block} hue={hue} tint={tint} />;
      break;
    case 'steps':
      body = <StepsBlockView block={block} hue={hue} />;
      break;
    case 'formula':
      body = <FormulaBlockView block={block} hue={hue} />;
      break;
    case 'diagram':
      body = <DiagramBlockView block={block} hue={hue} tint={tint} />;
      break;
    case 'case':
      body = <CaseBlockView block={block} hue={hue} tint={tint} />;
      break;
    case 'quote':
      body = <QuoteBlockView block={block} hue={hue} />;
      break;
    case 'list':
      body = <ListBlockView block={block} hue={hue} sectionId={sectionId} />;
      break;
    default: {
      // 未知 block 类型降级为 paragraph 渲染
      const fallback = block as ParagraphBlockType;
      body = <ParagraphBlockView block={fallback} />;
    }
  }

  return (
    <section className="scroll-mt-24" data-block-id={block.blockId}>
      {heading && (
        <h3 id={block.blockId} className="mb-4 mt-2 flex items-center gap-2.5 text-h3 font-serif text-ink">
          <span
            className="inline-block h-2 w-2 shrink-0"
            style={{ backgroundColor: hue }}
            aria-hidden="true"
          />
          {heading}
        </h3>
      )}
      {body}
    </section>
  );
}
