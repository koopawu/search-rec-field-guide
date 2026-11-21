import type { Difficulty } from '@/content';

const DIFFICULTY_META: Record<Difficulty, { label: string; level: 1 | 2 | 3 }> = {
  foundational: { label: '入门', level: 1 },
  intermediate: { label: '进阶', level: 2 },
  advanced: { label: '高级', level: 3 },
};

/** DifficultyBadge：难度徽标（1/2/3 个实心菱形 ◆） */
export default function DifficultyBadge({
  difficulty,
  showLabel = true,
  color = 'var(--ink-3)',
}: {
  difficulty: Difficulty;
  showLabel?: boolean;
  color?: string;
}) {
  const meta = DIFFICULTY_META[difficulty];
  return (
    <span className="inline-flex items-center gap-1 text-small" style={{ color }}>
      <span className="inline-flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className="inline-block h-1.5 w-1.5 rotate-45"
            style={{ backgroundColor: i <= meta.level ? color : 'var(--line-strong)' }}
          />
        ))}
      </span>
      {showLabel && <span>{meta.label}</span>}
      <span className="sr-only">难度：{meta.label}</span>
    </span>
  );
}
