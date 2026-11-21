// ============================================================
// 图示库画廊数据（design/diagrams.md §S2/S3）
// 动态聚合：diagramRegistry × 内容数据（每个 diagramId 出现于哪些小节、
// caption/altText），分类映射以 site_ia.md §4 / diagrams.md §S2 为准。
// ============================================================

import {
  allSections,
  getSectionNo,
  sectionPath,
  getChapterTheme,
} from '@/content';
import { diagramRegistry } from '../registry';

export type GalleryCategoryId = 'arch' | 'model' | 'mech' | 'eval' | 'flow';

export interface GalleryCategory {
  id: GalleryCategoryId;
  label: string;
  ids: string[];
}

/** 分类映射（diagrams.md §S2，以 site_ia.md §4 为准） */
export const GALLERY_CATEGORIES: GalleryCategory[] = [
  {
    id: 'arch',
    label: '架构与漏斗',
    ids: [
      'fig-search-funnel',
      'fig-rec-funnel',
      'fig-qp-pipeline',
      'fig-three-layer-architecture',
      'fig-data-decision-loop',
      'fig-unified-generative-distribution',
      'fig-recall-fusion',
      'fig-hybrid-retrieval',
      'fig-latency-budget',
    ],
  },
  {
    id: 'model',
    label: '模型结构',
    ids: [
      'fig-twin-tower',
      'fig-din-attention',
      'fig-esmm-ctr-cvr',
      'fig-mmoe-ple',
      'fig-semantic-id-rqvae',
      'fig-cf-family-tree',
      'fig-sequence-recall-evolution',
      'fig-multi-interest',
      'fig-graph-embedding',
      'fig-rerank-context',
      'fig-index-build',
    ],
  },
  {
    id: 'mech',
    label: '机制与策略',
    ids: [
      'fig-coldstart-ladder',
      'fig-bandit-ee',
      'fig-traffic-regulation-ladder',
      'fig-ecpm-blending',
      'fig-three-party-balance',
      'fig-diversity-window',
      'fig-gini-curve',
      'fig-mmr-dpp',
      'fig-intent-routing',
      'fig-noisy-channel',
    ],
  },
  {
    id: 'eval',
    label: '评估与实验',
    ids: [
      'fig-metrics-pyramid',
      'fig-ab-layering',
      'fig-switchback',
      'fig-offline-online-gap',
      'fig-holdout-reverse',
      'fig-badcase-attribution',
      'fig-relevance-vs-ctr',
      'fig-ann-tradeoff',
    ],
  },
  {
    id: 'flow',
    label: '流程与演进',
    ids: [
      'fig-ranking-evolution-timeline',
      'fig-rag-architecture',
      'fig-rag-evolution',
      'fig-deep-research-loop',
      'fig-generative-vs-cascade',
      'fig-hnsw-layers',
      'fig-inverted-index',
      'fig-model-update-cadence',
      'fig-rec-scaling-law',
      'fig-inference-cost-toolbox',
      'fig-pm-capability-map',
      'fig-team-interface',
    ],
  },
];

const categoryOf = new Map<string, GalleryCategory>();
GALLERY_CATEGORIES.forEach((c) => c.ids.forEach((id) => categoryOf.set(id, c)));

/** 全站核心图（design.md §7.5） */
export const CORE_DIAGRAM_IDS: ReadonlySet<string> = new Set([
  'fig-rec-funnel',
  'fig-twin-tower',
  'fig-coldstart-ladder',
  'fig-rag-architecture',
  'fig-generative-vs-cascade',
  'fig-three-layer-architecture',
]);

export interface GallerySectionRef {
  sectionId: string;
  /** 展示编号，如 '1.4' */
  no: string;
  title: string;
  path: string;
}

export interface GalleryItem {
  diagramId: string;
  /** 图题（取 caption 首个「：」前的部分） */
  title: string;
  caption: string;
  altText: string;
  category: GalleryCategoryId;
  categoryLabel: string;
  isCore: boolean;
  /** 出现于哪些小节（按全站顺序） */
  sections: GallerySectionRef[];
  /** 首个出现篇章的主题色，用于 SVG 着色 */
  hue: string;
  tint: string;
}

/** 从 registry + 内容数据动态生成画廊条目（不手写死） */
export function buildGalleryItems(): GalleryItem[] {
  const byId = new Map<string, GalleryItem>();

  for (const section of allSections) {
    for (const block of section.blocks) {
      if (block.type !== 'diagram') continue;
      const { diagramId, caption, altText } = block.payload;
      let item = byId.get(diagramId);
      if (!item) {
        const cat = categoryOf.get(diagramId);
        const theme = getChapterTheme(section.chapterSlug);
        item = {
          diagramId,
          title: caption.split('：')[0]?.trim() || diagramId,
          caption,
          altText,
          category: cat?.id ?? 'arch',
          categoryLabel: cat?.label ?? '其他',
          isCore: CORE_DIAGRAM_IDS.has(diagramId),
          sections: [],
          hue: theme.hue,
          tint: theme.tint,
        };
        byId.set(diagramId, item);
      }
      if (!item.sections.some((s) => s.sectionId === section.sectionId)) {
        item.sections.push({
          sectionId: section.sectionId,
          no: getSectionNo(section.sectionId),
          title: section.title,
          path: sectionPath(section),
        });
      }
    }
  }

  // 输出顺序：按分类定义顺序；只保留已注册进 registry 的图示
  const ordered: GalleryItem[] = [];
  for (const cat of GALLERY_CATEGORIES) {
    for (const id of cat.ids) {
      const item = byId.get(id);
      if (item && diagramRegistry[id]) ordered.push(item);
      byId.delete(id);
    }
  }
  // 兜底：内容引用了但未进分类映射的（不应发生，防御性处理）
  for (const item of byId.values()) {
    if (diagramRegistry[item.diagramId]) ordered.push(item);
  }
  return ordered;
}
