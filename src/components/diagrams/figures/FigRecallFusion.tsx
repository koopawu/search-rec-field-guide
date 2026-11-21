// fig-recall-fusion：多路召回融合与配额
// site_ia.md §4.5：6 条并行召回通道（配额宽度不同）→ 汇总去重（source tracking）
// → 分数归一化/RRF → 配额截断 → 交粗排；标注「各路分数不可直接相加」与超时降级旁路

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowRight, ArrowDown } from './helpers';

const CHANNELS = [
  { name: '协同过滤', quota: '30%' },
  { name: '双塔向量', quota: '30%' },
  { name: '热点', quota: '10%' },
  { name: '标签', quota: '10%' },
  { name: '地域', quota: '10%' },
  { name: '关注', quota: '10%' },
];

export default function FigRecallFusion({ hue = '#B0503C', tint = '#F6E4E0' }: DiagramProps) {
  const x0 = 40;
  const cw = 118;
  const y0 = 76;
  const chH = 44;
  const chGap = 14;

  return (
    <svg viewBox="0 0 880 560" width="100%" role="img" aria-label="多路召回融合与配额">
      <Txt x={x0} y={40} anchor="start" size={12} fill={DT.ink3}>
        通道宽度 ≈ 配额占比
      </Txt>

      {/* 6 条并行召回通道 */}
      {CHANNELS.map((c, i) => {
        const y = y0 + i * (chH + chGap);
        const quotaW = cw * (0.55 + (parseInt(c.quota) / 30) * 0.45);
        return (
          <g key={c.name}>
            <RNode x={x0} y={y} w={cw} h={chH} fill={i % 2 === 0 ? tint : DT.surface} stroke={i % 2 === 0 ? hue : DT.ink2}>
              <Txt x={x0 + cw / 2} y={y + 27} size={12.5} bold={i % 2 === 0}>
                {c.name}
              </Txt>
            </RNode>
            {/* 配额条 */}
            <rect x={x0 + cw + 10} y={y + chH / 2 - 5} width={quotaW} height={10} rx={5} fill={hue} opacity={0.35} />
            <Txt x={x0 + cw + 16 + quotaW} y={y + chH / 2 + 4} anchor="start" mono size={11} fill={DT.ink3}>
              {c.quota}
            </Txt>
            {/* 汇入去重的斜线 */}
            <path
              d={`M${x0 + cw + quotaW + 44} ${y + chH / 2} L${352} ${232}`}
              fill="none"
              stroke={DT.lineStrong}
              strokeWidth={DT.strokeWidth}
            />
          </g>
        );
      })}

      {/* 汇总去重 */}
      <RNode x={352} y={188} w={150} h={88} fill={DT.surface2}>
        <Txt x={427} y={224} bold fill={DT.ink}>
          汇总去重
        </Txt>
        <Txt x={427} y={246} size={11.5} fill={DT.ink3}>
          source tracking
        </Txt>
        <Txt x={427} y={264} size={11.5} fill={DT.ink3}>
          记录每条来源
        </Txt>
      </RNode>
      <ArrowRight x1={502} x2={546} y={232} />

      {/* 归一化 / RRF */}
      <RNode x={546} y={188} w={140} h={88} fill={DT.surface}>
        <Txt x={616} y={224} bold fill={DT.ink}>
          分数归一化
        </Txt>
        <Txt x={616} y={246} mono size={11.5} fill={DT.ink2}>
          RRF 1/(rank+k)
        </Txt>
        <Txt x={616} y={264} size={11} fill={DT.danger}>
          各路分数不可直接相加
        </Txt>
      </RNode>
      <ArrowRight x1={686} x2={730} y={232} />

      {/* 配额截断 */}
      <RNode x={730} y={188} w={120} h={88} fill={tint} stroke={hue}>
        <Txt x={790} y={224} bold fill={DT.ink}>
          配额截断
        </Txt>
        <Txt x={790} y={246} size={11.5} fill={DT.ink3}>
          下游只吃得下
        </Txt>
        <Txt x={790} y={264} mono size={11.5} fill={hue}>
          数百~千级
        </Txt>
      </RNode>

      {/* 交粗排 */}
      <ArrowDown x={790} y1={276} y2={310} />
      <RNode x={730} y={310} w={120} h={44} fill={DT.surface2}>
        <Txt x={790} y={337} bold fill={DT.ink}>
          交粗排
        </Txt>
      </RNode>

      {/* 超时降级旁路 */}
      <path
        d={`M${x0 + cw / 2} ${y0 + 5 * (chH + chGap) + chH + 26} L${x0 + cw / 2} ${y0 + 5 * (chH + chGap) + chH + 52} L616 ${y0 + 5 * (chH + chGap) + chH + 52} L616 282`}
        fill="none"
        stroke={DT.warning}
        strokeWidth={DT.strokeWidth}
        strokeDasharray={DT.dash}
      />
      <Txt x={360} y={y0 + 5 * (chH + chGap) + chH + 44} size={11.5} fill={DT.warning}>
        超时降级虚线旁路：慢通道超时即截断，已有结果先行融合
      </Txt>
    </svg>
  );
}
