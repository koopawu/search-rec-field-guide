// fig-search-funnel：搜索引擎多阶段漏斗全景
// site_ia.md §4.1：Query → QP（分词/改写/意图/类目）→ 召回（万~十万级）→ 粗排（千级）
// → 精排（百级）→ 重排（几十条）→ 展示；右侧量级与延迟，左侧「算力↑精度↑」渐变箭头

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowDown } from './helpers';

const STAGES = [
  { name: '召回', sub: '倒排 + 向量 + 行为 多路', vol: '万~十万级', lat: '~10ms', w: 300 },
  { name: '粗排', sub: '轻量双塔', vol: '千级', lat: '~5ms', w: 236 },
  { name: '精排', sub: 'LTR / BERT 交互', vol: '百级', lat: '~10ms', w: 172 },
  { name: '重排', sub: '业务规则 · 多样性', vol: '几十条', lat: '~2ms', w: 116 },
];

export default function FigSearchFunnel({ hue = '#A9713A', tint = '#F5EBDD' }: DiagramProps) {
  const cx = 350;
  let y = 132;
  return (
    <svg viewBox="0 0 880 600" width="100%" role="img" aria-label="搜索引擎多阶段漏斗全景">
      {/* Query 输入 */}
      <RNode x={cx - 130} y={20} w={260} h={42} fill={DT.surface2}>
        <Txt x={cx} y={47} bold fill={DT.ink}>
          Query（用户查询词）
        </Txt>
      </RNode>
      <ArrowDown x={cx} y1={62} y2={84} />

      {/* QP 框 + 侧边信号清单 */}
      <RNode x={cx - 170} y={84} w={340} h={44} fill={tint} stroke={hue}>
        <Txt x={cx} y={111} bold fill={DT.ink}>
          Query 理解（QP）
        </Txt>
      </RNode>
      <RNode x={620} y={70} w={220} h={76} fill={DT.surface} dashed>
        <Txt x={730} y={94} size={12} bold fill={hue}>
          QP 输出信号
        </Txt>
        <Txt x={730} y={116} size={12} fill={DT.ink2}>
          分词 · 纠错改写
        </Txt>
        <Txt x={730} y={136} size={12} fill={DT.ink2}>
          意图识别 · 类目预测
        </Txt>
      </RNode>
      <line x1={cx + 170} y1={106} x2={620} y2={106} stroke={DT.lineStrong} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
      <ArrowDown x={cx} y1={128} y2={y} />

      {/* 四级漏斗 */}
      {STAGES.map((s, i) => {
        const nextW = STAGES[i + 1]?.w ?? 76;
        const top = y;
        const h = 92;
        y += h;
        return (
          <g key={s.name}>
            <path
              d={`M${cx - s.w} ${top} L${cx + s.w} ${top} L${cx + nextW} ${top + h} L${cx - nextW} ${top + h} Z`}
              fill={i % 2 === 0 ? tint : DT.surface2}
              stroke={DT.ink2}
              strokeWidth={DT.strokeWidth}
            />
            <Txt x={cx} y={top + 38} bold fill={DT.ink}>
              {s.name}
            </Txt>
            <Txt x={cx} y={top + 60} size={12} fill={DT.ink3}>
              {s.sub}
            </Txt>
            <Txt x={cx + s.w + 16} y={top + 42} anchor="start" mono fill={DT.ink3}>
              {s.vol}
            </Txt>
            <Txt x={cx + s.w + 16} y={top + 62} anchor="start" mono size={11.5} fill={hue}>
              {s.lat}
            </Txt>
          </g>
        );
      })}

      {/* 展示 */}
      <ArrowDown x={cx} y1={y} y2={y + 26} />
      <RNode x={cx - 90} y={y + 26} w={180} h={40} fill={DT.surface2}>
        <Txt x={cx} y={y + 51} bold fill={DT.ink}>
          结果展示
        </Txt>
      </RNode>

      {/* 左侧渐变箭头：算力↑精度↑ */}
      <line x1={44} y1={150} x2={44} y2={y - 10} stroke={DT.lineStrong} strokeWidth={DT.strokeWidth} />
      <path d={`M40 ${y - 16} L44 ${y - 6} L48 ${y - 16} Z`} fill={DT.lineStrong} />
      <Txt x={30} y={(150 + y) / 2} size={12} fill={DT.ink3}>
        <tspan transform={`rotate(-90 30 ${(150 + y) / 2})`}>候选量↓　算力 · 精度↑</tspan>
      </Txt>

      {/* 右侧延迟标注说明 */}
      <Txt x={cx + 316} y={150} anchor="start" size={11.5} fill={DT.ink3}>
        候选量级 / 延迟约束
      </Txt>

      {/* 底部注释 */}
      <rect x={cx - 250} y={y + 84} width={500} height={40} rx={DT.nodeRadius} fill={DT.surface} stroke={hue} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
      <Txt x={cx} y={y + 109} bold fill={hue}>
        有 Query 是搜索与推荐漏斗的最大差异：QP 决定召回方向
      </Txt>
    </svg>
  );
}
