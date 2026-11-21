// fig-rag-evolution：RAG 四代演进时间线
// site_ia.md §4.5：四阶梯：Naive（2023，三步流水线）→ Advanced（2024，改写+混合+重排）
// → Modular（2025，七模块拼图）→ Agentic（2025-，Agent 决策环）；
// 每级标注解决的问题与代表数据（专业查询 +20-30% / 医疗 65%→89%）

import { DT, type DiagramProps } from '../tokens';
import { Txt } from './helpers';

const GENS = [
  { name: 'Naive RAG', year: '2023', sub: '检索→拼接→生成', note: '三步流水线；幻觉多、噪声敏感', data: '' },
  { name: 'Advanced', year: '2024', sub: '+改写 +混合检索 +重排', note: '专业查询 +20-30%', data: '' },
  { name: 'Modular', year: '2025', sub: '七模块可插拔拼图', note: '医疗场景 65%→89%', data: '' },
  { name: 'Agentic', year: '2025-', sub: 'Agent 决策环', note: '模型自主决定何时检索、检索什么', data: '' },
];

export default function FigRagEvolution({ hue = '#4E7A72', tint = '#E2EDEA' }: DiagramProps) {
  const stepW = 195;
  const gap = 16;
  const x0 = 44;
  const baseY = 400;
  const stepH = 88;

  return (
    <svg viewBox="0 0 880 500" width="100%" role="img" aria-label="RAG 四代演进时间线">
      <Txt x={x0} y={40} anchor="start" bold fill={DT.ink}>
        RAG 范式四代演进：从固定流水线到 Agent 决策环
      </Txt>

      {GENS.map((g, i) => {
        const x = x0 + i * (stepW + gap);
        const y = baseY - (i + 1) * stepH;
        const last = i === GENS.length - 1;
        return (
          <g key={g.name}>
            <rect x={x} y={y} width={stepW} height={(i + 1) * stepH} rx={DT.nodeRadius} fill={last ? tint : i % 2 === 0 ? DT.surface2 : DT.surface} stroke={last ? hue : DT.ink2} strokeWidth={DT.strokeWidth} />
            <Txt x={x + stepW / 2} y={y + 30} bold size={13} fill={DT.ink}>
              {g.name}
            </Txt>
            <Txt x={x + stepW / 2} y={y + 52} mono size={10.5} fill={hue}>
              {g.year}
            </Txt>
            <Txt x={x + stepW / 2} y={y + 74} size={10.5} fill={DT.ink2}>
              {g.sub}
            </Txt>
            {g.note && (
              <Txt x={x + stepW / 2} y={y - 12} size={10.5} fill={last ? hue : DT.ink3} bold={last}>
                {g.note}
              </Txt>
            )}
          </g>
        );
      })}
      <line x1={x0 - 10} y1={baseY} x2={x0 + 4 * (stepW + gap)} y2={baseY} stroke={DT.lineStrong} strokeWidth={DT.strokeWidth} />

      {/* Agentic 决策环小图 */}
      <g transform="translate(742 84)">
        <circle cx={40} cy={40} r={34} fill="none" stroke={hue} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
        <path d="M72 28 L76 40 L64 38 Z" fill={hue} />
        <Txt x={40} y={36} size={9.5} fill={hue}>
          规划→检索
        </Txt>
        <Txt x={40} y={50} size={9.5} fill={hue}>
          →反思→循环
        </Txt>
      </g>

      <Txt x={440} y={baseY + 34} size={12} fill={DT.ink2}>
        每一代都在回答同一件事：如何把「检索到的噪声」与「模型需要的上下文」隔离得更好
      </Txt>
    </svg>
  );
}
