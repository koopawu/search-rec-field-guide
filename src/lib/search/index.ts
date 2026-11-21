// ============================================================
// 全站客户端搜索：索引构建 + 打分检索（design/search.md §1）
// - 索引：每节一条主记录 + 每个 block 一条子记录 + 图示记录 + 篇章记录
// - 匹配：query 按字符 bigram + 全文包含打分
// - 权重：title ×5、keywords ×4、tagline ×3、summary ×2、block 文本 ×1
// - 纯客户端、无第三方搜索库
// ============================================================

import type {
  ChapterSlug,
  ContentBlock,
  Difficulty,
  LoadedChapter,
  RichText,
  Section,
} from '@/content';
import { allSections, chapters, getSectionNo, sectionPath } from '@/content';

// ---------- 文档类型 ----------

export type ResultKind = 'section' | 'block' | 'diagram' | 'chapter';

export const RESULT_KIND_LABELS: Record<ResultKind, string> = {
  section: '小节',
  block: '正文段落',
  diagram: '图示',
  chapter: '篇章',
};

export interface SectionDoc {
  kind: 'section';
  sectionId: string;
  title: string;
  tagline: string;
  summary: string;
  keywords: string[];
  chapterSlug: ChapterSlug;
  difficulty: Difficulty;
  estimatedMinutes: number;
  /** 展示编号，如 '1.4' */
  no: string;
  path: string;
}

export interface BlockDoc {
  kind: 'block';
  blockId: string;
  heading: string;
  text: string;
  blockType: ContentBlock['type'];
  sectionId: string;
  chapterSlug: ChapterSlug;
  /** 命中后跳转路径（含 block 锚点） */
  path: string;
}

export interface DiagramDoc {
  kind: 'diagram';
  diagramId: string;
  caption: string;
  altText: string;
  blockId: string;
  sectionId: string;
  chapterSlug: ChapterSlug;
  path: string;
}

export interface ChapterDoc {
  kind: 'chapter';
  slug: ChapterSlug;
  title: string;
  subtitle: string;
  path: string;
}

export type SearchDoc = SectionDoc | BlockDoc | DiagramDoc | ChapterDoc;

export type SearchHit =
  | { kind: 'section'; score: number; doc: SectionDoc }
  | { kind: 'block'; score: number; doc: BlockDoc; snippet: string }
  | { kind: 'diagram'; score: number; doc: DiagramDoc }
  | { kind: 'chapter'; score: number; doc: ChapterDoc };

// ---------- 纯文本提取 ----------

export function richTextToPlain(rt: RichText | undefined): string {
  return rt ? rt.map((s) => s.text).join('') : '';
}

/** 从内容块提取可检索纯文本 */
function blockPlainText(block: ContentBlock): string {
  switch (block.type) {
    case 'paragraph':
      return richTextToPlain(block.payload.content);
    case 'keypoints':
      return block.payload.items
        .map((it) => `${it.title} ${richTextToPlain(it.description)}`)
        .join(' ');
    case 'table': {
      const cols = block.payload.columns.map((c) => c.title).join(' ');
      const rows = block.payload.rows.map((r) => Object.values(r).join(' ')).join(' ');
      return `${block.payload.caption ?? ''} ${cols} ${rows}`;
    }
    case 'steps':
      return block.payload.steps
        .map((s) => `${s.title} ${s.badge ?? ''} ${richTextToPlain(s.description)}`)
        .join(' ');
    case 'formula': {
      const symbols = block.payload.symbolNotes
        .map((s) => `${s.symbol} ${s.meaning}`)
        .join(' ');
      return `${block.payload.name} ${block.payload.expression} ${symbols} ${richTextToPlain(
        block.payload.intuition,
      )}`;
    }
    case 'diagram':
      return `${block.payload.diagramId} ${block.payload.caption} ${block.payload.altText}`;
    case 'case': {
      const results = block.payload.results.map((r) => `${r.metric} ${r.value}`).join(' ');
      return `${block.payload.company} ${block.payload.scenario} ${richTextToPlain(
        block.payload.background,
      )} ${richTextToPlain(block.payload.approach)} ${results} ${block.payload.lesson}`;
    }
    case 'quote':
      return `${block.payload.text} ${block.payload.attribution ?? ''}`;
    case 'list':
      return block.payload.items.map((it) => richTextToPlain(it)).join(' ');
  }
}

/** 块标题：block 层 heading 优先，其次 payload 内 heading */
function blockHeading(block: ContentBlock): string {
  if (block.heading) return block.heading;
  if (block.type !== 'diagram' && 'heading' in block.payload && block.payload.heading) {
    return block.payload.heading;
  }
  return '';
}

// ---------- 索引构建 ----------

interface SearchIndex {
  sections: SectionDoc[];
  blocks: BlockDoc[];
  diagrams: DiagramDoc[];
  chapters: ChapterDoc[];
  /** sectionId → 小节主记录（供 block/diagram 命中反查） */
  sectionById: Map<string, SectionDoc>;
}

let cachedIndex: SearchIndex | null = null;

function buildIndex(): SearchIndex {
  const sections: SectionDoc[] = [];
  const blocks: BlockDoc[] = [];
  const diagrams: DiagramDoc[] = [];
  const chapterDocs: ChapterDoc[] = chapters.map((c: LoadedChapter) => ({
    kind: 'chapter',
    slug: c.slug,
    title: c.title,
    subtitle: c.subtitle,
    path: `/chapters/${c.slug}`,
  }));

  for (const section of allSections as Section[]) {
    const path = sectionPath(section);
    sections.push({
      kind: 'section',
      sectionId: section.sectionId,
      title: section.title,
      tagline: section.tagline,
      summary: richTextToPlain(section.summary),
      keywords: section.keywords,
      chapterSlug: section.chapterSlug,
      difficulty: section.difficulty,
      estimatedMinutes: section.estimatedMinutes,
      no: getSectionNo(section.sectionId),
      path,
    });
    for (const block of section.blocks) {
      if (block.type === 'diagram') {
        diagrams.push({
          kind: 'diagram',
          diagramId: block.payload.diagramId,
          caption: block.payload.caption,
          altText: block.payload.altText,
          blockId: block.blockId,
          sectionId: section.sectionId,
          chapterSlug: section.chapterSlug,
          path: `${path}#${block.blockId}`,
        });
        continue;
      }
      blocks.push({
        kind: 'block',
        blockId: block.blockId,
        heading: blockHeading(block),
        text: blockPlainText(block),
        blockType: block.type,
        sectionId: section.sectionId,
        chapterSlug: section.chapterSlug,
        path: `${path}#${block.blockId}`,
      });
    }
  }

  return {
    sections,
    blocks,
    diagrams,
    chapters: chapterDocs,
    sectionById: new Map(sections.map((s) => [s.sectionId, s])),
  };
}

export function getSearchIndex(): SearchIndex {
  if (!cachedIndex) cachedIndex = buildIndex();
  return cachedIndex;
}

// ---------- 分词与打分 ----------

export interface ParsedQuery {
  /** 归一化后的完整 query（小写、去空白） */
  full: string;
  /** 检索 gram：各 token 本身 + 其字符 bigram（单字 token 原样保留） */
  grams: string[];
  /** 用于覆盖率过滤的 bigram 集合（长度 ≥2 的 gram；单字 token 取原字） */
  bigrams: string[];
}

export function parseQuery(query: string): ParsedQuery {
  const full = query.trim().toLowerCase();
  const tokens = full.split(/[\s,，。、;；:：/\\?？!！()（）\[\]【】"'「」]+/).filter(Boolean);
  const grams = new Set<string>();
  const bigrams = new Set<string>();
  for (const tok of tokens) {
    grams.add(tok);
    if (tok.length >= 2) {
      for (let i = 0; i < tok.length - 1; i++) {
        grams.add(tok.slice(i, i + 2));
        bigrams.add(tok.slice(i, i + 2));
      }
    } else {
      bigrams.add(tok);
    }
  }
  return { full, grams: [...grams], bigrams: [...bigrams] };
}

/** 单字段打分：完整命中加权 + bigram 命中计数，最后乘字段权重。
 *  matched 非空时把命中的 bigram 记入集合（用于覆盖率过滤）；
 *  返回的 contained 表示该字段是否包含完整 query。 */
function fieldScore(
  text: string | undefined,
  parsed: ParsedQuery,
  weight: number,
  matched?: Set<string>,
): { score: number; contained: boolean } {
  if (!text) return { score: 0, contained: false };
  const t = text.toLowerCase();
  let s = 0;
  const contained = !!parsed.full && t.includes(parsed.full);
  if (contained) s += 8;
  for (const g of parsed.grams) {
    let idx = t.indexOf(g);
    let n = 0;
    while (idx !== -1 && n < 8) {
      n++;
      idx = t.indexOf(g, idx + g.length);
    }
    if (n > 0 && matched && parsed.bigrams.includes(g)) matched.add(g);
    s += n;
  }
  return { score: s * weight, contained };
}

/** 多字段打分汇总 + 覆盖率过滤：完整 query 命中任一字段，或 ≥60% bigram 被命中 */
function docScore(
  fields: Array<[string | undefined, number]>,
  parsed: ParsedQuery,
): number {
  const matched = new Set<string>();
  let score = 0;
  let contained = false;
  for (const [text, weight] of fields) {
    const r = fieldScore(text, parsed, weight, matched);
    score += r.score;
    contained = contained || r.contained;
  }
  if (score <= 0) return 0;
  if (!contained && parsed.bigrams.length > 1) {
    const coverage = matched.size / parsed.bigrams.length;
    if (coverage < 0.6) return 0;
  }
  return score;
}

// ---------- 片段截取 ----------

/** 在文本中定位首个命中位置（优先完整 query，其次最长 gram） */
function firstHitIndex(text: string, parsed: ParsedQuery): number {
  const t = text.toLowerCase();
  if (parsed.full) {
    const i = t.indexOf(parsed.full);
    if (i !== -1) return i;
  }
  let best = -1;
  const sorted = [...parsed.grams].sort((a, b) => b.length - a.length);
  for (const g of sorted) {
    const i = t.indexOf(g);
    if (i !== -1 && (best === -1 || i < best)) best = i;
  }
  return best;
}

/** 命中上下文 ±radius 字符，带省略号 */
export function makeSnippet(text: string, parsed: ParsedQuery, radius = 40): string {
  const i = firstHitIndex(text, parsed);
  if (i === -1) return text.slice(0, radius * 2);
  const start = Math.max(0, i - radius);
  const end = Math.min(text.length, i + radius);
  return `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`;
}

// ---------- 检索 ----------

export interface SearchOptions {
  /** 结果分组过滤（默认全部） */
  kinds?: ResultKind[];
  /** 篇章多选过滤（空 = 不限） */
  chapterSlugs?: ChapterSlug[];
  /** 难度过滤（null = 不限，仅作用于小节/正文/图示） */
  difficulty?: Difficulty | null;
  /** 每类结果上限（默认不限） */
  limitPerKind?: number;
}

export interface SearchOutcome {
  hits: SearchHit[];
  /** 各分组计数（在篇章/难度过滤之后、kind 过滤之前） */
  counts: Record<ResultKind, number>;
  total: number;
  elapsedMs: number;
  parsed: ParsedQuery;
}

function scoreSection(doc: SectionDoc, p: ParsedQuery): number {
  const kwText = doc.keywords.join(' ');
  return docScore(
    [
      [doc.title, 5],
      [kwText, 4],
      [doc.tagline, 3],
      [doc.summary, 2],
    ],
    p,
  );
}

export function searchAll(query: string, options: SearchOptions = {}): SearchOutcome {
  const started = performance.now();
  const parsed = parseQuery(query);
  const empty: SearchOutcome = {
    hits: [],
    counts: { section: 0, block: 0, diagram: 0, chapter: 0 },
    total: 0,
    elapsedMs: 0,
    parsed,
  };
  if (!parsed.full) return empty;

  const index = getSearchIndex();
  const chapterFilter = options.chapterSlugs?.length ? new Set(options.chapterSlugs) : null;
  const difficulty = options.difficulty ?? null;

  const inScope = (chapterSlug: ChapterSlug, sectionId?: string) => {
    if (chapterFilter && !chapterFilter.has(chapterSlug)) return false;
    if (difficulty && sectionId) {
      const sec = index.sectionById.get(sectionId);
      if (sec && sec.difficulty !== difficulty) return false;
    }
    return true;
  };

  const counts: Record<ResultKind, number> = { section: 0, block: 0, diagram: 0, chapter: 0 };
  const pools: Record<ResultKind, SearchHit[]> = { section: [], block: [], diagram: [], chapter: [] };

  for (const doc of index.sections) {
    if (!inScope(doc.chapterSlug, doc.sectionId)) continue;
    const score = scoreSection(doc, parsed);
    if (score > 0) pools.section.push({ kind: 'section', score, doc });
  }
  for (const doc of index.blocks) {
    if (!inScope(doc.chapterSlug, doc.sectionId)) continue;
    const score = docScore(
      [
        [doc.heading, 3],
        [doc.text, 1],
      ],
      parsed,
    );
    if (score >= 2) {
      pools.block.push({ kind: 'block', score, doc, snippet: makeSnippet(doc.text, parsed) });
    }
  }
  for (const doc of index.diagrams) {
    if (!inScope(doc.chapterSlug, doc.sectionId)) continue;
    const score = docScore(
      [
        [doc.diagramId, 4],
        [doc.caption, 3],
        [doc.altText, 1],
      ],
      parsed,
    );
    if (score > 0) pools.diagram.push({ kind: 'diagram', score, doc });
  }
  for (const doc of index.chapters) {
    if (chapterFilter && !chapterFilter.has(doc.slug)) continue;
    const score = docScore(
      [
        [doc.title, 5],
        [doc.subtitle, 3],
      ],
      parsed,
    );
    if (score > 0) pools.chapter.push({ kind: 'chapter', score, doc });
  }

  (Object.keys(pools) as ResultKind[]).forEach((kind) => {
    pools[kind].sort((a, b) => b.score - a.score);
    counts[kind] = pools[kind].length;
  });

  const wantedKinds = options.kinds?.length ? new Set(options.kinds) : null;
  let hits = (Object.keys(pools) as ResultKind[])
    .filter((kind) => !wantedKinds || wantedKinds.has(kind))
    .flatMap((kind) =>
      options.limitPerKind ? pools[kind].slice(0, options.limitPerKind) : pools[kind],
    );
  hits.sort((a, b) => b.score - a.score);

  return {
    hits,
    counts,
    total: counts.section + counts.block + counts.diagram + counts.chapter,
    elapsedMs: performance.now() - started,
    parsed,
  };
}

/** 命中所属小节的主记录（供正文/图示结果显示「小节 1.4 · 块标题」） */
export function getSectionDoc(sectionId: string): SectionDoc | undefined {
  return getSearchIndex().sectionById.get(sectionId);
}

// ---------- 最近搜索（localStorage，srkb: 前缀） ----------

const RECENT_KEY = 'srkb:recent-searches';
const RECENT_MAX = 8;

export function getRecentSearches(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const arr: unknown = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string): void {
  const q = query.trim();
  if (!q) return;
  try {
    const next = [q, ...getRecentSearches().filter((x) => x !== q)].slice(0, RECENT_MAX);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* 存储不可用时静默降级 */
  }
}

export function clearRecentSearches(): void {
  try {
    window.localStorage.removeItem(RECENT_KEY);
  } catch {
    /* ignore */
  }
}

/** 热门搜索词（search.md §S4） */
export const HOT_SEARCHES = ['双塔', '冷启动', 'AB 实验', 'RAG', 'eCPM', '信息茧房'];
