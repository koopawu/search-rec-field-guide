// fig-esmm-ctr-cvr：ESMM 全空间建模链式结构
// site_ia.md §4.2：样本空间三层漏斗：曝光（大）→ 点击（中）→ 转化（小）；
// pCTR 塔与 pCTCVR 塔在全曝光空间训练，pCVR 为虚线中间变量；
// 公式条 pCTCVR = pCTR × pCVR 横贯；标注「共享 Embedding，CVR 向 CTR 借力」

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowDown, ArrowUp } from './helpers';

export default function FigEsmmCtrCvr({ hue = '#B0503C', tint = '#F6E4E0' }: DiagramProps) {
  return (
    <svg viewBox="0 0 880 520" width="100%" role="img" aria-label="ESMM 全空间建模链式结构">
      {/* 左：样本空间漏斗 */}
      <Txt x={180} y={40} bold fill={DT.ink}>
        样本空间
      </Txt>
      <path d="M60 60 L300 60 L264 160 L96 160 Z" fill={tint} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <Txt x={180} y={104} bold fill={DT.ink}>
        曝光
      </Txt>
      <Txt x={180} y={126} size={11.5} fill={DT.ink3}>
        全空间（大）
      </Txt>
      <path d="M96 160 L264 160 L234 250 L126 250 Z" fill={DT.surface2} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <Txt x={180} y={200} bold fill={DT.ink}>
        点击
      </Txt>
      <Txt x={180} y={222} size={11.5} fill={DT.ink3}>
        子空间（中）
      </Txt>
      <path d="M126 250 L234 250 L212 330 L148 330 Z" fill={tint} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <Txt x={180} y={288} bold fill={DT.ink}>
        转化
      </Txt>
      <Txt x={180} y={310} size={11.5} fill={DT.ink3}>
        子子空间（小）
      </Txt>
      <Txt x={180} y={360} size={11.5} fill={DT.danger}>
        传统 CVR 只在「点击」子空间训练 → 样本选择偏差
      </Txt>

      {/* 右：链式三塔 */}
      <Txt x={620} y={40} bold fill={DT.ink}>
        ESMM 链式建模
      </Txt>
      {/* 共享 Embedding 底座 */}
      <RNode x={440} y={300} w={360} h={48} fill={DT.surface2}>
        <Txt x={620} y={329} bold fill={DT.ink}>
          共享 Embedding 层（两塔共用）
        </Txt>
      </RNode>
      <ArrowUp x={510} y1={300} y2={268} />
      <ArrowUp x={730} y1={300} y2={268} />

      {/* pCTR 塔 */}
      <RNode x={450} y={180} w={120} h={88} fill={tint} stroke={hue}>
        <Txt x={510} y={216} bold fill={DT.ink}>
          pCTR 塔
        </Txt>
        <Txt x={510} y={238} size={11.5} fill={DT.ink3}>
          全曝光空间训练
        </Txt>
      </RNode>
      {/* pCVR 塔（虚线中间变量） */}
      <RNode x={610} y={180} w={120} h={88} fill={DT.surface} dashed stroke={DT.warning}>
        <Txt x={670} y={216} bold fill={DT.warning}>
          pCVR 塔
        </Txt>
        <Txt x={670} y={238} size={11.5} fill={DT.ink3}>
          隐式中间变量
        </Txt>
      </RNode>
      {/* pCTCVR 塔 */}
      <RNode x={770} y={180} w={90} h={88} fill={tint} stroke={hue}>
        <Txt x={815} y={212} bold fill={DT.ink} size={12.5}>
          pCTCVR
        </Txt>
        <Txt x={815} y={234} size={11.5} fill={DT.ink3}>
          全空间训练
        </Txt>
      </RNode>
      {/* 乘法连线 */}
      <line x1={570} y1={224} x2={610} y2={224} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <line x1={730} y1={224} x2={770} y2={224} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <Txt x={590} y={214} mono bold fill={hue}>
        ×
      </Txt>
      <Txt x={750} y={214} mono bold fill={hue}>
        =
      </Txt>

      {/* 公式条 */}
      <rect x={430} y={120} width={420} height={40} rx={DT.nodeRadius} fill={DT.surface} stroke={hue} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
      <Txt x={640} y={146} mono bold fill={hue}>
        pCTCVR = pCTR × pCVR（均在全曝光空间监督）
      </Txt>

      {/* 底部注释 */}
      <ArrowDown x={180} y1={376} y2={398} dashed color={DT.ink3} />
      <Txt x={440} y={430} size={12.5} fill={DT.ink2}>
        CVR 任务不直接建模，而是通过链式乘积「向 CTR 借力」，缓解样本选择偏差与数据稀疏
      </Txt>
      <Txt x={440} y={458} size={11.5} fill={DT.ink3}>
        pCTR 与 pCTCVR 有真实标签直接监督；pCVR 由两者相除隐式获得
      </Txt>
    </svg>
  );
}
