// 小节阅读页 · 右栏本页目录（section.md S0）：block.heading 锚点 + scrollspy
// 当前项篇章色 + 左侧 2px 指示条位移动画（framer-motion layoutId，0.25s）
import { motion } from 'framer-motion';
import { scrollToAnchor, useScrollSpy } from './scrollSpy';

export interface TocItem {
  id: string;
  label: string;
}

/** 目录项列表（桌面右栏与 mobile 折叠条共用） */
export function TocList({
  items,
  active,
  hue,
  onNavigate,
}: {
  items: TocItem[];
  active: string;
  hue: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className="space-y-0.5">
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <li key={item.id} className="relative">
            {isActive && (
              <motion.span
                layoutId="toc-active-indicator"
                className="absolute left-0 top-1 h-[calc(100%-8px)] w-0.5"
                style={{ backgroundColor: hue }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
            <button
              type="button"
              onClick={() => {
                scrollToAnchor(item.id);
                onNavigate?.();
              }}
              className={`block w-full py-1.5 pl-3 text-left text-small transition-colors ${
                isActive ? 'font-medium' : 'text-ink-3 hover:text-ink-2'
              }`}
              style={isActive ? { color: hue } : undefined}
            >
              {item.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** 桌面右栏目录（sticky 容器由页面控制） */
export default function SectionToc({ items, hue }: { items: TocItem[]; hue: string }) {
  const active = useScrollSpy(items.map((i) => i.id));
  if (!items.length) return null;
  return (
    <nav aria-label="本页目录">
      <p className="text-label text-ink-3">本页目录</p>
      <div className="mt-4">
        <TocList items={items} active={active} hue={hue} />
      </div>
    </nav>
  );
}
