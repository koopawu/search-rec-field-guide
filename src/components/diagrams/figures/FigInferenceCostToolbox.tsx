// fig-inference-cost-toolbox：推理成本优化工具箱
// site_ia.md §4.5：五级阶梯（按落地顺序）：分级路由（70% 场景 7-13B 够用）→ 缓存（省 50% 算力）
// → 推理引擎（连续批处理 30%→80% 利用率）→ 模型压缩（70B→7B 成本 -88%）→ 架构级（MoE/KV 分级）

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt } from './helpers';

const STEPS = [
  { name: '分级路由', gain: '70% 场景 7-13B 够用', tech: '简单问题走小模型' },
  { name: '缓存', gain: '省 50% 算力', tech: '语义缓存 / KV 复用' },
  { name: '推理引擎', gain: '利用率 30%→80%', tech: '连续批处理 / PagedAttention' },
  { name: '模型压缩', gain: '70B→7B 成本 -88%', tech: '蒸馏 / 量化 / 剪枝' },
  { name: '架构级', gain: 'MFU 再翻倍', tech: 'MoE / KV 分级存储' },
];

export default function FigInferenceCostToolbox({
  hue = '#4E7A72',
  tint = '#E2EDEA',
}: DiagramProps) {
  const w = 150;
  const gap = 18;
  const x0 = 40;
  const baseY = 420;
  const stepH = 66;

  return (
    <svg viewBox="0 0 880 540" width="100%" role="img" aria-label="推理成本优化工具箱">
      <Txt x={x0} y={38} anchor="start" bold fill={DT.ink}>
        按落地顺序排列的五级阶梯：先做便宜的，再做难的
      </Txt>
      <Txt x={x0} y={60} anchor="start" size={11.5} fill={DT.ink3}>
        每一级独立生效、收益可叠加
      </Txt>

      {STEPS.map((s, i) => {
        const x = x0 + i * (w + gap);
        const y = baseY - (i + 1) * stepH;
        return (
          <g key={s.name}>
            <rect x={x} y={y} width={w} height={(i + 1) * stepH} rx={DT.nodeRadius} fill={i % 2 === 0 ? tint : DT.surface2} stroke={i === 0 ? hue : DT.ink2} strokeWidth={DT.strokeWidth} />
            <Txt x={x + w / 2} y={y + 28} bold size={12.5} fill={DT.ink}>
              {i + 1}. {s.name}
            </Txt>
            <Txt x={x + w / 2} y={y + 50} size={10} fill={DT.ink3}>
              {s.tech}
            </Txt>
            {/* 收益标签 */}
            <RNode x={x - 4} y={y - 34} w={w + 8} h={26} fill={DT.surface} stroke={hue}>
              <Txt x={x + w / 2} y={y - 16} mono size={10.5} fill={hue}>
                {s.gain}
              </Txt>
            </RNode>
          </g>
        );
      })}

      {/* 地面与顺序箭头 */}
      <line x1={x0 - 8} y1={baseY} x2={x0 + 5 * (w + gap)} y2={baseY} stroke={DT.lineStrong} strokeWidth={DT.strokeWidth} />
      <line x1={x0} y1={baseY + 22} x2={x0 + 5 * (w + gap) - 30} y2={baseY + 22} stroke={DT.ink3} strokeWidth={DT.strokeWidth} />
      <path d={`M${x0 + 5 * (w + gap) - 36} ${baseY + 18} L${x0 + 5 * (w + gap) - 26} ${baseY + 22} L${x0 + 5 * (w + gap) - 36} ${baseY + 26} Z`} fill={DT.ink3} />
      <Txt x={x0 + 380} y={baseY + 44} size={11.5} fill={DT.ink3}>
        落地顺序：工程门槛与组织成本递增 →
      </Txt>

      <rect x={170} y={baseY + 58} width={540} height={40} rx={DT.nodeRadius} fill={DT.surface} stroke={hue} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
      <Txt x={440} y={baseY + 83} bold fill={hue}>
        成本账本已翻转：优化到位后，端到端大模型可以比级联系统更便宜
      </Txt>
    </svg>
  );
}
