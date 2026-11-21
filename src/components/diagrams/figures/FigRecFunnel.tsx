// fig-rec-funnel：推荐系统四级漏斗架构图（全站核心图）
// site_ia.md §4.1：顶层「用户画像+上下文」→ 召回 6 条并行通道 → 粗排 → 精排 → 重排
// 右侧标注候选量级（亿→万→千→百→十）与典型模型；底部注释

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowDown } from './helpers';

const CHANNELS = ['协同过滤', '双塔向量', '热点', '标签', '地域', '关注'];

export default function FigRecFunnel({ hue = DT.accent, tint = '#F6E7DC' }: DiagramProps) {
  // 漏斗各层半宽（顶部 300 → 底部 60）
  const cx = 380;
  return (
    <svg viewBox="0 0 880 600" width="100%" role="img" aria-label="推荐系统四级漏斗架构图">
      {/* 顶层：用户画像 + 上下文 */}
      <RNode x={cx - 150} y={16} w={300} h={44} fill={DT.surface2}>
        <Txt x={cx} y={44} bold fill={DT.ink}>
          用户画像 + 上下文（无 Query）
        </Txt>
      </RNode>
      <ArrowDown x={cx} y1={60} y2={86} />

      {/* 召回层：6 条并行通道 */}
      <path
        d={`M${cx - 300} 86 L${cx + 300} 86 L${cx + 216} 236 L${cx - 216} 236 Z`}
        fill={tint}
        stroke={DT.ink2}
        strokeWidth={DT.strokeWidth}
      />
      <Txt x={cx - 288} y={108} anchor="start" bold fill={hue}>
        召回
      </Txt>
      <Txt x={cx + 288} y={108} anchor="end" mono fill={DT.ink3}>
        亿级 → 万级
      </Txt>
      {CHANNELS.map((c, i) => {
        const w = 88;
        const gap = 10;
        const x = cx - (w * 3 + gap * 2.5) + i * (w + gap);
        return (
          <RNode key={c} x={x} y={122} w={w} h={34} fill={DT.surface} stroke={hue}>
            <Txt x={x + w / 2} y={144} size={12.5}>
              {c}
            </Txt>
          </RNode>
        );
      })}
      {/* 汇入融合节点 */}
      <RNode x={cx - 130} y={176} w={260} h={34} fill={DT.surface}>
        <Txt x={cx} y={198} size={12.5}>
          多路汇入 · 去重 · 配额截断
        </Txt>
      </RNode>
      <Txt x={cx} y={230} size={11.5} fill={DT.ink3}>
        工业界少则 7/8 路，多则几十路
      </Txt>

      {/* 粗排 */}
      <path
        d={`M${cx - 216} 236 L${cx + 216} 236 L${cx + 150} 330 L${cx - 150} 330 Z`}
        fill={DT.surface2}
        stroke={DT.ink2}
        strokeWidth={DT.strokeWidth}
      />
      <Txt x={cx} y={276} bold fill={DT.ink}>
        粗排
      </Txt>
      <Txt x={cx} y={298} size={12} fill={DT.ink3}>
        轻量双塔 / 蒸馏小模型，参数量约精排 1/10
      </Txt>
      <Txt x={cx + 216 + 14} y={284} anchor="start" mono fill={DT.ink3}>
        千级
      </Txt>

      {/* 精排 */}
      <path
        d={`M${cx - 150} 330 L${cx + 150} 330 L${cx + 96} 424 L${cx - 96} 424 Z`}
        fill={tint}
        stroke={DT.ink2}
        strokeWidth={DT.strokeWidth}
      />
      <Txt x={cx} y={370} bold fill={DT.ink}>
        精排
      </Txt>
      <Txt x={cx} y={392} size={12} fill={DT.ink3}>
        DIN / DIEN · 多目标打分
      </Txt>
      <Txt x={cx + 150 + 14} y={378} anchor="start" mono fill={DT.ink3}>
        百级
      </Txt>

      {/* 重排 */}
      <path
        d={`M${cx - 96} 424 L${cx + 96} 424 L${cx + 60} 510 L${cx - 60} 510 Z`}
        fill={DT.surface2}
        stroke={DT.ink2}
        strokeWidth={DT.strokeWidth}
      />
      <Txt x={cx} y={462} bold fill={DT.ink}>
        重排
      </Txt>
      <Txt x={cx} y={484} size={12} fill={DT.ink3}>
        MMR / DPP / 业务规则
      </Txt>
      <Txt x={cx + 96 + 14} y={470} anchor="start" mono fill={DT.ink3}>
        十级
      </Txt>

      {/* 左侧：算力↑精度↑ 渐变箭头（朝下精度越高） */}
      <g>
        <line x1={48} y1={100} x2={48} y2={492} stroke={DT.lineStrong} strokeWidth={DT.strokeWidth} />
        <path d="M44 486 L48 496 L52 486 Z" fill={DT.lineStrong} />
        <Txt x={34} y={296} size={12} fill={DT.ink3} anchor="middle">
          <tspan transform="rotate(-90 34 296)">候选量↓　算力 · 精度↑</tspan>
        </Txt>
      </g>

      {/* 底部注释 */}
      <rect x={cx - 260} y={536} width={520} height={40} rx={DT.nodeRadius} fill={DT.surface} stroke={hue} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
      <Txt x={cx} y={561} bold fill={hue}>
        召回决定上限，精排决定精度，重排是策略主战场
      </Txt>
    </svg>
  );
}
