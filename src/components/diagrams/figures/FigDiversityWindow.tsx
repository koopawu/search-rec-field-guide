// fig-diversity-window：窗口打散前后对比
// site_ia.md §4.3：上下两排各 10 个内容卡片：上排未打散（连续 4 个同类目标红）；
// 下排窗口打散后（同类目间隔 ≥k，颜色均匀）；标注三参数：最小间隔 k / 最多次数 m / 窗口大小 n

import { DT, type DiagramProps } from '../tokens';
import { Txt, RNode } from './helpers';

// 类目：A=数码 B=母婴 C=美食
const BEFORE = ['A', 'A', 'A', 'A', 'B', 'C', 'B', 'C', 'B', 'C'];
const AFTER = ['A', 'B', 'C', 'A', 'B', 'C', 'A', 'B', 'C', 'A'];
const CAT_COLOR: Record<string, string> = { A: '#B0503C', B: '#71803F', C: '#4E7A72' };
const CAT_NAME: Record<string, string> = { A: '数码', B: '母婴', C: '美食' };

export default function FigDiversityWindow({ hue = '#B08A2E', tint = '#F5EDDA' }: DiagramProps) {
  const cw = 62;
  const gap = 14;
  const x0 = 70;
  const renderRow = (arr: string[], y: number, highlightRun: boolean) => (
    <g>
      {arr.map((c, i) => {
        const x = x0 + i * (cw + gap);
        const inRun = highlightRun && i < 4;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={cw}
              height={64}
              rx={DT.nodeRadius}
              fill={DT.surface}
              stroke={inRun ? DT.danger : CAT_COLOR[c]}
              strokeWidth={inRun ? 2.5 : DT.strokeWidth}
            />
            <rect x={x + 8} y={y + 8} width={cw - 16} height={24} rx={4} fill={CAT_COLOR[c]} opacity={0.18} />
            <Txt x={x + cw / 2} y={y + 52} size={11} fill={DT.ink2}>
              {CAT_NAME[c]}
            </Txt>
            {inRun && (
              <Txt x={x + cw / 2} y={y - 8} mono size={10.5} fill={DT.danger}>
                ×
              </Txt>
            )}
          </g>
        );
      })}
    </g>
  );

  return (
    <svg viewBox="0 0 880 460" width="100%" role="img" aria-label="窗口打散前后对比">
      {/* 上排：未打散 */}
      <Txt x={x0 - 16} y={96} anchor="end" bold size={12.5} fill={DT.ink2}>
        打散前
      </Txt>
      {renderRow(BEFORE, 64, true)}
      <Txt x={x0 + 4 * (cw + gap) + 10} y={100} anchor="start" size={11.5} fill={DT.danger}>
        连续 4 条同类目 → 审美疲劳
      </Txt>

      {/* 下排：窗口打散后 */}
      <Txt x={x0 - 16} y={236} anchor="end" bold size={12.5} fill={DT.ink2}>
        打散后
      </Txt>
      {renderRow(AFTER, 204, false)}
      {/* 窗口示意 */}
      <rect x={x0 + 2 * (cw + gap) - 6} y={196} width={3 * cw + 2 * gap + 12} height={80} rx={DT.nodeRadius} fill="none" stroke={hue} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
      <Txt x={x0 + 2 * (cw + gap) + 3 * cw / 2} y={292} size={11} fill={hue}>
        滑动窗口 n=3：窗口内同类目 ≤m 次
      </Txt>

      {/* 参数说明 */}
      <RNode x={560} y={330} w={280} h={104} fill={tint} stroke={hue}>
        <Txt x={700} y={356} bold size={12.5} fill={DT.ink}>
          打散三参数
        </Txt>
        <Txt x={700} y={380} mono size={11.5} fill={DT.ink2}>
          k = 最小间隔（同类目隔 ≥k 位）
        </Txt>
        <Txt x={700} y={402} mono size={11.5} fill={DT.ink2}>
          m = 窗口内最多次数　n = 窗口大小
        </Txt>
      </RNode>
      <RNode x={70} y={330} w={420} h={104} fill={DT.surface} dashed>
        <Txt x={280} y={356} bold size={12.5} fill={DT.ink}>
          规则本质
        </Txt>
        <Txt x={280} y={380} size={11.5} fill={DT.ink2}>
          重排阶段对列表施加硬约束，牺牲少量点击率
        </Txt>
        <Txt x={280} y={402} size={11.5} fill={DT.ink2}>
          换取信息流多样性与长期留存
        </Txt>
      </RNode>
    </svg>
  );
}
