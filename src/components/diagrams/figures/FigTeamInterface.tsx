// fig-team-interface：四方协作界面图
// site_ia.md §4.5：四象限：策略产品（目标/指标口径/AB 设计）、算法工程（模型实现）、
// 推荐架构（在线服务/中台/算力 ROI）、数据团队（埋点/数仓/实验平台）；
// 中心交接面：输入侧（目标+数据口径）与输出侧（离线指标+业务收益）箭头

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowDown, ArrowUp } from './helpers';

const QUADS = [
  { name: '策略产品', subs: ['目标定义', '指标口径', 'AB 设计'], x: 60, y: 50 },
  { name: '算法工程', subs: ['模型实现', '特征策略迭代'], x: 500, y: 50 },
  { name: '推荐架构', subs: ['在线服务 / 中台', '算力 ROI'], x: 60, y: 300 },
  { name: '数据团队', subs: ['埋点 / 数仓', '实验平台'], x: 500, y: 300 },
];

export default function FigTeamInterface({ hue = '#6E6257', tint = '#ECE7E1' }: DiagramProps) {
  const center = { x: 440, y: 245 };
  return (
    <svg viewBox="0 0 880 540" width="100%" role="img" aria-label="四方协作界面图">
      {QUADS.map((q, i) => (
        <g key={q.name}>
          <RNode x={q.x} y={q.y} w={280} h={130} fill={i % 2 === 0 ? tint : DT.surface} stroke={i % 2 === 0 ? hue : DT.ink2}>
            <Txt x={q.x + 140} y={q.y + 34} bold size={13.5} fill={DT.ink}>
              {q.name}
            </Txt>
            {q.subs.map((s, j) => (
              <Txt key={j} x={q.x + 140} y={q.y + 62 + j * 22} size={11} fill={DT.ink3}>
                {s}
              </Txt>
            ))}
          </RNode>
          {/* 与中心的连线 */}
          <line
            x1={q.x + (q.x < 400 ? 280 : 0)}
            y1={q.y + 65}
            x2={center.x + (q.x < 400 ? -110 : 110)}
            y2={center.y + (q.y < 200 ? -40 : 40)}
            stroke={DT.lineStrong}
            strokeWidth={DT.strokeWidth}
          />
        </g>
      ))}

      {/* 中心交接面 */}
      <RNode x={center.x - 110} y={center.y - 70} w={220} h={140} fill={DT.surface2} stroke={DT.ink2}>
        <Txt x={center.x} y={center.y - 42} bold size={12.5} fill={DT.ink}>
          交接面（Interface）
        </Txt>
        <Txt x={center.x} y={center.y - 14} size={10.5} fill={DT.ink2}>
          输入侧：目标 + 数据口径
        </Txt>
        <Txt x={center.x} y={center.y + 10} size={10.5} fill={DT.ink2}>
          输出侧：离线指标 + 业务收益
        </Txt>
        <Txt x={center.x} y={center.y + 40} size={10} fill={DT.ink3}>
          对齐靠评审清单与共同语言
        </Txt>
      </RNode>

      {/* 输入/输出箭头 */}
      <ArrowDown x={center.x - 40} y1={center.y - 96} y2={center.y - 72} color={hue} />
      <Txt x={center.x - 40} y={center.y - 102} size={10} fill={hue}>
        目标输入
      </Txt>
      <ArrowUp x={center.x + 40} y1={center.y + 96} y2={center.y + 72} color={DT.success} />
      <Txt x={center.x + 40} y={center.y + 116} size={10} fill={DT.success}>
        结果输出
      </Txt>

      <Txt x={440} y={486} size={12.5} fill={DT.ink2}>
        四方不是上下级而是「接口关系」：协作质量 = 交接面的清晰度
      </Txt>
      <Txt x={440} y={512} size={11} fill={DT.ink3}>
        最常见的项目延期原因：指标口径没在评审时对齐，而是上线后才发现
      </Txt>
    </svg>
  );
}
