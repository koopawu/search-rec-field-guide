// 图示库筛选工具条（design/diagrams.md §S2，sticky top-16）
// 左：分类胶囊 Tab（Framer Motion layoutId 滑动指示块）；
// 右：「仅看核心图」开关 + 图名搜索（防抖 200ms，由页面层处理）
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { GALLERY_CATEGORIES, type GalleryCategoryId } from './data';

export type CategoryFilter = GalleryCategoryId | 'all';

const TABS: Array<{ id: CategoryFilter; label: string }> = [
  { id: 'all', label: '全部' },
  ...GALLERY_CATEGORIES.map((c) => ({ id: c.id as CategoryFilter, label: c.label })),
];

export default function GalleryFilterBar({
  category,
  onCategory,
  coreOnly,
  onCoreOnly,
  query,
  onQuery,
}: {
  category: CategoryFilter;
  onCategory: (c: CategoryFilter) => void;
  coreOnly: boolean;
  onCoreOnly: (v: boolean) => void;
  query: string;
  onQuery: (v: string) => void;
}) {
  return (
    <div className="sticky top-16 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-auto min-h-14 max-w-[1280px] flex-wrap items-center justify-between gap-3 px-6 py-2 max-md:px-4">
        {/* 分类 Tab 组 */}
        <div className="flex flex-wrap items-center gap-1" role="tablist" aria-label="图示分类">
          {TABS.map((t) => {
            const active = category === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onCategory(t.id)}
                className={`relative rounded-full px-3.5 py-1.5 text-small transition-colors ${
                  active ? 'text-[#FFFDF9]' : 'text-ink-2 hover:text-ink'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="dgallery-tab-indicator"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={{ type: 'spring', duration: 0.3 }}
                  />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* 右：核心开关 + 搜索 */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            role="switch"
            aria-checked={coreOnly}
            onClick={() => onCoreOnly(!coreOnly)}
            className="flex items-center gap-2 text-small text-ink-2"
          >
            <span
              className={`relative h-5 w-9 rounded-full transition-colors ${coreOnly ? 'bg-accent' : 'bg-line-strong'}`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-surface shadow transition-all ${
                  coreOnly ? 'left-[18px]' : 'left-0.5'
                }`}
              />
            </span>
            仅看核心图
          </button>
          <label className="flex items-center gap-1.5 rounded-lg border border-line bg-surface-2 px-2.5 py-1.5">
            <Search size={14} strokeWidth={1.5} className="text-ink-3" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="搜索图名 / id…"
              aria-label="搜索图名"
              className="w-36 bg-transparent text-small text-ink outline-none placeholder:text-ink-3 md:w-44"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
