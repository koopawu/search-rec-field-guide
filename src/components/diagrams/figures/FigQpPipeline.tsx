// fig-qp-pipeline：Query 理解九模块 Pipeline
// site_ia.md §4.1：Cache 命中 → 预处理 → 分词 → 纠错 → 归一/扩展/联想 → Term 分析
// → 意图识别 → 专项信号 → 人工干预层（贯穿底部横条）；输出「结构化信号」分叉到召回与排序

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowRight, ArrowDown } from './helpers';

const MODULES = [
  'Cache 命中',
  '预处理',
  '分词',
  '纠错',
  '归一/扩展/联想',
  'Term 分析',
  '意图识别',
  '专项信号',
];

export default function FigQpPipeline({ hue = '#A9713A', tint = '#F5EBDD' }: DiagramProps) {
  const w = 92;
  const gap = 10;
  const x0 = 40;
  const y = 96;
  const totalW = MODULES.length * w + (MODULES.length - 1) * gap;
  const midX = x0 + totalW / 2;

  return (
    <svg viewBox="0 0 880 420" width="100%" role="img" aria-label="Query 理解九模块 Pipeline">
      <Txt x={x0} y={40} anchor="start" bold fill={DT.ink}>
        原始 Query
      </Txt>
      <ArrowRight x1={x0 + 76} x2={x0 + 110} y={34} />

      {/* 输入 */}
      <RNode x={x0 + 110} y={16} w={130} h={36} fill={DT.surface2}>
        <Txt x={x0 + 175} y={39} mono size={12.5}>
          "iphne 15 降价"
        </Txt>
      </RNode>
      <ArrowDown x={x0 + 175} y1={52} y2={y} />

      {/* 9 模块流水线（8 个处理模块 + 干预层横条 = 9 模块） */}
      {MODULES.map((m, i) => {
        const x = x0 + i * (w + gap);
        return (
          <g key={m}>
            <RNode x={x} y={y} w={w} h={52} fill={i % 2 === 0 ? tint : DT.surface} stroke={i % 2 === 0 ? hue : DT.ink2}>
              {m.length <= 5 ? (
                <Txt x={x + w / 2} y={y + 31} size={12.5} bold={i % 2 === 0}>
                  {m}
                </Txt>
              ) : (
                <>
                  <Txt x={x + w / 2} y={y + 22} size={11.5}>
                    {m.slice(0, 4)}
                  </Txt>
                  <Txt x={x + w / 2} y={y + 40} size={11.5}>
                    {m.slice(4)}
                  </Txt>
                </>
              )}
            </RNode>
            {i < MODULES.length - 1 && <ArrowRight x1={x + w + 1} x2={x + w + gap - 1} y={y + 26} />}
            {/* 与干预层的虚线连接 */}
            <line
              x1={x + w / 2}
              y1={y + 52}
              x2={x + w / 2}
              y2={y + 96}
              stroke={DT.lineStrong}
              strokeWidth={1}
              strokeDasharray="3 4"
            />
          </g>
        );
      })}
      <Txt x={x0} y={y - 12} anchor="start" size={12} fill={DT.ink3}>
        逐模块加工，任一环节出错都会传导到下游
      </Txt>

      {/* 人工干预层：贯穿底部横条 */}
      <RNode x={x0} y={y + 96} w={totalW} h={38} fill={DT.surface} dashed stroke={DT.warning}>
        <Txt x={midX} y={y + 120} size={12.5} fill={DT.warning} bold>
          人工干预层（黑白名单 / 运营配置，可覆盖任意模块输出）
        </Txt>
      </RNode>

      {/* 输出：结构化信号 → 召回 / 排序 */}
      <ArrowDown x={midX} y1={y + 134} y2={y + 162} />
      <RNode x={midX - 110} y={y + 162} w={220} h={44} fill={tint} stroke={hue}>
        <Txt x={midX} y={y + 189} bold fill={DT.ink}>
          结构化信号
        </Txt>
      </RNode>
      {/* 分叉 */}
      <path
        d={`M${midX - 60} ${y + 206} L${midX - 60} ${y + 226} L${midX - 240} ${y + 226} L${midX - 240} ${y + 244}`}
        fill="none"
        stroke={DT.ink2}
        strokeWidth={DT.strokeWidth}
      />
      <path
        d={`M${midX + 60} ${y + 206} L${midX + 60} ${y + 226} L${midX + 240} ${y + 226} L${midX + 240} ${y + 244}`}
        fill="none"
        stroke={DT.ink2}
        strokeWidth={DT.strokeWidth}
      />
      <path d={`M${midX - 244} ${y + 238} L${midX - 240} ${y + 246} L${midX - 236} ${y + 238} Z`} fill={DT.ink2} />
      <path d={`M${midX + 236} ${y + 238} L${midX + 240} ${y + 246} L${midX + 244} ${y + 238} Z`} fill={DT.ink2} />
      <RNode x={midX - 330} y={y + 246} w={180} h={44} fill={DT.surface2}>
        <Txt x={midX - 240} y={y + 273} bold fill={DT.ink}>
          召回（定方向）
        </Txt>
      </RNode>
      <RNode x={midX + 150} y={y + 246} w={180} h={44} fill={DT.surface2}>
        <Txt x={midX + 240} y={y + 273} bold fill={DT.ink}>
          排序（定精度）
        </Txt>
      </RNode>
    </svg>
  );
}
