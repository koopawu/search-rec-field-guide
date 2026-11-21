// fig-coldstart-ladder：阶梯流量池赛马机制（全站核心图）
// site_ia.md §4.3：五级阶梯流量池（200-500 → 千级 → 万级 → 十万级 → 全站热门池），
// 视频卡片从底部入池，晋级箭头向上，不达标停滞/淘汰；侧边标注打分优先级

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowRight } from './helpers';

const POOLS = [
  { label: '初始池', scale: '200-500 曝光', w: 108 },
  { label: '千级池', scale: '千级', w: 122 },
  { label: '万级池', scale: '万级', w: 136 },
  { label: '十万级池', scale: '十万级', w: 150 },
  { label: '全站热门池', scale: '全站', w: 164 },
];

export default function FigColdstartLadder({ hue = DT.accent, tint = '#F6E7DC' }: DiagramProps) {
  const baseY = 380; // 水池底
  const poolH = 110;
  const startX = 60;

  let x = startX;
  const pools = POOLS.map((p, i) => {
    const px = x;
    const py = baseY - poolH - i * 22; // 逐级抬升
    x += p.w + 34;
    return { ...p, x: px, y: py };
  });

  return (
    <svg viewBox="0 0 880 480" width="100%" role="img" aria-label="阶梯流量池赛马机制图">
      {/* 地面虚线 */}
      <line x1={30} y1={baseY} x2={850} y2={baseY} stroke={DT.lineStrong} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />

      {/* 入池卡片 */}
      <RNode x={startX - 10} y={baseY + 26} w={120} h={40} fill={DT.surface2}>
        <Txt x={startX + 50} y={51} size={12.5}>
          新发布内容
        </Txt>
      </RNode>
      <path
        d={`M${startX + 50} ${baseY + 26} L${startX + 50} ${baseY + 6}`}
        stroke={DT.ink2}
        strokeWidth={DT.strokeWidth}
        markerEnd="url(#cl-up)"
      />

      {pools.map((p, i) => (
        <g key={p.label}>
          {/* 水池框 */}
          <path
            d={`M${p.x} ${p.y} L${p.x} ${p.y + poolH} L${p.x + p.w} ${p.y + poolH} L${p.x + p.w} ${p.y}`}
            fill={tint}
            stroke={DT.ink2}
            strokeWidth={DT.strokeWidth}
          />
          {/* 水面线 */}
          <path
            d={`M${p.x} ${p.y} q${p.w / 8} -7 ${p.w / 4} 0 t${p.w / 4} 0 t${p.w / 4} 0 t${p.w / 4} 0`}
            fill="none"
            stroke={hue}
            strokeWidth={DT.strokeWidth}
          />
          {/* 池内小卡片 */}
          {[0, 1, 2].map((k) => (
            <rect
              key={k}
              x={p.x + 12 + k * (p.w - 44) / 2}
              y={p.y + 34 + (k % 2) * 22}
              width={p.w / 3 - 10}
              height={16}
              rx={4}
              fill={DT.surface}
              stroke={DT.ink3}
              strokeWidth={1}
            />
          ))}
          <Txt x={p.x + p.w / 2} y={p.y + poolH - 12} bold fill={DT.ink}>
            {p.label}
          </Txt>
          <Txt x={p.x + p.w / 2} y={p.y + poolH + 20} mono size={12} fill={DT.ink3}>
            {p.scale}
          </Txt>
          {/* 晋级箭头 */}
          {i < pools.length - 1 && (
            <g>
              <ArrowRight
                x1={p.x + p.w + 4}
                x2={pools[i + 1].x - 4}
                y={p.y - 16}
                color={DT.success}
              />
              <Txt x={(p.x + p.w + pools[i + 1].x) / 2} y={p.y - 24} size={11} fill={DT.success}>
                晋级
              </Txt>
            </g>
          )}
          {/* 淘汰箭头（仅前几级画） */}
          {i < 3 && (
            <g>
              <line
                x1={p.x + p.w / 2}
                y1={p.y + poolH + 2}
                x2={p.x + p.w / 2 - 10}
                y2={p.y + poolH + 44}
                stroke={DT.danger}
                strokeWidth={DT.strokeWidth}
                strokeDasharray={DT.dash}
              />
              <path
                d={`M${p.x + p.w / 2 - 13} ${p.y + poolH + 38} L${p.x + p.w / 2 - 10} ${p.y + poolH + 46} L${p.x + p.w / 2 - 3} ${p.y + poolH + 40} Z`}
                fill={DT.danger}
              />
            </g>
          )}
        </g>
      ))}

      <Txt x={430} y={468} size={11.5} fill={DT.danger}>
        ↘ 不达标：停滞 / 淘汰回库
      </Txt>

      {/* 侧边标注 */}
      <g>
        <RNode x={700} y={40} w={160} h={128} fill={DT.surface} dashed>
          <Txt x={780} y={66} bold fill={DT.ink} size={12.5}>
            赛马规则
          </Txt>
          <Txt x={780} y={90} size={12} fill={DT.ink2}>
            每 10 分钟同级赛马
          </Txt>
          <Txt x={780} y={110} size={12} fill={DT.ink2}>
            晋级率约 15-20%
          </Txt>
          <Txt x={780} y={136} mono size={11.5} fill={hue}>
            完播&gt;点赞&gt;评论&gt;转发
          </Txt>
        </RNode>
        <Txt x={780} y={196} size={11} fill={DT.ink3}>
          打分优先级（行业解读口径）
        </Txt>
      </g>
    </svg>
  );
}
