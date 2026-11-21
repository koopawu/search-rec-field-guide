// S1 · Hero 区（home.md §S1）：左文案（55%）+ 右插画（45%），stagger fade-up + 词级 split
import { useEffect, useMemo, useState } from 'react';
import { motion, animate } from 'framer-motion';
import { siteStats } from '@/content';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: EASE },
});

/** 数据带数字滚动（1.2s easeOut） */
function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      delay: 0.6,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value]);
  return <span className="font-mono text-[26px] font-medium text-ink">{display}</span>;
}

/** 词级 split 浮现的主标题 */
function SplitTitle({ lines }: { lines: string[] }) {
  const words = useMemo(
    () => lines.map((line) => Array.from(line)),
    [lines],
  );
  let idx = 0;
  return (
    <h1 className="font-serif text-[36px] font-bold leading-[1.15] text-ink md:text-[52px]">
      {words.map((chars, li) => (
        <span key={li} className="block overflow-hidden">
          {chars.map((ch) => {
            const d = 0.15 + idx++ * 0.06;
            return (
              <motion.span
                key={`${li}-${idx}`}
                className="inline-block"
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: d, ease: EASE }}
              >
                {ch}
              </motion.span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

export default function Hero() {
  const stats: Array<[number, string]> = [
    [siteStats.chapterCount, '篇章'],
    [siteStats.sectionCount, '小节'],
    [50, '图示'],
    [8, '份调研简报'],
  ];

  const goAnchor = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative border-b border-line" aria-label="首屏">
      <div className="mx-auto flex min-h-[calc(100dvh-64px)] max-w-[1280px] flex-col items-center gap-10 px-6 py-16 max-md:px-4 lg:flex-row lg:gap-16">
        {/* 左栏 55% */}
        <div className="flex-1 lg:max-w-[55%]">
          <motion.div {...fadeUp(0)} className="flex items-center gap-3">
            <span className="h-0.5 w-8 bg-accent" aria-hidden="true" />
            <span className="text-label text-ink-3">FIELD GUIDE FOR DISTRIBUTION STRATEGY</span>
          </motion.div>

          <div className="mt-6">
            <SplitTitle lines={['搜索与推荐算法的', '策略产品实战手册']} />
          </div>

          <motion.p {...fadeUp(0.5)} className="mt-6 max-w-[560px] text-body-l text-ink-2">
            6 大篇章 · 34 个小节 · 50 幅架构图示，系统讲透搜索引擎与推荐系统的算法原理、分发策略与
            LLM 时代演进——写给正在向分发负责人进阶的你。
          </motion.p>

          <motion.div {...fadeUp(0.62)} className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => goAnchor('learning-path')}
              className="rounded-lg bg-accent px-6 py-3 text-body font-medium text-[#FFFDF9] transition-all hover:translate-y-[1px] hover:bg-accent-deep"
            >
              开始学习 · Day 1
            </button>
            <button
              type="button"
              onClick={() => goAnchor('knowledge-map')}
              className="rounded-lg border border-line-strong bg-surface px-6 py-3 text-body font-medium text-ink transition-all hover:translate-y-[1px] hover:border-ink-3"
            >
              浏览知识地图
            </button>
          </motion.div>

          {/* 数据带 */}
          <motion.div {...fadeUp(0.74)} className="mt-12 flex items-center">
            {stats.map(([value, label], i) => (
              <div key={label} className="flex items-center">
                {i > 0 && <span className="mx-5 h-8 w-px bg-line-strong" aria-hidden="true" />}
                <div className="flex flex-col gap-1">
                  <CountUp value={value} />
                  <span className="text-label text-ink-3">{label}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 右栏 45%：插画 */}
        <motion.figure
          className="flex-1 lg:max-w-[45%]"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.3, ease: EASE }}
        >
          <img
            src="/hero-funnel-illustration.svg"
            alt="暖纸质感插画：摊开的手册上方悬浮着多层漏斗过滤装置，低饱和色块小球从顶层散落到底层"
            width={1600}
            height={1200}
            className="aspect-[4/3] w-full rounded-figure border border-line object-cover shadow-card"
            loading="eager"
          />
          <figcaption className="mt-3 text-center text-small text-ink-3">
            召回决定上限，精排决定精度，重排是策略主战场。
          </figcaption>
        </motion.figure>
      </div>

      {/* 滚动提示 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
        <span className="animate-scroll-hint text-label text-ink-3">向下滚动 ↓</span>
      </div>
    </section>
  );
}
