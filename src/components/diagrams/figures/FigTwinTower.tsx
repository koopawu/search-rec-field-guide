// fig-twin-tower：双塔模型结构图（全站核心图）
// site_ia.md §4.2：用户塔 / 物品塔独立编码 + 顶部内积；物品塔「离线预计算→向量库→ANN」、
// 用户塔「线上实时计算」；侧边对比交互式 BERT

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowDown } from './helpers';

function Tower({
  cx,
  title,
  hue,
  tint,
  footnote,
}: {
  cx: number;
  title: string;
  hue: string;
  tint: string;
  footnote: string[];
}) {
  return (
    <g>
      <RNode x={cx - 110} y={70} w={220} h={40} fill={tint} stroke={hue}>
        <Txt x={cx} y={96} bold fill={DT.ink}>
          {title}特征
        </Txt>
      </RNode>
      <ArrowDown x={cx} y1={110} y2={134} />
      <RNode x={cx - 110} y={134} w={220} h={40}>
        <Txt x={cx} y={160}>Embedding 层</Txt>
      </RNode>
      <ArrowDown x={cx} y1={174} y2={198} />
      <RNode x={cx - 110} y={198} w={220} h={40}>
        <Txt x={cx} y={224}>MLP 编码</Txt>
      </RNode>
      <ArrowDown x={cx} y1={238} y2={262} />
      <RNode x={cx - 80} y={262} w={160} h={40} fill={tint} stroke={hue}>
        <Txt x={cx} y={288} bold fill={hue}>
          {title}向量
        </Txt>
      </RNode>
      {footnote.map((line, i) => (
        <Txt key={i} x={cx} y={330 + i * 20} size={12} fill={DT.ink3}>
          {line}
        </Txt>
      ))}
    </g>
  );
}

export default function FigTwinTower({ hue = DT.accent, tint = '#F6E7DC' }: DiagramProps) {
  return (
    <svg viewBox="0 0 880 480" width="100%" role="img" aria-label="双塔模型结构图">
      {/* 顶部汇合：内积 */}
      <circle cx={380} cy={30} r={22} fill={DT.surface} stroke={hue} strokeWidth={DT.strokeWidth} />
      <Txt x={380} y={35} size={12} bold fill={hue}>
        内积
      </Txt>
      <line x1={270} y1={262} x2={364} y2={48} stroke={hue} strokeWidth={DT.strokeWidth} />
      <line x1={490} y1={262} x2={396} y2={48} stroke={hue} strokeWidth={DT.strokeWidth} />
      <Txt x={380} y={76} size={12} fill={DT.ink3}>
        相似分（一次计算）
      </Txt>

      <Tower cx={270} title="用户" hue={hue} tint={tint} footnote={['线上实时计算', '兴趣动态变化']} />
      <Tower cx={490} title="物品" hue={hue} tint={tint} footnote={['离线预计算 → 向量库', 'ANN 索引 TopK']} />

      {/* 塔间不相交标注 */}
      <line x1={380} y1={120} x2={380} y2={230} stroke={DT.lineStrong} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
      <Txt x={380} y={252} size={11.5} fill={DT.ink3}>
        两塔不相交（后期融合）
      </Txt>

      {/* 侧边对比：交互式 BERT */}
      <g>
        <RNode x={660} y={150} w={190} h={150} dashed stroke={DT.ink3} fill={DT.surface2}>
          <Txt x={755} y={176} bold fill={DT.ink2}>
            对比：交互式 BERT
          </Txt>
        </RNode>
        <RNode x={676} y={192} w={158} h={32} fill={DT.surface}>
          <Txt x={755} y={213} size={12}>Query + Doc 拼接</Txt>
        </RNode>
        <ArrowDown x={755} y1={224} y2={246} color={DT.ink3} />
        <RNode x={676} y={246} w={158} h={32} fill={DT.surface}>
          <Txt x={755} y={267} size={12}>单塔交互打分</Txt>
        </RNode>
        <Txt x={755} y={318} size={11.5} fill={DT.ink3}>
          准但慢 → 只能精排小候选
        </Txt>
      </g>

      <Txt x={440} y={420} size={12.5} fill={DT.ink3}>
        工程效率是大规模采用的根本原因：物品向量离线入向量库，线上只算用户向量 + ANN 检索
      </Txt>
    </svg>
  );
}
