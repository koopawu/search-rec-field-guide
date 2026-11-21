// fig-bandit-ee：Bandit 探索-利用权衡图
// site_ia.md §4.3：三台老虎机臂各挂收益分布钟形曲线：已知臂（窄分布、均值高，标「利用」）、
// 未知臂（宽分布、均值低但置信上界高，标「探索」）；UCB 公式条；
// 右侧小面板对比 ε-Greedy / UCB / Thompson / LinUCB 四算法

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt } from './helpers';

function Bell({ cx, cy, mean, spread, color }: { cx: number; cy: number; mean: number; spread: number; color: string }) {
  // 简单高斯形曲线
  const pts: string[] = [];
  for (let i = -30; i <= 30; i++) {
    const t = i / 30;
    const x = cx + t * 60;
    const y = cy - Math.exp(-((t * 60 - mean) ** 2) / (2 * spread * spread)) * 56;
    pts.push(`${i === -30 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return <path d={pts.join(' ')} fill="none" stroke={color} strokeWidth={DT.strokeWidth} />;
}

export default function FigBanditEe({ hue = '#B08A2E', tint = '#F5EDDA' }: DiagramProps) {
  const arms = [
    { label: '已知臂 A', mean: 22, spread: 10, tag: '利用：均值高且确定', hot: false },
    { label: '已知臂 B', mean: 8, spread: 10, tag: '', hot: false },
    { label: '未知臂 C', mean: -6, spread: 26, tag: '探索：均值低但上界高', hot: true },
  ];
  return (
    <svg viewBox="0 0 880 440" width="100%" role="img" aria-label="Bandit 探索-利用权衡图">
      {arms.map((a, i) => {
        const y = 40 + i * 120;
        return (
          <g key={a.label}>
            {/* 老虎机臂 */}
            <RNode x={36} y={y} w={110} h={88} fill={a.hot ? tint : DT.surface} stroke={a.hot ? hue : DT.ink2}>
              <Txt x={91} y={y + 34} bold size={12.5} fill={DT.ink}>
                {a.label}
              </Txt>
              <line x1={116} y1={y + 44} x2={138} y2={y + 66} stroke={DT.ink2} strokeWidth={2.5} />
              <circle cx={140} cy={y + 69} r={5} fill={a.hot ? hue : DT.ink3} />
            </RNode>
            {/* 收益分布 */}
            <line x1={180} y1={y + 96} x2={560} y2={y + 96} stroke={DT.lineStrong} strokeWidth={1} />
            <Bell cx={370} cy={y + 96} mean={a.mean * 2} spread={a.spread} color={a.hot ? hue : DT.ink2} />
            {/* 均值刻度 */}
            <line x1={370 + a.mean * 2} y1={y + 88} x2={370 + a.mean * 2} y2={y + 104} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
            <Txt x={370 + a.mean * 2} y={y + 118} mono size={10.5} fill={DT.ink3}>
              μ
            </Txt>
            {/* 置信上界（未知臂） */}
            {a.hot && (
              <g>
                <line x1={370 + a.mean * 2 + 2 * a.spread} y1={y + 40} x2={370 + a.mean * 2 + 2 * a.spread} y2={y + 96} stroke={hue} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
                <Txt x={370 + a.mean * 2 + 2 * a.spread + 8} y={y + 52} anchor="start" size={11} fill={hue}>
                  置信上界 UCB
                </Txt>
              </g>
            )}
            {a.tag && (
              <Txt x={576} y={y + 48} anchor="start" size={11.5} bold fill={a.hot ? hue : DT.ink2}>
                {a.tag}
              </Txt>
            )}
          </g>
        );
      })}

      {/* UCB 公式条 */}
      <rect x={36} y={386} width={440} height={38} rx={DT.nodeRadius} fill={DT.surface} stroke={hue} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
      <Txt x={256} y={411} mono bold fill={hue}>
        a* = argmax（均值 μ + 置信上界 β·σ）
      </Txt>

      {/* 右侧算法对比面板 */}
      <RNode x={620} y={40} w={230} h={290} fill={DT.surface} dashed>
        <Txt x={735} y={68} bold fill={DT.ink} size={12.5}>
          四种经典算法
        </Txt>
        {[
          ['ε-Greedy', '以 ε 概率随机试'],
          ['UCB', '选置信上界最高的'],
          ['Thompson', '按后验分布采样'],
          ['LinUCB', '引入上下文特征'],
        ].map(([n, d], i) => (
          <g key={n}>
            <Txt x={640} y={102 + i * 56} anchor="start" mono bold size={12} fill={hue}>
              {n}
            </Txt>
            <Txt x={640} y={124 + i * 56} anchor="start" size={11} fill={DT.ink2}>
              {d}
            </Txt>
          </g>
        ))}
      </RNode>
      <Txt x={735} y={356} size={11} fill={DT.ink3}>
        分布越宽（不确定）上界越高 → 自动倾向探索
      </Txt>
    </svg>
  );
}
