// fig-mmr-dpp：MMR / DPP 多样性重排
// site_ia.md §4.5：左 MMR：候选集按 θ·相关性 − (1−θ)·最大相似度贪心挑选，
// 已选集 S 与新候选间画相似度连线；右 DPP：item 向量超平行体，体积（行列式）越大越多样

import { DT, type DiagramProps } from '../tokens';
import { Txt } from './helpers';

export default function FigMmrDpp({ hue = '#B0503C', tint = '#F6E4E0' }: DiagramProps) {
  // MMR：已选 S 两项 + 候选三项
  const sel = [{ x: 90, y: 90 }, { x: 90, y: 190 }];
  const cand = [
    { x: 290, y: 60, sim: 0.9, pick: false },
    { x: 290, y: 140, sim: 0.2, pick: true },
    { x: 290, y: 220, sim: 0.5, pick: false },
  ];
  return (
    <svg viewBox="0 0 880 440" width="100%" role="img" aria-label="MMR 与 DPP 多样性重排">
      {/* ===== 左：MMR ===== */}
      <Txt x={190} y={34} bold fill={DT.ink}>
        MMR：贪心边际收益
      </Txt>
      {/* 相似度连线 */}
      {cand.map((c, i) => (
        <g key={i}>
          {sel.map((s, j) => (
            <line key={j} x1={s.x + 34} y1={s.y} x2={c.x - 34} y2={c.y} stroke={c.pick ? DT.success : DT.danger} strokeWidth={c.pick ? 1 : 1.5} strokeDasharray={c.pick ? DT.dash : undefined} opacity={c.pick ? 0.7 : 1} />
          ))}
        </g>
      ))}
      {sel.map((s, i) => (
        <g key={i}>
          <rect x={s.x - 34} y={s.y - 18} width={68} height={36} rx={DT.nodeRadius} fill={tint} stroke={hue} strokeWidth={DT.strokeWidth} />
          <Txt x={s.x} y={s.y + 4} size={11} bold>
            S{i + 1}
          </Txt>
        </g>
      ))}
      <Txt x={90} y={250} size={11} fill={DT.ink3}>
        已选集 S
      </Txt>
      {cand.map((c, i) => (
        <g key={i}>
          <rect x={c.x - 34} y={c.y - 18} width={68} height={36} rx={DT.nodeRadius} fill={c.pick ? tint : DT.surface} stroke={c.pick ? DT.success : DT.ink3} strokeWidth={DT.strokeWidth} />
          <Txt x={c.x} y={c.y + 4} size={11} fill={DT.ink2}>
            候选{String.fromCharCode(65 + i)}
          </Txt>
          <Txt x={c.x + 44} y={c.y + 4} anchor="start" mono size={10.5} fill={c.pick ? DT.success : DT.ink3}>
            maxSim={c.sim}
          </Txt>
        </g>
      ))}
      <Txt x={330} y={168} size={11} fill={DT.success}>
        ✓ 选与 S 最不相似的
      </Txt>
      <rect x={30} y={300} width={380} height={40} rx={DT.nodeRadius} fill={DT.surface} stroke={hue} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
      <Txt x={220} y={325} mono size={12} fill={hue}>
        MMR = θ·相关性 − (1−θ)·max 与已选相似度
      </Txt>

      {/* 分隔 */}
      <line x1={440} y1={40} x2={440} y2={360} stroke={DT.lineStrong} strokeWidth={1} strokeDasharray={DT.dash} />

      {/* ===== 右：DPP ===== */}
      <Txt x={660} y={34} bold fill={DT.ink}>
        DPP：行列式点过程
      </Txt>
      {/* 向量与超平行体 */}
      <g transform="translate(560 240)">
        {/* 坐标轴 */}
        <line x1={0} y1={0} x2={180} y2={0} stroke={DT.ink3} strokeWidth={1} />
        <line x1={0} y1={0} x2={0} y2={-150} stroke={DT.ink3} strokeWidth={1} />
        {/* 平行四边形（体积=行列式） */}
        <path d="M0 0 L120 -30 L150 -110 L30 -80 Z" fill={tint} stroke={hue} strokeWidth={DT.strokeWidth} opacity={0.85} />
        {/* 向量 */}
        <line x1={0} y1={0} x2={120} y2={-30} stroke={DT.ink2} strokeWidth={2} />
        <path d="M112 -31 L122 -29 L115 -36 Z" fill={DT.ink2} />
        <line x1={0} y1={0} x2={30} y2={-80} stroke={DT.ink2} strokeWidth={2} />
        <path d="M27 -72 L31 -82 L36 -74 Z" fill={DT.ink2} />
        <Txt x={126} y={-28} size={10.5} fill={DT.ink2}>
          item 向量 a
        </Txt>
        <Txt x={38} y={-84} size={10.5} fill={DT.ink2}>
          item 向量 b
        </Txt>
        <Txt x={80} y={-58} size={11} bold fill={hue}>
          体积大 = 多样
        </Txt>
      </g>
      {/* 近平行小体积对比 */}
      <g transform="translate(790 240)">
        <line x1={0} y1={0} x2={60} y2={0} stroke={DT.ink3} strokeWidth={1} />
        <line x1={0} y1={0} x2={0} y2={-100} stroke={DT.ink3} strokeWidth={1} />
        <path d="M0 0 L52 -18 L56 -40 L4 -22 Z" fill={DT.surface2} stroke={DT.ink3} strokeWidth={1} />
        <Txt x={10} y={20} size={10.5} fill={DT.ink3}>
          近重复 → 体积小
        </Txt>
      </g>
      <rect x={480} y={300} width={370} height={40} rx={DT.nodeRadius} fill={DT.surface} stroke={hue} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
      <Txt x={665} y={325} mono size={12} fill={hue}>
        P(S) ∝ det(L_S)：相关性 × 多样性联合最大
      </Txt>

      <Txt x={440} y={400} size={11.5} fill={DT.ink3}>
        MMR 工程简单可控；DPP 有全局最优解释但计算重，常用于离线分析或小候选集
      </Txt>
    </svg>
  );
}
