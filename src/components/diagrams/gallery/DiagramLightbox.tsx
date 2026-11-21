// 图示 Lightbox（design/diagrams.md §S4）：
// 全屏遮罩 + 居中面板；Esc/遮罩关闭；←/→ 在当前筛选集内切换；切换时 x 滑入滑出
import { useCallback, useEffect } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { diagramRegistry } from '../registry';
import type { GalleryItem } from './data';

export default function DiagramLightbox({
  item,
  items,
  onClose,
  onSwitch,
}: {
  /** 当前展示的图（null = 关闭） */
  item: GalleryItem | null;
  /** 当前筛选结果集（←/→ 在此集合内循环） */
  items: GalleryItem[];
  onClose: () => void;
  onSwitch: (item: GalleryItem) => void;
}) {
  const step = useCallback(
    (dir: 1 | -1) => {
      if (!item || items.length === 0) return;
      const idx = items.findIndex((i) => i.diagramId === item.diagramId);
      const next = items[(idx + dir + items.length) % items.length];
      if (next) onSwitch(next);
    },
    [item, items, onSwitch],
  );

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [item, onClose, step]);

  const Component = item ? diagramRegistry[item.diagramId] : undefined;

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="diagram-lightbox-mask"
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-8"
          style={{ backgroundColor: 'rgba(44,38,32,.55)', backdropFilter: 'blur(6px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`图示详情：${item.title}`}
        >
          <motion.div
            key="diagram-lightbox-panel"
            className="max-h-full w-full max-w-[960px] overflow-y-auto rounded-figure bg-surface p-6 shadow-card-hover md:p-8"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 顶部：图题 + id + 关闭 */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-h2 text-ink">{item.title}</h2>
                <p className="mt-1 font-mono text-small text-ink-3">{item.diagramId}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="关闭"
                className="rounded-lg border border-line bg-surface p-2 text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* 中部：SVG 大图（切换时滑动过渡） */}
            <div className="relative mt-5 rounded-lg bg-surface-2 p-4">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={item.diagramId}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  {Component && <Component hue={item.hue} tint={item.tint} />}
                </motion.div>
              </AnimatePresence>

              {/* ←/→ 切换 */}
              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="上一幅图示"
                    onClick={() => step(-1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-line bg-surface p-2 text-ink-2 shadow-card transition-colors hover:text-ink"
                  >
                    <ChevronLeft size={18} strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    aria-label="下一幅图示"
                    onClick={() => step(1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-line bg-surface p-2 text-ink-2 shadow-card transition-colors hover:text-ink"
                  >
                    <ChevronRight size={18} strokeWidth={1.5} />
                  </button>
                </>
              )}
            </div>

            {/* 底部两栏：图解 + 出现于 */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-label text-ink-3">图解</p>
                <p className="mt-2 text-body text-ink-2">{item.altText || item.caption}</p>
              </div>
              <div>
                <p className="text-label text-ink-3">出现于以下小节</p>
                <ul className="mt-2 space-y-2">
                  {item.sections.map((s) => (
                    <li key={s.sectionId}>
                      <Link
                        to={s.path}
                        onClick={onClose}
                        className="link-underline text-body text-ink-2 hover:text-ink"
                      >
                        <span className="mr-2 font-mono text-small text-ink-3">{s.no}</span>
                        {s.title}
                      </Link>
                    </li>
                  ))}
                  {item.sections.length === 0 && (
                    <li className="text-small text-ink-3">暂未被小节引用</li>
                  )}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
