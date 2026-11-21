import type { RichText } from '@/content';

/** 行内富文本渲染：bold / code / term / math / highlight（section.md §4.1） */
export default function RichTextView({ content }: { content: RichText }) {
  return (
    <>
      {content.map((span, i) => {
        const marks = span.marks ?? [];
        let node: React.ReactNode = span.text;
        if (marks.includes('bold')) node = <strong className="font-bold">{node}</strong>;
        if (marks.includes('highlight'))
          node = <mark style={{ backgroundColor: 'var(--mark)', color: 'var(--ink)' }}>{node}</mark>;
        if (marks.includes('code'))
          node = (
            <code className="rounded bg-code-bg px-1.5 py-0.5 font-mono text-[14px]">{node}</code>
          );
        if (marks.includes('math'))
          node = <span className="font-mono text-accent">{node}</span>;
        if (marks.includes('term'))
          node = (
            <span className="border-b border-dashed border-line-strong text-ink">{node}</span>
          );
        return <span key={i}>{node}</span>;
      })}
    </>
  );
}
