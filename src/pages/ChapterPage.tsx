// ============================================================
// 篇章概览页 `/chapters/:slug`（design/chapter.md）
// S1 篇章色带页头 / S2 学习目标条 / S3 目录式小节列表 / S4 图示预览带 / S5 篇章间导航
// ============================================================

import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import type { Difficulty, LoadedChapter, Section } from '@/content';
import {
  CHAPTER_THEMES,
  chapters,
  getChapter,
  getSectionNo,
  sectionPath,
} from '@/content';
import { Breadcrumb, DifficultyBadge, SectionNo } from '@/components/atoms';
import ChapterIcon from '@/components/ChapterIcon';
import { DiagramFigure } from '@/components/diagrams/DiagramRegistry';
import DiagramLightbox from '@/components/reading/DiagramLightbox';
import type { LightboxDiagram } from '@/components/reading/DiagramLightbox';
import PrevNextCards from '@/components/reading/NavCards';
import type { NavCardData } from '@/components/reading/NavCards';
import ReadingNotFound from '@/components/reading/ReadingNotFound';
import { useReadChecker } from '@/components/reading/readState';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const stagger = (delay = 0.08) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } },
});

const DIFFICULTY_ORDER: Difficulty[] = ['foundational', 'intermediate', 'advanced'];
const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  foundational: '入门',
  intermediate: '进阶',
  advanced: '高级',
};

interface DiagramEntry {
  diagramId: string;
  caption: string;
  altText: string;
  section: Section;
  blockId: string;
}

export default function ChapterPage() {
  const { slug } = useParams();
  const chapter = getChapter(slug);
  if (!chapter) return <ReadingNotFound kind="chapter" />;
  return <ChapterView chapter={chapter} />;
}

function ChapterView({ chapter }: { chapter: LoadedChapter }) {
  const theme = CHAPTER_THEMES[chapter.slug];
  const { hue, tint } = theme;
  const isRead = useReadChecker();
  const [lightbox, setLightbox] = useState<LightboxDiagram | null>(null);

  const sections = chapter.sections;
  const totalMinutes = sections.reduce((sum, s) => sum + s.estimatedMinutes, 0);
  const diffCount = useMemo(() => {
    const count: Record<Difficulty, number> = { foundational: 0, intermediate: 0, advanced: 0 };
    sections.forEach((s) => {
      count[s.difficulty] += 1;
    });
    return count;
  }, [sections]);

  /** 本篇出现的全部 diagram（按首次出现顺序去重），供 S4 预览带 */
  const diagramEntries = useMemo<DiagramEntry[]>(() => {
    const seen = new Set<string>();
    const out: DiagramEntry[] = [];
    for (const s of sections) {
      for (const b of s.blocks) {
        if (b.type === 'diagram' && !seen.has(b.payload.diagramId)) {
          seen.add(b.payload.diagramId);
          out.push({
            diagramId: b.payload.diagramId,
            caption: b.payload.caption,
            altText: b.payload.altText,
            section: s,
            blockId: b.blockId,
          });
        }
      }
    }
    return out;
  }, [sections]);

  /** S1 右侧装饰线稿：本篇第一幅已注册图示（经 DiagramFigure 查表，未注册时降级占位） */

  const prevChapter = chapters[chapter.order - 2];
  const nextChapter = chapters[chapter.order];

  const prevCard: NavCardData = prevChapter
    ? {
        href: `/chapters/${prevChapter.slug}`,
        eyebrow: `上一篇章 · CHAPTER 0${prevChapter.order}`,
        title: prevChapter.title,
        sub: prevChapter.subtitle,
        hue: CHAPTER_THEMES[prevChapter.slug].hue,
        tint: CHAPTER_THEMES[prevChapter.slug].tint,
      }
    : {
        href: '/',
        anchorId: 'knowledge-map',
        eyebrow: '回到首页',
        title: '首页知识地图',
        sub: '纵览 6 大篇章 × 33 个小节的全景结构',
        hue: 'var(--accent)',
        tint: 'var(--accent-tint)',
      };
  const nextCard: NavCardData = nextChapter
    ? {
        href: `/chapters/${nextChapter.slug}`,
        eyebrow: `下一篇章 · CHAPTER 0${nextChapter.order}`,
        title: nextChapter.title,
        sub: nextChapter.subtitle,
        hue: CHAPTER_THEMES[nextChapter.slug].hue,
        tint: CHAPTER_THEMES[nextChapter.slug].tint,
      }
    : {
        href: '/',
        anchorId: 'learning-path',
        eyebrow: '继续学习',
        title: '回到 7 天学习路径',
        sub: '按天打卡，串起全部 33 个小节',
        hue: 'var(--accent)',
        tint: 'var(--accent-tint)',
      };

  return (
    <div>
      {/* ---------- S1 · 篇章色带页头 ---------- */}
      <motion.section
        className="relative overflow-hidden"
        style={{ backgroundColor: tint }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="relative mx-auto max-w-[1280px] px-6 pb-14 pt-16 max-md:px-4"
          variants={stagger(0.1)}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp}>
            <Breadcrumb
              items={[
                { label: '首页', href: '/' },
                { label: '篇章目录', href: '/#chapters' },
                { label: chapter.title },
              ]}
            />
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 flex items-center gap-5">
            <span
              className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"
              style={{ backgroundColor: hue }}
              aria-hidden="true"
            >
              <ChapterIcon icon={chapter.icon} size={32} color="#FFFDF9" />
            </span>
            <span className="flex flex-wrap items-center gap-3">
              <span className="text-label" style={{ color: hue }}>
                篇章 CHAPTER 0{chapter.order}
              </span>
              {chapter.slug === 'llm-frontier' && (
                <span
                  className="rounded-full px-2.5 py-0.5 text-label"
                  style={{ backgroundColor: 'rgba(255,253,249,0.75)', color: hue }}
                >
                  2024-2026 前沿
                </span>
              )}
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="mt-6 font-serif text-h1 text-ink max-md:text-[28px]">
            {chapter.title}
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-4 max-w-[640px] text-body-l text-ink-2">
            {chapter.subtitle}
          </motion.p>

          <motion.p variants={fadeUp} className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-small text-ink-3">
            <span>
              <span className="font-mono">{sections.length}</span> 个小节
            </span>
            <span aria-hidden="true">·</span>
            <span>
              合计约 <span className="font-mono">{totalMinutes}</span> 分钟
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-3">
              难度分布
              {DIFFICULTY_ORDER.map((d, i) =>
                diffCount[d] > 0 ? (
                  <span key={d} className="inline-flex items-center gap-1.5" title={DIFFICULTY_LABEL[d]}>
                    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
                      {Array.from({ length: i + 1 }).map((_, j) => (
                        <span key={j} className="inline-block h-1.5 w-1.5 rotate-45" style={{ backgroundColor: hue }} />
                      ))}
                    </span>
                    <span className="font-mono">{diffCount[d]}</span>
                  </span>
                ) : null,
              )}
            </span>
          </motion.p>

          {/* 右侧线稿缩略装饰（desktop） */}
          {diagramEntries.length > 0 && (
            <div
              className="pointer-events-none absolute -right-6 bottom-0 hidden w-[400px] select-none opacity-[0.35] lg:block"
              aria-hidden="true"
            >
              <DiagramFigure
                diagramId={diagramEntries[0].diagramId}
                hue={hue}
                tint="rgba(255,253,249,0.6)"
              />
            </div>
          )}
        </motion.div>
        {/* 色带底部 2px 篇章色细线 */}
        <div className="h-0.5" style={{ backgroundColor: hue }} aria-hidden="true" />
      </motion.section>

      {/* ---------- S2 · 学习目标条 ---------- */}
      <section className="mx-auto max-w-[1280px] px-6 py-12 max-md:px-4" aria-label="学习目标">
        <div className="flex gap-12 max-lg:flex-col max-lg:gap-6">
          <div className="w-[240px] shrink-0 max-lg:w-auto">
            <h2 className="font-serif text-h2 text-ink">学习目标</h2>
            <p className="mt-2 text-small text-ink-3">来自本篇各小节策略抓手的汇总</p>
          </div>
          <motion.ul
            className="min-w-0 flex-1"
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            {chapter.learningGoals.map((goal, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-3 border-b border-line py-4 first:pt-0 last:border-b-0"
                variants={{
                  hidden: { opacity: 0, x: -16 },
                  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
                }}
              >
                <span
                  className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: hue }}
                  aria-hidden="true"
                >
                  <Check size={12} strokeWidth={2.5} color="#FFFDF9" />
                </span>
                <span className="text-body text-ink">{goal}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* ---------- S3 · 小节目录 ---------- */}
      <section className="mx-auto max-w-[1280px] px-6 pb-16 pt-4 max-md:px-4" aria-label="本篇章节">
        <h2 className="font-serif text-h2 text-ink">本篇章节</h2>

        {chapter.slug === 'evaluation' && (
          <div
            className="mt-6 rounded-card px-5 py-4 text-body text-ink-2"
            style={{ backgroundColor: 'var(--mark)' }}
          >
            评估体系是分发负责人的第一工程——建议无论先读哪篇，最后都回到本篇。
          </div>
        )}

        <motion.ul
          className="mt-6"
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {sections.map((s) => {
            const read = isRead(s.sectionId);
            return (
              <motion.li key={s.sectionId} variants={fadeUp} className="border-b border-line first:border-t">
                <Link
                  to={sectionPath(s)}
                  className="group -mx-3 grid grid-cols-[auto_1fr_auto] items-center gap-x-4 rounded-lg px-3 py-6 transition-colors duration-200 hover:bg-[var(--row-hover)] md:grid-cols-[64px_minmax(0,1fr)_150px_72px] md:gap-x-5"
                  style={{ '--row-hover': `${tint}80` } as React.CSSProperties}
                >
                  {/* 编号 */}
                  <span className="flex w-12 flex-col items-center gap-1.5 md:w-16">
                    <SectionNo no={getSectionNo(s.sectionId)} color={hue} size={40} />
                    <span className="font-mono text-[11px] text-ink-3">{s.sectionId}</span>
                  </span>

                  {/* 标题 + tagline + keywords */}
                  <span className="min-w-0">
                    <span
                      className="block truncate font-serif text-h3 text-ink transition-colors group-hover:[color:var(--row-hue)]"
                      style={{ '--row-hue': hue } as React.CSSProperties}
                    >
                      {s.title}
                    </span>
                    <span className="mt-1 block truncate text-small text-ink-2">{s.tagline}</span>
                    {s.keywords.length > 0 && (
                      <span className="mt-2 hidden flex-wrap gap-1.5 sm:flex">
                        {s.keywords.slice(0, 3).map((kw) => (
                          <span key={kw} className="rounded-full bg-surface-2 px-2 py-0.5 text-label text-ink-3">
                            {kw}
                          </span>
                        ))}
                      </span>
                    )}
                  </span>

                  {/* 难度 + 时长 */}
                  <span className="hidden flex-col items-start gap-1 md:flex">
                    <DifficultyBadge difficulty={s.difficulty} color={hue} />
                    <span className="text-small text-ink-3">
                      约 <span className="font-mono">{s.estimatedMinutes}</span> 分钟
                    </span>
                  </span>

                  {/* 状态 + 箭头 */}
                  <span className="flex items-center justify-end gap-3">
                    <span
                      className="inline-flex h-5 w-5 items-center justify-center rounded-full border-[1.5px]"
                      style={{
                        borderColor: read ? hue : 'var(--line-strong)',
                        backgroundColor: read ? hue : 'transparent',
                      }}
                      title={read ? '已读' : '未读'}
                    >
                      {read && <Check size={11} strokeWidth={2.5} color="#FFFDF9" />}
                    </span>
                    <ArrowRight
                      size={18}
                      strokeWidth={1.5}
                      color={hue}
                      className="transition-transform duration-200 group-hover:translate-x-1.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </section>

      {/* ---------- S4 · 篇章核心图预览带 ---------- */}
      {diagramEntries.length > 0 && (
        <section className="mx-auto max-w-[1280px] px-6 pb-16 max-md:px-4" aria-label="本篇图示">
          <h2 className="font-serif text-h2 text-ink">本篇图示</h2>
          <motion.div
            className="mt-6 flex gap-4 overflow-x-auto pb-4"
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            {diagramEntries.map((entry) => (
              <motion.div
                key={entry.diagramId}
                variants={fadeUp}
                className="relative w-[320px] shrink-0 overflow-hidden rounded-card border border-line bg-surface shadow-card transition-shadow hover:shadow-card-hover"
              >
                <button
                  type="button"
                  onClick={() =>
                    setLightbox({
                      diagramId: entry.diagramId,
                      caption: entry.caption,
                      altText: entry.altText,
                      hue,
                      tint,
                    })
                  }
                  className="block w-full cursor-pointer p-4"
                  aria-label={`放大查看：${entry.caption}`}
                >
                  <span className="block h-[168px] overflow-hidden [&_svg]:h-auto [&_svg]:w-full">
                    <DiagramFigure diagramId={entry.diagramId} hue={hue} tint={tint} />
                  </span>
                  <span className="mt-3 line-clamp-2 block text-left text-small text-ink-2">
                    {entry.caption}
                  </span>
                </button>
                <Link
                  to={`${sectionPath(entry.section)}#${entry.blockId}`}
                  className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-label shadow-card transition-transform hover:-translate-y-0.5"
                  style={{ backgroundColor: 'var(--surface)', color: hue }}
                >
                  用于 {getSectionNo(entry.section.sectionId)}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* ---------- S5 · 篇章间导航 ---------- */}
      <section className="mx-auto max-w-[1280px] px-6 pb-16 max-md:px-4" aria-label="篇章间导航">
        <PrevNextCards prev={prevCard} next={nextCard} />
      </section>

      <DiagramLightbox diagram={lightbox} onClose={() => setLightbox(null)} />
    </div>
  );
}
