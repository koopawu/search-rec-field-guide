// S5 · 篇章入口（home.md §S5）：2×3 卡片栅格
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { chapters, CHAPTER_THEMES } from '@/content';
import ChapterIcon from '@/components/ChapterIcon';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function ChapterGrid() {
  return (
    <section
      id="chapters"
      className="mx-auto max-w-[1280px] scroll-mt-20 px-6 py-24 max-md:px-4"
      aria-label="六大篇章"
    >
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: EASE }}
        className="font-serif text-h2 text-ink"
      >
        六大篇章
      </motion.h2>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {chapters.map((chapter, i) => {
          const theme = CHAPTER_THEMES[chapter.slug];
          const minutes = chapter.sections.reduce((s, sec) => s + sec.estimatedMinutes, 0);
          return (
            <motion.div
              key={chapter.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            >
              <Link
                to={`/chapters/${chapter.slug}`}
                className="group relative block h-[240px] overflow-hidden rounded-figure border border-line bg-surface p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
              >
                {/* 左侧篇章色竖条（hover 6→10px） */}
                <span
                  className="absolute inset-y-0 left-0 w-1.5 transition-all duration-300 group-hover:w-2.5"
                  style={{ backgroundColor: theme.hue }}
                  aria-hidden="true"
                />
                {/* 超大号篇章序数（半出血） */}
                <span
                  className="absolute -right-2 -top-6 select-none font-serif text-[96px] font-bold leading-none transition-opacity duration-300"
                  style={{ color: theme.hue, opacity: 0.12 }}
                  aria-hidden="true"
                >
                  {String(chapter.order).padStart(2, '0')}
                </span>
                <span className="absolute -right-2 -top-6 hidden select-none font-serif text-[96px] font-bold leading-none group-hover:block" style={{ color: theme.hue, opacity: 0.2 }} aria-hidden="true">
                  {String(chapter.order).padStart(2, '0')}
                </span>

                <ChapterIcon icon={chapter.icon} size={28} color={theme.hue} />
                <h3 className="mt-3 font-serif text-h2 text-ink">{chapter.title}</h3>
                <p className="mt-2 line-clamp-2 text-body text-ink-2">{chapter.subtitle}</p>

                <div className="absolute inset-x-6 bottom-5 flex items-center justify-between">
                  <span className="text-small text-ink-3">
                    {chapter.sections.length} 个小节 · 约 {minutes} 分钟
                  </span>
                  <span
                    className="inline-flex items-center gap-1 text-body font-medium"
                    style={{ color: theme.hue }}
                  >
                    进入篇章
                    <ArrowRight
                      size={15}
                      strokeWidth={1.5}
                      className="transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
