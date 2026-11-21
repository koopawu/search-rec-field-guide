// fig-din-attention：DIN 局部激活注意力结构
// site_ia.md §4.2：底部用户行为序列（奶粉、泳衣、奶粉…），上方候选 item（泳镜）；
// 历史行为与候选间画注意力权重连线（泳衣加粗高亮）；加权求和 → MLP → 输出；
// 对比小图：传统 average pooling 等权重

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowUp } from './helpers';

const BEHAVIORS = [
  { name: '奶粉', w: 0.08 },
  { name: '泳衣', w: 0.62 },
  { name: '奶粉', w: 0.08 },
  { name: '背包', w: 0.12 },
  { name: '泳帽', w: 0.1 },
];

export default function FigDinAttention({ hue = '#B0503C', tint = '#F6E4E0' }: DiagramProps) {
  const bw = 96;
  const gap = 16;
  const x0 = 70;
  const by = 380; // 行为序列 y
  const candX = x0 + (BEHAVIORS.length * bw + (BEHAVIORS.length - 1) * gap) / 2;
  const candY = 60;

  return (
    <svg viewBox="0 0 880 540" width="100%" role="img" aria-label="DIN 局部激活注意力结构">
      {/* 候选 item */}
      <RNode x={candX - 70} y={candY} w={140} h={52} fill={tint} stroke={hue}>
        <Txt x={candX} y={candY + 24} bold fill={DT.ink}>
          候选：泳镜
        </Txt>
        <Txt x={candX} y={candY + 43} size={11} fill={DT.ink3}>
          待打分广告/商品
        </Txt>
      </RNode>

      {/* 注意力权重连线 */}
      {BEHAVIORS.map((b, i) => {
        const bx = x0 + i * (bw + gap) + bw / 2;
        const hot = b.w > 0.3;
        return (
          <g key={i}>
            <line
              x1={bx}
              y1={by - 4}
              x2={candX}
              y2={candY + 56}
              stroke={hot ? hue : DT.lineStrong}
              strokeWidth={hot ? 3.5 : DT.strokeWidth}
              strokeDasharray={hot ? undefined : DT.dash}
            />
            <Txt x={bx + (candX - bx) * 0.45 + 8} y={(by + candY + 56) / 2} mono size={11} fill={hot ? hue : DT.ink3}>
              {b.w.toFixed(2)}
            </Txt>
          </g>
        );
      })}
      <Txt x={candX + 92} y={candY + 34} anchor="start" size={11.5} fill={hue}>
        注意力权重：相关历史被「局部激活」
      </Txt>

      {/* 用户行为序列 */}
      <Txt x={x0 - 10} y={by + 26} anchor="end" size={12} fill={DT.ink3}>
        用户历史行为
      </Txt>
      {BEHAVIORS.map((b, i) => {
        const x = x0 + i * (bw + gap);
        const hot = b.w > 0.3;
        return (
          <RNode key={i} x={x} y={by} w={bw} h={48} fill={hot ? tint : DT.surface} stroke={hot ? hue : DT.ink2}>
            <Txt x={x + bw / 2} y={by + 29} size={12.5} bold={hot}>
              {b.name}
            </Txt>
          </RNode>
        );
      })}

      {/* 加权求和 → MLP → 输出 */}
      <ArrowUp x={candX} y1={by - 52} y2={by - 78} color={DT.ink3} dashed />
      <RNode x={candX - 70} y={by - 130} w={140} h={40} fill={DT.surface2}>
        <Txt x={candX} y={by - 105} size={12.5} bold>
          加权求和 ⊕
        </Txt>
      </RNode>
      <ArrowUp x={candX} y1={by - 130} y2={by - 156} />
      <RNode x={candX - 70} y={by - 196} w={140} h={40} fill={DT.surface2}>
        <Txt x={candX} y={by - 171} size={12.5} bold>
          MLP
        </Txt>
      </RNode>
      <ArrowUp x={candX} y1={by - 196} y2={by - 222} />
      <Txt x={candX} y={by - 234} bold fill={hue}>
        输出 CTR 预估分
      </Txt>

      {/* 对比小图：average pooling */}
      <RNode x={640} y={250} w={200} h={150} fill={DT.surface} dashed stroke={DT.ink3}>
        <Txt x={740} y={274} size={12} bold fill={DT.ink3}>
          对比：average pooling
        </Txt>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={668 + i * 52} y={344} width={36} height={22} rx={4} fill={DT.surface2} stroke={DT.ink3} strokeWidth={1} />
            <line x1={686 + i * 52} y1={344} x2={740} y2={306} stroke={DT.lineStrong} strokeWidth={1} />
          </g>
        ))}
        <circle cx={740} cy={300} r={9} fill={DT.surface2} stroke={DT.ink3} strokeWidth={1} />
        <Txt x={740} y={390} size={11} fill={DT.ink3}>
          所有历史等权重，兴趣被「平均」掉
        </Txt>
      </RNode>
    </svg>
  );
}
