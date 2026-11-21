// 画廊卡片（design/diagrams.md §S3）：SVG 缩略 + 标题 + diagramId + 分类胶囊 + 出现于
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';
import { diagramRegistry } from '../registry';
import type { GalleryItem } from './data';

/** 懒挂载 SVG：进入视口附近才渲染，避免首屏一次性挂载 50 张图 */
function LazyDiagram({ item }: { item: GalleryItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          ob.disconnect();
        }
      },
      { rootMargin: '240px' },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  const Component = diagramRegistry[item.diagramId];
  return (
    <div ref={ref} className="rounded-lg bg-surface-2 p-3">
      {visible && Component ? <Component hue={item.hue} tint={item.tint} /> : <div className="aspect-[880/500]" />}
    </div>
  );
}

export default function DiagramCard({
  item,
  index,
  onOpen,
}: {
  item: GalleryItem;
  index: number;
  onOpen: (item: GalleryItem) => void;
}) {
  const shownSections = item.sections.slice(0, 2);
  const extra = item.sections.length - shownSections.length;
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 9) * 0.05, ease: 'easeOut' }}
      className="dgallery-card group relative cursor-pointer overflow-hidden rounded-figure border border-line bg-surface p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
      onClick={() => onOpen(item)}
      role="button"
      tabIndex={0}
      aria-label={`放大查看：${item.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(item);
        }
      }}
    >
      {/* hover 重播 draw-line */}
      <style>{`
        .dgallery-card:hover svg :where(path, line, circle, ellipse, rect) {
          animation: dgallery-draw 1.2s ease-out;
        }
        @keyframes dgallery-draw {
          from { stroke-dashoffset: 60; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>

      {/* 核心图小圆章 */}
      {item.isCore && (
        <span className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-[#FFFDF9] shadow-card">
          核心
        </span>
      )}

      {/* hover 放大按钮 */}
      <span className="absolute right-4 top-16 z-10 flex items-center gap-1 rounded-lg border border-line bg-surface px-2 py-1 text-small text-ink-2 opacity-0 shadow-card transition-opacity duration-200 group-hover:opacity-100">
        <Maximize2 size={13} strokeWidth={1.5} aria-hidden="true" />
        放大
      </span>

      {/* SVG 缩略 */}
      <LazyDiagram item={item} />

      {/* 卡体 */}
      <h3 className="mt-4 text-body font-bold text-ink">{item.title}</h3>
      <p className="mt-1 font-mono text-[11px] text-ink-3">{item.diagramId}</p>
      <span
        className="mt-2 inline-block rounded-full px-2.5 py-0.5 text-label"
        style={{ backgroundColor: item.tint, color: item.hue }}
      >
        {item.categoryLabel}
      </span>

      {/* 卡底：出现于 */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-line pt-3">
        <span className="text-small text-ink-3">出现于</span>
        {shownSections.map((s) => (
          <Link
            key={s.sectionId}
            to={s.path}
            onClick={(e) => e.stopPropagation()}
            className="rounded-md border border-line bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
          >
            {s.no}
          </Link>
        ))}
        {extra > 0 && <span className="font-mono text-[11px] text-ink-3">+{extra}</span>}
      </div>
    </motion.article>
  );
}
