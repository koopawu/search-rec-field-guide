// fig-intent-routing：垂直意图路由分发
// site_ia.md §4.5：中心意图识别模型 → 扇形分发到垂域数据源/Agent 卡片
// （POI / 线路游 / 门票… LLM 时代扩展为 Agent/工具/垂域源）；
// 标注美团旅游优先级「线路游>POI>品类>门票」与「路由准确率 = 成本与体验的第一道阀门」

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt } from './helpers';

const VERTICALS = [
  { name: '线路游', pri: 1 },
  { name: 'POI 景点', pri: 2 },
  { name: '品类攻略', pri: 3 },
  { name: '门票', pri: 4 },
  { name: '酒店', pri: 5 },
  { name: 'Agent / 工具', pri: 0 },
];

export default function FigIntentRouting({ hue = '#A9713A', tint = '#F5EBDD' }: DiagramProps) {
  const cx = 210;
  return (
    <svg viewBox="0 0 880 520" width="100%" role="img" aria-label="垂直意图路由分发">
      {/* Query 输入 */}
      <RNode x={40} y={40} w={340} h={46} fill={DT.surface2}>
        <Txt x={210} y={68} mono size={12.5}>
          Query：「周末带娃去哪玩」
        </Txt>
      </RNode>
      <path d="M210 86 L210 130" stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <path d="M206 124 L210 132 L214 124 Z" fill={DT.ink2} />

      {/* 中心：意图识别模型 */}
      <RNode x={90} y={132} w={240} h={110} fill={tint} stroke={hue}>
        <Txt x={cx} y={164} bold fill={DT.ink}>
          意图识别模型
        </Txt>
        <Txt x={cx} y={188} size={11.5} fill={DT.ink2}>
          分类：旅游 · 亲子 · 周边
        </Txt>
        <Txt x={cx} y={210} size={11.5} fill={DT.ink3}>
          置信度 0.87 → 触发垂域路由
        </Txt>
      </RNode>

      {/* 扇形分发 */}
      {VERTICALS.map((v, i) => {
        const y = 46 + i * 76;
        const tx = 560;
        const midY = y + 28;
        return (
          <g key={v.name}>
            <path
              d={`M330 ${187} C 430 ${187}, 460 ${midY}, ${tx - 8} ${midY}`}
              fill="none"
              stroke={v.pri === 1 ? hue : DT.lineStrong}
              strokeWidth={v.pri === 1 ? 2.5 : DT.strokeWidth}
              strokeDasharray={v.pri > 1 ? DT.dash : undefined}
            />
            <path d={`M${tx - 14} ${midY - 4} L${tx - 4} ${midY} L${tx - 14} ${midY + 4} Z`} fill={v.pri === 1 ? hue : DT.lineStrong} />
            <RNode x={tx} y={y} w={170} h={56} fill={v.pri === 1 ? tint : DT.surface} stroke={v.pri === 1 ? hue : DT.ink2}>
              <Txt x={tx + 85} y={y + 25} bold size={12.5} fill={DT.ink}>
                {v.name}
              </Txt>
              <Txt x={tx + 85} y={y + 44} size={10.5} fill={v.pri > 0 ? hue : DT.ink3}>
                {v.pri > 0 ? `优先级 ${v.pri}` : 'LLM 时代扩展'}
              </Txt>
            </RNode>
          </g>
        );
      })}
      <Txt x={645} y={36} size={11.5} fill={DT.ink3}>
        垂域数据源 / Agent
      </Txt>

      {/* 底部注释 */}
      <RNode x={90} y={300} w={360} h={100} fill={DT.surface} dashed>
        <Txt x={270} y={328} bold size={12.5} fill={DT.ink}>
          美团旅游优先级规则
        </Txt>
        <Txt x={270} y={352} mono size={12} fill={hue}>
          线路游 &gt; POI &gt; 品类 &gt; 门票
        </Txt>
        <Txt x={270} y={376} size={11} fill={DT.ink3}>
          多意图命中时按业务价值定序
        </Txt>
      </RNode>
      <rect x={90} y={424} width={620} height={40} rx={DT.nodeRadius} fill={DT.surface} stroke={hue} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
      <Txt x={400} y={449} bold fill={hue}>
        路由准确率 = 成本与体验的第一道阀门：路由错则下游全错
      </Txt>
    </svg>
  );
}
