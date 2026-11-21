// fig-data-decision-loop：数据流 + 决策流双流水线闭环
// site_ia.md §4.1：上=决策流（在线，请求到返回），下=数据流（离线/近线，埋点→日志→特征→样本→训练）；
// 两端竖向箭头闭环（用户行为落埋点，模型发布升在线）

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowRight, ArrowDown, ArrowUp } from './helpers';

const DECISION = ['请求进入', '多路召回', '排序打分', '返回结果'];
const DATA = ['埋点上报', '日志收集', '特征加工', '样本构造', '模型训练'];

export default function FigDataDecisionLoop({ hue = '#6E6257', tint = '#ECE7E1' }: DiagramProps) {
  const w = 128;
  const gap = 22;
  const x0 = 120;
  const topY = 70;
  const botY = 250;
  const endX = x0 + DECISION.length * w + (DECISION.length - 1) * gap;
  const dx0 = endX - (DATA.length * w + (DATA.length - 1) * gap); // 数据流右对齐起始

  return (
    <svg viewBox="0 0 880 400" width="100%" role="img" aria-label="数据流与决策流双流水线闭环">
      {/* 上：决策流（在线） */}
      <Txt x={x0 - 12} y={topY + 5} anchor="end" bold fill={hue}>
        决策流
      </Txt>
      <Txt x={x0 - 12} y={topY + 25} anchor="end" size={11.5} fill={DT.ink3}>
        在线 · 毫秒级
      </Txt>
      {DECISION.map((d, i) => {
        const x = x0 + i * (w + gap);
        return (
          <g key={d}>
            <RNode x={x} y={topY} w={w} h={48} fill={i % 2 === 0 ? tint : DT.surface} stroke={i % 2 === 0 ? hue : DT.ink2}>
              <Txt x={x + w / 2} y={topY + 30} size={12.5} bold>
                {d}
              </Txt>
            </RNode>
            {i < DECISION.length - 1 && <ArrowRight x1={x + w + 2} x2={x + w + gap - 2} y={topY + 24} />}
          </g>
        );
      })}

      {/* 下：数据流（离线/近线），方向自右向左读作闭环，但绘制从左到右 */}
      <Txt x={x0 - 12} y={botY + 5} anchor="end" bold fill={hue}>
        数据流
      </Txt>
      <Txt x={x0 - 12} y={botY + 25} anchor="end" size={11.5} fill={DT.ink3}>
        离线/近线 · 天~分钟级
      </Txt>
      {DATA.map((d, i) => {
        const x = dx0 + i * (w + gap);
        return (
          <g key={d}>
            <RNode x={x} y={botY} w={w} h={48} fill={i % 2 === 0 ? DT.surface2 : DT.surface}>
              <Txt x={x + w / 2} y={botY + 30} size={12.5}>
                {d}
              </Txt>
            </RNode>
            {i < DATA.length - 1 && <ArrowRight x1={x + w + 2} x2={x + w + gap - 2} y={botY + 24} />}
          </g>
        );
      })}

      {/* 右端：用户行为 → 埋点（决策流尾落数据流头） */}
      <path
        d={`M${endX + 8} ${topY + 24} L${endX + 34} ${topY + 24} L${endX + 34} ${botY + 24} L${endX + 8} ${botY + 24}`}
        fill="none"
        stroke={DT.ink2}
        strokeWidth={DT.strokeWidth}
      />
      <Txt x={endX + 44} y={(topY + botY) / 2 + 24} anchor="start" size={12} fill={DT.ink2}>
        用户行为
      </Txt>
      <Txt x={endX + 44} y={(topY + botY) / 2 + 44} anchor="start" size={12} fill={DT.ink2}>
        回流
      </Txt>

      {/* 左端：模型发布 → 加载（数据流尾升决策流头） */}
      <ArrowUp x={x0 + w / 2} y1={botY - 4} y2={topY + 52} color={DT.success} />
      <line x1={dx0 + w / 2} y1={botY - 4} x2={x0 + w / 2 + 40} y2={botY - 40} stroke={DT.success} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
      <Txt x={x0 + w / 2 - 70} y={(topY + botY) / 2 + 28} size={12} fill={DT.success}>
        模型 / 特征 / 索引发布
      </Txt>

      {/* 中部注释 */}
      <rect x={x0 + 140} y={(topY + botY) / 2 - 6} width={430} height={36} rx={DT.nodeRadius} fill={DT.surface} stroke={hue} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
      <Txt x={x0 + 355} y={(topY + botY) / 2 + 17} size={12.5} fill={hue} bold>
        决策流消费数据流的产物，数据流回收决策流的结果
      </Txt>

      <ArrowDown x={dx0 + w / 2} y1={botY + 48} y2={botY + 78} dashed color={DT.ink3} />
      <Txt x={dx0 + w / 2} y={botY + 100} size={12} fill={DT.ink3}>
        新一轮迭代：数据是下一次决策的原料
      </Txt>
    </svg>
  );
}
