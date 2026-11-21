// fig-offline-online-gap：离线-在线鸿沟原因链
// site_ia.md §4.4：左「离线评估涨」气泡 → 右「线上指标不动/下跌」气泡，
// 中间五个断桥障碍：冰山效应、特征穿越、样本构造偏差、链路吞噬、目标错位；
// 每个障碍下挂修正路径小字

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowRight } from './helpers';

const GAPS = [
  { name: '冰山效应', fix: '评估集只覆盖已曝光' },
  { name: '特征穿越', fix: '时间切分取数' },
  { name: '样本构造偏差', fix: 'shadow scoring' },
  { name: '链路吞噬', fix: '分层归因 / IPS' },
  { name: '目标错位', fix: '小流量 AB 终验' },
];

export default function FigOfflineOnlineGap({ hue = '#71803F', tint = '#ECEFE0' }: DiagramProps) {
  const y = 150;
  return (
    <svg viewBox="0 0 880 420" width="100%" role="img" aria-label="离线-在线鸿沟原因链">
      {/* 左气泡 */}
      <RNode x={40} y={y} w={180} h={90} fill={tint} stroke={hue}>
        <Txt x={130} y={y + 34} bold fill={DT.ink}>
          离线评估
        </Txt>
        <Txt x={130} y={y + 60} bold fill={DT.success}>
          AUC +0.01 ↑
        </Txt>
      </RNode>

      {/* 右气泡 */}
      <RNode x={660} y={y} w={180} h={90} fill={DT.surface} stroke={DT.danger}>
        <Txt x={750} y={y + 34} bold fill={DT.ink}>
          线上指标
        </Txt>
        <Txt x={750} y={y + 60} bold fill={DT.danger}>
          不动 / 下跌 ↓
        </Txt>
      </RNode>

      {/* 断桥：五个障碍 */}
      <line x1={220} y1={y + 45} x2={330} y2={y + 45} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <line x1={550} y1={y + 45} x2={660} y2={y + 45} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      {/* 断裂口 */}
      <path d="M330 30 L336 60 L326 90 L336 120 L330 150 L336 180 L330 210 L336 240 L330 260" fill="none" stroke={DT.danger} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} transform={`translate(0 ${y - 75})`} />
      <path d="M550 30 L556 60 L546 90 L556 120 L550 150 L556 180 L550 210 L556 240 L550 260" fill="none" stroke={DT.danger} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} transform={`translate(0 ${y - 75})`} />

      {GAPS.map((g, i) => {
        const gx = 350 + (i % 3) * 100;
        const gy = i < 3 ? y - 10 : y + 120;
        return (
          <g key={g.name}>
            <RNode x={gx - 46} y={gy - 22} w={92} h={44} fill={DT.surface2} stroke={DT.danger}>
              <Txt x={gx} y={gy - 2} size={10.5} bold fill={DT.danger}>
                {g.name}
              </Txt>
              <Txt x={gx} y={gy + 14} size={8.5} fill={DT.ink3}>
                {g.fix}
              </Txt>
            </RNode>
          </g>
        );
      })}
      <Txt x={440} y={y - 52} size={11.5} fill={DT.danger}>
        鸿沟中的五座断桥
      </Txt>

      {/* 修正路径 */}
      <RNode x={90} y={y + 190} w={700} h={96} fill={DT.surface} dashed>
        <Txt x={440} y={y + 216} bold size={12.5} fill={DT.ink}>
          修正路径（逐一对症）
        </Txt>
        <Txt x={440} y={y + 242} size={11.5} fill={DT.ink2}>
          时间切分防穿越 · shadow scoring 对齐样本 · IPS 纠偏曝光分布 · 链路分层归因 · 一切以小流量 AB 为终验
        </Txt>
        <Txt x={440} y={y + 266} size={11} fill={DT.ink3}>
          离线指标只做「方向筛选」，不做「效果承诺」
        </Txt>
      </RNode>

      <ArrowRight x1={130} x2={130} y={y + 90} color={DT.ink3} dashed />
      <Txt x={440} y={y + 140} size={11.5} fill={DT.ink3}>
        离线涨 ≠ 线上涨：中间隔着评估口径、数据分布与系统链路的系统性差异
      </Txt>
    </svg>
  );
}
