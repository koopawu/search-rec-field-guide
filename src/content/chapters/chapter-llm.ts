// ============================================================
// 篇章五：LLM 时代前沿篇（chapter-llm.ts）
// 素材来源：D7（LLM 时代前沿简报），少量引用 D1/D2/D3/D4
// 对应 IA：site_ia.md 第 2 节「篇章五：LLM 前沿篇」5 个小节（llm-01 ~ llm-05）
// 注：A/B 测试与业务数据均为各公司自报口径，横向比较需注意实验环境差异
// ============================================================

import type { Chapter, Section } from '../types';

export const chapterLLM: Chapter = {
  chapterId: 'ch-llm',
  slug: 'llm-frontier',
  order: 5,
  title: 'LLM 时代前沿篇',
  subtitle: '2024-2026 年搜索与推荐被同一股生成式力量重构并开始合流。本篇帮你建立「新范式的判断力」，而非追热点。',
  icon: 'spark',
  themeColor: '#8B5CF6',
  learningGoals: [
    '说清搜索范式三次跃迁，建立「先做 badcase 归因、再决定补哪一路」的混合检索决策链',
    '讲清 RAG 四代演进与 Deep Research「规划-检索-反思」循环，能评估 AI 搜索的三条商业化路径',
    '理解生成式推荐的范式转换（Semantic ID / HSTU / OneRec），识破级联架构的成本真相',
    '判断「端到端派」与「大模型增强漏斗派」的适用边界，把握搜推问一体化与 Agent 化分发趋势',
    '会算 token 账与 MFU 账，完成从「调特征权重」到「设计奖励信号」的能力迁移',
  ],
  sections: [
    {
      sectionId: 'llm-01',
      title: '语义搜索与混合检索：RAG 时代的检索基线',
      tagline: '纯向量检索不够用，混合检索（BM25 + 向量 + RRF）已是生产基线；重排是性价比之王。',
      difficulty: 'intermediate',
      estimatedMinutes: 11,
      keywords: ['混合检索', 'RRF', 'BM25', '向量检索', 'cross-encoder 重排', 'HyDE', 'RAG 基线'],
    },
    {
      sectionId: 'llm-02',
      title: 'RAG 与 Deep Research：从检索增强到搜索 Agent',
      tagline: 'RAG 把搜索技术栈重新发明了一遍；Deep Research 把搜索从「一次查询」变成「规划-检索-反思」的 Agent 循环。',
      difficulty: 'intermediate',
      estimatedMinutes: 12,
      keywords: ['RAG', 'Agentic RAG', 'Deep Research', '搜索 Agent', 'Perplexity', 'GEO'],
    },
    {
      sectionId: 'llm-03',
      title: '生成式推荐：Semantic ID、HSTU 与 OneRec',
      tagline: '推荐从「判别式漏斗」走向「端到端生成」，Meta 证明了 Scaling Law，快手完成了工业级替代。',
      difficulty: 'advanced',
      estimatedMinutes: 13,
      keywords: ['生成式推荐', 'Semantic ID', 'RQ-VAE', 'TIGER', 'HSTU', 'OneRec', 'Scaling Law'],
    },
    {
      sectionId: 'llm-04',
      title: '搜推问一体化与 Agent 化分发',
      tagline: '搜索、推荐、问答、广告正在统一为一个生成式分发模型；分发入口正从信息流转向个人 Agent。',
      difficulty: 'advanced',
      estimatedMinutes: 12,
      keywords: ['OneSearch', '搜推问一体化', '对话式推荐', 'Agent 分发', 'AIGC', 'MTGR'],
    },
    {
      sectionId: 'llm-05',
      title: '成本账本与策略 PM 的能力升级',
      tagline: '成本账本已翻转——端到端不是更贵的玩具而是更便宜的重构；策略 PM 的核心正从「调特征权重」迁移到「设计奖励信号」。',
      difficulty: 'advanced',
      estimatedMinutes: 12,
      keywords: ['推理成本', 'MFU', '分级路由', 'RL 偏好对齐', '能力模型', '组织冲击'],
    },
  ],
};

// ============================================================
// 小节正文
// ============================================================

export const llmSections: Section[] = [
  // ----------------------------------------------------------
  // llm-01 语义搜索与混合检索：RAG 时代的检索基线
  // ----------------------------------------------------------
  {
    sectionId: 'llm-01',
    chapterSlug: 'llm-frontier',
    title: '语义搜索与混合检索：RAG 时代的检索基线',
    tagline: '纯向量检索不够用，混合检索（BM25 + 向量 + RRF）已是生产基线；重排是性价比之王。',
    difficulty: 'intermediate',
    estimatedMinutes: 11,
    keywords: ['混合检索', 'RRF', 'BM25', '向量检索', 'cross-encoder 重排', 'HyDE', 'RAG 基线'],
    summary: [
      {
        text: '向量检索从可选增强变为标配基建，但工业界共识是纯向量不够用。本节给出「BM25 + 向量 + RRF + cross-encoder 重排」的生产标准配方、各组件治什么 badcase 的归因表，以及 LLM 时代查询改写的新武器库。',
      },
    ],
    blocks: [
      {
        blockId: 'llm-01-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: [
            { text: '搜索正在经历第三次范式跃迁：Traditional Web Search（关键词 + 链接列表）→ LLM-enhanced Search（语义检索 + 生成答案）→ Search Agents（自主规划多轮检索）。站在这个拐点上，一个反直觉的结论是：' },
            { text: '向量检索普及了，但「纯向量」从来不是生产答案', marks: ['bold'] },
            { text: '。2024-2026 年工业界反复验证的基线是混合检索——BM25 与向量各司其职，再用重排把精度补到及格线以上。' },
          ],
          sourceRefs: [
            { briefId: 'D2', briefSection: '发展与前沿§1' },
            { briefId: 'D7', briefSection: '核心概念框架§1' },
          ],
        },
      },
      {
        blockId: 'llm-01-b2',
        type: 'paragraph',
        payload: {
          content: [
            { text: '证据分两层。基准研究层：一项针对文本 + 表格文档的 RAG 基准（arXiv 2026）在全部指标上验证了「BM25 + dense + RRF 优于任一单路」，并直接给出工程建议——' },
            { text: '混合检索应作为任何 RAG 部署的最低可行基线（minimum viable baseline）', marks: ['bold'] },
            { text: '。工程实测层（掘金社区生产方案）的数字更具体：混合检索相比纯向量，Recall@5 提升 10.4 个百分点（68.2% → 78.6%）；拆开看，BM25 在精确匹配类 query 上的优势是压倒性的（82.7% vs 51.3%），向量检索在语义匹配类 query 上同样压倒性（78.6% vs 48.2%）——两路不是冗余，是互补。' },
          ],
          sourceRefs: [
            { briefId: 'D7', briefSection: '技术路线详解§1.1', externalTitle: 'From BM25 to Corrective RAG: Benchmarking Retrieval Strategies', externalUrl: 'https://arxiv.org/html/2604.01733v1' },
            { briefId: 'D7', briefSection: '技术路线详解§1.1', externalTitle: '混合检索与重排工程实践（掘金）', externalUrl: 'https://agent.csdn.net/6a6ddfc410ee7a33f2951875.html' },
          ],
        },
      },
      {
        blockId: 'llm-01-b3',
        type: 'diagram',
        payload: {
          diagramId: 'fig-hybrid-retrieval',
          caption: '混合检索三级漏斗：双路召回 → RRF 融合 → cross-encoder 精排',
          altText: 'BM25 倒排路与向量 ANN 路并行，各召回 50-100 篇；汇入 RRF 融合节点（score = 1/(rank+k)）取 Top-20；再经 cross-encoder 精排取 Top-5~8 输出给 LLM；各路标注所治 badcase 类型（精确匹配失败 / 语义漂移）与延迟预算。',
        },
      },
      {
        blockId: 'llm-01-b4',
        type: 'paragraph',
        payload: {
          content: [
            { text: '对策略 PM 而言，比配方更重要的是' },
            { text: '先归因、后上技术', marks: ['bold'] },
            { text: '的决策顺序。BM25 与向量检索解决的是不同类型的 badcase：前者治「精确匹配失败」（订单号、版本号、专有名词、型号代码——这些词向量空间里彼此很近，向量路天然吃亏），后者治「语义漂移」（用户说的和文档写的不是一套词）。检索侧的典型 badcase 分布是：精确匹配失败 30-40%、语义漂移 20-30%、分块不当 20-30%、语料质量 10-20%。把线上 badcase 按这四类抽 200-500 条人工归因，哪类占比高就先补哪一路——这套方法论可以直接迁移到推荐侧的 badcase 分析。' },
          ],
          sourceRefs: [
            { briefId: 'D7', briefSection: '对策略产品的启示§2' },
            { briefId: 'D7', briefSection: '技术路线详解§1.1' },
          ],
        },
      },
      {
        blockId: 'llm-01-b5',
        type: 'keypoints',
        payload: {
          layout: 'grid-2',
          heading: '检索 badcase 归因四分法与对症组件',
          items: [
            {
              title: '精确匹配失败（30-40%）→ 补 BM25 / 倒排',
              description: [{ text: '订单号、版本号、型号、专有名词类 query，向量检索因「相似词挤在一起」反而失效（精确匹配 51.3% vs BM25 的 82.7%）。对策：保留倒排路、加同义词词典、特殊词直通。' }],
              sourceRefs: [{ briefId: 'D7', briefSection: '技术路线详解§1.1', externalUrl: 'https://agent.csdn.net/6a6ddfc410ee7a33f2951875.html' }],
            },
            {
              title: '语义漂移（20-30%）→ 补向量 / 查询改写',
              description: [{ text: '用户口语与文档书面语不一致（「手机发烫」vs「设备散热」），BM25 只有 48.2% 命中。对策：向量召回路、HyDE/Query2Doc 改写、子问题分解。' }],
              sourceRefs: [{ briefId: 'D7', briefSection: '技术路线详解§1.1' }, { briefId: 'D1', briefSection: '发展与前沿§1' }],
            },
            {
              title: '分块不当（20-30%）→ 修切片策略',
              description: [{ text: '答案被切散在多个 chunk、或 chunk 混入无关段落。对策：语义分块、父子分块、重叠窗口——这属于数据侧修复，不是模型侧。' }],
              sourceRefs: [{ briefId: 'D7', briefSection: '对策略产品的启示§2' }],
            },
            {
              title: '语料质量（10-20%）→ 修数据，不上模型',
              description: [{ text: '语料过期、答案根本不在库里，再强的检索也捞不出来。对策：知识库治理、时效性标注、来源可信度分层——知识问题修知识库。' }],
              sourceRefs: [{ briefId: 'D7', briefSection: '对策略产品的启示§2' }, { briefId: 'D1', briefSection: '策略产品应用场景§2' }],
            },
          ],
        },
      },
      {
        blockId: 'llm-01-b6',
        type: 'paragraph',
        payload: {
          content: [
            { text: '如果说混合检索是地基，那么' },
            { text: 'cross-encoder 重排就是单项收益最大的组件', marks: ['bold'] },
            { text: '：同一基准研究显示，在混合检索之上加一级 cross-encoder 重排，MRR@3 提升 17.2 个百分点、Recall@5 提升 12.1 个百分点——没有第二个组件能拿出这种投入产出比。代价是 50-200ms 的额外延迟（cross-encoder 复杂度 O(n×L²)，候选越长越贵），所以工程上的标准配方已经收敛为三级漏斗：双路召回各取 50-100 篇 → RRF 融合取 Top-20 → cross-encoder 精排取 Top-5~8 喂给 LLM。在任何检索/召回链路上，「加一级精排」通常就是 ROI 最高的第一步。' },
          ],
          sourceRefs: [
            { briefId: 'D7', briefSection: '技术路线详解§1.2', externalUrl: 'https://arxiv.org/html/2604.01733v1' },
            { briefId: 'D7', briefSection: '对策略产品的启示§2' },
          ],
        },
      },
      {
        blockId: 'llm-01-b7',
        type: 'case',
        payload: {
          company: '360',
          companyLogoKey: '360',
          scenario: 'AI 搜索的 LLM 化 Query 理解链路',
          background: [{ text: '传统 QP 依赖词典、规则与小模型流水线，面对口语化、多意图、长尾 query 时信号生产能力触顶；360 在 AI 搜索改造中需要让 QP 具备语义理解与生成能力，同时扛住搜索级 QPS 与延迟约束。' }],
          approach: [{ text: '走「LLM 增强而非替代主链路」的路线：一次搜索请求最多调用 9 次大模型能力，其中意图识别、查询改写等高频低复杂环节用 2B-7B 小模型承接（快速意图识别 + 改写），把大模型留给真正需要推理的环节；查询改写引入 Rewrite-Retrieve-Read、HyDE、Query2Doc 等 LLM 改写家族，改写结果与原始 query 一起进入混合检索。' }],
          results: [
            { metric: '单次请求大模型调用次数', value: '最多 9 次（360 AI 搜索公开口径）' },
            { metric: '改写带来的检索收益', value: 'HyDE 召回率约 +10%、Query2Doc 约 +15%（研究口径）' },
          ],
          lesson: 'LLM 时代的 QP 不是「换一个大模型」，而是「多次小模型调用 + 分级算力路由」——把 9 次调用拆给 2B-7B 小模型，才扛得住搜索的延迟与成本。',
          sourceRefs: [
            { briefId: 'D1', briefSection: '发展与前沿§1 路径二' },
            { briefId: 'D1', briefSection: '发展与前沿§1 路径一' },
          ],
        },
      },
      {
        blockId: 'llm-01-b8',
        type: 'table',
        payload: {
          caption: 'LLM 时代查询改写武器库：机制与适用场景',
          columns: [
            { key: 'method', title: '方法' },
            { key: 'mechanism', title: '机制一句话' },
            { key: 'scene', title: '适用场景' },
          ],
          rows: [
            { method: 'Rewrite-Retrieve-Read', mechanism: 'LLM 先改写 query 再检索，迭代循环', scene: '口语化/模糊 query 的清洗' },
            { method: 'HyDE', mechanism: '生成「假想答案文档」，用答案向量去检索', scene: '零样本语义鸿沟，召回率约 +10%' },
            { method: 'Query2Doc', mechanism: 'LLM 生成伪文档拼接到原 query 后检索', scene: '短 query 信息不足，约 +15%' },
            { method: 'Step-Back', mechanism: '抽象出更高层问题再检索', scene: '过细的问题检索不到泛化知识' },
            { method: '子问题分解', mechanism: '复杂问题拆成多个子 query 并行检索', scene: '多跳/比较型问题' },
            { method: 'LLM 化 PRF', mechanism: '用首批结果让 LLM 做伪相关反馈扩展', scene: '首轮召回质量尚可时的扩召回' },
          ],
          highlightRowKeys: ['HyDE', 'Query2Doc'],
          sourceRefs: [
            { briefId: 'D1', briefSection: '发展与前沿§1 路径一' },
            { briefId: 'D7', briefSection: '技术路线详解§1.3' },
          ],
        },
      },
      {
        blockId: 'llm-01-b9',
        type: 'quote',
        payload: {
          variant: 'principle',
          text: '先归因，后上技术：混合检索是否引入 BM25、是否加重排，取决于你的 badcase 是「精确匹配失败」还是「语义漂移」——不看 badcase 分布就加组件，是在给别人的问题买单。',
          attribution: 'D7·对策略产品的启示',
          sourceRefs: [
            { briefId: 'D7', briefSection: '对策略产品的启示§2' },
          ],
        },
      },
    ],
    keyTakeaways: [
      '搜索范式三次跃迁：Traditional Web Search → LLM-enhanced Search → Search Agents。',
      '混合检索（BM25 + 向量 + RRF）是任何 RAG 部署的最低可行基线：Recall@5 +10.4pp，两路互补而非冗余。',
      '先归因后上技术：精确匹配失败 30-40% 补 BM25、语义漂移 20-30% 补向量/改写、分块与语料问题修数据。',
      'cross-encoder 重排是性价比之王：+17.2pp MRR@3，代价 50-200ms；标准配方 = 双路 50-100 → RRF Top-20 → 精排 Top-5~8。',
      'LLM 化 QP 的工程形态是「多次小模型调用 + 分级路由」（360 一次请求最多 9 次调用，2B-7B 承接意图与改写）。',
    ],
    relatedSections: ['llm-02', 'search-02', 'search-04', 'search-05'],
    diagramsUsed: ['fig-hybrid-retrieval'],
    updatedAt: '2026-09-01',
  },

  // ----------------------------------------------------------
  // llm-02 RAG 与 Deep Research：从检索增强到搜索 Agent
  // ----------------------------------------------------------
  {
    sectionId: 'llm-02',
    chapterSlug: 'llm-frontier',
    title: 'RAG 与 Deep Research：从检索增强到搜索 Agent',
    tagline: 'RAG 把搜索技术栈重新发明了一遍；Deep Research 把搜索从「一次查询」变成「规划-检索-反思」的 Agent 循环。',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    keywords: ['RAG', 'Agentic RAG', 'Deep Research', '搜索 Agent', 'Perplexity', 'GEO'],
    summary: [
      {
        text: 'RAG 用三年走完搜索二十年的路：Naive → Advanced → Modular → Agentic。本节讲清四代演进各自解决什么问题、Deep Research 的规划-检索-反思循环与产品分级策略，以及 Perplexity「弃广告保信任」背后的商业化未解之题。',
      },
    ],
    blocks: [
      {
        blockId: 'llm-02-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: [
            { text: 'RAG（检索增强生成）本质上是把搜索引擎的技术栈在 LLM 语境下重新发明了一遍：分块对应索引构建、向量检索对应召回、cross-encoder 对应精排、引用对应可解释性。看懂这一点，你在搜索篇学到的漏斗思维、badcase 归因、延迟预算全部可以平移过来——' },
            { text: '变的只是最后一个环节从「排列表」变成了「写答案」', marks: ['bold'] },
            { text: '。' },
          ],
          sourceRefs: [
            { briefId: 'D7', briefSection: '技术路线详解§1.3' },
          ],
        },
      },
      {
        blockId: 'llm-02-b2',
        type: 'diagram',
        payload: {
          diagramId: 'fig-rag-architecture',
          caption: 'RAG 标准架构：离线索引 + 在线「改写-混合检索-重排-生成」',
          altText: '离线侧为文档分块、Embedding、向量库；在线侧为 Query 经改写（HyDE/Multi-Query）进入混合检索（BM25 + 向量 + RRF），再经 cross-encoder 重排从 Top-20 取 Top-5，最后由 LLM 生成带引用的答案；右上角标注各环节 badcase 归因比例。',
        },
      },
      {
        blockId: 'llm-02-b3',
        type: 'paragraph',
        payload: {
          content: [
            { text: 'RAG 的演进可以归纳为四代。' },
            { text: 'Naive RAG（2023）', marks: ['term'] },
            { text: '是「分块 → 向量检索 → 生成」三步线性流水线，缓解了幻觉与时效问题，但复杂查询一上就失效。' },
            { text: 'Advanced RAG（2024）', marks: ['term'] },
            { text: '加入查询改写/扩展（HyDE、Multi-Query）、混合检索、重排与上下文压缩，专业领域查询准确率比基础版提升 20-30%——本质是把搜索篇的 QP、多路召回、精排经验搬了进来。' },
            { text: 'Modular RAG（2025）', marks: ['term'] },
            { text: '把系统拆成索引、预检索、检索、后检索、记忆、生成、编排七大可插拔模块，支持线性、条件、分支、循环四种工作流，解决的是架构耦合与可扩展性。' },
            { text: 'Agentic RAG（2025-）', marks: ['term'] },
            { text: '让 Agent 自主决策何时检索、用什么工具、何时停止，路由 Agent 与多 Agent 协同处理复杂多步任务——医疗诊断等场景准确率从传统 RAG 的 65% 提升到 89%。' },
          ],
          sourceRefs: [
            { briefId: 'D7', briefSection: '技术路线详解§1.3', externalTitle: 'Agentic RAG Survey', externalUrl: 'https://arxiv.org/html/2501.09136v2' },
            { briefId: 'D7', briefSection: '技术路线详解§1.3', externalUrl: 'https://blog.csdn.net/2502_94431433/article/details/155362882' },
          ],
        },
      },
      {
        blockId: 'llm-02-b4',
        type: 'table',
        payload: {
          caption: 'RAG 四代演进对照：每一代在解决上一代的什么短板',
          columns: [
            { key: 'gen', title: '代际' },
            { key: 'feature', title: '核心特征' },
            { key: 'problem', title: '解决什么问题' },
            { key: 'data', title: '代表数据' },
          ],
          rows: [
            { gen: 'Naive RAG（2023）', feature: '分块 → 向量检索 → 生成，三步流水线', problem: '缓解幻觉、补时效知识', data: '复杂查询即失效' },
            { gen: 'Advanced RAG（2024）', feature: '改写/扩展 + 混合检索 + 重排 + 上下文压缩', problem: '检索质量', data: '专业查询准确率 +20-30%' },
            { gen: 'Modular RAG（2025）', feature: '七大可插拔模块，四种工作流', problem: '架构耦合与可扩展性', data: '线性/条件/分支/循环编排' },
            { gen: 'Agentic RAG（2025-）', feature: 'Agent 自主决策何时检索、何时停止', problem: '复杂多步任务', data: '医疗场景准确率 65%→89%' },
          ],
          highlightRowKeys: ['Agentic RAG（2025-）'],
          sourceRefs: [
            { briefId: 'D7', briefSection: '技术路线详解§1.3', externalUrl: 'https://arxiv.org/html/2501.09136v2' },
          ],
        },
      },
      {
        blockId: 'llm-02-b5',
        type: 'diagram',
        payload: {
          diagramId: 'fig-rag-evolution',
          caption: 'RAG 四代演进时间线：从流水线到 Agent 决策环',
          altText: '四阶梯时间线：Naive（2023，三步流水线）、Advanced（2024，改写+混合+重排）、Modular（2025，七模块拼图）、Agentic（2025 年起，Agent 决策环）；每级标注解决的问题与代表数据。',
        },
      },
      {
        blockId: 'llm-02-b6',
        type: 'paragraph',
        payload: {
          content: [
            { text: 'Agentic RAG 的产品化形态就是 Deep Research。2025 年 2 月 OpenAI 发布 Deep Research，定义了「搜索 Agent」品类：输入一个提示，ChatGPT 自动搜寻、分析并整合数以百计的网上资讯，产出「水平堪比研究分析师」的报告。它的工作循环是' },
            { text: '规划（Planning）→ 检索（Tool Use）→ 反思（Reflection）→ 再检索', marks: ['bold'] },
            { text: '——搜索从「一次查询」变成一个可以跑几分钟到几十分钟的研究过程。2025 年底谷歌反击：基于 Gemini 3 Pro 的 Deep Research 智能体首次开放 API，并开源多步检索评测基准 DeepSearchQA（17 个领域、900 个因果链任务），官方口径称幻觉率降低 40%、是谷歌迄今「最具事实性」的模型。国内跟进者包括 Kimi-Researcher（端到端 agentic RL 训练，HLE 测试打平 Gemini Deep Research）、智谱 AutoGLM 沉思、字节扣子空间等。' },
          ],
          sourceRefs: [
            { briefId: 'D7', briefSection: '技术路线详解§1.4', externalTitle: 'OpenAI Deep Research 发布', externalUrl: 'https://openai.com/zh-Hant-HK/index/introducing-deep-research/' },
            { briefId: 'D7', briefSection: '技术路线详解§1.4', externalTitle: '谷歌 Gemini Deep Research 与 DeepSearchQA', externalUrl: 'https://www.ithome.com/0/904/366.htm' },
          ],
        },
      },
      {
        blockId: 'llm-02-b7',
        type: 'diagram',
        payload: {
          diagramId: 'fig-deep-research-loop',
          caption: 'Deep Research 工作循环：规划-检索-阅读整合-反思',
          altText: '环形四节点：规划（拆解子问题）→ 检索（多路 Tool Use）→ 阅读整合 → 反思（识别缺口），箭头回到规划；环中心标注「幻觉率 -40%（谷歌口径）」，外圈标注代表产品 OpenAI / Gemini / Kimi / 夸克。',
        },
      },
      {
        blockId: 'llm-02-b8',
        type: 'case',
        payload: {
          company: 'Perplexity',
          companyLogoKey: 'perplexity',
          scenario: '答案引擎的产品市场契合与「弃广告保信任」',
          background: [{ text: '传统搜索靠广告变现，但 AI 搜索的答案形态里植入广告会直接侵蚀「答案可信度」这一核心资产；同时订阅、广告、API 三条商业化路径在全球范围内均未走通，Perplexity 必须在增长与信任之间做选择。' }],
          approach: [{ text: '2026 年 2 月正式宣布停止广告业务，全面转向订阅 + 企业服务，公开理由是「Perplexity 最核心的资产是答案可信度，而搜索广告本质上会伤害这个资产」；同时用 Comet 浏览器（2025.7）与 Perplexity Computer（2026.2）开辟「主动执行」的第二曲线，从被动应答升级为主动执行任务。' }],
          results: [
            { metric: '月查询量', value: '7.8 亿次（2025.5，环比 +20%，公司自报口径）' },
            { metric: '年化收入', value: '约 5 亿美元（2026.4 CEO 披露，同比 +335%），估值 200 亿美元' },
            { metric: '商业化决策', value: '2026.2 停止广告业务，转向订阅 + 企业服务' },
          ],
          lesson: '答案型产品的商业化必须与引用可靠性、利益披露机制同步设计——信任是 AI 搜索的留存根基，短期广告收入可能透支长期资产。',
          sourceRefs: [
            { briefId: 'D7', briefSection: '技术路线详解§1.5', externalTitle: 'Perplexity 商业模式转向分析（36氪）', externalUrl: 'https://www.36kr.com/p/3960183470947465' },
            { briefId: 'D7', briefSection: '技术路线详解§1.5', externalUrl: 'https://database.caixin.com/2026-09-08/102482761.html' },
          ],
        },
      },
      {
        blockId: 'llm-02-b9',
        type: 'keypoints',
        payload: {
          layout: 'grid-2',
          heading: 'AI 搜索的产品形态与四道未解之题',
          items: [
            {
              title: '形态一：对话 + 搜索融合（夸克）',
              description: [{ text: '夸克 2025 年 2 月上线「深度思考」、10 月上线对话助手（C 计划），让用户在一个 App 内完成「获取可验证信息 + 深度探讨 + 内容创作」；a16z 全球消费级 AI 应用榜夸克第 9。' }],
              sourceRefs: [{ briefId: 'D7', briefSection: '技术路线详解§1.5', externalUrl: 'https://www.thepaper.cn/newsdetail_forward_31828160' }],
            },
            {
              title: '形态二：搜索即服务（百度）',
              description: [{ text: '百度 2025 年 7 月宣布搜索十年来最大改版：搜索框升级为「AI 超级入口」（超长文本、多模态输入），「百看」信息流取代链接列表，接入智能体与真人服务。' }],
              sourceRefs: [{ briefId: 'D7', briefSection: '技术路线详解§1.5', externalUrl: 'https://m.ofweek.com/ai/2025-08/ART-201715-8110-30668279.html' }],
            },
            {
              title: '未解题：成本与商业模式',
              description: [{ text: 'AI 搜索推理成本约为关键词搜索的 10 倍（Alphabet 董事长估计）；订阅在中国难走通、广告伤信任（Perplexity 已证伪）、API 价格战惨烈——三条路均难，分级提供轻量版/完整版（o4-mini 驱动）已成成本控制的标配。' }],
              sourceRefs: [{ briefId: 'D7', briefSection: '技术路线详解§1.5', externalUrl: 'https://www.huxiu.com/article/4076314.html' }, { briefId: 'D7', briefSection: '技术路线详解§1.4' }],
            },
            {
              title: '未解题：分发逻辑改写（GEO）',
              description: [{ text: '生成式搜索里「被引用」取代「被点击」成为新目标，催生 GEO（生成式引擎优化）；内容供给侧策略、流量分配规则、站长生态都要围绕「如何被 AI 答案引用」重构。' }],
              sourceRefs: [{ briefId: 'D2', briefSection: '发展与前沿§3' }],
            },
          ],
        },
      },
      {
        blockId: 'llm-02-b10',
        type: 'quote',
        payload: {
          variant: 'insight',
          text: '用户愿意为「研究级结果」等待分钟级时间——这证明搜索的价值衡量正在从「响应速度」转向「任务完成深度」，也给分发目标函数从「点击/时长」转向「任务完成」开了口子。',
          attribution: 'D7·发展趋势判断',
          sourceRefs: [
            { briefId: 'D7', briefSection: '发展趋势判断§4' },
          ],
        },
      },
    ],
    keyTakeaways: [
      'RAG = 搜索技术栈在 LLM 语境的重发明：分块/向量/重排/引用分别对应索引/召回/精排/可解释。',
      '四代演进：Naive（2023）→ Advanced（改写+混合+重排，专业查询 +20-30%）→ Modular（七模块）→ Agentic（医疗 65%→89%）。',
      'Deep Research = 规划-检索-反思循环；谷歌 DeepSearchQA（17 领域 900 任务）+ 幻觉率 -40%（官方口径）。',
      'Perplexity 验证了答案引擎 PMF（月查询 7.8 亿、年化 5 亿美元，自报口径），并以弃广告保信任定义商业伦理边界。',
      '商业化未解：AI 搜索成本约 10 倍于关键词搜索；「被引用」取代「被点击」，GEO 重构内容供给侧。',
    ],
    relatedSections: ['llm-01', 'llm-04', 'search-01', 'search-03'],
    diagramsUsed: ['fig-rag-architecture', 'fig-rag-evolution', 'fig-deep-research-loop'],
    updatedAt: '2026-09-01',
  },

  // ----------------------------------------------------------
  // llm-03 生成式推荐：Semantic ID、HSTU 与 OneRec
  // ----------------------------------------------------------
  {
    sectionId: 'llm-03',
    chapterSlug: 'llm-frontier',
    title: '生成式推荐：Semantic ID、HSTU 与 OneRec',
    tagline: '推荐从「判别式漏斗」走向「端到端生成」，Meta 证明了 Scaling Law，快手完成了工业级替代。',
    difficulty: 'advanced',
    estimatedMinutes: 13,
    keywords: ['生成式推荐', 'Semantic ID', 'RQ-VAE', 'TIGER', 'HSTU', 'OneRec', 'Scaling Law'],
    summary: [
      {
        text: '推荐系统二十年来的「召回-粗排-精排-重排」级联范式，第一次遇到了有工业数据支撑的替代者。本节讲透 Semantic ID 的编码原理与核心矛盾、HSTU 确立的推荐 Scaling Law，以及 OneRec 端到端替代的收益与代价。',
      },
    ],
    blocks: [
      {
        blockId: 'llm-03-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: [
            { text: '生成式推荐（Generative Recommendation）要革的是级联漏斗的命。传统 MCA（多阶段级联）的两个结构性罪状已被工业界反复论证：快手 OneRec 技术报告称之为「' },
            { text: '计算碎片化与优化不一致', marks: ['bold'] },
            { text: '」——每级漏斗各自优化局部目标，误差逐级传递；京东云的总结更扎心：' },
            { text: '线上服务超过 50% 的资源消耗在模块间的通信和数据存储上，而非核心的模型计算', marks: ['bold'] },
            { text: '。这解释了为什么端到端方案能同时做到「效果提升 + 成本下降」——它消灭的不是漏斗的功能，而是漏斗的组织形式。' },
          ],
          sourceRefs: [
            { briefId: 'D7', briefSection: '核心概念框架§2', externalTitle: 'OneRec Technical Report', externalUrl: 'https://arxiv.org/abs/2506.13695' },
          ],
        },
      },
      {
        blockId: 'llm-03-b2',
        type: 'diagram',
        payload: {
          diagramId: 'fig-generative-vs-cascade',
          caption: '级联架构 vs 端到端生成式：目标一致性与资源开销的对决',
          altText: '左侧为传统级联：召回、粗排、精排、重排四个框，模块间通信与存储开销用红色标注「超过 50% 资源耗在通信」；右侧为端到端单一生成模型，输入用户行为序列、输出推荐列表，标注 OneRec OPEX 仅为传统方案 10.6%、算子从 1.5 万精简至 1200 个；底部横条对比目标一致性、误差累积与 MFU 三个维度。',
        },
      },
      {
        blockId: 'llm-03-b3',
        type: 'table',
        payload: {
          caption: '范式转换的四组对立：传统推荐 vs 生成式推荐',
          columns: [
            { key: 'dim', title: '维度' },
            { key: 'old', title: '传统范式（2016-2023）' },
            { key: 'new', title: '新范式（2024-2026）' },
          ],
          rows: [
            { dim: '表示', old: '随机哈希 ID（无意义词表）', new: '语义 ID（RQ-VAE 量化的多模态语义 token）' },
            { dim: '架构', old: '多阶段级联：召回-粗排-精排-重排', new: '端到端单模型生成（seq2seq / decoder-only）' },
            { dim: '计算形态', old: '稀疏 embedding 查找为主，CPU 友好', new: '稠密 attention / 长序列生成，GPU 友好' },
            { dim: '优化方式', old: '各阶段目标割裂 + 人工特征工程', new: '统一目标 + Scaling Law + RL 偏好对齐' },
          ],
          sourceRefs: [
            { briefId: 'D7', briefSection: '核心概念框架§2' },
          ],
        },
      },
      {
        blockId: 'llm-03-b4',
        type: 'paragraph',
        payload: {
          content: [
            { text: '生成式推荐的第一道门槛是「词表鸿沟」：LLM 无法理解随机哈希的 item ID。Google 的 TIGER（NeurIPS 2023）奠定基础——用语义嵌入 + ' },
            { text: 'RQ-VAE（残差量化变分自编码器）', marks: ['term'] },
            { text: '把每个 item 编码为层级的离散语义 token（Semantic ID），例如 <a_3, b_7, c_2>，再由 Transformer seq2seq 直接「生成」下一个要推荐的物品。语义 ID 的妙处在于可泛化：内容语义相近的物品共享前缀 token，新品没行为也能靠前缀被「猜中」。但核心矛盾也随之而来：' },
            { text: '纯语义 SID 丢失协同信息，纯 ID 丢失语义知识', marks: ['bold'] },
            { text: '——后续 LC-Rec（对齐任务）、LETTER（引入 SASRec 协同信号）、TokenRec（LightGCN + MQ-VAE）的差异，本质上都在解这道「语义与协同如何对齐」的题。' },
          ],
          sourceRefs: [
            { briefId: 'D7', briefSection: '技术路线详解§2.2', externalTitle: 'TIGER（arXiv:2305.05065）', externalUrl: 'https://arxiv.org/abs/2305.05065' },
            { briefId: 'D7', briefSection: '技术路线详解§2.2', externalTitle: 'LAMIA（arXiv:2409.07276）', externalUrl: 'https://arxiv.org/html/2409.07276v3' },
            { briefId: 'D3', briefSection: '发展与前沿§3' },
          ],
        },
      },
      {
        blockId: 'llm-03-b5',
        type: 'diagram',
        payload: {
          diagramId: 'fig-semantic-id-rqvae',
          caption: 'Semantic ID / RQ-VAE 编码：把物品变成可生成的语义 token',
          altText: '物品多模态内容（图/文）经语义 Embedding 进入 RQ-VAE 三级残差量化，每层码本输出一个 token，得到层级语义 ID（如 <a_3,b_7,c_2>）；右侧 Transformer seq2seq 直接生成下一个物品的语义 ID；下方对比随机哈希 ID（无意义）与语义 ID（可泛化）。',
        },
      },
      {
        blockId: 'llm-03-b6',
        type: 'paragraph',
        payload: {
          content: [
            { text: '如果说 TIGER 证明了「能生成」，Meta 的 HSTU（ICML 2024，「Actions Speak Louder than Words」）则证明了「能 scale」：把用户行为序列当作 token 序列做自回归预测，用稠密 attention 取代稀疏特征交叉，模型做到 1.5 万亿参数，' },
            { text: '首次在推荐系统观测到类 LLM 的 Scaling Law', marks: ['bold'] },
            { text: '，线上 A/B 指标提升 12.4%（Meta 自报口径），并在数十亿用户的多个人流场景部署。更深层的意义是负载形态的改变——核心计算从 CPU 上的稀疏查找变成 GPU 上的长序列稠密 attention，推荐系统从此可以复用 LLM 的全套推理优化武器。行业 Survey 把进程划为三阶段：学术奠基期（2022-23，TIGER/P5）→ 工业验证期（2024，HSTU）→ 大规模部署期（2025 起，OneRec/MTGR/PLUM/PinRec）。' },
          ],
          sourceRefs: [
            { briefId: 'D7', briefSection: '技术路线详解§2.3', externalTitle: 'HSTU（arXiv:2402.17152）', externalUrl: 'https://arxiv.org/abs/2402.17152' },
            { briefId: 'D7', briefSection: '技术路线详解§2.3', externalTitle: '生成式推荐工业界深度 Survey', externalUrl: 'https://www.recsys-frontier.com/article/generative-recommendation-survey' },
            { briefId: 'D4', briefSection: '发展与前沿§1' },
          ],
        },
      },
      {
        blockId: 'llm-03-b7',
        type: 'diagram',
        payload: {
          diagramId: 'fig-rec-scaling-law',
          caption: '推荐 Scaling Law：参数量与损失呈幂律下降',
          altText: '双对数坐标图：横轴参数量/计算量、纵轴损失，散点沿幂律下降线分布，标注 HSTU 1.5 万亿参数点与「首次在推荐系统观测到类 LLM Scaling Law」；对照灰色虚线为传统 DLRM 的收益递减平台期。',
        },
      },
      {
        blockId: 'llm-03-b8',
        type: 'case',
        payload: {
          company: '快手',
          companyLogoKey: 'kuaishou',
          scenario: 'OneRec：首个工业级端到端生成式推荐',
          background: [{ text: '快手主站推荐链路的级联架构存在目标割裂与资源浪费：四级漏斗各自优化、模块间通信存储吃掉一半以上资源，且每级都要独立维护样本、特征与团队。' }],
          approach: [{ text: 'OneRec V1（2025.6 上线）用 Encoder-Decoder + 稀疏 MoE 做会话式生成（一次生成整个推荐列表），叠加迭代 DPO 偏好对齐，在快手 App / 极速版双端承接约 25% QPS；V2（2025.8）发现 V1 中 97.66% 算力被序列编码消耗，改用 Lazy Decoder-Only 架构砍掉编码器瓶颈，总计算量降 94%、训练资源降 90%，模型扩到 8B 且损失符合 Scaling Law（L = 3.13 + 3660/N^0.489），并用真实用户反馈强化学习（时长感知奖励塑形 + GBPO）。' }],
          results: [
            { metric: '观看时长', value: 'V1 A/B +1.6%；V2 App 停留时长再 +0.467%/0.741%（公司自报口径）' },
            { metric: 'OPEX', value: '仅为传统方案的 10.6%；算子从 1.5 万精简至 1200 个' },
            { metric: '承接流量', value: '主站/极速版约 25% QPS，规划提升至 50-60%' },
            { metric: '冷启动边界', value: '禁用缓存严格测试下，冷启动视频播放量 -44.7%' },
          ],
          lesson: '端到端消灭的是漏斗的组织形式而非功能：收益真实（效果 + 成本双赢），但新内容发现仍是短板——缓存与冷启动机制不能跟着漏斗一起扔掉。',
          sourceRefs: [
            { briefId: 'D7', briefSection: '技术路线详解§2.4', externalTitle: 'OneRec Technical Report（arXiv:2506.13695）', externalUrl: 'https://arxiv.org/abs/2506.13695' },
            { briefId: 'D7', briefSection: '工业界落地案例·快手', externalTitle: 'OneRec-V2（arXiv:2508.20900）', externalUrl: 'https://arxiv.org/abs/2508.20900' },
            { briefId: 'D7', briefSection: '成本与工程约束§4.3', externalUrl: 'https://www.alphaxiv.org/zh/abs/2508.20900' },
          ],
        },
      },
      {
        blockId: 'llm-03-b9',
        type: 'case',
        payload: {
          company: 'Meta',
          companyLogoKey: 'meta',
          scenario: 'HSTU：推荐 Scaling Law 的开创性验证',
          background: [{ text: '推荐排序长期困在 DLRM 范式里：堆特征交叉的收益递减，模型规模上去后效果不成比例——业界一直怀疑推荐模型是否存在 LLM 那样的 Scaling Law。' }],
          approach: [{ text: 'HSTU 把排序重构为序列转导任务：行为序列 token 化、用 pointwise 聚合注意力做自回归预测，在自有大规模语料上把参数推到 1.5 万亿，验证了损失随算力幂律下降；随后布局语义 ID 体系、粗排生成式方案（ROO/GESR）与统一生成式 + 稠密检索的 LIGER。' }],
          results: [
            { metric: '线上 A/B 指标', value: '+12.4%（Meta 自报口径，数十亿用户多场景部署）' },
            { metric: '模型规模', value: '1.5 万亿参数（ICML 2024）' },
          ],
          lesson: 'HSTU 的战略意义不在一个模型，而在给全行业提供了理论合法性——推荐模型可以像 LLM 一样 scale，「加大模型」从赌博变成了有律可循的工程决策。',
          sourceRefs: [
            { briefId: 'D7', briefSection: '工业界落地案例·Meta', externalTitle: 'HSTU（arXiv:2402.17152）', externalUrl: 'https://arxiv.org/abs/2402.17152' },
            { briefId: 'D7', briefSection: '工业界落地案例·Meta', externalUrl: 'https://www.recsys-frontier.com/article/generative-recommendation-survey' },
          ],
        },
      },
      {
        blockId: 'llm-03-b10',
        type: 'keypoints',
        payload: {
          layout: 'grid-2',
          heading: '对冲路线：不是只有「端到端替代」一种打法',
          items: [
            {
              title: '字节「大精排」：RankMixer',
              description: [{ text: '保留漏斗、把精排做大：用无参数 TokenMixing 替代 self-attention（推荐 token 语义差异极大，Attention 点积难学有效关系）+ Per-Token SparseMoE；抖音主 feed 全量，参数量 16M→1B 而推理成本不涨（LT30 +0.3%、时长 +1%，自报口径）。' }],
              sourceRefs: [{ briefId: 'D7', briefSection: '工业界落地案例·字节', externalUrl: 'https://hub.baai.ac.cn/view/47819' }],
            },
            {
              title: '美团 MTGR：DLRM 与 GR 折中',
              description: [{ text: '基于 HSTU 做 ranking 但保留全部 DLRM 交叉特征（生成式模型舍弃交叉特征会掉点），单样本 65 倍 FLOPs，靠用户级样本聚合使总推理成本降 12%，CTR +1.31%（自报口径）。' }],
              sourceRefs: [{ briefId: 'D7', briefSection: '工业界落地案例·美团', externalUrl: 'https://gitcode.csdn.net/69be75e154b52172bc6321b7.html' }],
            },
            {
              title: 'Google PLUM：Gemini 适配推荐',
              description: [{ text: '把 Gemini-1.5 MoE 适配为工业级生成式推荐：多模态嵌入 → RQ-VAE 第二代语义 ID → 领域持续预训练 → 自回归生成，YouTube Shorts 面板点击率 +4.96%（自报口径）。' }],
              sourceRefs: [{ briefId: 'D7', briefSection: '工业界落地案例·Google/YouTube', externalUrl: 'https://www.recsys-frontier.com/article/generative-recommendation-survey' }],
            },
            {
              title: '选型判断：看改造预算与数据密度',
              description: [{ text: '头部平台两条路线并行验证；中小平台更可能选「大模型增强漏斗」——改造成本低、可分阶段灰度。端到端派要回答的问题是：团队能否从「分段优化」重组为「数据 + 奖励设计 + 评测」。' }],
              sourceRefs: [{ briefId: 'D7', briefSection: '发展趋势判断§1' }],
            },
          ],
        },
      },
      {
        blockId: 'llm-03-b11',
        type: 'quote',
        payload: {
          variant: 'insight',
          text: '端到端消灭的不是「漏斗的功能」，而是「漏斗的组织形式」——召回与排序统一为一次生成，多团队分段优化被单一目标 + RL 偏好对齐取代。',
          attribution: 'D7·核心概念框架',
          sourceRefs: [
            { briefId: 'D7', briefSection: '核心概念框架§2' },
          ],
        },
      },
    ],
    keyTakeaways: [
      '级联架构的判决书：计算碎片化 + 优化不一致；线上超 50% 资源耗在模块间通信与存储（京东云口径）。',
      'Semantic ID 用 RQ-VAE 把物品编码为可生成的语义 token；核心矛盾是「语义 vs 协同」的对齐（LC-Rec/LETTER/TokenRec）。',
      'HSTU 1.5 万亿参数首次验证推荐 Scaling Law，线上 A/B +12.4%（Meta 自报口径），推荐计算从 CPU 稀疏查找转向 GPU 稠密 attention。',
      'OneRec 完成工业级替代：25% QPS、OPEX 10.6%、观看时长 +1.6%（自报口径）；V2 砍编码器后计算量 -94%；但禁缓存冷启动播放量 -44.7% 是真实代价。',
      '对冲路线并行有效：字节 RankMixer（16M→1B 成本不涨）、美团 MTGR（推理成本 -12%）；未来两年是端到端派与增强漏斗派的并行验证期。',
    ],
    relatedSections: ['llm-04', 'llm-05', 'rec-01', 'rec-05'],
    diagramsUsed: ['fig-generative-vs-cascade', 'fig-semantic-id-rqvae', 'fig-rec-scaling-law'],
    updatedAt: '2026-09-01',
  },

  // ----------------------------------------------------------
  // llm-04 搜推问一体化与 Agent 化分发
  // ----------------------------------------------------------
  {
    sectionId: 'llm-04',
    chapterSlug: 'llm-frontier',
    title: '搜推问一体化与 Agent 化分发',
    tagline: '搜索、推荐、问答、广告正在统一为一个生成式分发模型；分发入口正从信息流转向个人 Agent。',
    difficulty: 'advanced',
    estimatedMinutes: 12,
    keywords: ['OneSearch', '搜推问一体化', '对话式推荐', 'Agent 分发', 'AIGC', 'MTGR'],
    summary: [
      {
        text: '快手 OneRec（推荐）与 OneSearch（搜索）共用同一套生成式范式，标志着「搜、推、问、广告统一为一个分发模型」开始落地。本节讲清统一范式的技术同构性、对话式推荐的未解问题、Agent 化分发的需求切分，以及 AIGC 进入分发池带来的新策略命题。',
      },
    ],
    blocks: [
      {
        blockId: 'llm-04-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: [
            { text: '过去二十年，搜索和推荐是两套班子、两套技术栈、两套指标。生成式范式第一次让「一套模型做所有分发」有了技术同构性：快手 OneSearch 论文明确把' },
            { text: '搜索、推荐/广告、查询建议、底栏推荐建模为「四种同构任务」', marks: ['bold'] },
            { text: '，共用「语义 ID + 编码器-解码器生成 + RL 偏好对齐」范式——下一步就是跨场景共享的「分发基础模型」，多场景微调取代独立建模。' },
          ],
          sourceRefs: [
            { briefId: 'D7', briefSection: '搜推问一体化§1', externalTitle: 'OneSearch（arXiv:2509.03236）', externalUrl: 'https://arxiv.org/abs/2509.03236' },
            { briefId: 'D7', briefSection: '发展趋势判断§2' },
          ],
        },
      },
      {
        blockId: 'llm-04-b2',
        type: 'diagram',
        payload: {
          diagramId: 'fig-unified-generative-distribution',
          caption: '搜推问一体：一个生成式模型承接四类分发任务',
          altText: '中心为一个大模型框（语义 ID + 编码器-解码器 + RL 偏好对齐），搜索、推荐、广告、查询建议四个输入任务卡片汇入，输出到统一的分发出口；角落以灰色小图对比传统四条独立链路。',
        },
      },
      {
        blockId: 'llm-04-b3',
        type: 'case',
        payload: {
          company: '快手',
          companyLogoKey: 'kuaishou',
          scenario: 'OneSearch：业界首个工业级端到端生成式搜索',
          background: [{ text: '电商搜索的级联链路同样存在目标割裂：QP、召回、排序、相关性各自优化；且电商搜索的长尾 query、新品/新商家冷启动问题在判别式范式下始终难解。' }],
          approach: [{ text: 'OneSearch（2025.9 上线）用三大创新把搜索搬进生成式范式：关键词增强层次量化编码（KHQE，RQ + OPQ 双维建模，保住精确匹配能力）、多视角用户行为序列注入（显式短期 + Q-Former 压缩的隐式长期）、偏好感知奖励系统 PARS（多阶段 SFT + 自适应奖励 RL）。OneSearch-V2（2026.5 全量）进一步引入思维增强 query 理解：Qwen3-32B 生成受约束 CoT + 关键词提取 + 偏好校准。' }],
          results: [
            { metric: '订单量', value: '+3.22%；买家数 +2.4%；CTR +1.67%（公司自报口径）' },
            { metric: 'OPEX', value: '降 75.4%；MFU 从 3.26% 提升至 27.32%（8 倍）' },
            { metric: '冷启动场景', value: '收益显著高于常规场景（生成式架构天然缓解长尾/新品问题）' },
          ],
          lesson: '搜索与推荐的生成式改造共享同一张药方；冷启动是生成式方案的甜点场景——新业务、新内容池、新用户是风险最低、增量最明显的切入口。',
          sourceRefs: [
            { briefId: 'D7', briefSection: '工业界落地案例·快手', externalTitle: 'OneSearch（arXiv:2509.03236）', externalUrl: 'https://arxiv.org/abs/2509.03236' },
            { briefId: 'D7', briefSection: '工业界落地案例·快手', externalUrl: 'https://finance.sina.com.cn/stock/hkstock/ggscyd/2025-09-23/doc-infrnvhm7412438.shtml' },
            { briefId: 'D7', briefSection: '对策略产品的启示§2' },
          ],
        },
      },
      {
        blockId: 'llm-04-b4',
        type: 'paragraph',
        payload: {
          content: [
            { text: '对话式推荐（Conversational Rec）是「问」的那条腿。LLM 恰好补上了传统 CRS 的两个老短板——' },
            { text: '缺世界知识、缺泛化', marks: ['bold'] },
            { text: '：多轮追问、需求澄清、可解释推荐理由都变成了 prompt 能力。2025 年 RecSys/WSDM/WWW 涌现大量 LLM 对话推荐与「推荐 Agent」工作（如 MACRS 用多 Agent 规划对话流程 + 用户反馈反思）。但要冷静的是三个未解问题：真实对话数据稀缺（现有系统多在合成数据上训练）、评估指标不足（NDCG/BLEU 度量不了对话体验）、产品形态未定（ChatBot？搜索框？独立 App？）——' },
            { text: '技术先行、产品形态未收敛的领域，恰恰是策略 PM 能定义规则的地方', marks: ['bold'] },
            { text: '。' },
          ],
          sourceRefs: [
            { briefId: 'D7', briefSection: '搜推问一体化§2', externalTitle: 'Awesome-LLM4Rec', externalUrl: 'https://github.com/istarryn/Awesome-LLM4Rec' },
          ],
        },
      },
      {
        blockId: 'llm-04-b5',
        type: 'keypoints',
        payload: {
          layout: 'grid-2',
          heading: '分发的两个结构性迁移：入口迁移与供给迁移',
          items: [
            {
              title: 'Agent 化分发：切走「任务型需求」',
              description: [{ text: 'Agent 从被动响应走向主动服务：基于行为轨迹与实时上下文预判需求并主动触达（Perplexity Comet/Computer、夸克 AI 眼镜）。格局判断：信息流保留「消遣型需求」，Agent 切走「任务型需求」——你的北极星指标结构要随之重估。' }],
              sourceRefs: [{ briefId: 'D7', briefSection: '搜推问一体化§3' }, { briefId: 'D7', briefSection: '发展趋势判断§4' }],
            },
            {
              title: 'AIGC 直接进入分发池',
              description: [{ text: '生成与分发的边界正在消失：快手 2025Q4 AIGC 营销素材消耗达 40 亿元、转化率较人工素材提升 20-30%（公司自报口径）；推荐侧用多模态大模型理解「内容的故事逻辑与情感表达」用于治理与分发。' }],
              sourceRefs: [{ briefId: 'D7', briefSection: '搜推问一体化§4', externalUrl: 'https://www.huxiu.com/article/4846632.html' }],
            },
            {
              title: '新策略命题：AI 内容治理',
              description: [{ text: 'AIGC 大规模入池要求分发系统新增三类策略：AI 内容识别（标识与溯源）、质量分层（防低质 AI 内容稀释池子）、原创保护（防 AI 洗稿挤压真人创作者）——这是未来两年重排与生态策略的新变量。' }],
              sourceRefs: [{ briefId: 'D7', briefSection: '搜推问一体化§4' }, { briefId: 'D7', briefSection: '发展趋势判断§6' }],
            },
            {
              title: '推荐的「思考」能力',
              description: [{ text: 'OneRec-Think 把用户行为日志视为新模态与语言模型对齐，让推荐系统具备推理与解释能力——分发从「预测你点什么」升级为「推理你想要什么」，催生可解释推荐与意图推理推荐。' }],
              sourceRefs: [{ briefId: 'D7', briefSection: '发展趋势判断§3' }, { briefId: 'D7', briefSection: '工业界落地案例·快手' }],
            },
          ],
        },
      },
      {
        blockId: 'llm-04-b6',
        type: 'paragraph',
        payload: {
          content: [
            { text: '各家对「一体化」的落法不尽相同。阿里是双线并进：搜索/对话侧用夸克「深度思考 + C 计划对话助手」占据 AI 应用国内第一梯队，并以夸克 AI 眼镜探索随身 Agent；推荐侧则押注 Alimama URM（LLM 作为通用检索器）、Large User Model（大用户模型）与支付宝多模态生成式推荐。字节用 HLLM（item LLM 提取内容表征 + user LLM 建模序列）在漏斗内做分层大模型化，冷启动场景表现突出、参数 1B 扩到 7B 性能持续提升。对分发负责人，一个容易被低估的旧能力是' },
            { text: '意图路由', marks: ['term'] },
            { text: '——Agent 时代「把需求分发给哪个 Agent/垂域源」就是新的流量分配，路由准确率成为成本与体验的第一道阀门，搜索篇练过的意图识别功底在这里直接复用。' },
          ],
          sourceRefs: [
            { briefId: 'D7', briefSection: '工业界落地案例·阿里', externalUrl: 'https://louiswang524.github.io/blog/generative-retrieval/' },
            { briefId: 'D7', briefSection: '工业界落地案例·字节', externalUrl: 'https://hub.baai.ac.cn/view/47819' },
            { briefId: 'D1', briefSection: '发展与前沿' },
          ],
        },
      },
      {
        blockId: 'llm-04-b7',
        type: 'case',
        payload: {
          company: '美团',
          companyLogoKey: 'meituan',
          scenario: 'MTGR：生成式架构与传统特征的折中融合',
          background: [{ text: '直接上生成式架构有个已知痛点：生成式模型舍弃 DLRM 时代的交叉特征会导致性能下降，而美团外卖场景的特征体系（含大量人工交叉特征）是多年积累的核心资产，不能推倒重来。' }],
          approach: [{ text: 'MTGR 基于 HSTU 架构做 ranking（而非生成式检索）：保留全部特征（含交叉特征）+ GLN + 动态掩码防信息泄露；关键工程手段是「用户级样本聚合」——一次请求对所有候选只推理一次，摊薄了单样本 65 倍 FLOPs 的开销。已部署美团外卖主流量，支撑数亿用户，并验证了性能与计算复杂度的幂律关系。' }],
          results: [
            { metric: '总推理成本', value: '降 12%（单样本 65 倍 FLOPs，但聚合摊薄后为负成本，公司自报口径）' },
            { metric: '线上效果', value: 'CTR +1.31%、转化量 +1.22%（公司自报口径）' },
          ],
          lesson: '「保留资产 + 换引擎」往往比「推倒重来」更可落地：先问清楚你的交叉特征资产值多少钱，再决定端到端替代还是 HSTU 化改造。',
          sourceRefs: [
            { briefId: 'D7', briefSection: '工业界落地案例·美团', externalTitle: 'MTGR（arXiv:2505.18654）', externalUrl: 'https://gitcode.csdn.net/69be75e154b52172bc6321b7.html' },
          ],
        },
      },
      {
        blockId: 'llm-04-b8',
        type: 'list',
        payload: {
          ordered: true,
          variant: 'normal',
          heading: 'LLM4Rec 落地四手法：按风险从低到高排序',
          items: [
            [{ text: 'LLM 做特征增强/解释', marks: ['bold'] }, { text: '：生成用户画像、物品语义描述、推荐理由，作为特征注入现有模型——风险最低，先落地。' }],
            [{ text: 'LLM 做排序/重排', marks: ['bold'] }, { text: '：prompt 打分或微调后直接排序，或先向量召回再由 LLM rerank（RAG for Rec）。' }],
            [{ text: 'LLM 做召回/端到端生成', marks: ['bold'] }, { text: '：ID-Token 扩展、Semantic ID 生成式检索——收益上限最高，但组织与工程改造成本也最高。' }],
            [{ text: '配套工程技术', marks: ['bold'] }, { text: '：LoRA/参数高效微调、解码加速（如 Lite-LLM4Rec 直投投影头，绕过逐 token 生成）——贯穿所有手法。' }],
          ],
          sourceRefs: [
            { briefId: 'D7', briefSection: '技术路线详解§2.1', externalTitle: 'LLM4Rec 介绍', externalUrl: 'https://ikebo.cc/post/2025/4/llm4rec%E4%BB%8B%E7%BB%8D/' },
          ],
        },
      },
      {
        blockId: 'llm-04-b9',
        type: 'quote',
        payload: {
          variant: 'insight',
          text: '未来两年是「端到端派」与「大模型增强漏斗派」的并行验证期：端到端成为头部平台默认选项但不会全面替代漏斗，中小平台更可能采用后者——改造成本低、可分阶段灰度。',
          attribution: 'D7·发展趋势判断',
          sourceRefs: [
            { briefId: 'D7', briefSection: '发展趋势判断§1' },
          ],
        },
      },
    ],
    keyTakeaways: [
      'OneSearch 把搜索/推荐/广告/查询建议建模为四种同构任务，指向统一生成式分发模型（分发 foundation model）。',
      'OneSearch 战绩：订单 +3.22%、OPEX -75.4%、MFU 8 倍（自报口径），冷启动场景收益显著更高。',
      '对话式推荐被 LLM 解决「缺世界知识」老问题，但真实对话数据、评估指标、产品形态三个未解题仍在。',
      'Agent 切走任务型需求、信息流保留消遣型需求；AIGC 入池要求新增「AI 内容识别、质量分层、原创保护」策略。',
      'LLM4Rec 落地按风险从低到高：特征增强 → 排序/重排 → 召回/端到端生成，配套 LoRA 与解码加速。',
    ],
    relatedSections: ['llm-03', 'llm-05', 'llm-02', 'rec-01'],
    diagramsUsed: ['fig-unified-generative-distribution'],
    updatedAt: '2026-09-01',
  },

  // ----------------------------------------------------------
  // llm-05 成本账本与策略 PM 的能力升级
  // ----------------------------------------------------------
  {
    sectionId: 'llm-05',
    chapterSlug: 'llm-frontier',
    title: '成本账本与策略 PM 的能力升级',
    tagline: '成本账本已翻转——端到端不是更贵的玩具而是更便宜的重构；策略 PM 的核心正从「调特征权重」迁移到「设计奖励信号」。',
    difficulty: 'advanced',
    estimatedMinutes: 12,
    keywords: ['推理成本', 'MFU', '分级路由', 'RL 偏好对齐', '能力模型', '组织冲击'],
    summary: [
      {
        text: '推理成本两年降一个数量级的预期，正在重写分发系统的成本约束。本节给你三本账——宏观 token 账、在线化工具箱、推荐侧 MFU 革命——以及策略 PM 在 LLM 时代的四层能力坐标系与组织冲击判断。',
      },
    ],
    blocks: [
      {
        blockId: 'llm-05-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: [
            { text: '先看宏观账本。信通院《大模型推理优化关键技术及应用实践研究报告（2026）》给出行业坐标：我国日均 Token 调用量两年增长超 1400 倍、2026 年初突破 140 万亿；受 Agentic AI 应用驱动，' },
            { text: '推理计算量两年间增长达 1 万倍', marks: ['bold'] },
            { text: '；2024 年 OpenAI 的推理预算已是 GPT-4 训练预算的 15 倍——推理取代训练成为成本主战场。而 Gartner 预测 2030 年大模型推理成本较 2025 年下降 90% 以上：' },
            { text: '「每个请求都用大模型」将从奢侈变为默认，成本约束对策略设计的束缚正在快速放松', marks: ['bold'] },
            { text: '。' },
          ],
          sourceRefs: [
            { briefId: 'D7', briefSection: '成本与工程约束§4.1', externalTitle: '信通院推理优化报告（2026）', externalUrl: 'https://m.10jqka.com.cn/20260416/c676027013.shtml' },
            { briefId: 'D7', briefSection: '发展趋势判断§5' },
          ],
        },
      },
      {
        blockId: 'llm-05-b2',
        type: 'diagram',
        payload: {
          diagramId: 'fig-inference-cost-toolbox',
          caption: '推理成本优化工具箱：按落地顺序排列的五级阶梯',
          altText: '五级阶梯按落地顺序排列：分级路由（70% 场景 7-13B 够用）→ 缓存（rerank 缓存省 50% 算力）→ 推理引擎（连续批处理 GPU 利用率 30%→80%）→ 模型压缩（70B 蒸到 7B 成本 -88%）→ 架构级（MoE、KV Cache 分级）；每级标注代表技术与收益数字。',
        },
      },
      {
        blockId: 'llm-05-b3',
        type: 'table',
        payload: {
          caption: '在线化工具箱五级：手段、收益与产品决策点',
          columns: [
            { key: 'level', title: '层级' },
            { key: 'means', title: '手段' },
            { key: 'gain', title: '代表收益' },
            { key: 'pm', title: 'PM 要决策什么' },
          ],
          rows: [
            { level: '① 分级路由', means: '简单 query 走小模型/BM25，复杂 query 走大模型', gain: '70% 以上常见场景 7B-13B 够用', pm: '定义「简单/复杂」的分流规则与体验底线' },
            { level: '② 缓存', means: '前缀缓存/KV Cache 复用、rerank 与答案缓存', gain: '高命中场景省 50% 算力', pm: '缓存失效策略与答案时效性的权衡' },
            { level: '③ 推理引擎', means: '连续批处理、PagedAttention、PD 分离、投机采样', gain: 'GPU 利用率 30%→80%+；PD 分离吞吐 +1.7-3.2 倍', pm: '延迟预算如何在峰值期分配' },
            { level: '④ 模型压缩', means: '量化（INT8 损失 <1%）、蒸馏、结构化剪枝', gain: '70B 蒸到 7B：质量 95%+、成本 -88%', pm: '可接受的质量损失边界' },
            { level: '⑤ 架构级', means: 'MoE 按需激活、KV Cache 多级存储以存换算', gain: 'DeepSeek 借此降本 90%', pm: '是否值得架构级投入（业务规模门槛）' },
          ],
          sourceRefs: [
            { briefId: 'D7', briefSection: '成本与工程约束§4.2', externalUrl: 'https://www.cdut.edu.cn/__local/A/4B/39/AE63A4CFF16AAB9CCED92F1303C_A5C000B3_3E5B9C.pdf' },
            { briefId: 'D7', briefSection: '成本与工程约束§4.2', externalUrl: 'https://www.tbxsx.cn/blog/topic-kdg9/' },
          ],
        },
      },
      {
        blockId: 'llm-05-b4',
        type: 'paragraph',
        payload: {
          content: [
            { text: '推荐侧的成本逻辑与 LLM 推理优化同源：把推荐计算「GPU 化」，用 MFU（模型算力利用率）衡量效率。这场「MFU 革命」的数字相当惊人：OneRec 训练 MFU 23.7%、推理 MFU 28.8%；OneSearch 的 MFU 从 3.26% 提升到 27.32%（8 倍）；字节 RankMixer 的 MFU 提升近 10 倍至 40%+、推理 SM Activity 从 30% 提到 80%。合起来看的结论是：' },
            { text: '生成式推荐的账本已经从「大模型太贵用不起」翻转为「端到端反而更便宜」', marks: ['bold'] },
            { text: '——因为消灭了级联架构中 50% 以上的通信与存储开销。向管理层汇报重构方案时，「降本」与「增效」可以并列为理由，这是历史上少见的说服窗口。' },
          ],
          sourceRefs: [
            { briefId: 'D7', briefSection: '成本与工程约束§4.3', externalUrl: 'https://arxiv.org/abs/2508.20900' },
            { briefId: 'D7', briefSection: '成本与工程约束§4.3', externalUrl: 'https://hub.baai.ac.cn/view/47819' },
            { briefId: 'D7', briefSection: '对策略产品的启示§2' },
          ],
        },
      },
      {
        blockId: 'llm-05-b5',
        type: 'case',
        payload: {
          company: '字节跳动',
          companyLogoKey: 'bytedance',
          scenario: 'RankMixer：硬件感知的「大精排」成本工程',
          background: [{ text: '字节选择不拆漏斗、而是把精排做大。但直接堆 self-attention 遇到两个墙：推荐场景各 token 特征语义差异极大，Attention 的点积相似度会因组合爆炸难学到有效关系；且参数扩张必然推高推理成本，抖音主 feed 的 QPS 不允许。' }],
          approach: [{ text: 'RankMixer（2025.7）用无参数的 TokenMixing 替代 self-attention，配合 Per-Token SparseMoE 按需激活；全套「硬件感知」设计让 MFU 提升近 10 倍至 40%+。此后 token mixing 被腾讯微信（RankUp）、美团（MTmixAtt）等跟进，成为互联网大厂排序模型的标准架构之一；2026 年字节跟进发布 15B 的 TokenMixer-Large。' }],
          results: [
            { metric: '参数规模', value: '16M → 1B（扩大两个数量级）而推理成本不增加' },
            { metric: '线上效果', value: 'LT30 +0.3%、用户时长 +1%（抖音主 feed 全量，公司自报口径）' },
            { metric: 'MFU', value: '提升近 10 倍至 40%+，推理 SM Activity 30%→80%' },
          ],
          lesson: '「推理成本不涨」是模型结构设计的产出，不是运维优化的产出——评审大模型方案时，把 MFU 与单请求成本写进验收标准，和 CTR 并列。',
          sourceRefs: [
            { briefId: 'D7', briefSection: '工业界落地案例·字节', externalTitle: '字节 RankMixer（智源社区）', externalUrl: 'https://hub.baai.ac.cn/view/47819' },
            { briefId: 'D7', briefSection: '成本与工程约束§4.3', externalUrl: 'https://www.asterzephyr.xyz/blog/推荐系统的mixer革命-从一篇论文到四家大厂全量上线/' },
          ],
        },
      },
      {
        blockId: 'llm-05-b6',
        type: 'diagram',
        payload: {
          diagramId: 'fig-pm-capability-map',
          caption: 'LLM 时代策略 PM 能力地图：四层新能力 + 一个中心',
          altText: '四层金字塔：技术理解（RAG/SID/Scaling Law/MFU 账本）→ 评估体系（幻觉率/引用可靠性/检索 Recall/MRR/NDCG）→ 成本意识（token 账、分级调用 ROI）→ 新工作方式（LLM 辅助 badcase 归因、合成数据）；中心为「定义理想体验与目标权衡」。',
        },
      },
      {
        blockId: 'llm-05-b7',
        type: 'keypoints',
        payload: {
          layout: 'grid-2',
          heading: '策略 PM 能力坐标系：在传统三层之上叠加的四层',
          items: [
            {
              title: '技术理解',
              description: [{ text: 'RAG/混合检索/重排、Semantic ID、生成式 vs 判别式、Scaling Law、MFU 与推理成本账本（蒸馏、缓存、分级路由、PD 分离）——能判断一个需求该用 prompt、RAG、微调还是规则系统，是 2026 年策略 PM 的分水岭。' }],
              sourceRefs: [{ briefId: 'D7', briefSection: '对策略产品的启示§1' }, { briefId: 'D7', briefSection: '对策略产品的启示§3' }],
            },
            {
              title: '评估体系',
              description: [{ text: '从 CTR/时长扩展到幻觉率、引用可靠性、检索 Recall/MRR/NDCG、答案可信度；理解 RL 奖励设计的坑（奖励黑客、时长偏差）——OneRec-V2 证明真实用户反馈 RL 拉时长、奖励模型 RL 拉互动，奖励定义直接决定模型偏好。' }],
              sourceRefs: [{ briefId: 'D7', briefSection: '对策略产品的启示§1-2' }],
            },
            {
              title: '成本意识',
              description: [{ text: '会算 token 账：单次请求成本、分级调用 ROI、「70% 场景小模型够用」的判断力。成本不再是阻碍落地的理由，而是推动重构的理由——汇报时「降本」与「增效」并列。' }],
              sourceRefs: [{ briefId: 'D7', briefSection: '成本与工程约束§4.3' }, { briefId: 'D7', briefSection: '对策略产品的启示§1' }],
            },
            {
              title: '新工作方式',
              description: [{ text: '用 LLM 做 badcase 归因分类、语义特征挖掘、自动策略生成、合成数据与用户模拟；岗位侧已有印证——字节 2025 年开设「大模型策略产品经理-抖音搜索」，职责即定义 AI 搜索理想体验。' }],
              sourceRefs: [{ briefId: 'D7', briefSection: '对策略产品的启示§1', externalUrl: 'https://www.zhipin.com/job_detail/ecd9c32dc0b618eb03d60tS5GVRT.html' }],
            },
          ],
        },
      },
      {
        blockId: 'llm-05-b8',
        type: 'list',
        payload: {
          variant: 'checklist',
          heading: '分发负责人在 LLM 时代的六条行动启示',
          items: [
            [{ text: '先做 badcase 归因，再上技术', marks: ['bold'] }, { text: '：混合检索补哪一路、是否加重排，取决于 badcase 分布，不取决于技术热度。' }],
            [{ text: '重排是性价比之王', marks: ['bold'] }, { text: '：+12~17pp MRR、代价 65-200ms；任何检索/召回链路，「加一级精排」通常是 ROI 最高的第一步。' }],
            [{ text: '成本账本已翻转', marks: ['bold'] }, { text: '：OneRec OPEX 10.6%、OneSearch -75.4%（自报口径）——端到端是「更便宜的重构」，不是「更贵的玩具」。' }],
            [{ text: '冷启动是生成式的甜点', marks: ['bold'] }, { text: '：新业务、新内容池、新用户是最佳切入口，风险低、增量明显（OneSearch、HLLM 均已验证）。' }],
            [{ text: 'RL 偏好对齐是新策略杠杆', marks: ['bold'] }, { text: '：PM 的核心工作从「调特征权重」迁移到「设计奖励信号与目标权衡」。' }],
            [{ text: '信任是 AI 搜索的核心资产', marks: ['bold'] }, { text: '：商业化必须与引用可靠性、利益披露同步设计（Perplexity 弃广告案例）。' }],
          ],
          sourceRefs: [
            { briefId: 'D7', briefSection: '对策略产品的启示§2' },
          ],
        },
      },
      {
        blockId: 'llm-05-b9',
        type: 'paragraph',
        payload: {
          content: [
            { text: '最后看组织冲击，这直接关系到你晋升后的团队设计。级联时代「召回团队/粗排团队/精排团队」的分工，在端到端架构下' },
            { text: '失去了技术依据', marks: ['bold'] },
            { text: '——团队将向「数据 + 奖励设计 + 评测」重组。同时 PM 与算法的边界在模糊化：LLM 能自动完成 badcase 聚类、语义标签甚至策略代码草稿，PM 的价值向「定义理想体验、设计评估体系、做目标权衡」集中。这不是威胁而是再定位：' },
            { text: '模型越强，「定义什么是对的」这件事越值钱', marks: ['bold'] },
            { text: '。商业模式侧也在倒逼目标函数迁移：AI 搜索的广告模式被证伪、订阅难走通，更可能的路径是交易分成（Agent 完成购买抽佣）——分发目标将从「时长/点击」转向「任务完成/交易促成」。' },
          ],
          sourceRefs: [
            { briefId: 'D7', briefSection: '对策略产品的启示§3' },
            { briefId: 'D7', briefSection: '发展趋势判断§7' },
          ],
        },
      },
      {
        blockId: 'llm-05-b10',
        type: 'quote',
        payload: {
          variant: 'principle',
          text: '策略 PM 的核心工作正在从「调特征权重」迁移到「设计奖励信号与目标权衡」——奖励定义直接决定模型偏好，而定义奖励的人，就是新的分发规则制定者。',
          attribution: 'D7·对策略产品的启示',
          sourceRefs: [
            { briefId: 'D7', briefSection: '对策略产品的启示§2' },
          ],
        },
      },
    ],
    keyTakeaways: [
      '宏观账本：日均 Token 调用两年增 1400 倍破 140 万亿；推理计算量两年增 1 万倍；Gartner 预测 2030 年推理成本较 2025 降 90%+。',
      '在线化工具箱按落地顺序：分级路由 → 缓存（省 50%）→ 推理引擎（利用率 30%→80%）→ 模型压缩（-88%）→ 架构级（MoE/KV 分级）。',
      'MFU 革命：OneRec 23.7-28.8%、OneSearch 3.26%→27.32%、RankMixer 40%+；成本账本已翻转，「降本+增效」可并列汇报。',
      '能力坐标系四层：技术理解、评估体系（幻觉率/引用可靠性/RL 奖励设计）、成本意识（token 账）、新工作方式（LLM 辅助归因/合成数据）。',
      '组织冲击：级联分工失去技术依据，团队向「数据+奖励设计+评测」重组；PM 价值向「定义理想体验、设计评估体系、做目标权衡」集中。',
    ],
    relatedSections: ['llm-03', 'llm-04', 'eng-02', 'eng-05'],
    diagramsUsed: ['fig-inference-cost-toolbox', 'fig-pm-capability-map'],
    updatedAt: '2026-09-01',
  },
];
