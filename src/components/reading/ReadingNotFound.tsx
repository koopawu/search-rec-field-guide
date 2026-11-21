// 阅读页 404：无效篇章 slug / 小节 sectionId
import { Link } from 'react-router';

export default function ReadingNotFound({ kind }: { kind: 'chapter' | 'section' }) {
  return (
    <div className="mx-auto max-w-[720px] px-6 py-24 text-center max-md:px-4">
      <p className="text-label" style={{ color: 'var(--accent)' }}>
        404 · NOT FOUND
      </p>
      <h1 className="mt-4 font-serif text-h1 text-ink">
        {kind === 'chapter' ? '没有找到这个篇章' : '没有找到这个小节'}
      </h1>
      <p className="mt-4 text-body text-ink-2">
        链接可能已失效，或内容已移动。全站共 6 大篇章 · 33 个小节，从下面继续探索。
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="rounded-lg bg-accent px-4 py-2 text-body font-medium text-[#FFFDF9] transition-all hover:translate-y-[1px] hover:bg-accent-deep"
        >
          回到首页
        </Link>
        <Link
          to="/chapters/search"
          className="link-underline rounded-lg border border-line bg-surface px-4 py-2 text-body text-ink-2 transition-colors hover:text-ink"
        >
          从篇章一「搜索篇」开始
        </Link>
      </div>
    </div>
  );
}
