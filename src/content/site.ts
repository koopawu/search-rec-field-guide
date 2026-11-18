// ============================================================
// 站点元信息 + 首页数据（learningPaths / featuredSections / knowledgeMap）
// 依据：design/home.md §4 的 7 天进阶路径完整数据、§6 精选小节
// ============================================================

import type { HomePage, KnowledgeMapNode, LearningPath } from './types';
import { chapters } from './index';

export const SITE = {
  siteId: 'searchrec-kb',
  title: '搜推算法知识库',
  titleEn: 'SEARCH & REC FIELD GUIDE',
  fullTitle: '搜推算法知识库 · Search & Rec Field Guide',
  description:
    '6 大篇章 · 34 个小节 · 50 幅架构图示，系统讲透搜索引擎与推荐系统的算法原理、分发策略与 LLM 时代演进——写给正在向分发负责人进阶的你。',
  audience: '资深策略产品经理（搜索/推荐方向）',
  audienceTagline: '写给即将晋升分发负责人的策略产品经理',
  locale: 'zh-CN' as const,
  version: 'v2026.09',
  /** 内容来源说明（Footer 第四栏） */
  sources: [
    { briefId: 'D1', topic: '搜索 Query 理解' },
    { briefId: 'D2', topic: '搜索召回与排序' },
    { briefId: 'D3', topic: '推荐召回' },
    { briefId: 'D4', topic: '推荐排序与多目标' },
    { briefId: 'D5', topic: '分发策略实战' },
    { briefId: 'D6', topic: '评估体系与 AB 实验' },
    { briefId: 'D7', topic: 'LLM 时代前沿' },
    { briefId: 'D8', topic: '工程架构与协作' },
  ],
};

/** 7 天进阶学习路径（home.md §4 完整数据） */
export const path7day: LearningPath = {
  pathId: 'path-7day',
  title: '7 天进阶路径',
  description: '每天 30-50 分钟，从漏斗全局观到 LLM 前沿，读完 34 个小节。',
  targetAudience: '正在向分发负责人进阶的资深策略产品经理',
  days: [
    {
      day: 1,
      theme: '建立漏斗全局观',
      sectionIds: ['search-01', 'rec-01', 'eng-01', 'eng-02', 'eng-03'],
      checkpoint: '能徒手画出搜索/推荐漏斗并说清各层候选量级与延迟约束',
    },
    {
      day: 2,
      theme: '搜索链路全解',
      sectionIds: ['search-02', 'search-03', 'search-04', 'search-05', 'search-06'],
      checkpoint: '能拆解 QP 九模块，说出 BM25 与向量召回各自治什么 badcase',
    },
    {
      day: 3,
      theme: '推荐召回体系',
      sectionIds: ['rec-02', 'rec-03', 'rec-04', 'eng-04'],
      checkpoint: '能讲清双塔为何成为工业标准、负采样为什么是工程问题',
    },
    {
      day: 4,
      theme: '排序·多目标·重排',
      sectionIds: ['rec-05', 'rec-06', 'rec-07'],
      checkpoint: '能画出 LR→DIN→HSTU 演进线，解释融合公式权重为何是“货币政策”',
    },
    {
      day: 5,
      theme: '分发策略实战',
      sectionIds: [
        'strategy-01',
        'strategy-02',
        'strategy-03',
        'strategy-04',
        'strategy-05',
        'strategy-06',
      ],
      checkpoint: '能设计一套冷启动阶梯流量池与探索流量方案，说出五平台机制差异',
    },
    {
      day: 6,
      theme: '评估与实验',
      sectionIds: ['eval-01', 'eval-02', 'eval-03', 'eval-04', 'eval-05'],
      checkpoint: '能搭一套北极星+护栏指标体系，会算样本量、识别 SRM 与辛普森悖论',
    },
    {
      day: 7,
      theme: 'LLM 前沿与组织视角',
      sectionIds: ['llm-01', 'llm-02', 'llm-03', 'llm-04', 'llm-05', 'eng-05'],
      checkpoint: '能向管理层讲清混合检索、生成式推荐与成本账本，拿出一份评审 Checklist',
    },
  ],
};

/** 精选小节（编辑之选，home.md §6） */
export const featuredSections: string[] = [
  'rec-01',
  'strategy-01',
  'eval-03',
  'llm-03',
  'search-04',
  'eng-01',
];

/** 知识地图节点（篇章为大节点、小节为子节点） */
export const knowledgeMapNodes: KnowledgeMapNode[] = chapters.flatMap((chapter) => [
  {
    nodeId: chapter.slug,
    nodeType: 'chapter' as const,
    title: chapter.title,
  },
  ...chapter.sections.map((section) => ({
    nodeId: section.sectionId,
    nodeType: 'section' as const,
    title: section.title,
    parentId: chapter.slug,
  })),
]);

export const homePage: HomePage = {
  hero: {
    title: '搜索与推荐算法的\n策略产品实战手册',
    subtitle: SITE.description,
    audienceTagline: SITE.audienceTagline,
  },
  knowledgeMap: knowledgeMapNodes,
  learningPaths: [path7day],
  featuredSections,
};
