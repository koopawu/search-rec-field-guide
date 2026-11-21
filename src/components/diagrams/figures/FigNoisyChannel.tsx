// fig-noisy-channel：纠错噪声信道模型
// site_ia.md §4.5：用户想输入 w → 噪声信道（键盘/拼音/形近字噪声云）→ 实际输入 e；
// 解码器反向求 ŵ = argmax P(e|w)P(w)；下挂 P(e|w) 三个数据源（编辑距离/拼音字典/Session 换词日志）

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowRight } from './helpers';

export default function FigNoisyChannel({ hue = '#A9713A', tint = '#F5EBDD' }: DiagramProps) {
  return (
    <svg viewBox="0 0 880 460" width="100%" role="img" aria-label="纠错噪声信道模型">
      {/* 想输入 w */}
      <RNode x={30} y={70} w={170} h={64} fill={DT.surface2}>
        <Txt x={115} y={96} bold fill={DT.ink} size={12.5}>
          用户想输入 w
        </Txt>
        <Txt x={115} y={118} mono size={12.5} fill={DT.ink2}>
          "iphone 15"
        </Txt>
      </RNode>
      <ArrowRight x1={200} x2={250} y={102} />

      {/* 噪声信道 */}
      <RNode x={250} y={50} w={220} h={104} fill={DT.surface} stroke={DT.warning}>
        <Txt x={360} y={76} bold size={12.5} fill={DT.warning}>
          噪声信道
        </Txt>
        {/* 噪声云 */}
        {['键盘误触', '拼音同音', '形近字'].map((n, i) => (
          <g key={n}>
            <ellipse cx={300 + i * 62} cy={106} rx={32} ry={16} fill={DT.surface2} stroke={DT.ink3} strokeWidth={1} strokeDasharray="3 3" />
            <Txt x={300 + i * 62} y={110} size={9.5} fill={DT.ink3}>
              {n}
            </Txt>
          </g>
        ))}
        <Txt x={360} y={142} size={10.5} fill={DT.ink3}>
          输入过程被各种噪声干扰
        </Txt>
      </RNode>
      <ArrowRight x1={470} x2={520} y={102} />

      {/* 实际输入 e */}
      <RNode x={520} y={70} w={170} h={64} fill={DT.surface2}>
        <Txt x={605} y={96} bold fill={DT.ink} size={12.5}>
          实际输入 e
        </Txt>
        <Txt x={605} y={118} mono size={12.5} fill={DT.danger}>
          "iphne 15"
        </Txt>
      </RNode>

      {/* 解码器（反向） */}
      <ArrowRight x1={520} x2={250} y={220} color={hue} dashed />
      <RNode x={300} y={188} w={280} h={64} fill={tint} stroke={hue}>
        <Txt x={440} y={214} bold fill={DT.ink} size={12.5}>
          纠错解码器（反向推断）
        </Txt>
        <Txt x={440} y={238} mono size={12.5} fill={hue}>
          ŵ = argmax_w P(e|w) · P(w)
        </Txt>
      </RNode>
      <Txt x={200} y={210} size={11} fill={DT.ink3}>
        看到 e，反推最可能的 w
      </Txt>

      {/* 输出 */}
      <path d="M440 252 L440 282" stroke={hue} strokeWidth={DT.strokeWidth} />
      <path d="M436 276 L440 284 L444 276 Z" fill={hue} />
      <RNode x={350} y={284} w={180} h={44} fill={tint} stroke={hue}>
        <Txt x={440} y={311} mono bold size={12.5} fill={DT.ink}>
          ŵ = "iphone 15"
        </Txt>
      </RNode>

      {/* P(e|w) 三个数据源 */}
      <Txt x={120} y={368} anchor="start" bold size={12.5} fill={DT.ink}>
        P(e|w) 噪声模型从哪里学：
      </Txt>
      {[
        { name: '编辑距离', note: '键盘相邻键误触概率' },
        { name: '拼音字典', note: '同音/近音字混淆对' },
        { name: 'Session 换词日志', note: '用户改了又搜的行为' },
      ].map((s, i) => {
        const x = 120 + i * 250;
        return (
          <RNode key={s.name} x={x} y={384} w={230} h={56} fill={DT.surface}>
            <Txt x={x + 115} y={408} bold size={12} fill={DT.ink2}>
              {s.name}
            </Txt>
            <Txt x={x + 115} y={428} size={10.5} fill={DT.ink3}>
              {s.note}
            </Txt>
          </RNode>
        );
      })}
      <Txt x={120} y={348} anchor="start" size={11} fill={DT.ink3}>
        P(w) 语言模型：候选词本身的先验流行度（词频 / 搜索量）
      </Txt>
    </svg>
  );
}
