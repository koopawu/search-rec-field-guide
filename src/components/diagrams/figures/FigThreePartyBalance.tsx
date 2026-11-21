// fig-three-party-balance：用户-创作者-平台三方平衡
// site_ia.md §4.3：三角天平图：用户（体验/茧房）、创作者（激励/公平）、平台（时长/收入）；
// 中心「分发机制」；每边标注双向作用力与反噬案例标签（B 站停更 / 信息茧房 / 马太效应）

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt } from './helpers';

export default function FigThreePartyBalance({ hue = '#B08A2E', tint = '#F5EDDA' }: DiagramProps) {
  // 三角顶点
  const user = { x: 440, y: 70 };
  const creator = { x: 170, y: 380 };
  const platform = { x: 710, y: 380 };
  const center = { x: 440, y: 250 };

  const edge = (a: typeof user, b: typeof user) => {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    return { mx, my, dx, dy, len };
  };
  const e1 = edge(user, creator);
  const e2 = edge(user, platform);
  const e3 = edge(creator, platform);

  return (
    <svg viewBox="0 0 880 500" width="100%" role="img" aria-label="用户-创作者-平台三方平衡">
      {/* 三边（双向箭头） */}
      {[e1, e2, e3].map((e, i) => (
        <g key={i}>
          <line x1={e.mx - e.dx / 2 + (e.dx / e.len) * 70} y1={e.my - e.dy / 2 + (e.dy / e.len) * 70} x2={e.mx + e.dx / 2 - (e.dx / e.len) * 70} y2={e.my + e.dy / 2 - (e.dy / e.len) * 70} stroke={DT.lineStrong} strokeWidth={DT.strokeWidth} />
          <path d={`M${e.mx + e.dx / 2 - (e.dx / e.len) * 76 - (e.dy / e.len) * 5} ${e.my + e.dy / 2 - (e.dy / e.len) * 76 + (e.dx / e.len) * 5} L${e.mx + e.dx / 2 - (e.dx / e.len) * 66} ${e.my + e.dy / 2 - (e.dy / e.len) * 66} L${e.mx + e.dx / 2 - (e.dx / e.len) * 76 + (e.dy / e.len) * 5} ${e.my + e.dy / 2 - (e.dy / e.len) * 76 - (e.dx / e.len) * 5} Z`} fill={DT.lineStrong} />
          <path d={`M${e.mx - e.dx / 2 + (e.dx / e.len) * 76 - (e.dy / e.len) * 5} ${e.my - e.dy / 2 + (e.dy / e.len) * 76 + (e.dx / e.len) * 5} L${e.mx - e.dx / 2 + (e.dx / e.len) * 66} ${e.my - e.dy / 2 + (e.dy / e.len) * 66} L${e.mx - e.dx / 2 + (e.dx / e.len) * 76 + (e.dy / e.len) * 5} ${e.my - e.dy / 2 + (e.dy / e.len) * 76 - (e.dx / e.len) * 5} Z`} fill={DT.lineStrong} />
        </g>
      ))}

      {/* 边上反噬标签 */}
      <RNode x={e1.mx - 110} y={e1.my - 20} w={130} h={40} fill={DT.surface} dashed stroke={DT.danger}>
        <Txt x={e1.mx - 45} y={e1.my - 2} size={10.5} fill={DT.danger}>
          茧房 → 用户流失
        </Txt>
        <Txt x={e1.mx - 45} y={e1.my + 14} size={10} fill={DT.ink3}>
          信息茧房争议
        </Txt>
      </RNode>
      <RNode x={e2.mx + 20} y={e2.my - 20} w={130} h={40} fill={DT.surface} dashed stroke={DT.danger}>
        <Txt x={e2.mx + 85} y={e2.my - 2} size={10.5} fill={DT.danger}>
          过度商业化
        </Txt>
        <Txt x={e2.mx + 85} y={e2.my + 14} size={10} fill={DT.ink3}>
          体验受损反噬时长
        </Txt>
      </RNode>
      <RNode x={e3.mx - 70} y={e3.my + 16} w={150} h={40} fill={DT.surface} dashed stroke={DT.danger}>
        <Txt x={e3.mx + 5} y={e3.my + 34} size={10.5} fill={DT.danger}>
          马太效应 → 停更潮
        </Txt>
        <Txt x={e3.mx + 5} y={e3.my + 50} size={10} fill={DT.ink3}>
          如 B 站 UP 主停更
        </Txt>
      </RNode>

      {/* 三个顶点 */}
      <RNode x={user.x - 90} y={user.y - 10} w={180} h={64} fill={tint} stroke={hue}>
        <Txt x={user.x} y={user.y + 16} bold fill={DT.ink}>
          用户
        </Txt>
        <Txt x={user.x} y={user.y + 38} size={11.5} fill={DT.ink3}>
          体验 / 茧房风险
        </Txt>
      </RNode>
      <RNode x={creator.x - 90} y={creator.y - 10} w={180} h={64} fill={tint} stroke={hue}>
        <Txt x={creator.x} y={creator.y + 16} bold fill={DT.ink}>
          创作者
        </Txt>
        <Txt x={creator.x} y={creator.y + 38} size={11.5} fill={DT.ink3}>
          激励 / 流量公平
        </Txt>
      </RNode>
      <RNode x={platform.x - 90} y={platform.y - 10} w={180} h={64} fill={tint} stroke={hue}>
        <Txt x={platform.x} y={platform.y + 16} bold fill={DT.ink}>
          平台
        </Txt>
        <Txt x={platform.x} y={platform.y + 38} size={11.5} fill={DT.ink3}>
          时长 / 收入
        </Txt>
      </RNode>

      {/* 中心：分发机制 */}
      <circle cx={center.x} cy={center.y} r={52} fill={DT.surface2} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <Txt x={center.x} y={center.y - 2} bold fill={DT.ink}>
        分发机制
      </Txt>
      <Txt x={center.x} y={center.y + 20} size={10.5} fill={DT.ink3}>
        三方平衡点
      </Txt>
      {[user, creator, platform].map((p) => {
        const dx = center.x - p.x;
        const dy = center.y - p.y;
        const len = Math.hypot(dx, dy);
        return (
          <line key={p.x} x1={p.x + (dx / len) * 80} y1={p.y + (dy / len) * 60} x2={center.x - (dx / len) * 56} y2={center.y - (dy / len) * 56} stroke={DT.ink3} strokeWidth={1} strokeDasharray={DT.dash} />
        );
      })}

      <Txt x={440} y={476} size={12.5} fill={DT.ink2}>
        任何一侧长期受损都会反噬大盘：三方平衡是分发策略的总约束
      </Txt>
    </svg>
  );
}
