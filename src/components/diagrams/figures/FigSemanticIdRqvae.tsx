// fig-semantic-id-rqvae：Semantic ID / RQ-VAE 编码结构
// site_ia.md §4.2：物品多模态内容（图/文）→ 语义 Embedding → RQ-VAE 三级残差量化
// （三层码本各输出一个 token）→ 层级语义 ID <a_3,b_7,c_2> → Transformer 生成下一个；
// 下方对比：随机哈希 ID（无意义）vs 语义 ID（可泛化）

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowRight, ArrowDown } from './helpers';

const CODEBOOKS = [
  { name: '码本 L1', token: 'a₃', note: '粗粒度类目' },
  { name: '码本 L2', token: 'b₇', note: '细分子类' },
  { name: '码本 L3', token: 'c₂', note: '残差细节' },
];

export default function FigSemanticIdRqvae({ hue = '#4E7A72', tint = '#E2EDEA' }: DiagramProps) {
  return (
    <svg viewBox="0 0 880 520" width="100%" role="img" aria-label="Semantic ID / RQ-VAE 编码结构">
      {/* 物品多模态内容 */}
      <RNode x={30} y={60} w={150} h={90} fill={DT.surface}>
        <Txt x={105} y={88} bold fill={DT.ink}>
          物品内容
        </Txt>
        <Txt x={105} y={110} size={11.5} fill={DT.ink3}>
          图片 / 标题 / 文本
        </Txt>
        <Txt x={105} y={130} size={11.5} fill={DT.ink3}>
          多模态信息
        </Txt>
      </RNode>
      <ArrowRight x1={180} x2={216} y={105} />

      {/* 语义 Embedding */}
      <RNode x={216} y={66} w={140} h={78} fill={DT.surface2}>
        <Txt x={286} y={96} bold fill={DT.ink}>
          语义 Embedding
        </Txt>
        <Txt x={286} y={118} size={11.5} fill={DT.ink3}>
          内容编码器
        </Txt>
      </RNode>
      <ArrowRight x1={356} x2={392} y={105} />

      {/* RQ-VAE 三级残差量化 */}
      <RNode x={392} y={36} w={300} h={150} fill={tint} stroke={hue}>
        <Txt x={542} y={60} bold fill={DT.ink}>
          RQ-VAE 三级残差量化
        </Txt>
        {CODEBOOKS.map((c, i) => {
          const x = 412 + i * 94;
          return (
            <g key={c.name}>
              <RNode x={x} y={76} w={80} h={64} fill={DT.surface}>
                <Txt x={x + 40} y={98} size={11.5} bold>
                  {c.name}
                </Txt>
                <Txt x={x + 40} y={116} mono size={12} fill={hue}>
                  {c.token}
                </Txt>
                <Txt x={x + 40} y={133} size={10} fill={DT.ink3}>
                  {c.note}
                </Txt>
              </RNode>
              {i < 2 && (
                <g>
                  <ArrowRight x1={x + 80} x2={x + 94} y={108} />
                  <Txt x={x + 87} y={96} size={9.5} fill={DT.ink3}>
                    残差
                  </Txt>
                </g>
              )}
            </g>
          );
        })}
        <Txt x={542} y={172} size={11} fill={DT.ink3}>
          每层量化上一层的残差，越往后越精细
        </Txt>
      </RNode>
      <ArrowRight x1={692} x2={726} y={105} />

      {/* 语义 ID */}
      <RNode x={726} y={66} w={130} h={78} fill={tint} stroke={hue}>
        <Txt x={791} y={94} size={11.5} bold fill={DT.ink}>
          层级语义 ID
        </Txt>
        <Txt x={791} y={118} mono size={13} fill={hue}>
          ⟨a₃,b₇,c₂⟩
        </Txt>
      </RNode>
      <ArrowDown x={791} y1={144} y2={176} />

      {/* Transformer 生成 */}
      <RNode x={660} y={176} w={196} h={60} fill={DT.surface2}>
        <Txt x={758} y={200} bold fill={DT.ink} size={12.5}>
          Transformer seq2seq
        </Txt>
        <Txt x={758} y={220} size={11} fill={DT.ink3}>
          逐 token「生成」下一个物品
        </Txt>
      </RNode>
      <Txt x={758} y={262} size={11} fill={hue}>
        推荐 = 条件生成任务
      </Txt>

      {/* 底部对比 */}
      <line x1={40} y1={330} x2={840} y2={330} stroke={DT.lineStrong} strokeWidth={1} strokeDasharray={DT.dash} />
      <Txt x={60} y={360} anchor="start" bold fill={DT.ink}>
        两种 ID 方案对比
      </Txt>
      <RNode x={60} y={380} w={360} h={100} fill={DT.surface} dashed stroke={DT.danger}>
        <Txt x={240} y={408} bold fill={DT.danger}>
          随机哈希 ID
        </Txt>
        <Txt x={240} y={432} mono size={11.5} fill={DT.ink2}>
          item_8472910 → 无意义编号
        </Txt>
        <Txt x={240} y={456} size={11.5} fill={DT.ink3}>
          冷启动物品无法泛化，记忆化严重
        </Txt>
      </RNode>
      <RNode x={460} y={380} w={360} h={100} fill={tint} stroke={DT.success}>
        <Txt x={640} y={408} bold fill={DT.success}>
          语义 ID
        </Txt>
        <Txt x={640} y={432} mono size={11.5} fill={DT.ink2}>
          ⟨a₃,b₇,c₂⟩ → 内容相似的物品 ID 相近
        </Txt>
        <Txt x={640} y={456} size={11.5} fill={DT.ink3}>
          可泛化、可生成，天然支持冷启动
        </Txt>
      </RNode>
    </svg>
  );
}
