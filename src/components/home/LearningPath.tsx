// S4 · 7 天进阶学习路径（home.md §S4）：纵向时间轴 + GSAP scrub 生长 + localStorage 打卡
// 本组件树统一使用 GSAP（滚动驱动），不使用 Framer Motion（库隔离）
import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { getSection, getSectionChapter, getSectionNo, sectionPath, CHAPTER_THEMES } from '@/content';
import { path7day } from '@/content/site';
import { SectionNo } from '@/components/atoms';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function readDone(sectionId: string): boolean {
  try {
    return window.localStorage.getItem(`srkb:read:${sectionId}`) === '1';
  } catch {
    return false;
  }
}

function writeDone(sectionId: string, done: boolean) {
  try {
    window.localStorage.setItem(`srkb:read:${sectionId}`, done ? '1' : '0');
  } catch {
    /* ignore */
  }
}

/** 完成度环（SVG circle stroke-dashoffset） */
function ProgressRing({ ratio, hue }: { ratio: number; hue: string }) {
  const r = 15;
  const c = 2 * Math.PI * r;
  return (
    <svg width={40} height={40} viewBox="0 0 40 40" aria-label={`完成度 ${Math.round(ratio * 100)}%`}>
      <circle cx={20} cy={20} r={r} fill="none" stroke="#E4DACA" strokeWidth={3} />
      <circle
        cx={20}
        cy={20}
        r={r}
        fill="none"
        stroke={hue}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - ratio)}
        transform="rotate(-90 20 20)"
        style={{ transition: 'stroke-dashoffset 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      />
      <text x={20} y={24} textAnchor="middle" fontSize={10} fill="#57503F" fontFamily="JetBrains Mono, monospace">
        {Math.round(ratio * 100)}%
      </text>
    </svg>
  );
}

export default function LearningPath() {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [, setTick] = useState(0); // localStorage 变更后重渲染

  const toggleRead = useCallback((sectionId: string, done: boolean) => {
    writeDone(sectionId, done);
    setTick((t) => t + 1);
  }, []);

  useGSAP(
    () => {
      // 中央竖线 scrub 生长
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top 70%',
              end: 'bottom 60%',
              scrub: 0.5,
            },
          },
        );
      }
      // Day 卡交替从左右 40px 外 fade-in
      gsap.utils.toArray<HTMLElement>('[data-day-card]').forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 85%', once: true },
          },
        );
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      id="learning-path"
      className="mx-auto max-w-[1280px] scroll-mt-20 px-6 py-24 max-md:px-4"
      aria-label="7 天进阶路径"
    >
      <div className="text-center">
        <h2 className="font-serif text-h2 text-ink">7 天进阶路径</h2>
        <p className="mt-3 text-body text-ink-2">{path7day.description}</p>
      </div>

      <div ref={rootRef} className="relative mt-14">
        {/* 中央竖线 */}
        <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 max-md:left-3" aria-hidden="true">
          <div ref={lineRef} className="h-full w-full origin-top bg-line-strong" />
        </div>

        <div className="space-y-12">
          {path7day.days.map((day, i) => {
            const left = i % 2 === 0;
            const firstChapter = getSectionChapter(day.sectionIds[0]);
            const hue = firstChapter ? CHAPTER_THEMES[firstChapter.slug].hue : 'var(--accent)';
            const doneCount = day.sectionIds.filter((id) => readDone(id)).length;
            const totalMin = day.sectionIds.reduce(
              (s, id) => s + (getSection(id)?.estimatedMinutes ?? 0),
              0,
            );
            return (
              <div
                key={day.day}
                data-day-card
                className={`relative flex ${left ? 'justify-start' : 'justify-end'} max-md:justify-start`}
              >
                {/* 节点圆点 */}
                <span
                  className="absolute left-1/2 top-7 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-surface max-md:left-3"
                  style={{ backgroundColor: hue }}
                  aria-hidden="true"
                />
                <div
                  className={`w-[46%] max-md:ml-10 max-md:w-[calc(100%-2.5rem)] ${
                    left ? 'pr-0' : ''
                  }`}
                >
                  <div className="relative rounded-card border border-line bg-surface p-6 shadow-card">
                    <div className="absolute right-4 top-4">
                      <ProgressRing ratio={day.sectionIds.length ? doneCount / day.sectionIds.length : 0} hue={hue} />
                    </div>
                    <p className="text-label" style={{ color: 'var(--accent)' }}>
                      Day {day.day}
                    </p>
                    <h3 className="mt-1 font-serif text-h3 text-ink">{day.theme}</h3>
                    <p className="mt-1 text-small text-ink-3">
                      {day.sectionIds.length} 个小节 · 约 {totalMin} 分钟
                    </p>

                    <ul className="mt-4 space-y-1.5">
                      {day.sectionIds.map((id) => {
                        const section = getSection(id);
                        if (!section) return null;
                        const ch = getSectionChapter(id);
                        const chHue = ch ? CHAPTER_THEMES[ch.slug].hue : hue;
                        const done = readDone(id);
                        return (
                          <li key={id} className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => navigate(sectionPath(section))}
                              className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-surface-2"
                            >
                              <SectionNo no={getSectionNo(id)} color={chHue} size={22} />
                              <span
                                className={`truncate text-body ${
                                  done ? 'text-ink-3 line-through' : 'text-ink-2'
                                }`}
                              >
                                {section.title}
                              </span>
                              <span className="ml-auto shrink-0 font-mono text-small text-ink-3">
                                {section.estimatedMinutes}min
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleRead(id, !done)}
                              aria-pressed={done}
                              aria-label={`标记「${section.title}」${done ? '未读' : '已读'}`}
                              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors"
                              style={{
                                borderColor: chHue,
                                backgroundColor: done ? chHue : 'transparent',
                              }}
                            >
                              {done && (
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                                  <path d="M1 4 L3.5 6.5 L9 1" stroke="#FFFDF9" strokeWidth="1.5" />
                                </svg>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="mt-4 rounded-lg bg-surface-2 px-4 py-3">
                      <p className="text-label text-ink-3">今日自测</p>
                      <p className="mt-1 text-small text-ink-2">{day.checkpoint}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
