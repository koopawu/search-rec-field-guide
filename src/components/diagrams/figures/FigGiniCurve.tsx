// fig-gini-curve：洛伦兹曲线与基尼系数
// site_ia.md §4.3：坐标系内绝对平等线（对角线）与实际曝光分布洛伦兹曲线（下凹）；
// 两线间面积 A、曲线下面积 B，Gini = A/(A+B)；快手 30% 头部/70% 中长尾刻度线；
// 「Gini2 > Gini1 即马太效应」判读提示

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt } from './helpers';

export default function FigGiniCurve({ hue = '#B08A2E' }: DiagramProps) {
  const x0 = 110;
  const y0 = 380;
  const S = 280; // 坐标系边长
  const px = (t: number) => x0 + t * S;
  const py = (t: number) => y0 - t * S;

  // 洛伦兹曲线（下凹）：t^2.6 近似
  const lorenz: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    lorenz.push(`${i === 0 ? 'M' : 'L'}${px(t).toFixed(1)} ${py(Math.pow(t, 2.6)).toFixed(1)}`);
  }
  // A 区域（对角线与曲线之间）
  const areaA: string[] = [`M${px(0)} ${py(0)}`];
  for (let i = 1; i <= 40; i++) {
    const t = i / 40;
    areaA.push(`L${px(t).toFixed(1)} ${py(t).toFixed(1)}`);
  }
  for (let i = 40; i >= 0; i--) {
    const t = i / 40;
    areaA.push(`L${px(t).toFixed(1)} ${py(Math.pow(t, 2.6)).toFixed(1)}`);
  }
  areaA.push('Z');

  return (
    <svg viewBox="0 0 880 470" width="100%" role="img" aria-label="洛伦兹曲线与基尼系数">
      {/* 坐标轴 */}
      <line x1={x0} y1={y0} x2={x0 + S + 20} y2={y0} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <line x1={x0} y1={y0} x2={x0} y2={y0 - S - 20} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <Txt x={x0 + S / 2} y={y0 + 36} size={12} fill={DT.ink3}>
        作者累计占比（按曝光升序）→
      </Txt>
      <Txt x={x0 - 44} y={y0 - S / 2} size={12} fill={DT.ink3}>
        <tspan transform={`rotate(-90 ${x0 - 44} ${y0 - S / 2})`}>曝光累计占比 →</tspan>
      </Txt>

      {/* A 区域填充 */}
      <path d={areaA.join(' ')} fill={hue} opacity={0.14} />
      {/* 绝对平等线 */}
      <line x1={x0} y1={y0} x2={px(1)} y2={py(1)} stroke={DT.ink3} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
      {/* 洛伦兹曲线 */}
      <path d={lorenz.join(' ')} fill="none" stroke={hue} strokeWidth={2.5} />

      <Txt x={px(0.55)} y={py(0.62)} bold fill={hue}>
        A
      </Txt>
      <Txt x={px(0.78)} y={py(0.18)} bold fill={DT.ink3}>
        B
      </Txt>
      <Txt x={px(0.62)} y={py(0.72)} size={11} fill={DT.ink3}>
        绝对平等线
      </Txt>
      <Txt x={px(0.9)} y={py(0.5)} size={11} fill={hue}>
        实际曝光分布
      </Txt>

      {/* 快手 30/70 刻度线 */}
      <line x1={px(0.7)} y1={y0} x2={px(0.7)} y2={py(Math.pow(0.7, 2.6))} stroke={DT.warning} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
      <Txt x={px(0.7)} y={y0 + 18} mono size={10.5} fill={DT.warning}>
        70% 中长尾
      </Txt>
      <Txt x={px(0.7) + 10} y={py(Math.pow(0.7, 2.6)) + 18} size={10.5} fill={DT.warning}>
        只分到约 30% 曝光
      </Txt>

      {/* 公式与判读 */}
      <rect x={480} y={90} width={330} height={46} rx={DT.nodeRadius} fill={DT.surface} stroke={hue} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
      <Txt x={645} y={118} mono bold fill={hue}>
        Gini = A / (A + B)，越大越贫富分化
      </Txt>
      <RNode x={480} y={160} w={330} h={120} fill={DT.surface} dashed>
        <Txt x={645} y={188} bold size={12.5} fill={DT.ink}>
          判读提示
        </Txt>
        <Txt x={645} y={214} size={11.5} fill={DT.ink2}>
          快手「基尼系数约束」：头部 30% / 中长尾 70%
        </Txt>
        <Txt x={645} y={238} size={11.5} fill={DT.ink2}>
          Gini₂ &gt; Gini₁ ⇒ 马太效应在加剧
        </Txt>
        <Txt x={645} y={262} size={11.5} fill={DT.ink3}>
          平台主动压低 Gini，给中长尾留流量
        </Txt>
      </RNode>
    </svg>
  );
}
