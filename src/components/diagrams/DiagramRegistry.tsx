// ============================================================
// DiagramRegistry（design.md §7.5）
// diagram block 按 diagramId 查表渲染；未注册时降级为占位卡
// （虚线框 + 图示标题 + 「图示待补」）。
// 增量注册：后续代理在 ./figures/ 新增文件并在 ./registry.ts 聚合对象加条目即可。
// ============================================================

import type { ComponentType } from 'react';
import type { DiagramProps } from './tokens';
import { DT } from './tokens';
import { diagramRegistry } from './registry';

export type DiagramComponent = ComponentType<DiagramProps>;

/** 查询图示组件（供外部/测试使用） */
export function getDiagram(diagramId: string): DiagramComponent | undefined {
  return diagramRegistry[diagramId];
}

/** 已注册图示 id 列表 */
export function registeredDiagramIds(): string[] {
  return Object.keys(diagramRegistry);
}

export interface DiagramFigureProps extends DiagramProps {
  diagramId: string;
  /** 图题（「图 N ·」前缀由阅读页拼接）；不提供时不渲染图题 */
  caption?: string;
  altText?: string;
}

/** 按 diagramId 查表渲染图示；未注册时渲染降级占位卡 */
export function DiagramFigure({
  diagramId,
  caption,
  altText,
  hue = DT.accent,
  tint = '#F6E7DC',
  className,
}: DiagramFigureProps) {
  const Component = diagramRegistry[diagramId];
  return (
    <figure className={className}>
      {Component ? (
        <Component hue={hue} tint={tint} />
      ) : (
        <DiagramPlaceholder diagramId={diagramId} title={caption ?? diagramId} hue={hue} />
      )}
      {caption && (
        <figcaption className="mt-3 text-center text-small text-ink-3">{caption}</figcaption>
      )}
      {altText && <span className="sr-only">{altText}</span>}
    </figure>
  );
}

/** 降级占位卡：虚线框 + 图示标题 + 「图示待补」 */
function DiagramPlaceholder({
  diagramId,
  title,
  hue,
}: {
  diagramId: string;
  title: string;
  hue: string;
}) {
  return (
    <div
      className="flex min-h-[180px] flex-col items-center justify-center gap-2 rounded-figure border-[1.5px] border-dashed border-line-strong bg-surface-2 p-8 text-center"
      role="img"
      aria-label={`${title}（图示待补）`}
    >
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect x="5" y="7" width="30" height="20" rx="4" stroke={DT.ink3} strokeWidth="1.5" strokeDasharray="5 5" />
        <path d="M12 27 L20 33 L28 27" stroke={hue} strokeWidth="1.5" fill="none" />
      </svg>
      <p className="text-body font-medium text-ink-2">{title}</p>
      <p className="font-mono text-small text-ink-3">{diagramId}</p>
      <p className="text-small text-ink-3">图示待补</p>
    </div>
  );
}

export default DiagramFigure;
