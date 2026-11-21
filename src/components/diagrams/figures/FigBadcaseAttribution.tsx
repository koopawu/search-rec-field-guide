// fig-badcase-attribution：badcase 分层归因决策树
// site_ia.md §4.5：根「badcase」→ Q1「Gold 内容进候选集了吗？」
// （否→查解析/切片/Embedding/索引；是→Q2「排序靠前吗？」）→ 叶子四类归因
// （召回缺失/排序靠后/重排误杀/展示问题）；侧边「每条样本保存中间产物」

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowDown } from './helpers';

export default function FigBadcaseAttribution({ hue = '#71803F', tint = '#ECEFE0' }: DiagramProps) {
  return (
    <svg viewBox="0 0 880 560" width="100%" role="img" aria-label="badcase 分层归因决策树">
      {/* 根 */}
      <RNode x={340} y={30} w={200} h={50} fill={DT.surface2}>
        <Txt x={440} y={60} bold fill={DT.danger}>
          发现 badcase
        </Txt>
      </RNode>
      <ArrowDown x={440} y1={80} y2={108} />

      {/* Q1 */}
      <RNode x={300} y={108} w={280} h={56} fill={tint} stroke={hue}>
        <Txt x={440} y={132} bold size={12.5} fill={DT.ink}>
          Q1：Gold 内容进候选集了吗？
        </Txt>
        <Txt x={440} y={152} size={10.5} fill={DT.ink3}>
          用已知的好答案回查召回
        </Txt>
      </RNode>

      {/* 否 → 召回缺失 */}
      <path d="M300 136 L170 136 L170 186" fill="none" stroke={DT.danger} strokeWidth={DT.strokeWidth} />
      <Txt x={225} y={128} size={11} bold fill={DT.danger}>
        否
      </Txt>
      <path d="M166 180 L170 188 L174 180 Z" fill={DT.danger} />
      <RNode x={60} y={188} w={220} h={104} fill={DT.surface} stroke={DT.danger}>
        <Txt x={170} y={214} bold size={12.5} fill={DT.danger}>
          归因①召回缺失
        </Txt>
        <Txt x={170} y={238} size={10.5} fill={DT.ink2}>
          依次排查：解析 → 切片
        </Txt>
        <Txt x={170} y={258} size={10.5} fill={DT.ink2}>
          → Embedding → 索引
        </Txt>
        <Txt x={170} y={280} size={10} fill={DT.ink3}>
          修复后重放入库验证
        </Txt>
      </RNode>

      {/* 是 → Q2 */}
      <ArrowDown x={440} y1={164} y2={196} color={DT.success} />
      <Txt x={460} y={188} size={11} bold fill={DT.success}>
        是
      </Txt>
      <RNode x={300} y={196} w={280} h={56} fill={tint} stroke={hue}>
        <Txt x={440} y={220} bold size={12.5} fill={DT.ink}>
          Q2：排序靠前吗（Top-K 内）？
        </Txt>
        <Txt x={440} y={240} size={10.5} fill={DT.ink3}>
          查融合分与各阶段打分
        </Txt>
      </RNode>

      {/* 否 → 排序靠后 */}
      <path d="M580 224 L660 224 L660 274" fill="none" stroke={DT.danger} strokeWidth={DT.strokeWidth} />
      <Txt x={625} y={216} size={11} bold fill={DT.danger}>
        否
      </Txt>
      <path d="M656 268 L660 276 L664 268 Z" fill={DT.danger} />
      <RNode x={550} y={276} w={220} h={90} fill={DT.surface} stroke={DT.danger}>
        <Txt x={660} y={302} bold size={12.5} fill={DT.danger}>
          归因②排序靠后
        </Txt>
        <Txt x={660} y={326} size={10.5} fill={DT.ink2}>
          查融合权重 / RRF 参数
        </Txt>
        <Txt x={660} y={346} size={10.5} fill={DT.ink2}>
          查精排特征是否缺失
        </Txt>
      </RNode>

      {/* 是 → Q3 */}
      <ArrowDown x={440} y1={252} y2={284} color={DT.success} />
      <Txt x={460} y={276} size={11} bold fill={DT.success}>
        是
      </Txt>
      <RNode x={300} y={284} w={280} h={56} fill={tint} stroke={hue}>
        <Txt x={440} y={308} bold size={12.5} fill={DT.ink}>
          Q3：重排后还在吗？
        </Txt>
        <Txt x={440} y={328} size={10.5} fill={DT.ink3}>
          查打散 / 去重 / 业务规则
        </Txt>
      </RNode>

      {/* 否 → 重排误杀；是 → 展示问题 */}
      <path d="M300 312 L170 312 L170 376" fill="none" stroke={DT.danger} strokeWidth={DT.strokeWidth} />
      <Txt x={225} y={304} size={11} bold fill={DT.danger}>
        否
      </Txt>
      <path d="M166 370 L170 378 L174 370 Z" fill={DT.danger} />
      <RNode x={60} y={378} w={220} h={80} fill={DT.surface} stroke={DT.danger}>
        <Txt x={170} y={404} bold size={12.5} fill={DT.danger}>
          归因③重排误杀
        </Txt>
        <Txt x={170} y={428} size={10.5} fill={DT.ink2}>
          查打散窗口 / 去重键 /
        </Txt>
        <Txt x={170} y={446} size={10.5} fill={DT.ink2}>
          强插规则优先级
        </Txt>
      </RNode>

      <ArrowDown x={440} y1={340} y2={376} color={DT.success} />
      <Txt x={460} y={368} size={11} bold fill={DT.success}>
        是
      </Txt>
      <RNode x={330} y={378} w={220} h={80} fill={DT.surface} stroke={DT.warning}>
        <Txt x={440} y={404} bold size={12.5} fill={DT.warning}>
          归因④展示问题
        </Txt>
        <Txt x={440} y={428} size={10.5} fill={DT.ink2}>
          标题 / 封面 / 摘要
        </Txt>
        <Txt x={440} y={446} size={10.5} fill={DT.ink2}>
          导致用户不点（而非排序错）
        </Txt>
      </RNode>

      {/* 侧边原则 */}
      <RNode x={620} y={60} w={230} h={110} fill={DT.surface} dashed>
        <Txt x={735} y={88} bold size={12.5} fill={DT.ink}>
          基础设施要求
        </Txt>
        <Txt x={735} y={114} size={11.5} fill={DT.ink2}>
          每条样本保存中间产物：
        </Txt>
        <Txt x={735} y={136} size={11} fill={DT.ink3}>
          召回源 / 各阶段分数 / 重排动作
        </Txt>
        <Txt x={735} y={156} size={11} fill={DT.ink3}>
          否则归因只能靠猜
        </Txt>
      </RNode>

      <rect x={200} y={486} width={480} height={40} rx={DT.nodeRadius} fill={DT.surface} stroke={hue} strokeWidth={DT.strokeWidth} strokeDasharray={DT.dash} />
      <Txt x={440} y={511} bold fill={hue}>
        归因顺序铁律：先召回、后排序、再重排、最后展示
      </Txt>
    </svg>
  );
}
