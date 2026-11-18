// ============================================================
// 搜索与推荐算法知识库 · 内容 Schema v1.0
// 依据：/mnt/agents/output/research/site_ia.md 第 3 节
// 注意：按实际内容数据形状定义——
//  1. Chapter.sections 直接内嵌完整 Section[]（含 blocks）；
//  2. 部分 block 的 heading 写在 payload 内（chapter-llm/chapter-metrics），
//     部分写在 block 层（chapter-search），两层均为可选字段。
// ============================================================

// ---------- 基础枚举与通用类型 ----------

/** 篇章 slug，全局固定 6 个 */
export type ChapterSlug =
  | 'search' // 篇章一：搜索篇
  | 'recommendation' // 篇章二：推荐篇
  | 'strategy' // 篇章三：分发策略实战篇
  | 'evaluation' // 篇章四：评估与实验篇
  | 'llm-frontier' // 篇章五：LLM 时代前沿篇
  | 'engineering-org'; // 篇章六：工程与协作篇

/** 难度分级 */
export type Difficulty = 'foundational' | 'intermediate' | 'advanced';

/** 来源引用：简报代号 + 简报内章节 + 可选外部 URL */
export interface SourceRef {
  /** 简报代号，如 'D1' ~ 'D8' */
  briefId: 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6' | 'D7' | 'D8';
  /** 简报内章节定位，如 '算法详解§3 Query 纠错' */
  briefSection?: string;
  /** 外部原始来源标题 */
  externalTitle?: string;
  /** 外部原始来源 URL */
  externalUrl?: string;
}

/** 行内富文本片段 */
export interface InlineSpan {
  text: string;
  marks?: Array<'bold' | 'code' | 'term' | 'math' | 'highlight'>;
}

/** 富文本 = 片段数组 */
export type RichText = InlineSpan[];

// ---------- 站点与导航 ----------

export interface Site {
  siteId: string; // 'searchrec-kb'
  title: string;
  description: string;
  audience: string;
  locale: 'zh-CN';
  version: string; // 内容版本，如 '2026.09'
  chapters: Chapter[];
  homePage: HomePage;
}

export interface Chapter {
  chapterId: string; // 'ch-search'
  slug: ChapterSlug;
  order: number; // 1-6
  title: string; // '搜索篇'
  subtitle: string; // 一句话篇章定位
  icon: string; // 图标 key，见 ChapterIcon
  themeColor: string; // 数据内为高饱和色，渲染层一律改用 CHAPTER_THEMES
  /** 篇章页渲染顺序 = 数组顺序。部分数据文件只放 SectionMeta，
   *  完整 Section 由同名 *Sections 导出数组给出，见 content/index.ts 的合并逻辑 */
  sections: SectionMeta[];
  learningGoals: string[];
}

/** 加载完成的篇章：sections 保证为完整 Section[]（含 blocks） */
export type LoadedChapter = Omit<Chapter, 'sections'> & { sections: Section[] };

export interface SectionMeta {
  sectionId: string; // 'search-01'
  title: string;
  tagline: string; // 一句话定位
  difficulty: Difficulty;
  estimatedMinutes: number;
  keywords: string[];
}

// ---------- 小节正文 ----------

export interface Section extends SectionMeta {
  chapterSlug: ChapterSlug;
  summary: RichText;
  blocks: ContentBlock[];
  keyTakeaways: string[];
  relatedSections: string[];
  diagramsUsed: string[];
  updatedAt: string; // ISO date
}

// ---------- 内容块：可判别联合 ----------

export type ContentBlock =
  | ParagraphBlock
  | KeypointsBlock
  | TableBlock
  | StepsBlock
  | FormulaBlock
  | DiagramBlock
  | CaseBlock
  | QuoteBlock
  | ListBlock;

interface BlockBase {
  /** 块内唯一 id，格式 '{sectionId}-b{序号}' */
  blockId: string;
  /** 可选小标题（部分数据文件写在 block 层） */
  heading?: string;
}

/** 段落 */
export interface ParagraphBlock extends BlockBase {
  type: 'paragraph';
  payload: {
    heading?: string;
    content: RichText;
    variant?: 'normal' | 'lead' | 'note' | 'warning';
    sourceRefs?: SourceRef[];
  };
}

/** 要点卡片组 */
export interface KeypointsBlock extends BlockBase {
  type: 'keypoints';
  payload: {
    heading?: string;
    layout?: 'grid-2' | 'grid-3' | 'list';
    /** 实际数据中 keypoints 也在 payload 级挂 sourceRefs */
    sourceRefs?: SourceRef[];
    items: Array<{
      title: string;
      description: RichText;
      icon?: string;
      sourceRefs?: SourceRef[];
    }>;
  };
}

/** 对比表格 */
export interface TableBlock extends BlockBase {
  type: 'table';
  payload: {
    heading?: string;
    caption?: string;
    columns: Array<{ key: string; title: string; align?: 'left' | 'center' | 'right' }>;
    rows: Array<Record<string, string>>;
    highlightRowKeys?: string[];
    sourceRefs?: SourceRef[];
  };
}

/** 流程步骤 */
export interface StepsBlock extends BlockBase {
  type: 'steps';
  payload: {
    heading?: string;
    orientation?: 'vertical' | 'horizontal';
    steps: Array<{
      title: string;
      description: RichText;
      badge?: string;
    }>;
    cyclic?: boolean;
    sourceRefs?: SourceRef[];
  };
}

/** 公式示意（纯文本，不渲染 LaTeX） */
export interface FormulaBlock extends BlockBase {
  type: 'formula';
  payload: {
    heading?: string;
    name: string;
    expression: string;
    symbolNotes: Array<{
      symbol: string;
      meaning: string;
    }>;
    intuition: RichText;
    sourceRefs?: SourceRef[];
  };
}

/** 图示：按 diagramId 从 DiagramRegistry 查表渲染 */
export interface DiagramBlock extends BlockBase {
  type: 'diagram';
  payload: {
    diagramId: string;
    caption: string;
    altText: string;
    propsOverride?: Record<string, unknown>;
  };
}

/** 大厂案例卡片 */
export interface CaseBlock extends BlockBase {
  type: 'case';
  payload: {
    heading?: string;
    company: string;
    companyLogoKey?: string;
    scenario: string;
    background: RichText;
    approach: RichText;
    results: Array<{
      metric: string;
      value: string;
    }>;
    lesson: string;
    sourceRefs: SourceRef[];
  };
}

/** 金句/原则 */
export interface QuoteBlock extends BlockBase {
  type: 'quote';
  payload: {
    heading?: string;
    text: string;
    attribution?: string;
    variant?: 'principle' | 'warning' | 'insight';
    sourceRefs?: SourceRef[];
  };
}

/** 列表 */
export interface ListBlock extends BlockBase {
  type: 'list';
  payload: {
    heading?: string;
    ordered?: boolean;
    items: RichText[];
    variant?: 'normal' | 'checklist' | 'myths';
    sourceRefs?: SourceRef[];
  };
}

// ---------- 首页与导航 ----------

export interface HomePage {
  hero: {
    title: string;
    subtitle: string;
    audienceTagline: string;
  };
  knowledgeMap: KnowledgeMapNode[];
  learningPaths: LearningPath[];
  featuredSections: string[];
  glossaryTeaser?: Array<{ term: string; oneLiner: string; sectionId: string }>;
}

/** 知识地图节点 */
export interface KnowledgeMapNode {
  nodeId: string;
  nodeType: 'chapter' | 'section';
  title: string;
  parentId?: string;
  positionHint?: { x: number; y: number };
  dependsOn?: string[];
}

/** 学习路径 */
export interface LearningPath {
  pathId: string; // 'path-7day'
  title: string;
  description: string;
  targetAudience: string;
  days: Array<{
    day: number;
    theme: string;
    sectionIds: string[];
    checkpoint: string;
  }>;
}

// ---------- 构建期校验辅助类型 ----------

export interface ContentManifest {
  version: string;
  generatedAt: string;
  sections: Array<{
    sectionId: string;
    chapterSlug: ChapterSlug;
    route: string;
    blockCount: number;
    diagramIds: string[];
  }>;
  diagrams: string[];
}

/** 取 block 的小标题（兼容 heading 写在 block 层与 payload 层两种数据形状） */
export function getBlockHeading(block: ContentBlock): string | undefined {
  return block.heading ?? (block.payload as { heading?: string }).heading;
}
