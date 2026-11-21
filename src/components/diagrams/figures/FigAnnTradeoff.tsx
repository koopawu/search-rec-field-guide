// fig-ann-tradeoff：ANN 索引精度-速度权衡
// site_ia.md §4.5：横轴延迟、纵轴召回率散点：Flat(100%,慢) / IVF(95-98%,中) /
// HNSW(97-99.5%,快) / IVF-PQ(有损,最快最省内存)；气泡大小=内存占用；
// 选型经验：推荐小 topk 用 HNSW、广告大 topk 用 IVF-PQ

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt } from './helpers';

const METHODS = [
  { name: 'Flat 暴力', x: 0.85, y: 1.0, mem: 26, note: '100% 召回，最慢', color: '#8C8272' },
  { name: 'IVF', x: 0.45, y: 0.965, mem: 18, note: '95-98%，倒排聚类', color: '#B98A2F' },
  { name: 'HNSW', x: 0.18, y: 0.985, mem: 30, note: '97-99.5%，快但吃内存', color: '#B0503C' },
  { name: 'IVF-PQ', x: 0.08, y: 0.93, mem: 10, note: '有损压缩，最快最省', color: '#4E7A72' },
];

export default function FigAnnTradeoff({ hue = '#B0503C', tint = '#F6E4E0' }: DiagramProps) {
  const x0 = 90;
  const y0 = 380;
  const W = 640;
  const H = 300;
  const px = (t: number) => x0 + t * W;
  const py = (t: number) => y0 - (t - 0.88) * (H / 0.15); // 纵轴 88%-100%

  return (
    <svg viewBox="0 0 880 480" width="100%" role="img" aria-label="ANN 索引精度-速度权衡">
      {/* 坐标轴 */}
      <line x1={x0} y1={y0} x2={x0 + W + 30} y2={y0} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <line x1={x0} y1={y0} x2={x0} y2={y0 - H - 30} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <Txt x={x0 + W / 2} y={y0 + 40} size={12} fill={DT.ink3}>
        查询延迟 →（越右越慢）
      </Txt>
      <Txt x={x0 - 48} y={y0 - H / 2} size={12} fill={DT.ink3}>
        <tspan transform={`rotate(-90 ${x0 - 48} ${y0 - H / 2})`}>线上召回率 →</tspan>
      </Txt>
      {/* 纵轴刻度 */}
      {[0.9, 0.95, 1.0].map((t) => (
        <g key={t}>
          <line x1={x0 - 5} y1={py(t)} x2={x0} y2={py(t)} stroke={DT.ink3} strokeWidth={1} />
          <Txt x={x0 - 10} y={py(t) + 4} anchor="end" mono size={10.5} fill={DT.ink3}>
            {(t * 100).toFixed(0)}%
          </Txt>
          <line x1={x0} y1={py(t)} x2={x0 + W} y2={py(t)} stroke={DT.line} strokeWidth={1} />
        </g>
      ))}

      {/* 散点气泡 */}
      {METHODS.map((m) => (
        <g key={m.name}>
          <circle cx={px(m.x)} cy={py(m.y)} r={m.mem} fill={m.color} opacity={0.18} stroke={m.color} strokeWidth={DT.strokeWidth} />
          <Txt x={px(m.x)} y={py(m.y) + 4} bold size={11.5} fill={DT.ink}>
            {m.name}
          </Txt>
          <Txt x={px(m.x)} y={py(m.y) + m.mem + 16} size={10.5} fill={DT.ink3}>
            {m.note}
          </Txt>
        </g>
      ))}

      {/* 帕累托前沿 */}
      <path
        d={`M${px(0.08)} ${py(0.93)} L${px(0.18)} ${py(0.985)} L${px(0.45)} ${py(0.965)} L${px(0.85)} ${py(1.0)}`}
        fill="none"
        stroke={hue}
        strokeWidth={DT.strokeWidth}
        strokeDasharray={DT.dash}
      />
      <Txt x={px(0.34)} y={py(0.99)} size={11} fill={hue}>
        精度-速度权衡带
      </Txt>

      {/* 选型经验 */}
      <RNode x={500} y={60} w={340} h={110} fill={tint} stroke={hue}>
        <Txt x={670} y={88} bold size={12.5} fill={DT.ink}>
          选型经验
        </Txt>
        <Txt x={670} y={114} size={11.5} fill={DT.ink2}>
          推荐（小 topk、低延迟）→ HNSW
        </Txt>
        <Txt x={670} y={138} size={11.5} fill={DT.ink2}>
          广告（大 topk、海量库）→ IVF-PQ
        </Txt>
        <Txt x={670} y={158} size={10.5} fill={DT.ink3}>
          气泡大小 = 内存占用
        </Txt>
      </RNode>
      <Txt x={440} y={452} size={11.5} fill={DT.ink3}>
        线上召回率天然 &lt;100%：牺牲 1-5% 精度换 10-100 倍速度，是 ANN 存在的意义
      </Txt>
    </svg>
  );
}
