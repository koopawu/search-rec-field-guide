// fig-deep-research-loop：Deep Research 规划-检索-反思循环
// site_ia.md §4.5：环形四节点：规划（拆解子问题）→ 检索（多路 Tool Use）→ 阅读整合
// → 反思（识别缺口）→ 回到规划；环中心标注「幻觉率 -40%（谷歌口径）」；
// 外圈标注代表产品（OpenAI/Gemini/Kimi/夸克）

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt } from './helpers';

const NODES = [
  { name: '规划', sub: '拆解子问题', angle: -90 },
  { name: '检索', sub: '多路 Tool Use', angle: 0 },
  { name: '阅读整合', sub: '提炼证据', angle: 90 },
  { name: '反思', sub: '识别信息缺口', angle: 180 },
];

export default function FigDeepResearchLoop({ hue = '#4E7A72', tint = '#E2EDEA' }: DiagramProps) {
  const cx = 440;
  const cy = 240;
  const R = 150;
  const pos = NODES.map((n) => ({
    ...n,
    x: cx + R * Math.cos((n.angle * Math.PI) / 180),
    y: cy + R * Math.sin((n.angle * Math.PI) / 180),
  }));

  return (
    <svg viewBox="0 0 880 520" width="100%" role="img" aria-label="Deep Research 规划-检索-反思循环">
      {/* 环形箭头 */}
      {pos.map((p, i) => {
        const q = pos[(i + 1) % 4];
        const a1 = (p.angle * Math.PI) / 180;
        const a2 = (q.angle * Math.PI) / 180;
        const mid = (a1 + a2) / 2;
        // 弧线中点的箭头
        const ax = cx + R * Math.cos(mid);
        const ay = cy + R * Math.sin(mid);
        const tx = -Math.sin(mid);
        const ty = Math.cos(mid);
        return (
          <g key={i}>
            <path
              d={`M${cx + R * Math.cos(a1 + 0.28)} ${cy + R * Math.sin(a1 + 0.28)} A ${R} ${R} 0 0 1 ${cx + R * Math.cos(a2 - 0.28)} ${cy + R * Math.sin(a2 - 0.28)}`}
              fill="none"
              stroke={DT.ink2}
              strokeWidth={DT.strokeWidth}
            />
            <path
              d={`M${ax - tx * 8 - ty * 5} ${ay - ty * 8 + tx * 5} L${ax} ${ay} L${ax - tx * 8 + ty * 5} ${ay - ty * 8 - tx * 5} Z`}
              fill={DT.ink2}
            />
          </g>
        );
      })}

      {/* 四节点 */}
      {pos.map((p) => (
        <RNode key={p.name} x={p.x - 78} y={p.y - 30} w={156} h={60} fill={tint} stroke={hue}>
          <Txt x={p.x} y={p.y - 4} bold fill={DT.ink}>
            {p.name}
          </Txt>
          <Txt x={p.x} y={p.y + 17} size={10.5} fill={DT.ink3}>
            {p.sub}
          </Txt>
        </RNode>
      ))}

      {/* 环中心 */}
      <circle cx={cx} cy={cy} r={66} fill={DT.surface} stroke={hue} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
      <Txt x={cx} y={cy - 10} bold size={14} fill={hue}>
        幻觉率 -40%
      </Txt>
      <Txt x={cx} y={cy + 12} size={10.5} fill={DT.ink3}>
        （谷歌口径）
      </Txt>
      <Txt x={cx} y={cy + 30} size={10} fill={DT.ink3}>
        vs 单次检索回答
      </Txt>

      {/* 外圈产品标注 */}
      {[
        { name: 'OpenAI Deep Research', x: 120, y: 60 },
        { name: 'Gemini Deep Research', x: 740, y: 60 },
        { name: 'Kimi 探索版', x: 120, y: 440 },
        { name: '夸克 AI 搜索', x: 740, y: 440 },
      ].map((p) => (
        <RNode key={p.name} x={p.x - 95} y={p.y - 20} w={190} h={40} fill={DT.surface} dashed stroke={DT.ink3}>
          <Txt x={p.x} y={p.y + 5} size={11.5} fill={DT.ink2}>
            {p.name}
          </Txt>
        </RNode>
      ))}
      <Txt x={440} y={496} size={12} fill={DT.ink2}>
        深度研究 = 把「一次检索一次生成」升级为「多轮规划-检索-反思」的循环
      </Txt>
    </svg>
  );
}
