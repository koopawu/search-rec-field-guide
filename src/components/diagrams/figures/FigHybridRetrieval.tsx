// fig-hybrid-retrieval：混合检索三级漏斗
// site_ia.md §4.5：双路并行召回（BM25 倒排路 + 向量 ANN 路，各取 50-100）→ RRF 融合（Top-20）
// → Cross-encoder 精排（Top-5~8）→ 输出给 LLM；标注各路治什么 badcase 与延迟预算

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowDown } from './helpers';

export default function FigHybridRetrieval({ hue = '#4E7A72', tint = '#E2EDEA' }: DiagramProps) {
  return (
    <svg viewBox="0 0 880 520" width="100%" role="img" aria-label="混合检索三级漏斗">
      {/* Query */}
      <RNode x={330} y={20} w={220} h={42} fill={DT.surface2}>
        <Txt x={440} y={47} bold fill={DT.ink}>
          Query / 用户问题
        </Txt>
      </RNode>
      {/* 分叉到两路 */}
      <path d="M390 62 L390 84 L210 84 L210 106" fill="none" stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <path d="M490 62 L490 84 L670 84 L670 106" fill="none" stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <path d="M206 100 L210 108 L214 100 Z" fill={DT.ink2} />
      <path d="M666 100 L670 108 L674 100 Z" fill={DT.ink2} />

      {/* 左：BM25 倒排路 */}
      <RNode x={90} y={108} w={240} h={96} fill={DT.surface}>
        <Txt x={210} y={136} bold fill={DT.ink}>
          BM25 倒排路
        </Txt>
        <Txt x={210} y={158} size={12} fill={DT.ink3}>
          关键词精确匹配
        </Txt>
        <Txt x={210} y={178} mono size={11.5} fill={hue}>
          取 Top 50-100 · ~5ms
        </Txt>
      </RNode>
      <RNode x={90} y={220} w={240} h={44} fill={DT.surface} dashed stroke={DT.success}>
        <Txt x={210} y={247} size={11.5} fill={DT.success}>
          治：向量路的「精确匹配失败」
        </Txt>
      </RNode>

      {/* 右：向量 ANN 路 */}
      <RNode x={550} y={108} w={240} h={96} fill={DT.surface}>
        <Txt x={670} y={136} bold fill={DT.ink}>
          向量 ANN 路
        </Txt>
        <Txt x={670} y={158} size={12} fill={DT.ink3}>
          语义相似度检索
        </Txt>
        <Txt x={670} y={178} mono size={11.5} fill={hue}>
          取 Top 50-100 · ~10ms
        </Txt>
      </RNode>
      <RNode x={550} y={220} w={240} h={44} fill={DT.surface} dashed stroke={DT.success}>
        <Txt x={670} y={247} size={11.5} fill={DT.success}>
          治：关键词路的「语义漂移」
        </Txt>
      </RNode>

      {/* 汇入 RRF */}
      <path d="M210 264 L210 290 L440 290 L440 312" fill="none" stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <path d="M670 264 L670 290 L440 290 L440 312" fill="none" stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <path d="M436 306 L440 314 L444 306 Z" fill={DT.ink2} />
      <RNode x={290} y={314} w={300} h={62} fill={tint} stroke={hue}>
        <Txt x={440} y={342} bold fill={DT.ink}>
          RRF 融合（倒数排名融合）
        </Txt>
        <Txt x={440} y={364} mono size={12} fill={DT.ink2}>
          score = Σ 1/(rank + k)　→　Top-20
        </Txt>
      </RNode>
      <ArrowDown x={440} y1={376} y2={400} />

      {/* Cross-encoder 精排 */}
      <RNode x={290} y={400} w={300} h={56} fill={DT.surface2}>
        <Txt x={440} y={424} bold fill={DT.ink}>
          Cross-encoder 精排
        </Txt>
        <Txt x={440} y={444} mono size={11.5} fill={hue}>
          Top-20 → Top 5~8 · 慢但准
        </Txt>
      </RNode>
      <ArrowDown x={440} y1={456} y2={478} />
      <Txt x={440} y={500} bold fill={hue}>
        作为上下文交给 LLM 生成答案
      </Txt>

      {/* 侧边延迟预算 */}
      <RNode x={40} y={330} w={180} h={110} fill={DT.surface} dashed>
        <Txt x={130} y={354} size={12} bold fill={DT.ink}>
          延迟预算
        </Txt>
        <Txt x={130} y={376} mono size={11.5} fill={DT.ink2}>
          双路并行 ~10ms
        </Txt>
        <Txt x={130} y={396} mono size={11.5} fill={DT.ink2}>
          RRF &lt;1ms
        </Txt>
        <Txt x={130} y={416} mono size={11.5} fill={DT.ink2}>
          精排 20-50ms
        </Txt>
      </RNode>
    </svg>
  );
}
