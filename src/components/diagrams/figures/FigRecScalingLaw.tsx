// fig-rec-scaling-law：推荐 Scaling Law 曲线
// site_ia.md §4.5：双对数坐标：横轴参数量/计算量、纵轴损失；散点沿幂律下降线，
// 标注 HSTU 1.5T 参数点与「首次在推荐系统观测到类 LLM Scaling Law」；
// 灰色虚线 = 传统 DLRM 收益递减平台期

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt } from './helpers';

export default function FigRecScalingLaw({ hue = '#4E7A72', tint = '#E2EDEA' }: DiagramProps) {
  const x0 = 100;
  const y0 = 380;
  const W = 620;
  const H = 280;
  const px = (t: number) => x0 + t * W;
  const py = (t: number) => y0 - t * H;

  // 幂律下降线（log-log 下为直线）
  const power = (t: number) => 0.86 - t * 0.62;
  // 散点（沿幂律线抖动）
  const scatter = [0.1, 0.22, 0.34, 0.46, 0.58, 0.7, 0.82, 0.94].map((t, i) => ({
    t,
    v: power(t) + (i % 2 === 0 ? 0.02 : -0.018),
  }));

  return (
    <svg viewBox="0 0 880 500" width="100%" role="img" aria-label="推荐 Scaling Law 曲线">
      {/* 坐标轴 */}
      <line x1={x0} y1={y0} x2={x0 + W + 30} y2={y0} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <line x1={x0} y1={y0} x2={x0} y2={y0 - H - 30} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <Txt x={x0 + W / 2} y={y0 + 40} size={12} fill={DT.ink3}>
        参数量 / 计算量（log）→
      </Txt>
      <Txt x={x0 - 46} y={y0 - H / 2} size={12} fill={DT.ink3}>
        <tspan transform={`rotate(-90 ${x0 - 46} ${y0 - H / 2})`}>损失（log）→</tspan>
      </Txt>

      {/* 传统 DLRM 平台期（灰虚线） */}
      <path d={`M${px(0.05)} ${py(0.55)} Q ${px(0.4)} ${py(0.42)} ${px(0.9)} ${py(0.4)}`} fill="none" stroke={DT.ink3} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
      <Txt x={px(0.62)} y={py(0.34)} size={11.5} fill={DT.ink3}>
        传统 DLRM：收益递减、早早进入平台期
      </Txt>

      {/* HSTU 幂律下降线 */}
      <line x1={px(0.04)} y1={py(power(0.04))} x2={px(0.98)} y2={py(power(0.98))} stroke={hue} strokeWidth={2.5} />
      {scatter.map((s, i) => (
        <circle key={i} cx={px(s.t)} cy={py(s.v)} r={5} fill={tint} stroke={hue} strokeWidth={DT.strokeWidth} />
      ))}

      {/* HSTU 1.5T 标注点 */}
      <circle cx={px(0.94)} cy={py(power(0.94))} r={9} fill="none" stroke={DT.danger} strokeWidth={DT.strokeWidth} />
      <line x1={px(0.94)} y1={py(power(0.94)) - 12} x2={px(0.94)} y2={py(power(0.94)) - 56} stroke={DT.danger} strokeWidth={1} strokeDasharray={DT.dash} />
      <RNode x={px(0.94) - 210} y={py(power(0.94)) - 108} w={250} h={52} fill={DT.surface} stroke={DT.danger}>
        <Txt x={px(0.94) - 85} y={py(power(0.94)) - 86} mono bold size={12} fill={DT.danger}>
          HSTU 1.5T 参数
        </Txt>
        <Txt x={px(0.94) - 85} y={py(power(0.94)) - 66} size={10.5} fill={DT.ink3}>
          仍在幂律线上，未见平台
        </Txt>
      </RNode>

      <Txt x={x0 + 10} y={py(0.92)} anchor="start" size={11.5} bold fill={hue}>
        HSTU（Meta）：首次在推荐系统观测到类 LLM 的 Scaling Law
      </Txt>

      {/* 底部注释 */}
      <rect x={170} y={430} width={540} height={42} rx={DT.nodeRadius} fill={DT.surface} stroke={hue} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
      <Txt x={440} y={456} bold fill={hue}>
        意义：推荐模型的「堆算力换效果」第一次有了可外推的数学依据
      </Txt>
    </svg>
  );
}
