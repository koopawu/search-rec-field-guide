// fig-traffic-regulation-ladder：流量调控四阶段演进
// site_ia.md §4.3：四级上升台阶：强插（粗暴）→ 提权（敏感难控）→ 保量（可控）
// → 差异化保量（100-500 区间条：基础100 + 质量+200 + 作者+200，最优）

import { DT, type DiagramProps } from '../tokens';
import { Txt } from './helpers';

const STEPS = [
  { name: '强插', tag: '粗暴', note: '占坑位硬插，伤害体验', tone: 0 },
  { name: '提权', tag: '敏感难控', note: '分数 ×boost 系数，难量化', tone: 0 },
  { name: '保量', tag: '可控', note: '24h 保 100 次曝光目标线', tone: 1 },
  { name: '差异化保量', tag: '最优', note: '按质量/作者分档 100-500 次', tone: 1 },
];

export default function FigTrafficRegulationLadder({
  hue = '#B08A2E',
  tint = '#F5EDDA',
}: DiagramProps) {
  const stepW = 190;
  const gap = 18;
  const x0 = 44;
  const baseY = 420;
  const stepH = 78;

  return (
    <svg viewBox="0 0 880 520" width="100%" role="img" aria-label="流量调控四阶段演进">
      <Txt x={x0} y={36} anchor="start" bold fill={DT.ink}>
        新内容扶持技术的四阶段演进
      </Txt>
      <Txt x={x0} y={58} anchor="start" size={11.5} fill={DT.ink3}>
        可控性与精细度逐级提升 →
      </Txt>

      {STEPS.map((s, i) => {
        const x = x0 + i * (stepW + gap);
        const y = baseY - (i + 1) * stepH;
        return (
          <g key={s.name}>
            <rect x={x} y={y} width={stepW} height={(i + 1) * stepH} rx={DT.nodeRadius} fill={s.tone ? tint : DT.surface2} stroke={s.tone ? hue : DT.ink2} strokeWidth={DT.strokeWidth} />
            <Txt x={x + stepW / 2} y={y + 32} bold size={13.5} fill={DT.ink}>
              {i + 1}. {s.name}
            </Txt>
            <Txt x={x + stepW / 2} y={y + 56} size={11.5} bold fill={i === 3 ? DT.success : i < 2 ? DT.danger : DT.warning}>
              {s.tag}
            </Txt>
            <Txt x={x + stepW / 2} y={y + 78} size={10.5} fill={DT.ink3}>
              {s.note}
            </Txt>
          </g>
        );
      })}

      {/* 差异化保量区间条（第 4 级放大） */}
      <g>
        <Txt x={x0 + 3 * (stepW + gap) + stepW / 2} y={baseY - 4 * stepH - 16} size={11.5} bold fill={hue}>
          100-500 次区间构成
        </Txt>
        <rect x={x0 + 3 * (stepW + gap)} y={baseY - 4 * stepH + 186} width={64} height={18} rx={4} fill={hue} opacity={0.5} />
        <rect x={x0 + 3 * (stepW + gap) + 64} y={baseY - 4 * stepH + 186} width={64} height={18} rx={4} fill={hue} opacity={0.32} />
        <rect x={x0 + 3 * (stepW + gap) + 128} y={baseY - 4 * stepH + 186} width={62} height={18} rx={4} fill={hue} opacity={0.16} />
        <Txt x={x0 + 3 * (stepW + gap) + stepW / 2} y={baseY - 4 * stepH + 226} size={10} fill={DT.ink3}>
          基础100 + 质量+200 + 作者+200
        </Txt>
      </g>

      {/* 地面 */}
      <line x1={x0 - 10} y1={baseY} x2={x0 + 4 * (stepW + gap)} y2={baseY} stroke={DT.lineStrong} strokeWidth={DT.strokeWidth} />

      {/* 代表平台实践 */}
      <Txt x={x0} y={baseY + 30} anchor="start" size={11} fill={DT.ink3}>
        代表实践：早期运营强插 → 快手/抖音提权池 → 保量机制 → 头部平台差异化保量
      </Txt>
    </svg>
  );
}
