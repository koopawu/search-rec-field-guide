// fig-rag-architecture：RAG 标准架构图（全站核心图）
// site_ia.md §4.5：离线侧（文档→分块→Embedding→向量库）+ 在线侧
// （Query→改写→混合检索→Cross-encoder 重排→LLM 生成），右上 badcase 归因比例

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowRight, ArrowDown } from './helpers';

export default function FigRagArchitecture({ hue = DT.accent, tint = '#F6E7DC' }: DiagramProps) {
  const lane = (y: number, label: string) => (
    <g>
      <rect x={20} y={y} width={620} height={150} rx={12} fill={DT.surface2} opacity={0.55} />
      <Txt x={36} y={y + 26} anchor="start" bold fill={hue} size={13}>
        {label}
      </Txt>
    </g>
  );

  return (
    <svg viewBox="0 0 880 440" width="100%" role="img" aria-label="RAG 标准架构图">
      {/* 离线侧 */}
      {lane(24, '离线侧（文档处理）')}
      {['文档', '分块 Chunk', 'Embedding', '向量库'].map((label, i) => {
        const bx = 48 + i * 148;
        return (
          <g key={label}>
            <RNode x={bx} y={62} w={118} h={44} fill={DT.surface} stroke={i === 3 ? hue : DT.ink2}>
              <Txt x={bx + 59} y={89} size={12.5} bold={i === 3}>
                {label}
              </Txt>
            </RNode>
            {i < 3 && <ArrowRight x1={bx + 118} x2={bx + 148} y={84} />}
          </g>
        );
      })}
      {/* BM25 倒排索引（离线侧补充） */}
      <RNode x={490} y={118} w={118} h={36} fill={DT.surface} stroke={DT.ink3} dashed>
        <Txt x={549} y={141} size={12}>
          BM25 倒排索引
        </Txt>
      </RNode>

      {/* 在线侧 */}
      {lane(230, '在线侧（问答链路）')}
      {[
        { label: 'Query', w: 84 },
        { label: '改写 HyDE / Multi-Query', w: 150 },
        { label: '混合检索 BM25+向量', w: 150 },
        { label: 'RRF 融合 Top-20', w: 128 },
      ].map((n, i, arr) => {
        const bx = 48 + arr.slice(0, i).reduce((s, p) => s + p.w + 22, 0);
        return (
          <g key={n.label}>
            <RNode x={bx} y={270} w={n.w} h={44} fill={DT.surface} stroke={DT.ink2}>
              <Txt x={bx + n.w / 2} y={297} size={12}>
                {n.label}
              </Txt>
            </RNode>
            {i < arr.length - 1 && <ArrowRight x1={bx + n.w} x2={bx + n.w + 22} y={292} />}
          </g>
        );
      })}
      {/* 重排 → LLM */}
      <RNode x={48} y={346} w={180} h={44} fill={tint} stroke={hue}>
        <Txt x={138} y={373} size={12.5} bold>
          Cross-encoder 重排 Top-5~8
        </Txt>
      </RNode>
      <ArrowRight x1={228} x2={258} y={368} />
      <RNode x={258} y={346} w={180} h={44} fill={tint} stroke={hue}>
        <Txt x={348} y={373} size={12.5} bold>
          LLM 生成（带引用）
        </Txt>
      </RNode>
      {/* 向量库 → 混合检索连接 */}
      <path
        d="M549 106 L549 210 L398 210 L398 270"
        fill="none"
        stroke={DT.ink2}
        strokeWidth={DT.strokeWidth}
      />
      <path d="M394 264 L398 272 L402 264 Z" fill={DT.ink2} />
      {/* 混合检索 → 重排 */}
      <ArrowDown x={138} y1={314} y2={346} color={DT.ink3} dashed />
      <line x1={398} y1={314} x2={138} y2={340} stroke={DT.ink3} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />

      {/* 右上：badcase 归因比例 */}
      <g>
        <RNode x={664} y={24} w={196} h={180} fill={DT.surface} dashed>
          <Txt x={762} y={50} bold size={12.5} fill={DT.ink}>
            检索 badcase 归因
          </Txt>
          {[
            ['精确匹配失败', '30-40%'],
            ['语义漂移', '20-30%'],
            ['分块不当', '20-30%'],
            ['语料质量', '10-20%'],
          ].map(([k, v], i) => (
            <g key={k}>
              <Txt x={680} y={80 + i * 24} anchor="start" size={12} fill={DT.ink2}>
                {k}
              </Txt>
              <Txt x={844} y={80 + i * 24} anchor="end" mono size={12} fill={hue}>
                {v}
              </Txt>
            </g>
          ))}
        </RNode>
        <Txt x={762} y={226} size={11} fill={DT.ink3}>
          先归因，再决定补哪一路
        </Txt>
      </g>

      <Txt x={330} y={424} size={12} fill={DT.ink3}>
        标准配方：双路召回 50-100 篇 → RRF Top-20 → Cross-encoder 精排 Top-5~8 给 LLM
      </Txt>
    </svg>
  );
}
