// fig-ecpm-blending：广告混排 Blending 架构
// site_ia.md §4.3：左右两条独立排序链（内容流 / 广告流 eCPM 排序）→ Blending Server
// （决定广告插入位置，不改广告相对序）→ 混排列表示意（广告位高亮）；
// 公式条 eCPM = pCTR × pCVR × bid × 1000；底部约束条：Ad Load 上限/频控/相关性下限

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowDown, ArrowRight } from './helpers';

export default function FigEcpmBlending({ hue = '#B08A2E', tint = '#F5EDDA' }: DiagramProps) {
  return (
    <svg viewBox="0 0 880 560" width="100%" role="img" aria-label="广告混排 Blending 架构">
      {/* 左：内容流 */}
      <Txt x={170} y={40} bold fill={DT.ink}>
        内容流
      </Txt>
      <RNode x={80} y={56} w={180} h={52} fill={DT.surface}>
        <Txt x={170} y={87} bold size={12.5}>
          内容召回 → 排序
        </Txt>
      </RNode>
      <Txt x={170} y={132} size={11.5} fill={DT.ink3}>
        按用户兴趣分排序
      </Txt>
      <ArrowDown x={170} y1={108} y2={150} />

      {/* 右：广告流 */}
      <Txt x={610} y={40} bold fill={DT.ink}>
        广告流
      </Txt>
      <RNode x={500} y={56} w={220} h={52} fill={DT.surface}>
        <Txt x={610} y={87} bold size={12.5}>
          广告召回 → eCPM 排序
        </Txt>
      </RNode>
      <Txt x={610} y={132} mono size={11.5} fill={hue}>
        eCPM = pCTR × pCVR × bid × 1000
      </Txt>
      <ArrowDown x={610} y1={108} y2={150} />

      {/* Blending Server */}
      <path d="M170 150 L170 180 L390 180 L390 200" fill="none" stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <path d="M610 150 L610 180 L390 180 L390 200" fill="none" stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <path d="M386 194 L390 202 L394 194 Z" fill={DT.ink2} />
      <RNode x={240} y={202} w={300} h={72} fill={tint} stroke={hue}>
        <Txt x={390} y={232} bold fill={DT.ink}>
          Blending Server
        </Txt>
        <Txt x={390} y={254} size={11.5} fill={DT.ink3}>
          只决定广告插入位置，不改广告相对序
        </Txt>
      </RNode>
      <ArrowDown x={390} y1={274} y2={304} />

      {/* 混排列表示意 */}
      <RNode x={280} y={304} w={220} h={196} fill={DT.surface}>
        {[
          { t: '内容', ad: false }, { t: '内容', ad: false }, { t: '广告', ad: true },
          { t: '内容', ad: false }, { t: '内容', ad: false }, { t: '广告', ad: true },
        ].map((c, i) => (
          <g key={i}>
            <rect x={296} y={318 + i * 29} width={188} height={22} rx={5} fill={c.ad ? tint : DT.surface2} stroke={c.ad ? hue : DT.ink3} strokeWidth={c.ad ? DT.strokeWidth : 1} />
            <Txt x={390} y={333 + i * 29} size={10.5} fill={c.ad ? hue : DT.ink2}>
              {c.ad ? '▣ 广告卡（高亮）' : '内容卡'}
            </Txt>
          </g>
        ))}
      </RNode>
      <Txt x={390} y={524} size={11.5} fill={DT.ink3}>
        一屏混排：内容与广告交错展示
      </Txt>

      {/* 右下：约束条 */}
      <RNode x={560} y={330} w={280} h={150} fill={DT.surface} dashed stroke={DT.warning}>
        <Txt x={700} y={356} bold size={12.5} fill={DT.warning}>
          硬约束
        </Txt>
        <Txt x={700} y={382} size={11.5} fill={DT.ink2}>
          Ad Load 上限（如 ≤10%）
        </Txt>
        <Txt x={700} y={406} size={11.5} fill={DT.ink2}>
          频控（同广告主间隔）
        </Txt>
        <Txt x={700} y={430} size={11.5} fill={DT.ink2}>
          相关性下限（体验护栏）
        </Txt>
        <Txt x={700} y={458} size={10.5} fill={DT.ink3}>
          约束不满足 → 该位置不放广告
        </Txt>
      </RNode>

      <ArrowRight x1={500} x2={556} y={400} color={DT.warning} dashed />
    </svg>
  );
}
