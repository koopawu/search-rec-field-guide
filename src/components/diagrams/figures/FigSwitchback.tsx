// fig-switchback：Switchback 时间片轮转
// site_ia.md §4.4：时间轴上交替染色的实验组/对照组时间片（A-B-A-B-A…）；
// 「粒度越粗偏差越小方差越大」权衡；对照小图：普通 AB 在双边市场的污染箭头

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt } from './helpers';

export default function FigSwitchback({ hue = '#71803F', tint = '#ECEFE0' }: DiagramProps) {
  const x0 = 70;
  const sliceW = 82;
  const gap = 6;
  const y = 90;
  const slices = ['A', 'B', 'A', 'B', 'A', 'B', 'A', 'B'];

  return (
    <svg viewBox="0 0 880 480" width="100%" role="img" aria-label="Switchback 时间片轮转">
      {/* 上：时间片轮转 */}
      <Txt x={x0} y={44} anchor="start" bold fill={DT.ink}>
        Switchback：同一批供给，按时间片轮转策略
      </Txt>
      {slices.map((s, i) => {
        const x = x0 + i * (sliceW + gap);
        const isA = s === 'A';
        return (
          <g key={i}>
            <rect x={x} y={y} width={sliceW} height={64} rx={DT.nodeRadius} fill={isA ? tint : DT.surface} stroke={isA ? hue : DT.ink2} strokeWidth={DT.strokeWidth} />
            <Txt x={x + sliceW / 2} y={y + 30} bold fill={isA ? hue : DT.ink2}>
              {isA ? '实验策略' : '对照策略'}
            </Txt>
            <Txt x={x + sliceW / 2} y={y + 50} mono size={10.5} fill={DT.ink3}>
              时间片 {i + 1}
            </Txt>
          </g>
        );
      })}
      {/* 时间轴 */}
      <line x1={x0} y1={y + 84} x2={x0 + 8 * (sliceW + gap)} y2={y + 84} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <path d={`M${x0 + 8 * (sliceW + gap) - 6} ${y + 80} L${x0 + 8 * (sliceW + gap) + 4} ${y + 84} L${x0 + 8 * (sliceW + gap) - 6} ${y + 88} Z`} fill={DT.ink2} />
      <Txt x={x0 + 8 * (sliceW + gap) + 12} y={y + 88} size={11.5} fill={DT.ink3}>
        时间
      </Txt>
      <Txt x={x0 + 330} y={y + 116} size={11.5} fill={DT.ink2}>
        供给（司机/骑手/创作者）在所有时间片内共享 → 组间不互相污染
      </Txt>

      {/* 左下：粒度权衡 */}
      <RNode x={70} y={230} w={360} h={120} fill={DT.surface} dashed>
        <Txt x={250} y={258} bold size={12.5} fill={DT.ink}>
          时间片粒度权衡
        </Txt>
        <line x1={100} y1={322} x2={400} y2={322} stroke={DT.ink3} strokeWidth={1} />
        <line x1={100} y1={322} x2={100} y2={272} stroke={DT.ink3} strokeWidth={1} />
        <path d="M110 282 C 190 286, 300 300, 390 314" fill="none" stroke={DT.danger} strokeWidth={DT.strokeWidth} />
        <path d="M110 316 C 200 310, 300 296, 390 280" fill="none" stroke={DT.success} strokeWidth={DT.strokeWidth} />
        <Txt x={396} y={318} anchor="end" size={10.5} fill={DT.ink3}>
          粒度越粗 →
        </Txt>
        <Txt x={150} y={272} size={10} fill={DT.danger}>
          偏差↓
        </Txt>
        <Txt x={350} y={272} size={10} fill={DT.success}>
          方差↑
        </Txt>
      </RNode>

      {/* 右下：普通 AB 的污染 */}
      <RNode x={480} y={230} w={360} h={150} fill={DT.surface} dashed stroke={DT.danger}>
        <Txt x={660} y={258} bold size={12.5} fill={DT.danger}>
          对照：普通 AB 在双边市场被污染
        </Txt>
        <rect x={510} y={276} width={90} height={40} rx={6} fill={tint} stroke={hue} strokeWidth={DT.strokeWidth} />
        <Txt x={555} y={301} size={11}>
          实验组用户
        </Txt>
        <rect x={730} y={276} width={90} height={40} rx={6} fill={DT.surface2} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
        <Txt x={775} y={301} size={11}>
          对照组用户
        </Txt>
        <rect x={610} y={340} width={110} height={34} rx={6} fill={DT.surface} stroke={DT.danger} strokeWidth={DT.strokeWidth} />
        <Txt x={665} y={362} size={11} fill={DT.danger}>
          共享运力池
        </Txt>
        <path d="M555 316 L640 340" stroke={DT.danger} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
        <path d="M775 316 L690 340" stroke={DT.danger} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
        <Txt x={660} y={398} size={10.5} fill={DT.ink3}>
          实验组抢走对照组运力 → 对照组指标被拉低
        </Txt>
      </RNode>

      <Txt x={440} y={452} size={12} fill={DT.ink2}>
        网约车 / 外卖等双边场景：用「时间维度」的随机化换「空间维度」的干净
      </Txt>
    </svg>
  );
}
