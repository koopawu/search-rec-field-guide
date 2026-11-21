// fig-generative-vs-cascade：级联架构 vs 端到端生成式对比（全站核心图）
// site_ia.md §4.5：左=传统级联（四框+通信开销红色标注），右=端到端（单一生成模型框），
// 底部横条对比维度：目标一致性 / 误差累积 / MFU

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowRight } from './helpers';

export default function FigGenerativeVsCascade({ hue = DT.accent, tint = '#F6E7DC' }: DiagramProps) {
  return (
    <svg viewBox="0 0 880 400" width="100%" role="img" aria-label="级联架构与端到端生成式架构对比图">
      {/* 左：传统级联 */}
      <Txt x={210} y={36} bold fill={DT.ink}>
        传统级联架构
      </Txt>
      {['召回', '粗排', '精排', '重排'].map((label, i) => {
        const bx = 60 + i * 78;
        return (
          <g key={label}>
            <RNode x={bx} y={60} w={62} h={44} fill={DT.surface} stroke={DT.ink2}>
              <Txt x={bx + 31} y={87} size={12.5}>
                {label}
              </Txt>
            </RNode>
            {i < 3 && <ArrowRight x1={bx + 62} x2={bx + 78} y={82} color={DT.ink3} />}
          </g>
        );
      })}
      {/* 模块间通信开销（红色标注） */}
      <g>
        <path
          d="M60 128 L366 128"
          stroke={DT.danger}
          strokeWidth={DT.strokeWidth}
          strokeDasharray={DT.dash}
        />
        {[99, 177, 255].map((mx) => (
          <g key={mx}>
            <circle cx={mx} cy={128} r={4} fill={DT.danger} />
          </g>
        ))}
        <Txt x={213} y={152} size={12} fill={DT.danger}>
          &gt;50% 资源耗在模块间通信与存储
        </Txt>
      </g>
      <RNode x={60} y={176} w={306} h={40} fill={DT.surface2} dashed stroke={DT.ink3}>
        <Txt x={213} y={201} size={12} fill={DT.ink3}>
          计算碎片化 · 各级优化目标不一致
        </Txt>
      </RNode>

      {/* 分隔虚线 */}
      <line x1={440} y1={24} x2={440} y2={300} stroke={DT.lineStrong} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />

      {/* 右：端到端生成式 */}
      <Txt x={660} y={36} bold fill={DT.ink}>
        端到端生成式
      </Txt>
      <RNode x={486} y={60} w={120} h={44} fill={DT.surface}>
        <Txt x={546} y={87} size={12.5}>
          用户行为序列
        </Txt>
      </RNode>
      <ArrowRight x1={606} x2={634} y={82} />
      <RNode x={634} y={52} w={180} h={60} fill={tint} stroke={hue}>
        <Txt x={724} y={78} bold fill={hue} size={13}>
          单一生成模型
        </Txt>
        <Txt x={724} y={98} size={11.5} fill={DT.ink3}>
          语义 ID + Seq2Seq
        </Txt>
      </RNode>
      <ArrowRight x1={634} x2={606} y={140} color={DT.ink3} dashed />
      <RNode x={486} y={118} w={120} h={44} fill={DT.surface}>
        <Txt x={546} y={145} size={12.5}>
          推荐列表输出
        </Txt>
      </RNode>
      <RNode x={486} y={190} w={328} h={56} fill={DT.surface2} stroke={hue}>
        <Txt x={650} y={213} size={12} fill={DT.ink}>
          OneRec：OPEX 仅传统 10.6%
        </Txt>
        <Txt x={650} y={233} mono size={12} fill={hue}>
          算子 1.5 万 → 1200
        </Txt>
      </RNode>

      {/* 底部对比维度横条 */}
      <g>
        <rect x={60} y={300} width={754} height={76} rx={DT.nodeRadius} fill={DT.surface} stroke={DT.line} strokeWidth={DT.strokeWidth} />
        {[
          ['目标一致性', '割裂 → 统一目标 + RL 对齐'],
          ['误差累积', '逐级放大 → 端到端一次生成'],
          ['MFU 算力利用', '碎片化低利用 → 23.7-28.8%（OneRec）'],
        ].map(([k, v], i) => (
          <g key={k}>
            <Txt x={100 + i * 250} y={330} anchor="start" bold size={12.5} fill={hue}>
              {k}
            </Txt>
            <Txt x={100 + i * 250} y={354} anchor="start" size={12} fill={DT.ink2}>
              {v}
            </Txt>
            {i > 0 && (
              <line
                x1={78 + i * 250}
                y1={314}
                x2={78 + i * 250}
                y2={362}
                stroke={DT.line}
                strokeWidth={DT.strokeWidth}
              />
            )}
          </g>
        ))}
      </g>
    </svg>
  );
}
