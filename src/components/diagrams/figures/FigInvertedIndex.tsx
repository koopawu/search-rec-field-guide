// fig-inverted-index：倒排索引结构示意
// site_ia.md §4.5：左文档集（Doc1/2/3 文本片段）→ 中间分词处理 → 右词典+倒排列表
// （term → [docId:pos]）；查询路径：Query 分词 → 查词典 → AND/OR 拉链求交 → BM25 打分

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowRight, ArrowDown } from './helpers';

const DOCS = [
  { id: 'Doc1', text: '苹果 发布 新 手机' },
  { id: 'Doc2', text: '苹果 股价 上涨' },
  { id: 'Doc3', text: '香蕉 苹果 奶昔' },
];
const INDEX = [
  { term: '苹果', postings: '1:0 → 2:0 → 3:1' },
  { term: '发布', postings: '1:1' },
  { term: '手机', postings: '1:3' },
  { term: '香蕉', postings: '3:0' },
];

export default function FigInvertedIndex({ hue = '#A9713A', tint = '#F5EBDD' }: DiagramProps) {
  return (
    <svg viewBox="0 0 880 540" width="100%" role="img" aria-label="倒排索引结构示意">
      {/* 左：文档集 */}
      <Txt x={130} y={40} bold fill={DT.ink}>
        文档集
      </Txt>
      {DOCS.map((d, i) => {
        const y = 60 + i * 64;
        return (
          <RNode key={d.id} x={40} y={y} w={200} h={52} fill={DT.surface2}>
            <Txt x={78} y={y + 24} mono size={11.5} fill={hue} bold>
              {d.id}
            </Txt>
            <Txt x={140} y={y + 38} size={11} fill={DT.ink2}>
              {d.text}
            </Txt>
          </RNode>
        );
      })}
      <ArrowRight x1={240} x2={296} y={124} />

      {/* 中：分词 */}
      <RNode x={296} y={92} w={120} h={64} fill={DT.surface}>
        <Txt x={356} y={118} bold size={12} fill={DT.ink}>
          分词处理
        </Txt>
        <Txt x={356} y={140} size={10} fill={DT.ink3}>
          去停用词 / 归一
        </Txt>
      </RNode>
      <ArrowRight x1={416} x2={470} y={124} />

      {/* 右：词典 + 倒排列表 */}
      <Txt x={640} y={40} bold fill={DT.ink}>
        词典 → 倒排列表（docId:pos）
      </Txt>
      {INDEX.map((r, i) => {
        const y = 60 + i * 64;
        return (
          <g key={r.term}>
            <RNode x={470} y={y} w={110} h={48} fill={tint} stroke={hue}>
              <Txt x={525} y={y + 30} bold size={12.5}>
                {r.term}
              </Txt>
            </RNode>
            <ArrowRight x1={580} x2={610} y={y + 24} color={DT.ink3} />
            <RNode x={610} y={y} w={220} h={48} fill={DT.surface}>
              <Txt x={720} y={y + 29} mono size={11} fill={DT.ink2}>
                [{r.postings}]
              </Txt>
            </RNode>
          </g>
        );
      })}

      {/* 下：查询路径 */}
      <line x1={40} y1={330} x2={840} y2={330} stroke={DT.lineStrong} strokeWidth={1} strokeDasharray={DT.dash} />
      <Txt x={40} y={360} anchor="start" bold fill={DT.ink}>
        查询路径
      </Txt>
      {[
        { name: 'Query 分词', sub: '"苹果手机" → 苹果/手机' },
        { name: '查词典', sub: '定位两个 term' },
        { name: '拉链求交', sub: 'AND：Doc1；OR：Doc1/2/3' },
        { name: 'BM25 打分', sub: 'TF × IDF × 长度归一' },
      ].map((s, i) => {
        const x = 40 + i * 205;
        return (
          <g key={s.name}>
            <RNode x={x} y={380} w={180} h={66} fill={i === 3 ? tint : DT.surface} stroke={i === 3 ? hue : DT.ink2}>
              <Txt x={x + 90} y={404} bold size={12} fill={DT.ink}>
                {s.name}
              </Txt>
              <Txt x={x + 90} y={426} size={9.5} fill={DT.ink3}>
                {s.sub}
              </Txt>
            </RNode>
            {i < 3 && <ArrowRight x1={x + 180} x2={x + 205} y={413} color={DT.ink3} />}
          </g>
        );
      })}
      <ArrowDown x={525} y1={332} y2={356} dashed color={DT.ink3} />
      <Txt x={440} y={492} size={11.5} fill={DT.ink3}>
        查询 = 查表 + 拉链求交：这就是搜索引擎毫秒级响应亿级文档的结构基础
      </Txt>
    </svg>
  );
}
