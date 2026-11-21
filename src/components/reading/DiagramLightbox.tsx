// 图示 Lightbox（chapter.md S4 / section.md §4.6 共用的放大查看层）
// 大图 + altText 全文 + 「出现于以下小节」链接列表
import { useEffect } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { allSections, getSectionNo, sectionPath } from '@/content';
import { DiagramFigure } from '@/components/diagrams/DiagramRegistry';

export interface LightboxDiagram {
  diagramId: string;
  caption: string;
  altText: string;
  hue: string;
  tint: string;
}

export default function DiagramLightbox({
  diagram,
  onClose,
}: {
  diagram: LightboxDiagram | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!diagram) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [diagram, onClose]);

  const usedIn = diagram ? allSections.filter((s) => s.diagramsUsed.includes(diagram.diagramId)) : [];

  return (
    <AnimatePresence>
      {diagram && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label={diagram.caption}
        >
          <button
            type="button"
            aria-label="关闭"
            className="absolute inset-0 cursor-default bg-[rgba(44,38,32,0.55)]"
            onClick={onClose}
          />
          <motion.div
            className="relative max-h-full w-full max-w-[960px] overflow-y-auto rounded-figure bg-surface p-6 shadow-card-hover sm:p-8"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="关闭大图"
              className="absolute right-4 top-4 z-10 inline-flex rounded-lg border border-line bg-surface p-2 text-ink-2 transition-colors hover:text-ink"
            >
              <X size={16} strokeWidth={1.5} />
            </button>

            <DiagramFigure
              diagramId={diagram.diagramId}
              hue={diagram.hue}
              tint={diagram.tint}
              className="[&_svg]:h-auto [&_svg]:w-full"
            />
            <p className="mt-4 text-center text-body font-medium text-ink">{diagram.caption}</p>
            <p className="mx-auto mt-3 max-w-[640px] text-small text-ink-2">{diagram.altText}</p>

            {usedIn.length > 0 && (
              <div className="mt-6 border-t border-line pt-4">
                <p className="text-label text-ink-3">出现于以下小节</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {usedIn.map((s) => (
                    <li key={s.sectionId}>
                      <Link
                        to={sectionPath(s)}
                        onClick={onClose}
                        className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-small text-ink-2 transition-colors hover:text-ink"
                      >
                        <span className="font-mono text-[11px]" style={{ color: diagram.hue }}>
                          {getSectionNo(s.sectionId)}
                        </span>
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
