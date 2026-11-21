// ============================================================
// 篇章六：工程架构与协作篇（chapter-system.ts）
// 素材来源：D8（工程架构与协作简报），少量引用 D2/D3/D4/D6
// 对应 IA：site_ia.md 第 2 节「篇章六：工程与协作篇」5 个小节（eng-01 ~ eng-05）
// 篇章特有要求：零代码，全部落点是「产品该问的问题、该做的决策、该争取的资源」
// ============================================================

import type { Chapter, Section } from '../types';

export const chapterSystem: Chapter = {
  chapterId: 'ch-eng',
  slug: 'engineering-org',
  order: 6,
  title: '工程架构与协作篇',
  subtitle: '产品要懂的不是代码而是工程边界与协作界面——「这个逻辑该放哪一层」是每个策略需求的第一问。',
  icon: 'pipeline',
  themeColor: '#14B8A6',
  learningGoals: [
    '用「数据流 + 决策流」总公式与在线/近线/离线三层语言，判断任何策略需求应该落在哪一层',
    '拆解一次在线请求的延迟预算，理解预计算/异步化/降级三大优化思想与降级体验的产品决策权',
    '讲清搜索索引的全量/增量/实时构建流程，掌握 HNSW/IVF 选型与向量模型升级的一致性红线',
    '算清「时效收益 vs 工程投入」这笔账，能在天级/小时级/在线学习之间做业务匹配的决策',
    '拿到一份五类 13 问的技术评审 Checklist，会把技术债翻译成业务语言，会设计团队 OKR',
  ],
  sections: [
    {
      sectionId: 'eng-01',
      title: '系统分层：在线、近线、离线三层架构',
      tagline: '推荐 = 数据流 + 决策流；策略的时效性要求直接决定工程成本。',
      difficulty: 'foundational',
      estimatedMinutes: 10,
      keywords: ['推荐系统架构', '在线近线离线', '数据流', '决策流', '系统分层'],
    },
    {
      sectionId: 'eng-02',
      title: '在线链路：延迟预算、缓存与降级',
      tagline: '延迟是一个「预算」，每加一路召回、每加一个特征都是在花这个预算。',
      difficulty: 'intermediate',
      estimatedMinutes: 11,
      keywords: ['延迟预算', 'TP99', '缓存', '服务降级', 'GPU 推理', '算力成本'],
    },
    {
      sectionId: 'eng-03',
      title: '搜索工程：索引构建、分布式与向量基础设施',
      tagline: '搜索是读写分离架构；升级向量模型时「新旧索引如何切换」是产品必须问清的问题。',
      difficulty: 'intermediate',
      estimatedMinutes: 12,
      keywords: ['倒排索引', '全量索引', '增量索引', 'HNSW', 'IVF', '向量检索'],
    },
    {
      sectionId: 'eng-04',
      title: '特征、样本与模型更新频率',
      tagline: '模型时效性是一个「产品需求」——每提升一个时效档位，工程成本大幅上升。',
      difficulty: 'intermediate',
      estimatedMinutes: 11,
      keywords: ['特征平台', '样本拼接', '在线学习', '小时级训练', '特征一致性'],
    },
    {
      sectionId: 'eng-05',
      title: '协作界面：评审清单、技术债与分发负责人的组织视角',
      tagline: '分发负责人的杠杆不在模型在机制——评审问对问题、把技术债翻译成业务语言、设计好 OKR。',
      difficulty: 'advanced',
      estimatedMinutes: 12,
      keywords: ['技术评审', 'Checklist', '技术债', '团队配置', 'OKR 设计'],
    },
  ],
};

// ============================================================
// 小节正文
// ============================================================

export const engSections: Section[] = [
  // ----------------------------------------------------------
  // eng-01 系统分层：在线、近线、离线三层架构
  // ----------------------------------------------------------
  {
    sectionId: 'eng-01',
    chapterSlug: 'engineering-org',
    title: '系统分层：在线、近线、离线三层架构',
    tagline: '推荐 = 数据流 + 决策流；策略的时效性要求直接决定工程成本。',
    difficulty: 'foundational',
    estimatedMinutes: 10,
    keywords: ['推荐系统架构', '在线近线离线', '数据流', '决策流', '系统分层'],
    summary: [
      {
        text: '任何推荐/搜索系统都可拆成「数据流 + 决策流」两条流水线，并按「离线/近线/在线」三层组织。读完本节，你能判断任何一个策略逻辑该放哪一层，以及这个选择背后的工程成本。',
      },
    ],
    blocks: [
      {
        blockId: 'eng-01-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: [
            { text: '这一节是全篇的地基。读完你能拿走两样东西：一个是', },
            { text: '「数据流 + 决策流」总公式', marks: ['bold'] },
            { text: '，任何搜推系统都套得进去；另一个是', },
            { text: '「离线 / 近线 / 在线」三层语言', marks: ['bold'] },
            { text: '——以后每提一个策略需求，先问「这个逻辑该放哪一层」，你就知道自己在跟谁要资源、要多少。' },
          ],
        },
      },
      {
        blockId: 'eng-01-b2',
        type: 'paragraph',
        payload: {
          content: [
            { text: '总公式是：', },
            { text: '推荐 = 数据流 + 决策流', marks: ['bold'] },
            { text: '。数据流在幕后转：埋点上报 → Kafka 日志采集 → 实时/离线数仓 → 特征生产 → 样本拼接 → 模型训练 → 模型/索引/特征发布上线。决策流在前台跑：用户请求 → 接入层 →（搜索场景多一步 QP）→ 多路召回 → 粗排 → 精排 → 重排/混排 → 返回结果。两条流通过「用户行为回流到埋点」和「模型发布加载到在线」咬合成一个闭环。' },
          ],
          sourceRefs: [
            { briefId: 'D8', briefSection: '一·1.1', externalUrl: 'https://time.geekbang.org/column/article/6495' },
          ],
        },
      },
      {
        blockId: 'eng-01-b3',
        type: 'diagram',
        payload: {
          diagramId: 'fig-data-decision-loop',
          caption: '数据流 + 决策流：两条流水线咬合成的闭环',
          altText: '上下两条流水线：上方为在线决策流，从用户请求经接入、召回、粗排、精排、重排到返回结果；下方为数据流，从埋点经日志、特征、样本到模型训练。右端用户行为回流到埋点，左端模型发布升回在线加载，构成闭环。',
        },
      },
      {
        blockId: 'eng-01-b4',
        type: 'paragraph',
        payload: {
          content: [
            { text: '三层架构的定义业界高度一致（Netflix 的架构被引用最广），建议直接背下来：', },
            { text: '离线层不用实时数据、不提供实时服务', marks: ['bold'] },
            { text: '，天级批量跑最大计算量；', },
            { text: '近线层用实时数据、不保证实时服务', marks: ['bold'] },
            { text: '，Flink 流式消费行为日志，算好结果写缓存供在线读取，越快越好但不强求几十毫秒；', },
            { text: '在线层用实时数据、必须保证实时服务', marks: ['bold'] },
            { text: '，百毫秒级 SLA 直接响应请求。' },
          ],
          sourceRefs: [
            { briefId: 'D8', briefSection: '一·1.2', externalUrl: 'https://blog.csdn.net/u012921921/article/details/108873190' },
          ],
        },
      },
      {
        blockId: 'eng-01-b5',
        type: 'diagram',
        payload: {
          diagramId: 'fig-three-layer-architecture',
          caption: '在线 / 近线 / 离线三层架构：士兵、支援与大后方',
          altText: '三条横向泳道：离线层跑天级训练与标签挖掘，近线层用 Flink 流式生产实时特征与样本，在线层承接请求经召回、粗排、精排、重排返回结果。层与层之间用特征、模型、索引发布箭头连接，在线层的用户行为经埋点回流到离线层形成闭环。',
        },
      },
      {
        blockId: 'eng-01-b6',
        heading: '三层速记：一个比喻 + 一张对照表',
        type: 'table',
        payload: {
          caption: '在线 / 近线 / 离线三层定义对照（建议背诵）',
          columns: [
            { key: 'layer', title: '层级' },
            { key: 'data', title: '是否用实时数据' },
            { key: 'service', title: '是否保证实时服务' },
            { key: 'tasks', title: '典型任务' },
            { key: 'metaphor', title: '比喻' },
          ],
          rows: [
            { layer: '在线层', data: '是', service: '是（百毫秒 SLA）', tasks: '召回/粗排/精排/重排、实时特征读取', metaphor: '前方冲锋的士兵' },
            { layer: '近线层', data: '是', service: '否（越快越好）', tasks: '实时特征统计、实时样本生成、实时协同过滤', metaphor: '搭桥修路的前方支援' },
            { layer: '离线层', data: '否', service: '否（天级批量）', tasks: '模型训练、标签挖掘、长期兴趣、全量索引构建', metaphor: '产粮造军火的大后方' },
          ],
          sourceRefs: [
            { briefId: 'D8', briefSection: '一·1.2', externalUrl: 'https://blog.csdn.net/u012921921/article/details/108873190' },
          ],
        },
      },
      {
        blockId: 'eng-01-b7',
        heading: '产品的第一问：这个逻辑放哪一层？',
        type: 'keypoints',
        payload: {
          layout: 'grid-3',
          items: [
            {
              title: '放在线层：占延迟预算',
              description: [{ text: '逻辑直接参与一次请求的百毫秒窗口。每加一个环节都在花延迟预算，需要评估耗时、并行化与降级预案。' }],
              icon: 'clock',
              sourceRefs: [{ briefId: 'D8', briefSection: '一·1.2' }],
            },
            {
              title: '放离线层：有一天延迟',
              description: [{ text: '最便宜、算力最宽裕，但用户行为或物品信息的变更要等一天甚至更久才反映到结果里。适合长期画像与重训练。' }],
              icon: 'warehouse',
              sourceRefs: [{ briefId: 'D8', briefSection: '一·1.2' }],
            },
            {
              title: '放近线层：折中方案',
              description: [{ text: '分钟级把实时行为算成特征/候选写入缓存，在线层只做读取。「要时效但扛不起在线计算」的逻辑大多落在这里。' }],
              icon: 'bridge',
              sourceRefs: [{ briefId: 'D8', briefSection: '一·1.2' }],
            },
          ],
        },
      },
      {
        blockId: 'eng-01-b8',
        type: 'paragraph',
        payload: {
          content: [
            { text: '三层之上，在线链路内部还是一个级联漏斗：召回（宁错召不漏召）→ 粗排（快速砍低质）→ 精排（精准预估）→ 重排（多样性、频控、配额）。注意一个关键事实：', },
            { text: '策略密度最高的是重排层', marks: ['bold'] },
            { text: '——多样性、频控、商业化配额、冷启扶持、流量调控大多落在重排，而这些恰恰是策略产品可以自主迭代、不一定要改模型的部分。晋升分发负责人后，你大部分的「自主决策权」都长在这一层。' },
          ],
          sourceRefs: [
            { briefId: 'D8', briefSection: '一·1.3', externalUrl: 'https://mianshidashi.cn/interview-questions/alibaba/algorithm-engineer/alibaba-algorithm-data-structures-c9353c21' },
          ],
        },
      },
      {
        blockId: 'eng-01-b9',
        type: 'case',
        payload: {
          company: 'Netflix',
          companyLogoKey: 'netflix',
          scenario: '个性化推荐的三层架构原型',
          background: [{ text: '推荐系统要同时满足两个互相矛盾的要求：用海量历史数据训练复杂模型（慢、重），以及在用户打开 App 的瞬间给出结果（快、轻）。业界需要一套能兼顾「算力规模」与「响应时效」的架构范式。' }],
          approach: [{ text: 'Netflix 把系统按「是否用实时数据、是否保证实时服务」两个维度切成离线/近线/在线三层：离线层承担最大计算量（模型训练、标签挖掘）；近线层用流式计算消费实时行为、把结果预写入缓存；在线层只做最轻的实时组装与响应。这套分层后来被国内几乎所有大厂沿用，成为搜推架构的默认语言。' }],
          results: [
            { metric: '架构影响', value: '「离线-近线-在线」三层划分成为业界引用最广的推荐架构范式' },
          ],
          lesson: '给策略 PM 的启示：分层不是工程洁癖，而是「时效性要求」与「算力成本」的显式权衡表——你的每个需求都在这张表上选位置。',
          sourceRefs: [
            { briefId: 'D8', briefSection: '一·1.2', externalTitle: '极客时间《Netflix 个性化推荐架构》', externalUrl: 'https://time.geekbang.org/column/article/6495' },
          ],
        },
      },
      {
        blockId: 'eng-01-b10',
        type: 'quote',
        payload: {
          variant: 'principle',
          text: '实际上工程实现才是推荐系统的骨架，如果没有很好的软件实现，算法不能落地产生效果，产品不能顺畅地服务用户，不能顺利地收集到用户的反馈。',
          attribution: '极客时间《推荐系统三十六式》',
          sourceRefs: [
            { briefId: 'D8', briefSection: '一·1.1', externalUrl: 'https://time.geekbang.org/column/article/6495' },
          ],
        },
      },
    ],
    keyTakeaways: [
      '推荐 = 数据流 + 决策流：前者离线/近线转，后者在线跑，靠行为回流与模型发布咬合成闭环。',
      '离线层不用实时数据不保证实时服务（天级），近线层用实时数据不保证实时服务（流式），在线层两者都要（百毫秒 SLA）。',
      '每个策略需求先问「放哪一层」：在线占延迟预算、离线有一天延迟、近线是折中。',
      '重排是策略密度最高的一层：多样性、频控、配额、扶持大多落在这里，且多数不需要改模型。',
      '算法只是零件，工程实现才是骨架——懂分层语言，才能跟工程团队谈资源。',
    ],
    relatedSections: ['rec-01', 'search-01', 'eng-02', 'eng-04'],
    diagramsUsed: ['fig-data-decision-loop', 'fig-three-layer-architecture'],
    updatedAt: '2026-09-01',
  },
  // ----------------------------------------------------------
  // eng-02 在线链路：延迟预算、缓存与降级
  // ----------------------------------------------------------
  {
    sectionId: 'eng-02',
    chapterSlug: 'engineering-org',
    title: '在线链路：延迟预算、缓存与降级',
    tagline: '延迟是一个「预算」，每加一路召回、每加一个特征都是在花这个预算。',
    difficulty: 'intermediate',
    estimatedMinutes: 11,
    keywords: ['延迟预算', 'TP99', '缓存', '服务降级', 'GPU 推理', '算力成本'],
    summary: [
      {
        text: '一次在线请求约 50-70ms、SLA 约 100ms。本节拆解延迟预算的每一分钱花在哪，讲清预计算/异步化/降级三大优化思想，以及降级时用户看到什么是产品决策。',
      },
    ],
    blocks: [
      {
        blockId: 'eng-02-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: [
            { text: '读完这一节，你在评审任何「加一路召回」「换一个更大的模型」的需求时，都能立刻问出那个关键问题：', },
            { text: '这要花多少延迟预算？', marks: ['bold'] },
            { text: '延迟不是技术指标，而是一份总额约 100ms 的预算表——每个环节都在花钱，超支的代价是用户流失。' },
          ],
        },
      },
      {
        blockId: 'eng-02-b2',
        type: 'diagram',
        payload: {
          diagramId: 'fig-latency-budget',
          caption: '在线请求延迟预算瀑布：总计约 50-70ms，SLA 约 100ms',
          altText: '横向瀑布条展示一次推荐请求的延迟构成：网络 5-10ms、召回约 10ms（多路并行、最慢一路决定整体）、特征获取 10-30ms、粗排 5ms、精排 GPU 10ms、重排 2ms、序列化 5ms，顶部标注 SLA 100ms 总标尺，各环节下挂超时截断、缓存兜底、默认召回等降级标签。',
        },
      },
      {
        blockId: 'eng-02-b3',
        type: 'table',
        payload: {
          caption: '典型推荐请求的延迟预算拆解（工业经验值）',
          columns: [
            { key: 'stage', title: '环节' },
            { key: 'latency', title: '典型耗时' },
            { key: 'note', title: '产品需要知道的点' },
          ],
          rows: [
            { stage: '网络传输', latency: '5-10ms', note: '客户端到服务端，基本不可压缩' },
            { stage: '多路召回', latency: '约 10ms', note: '多路并发，最慢的一路决定整体——新增一路先问它多慢' },
            { stage: '特征获取', latency: '10-30ms', note: '从 Redis/HBase 拉用户与物品特征，特征来源越多越贵' },
            { stage: '粗排', latency: '约 5ms', note: '轻量双塔打分数千候选' },
            { stage: '精排', latency: '约 10ms（GPU）', note: '大模型集中地，换大模型=预算大项支出' },
            { stage: '重排', latency: '约 2ms', note: '规则+轻模型，策略 PM 的主战场其实不贵' },
            { stage: '序列化等', latency: '约 5ms', note: '协议开销' },
            { stage: '合计 / SLA', latency: '50-70ms / 约 100ms', note: '剩余 30-50ms 是给新需求的「预算余量」' },
          ],
          highlightRowKeys: [],
          sourceRefs: [
            { briefId: 'D8', briefSection: '二·2.2', externalUrl: 'https://juejin.cn/post/7610325062705168426' },
          ],
        },
      },
      {
        blockId: 'eng-02-b4',
        heading: '三大优化思想：省预算的通用套路',
        type: 'keypoints',
        payload: {
          layout: 'grid-3',
          items: [
            {
              title: '预计算',
              description: [{ text: '把不常变化的提前算好：用户长期兴趣 embedding、物品向量都在离线/近线算完入库，线上只做一次读取。能用空间换时间的，绝不在线现算。' }],
              icon: 'storage',
              sourceRefs: [{ briefId: 'D8', briefSection: '二·2.2', externalUrl: 'https://juejin.cn/post/7610325062705168426' }],
            },
            {
              title: '异步化',
              description: [{ text: '召回与特征获取并行发起而非串行等待。串行链路里每一环的延迟直接相加，并行后总时长≈最慢一环。评审时问一句「这几步能不能并行」往往能省出预算。' }],
              icon: 'parallel',
              sourceRefs: [{ briefId: 'D8', briefSection: '二·2.2', externalUrl: 'https://juejin.cn/post/7610325062705168426' }],
            },
            {
              title: '降级方案',
              description: [{ text: '某依赖超时/挂掉时快速返回默认值或缓存，避免整个请求失败。降级不是「不出问题」，而是「出问题时体验可控」。' }],
              icon: 'fallback',
              sourceRefs: [{ briefId: 'D8', briefSection: '二·2.2', externalUrl: 'https://juejin.cn/post/7610325062705168426' }],
            },
          ],
        },
      },
      {
        blockId: 'eng-02-b5',
        type: 'paragraph',
        payload: {
          content: [
            { text: '算力上同样要讲性价比。', },
            { text: '搜推系统不一定都要上 GPU', marks: ['bold'] },
            { text: '：召回、粗排和部分精排可以由优化后的 CPU 承载，只有大规模精排和生成式模型才必须 GPU 或混合部署。模型压缩是另一条省钱主线：FP32→FP16→INT8 量化显存逐级减半，蒸馏可以让模型缩小 2-5 倍还保住 95% 以上的性能——先蒸馏再量化，模型能缩小 10 倍以上、云实例费用降约 60%。' },
          ],
          sourceRefs: [
            { briefId: 'D8', briefSection: '二·2.2 与 四·4.2', externalUrl: 'https://www.ithome.com/0/988/929.htm' },
          ],
        },
      },
      {
        blockId: 'eng-02-b6',
        type: 'paragraph',
        payload: {
          content: [
            { text: '成本结构上有个分发负责人必须盯的账：训练型服务器 GPU 成本占比约 73%，推理型约 25%——', },
            { text: '训练贵短期、推理贵长期', marks: ['bold'] },
            { text: '。推理成本随 DAU×QPS 线性增长，是你的「单位经济」指标；而很多企业真正浪费的不是买贵了，是买完利用率低（有分析指出 GPU 利用率不到 52% 时自建就不划算）。由此推出一个产品级结论：', },
            { text: '不是所有流量都值得用最贵的模型', marks: ['bold'] },
            { text: '——级联漏斗本身就是分级服务（全库用索引、粗排用小模型、精排用大模型），还可以按用户价值、场景、请求深度进一步分级，比如低活用户走轻量链路。' },
          ],
          sourceRefs: [
            { briefId: 'D8', briefSection: '四·4.1 与 四·4.3', externalUrl: 'https://www.cloudnative-tech.com/p/7275/' },
          ],
        },
      },
      {
        blockId: 'eng-02-b7',
        type: 'paragraph',
        payload: {
          content: [
            { text: '稳定性方面记住一个多级降级框架：L0 正常 → L1 轻度（关掉非必要能力）→ L2 中度（缓存兜底、减少召回条数）→ L3 重度（静态兜底结果，只保接口可用）。召回层在漏斗最前端，它的稳定性直接决定全系统可用性——向量召回超时要有降级到其他通道的预案。', },
            { text: '而「降级时用户看到什么」是产品决策不是工程决策', marks: ['bold'] },
            { text: '：返回热门榜？上次缓存？运营池？这个答案必须写进需求文档，而不是等事故发生时由值班工程师临时决定。' },
          ],
          sourceRefs: [
            { briefId: 'D8', briefSection: '二·2.2', externalUrl: 'https://developer.cloud.tencent.com/article/2713642' },
          ],
        },
      },
      {
        blockId: 'eng-02-b8',
        type: 'case',
        payload: {
          company: '爱奇艺',
          companyLogoKey: 'iqiyi',
          scenario: '精排 GPU 推理的批处理与量化优化',
          background: [{ text: '精排上 GPU 后出现典型问题：请求零散到达导致 GPU 大部分时间空转，利用率只有 30% 左右，TP99 延迟高达 15ms，既烧钱又占延迟预算。' }],
          approach: [{ text: '两个手段叠加：一是请求合并成 batch 再送 GPU 推理，把利用率打上去；二是用 TensorRT 做 FP16 量化，在保证效果的前提下压缩单次计算量。' }],
          results: [
            { metric: 'GPU 利用率', value: '30% → 70%' },
            { metric: 'TP99 延迟', value: '15ms → 8ms' },
            { metric: 'FP16 量化', value: '延迟降低 40%' },
          ],
          lesson: '给策略 PM 的启示：GPU 不是「上了就快」，利用率与量化才是成本大头——评审精排扩容需求时，先问现在的利用率和量化档位。',
          sourceRefs: [
            { briefId: 'D8', briefSection: '二·2.2 与 四·4.2', externalTitle: '稀土掘金《工业级推荐系统进阶》', externalUrl: 'https://juejin.cn/post/7610325062705168426' },
          ],
        },
      },
      {
        blockId: 'eng-02-b9',
        type: 'list',
        payload: {
          variant: 'checklist',
          items: [
            [{ text: '新需求上线前：它花多少延迟预算？全链路 TP99 变化多少？剩余预算还够吗？' }],
            [{ text: '新增召回通道前：这一路的耗时是否成为「最慢一路」？挤没挤占其他通道的预算？' }],
            [{ text: '换更大模型前：现有 GPU 利用率多少？量化/蒸馏空间榨干了吗？' }],
            [{ text: '每个在线依赖：超时后降级到哪一级？降级时用户看到什么（写进 PRD）？' }],
          ],
          sourceRefs: [
            { briefId: 'D8', briefSection: '二·2.2 与 三·3.2' },
          ],
        },
      },
      {
        blockId: 'eng-02-b10',
        type: 'quote',
        payload: {
          variant: 'principle',
          text: '延迟是一个「预算」：每加一路召回、每加一个特征来源、每换一个更大的模型，都是在花这个预算。',
          attribution: '工业级推荐系统经验法则',
          sourceRefs: [
            { briefId: 'D8', briefSection: '二·2.2', externalUrl: 'https://juejin.cn/post/7610325062705168426' },
          ],
        },
      },
    ],
    keyTakeaways: [
      '一次在线请求约 50-70ms、SLA 约 100ms；召回「最慢一路决定整体」，特征获取 10-30ms 是隐形大头。',
      '三大省预算套路：预计算（长期兴趣离线算）、异步化（并行代替串行）、降级方案（失败可控）。',
      '召回、粗排可跑 CPU；量化（FP16/INT8）与蒸馏是推理降本主线，爱奇艺 batch 合并把 GPU 利用率 30%→70%。',
      '训练贵短期、推理贵长期；推理成本随 DAU×QPS 线性增长，是分发负责人的单位经济指标。',
      '多级降级 L0-L3 里，「降级时用户看到什么」是产品决策，必须事先写进需求文档。',
    ],
    relatedSections: ['eng-01', 'eng-03', 'rec-07', 'llm-05'],
    diagramsUsed: ['fig-latency-budget'],
    updatedAt: '2026-09-01',
  },
  // ----------------------------------------------------------
  // eng-03 搜索工程：索引构建、分布式与向量基础设施
  // ----------------------------------------------------------
  {
    sectionId: 'eng-03',
    chapterSlug: 'engineering-org',
    title: '搜索工程：索引构建、分布式与向量基础设施',
    tagline: '搜索是读写分离架构；升级向量模型时「新旧索引如何切换」是产品必须问清的问题。',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    keywords: ['倒排索引', '全量索引', '增量索引', 'HNSW', 'IVF', '向量检索'],
    summary: [
      {
        text: '搜索是读写分离架构：索引构建分全量/增量/实时三条路，在线检索走分布式分片。本节讲清索引工程的关键节点、HNSW/IVF 的选型取舍，以及向量模型升级时的一致性红线。',
      },
    ],
    blocks: [
      {
        blockId: 'eng-03-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: [
            { text: '这一节解决两个评审高频场景：一是搜索侧「新文档多久能搜到」的时效问题，二是', },
            { text: '「升级向量模型」这类需求里最容易翻车的一致性问题', marks: ['bold'] },
            { text: '。核心认知一句话：搜索是读写分离架构——写（建索引）不影响读（在线检索），所有时效与一致性问题都在这个框架里讨论。' },
          ],
        },
      },
      {
        blockId: 'eng-03-b2',
        type: 'paragraph',
        payload: {
          content: [
            { text: '索引构建有三条入流通道。', },
            { text: '全量索引', marks: ['bold'] },
            { text: '是非常驻任务，从零重建整份索引，多版本隔离、出问题可回滚——首次冷启动、schema 变更、分词算法升级、定期「清账」都靠它。', },
            { text: '增量索引', marks: ['bold'] },
            { text: '是常驻任务：API 推送的数据经 Processor（分词/改写）→ Builder → Merger 构建增量并切换上线。', },
            { text: '实时索引', marks: ['bold'] },
            { text: '直接在内存建索引、秒级可见，但成本高、容量有限。产品要理解的取舍是：时效性越强的通道越贵、越脆弱。' },
          ],
          sourceRefs: [
            { briefId: 'D8', briefSection: '二·2.3', externalUrl: 'https://help.aliyun.com/zh/open-search/retrieval-engine-edition/' },
          ],
        },
      },
      {
        blockId: 'eng-03-b3',
        type: 'diagram',
        payload: {
          diagramId: 'fig-index-build',
          caption: '索引构建三通道：全量重建 + 增量常驻 + 实时内存',
          altText: '三条入流通道汇入在线索引：全量（非常驻任务，多版本隔离可回滚）、增量（常驻，API 数据经 Processor、Builder、Merger 构建后切换）、实时（内存建索引秒级可见）。在线索引放大为 partition 到 segment 的结构，标注段合并 IO 波动是查询周期性抖动的常见原因。',
        },
      },
      {
        blockId: 'eng-03-b4',
        type: 'quote',
        payload: {
          variant: 'insight',
          text: '实时更新有可能会丢数据，每次很少的丢失时间长了降低搜索引擎的质量。周期性的全量更新是解决这个问题的最直接的方法。',
          attribution: '有赞搜索团队《搜索引擎实践（工程篇）》',
          sourceRefs: [
            { briefId: 'D8', briefSection: '二·2.3', externalUrl: 'https://tech.youzan.com/search-engine1/' },
          ],
        },
      },
      {
        blockId: 'eng-03-b5',
        type: 'paragraph',
        payload: {
          content: [
            { text: '物理结构上，一个索引 = 多个 partition（分片）= 多个 segment（段，含倒排+正排），段要定期 merge。这里有一个产品可以直接用的排障知识：', },
            { text: '段合并的 IO 波动是搜索查询周期性抖动的常见原因', marks: ['bold'] },
            { text: '。下次遇到「查询延迟每天固定时段抖一下」，先怀疑 merge 或全量切换窗口，再怀疑模型。分布式层面，微信搜一搜的架构很有代表性：Leader 管分片映射与路由（控制流），Searcher 管在线召回（数据流），控制流与数据流分离；超大型搜索还要做冷热数据分离——冷数据排序靠后、对延迟和召回率容忍度更高，可以用更低成本的检索模式。' },
          ],
          sourceRefs: [
            { briefId: 'D8', briefSection: '二·2.3', externalUrl: 'https://www.infoq.cn/article/rsYIDJzNAPI2VOcG3KuP' },
          ],
        },
      },
      {
        blockId: 'eng-03-b6',
        type: 'case',
        payload: {
          company: '微信',
          companyLogoKey: 'wechat',
          scenario: '搜一搜的分布式索引架构演进',
          background: [{ text: '微信搜一搜要面对全网规模的文档量与高并发检索，单机索引放不下、也扛不住；同时搜索业务对一致性的要求相对宽松（不像交易数据要求强一致）。' }],
          approach: [{ text: '架构上把控制流与数据流分离：Leader 节点负责管理分片映射与路由，Searcher 节点提供在线召回；文档按 hash 分片写入。利用「一致性要求宽松」的业务特性，同分组的不同 Searcher 节点之间不做索引同步，用一致性换可用性与成本。再配合冷热数据分离：冷数据因排序靠后难得曝光，用更低成本的 TAAT 模式检索。' }],
          results: [
            { metric: '架构原则', value: '控制流与数据流分离，支撑全网级文档规模的在线检索' },
            { metric: '成本优化', value: '冷数据用低成本 TAAT 检索，热数据保证响应与召回' },
          ],
          lesson: '给策略 PM 的启示：分布式架构的每个设计都在回答「一致性、可用性、成本」的三角权衡——业务对一致性的容忍度本身就是可以变现的资源。',
          sourceRefs: [
            { briefId: 'D8', briefSection: '二·2.3', externalTitle: 'InfoQ《微信搜索引擎中索引的分布式演进》', externalUrl: 'https://www.infoq.cn/article/rsYIDJzNAPI2VOcG3KuP' },
          ],
        },
      },
      {
        blockId: 'eng-03-b7',
        type: 'paragraph',
        payload: {
          content: [
            { text: '向量检索是当下召回体系（以及 RAG）的公共底座。双塔把 user/item 编码成向量是离线/近线任务，线上只做 ANN 近似最近邻检索——暴力搜索是 O(N) 不可行，ANN 把复杂度降到近似 O(log N)，代价是牺牲 1-5 个点的召回率，换 100-1000 倍速度。主流索引的选型有明确经验法则：', },
            { text: '召回 topK 小（几百）用 HNSW，topK 大（约 2000）用 IVF，海量数据用 IVF-PQ', marks: ['bold'] },
            { text: '。' },
          ],
          sourceRefs: [
            { briefId: 'D8', briefSection: '二·2.4', externalUrl: 'https://blog.csdn.net/taoqick/article/details/143272728' },
          ],
        },
      },
      {
        blockId: 'eng-03-b8',
        type: 'table',
        payload: {
          caption: 'ANN 索引选型对照（HNSW / IVF / IVF-PQ / Flat）',
          columns: [
            { key: 'index', title: '索引' },
            { key: 'recall', title: '召回率' },
            { key: 'memory', title: '内存占用' },
            { key: 'fit', title: '适用场景' },
          ],
          rows: [
            { index: 'Flat（暴力）', recall: '100%', memory: '高', fit: '小规模 / 离线评测基准' },
            { index: 'IVF（倒排聚类）', recall: '95-98%', memory: '低', fit: '召回量大、内存敏感；广告大 topK 场景' },
            { index: 'HNSW（图索引）', recall: '97-99.5%', memory: '高（原始向量 1.5-2 倍）', fit: '低延迟高召回；推荐场景 topK 较小' },
            { index: 'IVF-PQ（量化）', recall: '有损', memory: '最低', fit: '海量数据、成本优先' },
          ],
          highlightRowKeys: [],
          sourceRefs: [
            { briefId: 'D8', briefSection: '二·2.4', externalUrl: 'https://javaup.chat/ai-interview/rag/vector-search-algorithms/' },
          ],
        },
      },
      {
        blockId: 'eng-03-b9',
        type: 'paragraph',
        payload: {
          variant: 'warning',
          content: [
            { text: '两条一致性红线。其一，', },
            { text: '索引一致性', marks: ['bold'] },
            { text: '：Embedding 模型升级时全量 item 必须重新编码并重建索引，否则新旧向量不在同一空间、检索结果错乱——评审「升级向量模型」需求时必问三句：新旧索引如何切换？灰度期间新旧模型产出的向量是否混用？量化/降维损失多少召回率？其二，', },
            { text: '特征一致性', marks: ['bold'] },
            { text: '：有真实事故中离线特征用「T-1 日余额变化率」、线上误用「T 日实时值」，数百笔正常交易被误判。验收任何特征需求，都要问「在线/离线口径是否同源、有无一致性监控」。' },
          ],
          sourceRefs: [
            { briefId: 'D8', briefSection: '二·2.4 与 二·2.1', externalUrl: 'https://blog.csdn.net/cuiyingchan0663/article/details/100493402' },
          ],
        },
      },
    ],
    keyTakeaways: [
      '搜索是读写分离：全量（可回滚、定期清账）+ 增量（常驻切换）+ 实时（内存秒级可见、贵且容量有限）。',
      '段合并的 IO 波动是查询周期性抖动的常见原因——遇到定时抖动先查 merge 与全量切换窗口。',
      '微信搜一搜范式：Leader 管控制流、Searcher 管数据流；一致性容忍度可以换可用性与成本。',
      'ANN 选型经验：推荐小 topK 用 HNSW、广告大 topK 用 IVF-PQ、海量数据用 IVF-PQ、评测基准用 Flat。',
      '升级向量模型的红线是全量重编码重建索引；验收特征需求必问在线/离线口径是否同源。',
    ],
    relatedSections: ['search-04', 'eng-04', 'rec-03', 'llm-01'],
    diagramsUsed: ['fig-index-build'],
    updatedAt: '2026-09-01',
  },
  // ----------------------------------------------------------
  // eng-04 特征、样本与模型更新频率
  // ----------------------------------------------------------
  {
    sectionId: 'eng-04',
    chapterSlug: 'engineering-org',
    title: '特征、样本与模型更新频率',
    tagline: '模型时效性是一个「产品需求」——每提升一个时效档位，工程成本大幅上升。',
    difficulty: 'intermediate',
    estimatedMinutes: 11,
    keywords: ['特征平台', '样本拼接', '在线学习', '小时级训练', '特征一致性'],
    summary: [
      {
        text: '数据流五环节（埋点→日志→特征→样本→训练发布）是所有策略的地基。本节用小红书天级→小时级训练的案例，讲清模型更新频率谱系与「时效收益 vs 工程投入」的算账方法。',
      },
    ],
    blocks: [
      {
        blockId: 'eng-04-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: [
            { text: '读完这一节，你能回答两个晋升答辩里的高频问题：', },
            { text: '「我们的模型多久更新一次，为什么是这个频率？」', marks: ['bold'] },
            { text: '以及「要不要升级到小时级/实时，投入产出怎么算？」模型时效性不是技术指标，而是一个要算清账的产品需求。' },
          ],
        },
      },
      {
        blockId: 'eng-04-b2',
        type: 'steps',
        payload: {
          orientation: 'horizontal',
          cyclic: false,
          steps: [
            {
              title: '① 埋点上报',
              description: [{ text: '客户端/服务端记录曝光、点击、停留、互动。埋点质量是一切策略的地基：缺失或口径错误会让下游特征、样本、评估全部失真。' }],
              badge: '地基',
            },
            {
              title: '② 日志传输',
              description: [{ text: '行为日志写入 Kafka 等消息队列，分流到实时链路（Flink）与离线链路（Hive/MaxCompute/Spark）。' }],
            },
            {
              title: '③ 特征生产',
              description: [{ text: '离线特征（T+1 画像与统计）+ 实时特征（最近 1 小时点击数、实时序列），由特征平台统一管理。' }],
            },
            {
              title: '④ 样本生成',
              description: [{ text: '特征与 label（是否点击/时长）按时间戳拼接成训练样本——拼接窗口对齐是样本质量的关键。' }],
            },
            {
              title: '⑤ 训练与发布',
              description: [{ text: '模型训练完成发布到在线推理服务，特征同步到在线 KV 存储（Redis/Hologres/Tablestore）。' }],
            },
          ],
          sourceRefs: [
            { briefId: 'D8', briefSection: '二·2.1', externalUrl: 'https://comingbar.com/ai-architecture/recommendation-system-architecture' },
          ],
        },
      },
      {
        blockId: 'eng-04-b3',
        type: 'paragraph',
        payload: {
          content: [
            { text: '五环节里产品最该盯的是特征生产。特征平台（FeatureStore）的核心价值是', },
            { text: '保证离线在线特征一致性', marks: ['bold'] },
            { text: '，并支持实时特征视图（如 1 小时窗口的点击/转化数）。为什么一致性这么重要，上一节的真实事故已经讲过：离线用「T-1 日余额变化率」、线上误用「T 日实时值」，数百笔正常交易被误判。特征有四类语言——ID 类、交叉、统计、实时，统计特征还要按「长期/短期/超短期」多时间窗构造；每多一个实时特征，都意味着一条流式链路和其稳定性成本。' },
          ],
          sourceRefs: [
            { briefId: 'D8', briefSection: '二·2.1', externalUrl: 'https://help.aliyun.com/zh/pai/feature-platform-featurestore/' },
            { briefId: 'D4', briefSection: '算法详解§2' },
          ],
        },
      },
      {
        blockId: 'eng-04-b4',
        type: 'paragraph',
        payload: {
          content: [
            { text: '模型更新频率是一条谱系，而非开关：', },
            { text: '全量更新', marks: ['bold'] },
            { text: '（天级跑 1 个 epoch、shuffle、更新全部参数，最稳最慢）→ ', },
            { text: '增量更新', marks: ['bold'] },
            { text: '（几十分钟一次、只更新 ID embedding，尽量实时追踪兴趣，但只看近期数据所以有偏）→ ', },
            { text: '完全在线学习', marks: ['bold'] },
            { text: '（如 DRN 强化学习，线上部分复杂、工程实现难度大）。每往右挪一档，实时样本链路、发布系统、稳定性的成本都大幅上升。' },
          ],
          sourceRefs: [
            { briefId: 'D8', briefSection: '二·2.5', externalUrl: 'https://longxingtan.gitbook.io/mle-interview/03_system/03_ml/recommendation' },
          ],
        },
      },
      {
        blockId: 'eng-04-b5',
        type: 'diagram',
        payload: {
          diagramId: 'fig-model-update-cadence',
          caption: '模型更新频率谱系：从天级全量到完全在线学习',
          altText: '横轴为时效性（天、小时、分钟、实时），纵轴为工程成本。三个节点：全量更新（天级）、增量更新（小时级，只更 sparse embedding）、完全在线学习（DRN）。图中内嵌小红书 base+增量架构：base 模型每日全量训练，增量模型每小时只更新 sparse embedding，发布改为 PS-worker 分离。',
        },
      },
      {
        blockId: 'eng-04-b6',
        type: 'case',
        payload: {
          company: '小红书',
          companyLogoKey: 'xiaohongshu',
          scenario: '推荐系统从天级到小时级训练的时效性升级',
          background: [{ text: '内容社区的兴趣漂移很快，天级训练的模型拿到的是「昨天的用户」；但全量模型每小时重训在算力与发布链路上都不现实，需要在时效与成本之间找一个工程上可行的中间档。' }],
          approach: [{ text: '采用 base + 增量方案：base 模型每天凌晨用前一天完整数据训练（与传统天级一致）；增量模型每小时只更新 sparse embedding、固定全连接网络参数。模型发布同步改造为 PS-worker 分离：worker（全连接参数）一天发布一次，PS（embedding KV 服务）每小时发布一次。' }],
          results: [
            { metric: '离线 AUC', value: '天级改小时级后提升接近 1 个百分点' },
            { metric: '收益来源', value: '大部分来自 sparse embedding 的更新' },
          ],
          lesson: '给策略 PM 的启示：时效性收益的大头往往在最便宜的参数上——先问「只更 embedding 能拿到几成收益」，再决定要不要全链路实时化。',
          sourceRefs: [
            { briefId: 'D8', briefSection: '二·2.5', externalTitle: '稀土掘金《小红书高时效推荐系统背后的技术升级》', externalUrl: 'https://juejin.cn/post/7225058326576939068' },
          ],
        },
      },
      {
        blockId: 'eng-04-b7',
        type: 'table',
        payload: {
          caption: '更新频率三档对照：收益、成本与业务匹配',
          columns: [
            { key: 'mode', title: '更新方式' },
            { key: 'cadence', title: '频率' },
            { key: 'cost', title: '工程成本' },
            { key: 'fit', title: '业务匹配' },
          ],
          rows: [
            { mode: '全量更新', cadence: '天级，shuffle 全量数据', cost: '低（成熟批处理链路）', fit: '兴趣稳定的业务：电商标品、工具型内容' },
            { mode: '增量更新', cadence: '几十分钟~小时级，只更 ID embedding', cost: '中（实时样本 + PS-worker 分离发布）', fit: '内容时效强的业务：新闻、热点、大促' },
            { mode: '完全在线学习', cadence: '样本级实时（如 DRN）', cost: '高（线上复杂、稳定性风险大）', fit: '头部平台核心场景，且团队有强工程储备' },
          ],
          sourceRefs: [
            { briefId: 'D8', briefSection: '二·2.5', externalUrl: 'https://longxingtan.gitbook.io/mle-interview/03_system/03_ml/recommendation' },
          ],
        },
      },
      {
        blockId: 'eng-04-b8',
        type: 'paragraph',
        payload: {
          content: [
            { text: '怎么算这笔账？分三步：先判断业务的', },
            { text: '时效敏感度', marks: ['bold'] },
            { text: '（内容时效强的业务——新闻、热点、大促——从小时级更新收益最大）；再评估增量方案的', },
            { text: '性价比', marks: ['bold'] },
            { text: '（小红书经验是「只更 sparse embedding」就拿到了大部分收益）；最后盘点工程前置条件——实时样本链路有没有？发布系统支不支持小时级？稳定性预案是什么？三个问题有一个答不上来，就先别许诺「实时」。' },
          ],
          sourceRefs: [
            { briefId: 'D8', briefSection: '二·2.5' },
          ],
        },
      },
    ],
    keyTakeaways: [
      '数据流五环节：埋点（地基）→ Kafka 日志 → 特征生产 → 样本拼接 → 训练发布，任何一环失真下游全错。',
      '特征平台的核心价值是离线在线一致性；特征分 ID/交叉/统计/实时四类，统计特征要多时间窗构造。',
      '更新频率是谱系：天级全量 → 小时级增量（只更 ID embedding、有偏）→ 完全在线学习（DRN，工程最难）。',
      '小红书小时级训练 AUC +1pt，收益大头来自 sparse embedding——先问最便宜的参数能拿几成收益。',
      '模型时效性是产品需求：内容时效强的业务收益最大，但每升一档都要算清工程投入。',
    ],
    relatedSections: ['eng-01', 'eng-03', 'rec-03', 'llm-03'],
    diagramsUsed: ['fig-model-update-cadence'],
    updatedAt: '2026-09-01',
  },
  // ----------------------------------------------------------
  // eng-05 协作界面：评审清单、技术债与分发负责人的组织视角
  // ----------------------------------------------------------
  {
    sectionId: 'eng-05',
    chapterSlug: 'engineering-org',
    title: '协作界面：评审清单、技术债与分发负责人的组织视角',
    tagline: '分发负责人的杠杆不在模型在机制——评审问对问题、把技术债翻译成业务语言、设计好 OKR。',
    difficulty: 'advanced',
    estimatedMinutes: 12,
    keywords: ['技术评审', 'Checklist', '技术债', '团队配置', 'OKR 设计'],
    summary: [
      {
        text: '本篇收束到「人」：产品与算法的分工边界、五类 13 问的技术评审 Checklist、技术债的偿还判断，以及分发负责人的团队配置与 OKR 设计。',
      },
    ],
    blocks: [
      {
        blockId: 'eng-05-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: [
            { text: '前五节讲的是系统，这一节讲组织。晋升分发负责人后，你的杠杆不再是某个策略，而是', },
            { text: '机制', marks: ['bold'] },
            { text: '：评审时能不能问对问题、技术债能不能翻译成业务语言、团队 OKR 能不能把大家指向同一个方向。这三件事做好了，模型自然越做越好。' },
          ],
        },
      },
      {
        blockId: 'eng-05-b2',
        type: 'paragraph',
        payload: {
          content: [
            { text: '先把分工边界说清楚。算法工程师的工作很聚焦：coding，为产品方案提供实现手段，但「更需要去理解业务目标及目标的组成」。策略 PM 的本质还是产品经理：发现业务与用户的问题，产出方案，通过数据的应用提升核心指标。协作分输入输出两侧——', },
            { text: '产品给算法的是目标与数据口径', marks: ['bold'] },
            { text: '（「现在追播放时长还是点击率」直接决定模型怎么训；「有效浏览」怎么定义是产品职责）；', },
            { text: '算法给产品的是离线指标', marks: ['bold'] },
            { text: '（AUC/召回率），而 PM 更关心业务收益，所以所有策略都要过 AB。' },
          ],
          sourceRefs: [
            { briefId: 'D8', briefSection: '三·3.1', externalUrl: 'https://www.niaogebiji.com/article-100776-1.html' },
          ],
        },
      },
      {
        blockId: 'eng-05-b3',
        type: 'keypoints',
        payload: {
          layout: 'grid-2',
          items: [
            {
              title: '评审共同明确的四点',
              description: [{ text: '模型目标、特征选择、数据采集、验收标准——这四点产品必须深度参与；数据预处理与调参只需理解原理，不必指手画脚。' }],
              sourceRefs: [
                { briefId: 'D8', briefSection: '三·3.1', externalUrl: 'https://stevenjokess.github.io/2bPM/chapter_introduction/AI_PM.html' },
              ],
            },
            {
              title: '协作节奏',
              description: [{ text: '需求启动前先联合数据团队做可行性评估（现有数据够不够）；日常站会 10-15 分钟（产品+算法+工程负责人）；周度复盘；卡点即时升级，不要憋到里程碑。' }],
              sourceRefs: [
                { briefId: 'D8', briefSection: '三·3.4', externalUrl: 'https://www.woshipm.com/ai/6321657.html' },
              ],
            },
          ],
        },
      },
      {
        blockId: 'eng-05-b4',
        type: 'paragraph',
        payload: {
          content: [
            { text: '技术方案评审是策略 PM 最高杠杆的日常动作。下面这份', },
            { text: '五类 13 问 Checklist', marks: ['bold'] },
            { text: '建议直接贴进你的评审模板：它把本篇前几节的工程知识（延迟预算、特征一致性、降级预案、更新频率、算力成本）全部转译成了「会上该问的话」。' },
          ],
          sourceRefs: [
            { briefId: 'D8', briefSection: '三·3.2' },
          ],
        },
      },
      {
        blockId: 'eng-05-b5',
        heading: '技术方案评审 Checklist：五类 13 问',
        type: 'list',
        payload: {
          variant: 'checklist',
          items: [
            [{ text: 'A1 指标评估：离线指标（AUC/Recall/NDCG）预期提升多少？离线到线上的折算关系是什么？' }],
            [{ text: 'A2 AB 怎么设计？核心指标与护栏指标（延迟/留存/负反馈）各是什么？周期多久、MDE 够不够？' }],
            [{ text: 'A3 模型目标和业务目标一致吗？（不一致是最常见的坑）' }],
            [{ text: 'B1 新特征数据从哪来？在线/离线口径是否同源？有无一致性监控？' }],
            [{ text: 'B2 特征时效性是 T+1、小时级还是实时？这个需求真的需要实时吗（实时特征成本高出数倍）？' }],
            [{ text: 'B3 埋点就绪了吗？缺失的要补多久？' }],
            [{ text: 'C1 这个改动花多少延迟预算？全链路 TP99 变化多少？' }],
            [{ text: 'C2 新增召回通道的召回量与耗时多少？挤不挤占其他通道预算？' }],
            [{ text: 'D1 依赖服务挂了/超时怎么办？降级后用户看到什么（热门榜/缓存/运营池）？' }],
            [{ text: 'D2 有无回滚方案？索引/模型是否多版本可回切？' }],
            [{ text: 'E1 训练和推理各增加多少算力成本？QPS 增长后成本线性还是超线性？' }],
            [{ text: 'E2 模型更新频率多少？发布链路支持这个频率吗？' }],
            [{ text: 'E3 排期是否预留 10-20% 弹性时间？（AI 项目进度不确定性高）' }],
          ],
          sourceRefs: [
            { briefId: 'D8', briefSection: '三·3.2', externalUrl: 'https://www.woshipm.com/ai/6321657.html' },
          ],
        },
      },
      {
        blockId: 'eng-05-b6',
        type: 'paragraph',
        payload: {
          content: [
            { text: '技术债是绕不开的排期博弈。', },
            { text: '该还的信号', marks: ['bold'] },
            { text: '：策略迭代明显变慢（一个简单重排规则要排期两周）、线上事故与告警频率上升、新同学上手周期过长、某模块成了所有需求的公共瓶颈。', },
            { text: '不急着还的信号', marks: ['bold'] },
            { text: '：业务方向未定型（重构完可能又要改）、有更大杠杆的项目排在前面——健康团队可以用「每两个 Sprint 一个清理周」的 20% 机制渐进偿还。产品在这里的角色不是催，而是', },
            { text: '把技术债翻译成业务语言', marks: ['bold'] },
            { text: '——迭代速度、事故损失、人力成本——在排期谈判中为重构争取额度，而不是等系统崩盘。' },
          ],
          sourceRefs: [
            { briefId: 'D8', briefSection: '三·3.3', externalUrl: 'https://www.atlassian.com/zh/agile/software-development/technical-debt' },
          ],
        },
      },
      {
        blockId: 'eng-05-b7',
        type: 'diagram',
        payload: {
          diagramId: 'fig-team-interface',
          caption: '四方协作界面：策略产品 / 算法工程 / 推荐架构 / 数据团队',
          altText: '四象限图：策略产品负责目标、指标口径与 AB 设计；算法工程负责模型与策略实现；推荐架构负责在线服务、离线数据流性能优化、推荐中台与算力 ROI；数据团队负责埋点、数仓、特征平台与实验平台。中心交接面标注输入侧（目标+数据口径）与输出侧（离线指标+业务收益）的双向箭头。',
        },
      },
      {
        blockId: 'eng-05-b8',
        type: 'case',
        payload: {
          company: '字节跳动',
          companyLogoKey: 'bytedance',
          scenario: '从推荐架构团队公开职责反推分发团队的四方配置',
          background: [{ text: '分发负责人要搭团队或盘点编制时，最常见的盲区是只盯着算法：召回排序模型有人做了，在线服务、特征平台、实验平台却没人兜底，策略迭代卡在工程上。' }],
          approach: [{ text: '从字节推荐架构团队的公开招聘职责可以反推出一个完整分发团队的四方分工：策略产品定目标、定指标口径、设计策略与 AB、复盘归因；算法工程负责模型与策略实现；推荐架构/工程负责在线服务与离线数据流性能优化、抽象通用组件建设推荐中台、对模型做轻量化改进，并建立评价体系科学监测系统算力的盈亏、提升资源 ROI；数据团队负责埋点、数仓、特征平台与实验平台。' }],
          results: [
            { metric: '架构团队职责', value: '在线服务/离线数据流优化 + 推荐中台 + 算力盈亏评价体系' },
          ],
          lesson: '给分发负责人的启示：盘点团队先看「缺哪一方」——算力盈亏有人衡量、中台组件有人抽象，策略团队的迭代速度才有保障。',
          sourceRefs: [
            { briefId: 'D8', briefSection: '三·3.4', externalTitle: '字节跳动推荐架构团队招聘职责描述', externalUrl: 'https://www.shixiseng.com/intern/inn_wm5kpaunu2y5' },
          ],
        },
      },
      {
        blockId: 'eng-05-b9',
        type: 'keypoints',
        payload: {
          layout: 'grid-2',
          items: [
            {
              title: 'OKR 目标设计三原则',
              description: [{ text: '深思熟虑、避免朝令夕改；指标少而精——设 10 个指标不如不设；避免既要又要还要，互斥目标同时压给团队是不可能实现的。' }],
              sourceRefs: [
                { briefId: 'D8', briefSection: '三·3.4', externalUrl: 'https://hub.baai.ac.cn/view/32285' },
              ],
            },
            {
              title: 'KR 设计三原则',
              description: [{ text: '反作弊——指标不能被短期运动拉高；及时性——能反映业务现状；action 相关性——团队的动作要和指标有因果关联。每季度 3-5 个目标、每个 2-4 个 KR，避免「照常营业目标」。' }],
              sourceRefs: [
                { briefId: 'D8', briefSection: '三·3.4', externalUrl: 'https://www.ibm.com/cn-zh/think/topics/okrs' },
              ],
            },
            {
              title: '指标要匹配场景',
              description: [{ text: '内容 Feed 看 DAU×分发量×时长——只优化 CTR 几乎必然引入标题党与低质内容；沉浸式短视频看 Session 时长，本质是时间竞争而非点击竞争。' }],
              sourceRefs: [
                { briefId: 'D8', briefSection: '三·3.4', externalUrl: 'https://www.cnblogs.com/GlenTt/p/19468670' },
              ],
            },
            {
              title: '协作界面的未来形态',
              description: [{ text: '行业正从「精巧特征工程」转向「计算换质量」：未来 OKR 要显式管理算力投入—效果产出的幂律关系，与工程的协作界面会从「特征口径」升级为「算力预算与推理成本」。' }],
              sourceRefs: [
                { briefId: 'D8', briefSection: '五·发展与前沿', externalUrl: 'https://juejin.cn/post/7508029170229035071' },
              ],
            },
          ],
        },
      },
      {
        blockId: 'eng-05-b10',
        type: 'quote',
        payload: {
          variant: 'principle',
          text: '指标少而精，less is more——设置 10 个指标让一个团队做，还不如不设置；避免很多公司的既要又要还要，同时做到多个互斥目标是不可能实现的。',
          attribution: '智源社区《如何做内容推荐策略产品》',
          sourceRefs: [
            { briefId: 'D8', briefSection: '三·3.4', externalUrl: 'https://hub.baai.ac.cn/view/32285' },
          ],
        },
      },
    ],
    keyTakeaways: [
      '分工边界：产品给算法目标与数据口径，算法给产品离线指标；所有策略最终以 AB 的业务收益说话。',
      '评审共同明确四点：模型目标、特征选择、数据采集、验收标准；五类 13 问 Checklist 覆盖指标/数据/延迟/降级/成本。',
      '技术债该还的信号是迭代变慢、事故频发、上手周期长；产品的角色是把它翻译成业务语言争取排期。',
      '完整分发团队四方配置：策略产品、算法工程、推荐架构（中台+算力 ROI）、数据团队。',
      'OKR 三原则：深思熟虑、少而精、拒绝既要又要；指标要匹配场景——只优化 CTR 必然引入标题党。',
    ],
    relatedSections: ['eval-01', 'eval-03', 'eng-01', 'llm-05'],
    diagramsUsed: ['fig-team-interface'],
    updatedAt: '2026-09-01',
  },
];
