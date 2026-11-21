// fig-ab-layering：AB 实验分层框架（Google 重叠实验）
// site_ia.md §4.4：左侧总流量域（domain）竖切；中间水平层：召回层/粗排层/精排层/UI 层，
// 每层内实验槽位互斥、层间正交（一个请求穿过每层各一个实验）；右侧「发布层」；
// 标注分流公式 mod = f(cookie, layer)

import { DT, type DiagramProps } from '../tokens';
import { RNode, Txt, ArrowRight } from './helpers';

const LAYERS = [
  { name: '召回层', exps: ['实验 A', '实验 B', '对照'] },
  { name: '粗排层', exps: ['实验 C', '对照'] },
  { name: '精排层', exps: ['实验 D', '实验 E', '对照'] },
  { name: 'UI 层', exps: ['实验 F', '对照'] },
];

export default function FigAbLayering({ hue = '#71803F', tint = '#ECEFE0' }: DiagramProps) {
  const x0 = 190;
  const layerH = 76;
  const layerGap = 22;
  const y0 = 60;
  const layerW = 470;

  // 请求路径穿过的槽位（每层一个）
  const pathSlot = [1, 0, 2, 0];

  return (
    <svg viewBox="0 0 880 500" width="100%" role="img" aria-label="AB 实验分层框架图">
      {/* 左：总流量域 */}
      <RNode x={30} y={y0} w={130} h={4 * layerH + 3 * layerGap} fill={DT.surface2}>
        <Txt x={95} y={y0 + 60} bold fill={DT.ink} size={12.5}>
          总流量域
        </Txt>
        <Txt x={95} y={y0 + 84} size={11} fill={DT.ink3}>
          domain
        </Txt>
        <Txt x={95} y={y0 + 120} mono size={11} fill={hue}>
          mod = f(cookie,
        </Txt>
        <Txt x={95} y={y0 + 140} mono size={11} fill={hue}>
          layer)
        </Txt>
        <Txt x={95} y={y0 + 180} size={10.5} fill={DT.ink3}>
          每层独立哈希
        </Txt>
        <Txt x={95} y={y0 + 198} size={10.5} fill={DT.ink3}>
          → 层间正交
        </Txt>
      </RNode>
      <ArrowRight x1={160} x2={x0} y={y0 + 190} />

      {/* 水平层 */}
      {LAYERS.map((l, i) => {
        const y = y0 + i * (layerH + layerGap);
        const slotW = (layerW - 20 - (l.exps.length - 1) * 10) / l.exps.length;
        return (
          <g key={l.name}>
            <RNode x={x0} y={y} w={layerW} h={layerH} fill={i % 2 === 0 ? tint : DT.surface}>
              <Txt x={x0 + 12} y={y + 20} anchor="start" bold size={11.5} fill={DT.ink}>
                {l.name}
              </Txt>
              <Txt x={x0 + 12} y={y + 38} anchor="start" size={9.5} fill={DT.ink3}>
                同层互斥
              </Txt>
              {l.exps.map((e, j) => {
                const x = x0 + 88 + j * (slotW * 0.62 + 10);
                const onPath = pathSlot[i] === j;
                return (
                  <g key={e}>
                    <rect x={x} y={y + 12} width={slotW * 0.6} height={layerH - 24} rx={6} fill={onPath ? tint : DT.surface2} stroke={onPath ? hue : DT.ink3} strokeWidth={onPath ? 2 : 1} />
                    <Txt x={x + slotW * 0.3} y={y + layerH / 2 + 4} size={10.5} fill={onPath ? hue : DT.ink2} bold={onPath}>
                      {e}
                    </Txt>
                  </g>
                );
              })}
            </RNode>
          </g>
        );
      })}

      {/* 一条请求穿过每层一个实验 */}
      {pathSlot.map((slot, i) => {
        const y = y0 + i * (layerH + layerGap);
        const l = LAYERS[i];
        const slotW = (layerW - 20 - (l.exps.length - 1) * 10) / l.exps.length;
        const cx = x0 + 88 + slot * (slotW * 0.62 + 10) + slotW * 0.3;
        const nextI = i + 1;
        return (
          <g key={i}>
            {nextI < LAYERS.length && (
              <path
                d={`M${cx} ${y + layerH} L${x0 + 88 + pathSlot[nextI] * (((layerW - 20 - (LAYERS[nextI].exps.length - 1) * 10) / LAYERS[nextI].exps.length) * 0.62 + 10) + ((layerW - 20 - (LAYERS[nextI].exps.length - 1) * 10) / LAYERS[nextI].exps.length) * 0.3} ${y + layerH + layerGap}`}
                fill="none"
                stroke={hue}
                strokeWidth={2}
                strokeDasharray={DT.dash}
              />
            )}
          </g>
        );
      })}
      <Txt x={x0 + layerW / 2} y={y0 - 12} size={11.5} fill={hue}>
        虚线 = 一个请求：每层恰好落进一个实验槽位
      </Txt>

      {/* 右：发布层 */}
      <ArrowRight x1={x0 + layerW} x2={x0 + layerW + 34} y={y0 + 190} />
      <RNode x={x0 + layerW + 34} y={y0 + 120} w={130} h={140} fill={DT.surface} stroke={DT.success}>
        <Txt x={x0 + layerW + 99} y={y0 + 150} bold size={12} fill={DT.success}>
          发布层
        </Txt>
        <Txt x={x0 + layerW + 99} y={y0 + 176} size={10.5} fill={DT.ink2}>
          已验证策略
        </Txt>
        <Txt x={x0 + layerW + 99} y={y0 + 194} size={10.5} fill={DT.ink2}>
          固化默认参数
        </Txt>
        <Txt x={x0 + layerW + 99} y={y0 + 224} size={10} fill={DT.ink3}>
          100% 流量生效
        </Txt>
      </RNode>

      <Txt x={440} y={y0 + 4 * layerH + 3 * layerGap + 34} size={12} fill={DT.ink2}>
        同层互斥保证不串扰，层间正交保证可叠加 → 一套流量同时跑成百上千个实验
      </Txt>
    </svg>
  );
}
