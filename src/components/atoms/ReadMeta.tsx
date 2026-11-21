import { Clock } from 'lucide-react';
import type { Difficulty } from '@/content';
import DifficultyBadge from './DifficultyBadge';

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  foundational: '入门',
  intermediate: '进阶',
  advanced: '高级',
};

/** ReadMeta：`⏱ N 分钟 · 难度 · 更新日期` 元信息行 */
export default function ReadMeta({
  minutes,
  difficulty,
  updatedAt,
  className = '',
}: {
  minutes: number;
  difficulty?: Difficulty;
  /** ISO date，显示为「更新于 YYYY-MM」 */
  updatedAt?: string;
  className?: string;
}) {
  const updated = updatedAt ? updatedAt.slice(0, 7) : undefined;
  return (
    <span className={`inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-small text-ink-3 ${className}`}>
      <span className="inline-flex items-center gap-1">
        <Clock size={13} strokeWidth={1.5} aria-hidden="true" />
        <span className="font-mono">{minutes}</span> 分钟
      </span>
      {difficulty && (
        <>
          <span aria-hidden="true">·</span>
          <DifficultyBadge difficulty={difficulty} showLabel={false} />
          <span>{DIFFICULTY_LABEL[difficulty]}</span>
        </>
      )}
      {updated && (
        <>
          <span aria-hidden="true">·</span>
          <span>
            更新于 <span className="font-mono">{updated}</span>
          </span>
        </>
      )}
    </span>
  );
}
