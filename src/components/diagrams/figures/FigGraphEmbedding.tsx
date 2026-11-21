// fig-graph-embedding：图召回随机游走示意
// site_ia.md §4.5：用户-物品共现图局部（节点+边），高亮随机游走路径 A→B→C；
// 旁注 BFS（结构性）/DFS（同质性）跳转分岔；EGES 小图：物品 embedding + side info 加权聚合

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt } from './helpers';

// 图节点（用户=圆，物品=方）
const NODES = [
  { id: 'U1', x: 90, y: 90, user: true },
  { id: 'A', x: 210, y: 60, user: false },
  { id: 'U2', x: 330, y: 110, user: true },
  { id: 'B', x: 230, y: 180, user: false },
  { id: 'U3', x: 110, y: 230, user: true },
  { id: 'C', x: 380, y: 230, user: false },
  { id: 'D', x: 300, y: 300, user: false },
];
const EDGES: Array<[number, number]> = [
  [0, 1], [1, 2], [0, 3], [3, 2], [3, 4], [3, 6], [2, 5], [6, 5], [4, 3], [1, 3],
];
// 高亮游走：U1(0) → A(1) → U2(2) → C(5)
const WALK = [0, 1, 2, 5];

export default function FigGraphEmbedding({ hue = '#B0503C', tint = '#F6E4E0' }: DiagramProps) {
  const onWalk = (i: number) => WALK.includes(i);
  return (
    <svg viewBox="0 0 880 420" width="100%" role="img" aria-label="图召回随机游走示意">
      {/* 左：共现图 */}
      <Txt x={220} y={32} bold fill={DT.ink}>
        用户-物品共现图（局部）
      </Txt>
      {EDGES.map(([a, b], i) => (
        <line
          key={i}
          x1={NODES[a].x}
          y1={NODES[a].y}
          x2={NODES[b].x}
          y2={NODES[b].y}
          stroke={DT.lineStrong}
          strokeWidth={DT.strokeWidth}
        />
      ))}
      {/* 高亮游走路径 */}
      {WALK.slice(0, -1).map((n, i) => {
        const a = NODES[n];
        const b = NODES[WALK[i + 1]];
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.hypot(dx, dy);
        return (
          <g key={i}>
            <line x1={a.x} y1={a.y} x2={b.x - (dx / len) * 14} y2={b.y - (dy / len) * 14} stroke={hue} strokeWidth={3} />
            <path
              d={`M${b.x - (dx / len) * 20 - (dy / len) * 5} ${b.y - (dy / len) * 20 + (dx / len) * 5} L${b.x - (dx / len) * 12} ${b.y - (dy / len) * 12} L${b.x - (dx / len) * 20 + (dy / len) * 5} ${b.y - (dy / len) * 20 - (dx / len) * 5} Z`}
              fill={hue}
            />
            <Txt x={mx + 10} y={my - 8} mono size={11} fill={hue}>
              {i + 1}
            </Txt>
          </g>
        );
      })}
      {NODES.map((n, i) =>
        n.user ? (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={14} fill={onWalk(i) ? tint : DT.surface} stroke={onWalk(i) ? hue : DT.ink2} strokeWidth={DT.strokeWidth} />
            <Txt x={n.x} y={n.y + 4} size={10.5} bold={onWalk(i)}>
              {n.id}
            </Txt>
          </g>
        ) : (
          <g key={n.id}>
            <rect x={n.x - 13} y={n.y - 13} width={26} height={26} rx={6} fill={onWalk(i) ? tint : DT.surface} stroke={onWalk(i) ? hue : DT.ink2} strokeWidth={DT.strokeWidth} />
            <Txt x={n.x} y={n.y + 4} size={10.5} bold={onWalk(i)}>
              {n.id}
            </Txt>
          </g>
        ),
      )}
      <Txt x={220} y={340} size={11.5} fill={DT.ink2}>
        高亮路径 = 一次随机游走（U1→A→U2→C），游走语料送 Word2vec 学节点向量
      </Txt>
      <Txt x={60} y={370} anchor="start" size={11} fill={DT.ink3}>
        ○ 用户　□ 物品
      </Txt>

      {/* 右上：BFS/DFS 分岔 */}
      <RNode x={480} y={50} w={360} h={120} fill={DT.surface} dashed>
        <Txt x={660} y={76} bold fill={DT.ink} size={12.5}>
          Node2vec 游走偏置：BFS / DFS 分岔
        </Txt>
        <Txt x={660} y={102} size={11.5} fill={DT.ink2}>
          BFS（邻域优先）→ 抓「结构性」：相似角色节点
        </Txt>
        <Txt x={660} y={124} size={11.5} fill={DT.ink2}>
          DFS（深入优先）→ 抓「同质性」：同社区节点
        </Txt>
        <Txt x={660} y={150} mono size={11} fill={hue}>
          跳转概率 ∝ 1/p（回头）、1（平层）、1/q（深入）
        </Txt>
      </RNode>

      {/* 右下：EGES 加权聚合 */}
      <RNode x={480} y={200} w={360} h={180} fill={DT.surface} dashed>
        <Txt x={660} y={226} bold fill={DT.ink} size={12.5}>
          EGES：side information 加权聚合
        </Txt>
        {['物品自身', '类目', '店铺', '品牌'].map((s, i) => {
          const x = 510 + i * 82;
          return (
            <g key={s}>
              <RNode x={x} y={244} w={72} h={34} fill={i === 0 ? tint : DT.surface2} stroke={i === 0 ? hue : DT.ink3}>
                <Txt x={x + 36} y={266} size={11}>
                  {s}
                </Txt>
              </RNode>
              <line x1={x + 36} y1={278} x2={660} y2={312} stroke={DT.ink3} strokeWidth={1} />
            </g>
          );
        })}
        <circle cx={660} cy={320} r={12} fill={tint} stroke={hue} strokeWidth={DT.strokeWidth} />
        <Txt x={660} y={324} size={10} bold fill={hue}>
          Σw
        </Txt>
        <Txt x={660} y={358} size={11} fill={DT.ink3}>
          注意力权重加权平均 → 治冷启动（新品也有 side info）
        </Txt>
      </RNode>
    </svg>
  );
}
