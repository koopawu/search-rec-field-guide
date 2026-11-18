// ============================================================
// 搜索与推荐算法知识库 · 内容数据
// 篇章一：搜索篇（chapter-slug: search）
// 素材来源：调研简报 D1（Query 理解）、D2（搜索召回与排序）
// Schema 依据：site_ia.md 第 3 节；写作规范：site_ia.md 第 5 节
// 说明：RichText 用 rt() 简写输出标准 InlineSpan 结构；
//       sections 以完整 Section（含 blocks）给出，可直接 JSON.stringify 供前端消费。
// ============================================================

import type { Chapter, Section, RichText } from '../types';

/** 富文本简写：纯字符串包装为 InlineSpan 数组 */
const rt = (text: string): RichText => [{ text }];

// ============================================================
// 1.1 搜索引擎全景：QP → 召回 → 排序三件套（search-01）
// ============================================================

const search01: Section = {
  sectionId: 'search-01',
  chapterSlug: 'search',
  title: '搜索引擎全景：QP → 召回 → 排序三件套',
  tagline: '用一个漏斗讲清搜索系统的骨架，理解“为什么必须分层而不是一步到位”。',
  difficulty: 'foundational',
  estimatedMinutes: 10,
  keywords: ['搜索引擎架构', '搜索漏斗', 'QP', '召回', '粗排', '精排', '重排', '算力与精度权衡'],
  summary: rt('搜索主链路是 QP → 召回 → 排序三件套，落地形态是召回万级到重排几十条的多阶段漏斗。这一节建立全篇地图：为什么必须分层、每层解决什么问题、策略 PM 的抓手分布在哪。'),
  blocks: [
    {
      blockId: 'search-01-b1',
      type: 'paragraph',
      payload: {
        variant: 'lead',
        content: rt('这一节是全篇的地图。读完你应该能徒手画出搜索漏斗：用户 Query 先过 QP 做理解，再经召回、粗排、精排、重排逐级收敛到几十条结果——并且能向任何人说清，为什么工业界不一步到位用一个大模型排完，而必须分层。'),
      },
    },
    {
      blockId: 'search-01-b2',
      type: 'paragraph',
      payload: {
        content: rt('搜索系统的骨架可以概括成三段：QP（查询理解）→ 召回 → 排序。QP 是 Query 与 Doc 之间的桥梁，负责把一句口语化、可能带错别字的输入翻译成结构化信号；召回从全量库里把“可能相关”的候选捞出来，讲究多路并发、探索候选边界；排序则在相关性的约束下对候选优中选优。工程落地时，排序会进一步拆成粗排（千级候选）→ 精排（百级候选）→ 重排（几十条呈现）。'),
        sourceRefs: [
          {
            briefId: 'D2',
            briefSection: '核心概念框架§1',
            externalTitle: '搜索系统算法解析',
            externalUrl: 'https://github.com/iaminblacklist/SearchSystemAlgorithm',
          },
        ],
      },
    },
    {
      blockId: 'search-01-b3',
      type: 'diagram',
      payload: {
        diagramId: 'fig-search-funnel',
        caption: '搜索引擎多阶段漏斗全景：候选量级逐级收敛，模型精度与成本逐级升高',
        altText: '自上而下的漏斗图：Query 进入 QP（分词、改写、意图、类目），再到召回层（万至十万级候选，倒排加向量加行为多路召回）、粗排层（千级）、精排层（百级）、重排层（几十条），最终展示。每层标注候选量级与延迟约束，左侧标注算力与精度递增的箭头。',
      },
    },
    {
      blockId: 'search-01-b4',
      type: 'paragraph',
      heading: '为什么必须是漏斗，而不是一步到位',
      payload: {
        content: rt('算一笔账就明白了：假设语料库有 1 亿篇文档，用交互式 BERT 对每个 query-doc 对打分，单次要毫秒级，1 亿对就是不可接受的算力。所以候选集越大，只能用越便宜、越快的模型，由此形成“表示型（快、Doc 侧可离线预计算）→ 半交互式 → 交互式（慢但准）”的精度递进——越往下游候选越小，才用得起计算昂贵但精度高的模型。每一级漏斗的本质，都是算力与精度的权衡。'),
        sourceRefs: [
          { briefId: 'D2', briefSection: '核心概念框架§2' },
        ],
      },
    },
    {
      blockId: 'search-01-b5',
      type: 'table',
      heading: '漏斗各层分工与延迟约束',
      payload: {
        caption: '多阶段漏斗的算力-精度权衡小结',
        columns: [
          { key: 'stage', title: '阶段' },
          { key: 'scale', title: '候选量级' },
          { key: 'model', title: '典型模型' },
          { key: 'goal', title: '核心目标' },
          { key: 'latency', title: '延迟约束' },
        ],
        rows: [
          { stage: '召回', scale: '万~十万级', model: '倒排 + BM25、双塔 + ANN', goal: 'Recall@K（宁多勿漏）', latency: '各路并行，ms 级' },
          { stage: '粗排', scale: '千级', model: '轻量双塔、蒸馏小模型、LR/GBDT', goal: '快速过滤', latency: '单机 ms 级' },
          { stage: '精排', scale: '百级', model: '交互式 BERT、多目标 LTR（DeepFM/DIN/MMoE）', goal: '精度、多目标分数', latency: 'GPU 十 ms 级' },
          { stage: '重排', scale: '几十条', model: 'MMR/DPP/规则/LLM rerank', goal: '列表整体最优、多样性、业务规则', latency: '轻量' },
        ],
        highlightRowKeys: [],
        sourceRefs: [
          { briefId: 'D2', briefSection: '算法详解·三·小结表' },
        ],
      },
    },
    {
      blockId: 'search-01-b6',
      type: 'paragraph',
      heading: '这张地图对策略 PM 意味着什么',
      payload: {
        content: rt('两个意识要先建立起来。第一，任何 badcase 先定位在漏斗哪一层——“没召回来”和“召回来但排错了”是完全不同的修法，归因错了方向，迭代就是空转。第二，每一层都有一块独立的策略抓手面板：召回层的通道增删与配额、粗排的截断与蒸馏选型、精排的目标定义与融合权重、重排的打散混排规则——越靠下游越贴近你的产品决策，也越不需要等算法排期。'),
        sourceRefs: [
          { briefId: 'D2', briefSection: '策略产品应用场景§1-2' },
        ],
      },
    },
    {
      blockId: 'search-01-b7',
      type: 'keypoints',
      heading: '漏斗思维的四个要点',
      payload: {
        layout: 'grid-2',
        items: [
          {
            title: '召回宁多勿漏',
            description: rt('召回层的主指标是 Recall@K。候选没进池子，下游再强的模型也无能为力——召回是整条链路的天花板。'),
            sourceRefs: [{ briefId: 'D2', briefSection: '算法详解·三·小结表' }],
          },
          {
            title: '模型选型先看漏斗位置',
            description: rt('不是“哪个模型最准用哪个”，而是“这一层的候选量级用得起什么模型”。精度最高的方案往往根本进不了链路。'),
            sourceRefs: [{ briefId: 'D2', briefSection: '核心概念框架§2' }],
          },
          {
            title: '延迟是一个总预算',
            description: rt('召回各路并行，整体耗时取决于最慢的一路；每加一路召回、每加一个特征，都是在花同一个延迟预算。'),
            sourceRefs: [{ briefId: 'D2', briefSection: '算法详解·一·4' }],
          },
          {
            title: '单点优化会被漏斗放大或抵消',
            description: rt('漏斗是串联系统，上一层的天花板就是下一层的输入。策略迭代要结合全链路现状相互配合，否则收益会在传递中消失。'),
            sourceRefs: [{ briefId: 'D2', briefSection: '策略产品应用场景§3' }],
          },
        ],
      },
    },
    {
      blockId: 'search-01-b8',
      type: 'case',
      payload: {
        company: '58 同城',
        companyLogoKey: '58',
        scenario: '搜索语义匹配的技术路线选型：双塔还是交互式',
        background: rt('58 同城搜索要引入深度语义匹配解决字面匹配的漏召回问题，但交互式模型（Query 与 Doc 拼接进 BERT）效果最好、速度却最慢，工程上能不能扛住线上流量是选型的前提。'),
        approach: rt('团队对表示型（双塔，Query/Doc 各自编码、线上只算一次相似度）与交互式两条路线做了承载力对比，最终按漏斗位置分工：双塔用于大候选量的召回/粗排阶段，交互式只留给小候选的精排阶段。'),
        results: [
          { metric: '交互式模型可承载候选量', value: '仅能支持几十到百级文档的计算，且不支持 Faiss 类向量检索' },
          { metric: '双塔式模型可承载候选量', value: '检索速度非常快，可支持几万到几十万文档规模的计算' },
        ],
        lesson: '模型选型的第一问不是“谁更准”，而是“这一层用得起谁”——精度最高的方案，往往根本进不了链路。',
        sourceRefs: [
          {
            briefId: 'D2',
            briefSection: '核心概念框架§2',
            externalTitle: '深度语义模型在 58 同城搜索的实践',
            externalUrl: 'https://www.6aiq.com/article/1617063677499',
          },
        ],
      },
    },
    {
      blockId: 'search-01-b9',
      type: 'quote',
      payload: {
        text: '策略迭代要结合当前整个链路的现状并相互配合——单点优化若不与上下游协同，会被漏斗放大或抵消。',
        attribution: '搜索分发方法论共识（D2 调研整理）',
        variant: 'principle',
        sourceRefs: [{ briefId: 'D2', briefSection: '策略产品应用场景§3' }],
      },
    },
    {
      blockId: 'search-01-b10',
      type: 'list',
      heading: '新手最容易犯的几个误区',
      payload: {
        variant: 'myths',
        items: [
          rt('“上一个端到端大模型直接对全量结果排序”——1 亿文档乘毫秒级打分，延迟和成本都不允许，这就是漏斗存在的理由'),
          rt('只盯精排指标做优化——候选根本没被召回来时，精排再强也是无米之炊'),
          rt('把重排当成纯工程环节——打散、混排、兜底规则恰恰是策略密度最高的一层'),
          rt('各层团队各自为战——召回的配额变化会直接改变精排的输入分布，全链路要一起看'),
        ],
        sourceRefs: [{ briefId: 'D2', briefSection: '核心概念框架§1-2' }],
      },
    },
  ],
  keyTakeaways: [
    '搜索主链路是 QP → 召回 → 排序三件套；工程形态是召回万级、粗排千级、精排百级、重排几十条的漏斗。',
    '漏斗存在的根本原因是算力：候选越大只能用越便宜的模型，“表示型 → 交互式”是精度与成本的递进。',
    '每一层的指标语言不同：召回看 Recall@K 宁多勿漏，精排看 AUC/NDCG，重排看列表整体最优。',
    'badcase 归因先定位漏斗层级；单点优化不与上下游协同，会被漏斗放大或抵消。',
  ],
  relatedSections: ['search-02', 'search-04', 'rec-01', 'eng-01'],
  diagramsUsed: ['fig-search-funnel'],
  updatedAt: '2026-09-10',
};

// ============================================================
// 1.2 Query 理解：搜索的智能入口（search-02）
// ============================================================

const search02: Section = {
  sectionId: 'search-02',
  chapterSlug: 'search',
  title: 'Query 理解：搜索的智能入口',
  tagline: 'Query 理解是“信号生产系统”，其效果很大程度决定召回与排序的质量上限。',
  difficulty: 'foundational',
  estimatedMinutes: 12,
  keywords: ['Query 理解', 'QP', '分词', '词权重', '意图识别', 'QU 中台', '搜索 NLP'],
  summary: rt('QP 是搜索链路的第一环，把一句超短、常有错别、歧义丛生的用户输入加工成结构化信号，供给召回与排序消费。这一节讲清 QP 的九模块 Pipeline、Query 为什么难，以及策略 PM 的信号体系视角。'),
  blocks: [
    {
      blockId: 'search-02-b1',
      type: 'paragraph',
      payload: {
        variant: 'lead',
        content: rt('这一节读完，你要能把 QP 的九个模块按顺序摆出来，并且回答每个模块两个问题：它给下游生产什么信号、策略上的干预抓手是什么。QP 做好了是入口，做不好就是整条链路的天花板。'),
      },
    },
    {
      blockId: 'search-02-b2',
      type: 'paragraph',
      heading: 'QP 不是一个功能，是一套信号生产系统',
      payload: {
        content: rt('QP（Query Processing）用 NLP 技术从查询词中提取结构化信息，常见任务包括分词、NER、词权重、查询改写、类目识别、意图识别。美团对 QU 的定位说得很直白：对 Query 进行分析、产生一系列基础信号，应用到搜索链路的召回、排序各个阶段。这意味着你的工作对象不是“一个模型”，而是一套信号体系——每个信号都要回答“下游谁在用、怎么用、用什么指标衡量”。京东到家的判断更进一步：对 Query 是简单字面理解还是能读懂潜在真实需求，很大程度决定一个搜索系统的智能程度。'),
        sourceRefs: [
          {
            briefId: 'D1',
            briefSection: '核心概念框架§1',
            externalTitle: '哔哩哔哩专栏《搜索引擎技术（1）：Overview》（小红书社区搜索）',
            externalUrl: 'https://www.bilibili.com/read/cv23234771/',
          },
          {
            briefId: 'D1',
            briefSection: '核心概念框架§1',
            externalTitle: '京东到家搜索 Query 理解体系实践',
            externalUrl: 'https://www.modb.pro/db/152185',
          },
          {
            briefId: 'D1',
            briefSection: '策略产品应用场景§1',
            externalTitle: '美团《Query 理解在美团搜索中的应用》',
            externalUrl: 'https://docs.feishu.cn/article/wiki/wikcn6GL1jErO9S0hyHA7uHj9Ic',
          },
        ],
      },
    },
    {
      blockId: 'search-02-b3',
      type: 'diagram',
      payload: {
        diagramId: 'fig-qp-pipeline',
        caption: 'Query 理解九模块 Pipeline：从原始 Query 到结构化信号',
        altText: '横向流水线九个节点：Cache 命中判断、预处理、分词、纠错、归一扩展联想、Term 分析、意图识别、时效敏感等地域专项信号、人工干预层；末端输出的结构化信号分叉指向召回与排序，人工干预层画成贯穿所有模块的底部横条。',
      },
    },
    {
      blockId: 'search-02-b4',
      type: 'steps',
      heading: '一条 Query 要走的九步',
      payload: {
        orientation: 'vertical',
        steps: [
          { title: '① Cache 命中判断', description: rt('高频 Query 直接返回缓存的结构化结果，省掉整条流水线。') },
          { title: '② 预处理', description: rt('大小写、全半角、繁简体归一化，移除无意义符号，超长截断。注意别把型号“X200”误转小写。') },
          { title: '③ 分词', description: rt('多粒度切分：粗粒度结果精准、优先用于召回；召回不足时用细粒度二次重查扩召回。') },
          { title: '④ 纠错', description: rt('拼写、拼音、形近字纠错，首次结果差时二次纠错、片段纠错扩大召回。') },
          { title: '⑤ 归一 / 扩展 / 联想', description: rt('同义词、上下位词替换与改写，弥合用户表达与文档表述的 gap。') },
          { title: '⑥ Term 分析', description: rt('词权重、紧密度、词性：决定丢词重召时先丢谁、AND/OR 表达式怎么搭。') },
          { title: '⑦ 意图识别', description: rt('类目预测、精准与模糊意图、垂直意图路由——决定去哪个库搜、用什么排序策略。') },
          { title: '⑧ 专项信号', description: rt('时效性、敏感、地域识别等，决定召回通道选择与排序加权。') },
          { title: '⑨ 人工干预层', description: rt('CMS 配置贯穿所有模块，是 badcase 快速响应的兜底。'), badge: '兜底' },
        ],
        sourceRefs: [
          {
            briefId: 'D1',
            briefSection: '核心概念框架§2',
            externalTitle: 'DataFunTalk《搜索中的 Query 理解及应用》',
            externalUrl: 'https://www.6aiq.com/article/1588904027930',
          },
        ],
      },
    },
    {
      blockId: 'search-02-b5',
      type: 'paragraph',
      heading: 'Pipeline 不通用：乐高式热插拔架构',
      payload: {
        content: rt('这条 Pipeline 没有标准答案。不同业务的模块组合、依赖关系差异很大，百度的 QP 比一般垂搜复杂得多，所以工业界的共识是把 QU 服务做成“乐高式”可热插拔架构：模块独立、按业务灵活组装、支持动态上下线。对 PM 的含义是：你提的每一个 QP 需求，默认都应该能被独立配置、独立评估、独立回滚——这也是评审时要确认的架构前提。'),
        sourceRefs: [
          {
            briefId: 'D1',
            briefSection: '核心概念框架§2',
            externalTitle: 'DataFunTalk《搜索中的 Query 理解及应用》',
            externalUrl: 'https://www.6aiq.com/article/1588904027930',
          },
        ],
      },
    },
    {
      blockId: 'search-02-b6',
      type: 'paragraph',
      heading: '不是所有 badcase 都该进模型',
      payload: {
        content: rt('QP 的日常运营有一条心法：知识问题修知识库（同义词、词表），流程问题修路由节点（模块顺序、阈值），模型问题才进训练。例行化的做法是自动统计“高流低转”的 Query（曝光高、转化低），捞链路日志归因到召回、特征还是模型；再对 badcase 做人群维度聚合——同一个策略在老用户效果翻倍、新用户减半，就该分人群上线，而不是全盘推全。'),
        sourceRefs: [
          {
            briefId: 'D1',
            briefSection: '策略产品应用场景§2',
            externalTitle: 'Badcase 多维分类框架',
            externalUrl: 'https://www.hollycrm.com/blog/skill/302.html',
          },
        ],
      },
    },
    {
      blockId: 'search-02-b7',
      type: 'list',
      heading: 'Query 为什么难：五个固有特性',
      payload: {
        items: [
          rt('超短文本：淘宝 Query 切词后平均不足 3 个词，几乎没有上下文可用'),
          rt('错误率高：约 10%-15% 的查询包含一个或多个拼写错误'),
          rt('歧义与多意图：“苹果”是水果还是手机，“光明”是牛奶、啤酒还是大米'),
          rt('长尾分布：头部 Query 占约 60% QV，中长尾量大且稀疏，规则穷举不完'),
          rt('口语化与新词：“yyds 口红推荐”这类网络流行语、缩写、表情符持续冲击传统系统'),
        ],
        sourceRefs: [
          { briefId: 'D1', briefSection: '核心概念框架§3' },
          {
            briefId: 'D1',
            briefSection: '核心概念框架§3',
            externalTitle: '小红书 QP-OneModel 论文报道',
            externalUrl: 'https://www.163.com/dy/article/KNTPV63R0553BU5H.html',
          },
        ],
      },
    },
    {
      blockId: 'search-02-b8',
      type: 'keypoints',
      heading: '三个最该盯住的模块',
      payload: {
        layout: 'grid-3',
        items: [
          {
            title: '分词：词典与深度模型互补',
            description: rt('专业领域内 BiGRU+多头注意力+CRF 把分词 F1 从 HMM 的 75% 提升到 91%，叠加领域词典后再到 95%——词典和模型是互补不是替代，词典维护（新品词、热点词、品牌词）是长期的策略抓手。'),
            sourceRefs: [{ briefId: 'D1', briefSection: '算法详解§2' }],
          },
          {
            title: '词权重：四档体系与丢词重召',
            description: rt('核心词/关键词/边缘词/冗余词四档：核心词丢弃则语义完全改变，冗余词丢弃意图不变。召回不足时丢低权重词二次召回，相关性模型还能用“丢核心词”构造负样本。'),
            sourceRefs: [{ briefId: 'D1', briefSection: '算法详解§4' }],
          },
          {
            title: 'QU 中台化：规模化的必经之路',
            description: rt('美团 DQU 三层架构：基础信号层（通用 NLP 信号）→ 业务逻辑层（适配垂搜）→ 适配层。晋升负责人后要会判断：纠错、分词、同义词收中台，类目体系、业务特有意图留在业务线。'),
            sourceRefs: [{ briefId: 'D1', briefSection: '策略产品应用场景§1' }],
          },
        ],
      },
    },
    {
      blockId: 'search-02-b9',
      type: 'case',
      payload: {
        company: '小红书',
        companyLogoKey: 'xiaohongshu',
        scenario: 'QP 模块化 Pipeline 的统一建模（QP-OneModel）',
        background: rt('传统 QP 是分词、NER、词权重、类目、意图一串分离模块，模块间误差逐级传递，且面对内容社区大量网络新词、缩写、口语化表达，各模块各自优化的维护成本越来越高。'),
        approach: rt('小红书 QP-OneModel 把原本分离的多个模块统一成一个序列生成任务：让模型像写作文一样，根据查询生成包含所有分析结果的结构化回答，后面的分析步骤可以充分利用前面步骤的结果。部署上采用近线推理，每天预计算热门 Query 结果缓存。'),
        results: [
          { metric: '整体评分', value: '相比传统 BERT 基础系统提升 7.35%' },
          { metric: '实体识别 F1', value: '提升 9.01%' },
          { metric: '词重要性评估', value: '提升 9.31%' },
        ],
        lesson: '模块可以统一建模，但纠错阈值、类目体系、人工干预这些“策略结构”不会消失——线上永远需要可控、可解释、可干预。',
        sourceRefs: [
          {
            briefId: 'D1',
            briefSection: '发展与前沿§1 路径三',
            externalTitle: '网易《小红书让搜索引擎“更懂”用户心思》',
            externalUrl: 'https://www.163.com/dy/article/KNTPV63R0553BU5H.html',
          },
        ],
      },
    },
    {
      blockId: 'search-02-b10',
      type: 'quote',
      payload: {
        text: 'Query 理解的效果很大程度影响召回和排序的质量；对 Query 是进行简单字面上的理解还是可以理解其潜在的真实需求，很大程度决定着一个搜索系统的智能程度。',
        attribution: '京东到家《搜索 Query 理解体系实践》',
        variant: 'insight',
        sourceRefs: [
          {
            briefId: 'D1',
            briefSection: '核心概念框架§1',
            externalTitle: '京东到家搜索 Query 理解体系实践',
            externalUrl: 'https://www.modb.pro/db/152185',
          },
        ],
      },
    },
    {
      blockId: 'search-02-b11',
      type: 'list',
      heading: 'QP 健康度自查清单',
      payload: {
        variant: 'checklist',
        items: [
          rt('头部 Query 的分词结果是否符合用户日常语言习惯'),
          rt('实体识别覆盖率能否继续提升；新词、热点词是否被及时捕捉提权'),
          rt('同义词是否已覆盖全部头部需求；业务是否要支持英文纠错'),
          rt('意图识别准确率还能否提升，多意图的权重分配是否合理'),
          rt('人工干预平台是否可用：每个模块的结果能否被低成本、无副作用地覆盖'),
        ],
        sourceRefs: [
          { briefId: 'D1', briefSection: '策略产品应用场景§1、§3' },
        ],
      },
    },
  ],
  keyTakeaways: [
    'QP 是信号生产系统：分词、纠错、改写、词权重、意图、时效等信号，供召回与排序全程消费。',
    '九模块 Pipeline 不通用，乐高式热插拔架构是工业共识；每个模块都要可独立配置、评估、回滚。',
    'Query 的难点是超短（淘宝平均不足 3 词）、10%-15% 错误率、歧义、长尾与口语化新词。',
    '词典与深度模型互补（分词 F1 75%→91%→95%）；QU 中台化时通用信号收中台、业务语义留业务线。',
  ],
  relatedSections: ['search-01', 'search-03', 'eval-05', 'eng-01'],
  diagramsUsed: ['fig-qp-pipeline'],
  updatedAt: '2026-09-10',
};

// ============================================================
// 1.3 纠错、改写与意图识别：Query 理解的三大杠杆（search-03）
// ============================================================

const search03: Section = {
  sectionId: 'search-03',
  chapterSlug: 'search',
  title: '纠错、改写与意图识别：Query 理解的三大杠杆',
  tagline: '改写是 QP 中撬动大盘指标最有效的手段，纠错与意图识别决定“搜不搜得到、搜得对不对”。',
  difficulty: 'intermediate',
  estimatedMinutes: 12,
  keywords: ['Query 纠错', 'Query 改写', '意图识别', '噪声信道模型', '意图路由', '美团改写', '时效性识别'],
  summary: rt('纠错、改写、意图识别是 QP 里业务收益最直接的三个模块：美团 App 搜索改写流量占比约 73%，纠错能把“雪纺群”这类查询的点击率从 8% 拉到 32%。这一节讲清三个模块的原理、演进与各自的策略红线。'),
  blocks: [
    {
      blockId: 'search-03-b1',
      type: 'paragraph',
      payload: {
        variant: 'lead',
        content: rt('QP 模块很多，但撬动大盘指标主要靠三根杠杆：纠错决定“搜不搜得到”，改写决定“能召回多少”，意图识别决定“搜得对不对、去哪个库搜”。这一节讲透三根杠杆的原理、收益与误伤边界。'),
      },
    },
    {
      blockId: 'search-03-b2',
      type: 'paragraph',
      heading: '纠错：噪声信道模型与一条铁律',
      payload: {
        content: rt('约 10%-15% 的查询带拼写错误，电商场景纠错对转化影响直接：“雪纺群”纠正为“雪纺裙”后，点击率从 8% 提升至 32%，平均搜索时长从 1.2 分钟缩至 45 秒。经典框架是噪声信道模型：把用户输入当作正确词经过“噪声信道”后的观测，解码时反求最可能的正确词；错误模型 P(e|w) 的数据源包括编辑距离、拼音字典和 Session 二次查询（输错后换词重搜），后者是天然的伪标注。'),
        sourceRefs: [
          {
            briefId: 'D1',
            briefSection: '算法详解§3',
            externalTitle: 'CSDN《搜索引擎纠错机制与信息检索效率提升研究》',
            externalUrl: 'https://blog.csdn.net/2501_91651657/article/details/148138172',
          },
          {
            briefId: 'D1',
            briefSection: '算法详解§3',
            externalTitle: '百度百科《拼写纠错》',
            externalUrl: 'https://baike.baidu.com/item/拼写纠错/54314888',
          },
        ],
      },
    },
    {
      blockId: 'search-03-b3',
      type: 'diagram',
      payload: {
        diagramId: 'fig-noisy-channel',
        caption: '纠错的噪声信道模型：从“用户实际输入”反推“用户想输入什么”',
        altText: '用户想输入的词 w 经过噪声信道（键盘误触、拼音、形近字）变成实际输入 e；解码器反向求解使 P(e|w)P(w) 最大的候选词；P(e|w) 的数据源包括编辑距离、拼音字典和 Session 换词日志。',
      },
    },
    {
      blockId: 'search-03-b4',
      type: 'formula',
      payload: {
        name: '噪声信道纠错',
        expression: 'ŵ = argmax_w P(w|e) = argmax_w P(e|w) × P(w)',
        symbolNotes: [
          { symbol: 'P(w)', meaning: '语言模型：候选词本身出现的先验概率——常见词优先' },
          { symbol: 'P(e|w)', meaning: '错误模型：正确词 w 被输错成 e 的概率——由编辑距离、拼音/形近字典、Session 换词日志估计' },
          { symbol: 'argmax', meaning: '在所有候选改写里挑联合概率最大的一个' },
        ],
        intuition: rt('纠错就是“最常见”与“最像输入”两个因素的拔河：词越常见越可能是用户本意，错得越少也越可能是本意。Session 二次查询是这个模型免费的训练燃料。'),
        sourceRefs: [{ briefId: 'D1', briefSection: '算法详解§3' }],
      },
    },
    {
      blockId: 'search-03-b5',
      type: 'paragraph',
      heading: '深度纠错的演进与“敢不纠”的勇气',
      payload: {
        content: rt('深度纠错沿 SoftMasked BERT（先算错字概率再软掩码纠正）→ MacBERT4CSC（全词掩码，SIGHAN2015 字符级 F1 约 0.90，常用基线）→ CRASpell（噪声建模加复制机制，治一句多错与 BERT“过度纠正”）演进。策略上的铁律是：误纠比漏纠更伤体验——把对的改错，用户会觉得系统自作聪明，所以纠错了要敢不纠。达观数据的工业架构是“离线建库 + 在线多策略独立运行、权重可配置、松紧度可调”，首次结果差才二次纠错扩召回。'),
        sourceRefs: [
          {
            briefId: 'D1',
            briefSection: '算法详解§3',
            externalTitle: '《NLP 论文领读｜CRASpell：怎样改善模型对 multi-typo 的纠正效果》',
            externalUrl: 'https://juejin.cn/post/7117892287727665182',
          },
          {
            briefId: 'D1',
            briefSection: '算法详解§3-4',
            externalTitle: '达观数据《搜索引擎的 Query 自动纠错技术和架构》',
            externalUrl: 'https://www.datagrand.com/blog/query.html',
          },
        ],
      },
    },
    {
      blockId: 'search-03-b6',
      type: 'paragraph',
      heading: '改写：QP 里撬动大盘指标最有效的手段',
      payload: {
        content: rt('用户表达和文档表述天然有 gap，商户也不替你做 SEO，所以改写是 QP 撬动大盘指标最有效的手段——美团 App 搜索改写流量占比约 73%，点评约 67%，高峰 QPS 达 6 万/秒。离线候选挖掘五法：Session 挖掘、词向量、点击二部图、SMT 翻译、知识库；挖出的词对常有语义漂移（“大提琴→小提琴”这类同位词），需 BERT 语义判别把关——美团四阶段训练（续训、Co-training、人工挖负例、人工标注）把判别准确率做到 94% 以上。'),
        sourceRefs: [
          {
            briefId: 'D1',
            briefSection: '算法详解§6',
            externalTitle: '美团技术博客《美团搜索中查询改写技术的探索与实践》',
            externalUrl: 'https://tech.meituan.com/2022/02/17/Exploration-and-Practice-of-Query-Rewriting-in-Meituan-Search.html',
          },
        ],
      },
    },
    {
      blockId: 'search-03-b7',
      type: 'case',
      payload: {
        company: '美团',
        companyLogoKey: 'meituan',
        scenario: '搜索查询改写的全链路体系',
        background: rt('美团搜索面对海量商户与服务的非标表述，字面匹配必然漏召回；同时改写一旦漂移就会带入无关结果，需要在“敢改”和“改准”之间走钢丝。'),
        approach: rt('在线侧按精度分层：高精度词典改写 → 模型改写（SMT + XGBoost 排序）→ 覆盖长尾的强化学习 NMT 改写（Reward 综合搜索效果、用户行为、语义判别、字面匹配度，能处理“瑜教练→瑜伽教练”这类简写展开与去词）→ 商户名搜索的向量化召回（Faster-Transformer + FP16 加速，ANN 检索后置编辑距离规则兜底）；离线侧用五类方法挖候选，BERT 语义判别四阶段训练防漂移。'),
        results: [
          { metric: '改写流量占比', value: '美团 App 搜索约 73%，点评约 67%' },
          { metric: '改写服务峰值', value: '高峰 QPS 达 6 万/秒' },
          { metric: '语义判别准确率', value: 'BERT 四阶段训练后 94% 以上' },
        ],
        lesson: '改写的收益来自规模，风险来自漂移——候选挖掘可以激进，上线判别必须保守，分级信号给排序用。',
        sourceRefs: [
          {
            briefId: 'D1',
            briefSection: '算法详解§6',
            externalTitle: '美团技术博客《美团搜索中查询改写技术的探索与实践》',
            externalUrl: 'https://tech.meituan.com/2022/02/17/Exploration-and-Practice-of-Query-Rewriting-in-Meituan-Search.html',
          },
        ],
      },
    },
    {
      blockId: 'search-03-b8',
      type: 'paragraph',
      heading: '意图识别：四种方法的演进',
      payload: {
        content: rt('意图识别本质是多分类，决定“去哪个库搜、用什么排序策略”，是 QU 中业务价值最直接的模块。四代演进：词表规则（覆盖头部约 60% QV）→ 点击行为统计（淘宝搜“光明”，绝大多数用户点牛奶，前排出牛奶而非米面）→ 分类模型（美团 4 层 MT-BERT-MINI 支撑 17 个业务频道，每频道识别精确度 95% 以上）→ 层级多标签与小样本 PET（垂类 4000 条样本加自学习到 82%，线上卡阈值后 90% 以上）。'),
        sourceRefs: [
          {
            briefId: 'D1',
            briefSection: '算法详解§5',
            externalTitle: '人人都是产品经理《电商搜索是如何保证搜索结果不偏离搜索意图的》',
            externalUrl: 'https://www.woshipm.com/pd/5952552.html',
          },
          {
            briefId: 'D1',
            briefSection: '算法详解§5',
            externalTitle: '美团技术博客《美团 BERT 的探索和实践》',
            externalUrl: 'https://tech.meituan.com/2019/11/14/nlp-bert-practice.html',
          },
          {
            briefId: 'D1',
            briefSection: '算法详解§5',
            externalTitle: '《基于知识增强和预训练大模型的 Query 意图识别》',
            externalUrl: 'https://k.sina.cn/article_2674405451_9f68304b019013ssx.html',
          },
        ],
      },
    },
    {
      blockId: 'search-03-b9',
      type: 'diagram',
      payload: {
        diagramId: 'fig-intent-routing',
        caption: '垂直意图路由：意图识别决定请求分发给哪个垂域数据源',
        altText: '中心的意图识别模型把请求扇形分发到多个垂域卡片（POI、线路游、门票等），并扩展到 LLM 时代的 Agent、工具与垂域数据源；标注美团旅游优先级规则“线路游大于 POI 大于品类大于门票”。',
      },
    },
    {
      blockId: 'search-03-b10',
      type: 'paragraph',
      heading: '意图路由：Agent 时代被放大的价值',
      payload: {
        content: rt('意图识别的关键工业用途是垂直路由：美团旅游把请求按 POI、线路游、门票等 8 类意图分发到不同垂域，配“线路游 > POI > 品类 > 门票”优先级——“北京故宫”判 POI、“北京故宫一日游”判线路游。Agent 时代路由对象变成 Agent、工具与垂域数据源，路由准确率直接决定成本与体验。时效性识别（突发/周期/泛时效三分类）也常被低估：神马用 Trigger Model + 主动学习迭代，标注拟合率从不足 60% 提到 75%-85%——评估一致性本身就是策略工作。'),
        sourceRefs: [
          {
            briefId: 'D1',
            briefSection: '算法详解§5',
            externalTitle: '火山引擎《前沿重器[2]｜美团搜索理解和召回》',
            externalUrl: 'https://developer.volcengine.com/articles/7389834517097545791',
          },
          {
            briefId: 'D1',
            briefSection: '算法详解§7',
            externalTitle: '阿里/神马《神马搜索如何提升搜索的时效性？》',
            externalUrl: 'https://developer.aliyun.com/article/767031',
          },
        ],
      },
    },
    {
      blockId: 'search-03-b11',
      type: 'keypoints',
      heading: '三大杠杆的策略抓手与红线',
      payload: {
        layout: 'grid-3',
        items: [
          {
            title: '纠错：误纠比漏纠更伤体验',
            description: rt('抓手是纠错词典（离线挖掘+人工审核）、纠错阈值、头部结果缓存与“您是否要找”的产品形态；红线是宁可漏纠，不可把对的改错。'),
            sourceRefs: [{ briefId: 'D1', briefSection: '算法详解§3' }],
          },
          {
            title: '改写：分级信号与黑白名单',
            description: rt('抓手是同义词库自定义、改写精度分级（给排序用）、触发策略（仅无结果/少结果时强改写）、白名单黑名单；红线是同位词漂移被当同义词。'),
            sourceRefs: [{ briefId: 'D1', briefSection: '算法详解§6' }],
          },
          {
            title: '意图：体系设计权在 PM 手里',
            description: rt('抓手是意图/类目体系设计、模型采纳阈值（如相关性 >0.5 才采纳）、query-类目分布的运营校正；红线是类目边界定义不清导致标注不一致。'),
            sourceRefs: [{ briefId: 'D1', briefSection: '算法详解§5' }],
          },
        ],
      },
    },
    {
      blockId: 'search-03-b12',
      type: 'list',
      heading: '常见误区',
      payload: {
        variant: 'myths',
        items: [
          rt('认为纠错就该“逢错必纠”——误纠的体验损失远大于漏纠，低置信度就挂“您是否要找”而不是直接改'),
          rt('词向量挖出来的相似词直接当同义词上线——“大提琴→小提琴”是同位词不是同义词，必须过语义判别'),
          rt('指望规则穷举中长尾意图——头部 60% QV 靠规则，中长尾必须上模型加行为统计'),
          rt('把时效性当成可有可无的增强——热点误判会污染正常 query，时效 Trigger 阈值要配专项评测集'),
        ],
        sourceRefs: [{ briefId: 'D1', briefSection: '算法详解§3、§5、§6、§7' }],
      },
    },
  ],
  keyTakeaways: [
    '纠错用噪声信道模型“语言模型 × 错误模型”，Session 二次查询是免费的伪标注燃料。',
    '策略铁律：误纠比漏纠更伤体验——纠错了要敢不纠，工业做法是离线建库加在线多策略可配置。',
    '改写是 QP 撬动大盘指标最有效的手段：美团改写流量占比约 73%、高峰 6 万 QPS，语义判别准确率 94%+。',
    '意图识别四代演进：规则（头部 60% QV）→ 行为统计（淘宝“光明”）→ MT-BERT-MINI（17 频道 95%+）→ 层级多标签与 PET 小样本。',
    'Agent 时代意图路由价值被放大：路由准确率是成本与体验的第一道阀门。',
  ],
  relatedSections: ['search-02', 'search-04', 'eval-05', 'llm-01'],
  diagramsUsed: ['fig-noisy-channel', 'fig-intent-routing'],
  updatedAt: '2026-09-10',
};

// ============================================================
// 1.4 文本召回基石：倒排索引、BM25 与向量检索（search-04）
// ============================================================

const search04: Section = {
  sectionId: 'search-04',
  chapterSlug: 'search',
  title: '文本召回基石：倒排索引、BM25 与向量检索',
  tagline: '倒排索引是搜索四十年的基石，向量召回补上语义鸿沟，多路融合是工业标配。',
  difficulty: 'intermediate',
  estimatedMinutes: 12,
  keywords: ['倒排索引', 'BM25', 'TF-IDF', '向量检索', 'ANN', 'HNSW', '多路召回', 'RRF'],
  summary: rt('召回层的技术底座是倒排索引加 BM25，向量检索补上字面匹配解决不了的语义鸿沟，多路召回融合负责把各通道拧成一股。这一节讲清三类技术的直觉、代价，以及召回通道、配额、降级这些策略抓手。'),
  blocks: [
    {
      blockId: 'search-04-b1',
      type: 'paragraph',
      payload: {
        variant: 'lead',
        content: rt('这一节回答三个问题：搜索引擎凭什么在毫秒级从亿级文档里找到候选（倒排索引 + BM25）；字面匹配漏掉的语义相关怎么补（向量召回 + ANN）；多条召回通道的结果怎么合并成一份给下游（融合与配额）。'),
      },
    },
    {
      blockId: 'search-04-b2',
      type: 'paragraph',
      heading: '倒排索引：搜索四十年的基石',
      payload: {
        content: rt('倒排索引建立的是“词项 → 文档列表”的映射，由词典和倒排列表两部分组成，倒排列表里还记录词频、位置等信息。查询时走四步：对 Query 做同样的分词 → 查词典拿到各词项的倒排记录表 → 按 AND/OR 逻辑做拉链求交并 → 用 BM25 打分。工程上还有倒排列表压缩、跳表指针、动态剪枝等大量优化，但对 PM 来说，记住一点就够：QP 的分词、词权重、改写，最终都会落到这套“查表 + 集合运算”的框架上，上游信号质量直接决定召回质量。'),
        sourceRefs: [
          {
            briefId: 'D2',
            briefSection: '算法详解·一·1',
            externalTitle: '《Speech and Language Processing》（Jurafsky & Martin）',
            externalUrl: 'https://teaching.bb-ai.net/Student-Projects/Winograd-Challenge-Papers/Jurafsky-Martin-Speech-and-Language-Processing.pdf',
          },
        ],
      },
    },
    {
      blockId: 'search-04-b3',
      type: 'diagram',
      payload: {
        diagramId: 'fig-inverted-index',
        caption: '倒排索引结构：词典 + 倒排列表，查询即“查表 + 拉链求交”',
        altText: '左侧文档集经分词处理后，生成右侧词典与倒排列表（每个词项指向包含它的文档 ID 与位置列表）；查询路径为 Query 分词、查词典、按 AND 或 OR 做拉链求交、BM25 打分。',
      },
    },
    {
      blockId: 'search-04-b4',
      type: 'paragraph',
      heading: '从 TF-IDF 到 BM25：三个反直觉修正',
      payload: {
        content: rt('TF-IDF 的直觉是“一个词在这篇文档里频繁出现、又很少出现在别的文档里，就最能代表这篇文档”，但它有四个硬伤：不懂同义词、容易被关键词堆砌欺骗、词频线性增长不合理、没考虑文档长度。BM25 用三个修正把它变成工业默认（ES 5.x 起的默认评分算法）：词频饱和（出现得多更相关，但加分有上限，堆一百次也不能无限领先）、稀有词更重要（IDF 保留区分度）、文档长度归一（两万字文档提到某词很正常，两百字文档反复提到才算主题集中）。调试 badcase 时，ES 的 _explain 接口能解释“这条为什么排第一”——命中了哪些词、词权重多少、字段长度如何影响得分，这是策略侧排查相关性问题的入门工具。'),
        sourceRefs: [
          {
            briefId: 'D2',
            briefSection: '算法详解·一·2',
            externalTitle: 'Elasticsearch 全文检索工程教程（BM25 直觉与 _explain）',
            externalUrl: 'https://juejin.cn/post/7642986249989439538',
          },
        ],
      },
    },
    {
      blockId: 'search-04-b5',
      type: 'formula',
      payload: {
        name: 'BM25 打分',
        expression: 'score = IDF × (tf × (k1 + 1)) / (tf + k1 × (1 − b + b × |d| / avgdl))',
        symbolNotes: [
          { symbol: 'IDF', meaning: '稀有词更重要：log(1 + (N − n + 0.5) / (n + 0.5))，n 为包含该词的文档数' },
          { symbol: 'tf', meaning: '词频：该词在文档中出现的次数' },
          { symbol: 'k1', meaning: '控制词频饱和速度，经验默认 1.2' },
          { symbol: 'b', meaning: '控制文档长度归一化强度，经验默认 0.75' },
          { symbol: '|d| / avgdl', meaning: '文档长度与平均长度之比，长文档被惩罚' },
        ],
        intuition: rt('一句话：词出现得多更相关，但不能无限加分（饱和）；越稀有的词区分度越高（IDF）；长文档天然词多，要按长度打折扣（归一）。k1 和 b 的经验值 1.2 / 0.75 是几十年调出来的起点，别轻易动。'),
        sourceRefs: [
          {
            briefId: 'D2',
            briefSection: '算法详解·一·2',
            externalTitle: '阿里云 SelectDB：BM25 算法原理与公式',
            externalUrl: 'https://help.aliyun.com/zh/selectdb/relevance-scoring',
          },
        ],
      },
    },
    {
      blockId: 'search-04-b6',
      type: 'paragraph',
      heading: '向量召回：补上字面匹配的语义鸿沟',
      payload: {
        content: rt('BM25 解决不了“苹果”与“手机”这类没有字面重合但意图相关的匹配，这就需要向量召回：用双塔模型把 Query 和 Doc 各自编码成稠密向量，语义相近者距离相近；Doc 向量离线预计算入库，线上只算 Query 向量再做 ANN 近邻检索。典型收益场景是用户输错“玛莎拉蒂 ghlib”，字面匹配完全失效，语义召回能补上车型 Ghibli。ANN（近似最近邻）的核心权衡是牺牲 1%-5% 精度，换取 100-1000 倍速度——没有这个权衡，亿级向量的实时检索根本不成立。'),
        sourceRefs: [
          {
            briefId: 'D2',
            briefSection: '算法详解·一·3',
            externalTitle: 'BERT 花式玩法（知乎语义召回）',
            externalUrl: 'https://www.cnblogs.com/coder-duibai/p/16078771.html',
          },
          {
            briefId: 'D2',
            briefSection: '算法详解·一·3',
            externalTitle: '向量数据库核心原理（HNSW/IVF/PQ 与调参）',
            externalUrl: 'http://confucian.tech/posts/agent/ai-search/ai-search',
          },
        ],
      },
    },
    {
      blockId: 'search-04-b7',
      type: 'diagram',
      payload: {
        diagramId: 'fig-hnsw-layers',
        caption: 'HNSW 分层导航：高速公路 → 主干道 → 本地街道',
        altText: '三层节点图：顶层稀疏长边像高速公路，从入口点快速跳转；中层是主干道；底层密集节点是本地街道，精确定位最近邻。红色路径从顶层贪婪下钻到底层，查询复杂度接近 O(log n)，召回率保持 95% 以上。',
      },
    },
    {
      blockId: 'search-04-b8',
      type: 'table',
      heading: '三大 ANN 算法怎么选',
      payload: {
        caption: 'IVF / PQ / HNSW 对比',
        columns: [
          { key: 'algo', title: '算法' },
          { key: 'idea', title: '核心思想' },
          { key: 'pros', title: '优点' },
          { key: 'cons', title: '代价' },
          { key: 'tuning', title: '关键参数' },
        ],
        rows: [
          { algo: 'IVF 倒排文件', idea: 'K-means 聚类成 nlist 个簇，只在最近的 nprobe 个簇内精搜', pros: '内存低、构建快', cons: '查询落在簇边缘会错过真近邻，性能上限不如 HNSW', tuning: 'nlist、nprobe（调大更准更慢）' },
          { algo: 'PQ 乘积量化', idea: '高维向量切 m 段各量化为码字（1536 维 → PQ64 压缩 24 倍）', pros: '大幅省内存、加速距离计算', cons: '量化带来精度损失', tuning: '分段数 m、每段码本大小' },
          { algo: 'HNSW 分层图', idea: '跳表多层结构当“高速公路”，逐层贪婪下钻到最近邻', pros: '近 O(log n)、召回率 95%+、支持增量插入，Milvus/Qdrant/Pinecone 默认', cons: '内存占用高', tuning: 'M（16-64）、efConstruction、efSearch' },
        ],
        highlightRowKeys: [],
        sourceRefs: [
          {
            briefId: 'D2',
            briefSection: '算法详解·一·3',
            externalTitle: 'HNSW 近似最近邻索引详解',
            externalUrl: 'https://wiki.hugogu.cn/zh/ai/hnsw',
          },
          {
            briefId: 'D2',
            briefSection: '算法详解·一·3',
            externalTitle: 'IVF_FLAT vs HNSW 对比',
            externalUrl: 'https://blog.csdn.net/m0_73161433/article/details/161170571',
          },
        ],
      },
    },
    {
      blockId: 'search-04-b9',
      type: 'diagram',
      payload: {
        diagramId: 'fig-recall-fusion',
        caption: '多路召回融合：去重、归一化、配额截断三步',
        altText: '多条并行召回通道（配额宽度不同）汇入汇总去重节点并记录来源追踪，再经分数归一化或 RRF 融合、配额截断后交给粗排；各路分数不可直接相加，向量召回超时走降级旁路。',
      },
    },
    {
      blockId: 'search-04-b10',
      type: 'paragraph',
      heading: '多路融合三要素：去重、归一、配额',
      payload: {
        content: rt('多路召回的思想是互补：文本路保证核心词准确命中，向量路弥合语义鸿沟，行为路做个性化挖掘。融合时有三件事必须做对：去重与来源追踪（同一 Doc 被多路命中要按 ID 去重，但“被哪些通道命中”本身是重要特征，要喂给下游排序）；分数归一（cosine、BM25、热度分的量纲完全不同，不能直接相加，做法是通道内归一化或 RRF 倒数排名融合，ES 8.x 已原生支持 BM25 与 KNN 的 RRF）；配额与截断（下游粗排只吃得下数百到一千候选，按各路历史表现动态分配配额，倒排路通常优先级最高）。工程上还有一条红线：整体耗时取决于最慢一路，向量召回超时必须能降级为只用其他通道。'),
        sourceRefs: [
          {
            briefId: 'D2',
            briefSection: '算法详解·一·4',
            externalTitle: '多路召回分数融合与配额（百度面经解析）',
            externalUrl: 'https://mianshidashi.cn/interview-questions/baidu/algorithm-engineer/baidu-algorithm-multichannel-recall-score-fusion',
          },
          {
            briefId: 'D2',
            briefSection: '算法详解·一·4',
            externalTitle: '搜索系统设计面试（多路召回/配额/降级）',
            externalUrl: 'https://www.gankinterview.cn/blog/search-system-ai-interview-query-understanding-retrieval-ranking-evaluation-how-',
          },
        ],
      },
    },
    {
      blockId: 'search-04-b11',
      type: 'case',
      payload: {
        company: '知乎',
        companyLogoKey: 'zhihu',
        scenario: '搜索语义召回：从字面匹配到向量检索',
        background: rt('知乎搜索的长尾 Query 与用户表达高度口语化，纯倒排召回对“换种说法”的需求大量漏召回，需要语义层面的补充召回通道。'),
        approach: rt('用 BERT 作为 encoder 分别对 query 和 doc 做向量表示，基于 Faiss 对全量 doc 向量构建语义索引，线上实时用 query 向量做 ANN 召回，作为倒排通道之外的独立召回路接入多路融合。'),
        results: [
          { metric: '线上检索模式', value: 'Doc 向量全量离线预计算入库，线上只算 Query 向量 + ANN 近邻检索' },
          { metric: 'ANN 索引典型水平', value: 'HNSW 类索引将最近邻查询从暴力 O(n) 降至近 O(log n)，召回率保持 95% 以上（HNSW 公开口径）' },
        ],
        lesson: '向量召回是“新增一路”而不是“替换倒排”——通道制架构让语义召回的收益可独立度量、出问题可独立降级。',
        sourceRefs: [
          {
            briefId: 'D2',
            briefSection: '算法详解·一·3',
            externalTitle: 'BERT 花式玩法（知乎语义召回）',
            externalUrl: 'https://www.cnblogs.com/coder-duibai/p/16078771.html',
          },
          {
            briefId: 'D2',
            briefSection: '算法详解·一·3',
            externalTitle: 'HNSW 近似最近邻索引详解',
            externalUrl: 'https://wiki.hugogu.cn/zh/ai/hnsw',
          },
        ],
      },
    },
    {
      blockId: 'search-04-b12',
      type: 'list',
      heading: '召回层的策略抓手清单',
      payload: {
        variant: 'checklist',
        items: [
          rt('召回通道增删：新通道上线前先看与现有通道的重合度和独有贡献，不增量不接入'),
          rt('各路配额分配与截断阈值：按历史 CTR 表现和业务优先级动态调整'),
          rt('超时降级策略：向量召回超时时降级为其他通道，预案要提前定'),
          rt('无结果兜底（fallback）：少结果时触发丢词重召、强改写或扩展召回'),
          rt('向量召回调参：nprobe / efSearch 调大更准更慢，要和延迟预算一起算账'),
        ],
        sourceRefs: [
          { briefId: 'D2', briefSection: '策略产品应用场景§1' },
        ],
      },
    },
  ],
  keyTakeaways: [
    '倒排索引 = 词典 + 倒排列表，查询即查表加集合运算；QP 的信号质量直接决定召回质量。',
    'BM25 三直觉：词频饱和、稀有词更重要、长度归一；k1=1.2、b=0.75 是经验起点，_explain 是 badcase 调试入口。',
    '向量召回补语义鸿沟，ANN 用 1%-5% 精度换 100-1000 倍速度；HNSW 是主流向量库的默认索引。',
    '多路融合三要素：按 ID 去重但保留来源追踪、分数归一化或 RRF、按配额截断；向量路必须可超时降级。',
  ],
  relatedSections: ['search-01', 'search-03', 'search-05', 'llm-01'],
  diagramsUsed: ['fig-inverted-index', 'fig-hnsw-layers', 'fig-recall-fusion'],
  updatedAt: '2026-09-10',
};

// ============================================================
// 1.5 搜索排序：LTR、双塔与 BERT 的精度递进（search-05）
// ============================================================

const search05: Section = {
  sectionId: 'search-05',
  chapterSlug: 'search',
  title: '搜索排序：LTR、双塔与 BERT 的精度递进',
  tagline: '排序技术从人工规则到 LLM 重排的四次跃迁，每一次都在解“精度 vs 成本”的老问题。',
  difficulty: 'advanced',
  estimatedMinutes: 12,
  keywords: ['LTR', 'LambdaMART', '双塔模型', 'BERT 排序', 'Pointwise', 'Pairwise', 'Listwise', 'LLM 重排'],
  summary: rt('搜索排序走过规则、LTR、深度模型、LLM 四个阶段，主线始终是“在候选量级允许的算力内把精度做到极限”。这一节讲清 LambdaMART 的梯度直觉、双塔与交互式的分工，以及 LLM 重排的真实边界。'),
  blocks: [
    {
      blockId: 'search-05-b1',
      type: 'paragraph',
      payload: {
        variant: 'lead',
        content: rt('这一节把搜索排序的四次技术跃迁串成一条线：规则排序为什么必然被淘汰、LTR 三板斧怎么选、双塔与交互式为什么分管粗排和精排、LLM 重排能做什么不能做什么。读完你应该能在评审会上判断任何一个排序方案的“位置感”。'),
      },
    },
    {
      blockId: 'search-05-b2',
      type: 'paragraph',
      heading: '阶段 1：规则排序，起点也是教训',
      payload: {
        content: rt('早期排序靠人工加权公式：以苏宁公开的电商排序规则为例，文本相关性、类目相关性、品牌相关性，叠加人气模型里的曝光点击率、转化率、加购、评价、销量、缺货率等因子加权求和。问题是权重全靠拍脑袋，因子一多就无法维护，也无法规模化利用行为数据——这直接催生了 Learning to Rank。'),
        sourceRefs: [
          {
            briefId: 'D2',
            briefSection: '算法详解·二·阶段1',
            externalTitle: '苏宁易购搜索规则（规则排序因子实例）',
            externalUrl: 'https://oss.suning.com/sips/miq_public/NnEDy0aIjibw69qIu1YkXNSjKo-k03Yyu8IEtsmYAGxvcaWLqp4bC5D0ubAfFDyr.pdf',
          },
        ],
      },
    },
    {
      blockId: 'search-05-b3',
      type: 'diagram',
      payload: {
        diagramId: 'fig-ranking-evolution-timeline',
        caption: '排序模型演进时间线：特征工程自动化史与优化目标多元化史',
        altText: '横向时间轴从 2010 到 2025：LR、GBDT+LR、FM/FFM、Wide&Deep、DeepFM/DCN、DIN/DIEN、SIM、HSTU 与生成式，每个节点标注一句话贡献；主轴下方两条主题带分别是特征工程自动化与优化目标多元化。',
      },
    },
    {
      blockId: 'search-05-b4',
      type: 'paragraph',
      heading: '阶段 2：LTR 三板斧与 LambdaMART',
      payload: {
        content: rt('LTR 按损失函数分三支：Pointwise 把每个 query-doc 对当独立样本做分类，简单但无视样本间的先后关系；Pairwise 学习同一 query 下文档的两两偏序，更贴近排序本质——淘宝的样本构造技巧是“Click > Skip Above”（点过的好于它上方被跳过的），但要混入按原始排序生成的 pair，防止排序参数变化太剧烈、产出意想不到的 badcase；Listwise 直接优化整个列表的排序指标。集大成者是 LambdaMART（LambdaRank 梯度 + GBDT），Yahoo! LTR Challenge 的夺冠模型，至今仍是传统 LTR 的常用基线：能处理稠密、稀疏、统计、规则多种特征，训练稳定，可解释性相对好。'),
        sourceRefs: [
          {
            briefId: 'D2',
            briefSection: '算法详解·二·阶段2',
            externalTitle: 'Learning to Rank 在淘宝的应用（pairwise 样本构造）',
            externalUrl: 'https://jimmy-walker.gitbook.io/rank/l2r',
          },
          {
            briefId: 'D2',
            briefSection: '算法详解·二·阶段2',
            externalTitle: 'LTR/LambdaMART 原理（静悟生慧）',
            externalUrl: 'https://www.cnblogs.com/Allen-rg/p/11529591.html',
          },
        ],
      },
    },
    {
      blockId: 'search-05-b5',
      type: 'formula',
      payload: {
        name: 'LambdaMART 的 Lambda 梯度',
        expression: 'Lambda(i, j) = RankNet 交叉熵梯度 × |交换 i、j 位置后 NDCG 的差值|',
        symbolNotes: [
          { symbol: 'NDCG', meaning: '排序指标本身不可导，无法直接当损失函数' },
          { symbol: 'Lambda', meaning: '不显式定义损失函数，直接定义“每个样本需要的梯度”' },
          { symbol: '|ΔNDCG|', meaning: '交换这两篇文档对最终指标的影响有多大，影响越大梯度越大' },
        ],
        intuition: rt('一句话：NDCG 没法求导，那就绕过它——如果交换两篇文档会让 NDCG 变化很大，就给这对文档更大的梯度，让模型优先把“最影响指标的位置错误”修掉。再配上 GBDT 对非线性和特征交叉的亲和力，就是 LambdaMART。'),
        sourceRefs: [
          {
            briefId: 'D2',
            briefSection: '算法详解·二·阶段2',
            externalTitle: 'LTR/LambdaMART 原理（静悟生慧）',
            externalUrl: 'https://www.cnblogs.com/Allen-rg/p/11529591.html',
          },
        ],
      },
    },
    {
      blockId: 'search-05-b6',
      type: 'paragraph',
      heading: '阶段 3：双塔与交互式的分工',
      payload: {
        content: rt('深度排序从微软 DSSM（2013）开始：Query 和 Doc 各自过深度编码，线上只算一次余弦相似度——Doc 向量可离线预计算，所以快，但两侧零交互、精度有天花板。BERT 时代分出两条路线：表示型（双塔）普遍用于粗排的语义相关性计算；交互式（Query 与 Doc 拼接进 BERT，训练时充分交互）效果好但计算贵，一般只用于精排。QQ 浏览器和美团的技术复盘都印证了这一分工；折中方案是 Poly-Encoder 这类半交互式结构——58 同城的实践里，用少量 code 向量参与 attention，效果接近交互式且 Doc 塔仍可离线。'),
        sourceRefs: [
          {
            briefId: 'D2',
            briefSection: '算法详解·二·阶段3',
            externalTitle: 'QQ 浏览器搜索相关性实践',
            externalUrl: 'https://github.com/0voice/cpp_backend_awsome_blog/blob/main/【NO.357】QQ 浏览器搜索相关性实践.md',
          },
          {
            briefId: 'D2',
            briefSection: '算法详解·二·阶段3',
            externalTitle: '深度语义模型在 58 同城搜索的实践',
            externalUrl: 'https://www.6aiq.com/article/1617063677499',
          },
        ],
      },
    },
    {
      blockId: 'search-05-b7',
      type: 'diagram',
      payload: {
        diagramId: 'fig-twin-tower',
        caption: '双塔 vs 交互式：可预计算换速度，全交互换精度',
        altText: '左右两座塔分别编码用户侧与文档侧特征，塔间不相交，顶部汇合于一次内积输出相似分；物品塔下方标注离线预计算入向量库。侧边对比交互式 BERT 把 Query 和 Doc 拼接进单塔，准但慢，只能用于精排小候选。',
      },
    },
    {
      blockId: 'search-05-b8',
      type: 'keypoints',
      heading: '深度排序落地的工程三板斧',
      payload: {
        layout: 'grid-3',
        items: [
          {
            title: '非对称双塔',
            description: rt('Doc 侧离线存多组 Embedding 保留多侧面信息，Query 侧用轻量 3 层 BERT——把算力花在可以离线的那一侧。'),
            sourceRefs: [{ briefId: 'D2', briefSection: '算法详解·二·阶段3' }],
          },
          {
            title: '多阶段蒸馏',
            description: rt('用大模型的输出训练小模型上线：知乎把交互模型从 12 层压到 6 层，语义向量从 768 维压到 64 维，索引存储减为 1/6。'),
            sourceRefs: [{ briefId: 'D2', briefSection: '算法详解·二·阶段3' }],
          },
          {
            title: '语义分数作为特征',
            description: rt('不一定要让深度模型直接排序：58 同城把语义分数喂给 XGB 排序，AUC 提升 1.7 个点，CTR 和 CVR 都有不错提升。'),
            sourceRefs: [{ briefId: 'D2', briefSection: '算法详解·二·阶段3' }],
          },
        ],
      },
    },
    {
      blockId: 'search-05-b9',
      type: 'case',
      payload: {
        company: '知乎',
        companyLogoKey: 'zhihu',
        scenario: '交互式排序模型的蒸馏上线',
        background: rt('交互式 BERT 相关性模型精度好但太贵：12 层模型直接上线，延迟和 GPU 成本都扛不住搜索入口的流量。'),
        approach: rt('知乎采用多阶段蒸馏，把 12 层交互模型压缩到 6 层，语义向量从 768 维降到 64 维，在保住相关性精度的同时把线上成本砍掉一半。'),
        results: [
          { metric: '排序相关性特征 P95 延迟', value: '减少为原本的 1/2' },
          { metric: '搜索入口整体延迟', value: '下降 40ms' },
          { metric: 'GPU 机器数', value: '减少一半' },
          { metric: '语义向量维度', value: '768 维压到 64 维，索引存储减为 1/6' },
        ],
        lesson: '排序模型的收益要扣掉延迟与机器成本再算账——蒸馏是“用一点 bias 换大量 variance 和算力”的标准动作。',
        sourceRefs: [
          {
            briefId: 'D2',
            briefSection: '算法详解·二·阶段3',
            externalTitle: 'BERT 花式玩法（知乎语义召回、蒸馏收益）',
            externalUrl: 'https://www.cnblogs.com/coder-duibai/p/16078771.html',
          },
        ],
      },
    },
    {
      blockId: 'search-05-b10',
      type: 'paragraph',
      heading: '阶段 4：LLM 排序的真实边界',
      payload: {
        content: rt('LLM 进入排序最成熟的形态是零样本 Reranker（RankGPT、RankLLaMA 等）：准确、灵活、无需训练，但成本高、单次延迟 500ms-2s、还可能超时或限流，所以只对 Top-20 级别的小候选集使用，且要精简输入 token、用低温度保证确定性。更清醒的定位是：LLM 适合增强漏斗各环节——query 改写、语义召回、小候选 rerank、badcase 解释、合成训练数据、LLM-as-a-Judge 评估——而不是无脑替代低延迟主链路，主链路上传统 LTR 和双塔仍是主力。'),
        sourceRefs: [
          {
            briefId: 'D2',
            briefSection: '算法详解·二·阶段4',
            externalTitle: 'LLM 重排序实战（成本/延迟/温度设置）',
            externalUrl: 'https://juejin.cn/post/7588733783571824678',
          },
          {
            briefId: 'D2',
            briefSection: '发展与前沿§3',
            externalTitle: 'LLM-based Listwise Rankers 综述',
            externalUrl: 'https://arxiv.org/pdf/2501.09186v1',
          },
        ],
      },
    },
    {
      blockId: 'search-05-b11',
      type: 'list',
      heading: '排序方案评审时的常见误区',
      payload: {
        variant: 'myths',
        items: [
          rt('让 LLM 或交互式 BERT 排大候选集——它们只属于 Top-20 到百级的小候选，大候选用双塔'),
          rt('只看离线精度不看上线成本——知乎的案例说明，蒸馏省下的机器和延迟本身就是收益'),
          rt('直接拿“点击好于上方未点击”构造 pair 就上——不混入原始排序的 pair，排序会剧烈震荡出新 badcase'),
          rt('把语义模型当唯一解——语义分数作为特征喂给 GBDT/LTR，往往是性价比更高的第一步'),
        ],
        sourceRefs: [{ briefId: 'D2', briefSection: '算法详解·二·阶段2-4' }],
      },
    },
  ],
  keyTakeaways: [
    '排序四阶段：规则（拍脑袋权重）→ LTR（LambdaMART 直接定义“对 NDCG 影响”的梯度）→ 深度（双塔管粗排、交互式管精排）→ LLM 重排（只管 Top-20 小候选）。',
    '模型分工的本质是候选量级：双塔可预计算所以快，交互式全交互所以准，各守一段漏斗。',
    '工程三板斧：非对称双塔、多阶段蒸馏（知乎 12→6 层、P95 减半）、语义分数入特征（58 同城 XGB AUC +1.7pt）。',
    'LLM 在搜索排序中的定位是增强漏斗各环节，而非替代低延迟主链路。',
  ],
  relatedSections: ['search-01', 'search-04', 'search-06', 'rec-05'],
  diagramsUsed: ['fig-ranking-evolution-timeline', 'fig-twin-tower'],
  updatedAt: '2026-09-10',
};

// ============================================================
// 1.6 相关性与商业目标：搜索多目标融合（search-06）
// ============================================================

const search06: Section = {
  sectionId: 'search-06',
  chapterSlug: 'search',
  title: '相关性与商业目标：搜索多目标融合',
  tagline: '相关性 ≠ 点击率，搜索排序必须在相关性约束下平衡效率与商业目标。',
  difficulty: 'advanced',
  estimatedMinutes: 12,
  keywords: ['相关性模型', '多目标融合', 'pCTR', 'pCVR', 'GMV', 'MMR', 'DPP', 'badcase 归因', 'PE-LTR'],
  summary: rt('搜索排序不能只追点击率：标题党高点击低相关，冷门品高相关低点击。这一节讲清独立相关性模型、电商多目标融合公式、重排混排工具，以及 badcase 分层归因与目标制定的方法论。'),
  blocks: [
    {
      blockId: 'search-06-b1',
      type: 'paragraph',
      payload: {
        variant: 'lead',
        content: rt('搜索排序最容易踩的坑，是把点击率当唯一目标。这一节讲三件事：为什么需要一个独立于 CTR 的相关性模型、电商场景相关性与 GMV 怎么在一套公式里共存、以及分发负责人日常最高频的两项工作——badcase 归因和目标制定。'),
      },
    },
    {
      blockId: 'search-06-b2',
      type: 'paragraph',
      heading: '相关性 ≠ 点击率：两个经典反例',
      payload: {
        content: rt('两个反例足够说明问题：一是高点击低相关——图片吸睛、标题党的文档跟搜索词无关但点击率特别高，纯 CTR 目标会把它们顶到前排；二是高相关低点击——冷门但精准匹配需求的商品天然点击率低，纯 CTR 目标会让它们永无出头之日。所以搜索场景需要一个独立的相关性模型：特征上着重用文本 Embedding、商品类目等内容特征，刻意避开 pCTR 模型常用的 CTR 统计特征；标注上用人工分档数据 fine-tune，通用做法是五档（完全不相关到完全相关），QQ 浏览器把二分类拓展到五档的理由是“更多监督信息，且每一档的物理含义在不同业务下尽量对等”。'),
        sourceRefs: [
          {
            briefId: 'D2',
            briefSection: '算法详解·四',
            externalTitle: '电商搜索广告相关性模型（相关性 vs CTR）',
            externalUrl: 'https://plus2047.github.io/posts/2022-12-31-4-relevance.html',
          },
          {
            briefId: 'D2',
            briefSection: '算法详解·四',
            externalTitle: '搜索排序相关性五档标准与评估指标',
            externalUrl: 'https://www.cnblogs.com/the-big-bang/articles/18619877',
          },
        ],
      },
    },
    {
      blockId: 'search-06-b3',
      type: 'diagram',
      payload: {
        diagramId: 'fig-relevance-vs-ctr',
        caption: '相关性 × 点击率四象限：两个象限决定排序策略',
        altText: '二乘二象限图：高相关高点击为优质结果；高点击低相关是标题党，相关性模型要过滤；高相关低点击是冷门优质内容，需要扶持；双低为噪声。',
      },
    },
    {
      blockId: 'search-06-b4',
      type: 'paragraph',
      heading: '相关性是对商业目标的“约束”，不是对立面',
      payload: {
        content: rt('要有心理预期：相关性策略上线初期，CTR 可能不升反降——过滤掉诱导点击的文档，短期点击必然受损，换来的是满意度与长期留存。所以相关性与搜索效率目标需要平衡，约束排序以避免过度追求点击率而伤害用户满意度。汇报这类项目时，别用 CTR 当主指标，用首屏 BadCase 率和 NDCG——美团点评相关性模型上线后的标准表述是“月均 BadCase 率下降 2.9pp、列表页 NDCG 提升 2pp”，这是相关性项目的经典表达范式。'),
        sourceRefs: [
          { briefId: 'D2', briefSection: '算法详解·四' },
          {
            briefId: 'D2',
            briefSection: '典型指标与评估§2',
            externalTitle: '大众点评搜索相关性技术探索',
            externalUrl: 'https://tech.meituan.com/2022/07/06/Semantic-Relevance-Matching.html',
          },
        ],
      },
    },
    {
      blockId: 'search-06-b5',
      type: 'case',
      payload: {
        company: '美团点评',
        companyLogoKey: 'meituan',
        scenario: '搜索语义相关性模型的链路上线方式',
        background: rt('点评搜索的长尾 Query 字面匹配差，商户表述多样，不相关结果挤占前排伤害满意度；同时相关性模块不能拖慢整条链路，也不能与 CTR 目标打架。'),
        approach: rt('四步落地：前置黄金规则分流（搜索词与商户名完全一致时直接输出“相关”判定）；相关性计算与核心排序层并发，不增加链路延迟；相关分作为特征引入 LTR 多目标融合排序；多路召回融合时只把补充召回路中的相关商户融合进列表，控制相关性路对大盘的扰动。'),
        results: [
          { metric: '月均 BadCase 率', value: '显著下降 2.9pp' },
          { metric: '搜索列表页 NDCG', value: '稳定提升 2pp' },
        ],
        lesson: '相关性模块的工程位置和排序融合方式，与模型精度同等重要——黄金规则先分流、并发不增延迟、相关分入 LTR，是这套方案可复制的部分。',
        sourceRefs: [
          {
            briefId: 'D2',
            briefSection: '策略产品应用场景§1',
            externalTitle: '大众点评搜索相关性技术探索',
            externalUrl: 'https://tech.meituan.com/2022/07/06/Semantic-Relevance-Matching.html',
          },
        ],
      },
    },
    {
      blockId: 'search-06-b6',
      type: 'formula',
      payload: {
        name: '电商搜索多目标融合',
        expression: 'score = price × pCTR × pCVR（期望 GMV 导向的融合打分）',
        symbolNotes: [
          { symbol: 'pCTR', meaning: '点击率预估：效率目标' },
          { symbol: 'pCVR', meaning: '点击到转化的概率预估：转化目标' },
          { symbol: 'price', meaning: '客单价：把“转化”折算成 GMV 期望' },
        ],
        intuition: rt('乘法融合的直觉是“任一目标为零则整体为零”，天然惩罚偏科；且各目标独立预估、新增目标不受 score 量纲影响。阿里 PE-LTR 走得更远：指出 LambdaMART 只关注点击相关性、不考虑购买，提出帕累托有效的 LTR 框架同时优化 CTR 与 GMV；淘宝则借鉴 ESMM 结构，在完整曝光空间分别拟合 pCTR 和 pCTCVR，缓解 CVR 预估的样本选择偏差与数据稀疏。'),
        sourceRefs: [
          {
            briefId: 'D2',
            briefSection: '算法详解·四',
            externalTitle: '阿里 PE-LTR 多目标优化框架（GMV+CTR）',
            externalUrl: 'https://www.infoq.cn/article/VOpi58kZy8GSgMTuYqJd',
          },
          {
            briefId: 'D2',
            briefSection: '算法详解·四',
            externalTitle: '淘宝多目标融合（ESMM 借鉴）',
            externalUrl: 'https://blog.csdn.net/dQCFKyQDXYm3F8rB0/article/details/100135555',
          },
        ],
      },
    },
    {
      blockId: 'search-06-b7',
      type: 'keypoints',
      heading: '重排混排的工具箱',
      payload: {
        layout: 'grid-2',
        items: [
          {
            title: 'MMR：相关性与多样性的折中',
            description: rt('最大边际相关性：每选一个结果，都在“与 query 相关”和“与已选结果不重复”之间做权衡，一个 θ 参数控制倾向。'),
            sourceRefs: [{ briefId: 'D2', briefSection: '算法详解·四' }],
          },
          {
            title: 'DPP：质量 × 多样性的整体建模',
            description: rt('行列式点过程用行列式度量一个列表子集的“质量乘以多样性”，比 MMR 的逐个贪心更有全局观，适合结果页级打散。'),
            sourceRefs: [{ briefId: 'D2', briefSection: '算法详解·四' }],
          },
          {
            title: '业务规则：打散与广告位',
            description: rt('类目打散、店铺打散、广告插入位置规则——重排是策略规则密度最高的一层，也是 PM 可自主迭代的战场。'),
            sourceRefs: [{ briefId: 'D2', briefSection: '算法详解·四' }],
          },
          {
            title: '融合权重的优化方法',
            description: rt('多目标打分的权重调参可选随机搜索、CEM（性价比较高）、在线贝叶斯优化、强化学习——别拍脑袋，也别只靠离线 grid search。'),
            sourceRefs: [{ briefId: 'D2', briefSection: '算法详解·四' }],
          },
        ],
      },
    },
    {
      blockId: 'search-06-b8',
      type: 'paragraph',
      heading: '目标制定：四步法，不拍脑袋',
      payload: {
        content: rt('搜索场景的优化目标基本就四个方向：内容相关性提升、转化漏斗指标提升（CTR/CVR/深度转化）、转化数量绝对值提升、用户满意度。定目标值要走四步：基准线分析（当前水位与历史趋势）→ 上限预估（竞品对标加漏斗拆分，算出理论空间）→ A/B 快速验证（小流量确认弹性）→ 风险评估（护栏指标与回滚预案）。跳过上限预估直接立军令状，是搜索策略项目最常见的翻车姿势。'),
        sourceRefs: [
          {
            briefId: 'D2',
            briefSection: '策略产品应用场景§2',
            externalTitle: '搜索策略产品经理方法论',
            externalUrl: 'https://www.woshipm.com/pmd/5462622.html',
          },
        ],
      },
    },
    {
      blockId: 'search-06-b9',
      type: 'steps',
      heading: 'Badcase 分层归因与闭环',
      payload: {
        orientation: 'vertical',
        steps: [
          { title: '① 先分召回还是排序', description: rt('Gold 文档根本没进候选集，查解析、切片、Embedding、索引；已召回但排得靠后，再查融合与重排。'), badge: '关键' },
          { title: '② 逐层下钻', description: rt('按漏斗层级定位到具体模块：QP 信号错了、召回通道漏了、还是排序分数错了——每一层有每一层的修法。') },
          { title: '③ 三要素成文', description: rt('评测集、指标、结论：评测集保证数量与质量，指标既要体现好坏也要暴露问题位置，分析落四列——case、实际值、预测值、是否正确。') },
          { title: '④ 回灌与门禁', description: rt('线上人工确认的 badcase 持续回灌为回归评测集，把指标阈值接入上线门禁，防止同类问题复发。'), badge: '闭环' },
        ],
        sourceRefs: [
          {
            briefId: 'D2',
            briefSection: '策略产品应用场景§2',
            externalTitle: '智源社区《Bad case 治疗术》',
            externalUrl: 'https://hub.baai.ac.cn/view/39019',
          },
          {
            briefId: 'D2',
            briefSection: '策略产品应用场景§2',
            externalTitle: 'RAG 评测与 Badcase 归因',
            externalUrl: 'https://stack.i-tudou.com/devpedia-hub/interview/career-planning/knowledge-notes/llm-app/rag-evaluation-interview.html',
          },
        ],
      },
    },
    {
      blockId: 'search-06-b10',
      type: 'quote',
      payload: {
        text: '相关性通常和搜索效率指标冲突：过滤掉诱导点击的文档可能带来点击率下降。相关性策略的目标是平衡相关性与效率，约束排序以避免过度追求点击而忽视用户满意度。',
        attribution: '博客园《搜索排序：相关性》（D2 调研引用）',
        variant: 'warning',
        sourceRefs: [
          {
            briefId: 'D2',
            briefSection: '算法详解·四',
            externalTitle: '搜索排序相关性五档标准与评估指标',
            externalUrl: 'https://www.cnblogs.com/the-big-bang/articles/18619877',
          },
        ],
      },
    },
  ],
  keyTakeaways: [
    '相关性 ≠ 点击率：标题党高点击低相关要过滤，冷门品高相关低点击要保护，独立相关性模型刻意避开 CTR 统计特征。',
    '相关性项目的汇报口径是 BadCase 率与 NDCG（点评：-2.9pp / +2pp），不是 CTR——短期 CTR 下降是预期内的代价。',
    '电商多目标融合用 price × pCTR × pCVR 起步；进阶是阿里 PE-LTR 帕累托框架与淘宝借鉴 ESMM 的全空间建模。',
    '重排工具箱：MMR 折中、DPP 全局、类目/店铺打散与广告位规则——重排是 PM 可自主迭代的战场。',
    'badcase 先判“召回没回来”还是“排序排错”再逐层下钻；目标制定走基准线、上限、A/B、风险四步。',
  ],
  relatedSections: ['search-05', 'rec-06', 'rec-07', 'eval-05'],
  diagramsUsed: ['fig-relevance-vs-ctr'],
  updatedAt: '2026-09-10',
};

// ============================================================
// 篇章导出
// ============================================================

const searchSections: Section[] = [search01, search02, search03, search04, search05, search06];

export const chapterSearch: Chapter = {
  chapterId: 'ch-search',
  slug: 'search',
  order: 1,
  title: '搜索篇',
  subtitle: '从“用户敲下一个词”到“结果排定顺序”的完整链路：建立搜索系统的全景认知与策略抓手地图。',
  icon: 'search',
  themeColor: '#2563EB',
  sections: searchSections,
  learningGoals: [
    '能徒手画出搜索多阶段漏斗，说清各层候选量级、典型模型与延迟约束',
    '能拆解 QP 九模块 Pipeline，指出每个模块给下游生产什么信号、策略抓手是什么',
    '掌握纠错、改写、意图识别三大杠杆的收益数据与误伤边界（误纠比漏纠更伤体验）',
    '理解倒排索引、BM25 与向量召回的互补关系，会做召回通道增删、配额分配与超时降级决策',
    '能在相关性约束下设计搜索多目标融合与重排混排策略，并用分层归因法处理 badcase',
  ],
};

export default chapterSearch;
