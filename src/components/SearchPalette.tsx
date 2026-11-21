// ============================================================
// SearchPalette：全局 ⌘K 命令面板（design/search.md §2）
// - 输入即时搜索（150ms 防抖），结果按 篇章/小节/正文段落/图示 分组
// - 键盘 ↑↓ 循环导航 + ↵ 打开 + ESC 关闭，命中文本 --mark 高亮
// - 空态：快速入口（6 篇章 + 7 天进阶路径）+ 最近搜索（localStorage srkb:）
// 接口约定（保持稳定）：<SearchPalette open onOpenChange />
// ============================================================

import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import {
  Search,
  CornerDownLeft,
  BookOpen,
  FileText,
  TextQuote,
  Image as ImageIcon,
  Route as RouteIcon,
  History,
  X,
  ArrowRight,
} from 'lucide-react';
import type { ResultKind, SearchHit } from '@/lib/search';
import {
  RESULT_KIND_LABELS,
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
  getSectionDoc,
  searchAll,
} from '@/lib/search';
import { highlightText } from '@/lib/search/highlight';
import { chapters, getChapterTheme } from '@/content';
import ChapterIcon from '@/components/ChapterIcon';

export interface SearchPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GROUP_ORDER: ResultKind[] = ['chapter', 'section', 'block', 'diagram'];

const KIND_ICONS: Record<ResultKind, typeof FileText> = {
  chapter: BookOpen,
  section: FileText,
  block: TextQuote,
  diagram: ImageIcon,
};

/** 面板内每组最多展示条数 */
const PALETTE_LIMIT: Record<ResultKind, number> = {
  chapter: 2,
  section: 5,
  block: 4,
  diagram: 3,
};

type NavItem = { type: 'hit'; hit: SearchHit } | { type: 'all' };

export default function SearchPalette({ open, onOpenChange }: SearchPaletteProps) {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [recents, setRecents] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 输入防抖 150ms
  useEffect(() => {
    const t = window.setTimeout(() => setQuery(input), 150);
    return () => window.clearTimeout(t);
  }, [input]);

  const outcome = useMemo(
    () =>
      query.trim()
        ? searchAll(query, { limitPerKind: Math.max(...Object.values(PALETTE_LIMIT)) })
        : null,
    [query],
  );

  const groups = useMemo(() => {
    if (!outcome) return [];
    return GROUP_ORDER.map((kind) => ({
      kind,
      hits: outcome.hits.filter((h) => h.kind === kind).slice(0, PALETTE_LIMIT[kind]),
      total: outcome.counts[kind],
    })).filter((g) => g.hits.length > 0);
  }, [outcome]);

  const navItems = useMemo<NavItem[]>(() => {
    const items: NavItem[] = groups.flatMap((g) => g.hits.map((hit) => ({ type: 'hit' as const, hit })));
    if (outcome && outcome.total > 0) items.push({ type: 'all' });
    return items;
  }, [groups, outcome]);

  useEffect(() => {
    if (open) {
      setInput('');
      setQuery('');
      setActiveIndex(0);
      setRecents(getRecentSearches());
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const openHit = (hit: SearchHit) => {
    addRecentSearch(query);
    onOpenChange(false);
    navigate(hit.doc.path);
  };

  const viewAll = () => {
    addRecentSearch(query);
    onOpenChange(false);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const activate = (item: NavItem | undefined) => {
    if (!item) return;
    if (item.type === 'all') viewAll();
    else openHit(item.hit);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (navItems.length) setActiveIndex((i) => (i + 1) % navItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (navItems.length) setActiveIndex((i) => (i - 1 + navItems.length) % navItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        activate(navItems[activeIndex]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, navItems, activeIndex, query, onOpenChange]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  if (!open) return null;

  const goChapter = (slug: string) => {
    onOpenChange(false);
    navigate(`/chapters/${slug}`);
  };
  const goLearningPath = () => {
    onOpenChange(false);
    navigate('/');
    window.setTimeout(() => {
      document.getElementById('learning-path')?.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  };

  /** 单条结果的二级信息行 */
  const hitSecondary = (hit: SearchHit): string => {
    switch (hit.kind) {
      case 'section':
        return hit.doc.tagline;
      case 'block': {
        const sec = getSectionDoc(hit.doc.sectionId);
        return hit.snippet || sec?.title || '';
      }
      case 'diagram': {
        const sec = getSectionDoc(hit.doc.sectionId);
        return `${hit.doc.caption}${sec ? ` · 出现于 ${sec.no} ${sec.title}` : ''}`;
      }
      case 'chapter':
        return hit.doc.subtitle;
    }
  };

  /** 单条结果的主标题 */
  const hitTitle = (hit: SearchHit): string => {
    switch (hit.kind) {
      case 'section':
        return `${hit.doc.no} ${hit.doc.title}`;
      case 'block': {
        const sec = getSectionDoc(hit.doc.sectionId);
        return hit.doc.heading || sec?.title || hit.doc.blockId;
      }
      case 'diagram':
        return hit.doc.caption || hit.doc.diagramId;
      case 'chapter':
        return hit.doc.title;
    }
  };

  let flatIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-[rgba(44,38,32,0.4)] px-4 pt-[14vh] backdrop-blur-[4px]"
      role="dialog"
      aria-modal="true"
      aria-label="全站搜索"
      onClick={() => onOpenChange(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[560px] overflow-hidden rounded-2xl border border-line bg-surface shadow-card-hover"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 输入行 */}
        <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
          <Search size={17} strokeWidth={1.5} className="shrink-0 text-ink-3" aria-hidden="true" />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="搜索算法、策略、图示…如：负采样 / ESMM / 信息茧房"
            className="w-full bg-transparent text-body text-ink outline-none placeholder:text-ink-3"
            aria-label="搜索关键词"
          />
          <kbd className="shrink-0 rounded border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-ink-3">
            esc
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
          {/* 空态：快速入口 + 最近搜索 */}
          {!query.trim() && (
            <div className="px-2 py-2">
              {recents.length > 0 && (
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between px-2">
                    <p className="text-label text-ink-3">最近搜索</p>
                    <button
                      type="button"
                      onClick={() => {
                        clearRecentSearches();
                        setRecents([]);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] text-ink-3 transition-colors hover:text-accent"
                    >
                      <X size={11} strokeWidth={1.5} aria-hidden="true" />
                      清除
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 px-2">
                    {recents.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setInput(r)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-1 text-small text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
                      >
                        <History size={12} strokeWidth={1.5} className="text-ink-3" aria-hidden="true" />
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <p className="mb-2 px-2 text-label text-ink-3">快速入口</p>
              <div className="grid grid-cols-2 gap-1 max-sm:grid-cols-1">
                {chapters.map((c) => {
                  const theme = getChapterTheme(c.slug);
                  return (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => goChapter(c.slug)}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-surface-2"
                    >
                      <span
                        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                        style={{ backgroundColor: theme.tint, color: theme.hue }}
                      >
                        <ChapterIcon icon={c.icon} size={15} color={theme.hue} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-small font-medium text-ink">
                          篇章{['一', '二', '三', '四', '五', '六'][c.order - 1]} · {c.title}
                        </span>
                        <span className="block truncate text-[11px] text-ink-3">{c.subtitle}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={goLearningPath}
                className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-surface-2"
              >
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent-tint text-accent">
                  <RouteIcon size={15} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-small font-medium text-ink">7 天进阶路径</span>
                  <span className="block truncate text-[11px] text-ink-3">
                    每天 30-50 分钟，从漏斗全局观到 LLM 前沿
                  </span>
                </span>
              </button>
            </div>
          )}

          {/* 结果态 */}
          {query.trim() && outcome && outcome.total === 0 && (
            <p className="px-3 py-10 text-center text-small text-ink-3">
              没有命中「{query}」——试试更通用的词，如「召回」「排序」
            </p>
          )}
          {query.trim() &&
            groups.map((g) => (
              <div key={g.kind} className="mb-1">
                <p className="px-3 pb-1 pt-2 text-label text-ink-3">
                  {RESULT_KIND_LABELS[g.kind]}
                  {g.total > g.hits.length && (
                    <span className="ml-1 font-mono normal-case tracking-normal">
                      {g.hits.length}/{g.total}
                    </span>
                  )}
                </p>
                {g.hits.map((hit) => {
                  flatIndex += 1;
                  const idx = flatIndex;
                  const Icon = KIND_ICONS[g.kind];
                  const hue =
                    hit.kind === 'chapter'
                      ? getChapterTheme(hit.doc.slug).hue
                      : getChapterTheme(hit.doc.chapterSlug).hue;
                  return (
                    <button
                      key={`${hit.kind}-${hit.kind === 'chapter' ? hit.doc.slug : hit.kind === 'diagram' ? hit.doc.diagramId : hit.kind === 'block' ? hit.doc.blockId : hit.doc.sectionId}`}
                      type="button"
                      data-index={idx}
                      onClick={() => openHit(hit)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                        idx === activeIndex ? 'bg-surface-2' : ''
                      }`}
                    >
                      <span
                        className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border-[1.5px]"
                        style={{ borderColor: hue, color: hue }}
                      >
                        <Icon size={11} strokeWidth={1.5} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-body font-medium text-ink">
                          {highlightText(hitTitle(hit), query)}
                        </span>
                        <span className="block truncate text-small text-ink-3">
                          {highlightText(hitSecondary(hit), query)}
                        </span>
                      </span>
                      {idx === activeIndex && (
                        <CornerDownLeft
                          size={14}
                          strokeWidth={1.5}
                          className="mt-1 shrink-0 text-ink-3"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}

          {/* 查看全部结果 */}
          {query.trim() && outcome && outcome.total > 0 && (
            <button
              type="button"
              data-index={navItems.length - 1}
              onClick={viewAll}
              onMouseEnter={() => setActiveIndex(navItems.length - 1)}
              className={`flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-small font-medium transition-colors ${
                activeIndex === navItems.length - 1 ? 'bg-accent-tint text-accent' : 'text-ink-2'
              }`}
            >
              查看全部 {outcome.total} 条结果
              <ArrowRight size={13} strokeWidth={1.5} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* 底部状态栏 */}
        <div className="flex items-center gap-4 border-t border-line bg-surface-2 px-4 py-2 text-[11px] text-ink-3">
          <span>↑↓ 选择</span>
          <span>↵ 打开</span>
          <span>esc 关闭</span>
          <span className="ml-auto">
            {outcome && query.trim()
              ? `共 ${outcome.total} 条结果 · ↵ 查看全部 → /search?q=${query.trim()}`
              : '⌘K 随时唤起'}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
