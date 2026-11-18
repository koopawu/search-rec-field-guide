// ============================================================
// 内容聚合层：chapters + helpers + 篇章主题色覆盖
// 数据文件中的 themeColor 为高饱和色，一律以 CHAPTER_THEMES 为准（design.md §2.2）
// ============================================================

import type { ChapterSlug, LoadedChapter, Section } from './types';
import { chapterSearch } from './chapters/chapter-search';
import { chapterRec, recSections } from './chapters/chapter-rec';
import { chapterStrategy } from './chapters/chapter-strategy';
import { chapterMetrics, evalSections } from './chapters/chapter-metrics';
import { chapterLLM, llmSections } from './chapters/chapter-llm';
import { chapterSystem, engSections } from './chapters/chapter-system';

export * from './types';

/** 全站 6 篇章（按 order 排序）。
 *  chapter-rec/metrics/llm/system 的 chapter.sections 仅为 SectionMeta，
 *  完整小节由各自的 *Sections 导出数组给出，此处统一合并为 LoadedChapter。 */
export const chapters: LoadedChapter[] = [
  { ...chapterSearch, sections: chapterSearch.sections as Section[] },
  { ...chapterRec, sections: recSections },
  { ...chapterStrategy, sections: chapterStrategy.sections as Section[] },
  { ...chapterMetrics, sections: evalSections },
  { ...chapterLLM, sections: llmSections },
  { ...chapterSystem, sections: engSections },
].sort((a, b) => a.order - b.order);

/** 篇章主题色（低饱和大地色系，design.md §2.2），覆盖数据文件中的 themeColor */
export interface ChapterTheme {
  /** 主色（描边、标签文字、图示强调） */
  hue: string;
  /** 10% 浅底（标签底、行 hover 底） */
  tint: string;
  /** 中文命名 */
  name: string;
}

export const CHAPTER_THEMES: Record<ChapterSlug, ChapterTheme> = {
  search: { hue: '#A9713A', tint: '#F5EBDD', name: '赭金' },
  recommendation: { hue: '#B0503C', tint: '#F6E4E0', name: '陶红' },
  strategy: { hue: '#B08A2E', tint: '#F5EDDA', name: '琥珀' },
  evaluation: { hue: '#71803F', tint: '#ECEFE0', name: '橄榄' },
  'llm-frontier': { hue: '#4E7A72', tint: '#E2EDEA', name: '青瓷' },
  'engineering-org': { hue: '#6E6257', tint: '#ECE7E1', name: '岩褐' },
};

/** 取篇章主题色（hue/tint） */
export function getChapterTheme(slug: ChapterSlug): ChapterTheme {
  return CHAPTER_THEMES[slug];
}

const chapterBySlug = new Map<ChapterSlug, LoadedChapter>(chapters.map((c) => [c.slug, c]));

interface SectionIndexEntry {
  section: Section;
  chapter: LoadedChapter;
  /** 全站小节序号（按篇章顺序 + 篇内顺序） */
  globalIndex: number;
  /** 篇内序号（1 起），用于显示 "1.4" 等编号 */
  indexInChapter: number;
}

const sectionIndex = new Map<string, SectionIndexEntry>();
export const allSections: Section[] = [];
chapters.forEach((chapter) => {
  chapter.sections.forEach((section, i) => {
    sectionIndex.set(section.sectionId, {
      section,
      chapter,
      globalIndex: allSections.length,
      indexInChapter: i + 1,
    });
    allSections.push(section);
  });
});

/** 按 slug 取篇章 */
export function getChapter(slug: string | undefined): LoadedChapter | undefined {
  return chapterBySlug.get(slug as ChapterSlug);
}

/** 按 sectionId 取小节 */
export function getSection(sectionId: string | undefined): Section | undefined {
  return sectionId ? sectionIndex.get(sectionId)?.section : undefined;
}

/** 取小节所属篇章 */
export function getSectionChapter(sectionId: string | undefined): LoadedChapter | undefined {
  return sectionId ? sectionIndex.get(sectionId)?.chapter : undefined;
}

/** 小节的展示编号，如 '1.4'（篇章序.篇内序） */
export function getSectionNo(sectionId: string | undefined): string {
  const entry = sectionId ? sectionIndex.get(sectionId) : undefined;
  return entry ? `${entry.chapter.order}.${entry.indexInChapter}` : '';
}

/** 上一节 / 下一节（跨篇章衔接：末节下一节指向下一篇章第一节） */
export function getPrevNext(sectionId: string | undefined): {
  prev?: Section;
  next?: Section;
} {
  const entry = sectionId ? sectionIndex.get(sectionId) : undefined;
  if (!entry) return {};
  return {
    prev: allSections[entry.globalIndex - 1],
    next: allSections[entry.globalIndex + 1],
  };
}

/** 小节路由 */
export function sectionPath(section: Section): string {
  return `/chapters/${section.chapterSlug}/${section.sectionId}`;
}

/** 全站统计（首页数据带等） */
export const siteStats = {
  chapterCount: chapters.length,
  sectionCount: allSections.length,
  totalMinutes: allSections.reduce((sum, s) => sum + s.estimatedMinutes, 0),
  diagramCount: new Set(allSections.flatMap((s) => s.diagramsUsed)).size,
};
