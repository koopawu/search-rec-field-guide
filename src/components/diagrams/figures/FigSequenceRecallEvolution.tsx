// fig-sequence-recall-evolution：序列召回演进图
// site_ia.md §4.5：YouTube DNN(2016, average pooling) → GRU4Rec → SASRec（单向注意力）
// → BERT4Rec（双向）→ MIND/ComiRec（多兴趣）→ SIM（万级长序列检索）；每节点一句关键创新

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowRight } from './helpers';

const NODES = [
  { year: '2016', name: 'YouTube DNN', note: 'average pooling 汇总历史' },
  { year: '2017', name: 'GRU4Rec', note: 'RNN 建模会话序列' },
  { year: '2018', name: 'SASRec', note: '单向自注意力' },
  { year: '2019', name: 'BERT4Rec', note: '双向注意力 + 掩码' },
  { year: '2020', name: 'MIND/ComiRec', note: '多兴趣向量' },
  { year: '2020+', name: 'SIM', note: '万级长序列两阶段检索' },
];

export default function FigSequenceRecallEvolution({
  hue = '#B0503C',
  tint = '#F6E4E0',
}: DiagramProps) {
  const w = 124;
  const gap = 18;
  const x0 = 36;
  const y = 130;

  return (
    <svg viewBox="0 0 880 340" width="100%" role="img" aria-label="序列召回演进图">
      {/* 主轴 */}
      <line x1={x0 - 6} y1={y + 96} x2={x0 + NODES.length * (w + gap)} y2={y + 96} stroke={DT.lineStrong} strokeWidth={DT.strokeWidth} />
      <path
        d={`M${x0 + NODES.length * (w + gap) - 2} ${y + 92} L${x0 + NODES.length * (w + gap) + 8} ${y + 96} L${x0 + NODES.length * (w + gap) - 2} ${y + 100} Z`}
        fill={DT.lineStrong}
      />

      {NODES.map((n, i) => {
        const x = x0 + i * (w + gap);
        const up = i % 2 === 0; // 交错上下
        const cy = up ? y : y + 140;
        return (
          <g key={n.name}>
            {/* 时间节点 */}
            <circle cx={x + w / 2} cy={y + 96} r={5} fill={hue} />
            <Txt x={x + w / 2} y={y + 118} mono size={11} fill={DT.ink3}>
              {n.year}
            </Txt>
            {/* 竖连接 */}
            <line
              x1={x + w / 2}
              y1={up ? cy + 88 : y + 101}
              x2={x + w / 2}
              y2={up ? y + 91 : cy}
              stroke={DT.ink2}
              strokeWidth={DT.strokeWidth}
            />
            <RNode x={x} y={cy} w={w} h={88} fill={up ? tint : DT.surface} stroke={up ? hue : DT.ink2}>
              <Txt x={x + w / 2} y={cy + 24} bold size={11.5} fill={DT.ink}>
                {n.name}
              </Txt>
              {n.note.length > 9 ? (
                <>
                  <Txt x={x + w / 2} y={cy + 48} size={10.5} fill={DT.ink3}>
                    {n.note.slice(0, 9)}
                  </Txt>
                  <Txt x={x + w / 2} y={cy + 66} size={10.5} fill={DT.ink3}>
                    {n.note.slice(9)}
                  </Txt>
                </>
              ) : (
                <Txt x={x + w / 2} y={cy + 52} size={10.5} fill={DT.ink3}>
                  {n.note}
                </Txt>
              )}
            </RNode>
          </g>
        );
      })}

      <Txt x={x0} y={56} anchor="start" bold fill={DT.ink}>
        关键命题：如何从「更长的行为序列」中提取「更准的兴趣」
      </Txt>
      <ArrowRight x1={x0 + 560} x2={x0 + 640} y={50} color={hue} dashed />
      <Txt x={x0 + 648} y={54} anchor="start" size={11.5} fill={hue}>
        序列长度 ↑
      </Txt>
    </svg>
  );
}
