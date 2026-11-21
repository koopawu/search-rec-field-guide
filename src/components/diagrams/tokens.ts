// ============================================================
// 全站 SVG 图示统一 token（design.md §7.5）
// 描边 ink-2 1.5px；虚线构造线 dasharray 5 5；节点圆角 8px
// ============================================================

export const DT = {
  ink: '#2C2620',
  ink2: '#57503F',
  ink3: '#8C8272',
  line: '#E4DACA',
  lineStrong: '#CFC2AD',
  surface: '#FFFDF9',
  surface2: '#F3EDE2',
  accent: '#B3512E',
  danger: '#A94438',
  success: '#5F7A4E',
  warning: '#B98A2F',
  strokeWidth: 1.5,
  dash: '5 5',
  nodeRadius: 8,
  /** 标注文字 Small Sans */
  fontSize: 13.5,
  /** 数值 Mono */
  monoSize: 13,
} as const;

/** 每个图示组件的通用 props */
export interface DiagramProps {
  /** 篇章强调色（hue），由渲染上下文传入 */
  hue?: string;
  /** 篇章浅底色（tint） */
  tint?: string;
  className?: string;
}
