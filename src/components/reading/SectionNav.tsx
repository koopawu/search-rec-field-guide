// 小节阅读页 · 左栏篇章导航（section.md S0）
// 篇章名（Label + 篇章色）+ 本篇小节竖向列表，当前节篇章色左边条 + tint 底，已读节带 ✓
import { Link } from 'react-router';
import { Check } from 'lucide-react';
import type { LoadedChapter } from '@/content';
import { CHAPTER_THEMES, getSectionNo, sectionPath } from '@/content';
import { SectionNo } from '@/components/atoms';
import { useReadChecker } from './readState';

export default function SectionNav({
  chapter,
  currentId,
  onNavigate,
}: {
  chapter: LoadedChapter;
  currentId: string;
  onNavigate?: () => void;
}) {
  const theme = CHAPTER_THEMES[chapter.slug];
  const isRead = useReadChecker();

  return (
    <nav aria-label="本篇章节">
      <Link
        to={`/chapters/${chapter.slug}`}
        onClick={onNavigate}
        className="text-label transition-opacity hover:opacity-75"
        style={{ color: theme.hue }}
      >
        {chapter.title} · CHAPTER 0{chapter.order}
      </Link>
      <ul className="mt-4 space-y-0.5">
        {chapter.sections.map((s) => {
          const active = s.sectionId === currentId;
          const read = isRead(s.sectionId);
          return (
            <li key={s.sectionId}>
              <Link
                to={sectionPath(s)}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-2.5 rounded-r-lg border-l-2 px-3 py-2 text-small transition-colors ${
                  active ? 'font-medium text-ink' : 'text-ink-2 hover:bg-surface-2 hover:text-ink'
                }`}
                style={
                  active
                    ? { borderColor: theme.hue, backgroundColor: theme.tint }
                    : { borderColor: 'transparent' }
                }
              >
                <SectionNo
                  no={getSectionNo(s.sectionId)}
                  color={active ? theme.hue : 'var(--ink-3)'}
                  size={22}
                />
                <span className="min-w-0 flex-1 truncate">{s.title}</span>
                {read && (
                  <Check
                    size={13}
                    strokeWidth={2}
                    color={theme.hue}
                    className="shrink-0"
                    aria-label="已读"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
