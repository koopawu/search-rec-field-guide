// ============================================================
// 图标映射：内容数据 icon key → 线性图标（design.md §7.4）
// 风格对齐 Lucide，stroke 1.5px
// ============================================================

import {
  Search,
  List,
  Scale,
  Split,
  Sparkles,
  Cog,
  Waypoints,
  Clock,
  LifeBuoy,
  Columns2,
  Database,
  Warehouse,
  Circle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  search: Search, // 放大镜
  feed: List, // 信息流列表
  'dashboard-scale': Scale, // 天平仪表盘
  'ab-test': Split, // A/B 分岔
  spark: Sparkles, // 星火
  pipeline: Cog, // 齿轮流水线
  bridge: Waypoints, // 桥接节点
  clock: Clock, // 时钟
  fallback: LifeBuoy, // 降落伞/降级
  parallel: Columns2, // 并行双轨
  storage: Database, // 数据库
  warehouse: Warehouse, // 仓库/货仓
};

export interface ChapterIconProps {
  icon: string;
  size?: number;
  color?: string;
  className?: string;
}

export default function ChapterIcon({ icon, size = 20, color, className }: ChapterIconProps) {
  const Icon = ICON_MAP[icon] ?? Circle;
  return (
    <Icon
      size={size}
      strokeWidth={1.5}
      color={color}
      className={className}
      aria-hidden="true"
    />
  );
}
