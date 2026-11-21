// fig-cf-family-tree：召回算法家族树
// site_ia.md §4.5：根=协同过滤（UserCF/ItemCF/Swing）→ 矩阵分解 MF → FM → 双塔；
// 侧枝=内容召回（TF-IDF/BERT/CNN）、图召回（DeepWalk/Node2vec/EGES）、
// 知识图谱召回（RippleNet/KGAT）；每枝标注解决什么问题与局限

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowRight } from './helpers';

export default function FigCfFamilyTree({ hue = '#B0503C', tint = '#F6E4E0' }: DiagramProps) {
  const mainY = 210; // 主干纵轴
  const nodes = [
    { x: 60, name: '协同过滤', subs: 'UserCF / ItemCF / Swing', note: '行为共现；热门偏置' },
    { x: 300, name: '矩阵分解 MF', subs: '隐向量分解', note: '泛化更好；特征单一' },
    { x: 540, name: 'FM', subs: '特征二阶交叉', note: '引入侧特征；浅层' },
    { x: 740, name: '双塔', subs: '深度召回主流', note: '可预计算；塔间不交互' },
  ];
  const branches = [
    { y: 70, name: '内容召回', subs: 'TF-IDF / BERT / CNN', note: '治冷启动；语义天花板' },
    { y: 350, name: '图召回', subs: 'DeepWalk / Node2vec / EGES', note: '高阶共现；构图成本高' },
    { y: 470, name: '知识图谱召回', subs: 'RippleNet / KGAT', note: '可解释；图谱覆盖受限' },
  ];

  return (
    <svg viewBox="0 0 880 580" width="100%" role="img" aria-label="召回算法家族树">
      {/* 主干连线 */}
      <line x1={160} y1={mainY + 30} x2={740} y2={mainY + 30} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      {nodes.map((n, i) => (
        <g key={n.name}>
          {i > 0 && <ArrowRight x1={n.x - 66} x2={n.x - 2} y={mainY + 30} color={DT.ink3} />}
          <RNode x={n.x} y={mainY} w={170} h={60} fill={tint} stroke={hue}>
            <Txt x={n.x + 85} y={mainY + 26} bold fill={DT.ink}>
              {n.name}
            </Txt>
            <Txt x={n.x + 85} y={mainY + 46} size={11} fill={DT.ink3}>
              {n.subs}
            </Txt>
          </RNode>
          <Txt x={n.x + 85} y={mainY + 84} size={10.5} fill={DT.ink3}>
            {n.note}
          </Txt>
        </g>
      ))}
      <Txt x={60} y={mainY - 16} size={11.5} fill={DT.ink3}>
        主干：行为数据驱动的协同过滤一脉
      </Txt>

      {/* 侧枝 */}
      {branches.map((b) => (
        <g key={b.name}>
          <path
            d={`M160 ${mainY + (b.y > mainY ? 60 : 0)} L160 ${b.y + 30} L252 ${b.y + 30}`}
            fill="none"
            stroke={DT.lineStrong}
            strokeWidth={DT.strokeWidth}
            strokeDasharray={DT.dash}
          />
          <RNode x={252} y={b.y} w={220} h={60} fill={DT.surface}>
            <Txt x={362} y={b.y + 26} bold fill={DT.ink} size={12.5}>
              {b.name}
            </Txt>
            <Txt x={362} y={b.y + 46} size={11} fill={DT.ink3}>
              {b.subs}
            </Txt>
          </RNode>
          <RNode x={500} y={b.y + 8} w={250} h={44} fill={DT.surface2} stroke={DT.ink3}>
            <Txt x={625} y={b.y + 27} size={11} fill={DT.ink2}>
              {b.note}
            </Txt>
          </RNode>
        </g>
      ))}
      <Txt x={252} y={556} anchor="start" size={11.5} fill={DT.ink3}>
        虚线侧枝：与主干互补的召回范式，工业界多路并存
      </Txt>
    </svg>
  );
}
