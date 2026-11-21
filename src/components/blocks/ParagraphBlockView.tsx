import type { ParagraphBlock } from '@/content';
import RichTextView from './RichTextView';
import { SourceRefGroup } from '@/components/atoms';

/** paragraph 段落（section.md §4.1）：normal / lead / note / warning */
export default function ParagraphBlockView({ block }: { block: ParagraphBlock }) {
  const { variant = 'normal', content, sourceRefs } = block.payload;

  if (variant === 'note' || variant === 'warning') {
    const isWarning = variant === 'warning';
    return (
      <div
        className="rounded-lg py-5 pl-5 pr-6"
        style={{
          backgroundColor: isWarning ? '#FBF3E4' : 'var(--surface-2)',
          borderLeft: `3px solid ${isWarning ? '#B98A2F' : 'var(--line-strong)'}`,
        }}
      >
        <p className="text-label" style={{ color: isWarning ? '#B98A2F' : 'var(--ink-3)' }}>
          {isWarning ? '⚠ 常见误区' : '注'}
        </p>
        <p className="mt-2 text-body text-ink-2">
          <RichTextView content={content} />
        </p>
        {sourceRefs && <SourceRefGroup sourceRefs={sourceRefs} />}
      </div>
    );
  }

  if (variant === 'lead') {
    // 导语：上下 1px line 夹住，像报纸导语
    return (
      <div className="border-y border-line py-6">
        <p className="text-body-l text-ink">
          <RichTextView content={content} />
        </p>
        {sourceRefs && <SourceRefGroup sourceRefs={sourceRefs} />}
      </div>
    );
  }

  return (
    <div>
      <p className="text-body-l text-ink">
        <RichTextView content={content} />
      </p>
      {sourceRefs && <SourceRefGroup sourceRefs={sourceRefs} />}
    </div>
  );
}
