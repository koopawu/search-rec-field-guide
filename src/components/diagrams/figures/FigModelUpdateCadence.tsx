// fig-model-update-cadence：模型更新频率谱系
// site_ia.md §4.5：横轴时效性（天→小时→分钟→实时），纵轴工程成本；
// 三节点：全量更新（天级）/ 增量更新（小时级，只更 sparse embedding）/ 在线学习（DRN）；
// 中嵌小红书 base+增量架构小图

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowRight } from './helpers';

export default function FigModelUpdateCadence({ hue = '#6E6257', tint = '#ECE7E1' }: DiagramProps) {
  const x0 = 90;
  const y0 = 300;
  const W = 560;
  const H = 200;
  const nodes = [
    { x: 0.12, y: 0.25, name: '全量更新', note: '天级 · 全参数重训', color: DT.ink2 },
    { x: 0.5, y: 0.55, name: '增量更新', note: '小时级 · 只更 sparse embedding', color: hue },
    { x: 0.88, y: 0.85, name: '在线学习', note: '分钟~实时 · DRN', color: DT.success },
  ];
  const px = (t: number) => x0 + t * W;
  const py = (t: number) => y0 - t * H;

  return (
    <svg viewBox="0 0 880 560" width="100%" role="img" aria-label="模型更新频率谱系">
      {/* 坐标系 */}
      <line x1={x0} y1={y0} x2={x0 + W + 30} y2={y0} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <line x1={x0} y1={y0} x2={x0} y2={y0 - H - 30} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <Txt x={x0 + W / 2} y={y0 + 36} size={12} fill={DT.ink3}>
        时效性：天 → 小时 → 分钟 → 实时 →
      </Txt>
      <Txt x={x0 - 46} y={y0 - H / 2} size={12} fill={DT.ink3}>
        <tspan transform={`rotate(-90 ${x0 - 46} ${y0 - H / 2})`}>工程成本 →</tspan>
      </Txt>

      {/* 代价曲线 */}
      <path d={`M${px(0.05)} ${py(0.1)} Q ${px(0.45)} ${py(0.32)} ${px(0.95)} ${py(0.95)}`} fill="none" stroke={DT.lineStrong} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />

      {nodes.map((n) => (
        <g key={n.name}>
          <circle cx={px(n.x)} cy={py(n.y)} r={8} fill={DT.surface} stroke={n.color} strokeWidth={2} />
          <RNode x={px(n.x) - 80} y={py(n.y) - 66} w={160} h={48} fill={n.color === hue ? tint : DT.surface} stroke={n.color}>
            <Txt x={px(n.x)} y={py(n.y) - 44} bold size={11.5} fill={DT.ink}>
              {n.name}
            </Txt>
            <Txt x={px(n.x)} y={py(n.y) - 26} size={9.5} fill={DT.ink3}>
              {n.note}
            </Txt>
          </RNode>
        </g>
      ))}
      <Txt x={px(0.95)} y={py(0.95) + 24} anchor="end" size={10.5} fill={DT.ink3}>
        越实时，样本、特征、发布链路成本越高
      </Txt>

      {/* 小红书 base+增量 小图 */}
      <RNode x={470} y={360} w={380} h={170} fill={DT.surface} dashed>
        <Txt x={660} y={386} bold size={12.5} fill={DT.ink}>
          小红书实践：base + 增量分离发布
        </Txt>
        <RNode x={492} y={402} w={160} h={44} fill={DT.surface2}>
          <Txt x={572} y={422} size={11} bold>
            base 模型
          </Txt>
          <Txt x={572} y={438} mono size={9.5} fill={DT.ink3}>
            每日全量
          </Txt>
        </RNode>
        <RNode x={492} y={458} w={160} h={44} fill={tint} stroke={hue}>
          <Txt x={572} y={478} size={11} bold>
            增量模型
          </Txt>
          <Txt x={572} y={494} mono size={9.5} fill={hue}>
            每小时 · 只更 embedding
          </Txt>
        </RNode>
        <ArrowRight x1={652} x2={700} y={424} color={DT.ink3} />
        <ArrowRight x1={652} x2={700} y={480} color={hue} />
        <RNode x={700} y={430} w={130} h={56} fill={DT.surface}>
          <Txt x={765} y={452} size={10.5} bold>
            PS-worker
          </Txt>
          <Txt x={765} y={470} size={9.5} fill={DT.ink3}>
            分离发布
          </Txt>
        </RNode>
      </RNode>

      <Txt x={250} y={470} size={11.5} fill={DT.ink2}>
        时效性不是越新越好，而是「新到收益拐点」为止：
      </Txt>
      <Txt x={250} y={496} size={11.5} fill={DT.ink3}>
        大多数业务的小时级增量已拿到实时学习 80% 的收益
      </Txt>
    </svg>
  );
}
