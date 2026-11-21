// fig-hnsw-layers：HNSW 分层导航图
// site_ia.md §4.5：三层节点图：顶层稀疏长边（高速公路，入口点）→ 中层主干道
// → 底层密集节点（本地街道，目标点）；红色路径从顶层入口贪婪下钻到底层最近邻；
// 标注参数 M / efConstruction / efSearch 与「O(n)→近 O(log n)、召回率 95%+」

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt } from './helpers';

// 各层节点
const TOP = [{ x: 300, y: 70 }, { x: 580, y: 60 }];
const MID = [{ x: 220, y: 200 }, { x: 420, y: 190 }, { x: 620, y: 210 }];
const BOT = [
  { x: 140, y: 340 }, { x: 240, y: 330 }, { x: 330, y: 350 }, { x: 430, y: 335 },
  { x: 520, y: 350 }, { x: 610, y: 330 }, { x: 700, y: 345 }, { x: 780, y: 335 },
];
// 红色下钻路径：TOP[0] → MID[1] → BOT[3]（目标）
const PATH = [{ x: 300, y: 70 }, { x: 420, y: 190 }, { x: 430, y: 335 }];

export default function FigHnswLayers({ hue = '#A9713A', tint = '#F5EBDD' }: DiagramProps) {
  return (
    <svg viewBox="0 0 880 480" width="100%" role="img" aria-label="HNSW 分层导航图">
      {/* 层背景带 */}
      <RNode x={60} y={30} w={720} h={80} fill={DT.surface} dashed stroke={DT.ink3}>
        <Txt x={86} y={58} anchor="start" size={11} fill={DT.ink3}>
          顶层 · 高速公路（稀疏长边，快速跨区）
        </Txt>
      </RNode>
      <RNode x={60} y={160} w={720} h={90} fill={DT.surface} dashed stroke={DT.ink3}>
        <Txt x={86} y={188} anchor="start" size={11} fill={DT.ink3}>
          中层 · 主干道
        </Txt>
      </RNode>
      <RNode x={60} y={300} w={720} h={100} fill={tint} dashed stroke={hue}>
        <Txt x={86} y={328} anchor="start" size={11} fill={hue}>
          底层 · 本地街道（密集节点，精细邻域）
        </Txt>
      </RNode>

      {/* 层内边 */}
      <line x1={TOP[0].x} y1={TOP[0].y} x2={TOP[1].x} y2={TOP[1].y} stroke={DT.ink3} strokeWidth={DT.strokeWidth} />
      <line x1={MID[0].x} y1={MID[0].y} x2={MID[1].x} y2={MID[1].y} stroke={DT.ink3} strokeWidth={DT.strokeWidth} />
      <line x1={MID[1].x} y1={MID[1].y} x2={MID[2].x} y2={MID[2].y} stroke={DT.ink3} strokeWidth={DT.strokeWidth} />
      {BOT.slice(0, -1).map((b, i) => (
        <line key={i} x1={b.x} y1={b.y} x2={BOT[i + 1].x} y2={BOT[i + 1].y} stroke={DT.lineStrong} strokeWidth={1} />
      ))}
      {/* 底层局部密边 */}
      <line x1={BOT[2].x} y1={BOT[2].y} x2={BOT[4].x} y2={BOT[4].y} stroke={DT.lineStrong} strokeWidth={1} />
      <line x1={BOT[4].x} y1={BOT[4].y} x2={BOT[6].x} y2={BOT[6].y} stroke={DT.lineStrong} strokeWidth={1} />

      {/* 红色贪婪下钻路径 */}
      {PATH.slice(0, -1).map((p, i) => {
        const q = PATH[i + 1];
        const dy = q.y - p.y;
        const len = Math.hypot(q.x - p.x, dy);
        return (
          <g key={i}>
            <line x1={p.x} y1={p.y} x2={q.x - ((q.x - p.x) / len) * 12} y2={q.y - (dy / len) * 12} stroke={DT.danger} strokeWidth={2.5} />
            <path
              d={`M${q.x - ((q.x - p.x) / len) * 18 - 5} ${q.y - (dy / len) * 18 - 2} L${q.x - ((q.x - p.x) / len) * 10} ${q.y - (dy / len) * 10} L${q.x - ((q.x - p.x) / len) * 18 + 3} ${q.y - (dy / len) * 18 - 7} Z`}
              fill={DT.danger}
            />
          </g>
        );
      })}

      {/* 节点 */}
      {TOP.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={10} fill={i === 0 ? tint : DT.surface} stroke={i === 0 ? DT.danger : DT.ink2} strokeWidth={DT.strokeWidth} />
      ))}
      {MID.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={9} fill={i === 1 ? tint : DT.surface} stroke={i === 1 ? DT.danger : DT.ink2} strokeWidth={DT.strokeWidth} />
      ))}
      {BOT.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={7} fill={i === 3 ? DT.danger : DT.surface} stroke={i === 3 ? DT.danger : DT.ink3} strokeWidth={DT.strokeWidth} />
      ))}

      {/* 标注 */}
      <Txt x={300} y={46} size={11} bold fill={DT.danger}>
        入口点（query 从此进入）
      </Txt>
      <Txt x={430} y={378} size={11} bold fill={DT.danger}>
        目标：最近邻
      </Txt>
      <Txt x={600} y={130} size={11} fill={DT.ink3}>
        每层贪心跳到「离 query 最近」的节点再下钻
      </Txt>

      {/* 参数面板 */}
      <RNode x={620} y={404} w={230} h={64} fill={DT.surface}>
        <Txt x={735} y={428} mono size={11} fill={DT.ink2}>
          M=16 · efConstruction=200
        </Txt>
        <Txt x={735} y={450} mono size={11} fill={DT.ink2}>
          efSearch：查精度旋钮
        </Txt>
      </RNode>
      <Txt x={360} y={440} mono bold size={12.5} fill={hue}>
        复杂度 O(n) → 近 O(log n)，召回率 95%+
      </Txt>
    </svg>
  );
}
