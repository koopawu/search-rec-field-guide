// fig-rerank-context：上下文感知重排（PRM）
// 依据 content caption：精排逐 item 独立打分；重排让 item 重打分时「看见彼此」，
// Transformer 编码整列表上下文 → 重新打分并重排序

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowRight } from './helpers';

const INPUT = [
  { name: '手机A', s: '0.81' },
  { name: '手机B', s: '0.79' },
  { name: '耳机C', s: '0.77' },
  { name: '手机D', s: '0.75' },
  { name: '平板E', s: '0.70' },
];
const OUTPUT = [
  { name: '手机A', s: '0.84' },
  { name: '耳机C', s: '0.82' },
  { name: '平板E', s: '0.78' },
  { name: '手机B', s: '0.66' },
  { name: '手机D', s: '0.61' },
];

export default function FigRerankContext({ hue = '#B0503C', tint = '#F6E4E0' }: DiagramProps) {
  const rowH = 46;
  const rowGap = 10;
  const y0 = 70;
  return (
    <svg viewBox="0 0 880 460" width="100%" role="img" aria-label="上下文感知重排（PRM）">
      {/* 左：精排输入列表 */}
      <Txt x={130} y={40} bold fill={DT.ink}>
        精排输出（独立打分）
      </Txt>
      {INPUT.map((it, i) => {
        const y = y0 + i * (rowH + rowGap);
        return (
          <RNode key={i} x={40} y={y} w={180} h={rowH} fill={DT.surface}>
            <Txt x={88} y={y + 29} size={12.5}>
              {it.name}
            </Txt>
            <Txt x={196} y={y + 29} anchor="end" mono size={12} fill={DT.ink3}>
              {it.s}
            </Txt>
          </RNode>
        );
      })}
      <Txt x={130} y={y0 + 5 * (rowH + rowGap) + 8} size={11} fill={DT.ink3}>
        每个 item 的分数互不知道对方存在
      </Txt>

      <ArrowRight x1={220} x2={280} y={y0 + 2 * (rowH + rowGap) + rowH / 2} color={hue} />

      {/* 中：PRM Transformer */}
      <RNode x={280} y={y0} w={300} h={5 * (rowH + rowGap) - rowGap} fill={tint} stroke={hue}>
        <Txt x={430} y={y0 + 30} bold fill={DT.ink}>
          PRM：Transformer 编码整列表
        </Txt>
        {/* item 互见连线 */}
        {INPUT.map((it, i) => {
          const y = y0 + 52 + i * 48;
          return (
            <g key={i}>
              <rect x={300} y={y} width={76} height={30} rx={6} fill={DT.surface} stroke={DT.ink3} strokeWidth={1} />
              <Txt x={338} y={y + 20} size={10.5}>
                {it.name}
              </Txt>
              {INPUT.slice(i + 1).map((_, j) => (
                <line
                  key={j}
                  x1={376}
                  y1={y + 15}
                  x2={470}
                  y2={y0 + 52 + (i + j + 1) * 48 + 15}
                  stroke={DT.lineStrong}
                  strokeWidth={1}
                />
              ))}
            </g>
          );
        })}
        {OUTPUT.map((it, i) => {
          const y = y0 + 52 + i * 48;
          return (
            <g key={i}>
              <rect x={470} y={y} width={100} height={30} rx={6} fill={DT.surface} stroke={hue} strokeWidth={1} />
              <Txt x={520} y={y + 20} size={10.5}>
                {it.name} {it.s}
              </Txt>
            </g>
          );
        })}
        <Txt x={430} y={y0 + 5 * (rowH + rowGap) - 16} size={11} fill={DT.ink3}>
          自注意力：item 重打分时「看见彼此」
        </Txt>
      </RNode>

      <ArrowRight x1={580} x2={640} y={y0 + 2 * (rowH + rowGap) + rowH / 2} color={hue} />

      {/* 右：重排后列表 */}
      <Txt x={750} y={40} bold fill={DT.ink}>
        重排输出（列表最优）
      </Txt>
      {OUTPUT.map((it, i) => {
        const y = y0 + i * (rowH + rowGap);
        const demoted = it.name === '手机B' || it.name === '手机D';
        return (
          <RNode key={i} x={660} y={y} w={180} h={rowH} fill={demoted ? DT.surface : tint} stroke={demoted ? DT.ink3 : hue}>
            <Txt x={718} y={y + 29} size={12.5}>
              {it.name}
            </Txt>
            <Txt x={816} y={y + 29} anchor="end" mono size={12} fill={demoted ? DT.danger : DT.success}>
              {it.s}
            </Txt>
          </RNode>
        );
      })}
      <Txt x={750} y={y0 + 5 * (rowH + rowGap) + 8} size={11} fill={DT.ink3}>
        同类目连排被降权，多样性/列表收益提升
      </Txt>
    </svg>
  );
}
