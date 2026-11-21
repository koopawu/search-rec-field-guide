// ============================================================
// 小节阅读页 `/chapters/:slug/:sectionId`（design/section.md，全站核心）
// 三栏布局：左篇章导航 232px / 中正文 720px / 右 scrollspy 目录 216px
// 顶部阅读进度条（篇章色）· 正文 blocks 零进入动画 · 底部要点/来源/上下节/打卡
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import { motion } from 'framer-motion';
import { ChevronDown, ListTree, X } from 'lucide-react';
import type { LoadedChapter, Section, SourceRef } from '@/content';
import {
  CHAPTER_THEMES,
  getBlockHeading,
  getChapter,
  getPrevNext,
  getSection,
  getSectionChapter,
  getSectionNo,
  sectionPath,
} from '@/content';
import {
  Breadcrumb,
  ChapterTag,
  ProgressBar,
  ReadMeta,
  SectionNo,
  SourceRefChip,
} from '@/components/atoms';
import BlockRenderer from '@/components/blocks/BlockRenderer';
import RichTextView from '@/components/blocks/RichTextView';
import SectionNav from '@/components/reading/SectionNav';
import SectionToc, { TocList } from '@/components/reading/SectionToc';
import type { TocItem } from '@/components/reading/SectionToc';
import { useScrollSpy } from '@/components/reading/scrollSpy';
import TakeawaysCard from '@/components/reading/TakeawaysCard';
import ReadCheckButton from '@/components/reading/ReadCheckButton';
import PrevNextCards from '@/components/reading/NavCards';
import type { NavCardData } from '@/components/reading/NavCards';
import ReadingNotFound from '@/components/reading/ReadingNotFound';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const headerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const headerFadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function SectionPage() {
  const { slug, sectionId } = useParams();
  const chapter = getChapter(slug);
  const section = getSection(sectionId);
  // slug 无效 / sectionId 无效 / 小节不属于该篇章 → 404
  if (!chapter) return <ReadingNotFound kind="chapter" />;
  if (!section || section.chapterSlug !== chapter.slug) return <ReadingNotFound kind="section" />;
  return <SectionView chapter={chapter} section={section} />;
}

function SectionView({ chapter, section }: { chapter: LoadedChapter; section: Section }) {
  const { hue, tint } = CHAPTER_THEMES[chapter.slug];
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  const no = getSectionNo(section.sectionId);
  const { prev, next } = getPrevNext(section.sectionId);

  /** 右栏目录：block.heading 锚点 + 本节要点 / 延伸阅读 */
  const related = useMemo(
    () =>
      section.relatedSections
        .map((id) => getSection(id))
        .filter((s): s is Section => Boolean(s))
        .slice(0, 3),
    [section],
  );

  const tocItems = useMemo<TocItem[]>(() => {
    const items: TocItem[] = section.blocks
      .filter((b) => Boolean(getBlockHeading(b)))
      .map((b) => ({ id: b.blockId, label: getBlockHeading(b)! }));
    if (section.keyTakeaways.length) items.push({ id: 'takeaways', label: '本节要点' });
    if (related.length) items.push({ id: 'related', label: '延伸阅读' });
    return items;
  }, [section, related]);

  /** 全节来源引用汇总（按 briefId+section 去重） */
  const sourceRefs = useMemo<SourceRef[]>(() => {
    const map = new Map<string, SourceRef>();
    for (const b of section.blocks) {
      const refs = (b.payload as { sourceRefs?: SourceRef[] }).sourceRefs ?? [];
      for (const ref of refs) {
        const key = `${ref.briefId}|${ref.briefSection ?? ''}`;
        if (!map.has(key)) map.set(key, ref);
      }
    }
    return [...map.values()];
  }, [section]);

  // 带 hash 进入时滚动到目标锚点（图示预览带「用于 1.4」等）
  useEffect(() => {
    if (!location.hash) return;
    const id = decodeURIComponent(location.hash.slice(1));
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' });
    }, 150);
    return () => clearTimeout(timer);
  }, [location.hash, section.sectionId]);

  // 键盘：←/→ 翻上/下一节；t 回到顶部（section.md S5）
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }
      if (e.key === 'ArrowLeft' && prev) navigate(sectionPath(prev));
      else if (e.key === 'ArrowRight' && next) navigate(sectionPath(next));
      else if (e.key === 't' || e.key === 'T') window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, navigate]);

  const prevCard: NavCardData | undefined = prev
    ? {
        href: sectionPath(prev),
        eyebrow: `上一节 ${getSectionNo(prev.sectionId)}`,
        title: prev.title,
        sub: prev.tagline,
        hue: CHAPTER_THEMES[prev.chapterSlug].hue,
        tint: CHAPTER_THEMES[prev.chapterSlug].tint,
      }
    : undefined;
  const nextCard: NavCardData | undefined = next
    ? {
        href: sectionPath(next),
        eyebrow: `下一节 ${getSectionNo(next.sectionId)}`,
        title: next.title,
        sub: next.tagline,
        hue: CHAPTER_THEMES[next.chapterSlug].hue,
        tint: CHAPTER_THEMES[next.chapterSlug].tint,
      }
    : undefined;

  return (
    <div>
      {/* 顶部阅读进度条（篇章色） */}
      <ProgressBar color={hue} />

      <div className="mx-auto max-w-[1280px] px-6 max-md:px-4">
        {/* <1200px：左栏收进抽屉，入口按钮 */}
        <div className="pt-6 min-[1200px]:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-small text-ink-2 shadow-card transition-colors hover:text-ink"
          >
            <ListTree size={14} strokeWidth={1.5} aria-hidden="true" />
            本篇章节 · {chapter.title}
          </button>
        </div>

        <div className="flex gap-8 py-10 max-md:py-8 xl:gap-10">
          {/* 左栏：篇章导航 232px */}
          <aside className="hidden w-[232px] shrink-0 min-[1200px]:block">
            <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto pb-4 pr-1">
              <SectionNav chapter={chapter} currentId={section.sectionId} />
            </div>
          </aside>

          {/* 中栏：正文 720px */}
          <article className="min-w-0 max-w-[720px] flex-1">
            {/* ---------- S1 · 小节页头（仅页头有载入动画） ---------- */}
            <motion.header variants={headerStagger} initial="hidden" animate="show">
              <motion.div variants={headerFadeUp}>
                <Breadcrumb
                  items={[
                    { label: '首页', href: '/' },
                    { label: chapter.title, href: `/chapters/${chapter.slug}` },
                    { label: `${no} ${section.title}` },
                  ]}
                />
              </motion.div>

              <motion.div variants={headerFadeUp} className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                <ChapterTag slug={chapter.slug} />
                <ReadMeta
                  minutes={section.estimatedMinutes}
                  difficulty={section.difficulty}
                  updatedAt={section.updatedAt}
                />
              </motion.div>

              <motion.div variants={headerFadeUp} className="mt-6 flex items-start gap-4">
                <SectionNo no={no} color={hue} size={56} className="mt-1" />
                <h1 className="font-serif text-h1 text-ink max-md:text-[28px]">{section.title}</h1>
              </motion.div>

              <motion.p variants={headerFadeUp} className="mt-5 flex items-stretch gap-3 text-body-l text-ink-2">
                <span className="w-[3px] shrink-0" style={{ backgroundColor: hue }} aria-hidden="true" />
                {section.tagline}
              </motion.p>

              {/* summary 导语段：上下 1px line 夹住，像报纸导语 */}
              <motion.div variants={headerFadeUp} className="my-6 border-y border-line py-6">
                <p className="text-body-l text-ink">
                  <RichTextView content={section.summary} />
                </p>
              </motion.div>

              {section.keywords.length > 0 && (
                <motion.div variants={headerFadeUp} className="flex flex-wrap gap-2">
                  {section.keywords.map((kw) => (
                    <Link
                      key={kw}
                      to={`/search?q=${encodeURIComponent(kw)}`}
                      className="rounded-full bg-surface-2 px-3 py-1 text-label text-ink-3 transition-colors hover:text-ink"
                    >
                      {kw}
                    </Link>
                  ))}
                </motion.div>
              )}
            </motion.header>

            {/* <1024px：本页目录折叠条 */}
            {tocItems.length > 0 && (
              <div className="mb-10 mt-8 rounded-card border border-line bg-surface lg:hidden">
                <button
                  type="button"
                  onClick={() => setMobileTocOpen((v) => !v)}
                  aria-expanded={mobileTocOpen}
                  className="flex w-full items-center justify-between px-4 py-3 text-label text-ink-3"
                >
                  本页目录
                  <ChevronDown
                    size={14}
                    strokeWidth={1.5}
                    className={`transition-transform duration-200 ${mobileTocOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                {mobileTocOpen && (
                  <div className="border-t border-line px-2 py-3">
                    <MobileTocList items={tocItems} hue={hue} onNavigate={() => setMobileTocOpen(false)} />
                  </div>
                )}
              </div>
            )}

            {/* ---------- S2 · 正文流（blocks 零进入动画，阅读优先） ---------- */}
            <div className="space-y-10">
              {section.blocks.map((block) => (
                <BlockRenderer
                  key={block.blockId}
                  block={block}
                  chapterSlug={chapter.slug}
                  sectionId={section.sectionId}
                />
              ))}
            </div>

            {/* ---------- S3 · 本节收尾 ---------- */}
            <div className="mt-14 space-y-10">
              <TakeawaysCard items={section.keyTakeaways} hue={hue} tint={tint} />

              {related.length > 0 && (
                <section id="related" aria-label="延伸阅读" className="scroll-mt-24">
                  <h2 className="font-serif text-h3 text-ink">延伸阅读</h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    {related.map((s) => {
                      const sChapter = getSectionChapter(s.sectionId);
                      const sHue = CHAPTER_THEMES[s.chapterSlug].hue;
                      return (
                        <Link
                          key={s.sectionId}
                          to={sectionPath(s)}
                          className="group rounded-card border border-line bg-surface p-4 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover"
                        >
                          <SectionNo no={getSectionNo(s.sectionId)} color={sHue} size={26} />
                          <p className="mt-3 text-body font-medium text-ink transition-colors group-hover:text-accent">
                            {s.title}
                          </p>
                          <p className="mt-1 line-clamp-2 text-small text-ink-3">{s.tagline}</p>
                          {sChapter && sChapter.slug !== chapter.slug && (
                            <p className="mt-2 text-label" style={{ color: sHue }}>
                              {sChapter.title}
                            </p>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}

              {sourceRefs.length > 0 && (
                <section aria-label="内容来源">
                  <h2 className="text-label text-ink-3">内容来源</h2>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {sourceRefs.map((ref, i) => (
                      <SourceRefChip key={`${ref.briefId}-${i}`} sourceRef={ref} />
                    ))}
                  </div>
                </section>
              )}

              <ReadCheckButton sectionId={section.sectionId} hue={hue} />

              <PrevNextCards prev={prevCard} next={nextCard} />
            </div>
          </article>

          {/* 右栏：本页目录 scrollspy 216px */}
          <aside className="hidden w-[216px] shrink-0 lg:block">
            <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto pb-4">
              <SectionToc items={tocItems} hue={hue} />
            </div>
          </aside>
        </div>
      </div>

      {/* <1200px 左栏抽屉 */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[65] min-[1200px]:hidden" role="dialog" aria-modal="true" aria-label="本篇章节">
          <button
            type="button"
            aria-label="关闭"
            className="absolute inset-0 cursor-default bg-[rgba(44,38,32,0.4)]"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[300px] overflow-y-auto border-r border-line bg-surface p-5 shadow-card-hover">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-label text-ink-3">本篇章节</span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="关闭章节导航"
                className="rounded-lg border border-line p-1.5 text-ink-2 transition-colors hover:text-ink"
              >
                <X size={14} strokeWidth={1.5} />
              </button>
            </div>
            <SectionNav
              chapter={chapter}
              currentId={section.sectionId}
              onNavigate={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/** mobile 折叠目录（与桌面共用 scrollspy 逻辑） */
function MobileTocList({
  items,
  hue,
  onNavigate,
}: {
  items: TocItem[];
  hue: string;
  onNavigate: () => void;
}) {
  const active = useScrollSpy(items.map((i) => i.id));
  return <TocList items={items} active={active} hue={hue} onNavigate={onNavigate} />;
}
