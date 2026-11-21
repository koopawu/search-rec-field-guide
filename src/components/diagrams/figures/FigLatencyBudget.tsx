// fig-latency-budget：在线请求延迟预算瀑布
// site_ia.md §4.5：网络 5-10 → 召回（多路并行，最慢一路决定 10ms）→ 特征 10-30
// → 粗排 5 → 精排 GPU 10 → 重排 2 → 序列化 5；顶部 SLA 100ms 标尺；各环节降级策略

import { DT, type DiagramProps } from '../tokens';
import { Txt } from './helpers';

const STAGES = [
  { name: '网络传输', ms: 8, label: '5-10ms', fix: '就近接入' },
  { name: '多路召回', ms: 10, label: '10ms（最慢一路决定）', fix: '超时截断' },
  { name: '特征获取', ms: 20, label: '10-30ms', fix: '缓存兜底' },
  { name: '粗排', ms: 5, label: '5ms', fix: '默认召回序' },
  { name: '精排 GPU', ms: 10, label: '10ms', fix: '模型降级' },
  { name: '重排', ms: 2, label: '2ms', fix: '规则跳过' },
  { name: '序列化返回', ms: 5, label: '5ms', fix: '压缩裁剪' },
];

export default function FigLatencyBudget({ hue = '#6E6257', tint = '#ECE7E1' }: DiagramProps) {
  const x0 = 70;
  const scale = 7; // 1ms = 7px → 100ms = 700px
  const barY = 120;
  const barH = 40;
  const rowGap = 26;
  const slaX = x0 + 100 * scale;

  return (
    <svg viewBox="0 0 880 480" width="100%" role="img" aria-label="在线请求延迟预算瀑布">
      {/* SLA 总标尺 */}
      <line x1={x0} y1={56} x2={slaX} y2={56} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <line x1={x0} y1={50} x2={x0} y2={62} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <line x1={slaX} y1={50} x2={slaX} y2={62} stroke={DT.danger} strokeWidth={DT.strokeWidth} />
      <Txt x={(x0 + slaX) / 2} y={44} mono bold fill={DT.ink}>
        SLA 100ms 总预算
      </Txt>
      {/* SLA 红线贯穿 */}
      <line x1={slaX} y1={66} x2={slaX} y2={barY + STAGES.length * (barH + rowGap)} stroke={DT.danger} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
      <Txt x={slaX + 10} y={barY + 20} anchor="start" size={11.5} fill={DT.danger}>
        超时红线
      </Txt>
      {/* 刻度 */}
      {[0, 25, 50, 75, 100].map((t) => (
        <g key={t}>
          <line x1={x0 + t * scale} y1={66} x2={x0 + t * scale} y2={74} stroke={DT.ink3} strokeWidth={1} />
          <Txt x={x0 + t * scale} y={88} mono size={10.5} fill={DT.ink3}>
            {t}
          </Txt>
        </g>
      ))}
      <Txt x={x0 - 8} y={88} anchor="end" mono size={10.5} fill={DT.ink3}>
        ms
      </Txt>

      {/* 瀑布条 */}
      {STAGES.map((s, i) => {
        const y = barY + i * (barH + rowGap);
        const w = s.ms * scale;
        return (
          <g key={s.name}>
            <Txt x={x0 - 12} y={y + barH / 2 + 4} anchor="end" size={12.5} bold fill={DT.ink}>
              {s.name}
            </Txt>
            <rect x={x0} y={y} width={w} height={barH} rx={DT.nodeRadius} fill={i % 2 === 0 ? tint : DT.surface2} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
            <Txt x={x0 + w + 12} y={y + 16} anchor="start" mono size={11.5} fill={DT.ink2}>
              {s.label}
            </Txt>
            <Txt x={x0 + w + 12} y={y + 34} anchor="start" size={11} fill={DT.warning}>
              降级：{s.fix}
            </Txt>
          </g>
        );
      })}

      {/* 底部注释 */}
      <rect x={x0 + 90} y={barY + STAGES.length * (barH + rowGap) + 8} width={560} height={38} rx={DT.nodeRadius} fill={DT.surface} stroke={hue} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
      <Txt x={x0 + 370} y={barY + STAGES.length * (barH + rowGap) + 32} size={12.5} fill={hue} bold>
        实际合计约 50-70ms，留 30% 余量给抖动；每个环节都要有兜底降级策略
      </Txt>
    </svg>
  );
}
