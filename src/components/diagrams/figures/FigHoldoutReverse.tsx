// fig-holdout-reverse：Holdout 与反转实验结构
// site_ia.md §4.5：用户池横切：10% Holdout 桶 vs 90% 实验桶（内再分 AB）；
// 下方时间轴：推全时刻新建「推全层」并保留 5% 反转桶继续跑旧策略；
// 标注「实验收益不能简单相加」「反转桶关闭才是真正 100% 推全」

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowRight } from './helpers';

export default function FigHoldoutReverse({ hue = '#71803F', tint = '#ECEFE0' }: DiagramProps) {
  return (
    <svg viewBox="0 0 880 520" width="100%" role="img" aria-label="Holdout 与反转实验结构">
      {/* 上：用户池横切 */}
      <Txt x={60} y={44} anchor="start" bold fill={DT.ink}>
        用户池切分
      </Txt>
      {/* 90% 实验桶 */}
      <rect x={60} y={60} width={648} height={90} rx={DT.nodeRadius} fill={DT.surface2} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <Txt x={200} y={92} bold size={12.5} fill={DT.ink}>
        90% 实验桶
      </Txt>
      {/* 桶内 AB */}
      <rect x={80} y={104} width={300} height={34} rx={6} fill={tint} stroke={hue} strokeWidth={DT.strokeWidth} />
      <Txt x={230} y={126} size={11.5} fill={hue}>
        A 组：新策略
      </Txt>
      <rect x={392} y={104} width={300} height={34} rx={6} fill={DT.surface} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <Txt x={542} y={126} size={11.5} fill={DT.ink2}>
        B 组：旧策略
      </Txt>
      {/* 10% Holdout */}
      <rect x={716} y={60} width={72} height={90} rx={DT.nodeRadius} fill={DT.surface} stroke={DT.warning} strokeWidth={DT.strokeWidth} />
      <Txt x={752} y={96} size={10.5} bold fill={DT.warning}>
        10%
      </Txt>
      <Txt x={752} y={114} size={10.5} bold fill={DT.warning}>
        Holdout
      </Txt>
      <Txt x={752} y={132} size={9} fill={DT.ink3}>
        长期旧策略
      </Txt>
      <Txt x={800} y={92} anchor="start" size={10.5} fill={DT.ink3}>
        部门收益的度量衡：
      </Txt>
      <Txt x={800} y={112} anchor="start" size={10.5} fill={DT.ink3}>
        所有实验 vs Holdout
      </Txt>
      <Txt x={800} y={132} anchor="start" size={10.5} fill={DT.ink3}>
        的累计增量
      </Txt>

      {/* 下：时间轴（推全 + 反转桶） */}
      <Txt x={60} y={220} anchor="start" bold fill={DT.ink}>
        推全时刻：新建推全层 + 保留反转桶
      </Txt>
      <line x1={60} y1={430} x2={830} y2={430} stroke={DT.ink2} strokeWidth={DT.strokeWidth} />
      <path d="M824 426 L834 430 L824 434 Z" fill={DT.ink2} />
      <Txt x={840} y={434} size={11} fill={DT.ink3}>
        时间
      </Txt>

      {/* 阶段一：实验期 */}
      <RNode x={60} y={300} w={220} h={60} fill={DT.surface}>
        <Txt x={170} y={326} bold size={12} fill={DT.ink}>
          实验期
        </Txt>
        <Txt x={170} y={348} size={10.5} fill={DT.ink3}>
          AB 分层实验，逐层验证
        </Txt>
      </RNode>
      <ArrowRight x1={280} x2={330} y={330} />

      {/* 阶段二：推全层 */}
      <RNode x={330} y={280} w={260} h={100} fill={tint} stroke={hue}>
        <Txt x={460} y={308} bold size={12.5} fill={DT.ink}>
          推全层（95%）
        </Txt>
        <Txt x={460} y={332} size={11} fill={DT.ink2}>
          验证通过的策略全量生效
        </Txt>
        <Txt x={460} y={354} size={10.5} fill={DT.ink3}>
          原实验层销毁，层资源回收
        </Txt>
      </RNode>

      {/* 阶段三：反转桶 */}
      <RNode x={610} y={290} w={150} h={80} fill={DT.surface} stroke={DT.danger}>
        <Txt x={685} y={316} bold size={12} fill={DT.danger}>
          5% 反转桶
        </Txt>
        <Txt x={685} y={340} size={10.5} fill={DT.ink2}>
          继续跑旧策略
        </Txt>
        <Txt x={685} y={358} size={10} fill={DT.ink3}>
          长期效果观测窗
        </Txt>
      </RNode>

      {/* 底部注释 */}
      <rect x={60} y={452} width={740} height={52} rx={DT.nodeRadius} fill={DT.surface} stroke={hue} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
      <Txt x={430} y={474} size={12} fill={hue} bold>
        注意：各实验收益不能简单相加（有重叠与交互）；反转桶关闭的那一刻才是真正 100% 推全
      </Txt>
      <Txt x={430} y={496} size={11} fill={DT.ink3}>
        Holdout 回答「今年算法部门总共贡献多少」；反转桶回答「推全后长期有没有反噬」
      </Txt>
    </svg>
  );
}
