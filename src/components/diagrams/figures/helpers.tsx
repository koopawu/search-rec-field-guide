// 图示共享绘制辅助（圆角节点 / 文字 / 箭头）
import type { ReactNode } from 'react';
import { DT } from '../tokens';

export function RNode({
  x,
  y,
  w,
  h,
  fill = DT.surface,
  stroke = DT.ink2,
  dashed = false,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  fill?: string;
  stroke?: string;
  dashed?: boolean;
  children?: ReactNode;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={DT.nodeRadius}
        fill={fill}
        stroke={stroke}
        strokeWidth={DT.strokeWidth}
        strokeDasharray={dashed ? DT.dash : undefined}
      />
      {children}
    </g>
  );
}

export function Txt({
  x,
  y,
  children,
  size = DT.fontSize,
  fill = DT.ink2,
  anchor = 'middle',
  mono = false,
  bold = false,
}: {
  x: number;
  y: number;
  children?: ReactNode;
  size?: number;
  fill?: string;
  anchor?: 'start' | 'middle' | 'end';
  mono?: boolean;
  bold?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fill={fill}
      textAnchor={anchor}
      fontFamily={mono ? '"JetBrains Mono", ui-monospace, monospace' : '"Noto Sans SC", sans-serif'}
      fontWeight={bold ? 700 : 400}
    >
      {children}
    </text>
  );
}

/** 向下箭头（竖直） */
export function ArrowDown({
  x,
  y1,
  y2,
  color = DT.ink2,
  dashed = false,
}: {
  x: number;
  y1: number;
  y2: number;
  color?: string;
  dashed?: boolean;
}) {
  return (
    <g stroke={color} strokeWidth={DT.strokeWidth} fill={color}>
      <line x1={x} y1={y1} x2={x} y2={y2 - 6} strokeDasharray={dashed ? DT.dash : undefined} />
      <path d={`M${x - 4} ${y2 - 7} L${x} ${y2} L${x + 4} ${y2 - 7} Z`} stroke="none" />
    </g>
  );
}

/** 横向箭头 */
export function ArrowRight({
  x1,
  x2,
  y,
  color = DT.ink2,
  dashed = false,
}: {
  x1: number;
  x2: number;
  y: number;
  color?: string;
  dashed?: boolean;
}) {
  return (
    <g stroke={color} strokeWidth={DT.strokeWidth} fill={color}>
      <line x1={x1} y1={y} x2={x2 - 6} y2={y} strokeDasharray={dashed ? DT.dash : undefined} />
      <path d={`M${x2 - 7} ${y - 4} L${x2} ${y} L${x2 - 7} ${y + 4} Z`} stroke="none" />
    </g>
  );
}

/** 向上箭头（竖直） */
export function ArrowUp({
  x,
  y1,
  y2,
  color = DT.ink2,
  dashed = false,
}: {
  x: number;
  y1: number;
  y2: number;
  color?: string;
  dashed?: boolean;
}) {
  return (
    <g stroke={color} strokeWidth={DT.strokeWidth} fill={color}>
      <line x1={x} y1={y1} x2={x} y2={y2 + 6} strokeDasharray={dashed ? DT.dash : undefined} />
      <path d={`M${x - 4} ${y2 + 7} L${x} ${y2} L${x + 4} ${y2 + 7} Z`} stroke="none" />
    </g>
  );
}

/** 向左箭头（横向） */
export function ArrowLeft({
  x1,
  x2,
  y,
  color = DT.ink2,
  dashed = false,
}: {
  x1: number;
  x2: number;
  y: number;
  color?: string;
  dashed?: boolean;
}) {
  return (
    <g stroke={color} strokeWidth={DT.strokeWidth} fill={color}>
      <line x1={x1} y1={y} x2={x2 + 6} y2={y} strokeDasharray={dashed ? DT.dash : undefined} />
      <path d={`M${x2 + 7} ${y - 4} L${x2} ${y} L${x2 + 7} ${y + 4} Z`} stroke="none" />
    </g>
  );
}
