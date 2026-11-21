import type { ChapterSlug } from '@/content';
import { CHAPTER_THEMES, getChapter } from '@/content';
import ChapterIcon from '@/components/ChapterIcon';

/** ChapterTag：篇章胶囊标签（icon + 篇章名，篇章色 tint 底 + 篇章色文字） */
export default function ChapterTag({
  slug,
  size = 'md',
}: {
  slug: ChapterSlug;
  size?: 'sm' | 'md';
}) {
  const chapter = getChapter(slug);
  const theme = CHAPTER_THEMES[slug];
  if (!chapter) return null;
  return (
    <span
      className={
        size === 'sm'
          ? 'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-label'
          : 'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-label'
      }
      style={{ backgroundColor: theme.tint, color: theme.hue }}
    >
      <ChapterIcon icon={chapter.icon} size={size === 'sm' ? 12 : 14} color={theme.hue} />
      {chapter.title}
    </span>
  );
}
