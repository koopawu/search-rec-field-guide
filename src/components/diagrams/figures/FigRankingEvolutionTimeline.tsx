// fig-ranking-evolution-timeline：精排模型演进时间线
// site_ia.md §4.5：横向时间轴 2010→2025：LR → GBDT+LR(2014) → FM/FFM → Wide&Deep(2016)
// → DeepFM/DCN(2017) → DIN(2018)/DIEN(2019) → SIM(2020) → HSTU(2024)/生成式；
// 主轴下方两条主题带：特征工程自动化史、优化目标多元化史

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt } from './helpers';

const NODES = [
  { year: '2010', name: 'LR', note: '人工特征 + 线性' },
  { year: '2014', name: 'GBDT+LR', note: '特征组合自动化' },
  { year: '2015', name: 'FM/FFM', note: '隐向量二阶交叉' },
  { year: '2016', name: 'Wide&Deep', note: '记忆 + 泛化' },
  { year: '2017', name: 'DeepFM/DCN', note: '端到端特征交叉' },
  { year: '2018', name: 'DIN/DIEN', note: '注意力千物千面' },
  { year: '2020', name: 'SIM', note: '长序列兴趣检索' },
  { year: '2024', name: 'HSTU/生成式', note: 'Transformer 统一' },
];

export default function FigRankingEvolutionTimeline({
  hue = '#A9713A',
  tint = '#F5EBDD',
}: DiagramProps) {
  const x0 = 60;
  const axisY = 200;
  const span = 780;

  return (
    <svg viewBox="0 0 880 460" width="100%" role="img" aria-label="精排模型演进时间线">
      {/* 主时间轴 */}
      <line x1={x0 - 10} y1={axisY} x2={x0 + span} y2={axisY} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <path d={`M${x0 + span - 6} ${axisY - 4} L${x0 + span + 4} ${axisY} L${x0 + span - 6} ${axisY + 4} Z`} fill={DT.ink2} />

      {NODES.map((n, i) => {
        const x = x0 + (i / (NODES.length - 1)) * (span - 60);
        const up = i % 2 === 0;
        const cardY = up ? axisY - 118 : axisY + 26;
        return (
          <g key={n.name}>
            <circle cx={x} cy={axisY} r={5.5} fill={i >= 5 ? hue : DT.surface} stroke={hue} strokeWidth={DT.strokeWidth} />
            <line x1={x} y1={up ? cardY + 92 : axisY + 6} x2={x} y2={up ? axisY - 6 : cardY} stroke={DT.lineStrong} strokeWidth={DT.strokeWidth} />
            <RNode x={x - 52} y={cardY} w={104} h={92} fill={up ? tint : DT.surface} stroke={up ? hue : DT.ink2}>
              <Txt x={x} y={cardY + 22} mono size={10.5} fill={DT.ink3}>
                {n.year}
              </Txt>
              <Txt x={x} y={cardY + 44} bold size={11.5} fill={DT.ink}>
                {n.name}
              </Txt>
              <Txt x={x} y={cardY + 66} size={9.5} fill={DT.ink3}>
                {n.note}
              </Txt>
            </RNode>
          </g>
        );
      })}

      {/* 两条主题带 */}
      <RNode x={x0} y={330} w={760} h={40} fill={tint} stroke={hue}>
        <Txt x={x0 + 380} y={355} size={12} fill={DT.ink2}>
          主题带一 · 特征工程自动化史：人工特征 → 自动交叉 → 端到端学习
        </Txt>
      </RNode>
      <RNode x={x0} y={382} w={760} h={40} fill={DT.surface2}>
        <Txt x={x0 + 380} y={407} size={12} fill={DT.ink2}>
          主题带二 · 优化目标多元化史：单一 CTR → 多目标 → 长期价值 / 生成式目标
        </Txt>
      </RNode>

      <Txt x={x0} y={56} anchor="start" size={11.5} fill={DT.ink3}>
        读法：每次跃迁都在回答「特征还要不要人工做」「序列还能多长」「目标还能多全」
      </Txt>
    </svg>
  );
}
