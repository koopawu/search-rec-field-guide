// fig-unified-generative-distribution：搜推问一体生成式分发架构
// site_ia.md §4.1：中心大模型（语义ID + 编码器-解码器 + RL 偏好对齐），
// 四个任务卡片（搜索/推荐/广告/查询建议）汇入，输出统一分发出口；角落灰色小图对比传统四链路

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowRight } from './helpers';

const TASKS = ['搜索', '推荐', '广告', '查询建议'];

export default function FigUnifiedGenerativeDistribution({
  hue = '#4E7A72',
  tint = '#E2EDEA',
}: DiagramProps) {
  const cy = 210;
  return (
    <svg viewBox="0 0 880 480" width="100%" role="img" aria-label="搜推问一体生成式分发架构">
      {/* 左：四类任务输入 */}
      {TASKS.map((t, i) => {
        const y = 60 + i * 100;
        return (
          <g key={t}>
            <RNode x={50} y={y} w={150} h={56} fill={DT.surface}>
              <Txt x={125} y={y + 26} bold fill={DT.ink}>
                {t}
              </Txt>
              <Txt x={125} y={y + 46} size={11} fill={DT.ink3}>
                同构任务 {i + 1}/4
              </Txt>
            </RNode>
            <path
              d={`M200 ${y + 28} L250 ${y + 28} L${290} ${cy - 8 + (i - 1.5) * 4} L320 ${cy - 8 + (i - 1.5) * 4}`}
              fill="none"
              stroke={DT.ink2}
              strokeWidth={DT.strokeWidth}
            />
            <path
              d={`M312 ${cy - 12 + (i - 1.5) * 4} L322 ${cy - 8 + (i - 1.5) * 4} L312 ${cy - 4 + (i - 1.5) * 4} Z`}
              fill={DT.ink2}
            />
          </g>
        );
      })}
      <Txt x={125} y={40} size={12} fill={DT.ink3}>
        四种同构的分发任务
      </Txt>

      {/* 中心：统一生成式大模型 */}
      <RNode x={330} y={cy - 110} w={260} h={220} fill={tint} stroke={hue}>
        <Txt x={460} y={cy - 76} bold fill={DT.ink} size={15}>
          统一生成式分发模型
        </Txt>
        <RNode x={360} y={cy - 56} w={200} h={34} fill={DT.surface}>
          <Txt x={460} y={cy - 34} size={12}>
            语义 ID 物品表示
          </Txt>
        </RNode>
        <RNode x={360} y={cy - 14} w={200} h={34} fill={DT.surface}>
          <Txt x={460} y={cy + 8} size={12}>
            编码器 - 解码器
          </Txt>
        </RNode>
        <RNode x={360} y={cy + 28} w={200} h={34} fill={DT.surface}>
          <Txt x={460} y={cy + 50} size={12}>
            RL 偏好对齐
          </Txt>
        </RNode>
        <Txt x={460} y={cy + 92} size={11.5} fill={DT.ink3}>
          一个模型直接「生成」分发结果
        </Txt>
      </RNode>

      {/* 右：统一分发出口 */}
      <ArrowRight x1={590} x2={650} y={cy} color={hue} />
      <RNode x={650} y={cy - 40} w={170} h={80} fill={tint} stroke={hue}>
        <Txt x={735} y={cy - 8} bold fill={DT.ink}>
          统一分发出口
        </Txt>
        <Txt x={735} y={cy + 16} size={11.5} fill={DT.ink3}>
          生成 item 语义 ID 序列
        </Txt>
      </RNode>

      {/* 角落对比：传统四条独立链路（灰色小图） */}
      <RNode x={620} y={336} w={220} h={120} fill={DT.surface} dashed stroke={DT.ink3}>
        <Txt x={730} y={360} size={12} bold fill={DT.ink3}>
          传统方式（对比）
        </Txt>
        {TASKS.map((t, i) => {
          const y = 372 + i * 20;
          return (
            <g key={t}>
              <rect x={636} y={y} width={56} height={14} rx={4} fill={DT.surface2} stroke={DT.ink3} strokeWidth={1} />
              <Txt x={664} y={y + 11} size={10} fill={DT.ink3}>
                {t}
              </Txt>
              <line x1={692} y1={y + 7} x2={716} y2={y + 7} stroke={DT.ink3} strokeWidth={1} />
              <rect x={716} y={y} width={100} height={14} rx={4} fill="none" stroke={DT.ink3} strokeWidth={1} />
              <Txt x={766} y={y + 11} size={10} fill={DT.ink3}>
                独立漏斗链路
              </Txt>
            </g>
          );
        })}
      </RNode>
      <Txt x={440} y={456} size={12} fill={DT.ink3}>
        搜 / 推 / 广告 / 建议从四套系统收敛为一个模型，目标一致、不再级联损耗
      </Txt>
    </svg>
  );
}
