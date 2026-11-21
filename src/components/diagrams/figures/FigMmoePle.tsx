// fig-mmoe-ple：MMoE 与 PLE 结构对比
// site_ia.md §4.2：左 Shared-Bottom（单底座分叉两任务，标「负迁移」）；
// 中 MMoE（N 个专家 + 每任务一个门控，门控输出权重条）；
// 右 PLE（共享专家 + 任务专属专家分组，门控只融合「共享+自己专属」，标「治跷跷板」）

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowUp } from './helpers';

function Expert({ x, y, tone, label }: { x: number; y: number; tone: string; label?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={44} height={56} rx={DT.nodeRadius} fill={tone} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      {label && (
        <Txt x={x + 22} y={y + 76} size={10.5} fill={DT.ink3}>
          {label}
        </Txt>
      )}
    </g>
  );
}

export default function FigMmoePle({ hue = '#B0503C', tint = '#F6E4E0' }: DiagramProps) {
  return (
    <svg viewBox="0 0 880 460" width="100%" role="img" aria-label="MMoE 与 PLE 结构对比">
      {/* ===== 左：Shared-Bottom ===== */}
      <Txt x={150} y={36} bold fill={DT.ink}>
        Shared-Bottom
      </Txt>
      <Txt x={150} y={56} size={11.5} fill={DT.danger}>
        硬共享 → 负迁移
      </Txt>
      <RNode x={90} y={80} w={52} h={40} fill={DT.surface}>
        <Txt x={116} y={105} size={11.5}>
          任务A
        </Txt>
      </RNode>
      <RNode x={166} y={80} w={52} h={40} fill={DT.surface}>
        <Txt x={192} y={105} size={11.5}>
          任务B
        </Txt>
      </RNode>
      <path d="M116 120 L116 150 L150 168 L150 196" fill="none" stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <path d="M192 120 L192 150 L158 168 L158 196" fill="none" stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <RNode x={100} y={196} w={108} h={60} fill={DT.surface2}>
        <Txt x={154} y={222} size={11.5} bold>
          单一底座
        </Txt>
        <Txt x={154} y={242} size={10.5} fill={DT.ink3}>
          所有任务共用
        </Txt>
      </RNode>
      <ArrowUp x={154} y1={256} y2={286} dashed color={DT.ink3} />
      <Txt x={154} y={306} size={11} fill={DT.ink3}>
        输入特征
      </Txt>

      {/* ===== 中：MMoE ===== */}
      <Txt x={440} y={36} bold fill={DT.ink}>
        MMoE
      </Txt>
      <Txt x={440} y={56} size={11.5} fill={DT.ink3}>
        软共享：门控为每任务调专家权重
      </Txt>
      <RNode x={330} y={76} w={52} h={40} fill={DT.surface}>
        <Txt x={356} y={101} size={11.5}>
          任务A
        </Txt>
      </RNode>
      <RNode x={498} y={76} w={52} h={40} fill={DT.surface}>
        <Txt x={524} y={101} size={11.5}>
          任务B
        </Txt>
      </RNode>
      {/* 门控 */}
      <RNode x={322} y={136} w={68} h={30} fill={tint} stroke={hue}>
        <Txt x={356} y={156} size={11}>
          门控A
        </Txt>
      </RNode>
      <RNode x={490} y={136} w={68} h={30} fill={tint} stroke={hue}>
        <Txt x={524} y={156} size={11}>
          门控B
        </Txt>
      </RNode>
      {/* 权重条 */}
      <rect x={398} y={140} width={8} height={22} fill={hue} opacity={0.7} />
      <rect x={408} y={146} width={8} height={16} fill={hue} opacity={0.45} />
      <rect x={418} y={152} width={8} height={10} fill={hue} opacity={0.25} />
      <rect x={474} y={152} width={8} height={10} fill={hue} opacity={0.25} />
      <rect x={464} y={146} width={8} height={16} fill={hue} opacity={0.45} />
      <rect x={454} y={140} width={8} height={22} fill={hue} opacity={0.7} />
      {/* 专家 */}
      {[0, 1, 2].map((i) => (
        <Expert key={i} x={396 + i * 46} y={196} tone={DT.surface2} label={i === 1 ? 'N 个共享专家' : undefined} />
      ))}
      <path d="M356 166 L400 196" fill="none" stroke={DT.ink3} strokeWidth={1} />
      <path d="M356 166 L446 196" fill="none" stroke={DT.ink3} strokeWidth={1} />
      <path d="M524 166 L480 196" fill="none" stroke={DT.ink3} strokeWidth={1} />
      <path d="M524 166 L434 196" fill="none" stroke={DT.ink3} strokeWidth={1} />
      <ArrowUp x={440} y1={252} y2={286} dashed color={DT.ink3} />
      <Txt x={440} y={306} size={11} fill={DT.ink3}>
        输入特征
      </Txt>

      {/* ===== 右：PLE ===== */}
      <Txt x={730} y={36} bold fill={DT.ink}>
        PLE
      </Txt>
      <Txt x={730} y={56} size={11.5} fill={DT.success}>
        专属 + 共享分组 → 治跷跷板
      </Txt>
      <RNode x={612} y={76} w={52} h={40} fill={DT.surface}>
        <Txt x={638} y={101} size={11.5}>
          任务A
        </Txt>
      </RNode>
      <RNode x={796} y={76} w={52} h={40} fill={DT.surface}>
        <Txt x={822} y={101} size={11.5}>
          任务B
        </Txt>
      </RNode>
      <RNode x={604} y={136} w={68} h={30} fill={tint} stroke={hue}>
        <Txt x={638} y={156} size={11}>
          门控A
        </Txt>
      </RNode>
      <RNode x={788} y={136} w={68} h={30} fill={tint} stroke={hue}>
        <Txt x={822} y={156} size={11}>
          门控B
        </Txt>
      </RNode>
      {/* 专属A / 共享 / 专属B */}
      <Expert x={622} y={196} tone={tint} label="A专属" />
      <Expert x={706} y={196} tone={DT.surface2} label="共享专家" />
      <Expert x={790} y={196} tone={tint} label="B专属" />
      <path d="M638 166 L644 196 M638 166 L728 196" fill="none" stroke={DT.ink3} strokeWidth={1} />
      <path d="M822 166 L812 196 M822 166 L732 196" fill="none" stroke={DT.ink3} strokeWidth={1} />
      <Txt x={730} y={292} size={11} fill={DT.ink3}>
        门控只融合「共享 + 自己专属」
      </Txt>
      <ArrowUp x={730} y1={252} y2={266} dashed color={DT.ink3} />
      <Txt x={730} y={306} size={11} fill={DT.ink3}>
        输入特征
      </Txt>

      {/* 分隔虚线 */}
      <line x1={272} y1={30} x2={272} y2={330} stroke={DT.lineStrong} strokeWidth={1} strokeDasharray={DT.dash} />
      <line x1={586} y1={30} x2={586} y2={330} stroke={DT.lineStrong} strokeWidth={1} strokeDasharray={DT.dash} />

      {/* 底部注释 */}
      <rect x={190} y={340} width={500} height={40} rx={DT.nodeRadius} fill={DT.surface} stroke={hue} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
      <Txt x={440} y={365} bold fill={hue}>
        演进脉络：硬共享（负迁移）→ 软共享 MMoE → 分组的 PLE（缓解跷跷板）
      </Txt>
    </svg>
  );
}
