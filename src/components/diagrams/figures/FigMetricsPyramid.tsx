// fig-metrics-pyramid：北极星 + 护栏指标金字塔
// site_ia.md §4.4：五层金字塔：北极星（1 个，如人均时长）→ 用户体验层（CTR/CVR/完播/留存）
// → 生态层（多样性/覆盖率/基尼）→ 商业层（GMV/eCPM/LTV）→ 塔基护栏横条（流失率/负反馈/延迟）；
// 每层右侧挂实例标签

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt } from './helpers';

const LAYERS = [
  { name: '北极星指标', sub: '1 个，如人均时长 / 留存', ex: '全公司唯一灯塔', w: 150 },
  { name: '用户体验层', sub: 'CTR / CVR / 完播 / 留存', ex: '小红书：笔记 CTR + 收藏率', w: 250 },
  { name: '生态层', sub: '多样性 / 覆盖率 / 基尼系数', ex: '创作者生态健康度', w: 350 },
  { name: '商业层', sub: 'GMV / eCPM / LTV', ex: '电商：GMV 与广告收入', w: 450 },
];

export default function FigMetricsPyramid({ tint = '#ECEFE0' }: DiagramProps) {
  const cx = 320;
  const y0 = 40;
  const h = 76;
  return (
    <svg viewBox="0 0 880 480" width="100%" role="img" aria-label="北极星与护栏指标金字塔">
      {LAYERS.map((l, i) => {
        const y = y0 + i * h;
        const wTop = i === 0 ? 16 : LAYERS[i - 1].w;
        const wBot = l.w;
        return (
          <g key={l.name}>
            <path
              d={`M${cx - wTop / 2} ${y} L${cx + wTop / 2} ${y} L${cx + wBot / 2} ${y + h - 4} L${cx - wBot / 2} ${y + h - 4} Z`}
              fill={i % 2 === 0 ? tint : DT.surface2}
              stroke={DT.ink2}
              strokeWidth={DT.strokeWidth}
            />
            <Txt x={cx} y={y + 32} bold size={12.5} fill={DT.ink}>
              {l.name}
            </Txt>
            <Txt x={cx} y={y + 54} size={11} fill={DT.ink3}>
              {l.sub}
            </Txt>
            {/* 右侧实例标签 */}
            <line x1={cx + wBot / 2 + 8} y1={y + h / 2} x2={cx + 250} y2={y + h / 2} stroke={DT.lineStrong} strokeWidth={1} strokeDasharray={DT.dash} />
            <Txt x={cx + 258} y={y + h / 2 + 4} anchor="start" size={11} fill={DT.ink3}>
              {l.ex}
            </Txt>
          </g>
        );
      })}

      {/* 塔基护栏横条 */}
      <RNode x={cx - 260} y={y0 + 4 * h + 8} w={520} h={52} fill={DT.surface} stroke={DT.danger}>
        <Txt x={cx} y={y0 + 4 * h + 30} bold size={12.5} fill={DT.danger}>
          护栏指标（塔基）：流失率 / 负反馈率 / 延迟
        </Txt>
        <Txt x={cx} y={y0 + 4 * h + 50} size={10.5} fill={DT.ink3}>
          护栏被击穿 → 实验一票否决，不管北极星涨多少
        </Txt>
      </RNode>

      {/* 左侧注解 */}
      <line x1={56} y1={y0 + 20} x2={56} y2={y0 + 4 * h - 10} stroke={DT.lineStrong} strokeWidth={DT.strokeWidth} />
      <path d={`M52 ${y0 + 26} L56 ${y0 + 16} L60 ${y0 + 26} Z`} fill={DT.lineStrong} />
      <Txt x={42} y={y0 + 2 * h} size={11.5} fill={DT.ink3}>
        <tspan transform={`rotate(-90 42 ${y0 + 2 * h})`}>越往上越「指向长期价值」</tspan>
      </Txt>
    </svg>
  );
}
