// ============================================================
// Footer（design.md §7.2）：4 栏 + 底部版权行，底色 surface-2
// ============================================================

import { Link } from 'react-router';
import { chapters, CHAPTER_THEMES, sectionPath } from '@/content';
import { SITE } from '@/content/site';
import ChapterIcon from '@/components/ChapterIcon';

export default function Footer() {
  const colA = chapters.slice(0, 3);
  const colB = chapters.slice(3, 6);
  return (
    <footer className="border-t border-line bg-surface-2">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-6 py-14 max-md:px-4 md:grid-cols-4">
        {[colA, colB].map((group, gi) => (
          <div key={gi}>
            <p className="text-label text-ink-3">{gi === 0 ? '篇章一 ~ 三' : '篇章四 ~ 六'}</p>
            <ul className="mt-4 space-y-2.5">
              {group.map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/chapters/${c.slug}`}
                    className="group inline-flex items-center gap-2 text-body text-ink-2 hover:text-ink"
                  >
                    <ChapterIcon icon={c.icon} size={15} color={CHAPTER_THEMES[c.slug].hue} />
                    <span className="link-underline">{c.title}</span>
                  </Link>
                  <span className="mt-1 block pl-6 text-small text-ink-3">
                    {c.sections.length} 个小节
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="text-label text-ink-3">站点导航</p>
          <ul className="mt-4 space-y-2.5 text-body text-ink-2">
            <li>
              <Link to="/diagrams" className="link-underline hover:text-ink">
                图示库
              </Link>
            </li>
            <li>
              <Link to="/#learning-path" className="link-underline hover:text-ink">
                学习路径
              </Link>
            </li>
            <li>
              <Link to="/search" className="link-underline hover:text-ink">
                搜索
              </Link>
            </li>
            <li>
              <Link
                to={sectionPath(chapters[0].sections[0])}
                className="link-underline hover:text-ink"
              >
                从第一节开始
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-label text-ink-3">关于本库</p>
          <p className="mt-4 text-small text-ink-2">
            {SITE.audienceTagline}。全站内容基于以下 8 份调研简报编写：
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-small text-ink-3">
            {SITE.sources.map((s) => (
              <li key={s.briefId}>
                <span className="font-mono">{s.briefId}</span> {s.topic}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-2 px-6 py-5 text-small text-ink-3 max-md:px-4">
          <span>© 2026 {SITE.fullTitle} · 仅供学习交流</span>
          <span>
            内容版本 <span className="font-mono">{SITE.version}</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
