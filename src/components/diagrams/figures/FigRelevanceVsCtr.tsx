// fig-relevance-vs-ctr：相关性 × 点击率四象限
// site_ia.md §4.5：2×2：高相关高点击（优质）、高点击低相关（标题党，要过滤）、
// 高相关低点击（冷门优质，要扶持）、双低（噪声）；标注美团黄金规则与点评 BadCase -2.9pp

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt } from './helpers';

export default function FigRelevanceVsCtr({ hue = '#A9713A', tint = '#F5EBDD' }: DiagramProps) {
  const cx = 320;
  const cy = 220;
  const qw = 250;
  const qh = 150;
  return (
    <svg viewBox="0 0 880 500" width="100%" role="img" aria-label="相关性与点击率四象限">
      {/* 坐标轴 */}
      <line x1={cx} y1={cy - qh - 16} x2={cx} y2={cy + qh + 16} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <line x1={cx - qw - 16} y1={cy} x2={cx + qw + 16} y2={cy} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <Txt x={cx + qw + 14} y={cy - 8} anchor="end" size={11.5} fill={DT.ink3}>
        点击率 →
      </Txt>
      <Txt x={cx + 10} y={cy - qh - 20} anchor="start" size={11.5} fill={DT.ink3}>
        相关性 ↑
      </Txt>

      {/* 四个象限 */}
      {/* 右上：双高 */}
      <rect x={cx + 6} y={cy - qh} width={qw - 12} height={qh - 6} rx={DT.nodeRadius} fill={tint} stroke={DT.success} strokeWidth={DT.strokeWidth} />
      <Txt x={cx + qw / 2} y={cy - qh + 34} bold fill={DT.success}>
        高相关 · 高点击
      </Txt>
      <Txt x={cx + qw / 2} y={cy - qh + 58} size={11.5} fill={DT.ink2}>
        优质结果：排序的良心区
      </Txt>
      <Txt x={cx + qw / 2} y={cy - qh + 80} size={10.5} fill={DT.ink3}>
        策略：保持，作为正样本锚
      </Txt>

      {/* 左上：高相关低点击 */}
      <rect x={cx - qw + 6} y={cy - qh} width={qw - 12} height={qh - 6} rx={DT.nodeRadius} fill={DT.surface} stroke={DT.warning} strokeWidth={DT.strokeWidth} />
      <Txt x={cx - qw / 2} y={cy - qh + 34} bold fill={DT.warning}>
        高相关 · 低点击
      </Txt>
      <Txt x={cx - qw / 2} y={cy - qh + 58} size={11.5} fill={DT.ink2}>
        冷门优质：标题/封面拖后腿
      </Txt>
      <Txt x={cx - qw / 2} y={cy - qh + 80} size={10.5} fill={DT.ink3}>
        策略：要扶持（冷启动流量倾斜）
      </Txt>

      {/* 右下：低相关高点击 */}
      <rect x={cx + 6} y={cy + 6} width={qw - 12} height={qh - 6} rx={DT.nodeRadius} fill={DT.surface} stroke={DT.danger} strokeWidth={DT.strokeWidth} />
      <Txt x={cx + qw / 2} y={cy + 40} bold fill={DT.danger}>
        低相关 · 高点击
      </Txt>
      <Txt x={cx + qw / 2} y={cy + 64} size={11.5} fill={DT.ink2}>
        标题党：CTR 高但伤害信任
      </Txt>
      <Txt x={cx + qw / 2} y={cy + 86} size={10.5} fill={DT.danger}>
        策略：相关性模型要过滤/打压
      </Txt>

      {/* 左下：双低 */}
      <rect x={cx - qw + 6} y={cy + 6} width={qw - 12} height={qh - 6} rx={DT.nodeRadius} fill={DT.surface2} stroke={DT.ink3} strokeWidth={DT.strokeWidth} />
      <Txt x={cx - qw / 2} y={cy + 40} bold fill={DT.ink3}>
        低相关 · 低点击
      </Txt>
      <Txt x={cx - qw / 2} y={cy + 64} size={11.5} fill={DT.ink2}>
        噪声：本就不该进候选
      </Txt>
      <Txt x={cx - qw / 2} y={cy + 86} size={10.5} fill={DT.ink3}>
        策略：召回/QP 侧治理
      </Txt>

      {/* 案例锚点 */}
      <RNode x={620} y={80} w={230} h={130} fill={DT.surface} dashed>
        <Txt x={735} y={106} bold size={12.5} fill={DT.ink}>
          工业界锚点
        </Txt>
        <Txt x={735} y={132} size={11} fill={DT.ink2}>
          美团黄金规则：相关性是
        </Txt>
        <Txt x={735} y={150} size={11} fill={DT.ink2}>
          一切排序优化的前置约束
        </Txt>
        <Txt x={735} y={176} size={11} fill={hue}>
          点评：低相关 BadCase -2.9pp
        </Txt>
        <Txt x={735} y={194} size={10} fill={DT.ink3}>
          先保证「相关」，再优化「点击」
        </Txt>
      </RNode>

      <Txt x={320} y={cy + qh + 46} size={12} fill={DT.ink2}>
        CTR 回答「用户点不点」，相关性回答「该不该给」——两个轴不可互相替代
      </Txt>
    </svg>
  );
}
