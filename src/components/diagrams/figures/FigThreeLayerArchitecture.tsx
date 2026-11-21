// fig-three-layer-architecture：在线/近线/离线三层架构图（全站核心图）
// site_ia.md §4.1：三条泳道 + 「特征/模型/索引发布」箭头 + 用户行为回流闭环 + 比喻标注

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowRight } from './helpers';

export default function FigThreeLayerArchitecture({ hue = DT.accent, tint = '#F6E7DC' }: DiagramProps) {
  const lanes = [
    {
      y: 40,
      label: '在线层',
      meta: '百毫秒 SLA · 用实时数据 · 保证实时服务',
      metaphor: '冲锋士兵',
      nodes: ['请求接入', 'QP', '召回', '粗排', '精排', '重排'],
    },
    {
      y: 190,
      label: '近线层',
      meta: 'Flink 流式 · 用实时数据 · 不保证实时服务',
      metaphor: '前方支援',
      nodes: ['实时特征', '实时样本', '实时统计', '增量更新'],
    },
    {
      y: 340,
      label: '离线层',
      meta: '天级批量 · 不用实时数据 · 不提供实时服务',
      metaphor: '大后方产粮',
      nodes: ['埋点数仓', '标签挖掘', '特征生产', '模型训练'],
    },
  ];

  return (
    <svg viewBox="0 0 880 500" width="100%" role="img" aria-label="在线、近线、离线三层架构图">
      {lanes.map((lane, li) => {
        const nodeW = li === 0 ? 78 : 104;
        const gap = li === 0 ? 16 : 22;
        const totalW = lane.nodes.length * nodeW + (lane.nodes.length - 1) * gap;
        const startX = 150;
        return (
          <g key={lane.label}>
            {/* 泳道底 */}
            <rect
              x={20}
              y={lane.y - 14}
              width={840}
              height={120}
              rx={12}
              fill={li === 0 ? tint : DT.surface2}
              opacity={li === 0 ? 0.9 : 0.55}
            />
            {/* 泳道标签 */}
            <Txt x={36} y={lane.y + 16} anchor="start" bold fill={hue}>
              {lane.label}
            </Txt>
            <Txt x={36} y={lane.y + 36} anchor="start" size={11} fill={DT.ink3}>
              {lane.metaphor}
            </Txt>
            <Txt x={36} y={lane.y + 78} anchor="start" size={10.5} fill={DT.ink3}>
              {lane.meta.split('·')[0]}
            </Txt>
            {lane.nodes.map((n, i) => {
              const bx = startX + i * (nodeW + gap) + (700 - totalW) / 2;
              return (
                <g key={n}>
                  <RNode x={bx} y={lane.y} w={nodeW} h={44} fill={DT.surface} stroke={li === 0 ? hue : DT.ink2}>
                    <Txt x={bx + nodeW / 2} y={lane.y + 27} size={12}>
                      {n}
                    </Txt>
                  </RNode>
                  {i < lane.nodes.length - 1 && (
                    <ArrowRight x1={bx + nodeW} x2={bx + nodeW + gap} y={lane.y + 22} color={DT.ink3} />
                  )}
                </g>
              );
            })}
          </g>
        );
      })}

      {/* 层间发布箭头：离线 → 近线 → 在线（右侧向上） */}
      <g stroke={hue} strokeWidth={DT.strokeWidth} fill="none">
        <path d={`M810 340 L810 310 L790 310 L790 236 L810 236 L810 190`} strokeDasharray={DT.dash} opacity={0} />
        <line x1={800} y1={340} x2={800} y2={316} />
        <path d="M796 318 L800 310 L804 318 Z" fill={hue} stroke="none" />
        <line x1={800} y1={190} x2={800} y2={166} />
        <path d="M796 168 L800 160 L804 168 Z" fill={hue} stroke="none" />
      </g>
      <Txt x={814} y={270} anchor="start" size={11} fill={hue}>
        特征 / 模型
      </Txt>
      <Txt x={814} y={286} anchor="start" size={11} fill={hue}>
        / 索引发布
      </Txt>

      {/* 用户行为回流：在线右侧 → 埋点 → 回到离线（左侧闭环） */}
      <g>
        <path
          d="M700 106 L740 106 L740 150 L60 150 L60 366 L140 366"
          fill="none"
          stroke={DT.ink3}
          strokeWidth={DT.strokeWidth}
          strokeDasharray={DT.dash}
        />
        <path d="M134 362 L142 366 L134 370 Z" fill={DT.ink3} />
        <Txt x={400} y={142} size={11.5} fill={DT.ink3}>
          用户行为回流（埋点 → Kafka → 数仓），数据流闭环
        </Txt>
      </g>

      {/* 产品第一问 */}
      <rect x={150} y={446} width={580} height={40} rx={DT.nodeRadius} fill={DT.surface} stroke={hue} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
      <Txt x={440} y={471} bold fill={hue}>
        产品第一问：「这个逻辑应该放在哪一层？」
      </Txt>
    </svg>
  );
}
