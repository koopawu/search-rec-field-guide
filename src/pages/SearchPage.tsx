// ============================================================
// 全站搜索 `/search?q=...`（design/search.md §3）
// - 大号搜索框同步 URL query；实时统计「找到 N 条 · 用时 Xms」
// - 筛选条：分组 Tab（含计数）+ 篇章多选 + 难度筛选
// - 结果列表：小节 / 正文段落 / 图示 / 篇章 四种行样式，命中高亮
// - 每页 20 条「加载更多」；空结果态 + 热门搜索建议
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router';
import { motion } from 'framer-motion';
import { Search, X, Image as ImageIcon, ArrowRight, History } from 'lucide-react';
import type { ChapterSlug, Difficulty } from '@/content';
import { CHAPTER_THEMES, chapters, getChapterTheme } from '@/content';
import type { ResultKind, SearchHit, SearchOutcome } from '@/lib/search';
import {
  HOT_SEARCHES,
  addRecentSearch,
  getRecentSearches,
  getSectionDoc,
  searchAll,
} from '@/lib/search';
import { highlightText } from '@/lib/search/highlight';
import { diagramRegistry } from '@/components/diagrams/registry';
import { ChapterTag, DifficultyBadge, SectionNo } from '@/components/atoms';
import ChapterIcon from '@/components/ChapterIcon';

const PAGE_SIZE = 20;

const KIND_TABS: Array<{ kind: ResultKind | 'all'; label: string }> = [
  { kind: 'all', label: '全部' },
  { kind: 'section', label: '小节' },
  { kind: 'block', label: '正文' },
  { kind: 'diagram', label: '图示' },
  { kind: 'chapter', label: '篇章' },
];

const DIFFICULTIES: Array<{ value: Difficulty; label: string; diamonds: string }> = [
  { value: 'foundational', label: '入门', diamonds: '◆' },
  { value: 'intermediate', label: '进阶', diamonds: '◆◆' },
  { value: 'advanced', label: '高级', diamonds: '◆◆◆' },
];

// ---------- 空态漏斗插画（代码绘制，search.md §S4） ----------

function EmptyFunnel() {
  return (
    <svg
      width="132"
      height="104"
      viewBox="0 0 132 104"
      fill="none"
      aria-hidden="true"
      className="mx-auto"
    >
      {/* 漏斗主体 */}
      <path
        d="M14 18 H118 L78 58 V86 L54 96 V58 Z"
        stroke="#CFC2AD"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="#F3EDE2"
      />
      {/* 分层构造线 */}
      <line x1="30" y1="30.5" x2="102" y2="30.5" stroke="#CFC2AD" strokeWidth="1" strokeDasharray="5 5" />
      <line x1="46" y1="43" x2="86" y2="43" stroke="#CFC2AD" strokeWidth="1" strokeDasharray="5 5" />
      {/* 未落入的候选点 */}
      <circle cx="40" cy="10" r="3" stroke="#CFC2AD" strokeWidth="1.5" fill="#FFFDF9" />
      <circle cx="66" cy="6" r="3" stroke="#CFC2AD" strokeWidth="1.5" fill="#FFFDF9" />
      <circle cx="92" cy="10" r="3" stroke="#CFC2AD" strokeWidth="1.5" fill="#FFFDF9" />
      {/* 底部空集标记 */}
      <text x="66" y="70" textAnchor="middle" fontSize="12" fill="#8C8272" fontFamily="JetBrains Mono, monospace">
        ∅
      </text>
    </svg>
  );
}

// ---------- 图示缩略（96×68，复用 DiagramRegistry 组件等比缩小） ----------

function DiagramThumb({ diagramId, hue, tint }: { diagramId: string; hue: string; tint: string }) {
  const Component = diagramRegistry[diagramId];
  return (
    <div
      className="flex h-[68px] w-24 shrink-0 items-start justify-center overflow-hidden rounded-md border border-line bg-surface-2"
      aria-hidden="true"
    >
      {Component ? (
        <div
          style={{
            width: 880,
            transform: 'scale(0.109)',
            transformOrigin: 'top center',
            pointerEvents: 'none',
          }}
        >
          <Component hue={hue} tint={tint} />
        </div>
      ) : (
        <span className="flex h-full w-full items-center justify-center text-ink-3">
          <ImageIcon size={20} strokeWidth={1.5} />
        </span>
      )}
    </div>
  );
}

// ---------- 结果行 ----------

function SectionRow({ hit, query }: { hit: Extract<SearchHit, { kind: 'section' }>; query: string }) {
  const theme = getChapterTheme(hit.doc.chapterSlug);
  return (
    <Link
      to={hit.doc.path}
      className="group flex items-start gap-4 px-3 py-5 transition-colors hover:bg-[var(--row-tint)] max-sm:px-1"
      style={{ '--row-tint': theme.tint } as CSSProperties}
    >
      <SectionNo no={hit.doc.no} color={theme.hue} size={30} className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-h3 text-ink transition-colors group-hover:text-accent">
          {highlightText(hit.doc.title, query)}
        </h3>
        <p className="mt-1 line-clamp-2 text-small text-ink-3">
          {highlightText(hit.doc.tagline, query)}
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
          <ChapterTag slug={hit.doc.chapterSlug} size="sm" />
          <span className="text-small text-ink-3">约 {hit.doc.estimatedMinutes} 分钟</span>
          <DifficultyBadge difficulty={hit.doc.difficulty} />
        </div>
      </div>
      <ArrowRight
        size={16}
        strokeWidth={1.5}
        className="mt-2 shrink-0 text-ink-3 opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      />
    </Link>
  );
}

function BlockRow({ hit, query }: { hit: Extract<SearchHit, { kind: 'block' }>; query: string }) {
  const theme = getChapterTheme(hit.doc.chapterSlug);
  const sec = getSectionDoc(hit.doc.sectionId);
  return (
    <Link
      to={hit.doc.path}
      className="group block px-3 py-4 pl-7 transition-colors hover:bg-[var(--row-tint)] max-sm:px-1 max-sm:pl-4"
      style={{ '--row-tint': theme.tint } as CSSProperties}
    >
      <p className="mb-1.5 text-small text-ink-3">
        小节 <span className="font-mono">{sec?.no}</span> · {sec?.title}
        {hit.doc.heading && <span className="text-ink-2"> · {highlightText(hit.doc.heading, query)}</span>}
      </p>
      <div className="border-l-2 border-line-strong pl-4 text-body leading-relaxed text-ink-2">
        {highlightText(hit.snippet, query)}
      </div>
    </Link>
  );
}

function DiagramRow({ hit, query }: { hit: Extract<SearchHit, { kind: 'diagram' }>; query: string }) {
  const theme = getChapterTheme(hit.doc.chapterSlug);
  const sec = getSectionDoc(hit.doc.sectionId);
  return (
    <Link
      to={hit.doc.path}
      className="group flex items-center gap-4 px-3 py-4 transition-colors hover:bg-[var(--row-tint)] max-sm:px-1"
      style={{ '--row-tint': theme.tint } as CSSProperties}
    >
      <DiagramThumb diagramId={hit.doc.diagramId} hue={theme.hue} tint={theme.tint} />
      <div className="min-w-0 flex-1">
        <h3 className="text-body font-medium text-ink transition-colors group-hover:text-accent">
          {highlightText(hit.doc.caption || hit.doc.diagramId, query)}
        </h3>
        <p className="mt-0.5 font-mono text-small text-ink-3">
          {highlightText(hit.doc.diagramId, query)}
        </p>
        {sec && (
          <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-line bg-surface-2 px-2.5 py-0.5 text-[11px] text-ink-2">
            出现于 小节 {sec.no} · {sec.title}
          </span>
        )}
      </div>
      <ArrowRight
        size={16}
        strokeWidth={1.5}
        className="shrink-0 text-ink-3 opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      />
    </Link>
  );
}

function ChapterRow({ hit, query }: { hit: Extract<SearchHit, { kind: 'chapter' }>; query: string }) {
  const theme = getChapterTheme(hit.doc.slug);
  const chapter = chapters.find((c) => c.slug === hit.doc.slug);
  return (
    <Link
      to={hit.doc.path}
      className="group flex items-center gap-4 px-3 py-4 transition-colors hover:bg-[var(--row-tint)] max-sm:px-1"
      style={{ '--row-tint': theme.tint } as CSSProperties}
    >
      <span
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-card"
        style={{ backgroundColor: theme.tint, color: theme.hue }}
      >
        <ChapterIcon icon={chapter?.icon ?? 'search'} size={20} color={theme.hue} />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-h3 text-ink transition-colors group-hover:text-accent">
          篇章{['一', '二', '三', '四', '五', '六'][(chapter?.order ?? 1) - 1]} ·{' '}
          {highlightText(hit.doc.title, query)}
        </h3>
        <p className="mt-0.5 truncate text-small text-ink-3">
          {highlightText(hit.doc.subtitle, query)}
        </p>
      </div>
      <span className="shrink-0 text-small text-ink-3 transition-colors group-hover:text-accent">
        进入篇章 →
      </span>
    </Link>
  );
}

function ResultRow({ hit, query }: { hit: SearchHit; query: string }) {
  switch (hit.kind) {
    case 'section':
      return <SectionRow hit={hit} query={query} />;
    case 'block':
      return <BlockRow hit={hit} query={query} />;
    case 'diagram':
      return <DiagramRow hit={hit} query={query} />;
    case 'chapter':
      return <ChapterRow hit={hit} query={query} />;
  }
}

// ---------- 页面 ----------

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';
  const [input, setInput] = useState(urlQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(urlQuery);
  const [tab, setTab] = useState<ResultKind | 'all'>('all');
  const [chapterFilter, setChapterFilter] = useState<ChapterSlug[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [recents, setRecents] = useState<string[]>(() => getRecentSearches());

  // 外部跳转（⌘K「查看全部」等）→ 同步输入框
  useEffect(() => {
    setInput(urlQuery);
    setDebouncedQuery(urlQuery);
    if (urlQuery.trim()) {
      addRecentSearch(urlQuery);
      setRecents(getRecentSearches());
    }
  }, [urlQuery]);

  // 输入防抖 300ms 同步 URL query（replace，不污染历史栈）
  useEffect(() => {
    const t = window.setTimeout(() => {
      const q = input.trim();
      setDebouncedQuery(q);
      if (q !== urlQuery) {
        setSearchParams(q ? { q } : {}, { replace: true });
      }
    }, 300);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  // 筛选/分页复位
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [debouncedQuery, tab, chapterFilter, difficulty]);

  const outcome: SearchOutcome | null = useMemo(() => {
    if (!debouncedQuery.trim()) return null;
    return searchAll(debouncedQuery, {
      chapterSlugs: chapterFilter,
      difficulty,
    });
  }, [debouncedQuery, chapterFilter, difficulty]);

  const filteredHits = useMemo(() => {
    if (!outcome) return [];
    return tab === 'all' ? outcome.hits : outcome.hits.filter((h) => h.kind === tab);
  }, [outcome, tab]);

  const visibleHits = filteredHits.slice(0, visible);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    setDebouncedQuery(q);
    setSearchParams(q ? { q } : {}, { replace: true });
    if (q) {
      addRecentSearch(q);
      setRecents(getRecentSearches());
    }
  };

  const applyQuery = (q: string) => {
    setInput(q);
    setDebouncedQuery(q);
    setSearchParams({ q }, { replace: true });
    addRecentSearch(q);
    setRecents(getRecentSearches());
  };

  const toggleChapter = (slug: ChapterSlug) => {
    setChapterFilter((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const tabCount = (kind: ResultKind | 'all'): number => {
    if (!outcome) return 0;
    return kind === 'all' ? outcome.total : outcome.counts[kind];
  };

  const hasQuery = debouncedQuery.trim().length > 0;

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-16 max-md:px-4">
      {/* S1 页头 */}
      <h1 className="font-serif text-h1 text-ink">全站搜索</h1>
      <form onSubmit={submit} className="mt-6" role="search">
        <div className="flex h-14 items-center gap-3 rounded-card border border-line-strong bg-surface px-4 shadow-card transition-colors focus-within:border-accent">
          <Search size={18} strokeWidth={1.5} className="shrink-0 text-ink-3" aria-hidden="true" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="搜索算法、策略、图示…如：负采样 / ESMM / 信息茧房"
            className="w-full bg-transparent text-body text-ink outline-none placeholder:text-ink-3"
            aria-label="搜索关键词"
          />
          {input && (
            <button
              type="button"
              onClick={() => applyQuery('')}
              className="shrink-0 rounded-full p-1 text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
              aria-label="清空搜索"
            >
              <X size={15} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </form>
      {hasQuery && outcome && (
        <p className="mt-3 font-mono text-small text-ink-3">
          找到 {outcome.total} 条结果 · 用时 {outcome.elapsedMs.toFixed(1)}ms
        </p>
      )}

      {/* S2 筛选条 */}
      {hasQuery && outcome && outcome.total > 0 && (
        <div className="mt-6 space-y-3 border-y border-line py-4">
          <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="结果分组">
            {KIND_TABS.map((t) => {
              const active = tab === t.kind;
              return (
                <button
                  key={t.kind}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.kind)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-small font-medium transition-colors ${
                    active
                      ? 'bg-ink text-surface'
                      : 'bg-surface-2 text-ink-2 hover:bg-line hover:text-ink'
                  }`}
                >
                  {t.label}
                  <span
                    className={`font-mono text-[11px] ${active ? 'text-surface/70' : 'text-ink-3'}`}
                  >
                    {tabCount(t.kind)}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-label text-ink-3">篇章</span>
              {chapters.map((c) => {
                const theme = CHAPTER_THEMES[c.slug];
                const active = chapterFilter.includes(c.slug);
                return (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => toggleChapter(c.slug)}
                    aria-pressed={active}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] transition-all"
                    style={{
                      backgroundColor: active ? theme.hue : theme.tint,
                      color: active ? '#FFFDF9' : theme.hue,
                    }}
                  >
                    <ChapterIcon icon={c.icon} size={12} color={active ? '#FFFDF9' : theme.hue} />
                    {c.title}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="mr-1 text-label text-ink-3">难度</span>
              {DIFFICULTIES.map((d) => {
                const active = difficulty === d.value;
                return (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDifficulty(active ? null : d.value)}
                    aria-pressed={active}
                    title={d.label}
                    className={`rounded-full px-2.5 py-1 font-mono text-[11px] tracking-wide transition-colors ${
                      active ? 'bg-ink text-surface' : 'bg-surface-2 text-ink-3 hover:text-ink'
                    }`}
                  >
                    {d.diamonds}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* S3 结果列表 */}
      {hasQuery && outcome && outcome.total > 0 && (
        <div className="divide-y divide-line">
          {visibleHits.map((hit, i) => {
            const key =
              hit.kind === 'chapter'
                ? `chapter-${hit.doc.slug}`
                : hit.kind === 'diagram'
                  ? `diagram-${hit.doc.diagramId}-${hit.doc.sectionId}`
                  : hit.kind === 'block'
                    ? `block-${hit.doc.blockId}`
                    : `section-${hit.doc.sectionId}`;
            const row = <ResultRow hit={hit} query={debouncedQuery} />;
            // 仅前 10 行做 stagger fade-up，其余直接渲染保性能
            return i < 10 ? (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
              >
                {row}
              </motion.div>
            ) : (
              <div key={key}>{row}</div>
            );
          })}
        </div>
      )}

      {/* 加载更多 */}
      {filteredHits.length > visible && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="rounded-lg border border-line-strong bg-surface px-6 py-2.5 text-small font-medium text-ink-2 shadow-card transition-all hover:-translate-y-px hover:border-ink-3 hover:text-ink"
          >
            加载更多（剩余 {filteredHits.length - visible} 条）
          </button>
        </div>
      )}
      {hasQuery && outcome && outcome.total > 0 && filteredHits.length <= visible && (
        <p className="mt-8 text-center font-mono text-small text-ink-3">
          — 已显示全部 {filteredHits.length} 条 —
        </p>
      )}

      {/* S4 空结果态 */}
      {hasQuery && outcome && outcome.total === 0 && (
        <div className="py-16 text-center">
          <EmptyFunnel />
          <p className="mt-6 font-serif text-h3 text-ink">没有命中「{debouncedQuery}」</p>
          <p className="mt-2 text-body text-ink-3">
            试试更通用的词，如「召回」「排序」，或从热门搜索开始：
          </p>
          <HotChips onPick={applyQuery} />
        </div>
      )}

      {/* 未输入态：热门搜索 + 最近搜索 */}
      {!hasQuery && (
        <div className="py-14 text-center">
          <EmptyFunnel />
          <p className="mt-6 font-serif text-h3 text-ink">搜索全站 34 个小节与 50 幅架构图示</p>
          <p className="mt-2 text-body text-ink-3">热门搜索：</p>
          <HotChips onPick={applyQuery} />
          {recents.length > 0 && (
            <div className="mt-10">
              <p className="text-label text-ink-3">最近搜索</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {recents.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => applyQuery(r)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-small text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
                  >
                    <History size={12} strokeWidth={1.5} className="text-ink-3" aria-hidden="true" />
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function HotChips({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="mt-5 flex flex-wrap justify-center gap-2">
      {HOT_SEARCHES.map((w) => (
        <button
          key={w}
          type="button"
          onClick={() => onPick(w)}
          className="rounded-full border border-line bg-surface px-4 py-1.5 text-small text-ink-2 shadow-card transition-all hover:-translate-y-px hover:border-accent hover:text-accent"
        >
          {w}
        </button>
      ))}
    </div>
  );
}
