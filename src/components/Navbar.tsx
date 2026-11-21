// ============================================================
// Navbar：全站 sticky（design.md §7.1）
// 64px / backdrop-blur / rgba(250,246,239,.85) / 底部 1px line
// 滚动 >40px 出现阴影；mobile 折叠为汉堡抽屉（抽屉内为篇章树）
// ============================================================

import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { Menu, Search, X } from 'lucide-react';
import { chapters, CHAPTER_THEMES } from '@/content';
import { SITE } from '@/content/site';
import ChapterIcon from '@/components/ChapterIcon';
import SearchPalette from '@/components/SearchPalette';

const NAV_ITEMS = [
  { label: '知识地图', href: '/#knowledge-map' },
  { label: '篇章', href: '/#chapters' },
  { label: '图示库', href: '/diagrams' },
  { label: '学习路径', href: '/#learning-path' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 全局 ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const goAnchor = (href: string) => {
    setDrawerOpen(false);
    if (href.startsWith('/#')) {
      const id = href.slice(2);
      if (window.location.pathname !== '/') {
        navigate('/');
        requestAnimationFrame(() =>
          setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 60),
        );
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 h-16 border-b border-line backdrop-blur transition-shadow ${
          scrolled ? 'shadow-card' : ''
        }`}
        style={{ backgroundColor: 'rgba(250,246,239,.85)' }}
      >
        <div className="mx-auto flex h-full max-w-[1280px] items-center gap-6 px-6 max-md:px-4">
          {/* 左：Logo + 站名 */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label={SITE.fullTitle}>
            <img src="/logo.svg" alt="" width={24} height={24} />
            <span className="flex flex-col leading-none">
              <span className="font-serif text-[17px] font-semibold text-ink">{SITE.title}</span>
              <span className="mt-1 text-[9px] font-medium tracking-[0.18em] text-ink-3">
                {SITE.titleEn}
              </span>
            </span>
          </Link>

          {/* 中：导航项 */}
          <nav className="mx-auto hidden items-center gap-7 md:flex" aria-label="主导航">
            {NAV_ITEMS.map((item) =>
              item.href.startsWith('/#') ? (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => goAnchor(item.href)}
                  className="link-underline text-body text-ink-2 hover:text-ink"
                >
                  {item.label}
                </button>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.href}
                  className={({ isActive }) =>
                    `link-underline text-body ${
                      isActive ? 'text-accent after:!scale-x-100' : 'text-ink-2 hover:text-ink'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>

          {/* 右：搜索 + CTA + 汉堡 */}
          <div className="ml-auto flex items-center gap-3 md:ml-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-small text-ink-3 transition-colors hover:border-line-strong hover:text-ink-2 sm:inline-flex"
              aria-label="搜索（⌘K）"
            >
              <Search size={14} strokeWidth={1.5} aria-hidden="true" />
              <span>搜索</span>
              <kbd className="rounded border border-line bg-surface-2 px-1 font-mono text-[10px]">⌘K</kbd>
            </button>
            <button
              type="button"
              onClick={() => goAnchor('/#learning-path')}
              className="hidden rounded-lg bg-accent px-4 py-2 text-body font-medium text-[#FFFDF9] transition-all hover:translate-y-[1px] hover:bg-accent-deep md:inline-flex"
            >
              开始学习
            </button>
            <button
              type="button"
              className="inline-flex rounded-lg border border-line p-2 text-ink-2 md:hidden"
              onClick={() => setDrawerOpen((v) => !v)}
              aria-label={drawerOpen ? '关闭菜单' : '打开菜单'}
              aria-expanded={drawerOpen}
            >
              {drawerOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      {/* mobile 抽屉：篇章树 */}
      {drawerOpen && (
        <div className="fixed inset-x-0 top-16 z-40 border-b border-line bg-surface shadow-card-hover md:hidden">
          <nav className="max-h-[70vh] overflow-y-auto px-6 py-4" aria-label="篇章导航">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => goAnchor(item.href)}
                className="block w-full border-b border-line py-3 text-left text-body font-medium text-ink"
              >
                {item.label}
              </button>
            ))}
            <p className="pt-4 text-label text-ink-3">六大篇章</p>
            {chapters.map((c) => (
              <Link
                key={c.slug}
                to={`/chapters/${c.slug}`}
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-2.5 py-2.5 text-body text-ink-2"
              >
                <ChapterIcon icon={c.icon} size={16} color={CHAPTER_THEMES[c.slug].hue} />
                {c.title}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <SearchPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
