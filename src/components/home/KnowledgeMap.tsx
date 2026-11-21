// S3 · 知识地图（home.md §S3）：漏斗 × 篇章二维矩阵
// GSAP draw-line：顶部漏斗轮廓进入视口描绘一次；chip 行内 stagger（Framer Motion 行级容器）
// 注意库隔离：GSAP 只用于漏斗轮廓 SVG，chip 浮现用 CSS/FM 容器
import { useMemo, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  chapters,
  getSection,
  getSectionNo,
  sectionPath,
  CHAPTER_THEMES,
} from '@/content';
import type { ChapterSlug } from '@/content';
import { DifficultyBadge, SectionNo } from '@/components/atoms';
import ChapterIcon from '@/components/ChapterIcon';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const STAGES = ['理解输入', '召回', '排序', '分发与混排', '评估与演进'] as const;
type Stage = (typeof STAGES)[number];

/** 单元格映射（home.md §S3） */
const MATRIX: Record<ChapterSlug, Partial<Record<Stage, string[]>>> = {
  search: {
    理解输入: ['search-02', 'search-03'],
    召回: ['search-04'],
    排序: ['search-05'],
    分发与混排: ['search-06'],
    评估与演进: ['search-01'],
  },
  recommendation: {
    召回: ['rec-02', 'rec-03', 'rec-04'],
    排序: ['rec-05', 'rec-06'],
    分发与混排: ['rec-07'],
    评估与演进: ['rec-01'],
  },
  strategy: {
    召回: ['strategy-01'],
    排序: ['strategy-02'],
    分发与混排: ['strategy-04', 'strategy-05', 'strategy-06'],
    评估与演进: ['strategy-03'],
  },
  evaluation: {
    评估与演进: ['eval-01', 'eval-02', 'eval-03', 'eval-04', 'eval-05'],
  },
  'llm-frontier': {
    召回: ['llm-01'],
    排序: ['llm-03'],
    分发与混排: ['llm-02', 'llm-04'],
    评估与演进: ['llm-05'],
  },
  'engineering-org': {
    理解输入: ['eng-04'],
    召回: ['eng-03'],
    排序: ['eng-02'],
    评估与演进: ['eng-01', 'eng-05'],
  },
};

const CORE_FIGURES = new Set([
  'fig-rec-funnel',
  'fig-twin-tower',
  'fig-coldstart-ladder',
  'fig-rag-architecture',
  'fig-generative-vs-cascade',
  'fig-three-layer-architecture',
]);

/** 小节 chip */
function SectionChip({
  sectionId,
  hue,
  hasCoreFigure,
  delay,
}: {
  sectionId: string;
  hue: string;
  hasCoreFigure: boolean;
  delay: number;
}) {
  const navigate = useNavigate();
  const section = getSection(sectionId);
  if (!section) return null;
  const shortTitle = section.title.split('：')[0].split('，')[0];
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay, ease: EASE }}
      onClick={() => navigate(sectionPath(section))}
      title={`${section.tagline}（约 ${section.estimatedMinutes} 分钟）`}
      className="group relative flex items-center gap-2 rounded-lg bg-surface-2 px-2.5 py-1.5 text-left text-[14px] text-ink-2 transition-all hover:-translate-y-0.5 hover:text-ink hover:shadow-card"
    >
      <span
        className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 rounded-l-lg transition-transform duration-200 group-hover:scale-y-100"
        style={{ backgroundColor: hue }}
        aria-hidden="true"
      />
      <DifficultyBadge difficulty={section.difficulty} showLabel={false} color={hue} />
      <SectionNo no={getSectionNo(sectionId)} color={hue} size={22} />
      <span className="whitespace-nowrap">{shortTitle}</span>
      {hasCoreFigure && (
        <span
          className="h-2 w-2 shrink-0 rounded-full bg-accent"
          title="含全站核心图"
          aria-label="含全站核心图"
        />
      )}
    </motion.button>
  );
}

export default function KnowledgeMap() {
  const funnelRef = useRef<SVGSVGElement>(null);

  // 含核心图的小节集合（从内容数据推导）
  const coreFigureSections = useMemo(() => {
    const set = new Set<string>();
    chapters.forEach((c) =>
      c.sections.forEach((s) => {
        if (s.diagramsUsed.some((id) => CORE_FIGURES.has(id))) set.add(s.sectionId);
      }),
    );
    return set;
  }, []);

  // 顶部漏斗轮廓 draw-line（进入视口描绘一次，1.2s）
  useGSAP(
    () => {
      const svg = funnelRef.current;
      if (!svg) return;
      const paths = svg.querySelectorAll<SVGPathElement>('[data-draw]');
      paths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.to(paths, {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: { trigger: svg, start: 'top 80%', once: true },
      });
    },
    { scope: funnelRef },
  );

  return (
    <section
      id="knowledge-map"
      className="mx-auto max-w-[1280px] scroll-mt-20 px-6 py-24 max-md:px-4"
      aria-label="知识地图"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="font-serif text-h2 text-ink"
        >
          知识地图
        </motion.h2>
        <div className="flex items-center gap-5 text-small text-ink-3">
          <span className="inline-flex items-center gap-2">
            难度
            <span className="inline-flex gap-0.5" aria-hidden="true">
              {[1, 2, 3].map((n) => (
                <span key={n} className="inline-flex items-center gap-0.5">
                  {Array.from({ length: n }).map((_, i) => (
                    <span key={i} className="inline-block h-1.5 w-1.5 rotate-45 bg-ink-3" />
                  ))}
                </span>
              ))}
            </span>
            入门 → 高级
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" /> = 含核心图
          </span>
        </div>
      </div>

      {/* 矩阵卡 */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mt-8 overflow-hidden rounded-figure border border-line bg-surface shadow-card"
      >
        <div className="overflow-x-auto">
          <div className="min-w-[960px] px-8 pb-8 pt-0 md:px-10">
            {/* 顶部漏斗轮廓（5 条渐宽竖带隐喻漏斗收窄） */}
            <svg
              ref={funnelRef}
              viewBox="0 0 880 56"
              className="mt-4 w-full"
              aria-hidden="true"
            >
              <path data-draw d="M40 8 L840 8" fill="none" stroke="#CFC2AD" strokeWidth="2" />
              <path data-draw d="M120 26 L760 26" fill="none" stroke="#CFC2AD" strokeWidth="2" />
              <path data-draw d="M220 44 L660 44" fill="none" stroke="#B3512E" strokeWidth="2" />
            </svg>

            {/* 列头 */}
            <div
              className="grid gap-2 border-b border-line pb-3"
              style={{ gridTemplateColumns: '56px repeat(5, 1fr)' }}
            >
              <span />
              {STAGES.map((stage, i) => (
                <div key={stage} className="text-center">
                  <div
                    className="mx-auto mb-1.5 h-0.5 rounded-full bg-accent"
                    style={{ width: `${88 - i * 14}%` }}
                    aria-hidden="true"
                  />
                  <span className="text-label text-ink-3">{stage}</span>
                </div>
              ))}
            </div>

            {/* 行：篇章 */}
            {chapters.map((chapter, rowIdx) => {
              const theme = CHAPTER_THEMES[chapter.slug];
              const cells = MATRIX[chapter.slug];
              let chipDelay = 0;
              return (
                <div
                  key={chapter.slug}
                  className="group grid gap-2 border-b border-line py-4 last:border-b-0"
                  style={{ gridTemplateColumns: '56px repeat(5, 1fr)' }}
                >
                  {/* 篇章侧签 */}
                  <div
                    className="flex flex-col items-center gap-1.5 rounded-l-lg py-2 transition-colors"
                    style={{ backgroundColor: theme.hue }}
                  >
                    <ChapterIcon icon={chapter.icon} size={16} color="#FFFDF9" />
                    <span
                      className="text-[11px] font-medium tracking-widest text-[#FFFDF9]"
                      style={{ writingMode: 'vertical-rl' }}
                    >
                      {chapter.title}
                    </span>
                  </div>
                  {/* 单元格 */}
                  {STAGES.map((stage) => {
                    const ids = cells[stage] ?? [];
                    const cell = (
                      <div
                        key={stage}
                        className="flex min-h-[52px] flex-wrap content-start items-start gap-1.5 rounded-lg px-1.5 py-1.5 transition-colors group-hover:bg-[var(--row-tint)]"
                        style={{ ['--row-tint' as string]: theme.tint }}
                      >
                        {ids.map((id) => {
                          chipDelay += 0.03;
                          return (
                            <SectionChip
                              key={id}
                              sectionId={id}
                              hue={theme.hue}
                              hasCoreFigure={coreFigureSections.has(id)}
                              delay={chipDelay + rowIdx * 0.05}
                            />
                          );
                        })}
                      </div>
                    );
                    return cell;
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
