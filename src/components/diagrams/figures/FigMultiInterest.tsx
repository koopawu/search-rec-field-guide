// fig-multi-interest：多兴趣向量召回示意
// site_ia.md §4.5：用户行为云（数码+母婴两类混杂）→ 单向量方案（平均向量落在两类之间
// 「两头不靠」标红叉）→ 多向量方案（两个兴趣向量各自命中对应类目候选，标绿勾）

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowRight } from './helpers';

// 用户行为云点（数码=方块，母婴=圆）
const CLOUD = [
  { x: 90, y: 90, c: 0 }, { x: 130, y: 70, c: 0 }, { x: 110, y: 130, c: 0 }, { x: 150, y: 110, c: 0 },
  { x: 200, y: 200, c: 1 }, { x: 240, y: 180, c: 1 }, { x: 220, y: 240, c: 1 }, { x: 260, y: 220, c: 1 },
];

export default function FigMultiInterest({ hue = '#B0503C', tint = '#F6E4E0' }: DiagramProps) {
  return (
    <svg viewBox="0 0 880 420" width="100%" role="img" aria-label="多兴趣向量召回示意">
      {/* 用户行为云 */}
      <Txt x={170} y={40} bold fill={DT.ink}>
        用户行为云
      </Txt>
      <Txt x={170} y={60} size={11} fill={DT.ink3}>
        数码兴趣（方块）+ 母婴兴趣（圆点）混杂
      </Txt>
      {CLOUD.map((p, i) =>
        p.c === 0 ? (
          <rect key={i} x={p.x} y={p.y} width={14} height={14} rx={3} fill={tint} stroke={hue} strokeWidth={1.2} />
        ) : (
          <circle key={i} cx={p.x} cy={p.y} r={8} fill={DT.surface2} stroke={DT.ink2} strokeWidth={1.2} />
        ),
      )}
      {/* 两类聚类虚线圈 */}
      <ellipse cx={122} cy={102} rx={62} ry={52} fill="none" stroke={hue} strokeWidth={1} strokeDasharray={DT.dash} />
      <ellipse cx={232} cy={212} rx={58} ry={48} fill="none" stroke={DT.ink2} strokeWidth={1} strokeDasharray={DT.dash} />

      <ArrowRight x1={300} x2={350} y={160} />

      {/* 单向量方案（红叉） */}
      <Txt x={490} y={40} bold fill={DT.danger}>
        单向量方案 ✗
      </Txt>
      <ellipse cx={430} cy={120} rx={46} ry={40} fill="none" stroke={hue} strokeWidth={1} strokeDasharray={DT.dash} />
      <ellipse cx={552} cy={220} rx={44} ry={38} fill="none" stroke={DT.ink2} strokeWidth={1} strokeDasharray={DT.dash} />
      {/* 平均向量落在中间 */}
      <path d="M474 158 L504 188 M504 158 L474 188" stroke={DT.danger} strokeWidth={2.5} />
      <circle cx={489} cy={173} r={4} fill={DT.danger} />
      <Txt x={489} y={140} size={11.5} fill={DT.danger}>
        平均向量落在两类之间
      </Txt>
      <Txt x={489} y={300} size={11.5} fill={DT.danger}>
        「两头不靠」：哪类候选都召不准
      </Txt>

      <ArrowRight x1={600} x2={650} y={160} />

      {/* 多向量方案（绿勾） */}
      <Txt x={770} y={40} bold fill={DT.success}>
        多向量方案 ✓
      </Txt>
      <ellipse cx={716} cy={120} rx={46} ry={40} fill={tint} stroke={hue} strokeWidth={1} strokeDasharray={DT.dash} />
      <ellipse cx={806} cy={220} rx={44} ry={38} fill={DT.surface2} stroke={DT.ink2} strokeWidth={1} strokeDasharray={DT.dash} />
      <circle cx={716} cy={120} r={5} fill={DT.success} />
      <circle cx={806} cy={220} r={5} fill={DT.success} />
      <Txt x={716} y={100} size={11.5} fill={DT.success}>
        兴趣向量 1 → 数码候选
      </Txt>
      <Txt x={806} y={200} size={11.5} fill={DT.success}>
        兴趣向量 2 → 母婴候选
      </Txt>
      <Txt x={770} y={300} size={11.5} fill={DT.success}>
        每个兴趣向量各自命中对应类目
      </Txt>
      <RNode x={660} y={320} w={200} h={40} fill={DT.surface} dashed stroke={DT.ink3}>
        <Txt x={760} y={345} size={11.5} fill={DT.ink2}>
          代表：MIND / ComiRec
        </Txt>
      </RNode>
    </svg>
  );
}
