// fig-pm-capability-map：LLM 时代策略 PM 能力地图
// site_ia.md §4.5：四层同心圆：技术理解（RAG/SID/Scaling Law/MFU）→ 评估体系
// （幻觉率/引用可靠性）→ 成本意识（token 账/分级 ROI）→ 新工作方式（LLM 辅助归因/合成数据）；
// 中心「定义理想体验与目标权衡」

import { DT, type DiagramProps } from '../tokens';
import { Txt } from './helpers';

const RINGS = [
  { r: 200, name: '新工作方式', sub: 'LLM 辅助归因 / 合成数据 / Prompt 即策略' },
  { r: 156, name: '成本意识', sub: 'token 账本 / 分级 ROI / 延迟-效果换算' },
  { r: 112, name: '评估体系', sub: '幻觉率 / 引用可靠性 / 人工评审设计' },
  { r: 68, name: '技术理解', sub: 'RAG / Semantic ID / Scaling Law / MFU' },
];

export default function FigPmCapabilityMap({ hue = '#4E7A72', tint = '#E2EDEA' }: DiagramProps) {
  const cx = 330;
  const cy = 250;
  return (
    <svg viewBox="0 0 880 540" width="100%" role="img" aria-label="LLM 时代策略 PM 能力地图">
      {/* 同心圆（从外到内） */}
      {RINGS.map((r, i) => (
        <g key={r.name}>
          <circle cx={cx} cy={cy} r={r.r} fill={i % 2 === 0 ? DT.surface : tint} stroke={i === 3 ? hue : DT.ink2} strokeWidth={DT.strokeWidth} />
          <Txt x={cx} y={cy - r.r + 20} bold size={12.5} fill={i === 3 ? hue : DT.ink2}>
            {r.name}
          </Txt>
          <Txt x={cx} y={cy - r.r + 38} size={10} fill={DT.ink3}>
            {r.sub}
          </Txt>
        </g>
      ))}

      {/* 中心 */}
      <circle cx={cx} cy={cy} r={34} fill={DT.surface} stroke={hue} strokeWidth={2} />
      <Txt x={cx} y={cy - 4} bold size={11} fill={hue}>
        定义理想体验
      </Txt>
      <Txt x={cx} y={cy + 13} bold size={11} fill={hue}>
        与目标权衡
      </Txt>

      {/* 右侧注解 */}
      <g>
        <Txt x={620} y={110} anchor="start" bold size={13} fill={DT.ink}>
          能力重心的迁移
        </Txt>
        {[
          ['从', '调特征权重、盯 AUC'],
          ['到', '设计奖励信号、定义评估集'],
          ['从', '写需求文档'],
          ['到', '写 Prompt / 验收标准 / badcase 规约'],
        ].map(([k, v], i) => (
          <g key={i}>
            <Txt x={620} y={150 + i * 44} anchor="start" mono size={11} fill={DT.ink3}>
              {k}
            </Txt>
            <Txt x={652} y={150 + i * 44} anchor="start" size={11.5} fill={DT.ink2}>
              {v}
            </Txt>
          </g>
        ))}
        <line x1={600} y1={330} x2={840} y2={330} stroke={DT.lineStrong} strokeWidth={1} strokeDasharray={DT.dash} />
        <Txt x={620} y={362} anchor="start" size={11} fill={DT.ink3}>
          四层能力从外到内构建，
        </Txt>
        <Txt x={620} y={384} anchor="start" size={11} fill={DT.ink3}>
          最终服务于中心的「定义权」
        </Txt>
      </g>

      <Txt x={330} y={512} size={12} fill={DT.ink2}>
        模型能力越强，PM 的价值越向「定义目标与评估」集中
      </Txt>
    </svg>
  );
}
