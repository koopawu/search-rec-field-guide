// S6 · 精选小节（home.md §S6）：横向卡片带 / 桌面 4 列栅格
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { getSection, sectionPath } from '@/content';
import { featuredSections } from '@/content/site';
import { ChapterTag, ReadMeta } from '@/components/atoms';
import { DiagramFigure } from '@/components/diagrams/DiagramRegistry';
import { CHAPTER_THEMES } from '@/content';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function FeaturedSections() {
  const sections = featuredSections
    .map((id) => getSection(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <section className="mx-auto max-w-[1280px] px-6 py-24 max-md:px-4" aria-label="精选小节">
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: EASE }}
        className="font-serif text-h2 text-ink"
      >
        从此处开始
      </motion.h2>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {sections.map((section, i) => {
          const theme = CHAPTER_THEMES[section.chapterSlug];
          const diagramId = section.diagramsUsed[0];
          return (
            <motion.div
              key={section.sectionId}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            >
              <Link
                to={sectionPath(section)}
                className="group flex h-full flex-col rounded-card border border-line bg-surface p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
              >
                <ChapterTag slug={section.chapterSlug} size="sm" />
                <h3 className="mt-3 line-clamp-2 text-h3 font-serif text-ink">{section.title}</h3>
                <p className="mt-2 line-clamp-2 flex-1 text-body text-ink-2">{section.tagline}</p>
                <div className="mt-3">
                  <ReadMeta minutes={section.estimatedMinutes} difficulty={section.difficulty} />
                </div>
                {/* 核心图缩略预览（surface-2 底） */}
                {diagramId && (
                  <div className="pointer-events-none mt-4 overflow-hidden rounded-lg bg-surface-2 p-3">
                    <div className="origin-top scale-90 transition-transform duration-300 group-hover:scale-95">
                      <DiagramFigure
                        diagramId={diagramId}
                        hue={theme.hue}
                        tint={theme.tint}
                      />
                    </div>
                  </div>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
