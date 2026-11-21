// fig-index-build：索引构建流程（全量 + 增量 + 实时）
// site_ia.md §4.5：三条入流通道：全量（非常驻，多版本隔离可回滚）、
// 增量（常驻，API→Processor→Builder→Merger）、实时（内存，秒级可见）；
// 汇入在线索引（partition→segment 放大）；标注「段合并 IO 波动 = 查询抖动常见原因」

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowRight, ArrowDown } from './helpers';

export default function FigIndexBuild({ hue = '#6E6257', tint = '#ECE7E1' }: DiagramProps) {
  return (
    <svg viewBox="0 0 880 540" width="100%" role="img" aria-label="索引构建流程：全量 + 增量 + 实时">
      {/* 通道一：全量 */}
      <RNode x={30} y={50} w={120} h={56} fill={DT.surface2}>
        <Txt x={90} y={74} bold fill={DT.ink} size={12.5}>
          全量构建
        </Txt>
        <Txt x={90} y={94} size={10.5} fill={DT.ink3}>
          非常驻 · 天级
        </Txt>
      </RNode>
      <RNode x={180} y={50} w={220} h={56} fill={DT.surface}>
        <Txt x={290} y={74} size={11.5} bold>
          离线批量重建
        </Txt>
        <Txt x={290} y={94} size={10.5} fill={DT.ink3}>
          多版本隔离 · 可一键回滚
        </Txt>
      </RNode>
      <ArrowRight x1={400} x2={470} y={78} />

      {/* 通道二：增量 */}
      <RNode x={30} y={150} w={120} h={56} fill={DT.surface2}>
        <Txt x={90} y={174} bold fill={DT.ink} size={12.5}>
          增量构建
        </Txt>
        <Txt x={90} y={194} size={10.5} fill={DT.ink3}>
          常驻服务
        </Txt>
      </RNode>
      {['API 接入', 'Processor', 'Builder', 'Merger'].map((s, i) => {
        const x = 170 + i * 96;
        return (
          <g key={s}>
            <RNode x={x} y={156} w={84} h={44} fill={DT.surface}>
              <Txt x={x + 42} y={183} size={10.5} bold>
                {s}
              </Txt>
            </RNode>
            {i < 3 && <ArrowRight x1={x + 84} x2={x + 96} y={178} color={DT.ink3} />}
          </g>
        );
      })}
      <ArrowRight x1={554} x2={600} y={178} />

      {/* 通道三：实时 */}
      <RNode x={30} y={250} w={120} h={56} fill={DT.surface2}>
        <Txt x={90} y={274} bold fill={DT.ink} size={12.5}>
          实时构建
        </Txt>
        <Txt x={90} y={294} size={10.5} fill={DT.ink3}>
          内存直写
        </Txt>
      </RNode>
      <RNode x={180} y={250} w={220} h={56} fill={DT.surface}>
        <Txt x={290} y={274} size={11.5} bold>
          内存 segment
        </Txt>
        <Txt x={290} y={294} size={10.5} fill={DT.ink3}>
          秒级可见 · 定期落盘
        </Txt>
      </RNode>
      <ArrowRight x1={400} x2={470} y={278} />

      {/* 汇入在线索引 */}
      <RNode x={470} y={60} w={150} h={240} fill={tint} stroke={hue}>
        <Txt x={545} y={96} bold fill={DT.ink}>
          在线索引
        </Txt>
        <Txt x={545} y={118} size={11} fill={DT.ink3}>
          多 partition
        </Txt>
        {['P0', 'P1', 'P2'].map((p, i) => (
          <RNode key={p} x={490} y={134 + i * 48} w={110} h={36} fill={DT.surface}>
            <Txt x={545} y={157 + i * 48} mono size={11.5}>
              {p}
            </Txt>
          </RNode>
        ))}
      </RNode>
      <ArrowRight x1={620} x2={664} y={180} />

      {/* partition → segment 放大图 */}
      <RNode x={664} y={60} w={190} h={240} fill={DT.surface}>
        <Txt x={759} y={88} bold size={12} fill={DT.ink}>
          单个 partition 内部
        </Txt>
        {['seg-1', 'seg-2', 'seg-3', 'seg-4'].map((s, i) => (
          <g key={s}>
            <rect x={684} y={104 + i * 42} width={150 - i * 26} height={30} rx={6} fill={DT.surface2} stroke={DT.ink3} strokeWidth={1} />
            <Txt x={696} y={124 + i * 42} anchor="start" mono size={10.5} fill={DT.ink2}>
              {s}
            </Txt>
          </g>
        ))}
        <Txt x={759} y={282} size={10.5} fill={DT.ink3}>
          倒排 segment 只增不改
        </Txt>
      </RNode>

      {/* 段合并标注 */}
      <path d="M684 316 L684 336 L610 336" fill="none" stroke={DT.warning} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
      <RNode x={360} y={318} w={250} h={40} fill={DT.surface} dashed stroke={DT.warning}>
        <Txt x={485} y={343} size={11.5} fill={DT.warning}>
          段合并（merge）IO 波动
        </Txt>
      </RNode>
      <Txt x={440} y={392} bold fill={hue}>
        段合并时的 IO 突增是在线查询抖动的最常见原因之一
      </Txt>

      {/* 底部小结 */}
      <ArrowDown x={545} y1={300} y2={318} dashed color={DT.ink3} />
      <Txt x={440} y={440} size={12.5} fill={DT.ink2}>
        全量保正确性，增量保吞吐，实时保时效——三条通道汇入同一在线索引
      </Txt>
      <Txt x={440} y={468} mono size={11.5} fill={DT.ink3}>
        天级重建 · 分钟级增量 · 秒级实时可见
      </Txt>
    </svg>
  );
}
