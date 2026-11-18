// ============================================================
// 篇章二：推荐篇（chapter-rec.ts）
// 素材来源：D3（推荐召回简报）、D4（推荐排序与多目标简报），部分前沿点引用 D7
// 对应 IA：site_ia.md 第 2 节「篇章二：推荐篇」7 个小节（rec-01 ~ rec-07）
// ============================================================

import type { Chapter, Section } from '../types';

export const chapterRec: Chapter = {
  chapterId: 'ch-rec',
  slug: 'recommendation',
  order: 2,
  title: '推荐篇',
  subtitle: '推荐是「没有 Query 的搜索」：讲透召回-粗排-精排-重排四级漏斗上每一层的算法原理、能力边界与策略抓手。',
  icon: 'feed',
  themeColor: '#8B5CF6',
  learningGoals: [
    '画出推荐四级漏斗，说清各层候选量级、模型分工与「召回决定上限」的天花板效应',
    '掌握 CF/MF/双塔/序列/图召回的能力边界，会做多路召回的配额与融合决策',
    '复述精排从 LR 到 DIN/SIM/HSTU 的演进逻辑，理解「特征工程自动化史」这条主线',
    '会用 ESMM/MMoE/PLE 与融合公式做多目标权衡，理解调权重的业务含义',
    '掌握粗排蒸馏与重排 MMR/DPP 的机制，建立「策略抓手面板」的操作视角',
  ],
  sections: [
    {
      sectionId: 'rec-01',
      title: '推荐系统全景：四级漏斗与召回的天花板效应',
      tagline: '召回决定上限、精排决定精度、重排是策略主战场——漏斗思维是推荐一切讨论的前提。',
      difficulty: 'foundational',
      estimatedMinutes: 10,
      keywords: ['推荐系统架构', '召回粗排精排重排', '多路召回', '推荐漏斗'],
    },
    {
      sectionId: 'rec-02',
      title: '经典召回：协同过滤、矩阵分解与图方法',
      tagline: '从共现计数到隐向量，经典召回算法奠定了「用行为数据度量相似性」的底层逻辑。',
      difficulty: 'foundational',
      estimatedMinutes: 11,
      keywords: ['协同过滤', 'ItemCF', '矩阵分解', '图召回', 'EGES'],
    },
    {
      sectionId: 'rec-03',
      title: '双塔召回：工业界的事实标准与负采样艺术',
      tagline: '双塔被大规模采用的根本原因不是效果而是工程效率；负采样是召回训练最核心的工程问题。',
      difficulty: 'intermediate',
      estimatedMinutes: 12,
      keywords: ['双塔模型', '负采样', 'in-batch negative', 'logQ 修正', 'ANN'],
    },
    {
      sectionId: 'rec-04',
      title: '序列召回与多兴趣：从 YouTube DNN 到 SIM',
      tagline: '用户行为序列是推荐中信息密度最高的信号，序列建模的演进就是「更长的序列、更细的交互」。',
      difficulty: 'intermediate',
      estimatedMinutes: 12,
      keywords: ['YouTube DNN', '序列推荐', 'SASRec', '多兴趣召回', 'MIND', 'SIM'],
    },
    {
      sectionId: 'rec-05',
      title: '精排模型演进：从 LR 到 HSTU 的特征自动化史',
      tagline: '排序技术的演进史 = 特征工程的自动化史 + 优化目标的多元化史，两条线交织。',
      difficulty: 'advanced',
      estimatedMinutes: 13,
      keywords: ['CTR 预估', 'Wide&Deep', 'DeepFM', 'DIN', 'SIM', 'HSTU'],
    },
    {
      sectionId: 'rec-06',
      title: '多目标与多任务：ESMM、MMoE、PLE 与融合公式',
      tagline: '融合公式权重是分发负责人的「货币政策」，每次调权都是一次全局利益再分配。',
      difficulty: 'advanced',
      estimatedMinutes: 13,
      keywords: ['ESMM', 'MMoE', 'PLE', '多目标融合', '时长建模', 'LTV'],
    },
    {
      sectionId: 'rec-07',
      title: '粗排与重排：算力阀门与列表最优',
      tagline: '粗排管「算力预算」，重排管「列表整体最优」——重排是策略产品可自主迭代的主战场。',
      difficulty: 'intermediate',
      estimatedMinutes: 12,
      keywords: ['粗排', '知识蒸馏', '重排', 'MMR', 'DPP', '上下文感知'],
    },
  ],
};

// ============================================================
// 小节正文
// ============================================================

export const recSections: Section[] = [
  // ----------------------------------------------------------
  // rec-01 推荐系统全景：四级漏斗与召回的天花板效应
  // ----------------------------------------------------------
  {
    sectionId: 'rec-01',
    chapterSlug: 'recommendation',
    title: '推荐系统全景：四级漏斗与召回的天花板效应',
    tagline: '召回决定上限、精排决定精度、重排是策略主战场——漏斗思维是推荐一切讨论的前提。',
    difficulty: 'foundational',
    estimatedMinutes: 10,
    keywords: ['推荐系统架构', '召回粗排精排重排', '多路召回', '推荐漏斗'],
    summary: [
      {
        text: '推荐系统用「召回→粗排→精排→重排」四级漏斗解决亿级内容池与毫秒级延迟的矛盾。理解各层分工、量级与天花板效应，是分发负责人一切讨论的起点。',
      },
    ],
    blocks: [
      {
        blockId: 'rec-01-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: [
            { text: '推荐是「没有 Query 的搜索」：用户不告诉你要什么，系统要在一次请求的毫秒级窗口里，从亿级内容池中猜出他愿意消费的那几十条。工业界对这个问题的答案高度一致——', },
            { text: '不做一步到位，做四级漏斗', marks: ['bold'] },
            { text: '。召回快而全、精排准而贵、重排管体验与生态，每一层都是一次「算力换精度」的显式权衡。' },
          ],
          sourceRefs: [
            { briefId: 'D3', briefSection: '核心概念框架§1', externalUrl: 'https://developer.baidu.com/article/detail.html?id=7453206' },
          ],
        },
      },
      {
        blockId: 'rec-01-b2',
        type: 'diagram',
        payload: {
          diagramId: 'fig-rec-funnel',
          caption: '推荐系统四级漏斗：召回决定上限，重排是策略主战场',
          altText: '推荐漏斗架构图：顶层为用户画像与上下文，召回层由协同过滤、双塔、热点、标签、地域、关注等多路通道并行汇入，候选量级从亿级逐层收窄到万、千、百、十级，各层标注典型模型与延迟约束。',
        },
      },
      {
        blockId: 'rec-01-b3',
        type: 'paragraph',
        payload: {
          content: [
            { text: '为什么必须分层？算一笔账：100 万用户 × 100 万作品，对每个（用户, 作品）对做一次精排打分，是 ' },
            { text: '10¹² 次计算', marks: ['bold'] },
            { text: '；即便每次打分只要 1ms，全量打一遍也要约 ' },
            { text: '31.7 年', marks: ['bold'] },
            { text: '。所以分阶段不是工程洁癖，而是物理必然：先用便宜的模型把候选收窄，再把昂贵的模型花在刀刃上。漏斗越往后，候选越少、模型越复杂、单条打分的算力越奢侈。' },
          ],
          sourceRefs: [
            { briefId: 'D3', briefSection: '核心概念框架§1', externalUrl: 'https://jiehai-tech.cn/session/recommendation-system.html' },
          ],
        },
      },
      {
        blockId: 'rec-01-b4',
        heading: '四层分工：每一层回答一个不同的问题',
        type: 'keypoints',
        payload: {
          layout: 'grid-2',
          items: [
            {
              title: '召回（Match）：快而全',
              description: [{ text: '从百万/亿级底池选出千~万级候选，强调「宁错召不漏召」。技术以多路召回为主：协同过滤、双塔向量、热点、标签等并行。' }],
              sourceRefs: [
                { briefId: 'D3', briefSection: '核心概念框架§1', externalUrl: 'https://gitcode.net/CherryBean/AI-RecommenderSystem' },
              ],
            },
            {
              title: '粗排（Pre-ranking）：算力阀门',
              description: [{ text: '千级→百级，通常 20ms 内完成，主流是轻量双塔；典型场景下模型参数量仅为精排的 1/10。' }],
            },
            {
              title: '精排（Ranking）：准而贵',
              description: [{ text: '百级候选上跑 DIN/DIEN 等深度模型，融入最多特征做 pCTR/pCVR/时长等多目标预估，是算法密度最高点。' }],
            },
            {
              title: '重排（Rerank）：策略主战场',
              description: [{ text: '在精排结果上叠加去重、插入、打散、多样性等业务规则。按王喆的表述，这一层「主要是技术产品策略主导」——也是策略 PM 最能自主迭代的一层。' }],
            },
          ],
        },
      },
      {
        blockId: 'rec-01-b5',
        type: 'table',
        payload: {
          caption: '京东零售实践中的漏斗量级经验',
          columns: [
            { key: 'stage', title: '漏斗层级' },
            { key: 'input', title: '输入量级' },
            { key: 'output', title: '输出量级' },
            { key: 'focus', title: '核心关注点' },
          ],
          rows: [
            { stage: '召回', input: '亿级底池', output: '万级', focus: '召回率与计算效率的平衡' },
            { stage: '粗排', input: '万级', output: '千级', focus: '轻量模型，为精排减负' },
            { stage: '精排', input: '千级', output: '百级', focus: '深度模型精准多目标打分' },
            { stage: '策略/重排', input: '百级', output: '十级', focus: '业务规则、多样性、生态调控' },
          ],
          sourceRefs: [
            { briefId: 'D3', briefSection: '核心概念框架§1', externalUrl: 'https://juejin.cn/post/7433803180444237850' },
          ],
        },
      },
      {
        blockId: 'rec-01-b6',
        type: 'quote',
        payload: {
          variant: 'principle',
          text: '召回层是整个漏斗的「天花板」——任何内容如果没在召回阶段被捞出来，后面再强的精排模型也无能为力。',
          attribution: '工业界共识，短视频多路召回实践综述',
          sourceRefs: [
            { briefId: 'D3', briefSection: '核心概念框架§2', externalUrl: 'https://pengline.cn/2026/07/1253d04858e94ba2a6856cc795b01c8b/' },
          ],
        },
      },
      {
        blockId: 'rec-01-b7',
        type: 'paragraph',
        payload: {
          content: [
            { text: '为什么召回必须是「多路」的？因为单路召回里', },
            { text: '速度与召回率天然矛盾', marks: ['bold'] },
            { text: '：要快就得简化策略，简化就牺牲召回率。工业界的解法是多个简单策略叠加——少则 7/8 路、多则几十路。多路的价值有三重：', },
            { text: '多样性覆盖', marks: ['term'] },
            { text: '（不同策略刻画不同维度的匹配）、' },
            { text: '效率权衡', marks: ['term'] },
            { text: '（每路都是轻量算法）、' },
            { text: '鲁棒兜底', marks: ['term'] },
            { text: '（某一路失效时其他通道兜底，保证系统可用性）。用一句话概括：用多把尺子从不同维度衡量内容与用户的匹配，合并后交给下游。' },
          ],
          sourceRefs: [
            { briefId: 'D3', briefSection: '核心概念框架§3', externalUrl: 'https://blog.51cto.com/u_16213594/13285220' },
            { briefId: 'D3', briefSection: '核心概念框架§3', externalUrl: 'https://www.cnblogs.com/gczr/p/12564617.html' },
          ],
        },
      },
      {
        blockId: 'rec-01-b8',
        type: 'paragraph',
        payload: {
          content: [
            { text: '多路召回汇成一路的标准动作是「', },
            { text: '汇总 → 去重 → 按配额截断 → 交粗排', marks: ['bold'] },
            { text: '」。去重时要保留每条的通道来源与命中特征（一次多通道命中本身是强信号）；配额通常按各路的线上贡献（带来的曝光/转化）与多样性需求分配，通过 A/B 实验调整；新增召回路常用「保量探索」给一个小配额观察增量收益。进阶做法是配额模型化（美团按「召回方式 × 业务种类」叉乘建模）与配额随用户分层动态调整——高活跃用户可以承受更多探索，新用户需要更多热搜兜底。' },
          ],
          sourceRefs: [
            { briefId: 'D3', briefSection: '策略产品应用场景§1', externalUrl: 'https://tech.hipac.cn/archives/d5645d99116b40c8a7fdad70773b2bac' },
            { briefId: 'D3', briefSection: '策略产品应用场景§1', externalUrl: 'https://www.modb.pro/db/241611' },
          ],
        },
      },
      {
        blockId: 'rec-01-b9',
        type: 'case',
        payload: {
          company: '京东',
          companyLogoKey: 'jd',
          scenario: '零售推荐的漏斗量级设计',
          background: [{ text: '电商推荐的底池是亿级商品，而一次请求可用的排序算力只够覆盖百级候选，必须设计合理的逐层收窄比例。' }],
          approach: [{ text: '京东零售采用「召回亿级→万级、粗排万级→千级、精排千级→百级、策略百级→十级」的四级收窄，每一级用与该量级匹配的模型复杂度：召回侧重覆盖率，精排侧重精度，策略层承载业务规则。' }],
          results: [
            { metric: '召回层收窄比', value: '亿级 → 万级（约 4 个数量级）' },
            { metric: '全链路收窄比', value: '亿级 → 十级（约 6-7 个数量级）' },
          ],
          lesson: '各层收窄比例本身就是产品决策：收窄太狠会丢候选、太宽会打爆下游延迟预算。',
          sourceRefs: [
            { briefId: 'D3', briefSection: '核心概念框架§1', externalTitle: '京东零售推荐系统实践', externalUrl: 'https://juejin.cn/post/7433803180444237850' },
          ],
        },
      },
      {
        blockId: 'rec-01-b10',
        heading: '三个常见误区',
        type: 'list',
        payload: {
          variant: 'myths',
          items: [
            [{ text: '「用户看不到某类内容」就去调精排。正确反应是先排查召回覆盖率与配额——内容没进候选，精排无从发力。' }],
            [{ text: '把各路召回分数直接相加融合。不同通道的分数（cosine、共现分、热度、规则 rank）没有同一语义，必须先归一化或用 rank-based 融合，再用配额控制覆盖面。' }],
            [{ text: '指望重排解决所有生态问题。重排只能在百级候选上腾挪；结构性调控（新品扶持、垂类倾斜）应该在召回配额层做。' }],
          ],
          sourceRefs: [
            { briefId: 'D3', briefSection: '策略产品应用场景§1', externalUrl: 'https://mianshidashi.cn/interview-questions/baidu/algorithm-engineer/baidu-algorithm-multichannel-recall-score-fusion' },
          ],
        },
      },
    ],
    keyTakeaways: [
      '四级漏斗是「算力换精度」的显式权衡：亿级→万级→千级→百级→十级，每层模型复杂度递增。',
      '召回是漏斗天花板；诊断分发问题的第一反应是查召回覆盖率与配额，而非精排。',
      '多路召回解决速度与召回率的矛盾，兼具多样性覆盖与鲁棒兜底价值，工业界少则 7/8 路、多则几十路。',
      '重排是策略产品主导的一层；结构性调控放召回配额，体验性调控放重排。',
    ],
    relatedSections: ['rec-02', 'rec-03', 'rec-07', 'strategy-04'],
    diagramsUsed: ['fig-rec-funnel'],
    updatedAt: '2026-09-01',
  },
  // ----------------------------------------------------------
  // rec-02 经典召回：协同过滤、矩阵分解与图方法
  // ----------------------------------------------------------
  {
    sectionId: 'rec-02',
    chapterSlug: 'recommendation',
    title: '经典召回：协同过滤、矩阵分解与图方法',
    tagline: '从共现计数到隐向量，经典召回算法奠定了「用行为数据度量相似性」的底层逻辑。',
    difficulty: 'foundational',
    estimatedMinutes: 11,
    keywords: ['协同过滤', 'ItemCF', '矩阵分解', '图召回', 'EGES'],
    summary: [
      {
        text: 'UserCF/ItemCF、矩阵分解、图召回与知识图谱召回构成了召回算法的家族树。理解每条路线的机制与适用场景，是设计多路召回体系的基本功。',
      },
    ],
    blocks: [
      {
        blockId: 'rec-02-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: [
            { text: '一切召回算法的起点是协同过滤（CF）：' },
            { text: '用群体行为数据度量相似性', marks: ['bold'] },
            { text: '。UserCF「给用户推荐和他兴趣相似的其他用户喜欢的东西」（链路 U2U2I），ItemCF「给用户推荐和他之前喜欢的物品相似的物品」（链路 U2I2I）。思想朴素，但直到今天仍是多路召回里的主力通道。' },
          ],
          sourceRefs: [
            { briefId: 'D3', briefSection: '算法详解§1', externalUrl: 'https://developer.aliyun.com/article/1624238' },
          ],
        },
      },
      {
        blockId: 'rec-02-b2',
        type: 'diagram',
        payload: {
          diagramId: 'fig-cf-family-tree',
          caption: '召回算法家族树：从协同过滤到双塔的演进脉络',
          altText: '树状图：根节点为协同过滤（UserCF/ItemCF/Swing），向下演进为矩阵分解 MF、FM、双塔；侧枝为基于内容的召回、图召回（DeepWalk/Node2vec/EGES）与知识图谱召回（RippleNet/KGAT），每枝标注解决的问题与局限。',
        },
      },
      {
        blockId: 'rec-02-b3',
        type: 'table',
        payload: {
          caption: 'UserCF vs ItemCF：机制与适用场景',
          columns: [
            { key: 'dim', title: '维度' },
            { key: 'usercf', title: 'UserCF（U2U2I）' },
            { key: 'itemcf', title: 'ItemCF（U2I2I）' },
          ],
          rows: [
            { dim: '核心机制', usercf: '找 Top-N 近邻用户，推荐近邻喜欢而目标用户未消费的物品', itemcf: '离线算物品-物品共现相似度，按用户历史行为触发相似物品' },
            { dim: '适用场景', usercf: '用户少、物品多、时效性强（新闻、博客）', itemcf: '物品少、用户多、兴趣稳定持久（电商）' },
            { dim: '更新成本', usercf: '用户相似度随行为实时变化，更新频繁', itemcf: '物品相对稳定，相似度矩阵可低频离线更新' },
            { dim: '结果风格', usercf: '更可能发现惊喜（社会化推荐）', itemcf: '更聚焦、可解释（「因为你看过 X」）' },
          ],
          highlightRowKeys: [],
          sourceRefs: [
            { briefId: 'D3', briefSection: '算法详解§1', externalUrl: 'https://www.nowcoder.com/ta/review-ml/review?page=67' },
          ],
        },
      },
      {
        blockId: 'rec-02-b4',
        type: 'paragraph',
        payload: {
          content: [
            { text: 'ItemCF 的工业级改进是阿里提出的 ' },
            { text: 'Swing', marks: ['term'] },
            { text: '：计算物品相似度时惩罚「不相关用户对」的共现——两个毫不相似的用户同时点了两个物品，这次共现的权重应打折。这一改动显著提升了抗刷单、抗热点噪声的能力，是电商 I2I 召回的主力。' },
            { text: '但 CF 有根本局限：只用交互、不用内容属性，数据稀疏时相似度算不准；存在冷启动与「灰群」问题；热门物品被过度推荐（马太效应）。这些局限直接催生了矩阵分解。' },
          ],
          sourceRefs: [
            { briefId: 'D3', briefSection: '算法详解§1' },
          ],
        },
      },
      {
        blockId: 'rec-02-b5',
        type: 'formula',
        payload: {
          name: '矩阵分解（MF）',
          expression: 'R ≈ Uᵀ × V，评分预测 score(u, i) = ⟨U_u, V_i⟩',
          symbolNotes: [
            { symbol: 'R', meaning: '稀疏的用户-物品交互/评分矩阵' },
            { symbol: 'U / V', meaning: '用户/物品的 k 维隐向量，k 远小于矩阵维度' },
            { symbol: '⟨U_u, V_i⟩', meaning: '内积即相似度，可直接接入向量索引做召回' },
          ],
          intuition: [
            { text: '把「共现计数」升级为「隐向量泛化」：用户和物品都被压缩成稠密向量，挖掘隐含兴趣因子，缓解稀疏矩阵下相似度算不准的问题。副产品——用户向量与物品向量——天然可以进向量库做 ANN 检索，这就是 Embedding 召回的雏形。FM 进一步把「用户×物品」泛化为任意特征的二阶交互（隐向量内积），是连接 CF 与双塔的思想桥梁。' },
          ],
          sourceRefs: [
            { briefId: 'D3', briefSection: '算法详解§2', externalUrl: 'https://blog.csdn.net/weixin_42691585/article/details/109258437' },
          ],
        },
      },
      {
        blockId: 'rec-02-b6',
        type: 'paragraph',
        payload: {
          content: [
            { text: '把这条家族树连起来看：CF 用共现计数、MF 用隐向量泛化、FM 把「用户×物品」推广为任意特征二阶交互、双塔用深度网络产出向量——', },
            { text: '「隐向量内积」这条思想主线一路通到今天的 Embedding 召回', marks: ['bold'] },
            { text: '。对策略 PM 更实用的是冷启动场景下的通道选择：ItemCF 不可用（没有交互数据）；双塔需改造（去掉 ID embedding、靠内容特征）；类目/关键词召回与聚类召回对新发布内容最有效；Look-Alike 适合「发布一段时间但点击不高」的低曝光物品——把已交互用户作种子、取其向量均值作为物品向量，去向量库检索相似人群扩散。配套的流量杠杆：新物品保底配额、降低过滤等级、独立的新物品 AB 通道。' },
          ],
          sourceRefs: [
            { briefId: 'D3', briefSection: '策略产品应用场景§2', externalUrl: 'https://geekdaxue.co/read/xf015y@wo1guk/ud7yvq' },
          ],
        },
      },
      {
        blockId: 'rec-02-b7',
        type: 'diagram',
        payload: {
          diagramId: 'fig-graph-embedding',
          caption: '图召回：在用户-物品共现图上随机游走学习节点向量',
          altText: '用户-物品共现图局部，一条高亮随机游走路径；旁注 BFS（表达结构性）与 DFS（表达同质性）的跳转分岔；EGES 小图展示物品自身向量与类目、店铺、品牌等边信息向量加权聚合。',
        },
      },
      {
        blockId: 'rec-02-b8',
        heading: 'CF 之外的三条平行路线',
        type: 'keypoints',
        payload: {
          layout: 'grid-2',
          items: [
            {
              title: '基于内容的召回（u2c2i）',
              description: [{ text: '不依赖行为共现，用 TF-IDF/BERT/CNN 从物品自身属性算向量做相似检索。冷启动友好——新内容一发布就有向量；缺点是缺协同信号、易推荐「太像」的内容。' }],
              sourceRefs: [
                { briefId: 'D3', briefSection: '算法详解§3/§8/§9', externalUrl: 'https://www.cnblogs.com/xumaomao/p/17426115.html' },
                { briefId: 'D3', briefSection: '算法详解§9', externalUrl: 'https://www.6aiq.com/article/1605806449859' },
              ],
            },
            {
              title: '图 embedding 召回',
              description: [{ text: 'DeepWalk 在共现图上随机游走、把游走序列当句子训 Word2Vec；Node2vec 引入 BFS/DFS 权衡：BFS 做邻域「微观扫描」表达结构性，DFS 在大的集团内部游走表达同质性。' }],
            },
            {
              title: '知识图谱召回（u2g2i）',
              description: [{ text: 'RippleNet/KGAT 沿「用户→实体→物品」路径做关联召回，引入先验语义、增强可解释性；局限是严重依赖图谱连接模式、需手工设计元路径，多领域场景效果折损。' }],
            },
            {
              title: '策略性召回：策略 PM 的主战场',
              description: [{ text: '热点（分地域/分时段榜单）、地域（58 同镇用县/市/省三级地域 + 天/小时双粒度）、标签类目、关注社交、时效赛马、运营精选、缓存召回——不依赖重模型，由策略直接驱动。' }],
            },
          ],
        },
      },
      {
        blockId: 'rec-02-b9',
        type: 'case',
        payload: {
          company: '阿里巴巴',
          companyLogoKey: 'alibaba',
          scenario: '十亿级商品的图 embedding 召回（EGES, KDD\'18）',
          background: [{ text: '基础图 embedding 依赖行为序列构图，新商品没有行为就学不到向量——十亿级商品池里冷启动是常态，纯行为图方法覆盖不足。' }],
          approach: [{ text: 'EGES 引入 side information（类目、店铺、品牌等先验信息），将物品自身 embedding 与各类边信息 embedding 加权平均聚合：权重通过注意力式参数学习，用指数变换保证非负。新品没有行为时，边信息向量依然能给出合理表征。' }],
          results: [
            { metric: '覆盖规模', value: '淘宝十亿级商品 embedding' },
            { metric: '核心收益', value: '降低某类信息缺失造成的冷启动问题' },
          ],
          lesson: '没有复杂理论创新，但给出了「工程上融合多种 embedding」的范式——对策略 PM 的启示是：冷启动问题的解法往往在表征侧而非流量侧。',
          sourceRefs: [
            { briefId: 'D3', briefSection: '算法详解§8', externalTitle: 'EGES 解读（搜狐）', externalUrl: 'https://m.sohu.com/a/426732267_610522' },
          ],
        },
      },
      {
        blockId: 'rec-02-b10',
        heading: '选型速查：什么场景用哪路召回',
        type: 'list',
        payload: {
          items: [
            [{ text: '行为数据稠密、兴趣稳定（电商）：ItemCF/Swing 打底，性价比最高。' }],
            [{ text: '时效性强、物品高频更新（新闻）：UserCF + 热点召回优先。' }],
            [{ text: '新物品占比高（UGC）：内容向量召回 + EGES 式边信息聚合，CF 不可用。' }],
            [{ text: '需要可解释与先验语义（垂直领域）：知识图谱召回作为补充通道。' }],
            [{ text: '系统演进经验法则（阿里云）：冷启动期热门+分组热门 → 成长期协同过滤 → 成熟期 DSSM 向量+多路融合。' }],
          ],
          sourceRefs: [
            { briefId: 'D3', briefSection: '策略产品应用场景§2', externalUrl: 'https://help.aliyun.com/zh/pai/recall-algorithm-configuration' },
          ],
        },
      },
    ],
    keyTakeaways: [
      'UserCF 适合用户少物品多的时效场景，ItemCF 适合物品少用户多的稳定场景；Swing 惩罚不相关共现，抗刷单。',
      'CF 的稀疏、冷启动、马太效应局限催生了 MF：隐向量泛化，副产品可直接做 Embedding 召回。',
      '内容召回冷启动友好但易同质化；图召回利用拓扑结构，EGES 用边信息加权聚合解冷启动。',
      '策略性召回（热点/地域/标签/赛马/运营）不依赖重模型，是策略 PM 直接可控的召回通道。',
    ],
    relatedSections: ['rec-01', 'rec-03', 'rec-04', 'strategy-01'],
    diagramsUsed: ['fig-cf-family-tree', 'fig-graph-embedding'],
    updatedAt: '2026-09-01',
  },
  // ----------------------------------------------------------
  // rec-03 双塔召回：工业界的事实标准与负采样艺术
  // ----------------------------------------------------------
  {
    sectionId: 'rec-03',
    chapterSlug: 'recommendation',
    title: '双塔召回：工业界的事实标准与负采样艺术',
    tagline: '双塔被大规模采用的根本原因不是效果而是工程效率；负采样是召回训练最核心的工程问题。',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    keywords: ['双塔模型', '负采样', 'in-batch negative', 'logQ 修正', 'ANN'],
    summary: [
      {
        text: '双塔用「两塔解耦 + 一次内积」换来物品向量离线预计算的工程红利，成为 U2I 召回事实标准。真正决定双塔效果的是负采样：in-batch 负采样的热门偏差与 logQ 修正是必读一课。',
      },
    ],
    blocks: [
      {
        blockId: 'rec-03-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: [
            { text: '双塔源自微软 DSSM（2013），结构极简：用户塔与物品塔各自把特征编码成向量，两塔之间不相交，最后只做一次内积/余弦。它被推荐召回大规模采用的根本原因', },
            { text: '不是效果最好，而是工程上最划算', marks: ['bold'] },
            { text: '：两塔解耦意味着物品向量可以离线预计算、灌进 Faiss/Milvus 建索引，线上只需算一次用户向量再做 ANN TopK 检索，毫秒级完成亿级库的召回。' },
          ],
          sourceRefs: [
            { briefId: 'D3', briefSection: '算法详解§4', externalUrl: 'https://www.cnblogs.com/tlnshuju/p/19228429' },
          ],
        },
      },
      {
        blockId: 'rec-03-b2',
        type: 'diagram',
        payload: {
          diagramId: 'fig-twin-tower',
          caption: '双塔结构：物品塔离线预计算入向量库，用户塔线上实时计算',
          altText: '左右两座塔：用户塔（用户特征→Embedding→MLP→用户向量）与物品塔（物品特征→Embedding→MLP→物品向量）不相交，顶部汇合于内积节点输出相似分；物品塔下方标注离线预计算→向量库→ANN 索引，用户塔下方标注线上实时计算。',
        },
      },
      {
        blockId: 'rec-03-b3',
        heading: '双塔工程范式的三个关键决策',
        type: 'keypoints',
        payload: {
          layout: 'grid-2',
          items: [
            {
              title: '为什么离线存物品、线上算用户',
              description: [{ text: '每次召回只用一个用户向量，但要匹配几亿物品向量——线上算物品代价过大；且用户兴趣动态变化、物品特征相对稳定，所以物品离线算、用户线上算。' }],
              sourceRefs: [
                { briefId: 'D3', briefSection: '算法详解§4', externalUrl: 'https://rubyjiang18.github.io/posts/2024/06/blog-post-4/' },
                { briefId: 'D3', briefSection: '算法详解§4', externalUrl: 'https://blog.csdn.net/weixin_46838716/article/details/126179379' },
              ],
            },
            {
              title: '全量 + 增量的更新组合',
              description: [{ text: '全量更新天级（基于昨日参数续训一天数据、one epoch）；增量更新分钟级，只发布 embedding 层，让新内容新用户快速进入向量空间。' }],
            },
            {
              title: '增量更新是有偏的',
              description: [{ text: '小红书实践经验：只做增量更新效果不好——「只看一个小时的数据，它是有偏的，统计值跟全天差别很大」。增量追时效、全量纠偏，两者缺一不可。' }],
            },
            {
              title: '结构性缺陷：后期融合',
              description: [{ text: '用户与物品特征在最后一层才交互，特征交叉能力弱，上限低于精排模型。突破方向：SENet 双塔、PLE 多目标双塔，或干脆换掉 ANN 检索范式（见 TDM 案例）。' }],
            },
          ],
        },
      },
      {
        blockId: 'rec-03-b4',
        type: 'paragraph',
        payload: {
          content: [
            { text: '双塔真正的技术纵深在', },
            { text: '样本体系', marks: ['bold'] },
            { text: '。召回与精排的负样本有本质不同：精排负样本 = 曝光未点击；召回负样本 = 曝光未点击 + 全库负采样。为什么要加全库采样？保证离线训练与在线预测的数据分布一致（线上召回面对的是全库，不是曝光集），避免 SSB（样本选择偏差）。另一个铁律：曝光未点是「困难负样本」——用户可能感兴趣但没点，不能直接当召回负样本。', },
            { text: '召回区分「感兴趣与否」，精排区分「感兴趣的程度」', marks: ['highlight'] },
            { text: '，两个任务的样本语义不能混用。' },
          ],
          sourceRefs: [
            { briefId: 'D3', briefSection: '算法详解§5', externalUrl: 'https://docs.feishu.cn/v/wiki/Hp3SwPT8Di8TFdkExX3cyQDknKe/a1' },
          ],
        },
      },
      {
        blockId: 'rec-03-b5',
        type: 'formula',
        payload: {
          name: 'In-batch 负采样的 logQ 修正',
          expression: "修正后相似度 s'(u, i) = ⟨q_u, v_i⟩ − log(p_i)",
          symbolNotes: [
            { symbol: '⟨q_u, v_i⟩', meaning: '用户向量与物品向量内积（通常先 L2 归一化，再乘温度系数 1/τ）' },
            { symbol: 'p_i', meaning: '物品 i 在 batch 中被采样为负样本的概率，从流数据中估计' },
            { symbol: 'τ（温度系数）', meaning: '越大分布越平滑；过小则模型过度关注困难负样本——而那些样本很可能是潜在正样本' },
          ],
          intuition: [
            { text: 'In-batch 负采样把同 batch 其他样本的物品当负例，工程上极省，但隐式按物品出现频率采样：热门物品被更多地当负样本、被过度惩罚。logQ 修正就是从内积里减掉热门度的「水分」，让模型学到的是兴趣匹配而非流行度打压。Google（RecSys\'19）指出：从流数据估计采样概率并做修正，是改善模型性能的关键。' },
          ],
          sourceRefs: [
            { briefId: 'D3', briefSection: '算法详解§5', externalTitle: 'Google RecSys\'19 采样偏差修正解读', externalUrl: 'https://blog.csdn.net/Shallowmm/article/details/137211297' },
          ],
        },
      },
      {
        blockId: 'rec-03-b6',
        type: 'paragraph',
        payload: {
          content: [
            { text: '负采样还在持续演进：华为 ' },
            { text: 'CBNS', marks: ['term'] },
            { text: '（SIGIR\'21）用 FIFO memory bank 复用历史 batch 的物品向量，突破 batch size 对负样本数量的物理限制；Google ' },
            { text: 'MNS', marks: ['term'] },
            { text: '（WWW\'20）用混合负采样兼顾分布一致与难度分层。对策略 PM 而言，不需要推公式，但评审召回模型时必须问一句：负采样方案是什么、热门物品有没有被过度打压、离在线分布是否对齐。' },
          ],
          sourceRefs: [
            { briefId: 'D3', briefSection: '算法详解§5', externalUrl: 'https://developer.volcengine.com/articles/7391690781519839251' },
          ],
        },
      },
      {
        blockId: 'rec-03-b7',
        type: 'paragraph',
        payload: {
          content: [
            { text: '双塔线上检索的「最后一公里」是 ANN。主流索引的取舍：IVF 内存低、建索引快，靠 nprobe 调节召回率与速度；HNSW 检索亚毫秒级、召回率 97%~99.5%、原生支持增量插入，但内存高、建图慢。常用库有 Faiss、Hnswlib、Milvus、ScaNN。策略 PM 要建立一个直觉：' },
            { text: 'ANN 是「近似」的，线上召回率天然有损', marks: ['bold'] },
            { text: '——离线评估若用暴力检索，得到的召回率会系统性偏乐观，应与线上索引拓扑对齐。此外，embedding 模型升级时全库物品必须重编码重建索引，否则新旧向量不在同一空间，这是版本切换时必问的问题。' },
          ],
          sourceRefs: [
            { briefId: 'D3', briefSection: '算法详解§6', externalUrl: 'https://javaup.chat/ai-interview/rag/vector-search-algorithms/' },
          ],
        },
      },
      {
        blockId: 'rec-03-b8',
        type: 'diagram',
        payload: {
          diagramId: 'fig-ann-tradeoff',
          caption: 'ANN 索引的精度-速度权衡：线上召回率天然有损',
          altText: '散点图：横轴延迟、纵轴召回率。Flat 精确但慢，IVF 内存低召回率约 98%，HNSW 召回率 97%-99.5% 且亚毫秒但内存高，IVF-PQ 最快最省内存但有损；气泡大小表示内存占用。',
        },
      },
      {
        blockId: 'rec-03-b9',
        type: 'case',
        payload: {
          company: '阿里巴巴',
          companyLogoKey: 'alibaba',
          scenario: '突破双塔：TDM 树索引召回（KDD\'18）',
          background: [{ text: '双塔 + ANN 范式有两个天花板：一是「后期融合」特征交叉弱，二是 ANN 索引的检索目标（近似最近邻）与训练目标（点击率）不一致——模型学内积，检索找近邻，二者存在错位。' }],
          approach: [{ text: 'TDM 用最大堆树组织全库物品，把检索变成自顶向下的逐层 Beam Search：每一层都可以用复杂的用户-物品交互特征打分，「使得使用任意高级深度学习模型变得可能」，检索目标与训练目标重新对齐。' }],
          results: [
            { metric: '检索复杂度', value: 'O(N) → O(log N)' },
            { metric: '模型自由度', value: '召回阶段可用任意深度交互模型，不再受内积形式约束' },
          ],
          lesson: '当双塔内积形式成为瓶颈时，换检索范式比加深塔更有效——这是评估「要不要突破双塔」的判断框架。',
          sourceRefs: [
            { briefId: 'D3', briefSection: '发展与前沿§1', externalTitle: '阿里妈妈 TDM 技术解读', externalUrl: 'https://developer.aliyun.com/article/572353' },
          ],
        },
      },
      {
        blockId: 'rec-03-b10',
        heading: '双塔落地的四个常见误区',
        type: 'list',
        payload: {
          variant: 'myths',
          items: [
            [{ text: '把「曝光未点击」直接当召回负样本——那是精排的负样本，直接用于召回会把「感兴趣但没点」的内容错误推开。' }],
            [{ text: '忽视 ANN 的「近似」属性：离线用暴力检索评估、线上用 HNSW 带损检索，离在线指标天然对不齐；评估应与线上索引拓扑对齐。' }],
            [{ text: '只做增量更新追时效：一小时数据相对全天有偏，必须有天级全量纠偏。' }],
            [{ text: '认为加深双塔就能追平精排：后期融合的结构性缺陷不靠加层解决，要靠特征交叉改造或 TDM 式范式替换。' }],
          ],
          sourceRefs: [
            { briefId: 'D3', briefSection: '算法详解§5-6', externalUrl: 'https://juejin.cn/post/7635442226148622376' },
          ],
        },
      },
    ],
    keyTakeaways: [
      '双塔胜在工程效率：物品向量离线预计算 + 线上一次用户前向 + ANN 检索，毫秒级召回亿级库。',
      '召回负样本 = 曝光未点 + 全库负采样；曝光未点是困难负样本，不能直接用于召回训练。',
      'In-batch 负采样有热门偏差，logQ 修正 + L2 归一化 + 温度系数是标配三件套。',
      '模型更新用「天级全量 + 分钟级增量」组合；只看增量数据是有偏的。',
      '双塔的天花板在后期融合与检索目标错位，TDM 式树索引是突破范式之一。',
    ],
    relatedSections: ['rec-02', 'rec-04', 'rec-07', 'search-04'],
    diagramsUsed: ['fig-twin-tower', 'fig-ann-tradeoff'],
    updatedAt: '2026-09-01',
  },
  // ----------------------------------------------------------
  // rec-04 序列召回与多兴趣：从 YouTube DNN 到 SIM
  // ----------------------------------------------------------
  {
    sectionId: 'rec-04',
    chapterSlug: 'recommendation',
    title: '序列召回与多兴趣：从 YouTube DNN 到 SIM',
    tagline: '用户行为序列是推荐中信息密度最高的信号，序列建模的演进就是「更长的序列、更细的交互」。',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    keywords: ['YouTube DNN', '序列推荐', 'SASRec', '多兴趣召回', 'MIND', 'SIM'],
    summary: [
      {
        text: '从 YouTube DNN 把召回建模为百万类 softmax 开始，序列召回沿 GRU4Rec→SASRec→BERT4Rec 演进，再分叉出多兴趣（MIND/ComiRec）与超长序列（SIM）两条工业主线。',
      },
    ],
    blocks: [
      {
        blockId: 'rec-04-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: [
            { text: '用户行为序列是推荐里' },
            { text: '信息密度最高的信号', marks: ['bold'] },
            { text: '：它同时携带兴趣内容、兴趣强度、时序演化三重信息。序列召回的演进史可以一句话概括——更长的序列、更细的交互。2016 年的 YouTube DNN 是这条线的工业鼻祖：把召回建模为超大规模多分类，给定用户与上下文，用 softmax 预测全库百万级视频中每一个被观看的概率。' },
          ],
          sourceRefs: [
            { briefId: 'D3', briefSection: '算法详解§7', externalUrl: 'https://blog.csdn.net/u012328159/article/details/123986042' },
          ],
        },
      },
      {
        blockId: 'rec-04-b2',
        type: 'diagram',
        payload: {
          diagramId: 'fig-sequence-recall-evolution',
          caption: '序列召回演进：从 average pooling 到万级长序列检索',
          altText: '演进链：YouTube DNN（2016，平均池化）→ GRU4Rec（GRU 建模 session）→ SASRec（单向自注意力）→ BERT4Rec（双向+Cloze）→ MIND/ComiRec（多兴趣）→ SIM（万级长序列检索），每节点标注关键创新。',
        },
      },
      {
        blockId: 'rec-04-b3',
        heading: 'YouTube DNN 的四个关键设计（至今仍值得抄作业）',
        type: 'keypoints',
        payload: {
          layout: 'grid-2',
          items: [
            {
              title: '完播作正样本，而非点赞',
              description: [{ text: '隐式反馈（看完）构造的正样本比显式反馈（点赞）多一个数量级——样本量即模型上限，正样本定义是策略杠杆。' }],
              sourceRefs: [
                { briefId: 'D3', briefSection: '算法详解§7', externalUrl: 'https://blog.csdn.net/u012328159/article/details/123986042' },
              ],
            },
            {
              title: '每用户等样本数',
              description: [{ text: '防止少数活跃用户的行为主导整个模型，保护长尾用户兴趣的表达。' }],
            },
            {
              title: 'Example Age 特征',
              description: [{ text: '显式建模用户「喜新厌旧」的先验：视频年龄越小越容易被观看；线上预估时置 0，避免对新内容的系统性打压。' }],
            },
            {
              title: '防「自嗨」的样本来源',
              description: [{ text: '训练样本必须来自全站播放而非仅推荐位播放，否则新内容永远无法浮出水面，系统会过度偏向利用（exploitation）——这是 E&E 问题的经典论述。' }],
            },
          ],
        },
      },
      {
        blockId: 'rec-04-b4',
        type: 'case',
        payload: {
          company: 'YouTube',
          companyLogoKey: 'youtube',
          scenario: '深度学习召回的工业化奠基（2016）',
          background: [{ text: 'YouTube 视频库达百万~亿级，传统 CF 在稀疏行为与海量候选下难以兼顾召回率与时效，需要可规模化、能吃进多类特征的召回范式。' }],
          approach: [{ text: '把召回建模为百万类 softmax 多分类：用户画像 + 行为序列（average pooling）+ 上下文拼接进 MLP 产出用户向量；serving 时离线产出 item 向量建 ANN 索引、线上实时算 user 向量检索 TopK——本质上就是一座双塔。配套三个样本设计：完播作正样本、每用户等采样、Example Age 建模时效偏好。' }],
          results: [
            { metric: '正样本规模', value: '完播隐式反馈比点赞显式反馈多一个数量级' },
            { metric: '架构影响', value: '「离线 item 向量 + 线上 user 向量 + ANN」成为此后十年召回 serving 的标准范式' },
          ],
          lesson: '论文里真正值钱的是样本与 serving 的工程决策，不是网络结构——策略 PM 读论文要优先读「训练数据怎么构造」。',
          sourceRefs: [
            { briefId: 'D3', briefSection: '算法详解§7', externalUrl: 'https://blog.csdn.net/sgyuanshi/article/details/127078436' },
          ],
        },
      },
      {
        blockId: 'rec-04-b5',
        type: 'table',
        payload: {
          caption: '序列建模演进线：每个模型解决什么问题',
          columns: [
            { key: 'model', title: '模型（年份）' },
            { key: 'mech', title: '核心机制' },
            { key: 'solve', title: '解决什么' },
            { key: 'limit', title: '遗留问题' },
          ],
          rows: [
            { model: 'GRU4Rec（2015）', mech: 'GRU 建模 session 内行为序列', solve: '首次捕捉行为的时间依赖', limit: '长序列遗忘、效率瓶颈' },
            { model: 'SASRec（2018）', mech: '单向自注意力', solve: '自适应辨别序列中每个 item 的相关性', limit: '只用左侧上下文' },
            { model: 'BERT4Rec（2019）', mech: '双向自注意力 + Cloze 掩码预测', solve: '捕捉序列中更丰富的双向上下文', limit: '训练-推理目标存在错位' },
            { model: 'MIND / ComiRec', mech: '胶囊网络动态路由 / 可控多兴趣', solve: '单向量表达不了「数码+母婴」式多元兴趣', limit: '兴趣个数与路由是超参' },
            { model: 'SDM / SIM', mech: '长短期结合 / 长序列 TopK 检索', solve: '序列从百级扩到万级（SDM：7 天长期+当前 session）', limit: '算力约束下的检索精度' },
          ],
          sourceRefs: [
            { briefId: 'D3', briefSection: '算法详解§7', externalUrl: 'https://blog.csdn.net/nihaomafb/article/details/133249562' },
          ],
        },
      },
      {
        blockId: 'rec-04-b6',
        type: 'diagram',
        payload: {
          diagramId: 'fig-multi-interest',
          caption: '多兴趣召回：单向量「两头不靠」，多向量各自命中',
          altText: '用户行为云含数码与母婴两类兴趣；单向量方案的平均向量落在两类之间、标注红叉；多向量方案产出两个兴趣向量、各自命中对应类目候选、标注绿勾。',
        },
      },
      {
        blockId: 'rec-04-b7',
        type: 'paragraph',
        payload: {
          content: [
            { text: '多兴趣召回的动机很直观：用户同时喜欢数码和母婴，把所有行为平均成一个向量，结果落在两类之间「两头不靠」。MIND（天猫）用胶囊网络动态路由把行为聚成多个兴趣向量，ComiRec 进一步让兴趣数量可控。另一条工业主线是', },
            { text: '长序列', marks: ['bold'] },
            { text: '：SIM 先在万级长序列里检索与候选最相关的 TopK 行为（GSU），再精细交互（ESU），这套「两阶段检索」思路后来在精排侧发扬光大（见 2.5 节）。前沿上，Google TIGER（2023）用 RQ-VAE 把物品压缩成语义 ID、T5 直接「生成」下一个物品的语义 ID——召回从「检索已有」走向「无中生有」，对冷启动天然友好，是生成式召回的范式预演（详见 5.3 节）。' },
          ],
          sourceRefs: [
            { briefId: 'D3', briefSection: '发展与前沿§3', externalUrl: 'https://developer.jdcloud.com/article/4373' },
          ],
        },
      },
      {
        blockId: 'rec-04-b8',
        type: 'paragraph',
        payload: {
          content: [
            { text: '落到立项流程上，新增一路序列召回的标准动作是：先离线验证 Recall@K 的增量与候选集重合度（重合度低才有增量价值），再以小配额上线做 A/B，观察独占曝光贡献与召回留存率——', },
            { text: '离线指标涨不等于线上收益，召回来的内容若过不了粗排/精排，就是被下游截断吞噬的「假繁荣」', marks: ['bold'] },
            { text: '。长短结合也值得记：SDM 用「7 天长期行为 + 当前 session」兼顾稳定偏好与即时意图；线上归因时，各路召回的曝光占比、点击率、精排入选率、独占展现率四个指标要逐路监控，这是召回侧的「经营报表」。' },
          ],
          sourceRefs: [
            { briefId: 'D3', briefSection: '策略产品应用场景§1', externalUrl: 'https://www.ai-master.cc/interview/recsys-recall-strategies-001' },
            { briefId: 'D3', briefSection: '典型指标与评估§2', externalUrl: 'https://www.nowcoder.com/discuss/924260320183320576' },
          ],
        },
      },
      {
        blockId: 'rec-04-b9',
        heading: '评估一路序列召回是否值得上线',
        type: 'list',
        payload: {
          variant: 'checklist',
          items: [
            [{ text: 'Recall@K 分区间多看几个 K：Recall@5 代表精确度，Recall@500 代表整体覆盖能力，只看单一 K 会误判。' }],
            [{ text: '做各路独有/重合度分析：与已有召回路重合度低，才说明有增量价值——这是新增召回路立项的核心判断。' }],
            [{ text: '离线评估复用线上 ANN 索引拓扑，评估「真实带损召回率」，否则离线提升可能是假繁荣。' }],
            [{ text: '线上归因看召回留存率（精排入选率）与独占展现率：召回来的内容过不了粗排/精排，就是被下游截断吞噬。' }],
          ],
          sourceRefs: [
            { briefId: 'D3', briefSection: '典型指标与评估§1-2', externalUrl: 'https://www.cnblogs.com/demo-deng/p/16336678.html' },
          ],
        },
      },
    ],
    keyTakeaways: [
      'YouTube DNN 的遗产是范式而非结构：召回=超大规模多分类，离线 item 向量 + 线上 user 向量 + ANN。',
      '样本设计是策略杠杆：完播作正样本、每用户等采样、Example Age、防自嗨的全站样本来源。',
      '演进主线：GRU4Rec→SASRec→BERT4Rec 解决时序建模；MIND/ComiRec 解决多元兴趣；SDM/SIM 解决长序列。',
      'TIGER 式生成式召回是「无中生有」的新范式，冷启动友好，中短期与多路召回并存。',
      '新增召回路的立项依据：Recall@K 分区间 + 与已有路的重合度 + 召回留存率。',
    ],
    relatedSections: ['rec-03', 'rec-05', 'llm-03', 'strategy-01'],
    diagramsUsed: ['fig-sequence-recall-evolution', 'fig-multi-interest'],
    updatedAt: '2026-09-01',
  },
  // ----------------------------------------------------------
  // rec-05 精排模型演进：从 LR 到 HSTU 的特征自动化史
  // ----------------------------------------------------------
  {
    sectionId: 'rec-05',
    chapterSlug: 'recommendation',
    title: '精排模型演进：从 LR 到 HSTU 的特征自动化史',
    tagline: '排序技术的演进史 = 特征工程的自动化史 + 优化目标的多元化史，两条线交织。',
    difficulty: 'advanced',
    estimatedMinutes: 13,
    keywords: ['CTR 预估', 'Wide&Deep', 'DeepFM', 'DIN', 'SIM', 'HSTU'],
    summary: [
      {
        text: '从 LR 的手工特征，到 GBDT+LR 的特征工程模型化，再到 DIN/SIM 的序列注意力与 HSTU 的 Scaling Law——精排十五年演进的主线是「让模型自动做特征工程师的事」。',
      },
    ],
    blocks: [
      {
        blockId: 'rec-05-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: [
            { text: '精排是漏斗里算法密度最高的一层。理解它不需要会推反向传播，但需要看懂一条主线：' },
            { text: '排序技术的演进史，就是「特征工程的自动化史」与「优化目标的多元化史」两条线的交织', marks: ['bold'] },
            { text: '。前者回答「特征交叉谁来构造」，后者回答「模型到底在优化什么」（多目标见 2.6 节）。本节沿第一条线走一遍。' },
          ],
          sourceRefs: [
            { briefId: 'D4', briefSection: '核心概念框架§1' },
          ],
        },
      },
      {
        blockId: 'rec-05-b2',
        type: 'diagram',
        payload: {
          diagramId: 'fig-ranking-evolution-timeline',
          caption: '精排模型演进时间线：特征工程自动化史 × 优化目标多元化史',
          altText: '横向时间轴 2010-2025：LR → GBDT+LR（2014）→ FM/FFM → Wide&Deep（2016）→ DeepFM/DCN（2017）→ DIN（2018）/DIEN（2019）→ SIM（2020）→ HSTU（2024）/生成式，每个节点标注一句话贡献。',
        },
      },
      {
        blockId: 'rec-05-b3',
        type: 'paragraph',
        payload: {
          content: [
            { text: '起点是 LR：高维离散 one-hot（维度可达亿级）+ FTRL 在线学习，可解释、可分布式，但它是线性模型，无法自动做特征组合——所以 LR 时代「', },
            { text: '特征工程师 = 半个策略产品', marks: ['bold'] },
            { text: '」，业务直觉直接决定效果。2014 年 Facebook 的 GBDT+LR 是第一次自动化：用 GBDT 的叶子节点做非线性特征变换，树深度决定交叉阶数（深度 4 = 3 阶组合），500 棵树（每棵叶子不超过 12 个）带来约 3% 的归一化熵提升。比数字更重要的是意义——它开启了「特征工程模型化」的趋势，之后的深度网络都是这一趋势的延续。' },
          ],
          sourceRefs: [
            { briefId: 'D4', briefSection: '算法详解§1.1-1.2', externalUrl: 'https://www.cnblogs.com/leebxo/p/11585492.html' },
            { briefId: 'D4', briefSection: '算法详解§1.2', externalUrl: 'https://cloud.tencent.com/developer/article/1913438' },
          ],
        },
      },
      {
        blockId: 'rec-05-b4',
        type: 'paragraph',
        payload: {
          content: [
            { text: 'FM/FFM 解决稀疏交叉：每对特征的交互权重分解为隐向量内积 ⟨v_i, v_j⟩，没见过的特征组合也能打分，复杂度从 O(n²) 降到 O(kn)；FFM 引入 Field 概念更精细，但训练慢一个量级。Wide & Deep（Google 2016）确立范式：Wide 侧（LR+人工交叉）负责', },
            { text: '记忆', marks: ['term'] },
            { text: '高频共现组合，Deep 侧（Embedding+MLP）负责', },
            { text: '泛化', marks: ['term'] },
            { text: '未见组合。DeepFM 把 Wide 侧换成 FM、与 DNN 共享 Embedding，干掉最后的手工交叉；DCN-V2 用 Cross Network 做显式高阶交叉，层数即阶数（某数据集上 AUC 0.6348 vs FM 0.6274）。选型共识：小规模稀疏数据 FM 就够，大规模数据上 DeepFM/DCN，最终靠 A/B 拍板。' },
          ],
          sourceRefs: [
            { briefId: 'D4', briefSection: '算法详解§1.3-1.5', externalUrl: 'https://datawhalechina.github.io/fun-rec/chapter_2_ranking/1.wide_and_deep.html' },
            { briefId: 'D4', briefSection: '算法详解§1.5', externalUrl: 'http://www.chinasem.cn/article/1036719' },
          ],
        },
      },
      {
        blockId: 'rec-05-b5',
        type: 'diagram',
        payload: {
          diagramId: 'fig-din-attention',
          caption: 'DIN 局部激活：候选 item 决定激活用户序列中的哪些历史行为',
          altText: '用户行为序列（奶粉、泳衣等）上方是候选商品泳镜；泳衣与泳镜之间的注意力连线加粗高亮，其余连线细弱；加权求和后进 MLP 输出；对比小图为传统 average pooling 的等权重连线。',
        },
      },
      {
        blockId: 'rec-05-b6',
        type: 'paragraph',
        payload: {
          content: [
            { text: '特征交叉自动化之后，红利转向行为序列。DIN（阿里，KDD\'18）把 Attention 引入兴趣建模：不再把历史行为等权平均，而是用候选 item 去「局部激活」相关行为——' },
            { text: '用户买过奶粉和泳衣，展示泳镜时激活泳衣、展示尿不湿时激活奶粉，实现兴趣的「千物千面」', marks: ['bold'] },
            { text: '。DIEN（AAAI\'19）补上时间维度：GRU 抽取兴趣、AUGRU 建模兴趣演化。SIM（2020）把序列长度从百级拉到万级：GSU 先用类目或向量检索把上万条行为压到数百条，ESU 再做 DIN 式精细交互。' },
          ],
          sourceRefs: [
            { briefId: 'D4', briefSection: '算法详解§1.6', externalUrl: 'https://www.cnblogs.com/rossiXYZ/p/13796470.html' },
          ],
        },
      },
      {
        blockId: 'rec-05-b7',
        type: 'case',
        payload: {
          company: '阿里巴巴',
          companyLogoKey: 'alibaba',
          scenario: 'SIM：万级长序列兴趣建模（定向展示广告场景）',
          background: [{ text: 'DIN/DIEN 只能建模百级行为序列，而用户兴趣分散在更长的时间跨度里；直接对万级序列做 attention，算力成本不可接受。' }],
          approach: [{ text: 'SIM 采用两阶段「搜索」范式：GSU（General Search Unit）用 hard-search（按类目检索）或 soft-search（按向量检索）从上万条行为中捞出与候选最相关的数百条；ESU（Exact Search Unit）再对短序列做 target attention 精细建模——本质是把「召回-精排」的漏斗思想搬进了序列建模内部。' }],
          results: [
            { metric: 'CTR', value: '+7.1%（相比在线主流量模型，阿里定向展示广告场景）' },
            { metric: 'RPM', value: '+4.4%' },
            { metric: '序列长度', value: '最长建模 54000 条行为，相比 MIMN 的 1000 提升 54 倍' },
          ],
          lesson: '长序列是确定性红利，但直接 attention 不可行——「先检索、后精排」的两阶段思想在模型内部同样成立。',
          sourceRefs: [
            { briefId: 'D4', briefSection: '算法详解§1.6', externalTitle: '阿里 SIM 官方解读（领研网）', externalUrl: 'https://www.linkresearcher.com/theses/8a9845a0-4932-4977-8e0e-b875f3bba8a6' },
          ],
        },
      },
      {
        blockId: 'rec-05-b8',
        heading: '特征工程的四类语言（策略 PM 必须会用）',
        type: 'keypoints',
        payload: {
          layout: 'grid-2',
          items: [
            {
              title: 'ID 类特征',
              description: [{ text: 'user_id、item_id、类目 id、作者 id 等高基数离散 ID，embedding 后承载最强的个性化信号。' }],
              sourceRefs: [
                { briefId: 'D4', briefSection: '算法详解§2', externalUrl: 'https://developer.volcengine.com/articles/7391690780185722934' },
              ],
            },
            {
              title: '交叉特征',
              description: [{ text: '「一线城市女性在周末更爱买美妆」——单特征线性效果有限，交叉后才爆发；深度模型自动化了二阶交叉，但高阶业务交叉仍值得人工设计。' }],
            },
            {
              title: '统计特征',
              description: [{ text: '时间窗内聚合行为率（用户过去 1 天对某 tag 的 CTR），按长期/短期/超短期多窗构造，是稳定模型效果的压舱石。' }],
            },
            {
              title: '实时特征',
              description: [{ text: '秒/分钟级行为（最近 1 小时点击序列）捕捉即时意图；模型结构红利递减后，收益回到特征与数据侧——新特征、长序列、实时性。' }],
            },
          ],
        },
      },
      {
        blockId: 'rec-05-b9',
        type: 'paragraph',
        payload: {
          content: [
            { text: '最新的拐点是大模型化。Meta HSTU（2024）把推荐重构为生成式序列转导任务，' },
            { text: '1.5 万亿参数', marks: ['bold'] },
            { text: '，第一次在推荐系统观测到类 LLM 的 Scaling Law：相比经典 SASRec 提升 20.3%~65.8% NDCG@10，线上多产品界面上线后单 ranking 界面提升 12.4%（召排合计 18.6%）。字节 HLLM 沿「LLM 提取 item 表征 + 层次化用户建模」路线跟进。研发范式正在从「精巧特征工程」转向「计算换质量」——对分发负责人，这意味着评估模型迭代提案时要多问一个维度：这笔算力账，ROI 算得过来吗？' },
          ],
          sourceRefs: [
            { briefId: 'D4', briefSection: '算法详解§1.7', externalUrl: 'https://developer.volcengine.com/articles/7391691632323133479' },
            { briefId: 'D4', briefSection: '发展与前沿§1', externalUrl: 'https://developer.jdcloud.com/article/4373' },
          ],
        },
      },
      {
        blockId: 'rec-05-b10',
        type: 'quote',
        payload: {
          variant: 'insight',
          text: '模型结构红利递减之后，收益重新回到特征与数据侧——新特征的挖掘、序列长度的扩展、实时性的提升。',
          attribution: '推荐排序演进规律总结',
          sourceRefs: [
            { briefId: 'D4', briefSection: '算法详解§2' },
          ],
        },
      },
    ],
    keyTakeaways: [
      '演进主线是特征工程自动化：LR 手工 → GBDT+LR 树模型化 → FM/DeepFM/DCN 自动交叉。',
      'Wide & Deep 确立「记忆 + 泛化」范式，至今仍是理解所有双组件模型的框架。',
      'DIN 的局部激活实现兴趣「千物千面」；SIM 用两阶段检索把序列拉到万级，CTR +7.1%、RPM +4.4%。',
      '特征四类语言：ID / 交叉 / 统计 / 实时；结构红利递减后收益回到特征与数据侧。',
      'HSTU 验证推荐 Scaling Law（1.5T 参数、线上 ranking +12.4%），范式转向「计算换质量」。',
    ],
    relatedSections: ['rec-04', 'rec-06', 'rec-07', 'llm-03'],
    diagramsUsed: ['fig-ranking-evolution-timeline', 'fig-din-attention'],
    updatedAt: '2026-09-01',
  },
  // ----------------------------------------------------------
  // rec-06 多目标与多任务：ESMM、MMoE、PLE 与融合公式
  // ----------------------------------------------------------
  {
    sectionId: 'rec-06',
    chapterSlug: 'recommendation',
    title: '多目标与多任务：ESMM、MMoE、PLE 与融合公式',
    tagline: '融合公式权重是分发负责人的「货币政策」，每次调权都是一次全局利益再分配。',
    difficulty: 'advanced',
    estimatedMinutes: 13,
    keywords: ['ESMM', 'MMoE', 'PLE', '多目标融合', '时长建模', 'LTV'],
    summary: [
      {
        text: '从 ESMM 的 CVR 全空间建模，到 MMoE/PLE 解决多任务负迁移与跷跷板，再到加法/乘法融合公式与时长、LTV 建模——多目标是策略产品最核心的调参面。',
      },
    ],
    blocks: [
      {
        blockId: 'rec-06-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: [
            { text: '真实业务从不只优化点击率：CTR、CVR、时长、完播、互动、GMV 要同时照顾。多目标建模分两层问题：' },
            { text: '模型层', marks: ['bold'] },
            { text: '（怎么把多个目标预估得准——ESMM/MMoE/PLE），和' },
            { text: '融合层', marks: ['bold'] },
            { text: '（怎么把多个预估分合成一个排序分——融合公式）。后者是策略产品最核心的调参面：融合公式的权重就是产品战略的直接编码。' },
          ],
          sourceRefs: [
            { briefId: 'D4', briefSection: '算法详解§3' },
          ],
        },
      },
      {
        blockId: 'rec-06-b2',
        type: 'paragraph',
        payload: {
          content: [
            { text: '先看 CVR 预估的两大顽疾。一是' },
            { text: '样本选择偏差（SSB）', marks: ['term'] },
            { text: '：CVR 模型在「点击」样本上训练，却要在「曝光」全空间推理，训练与推理分布不一致；二是' },
            { text: '数据稀疏（DS）', marks: ['term'] },
            { text: '：点击样本比曝光样本少 1-3 个数量级，转化样本更少。直接在点击集上训 CVR，上线必翻车。' },
          ],
          sourceRefs: [
            { briefId: 'D4', briefSection: '算法详解§3.1', externalUrl: 'https://arxiv.org/pdf/1804.07931v2.pdf' },
          ],
        },
      },
      {
        blockId: 'rec-06-b3',
        type: 'diagram',
        payload: {
          diagramId: 'fig-esmm-ctr-cvr',
          caption: 'ESMM：在全曝光空间上做 pCTCVR = pCTR × pCVR 的链式建模',
          altText: '漏斗式样本空间三层：曝光大、点击中、转化小；pCTR 塔与 pCTCVR 塔并排放在全曝光空间上训练，pCVR 塔为虚线中间变量；两塔共享 Embedding，CVR 向 CTR 借力。',
        },
      },
      {
        blockId: 'rec-06-b4',
        type: 'formula',
        payload: {
          name: 'ESMM 全空间建模',
          expression: 'pCTCVR = pCTR × pCVR（CTR 与 CTCVR 在全曝光空间训练，pCVR 隐式学习）',
          symbolNotes: [
            { symbol: 'pCTR', meaning: '曝光→点击概率，样本充足，在全空间训练' },
            { symbol: 'pCVR', meaning: '点击→转化概率，不直接训练，作为中间变量由两个全空间任务夹逼出来' },
            { symbol: 'pCTCVR', meaning: '曝光→转化概率，在全空间训练，锚定 CVR 的输出空间' },
          ],
          intuition: [
            { text: 'CTR 和 CTCVR 都能在全曝光空间训练，二者一除（实际是乘式分解）就把 CVR 的「学习空间」从点击集拉回曝光全空间，SSB 消解；两塔共享 Embedding，让稀疏的 CVR 任务从丰富的 CTR 样本中「借力」，DS 缓解。用乘法而非除式是为避免数值不稳定。后续 ESCM²（SIGIR\'22）用反事实正则进一步修正 ESMM 的固有高估偏差与假独立先验。' },
          ],
          sourceRefs: [
            { briefId: 'D4', briefSection: '算法详解§3.1', externalUrl: 'http://51cto.com/aigc/5063.html' },
          ],
        },
      },
      {
        blockId: 'rec-06-b5',
        type: 'diagram',
        payload: {
          diagramId: 'fig-mmoe-ple',
          caption: 'MMoE 软共享与 PLE 专属专家：治负迁移与跷跷板',
          altText: '三个结构对比：Shared-Bottom 单底座分叉到两任务标注负迁移；MMoE 为多个专家网络加每任务门控；PLE 为共享专家加任务专属专家分组，门控只融合共享与自己的专属专家，标注治跷跷板现象。',
        },
      },
      {
        blockId: 'rec-06-b6',
        type: 'paragraph',
        payload: {
          content: [
            { text: '多任务结构的演进针对两个病：Shared-Bottom 硬共享在任务相关性弱时产生' },
            { text: '负迁移', marks: ['term'] },
            { text: '；MMoE（Google KDD\'18）用多专家 + 每任务门控做软共享，不同任务侧重不同专家。但 MMoE 仍会「跷跷板」——一个目标涨、另一个跌。PLE（腾讯，RecSys\'20 Best Paper）把专家分为共享专家 + 任务专属专家，门控只融合「共享 + 自己专属」，在腾讯新闻同时建模 VCR（播放完成率）与 VTR（有效播放率）这对以往「提 VCR 就降 VTR」的冲突目标上取得实证收益。' },
          ],
          sourceRefs: [
            { briefId: 'D4', briefSection: '算法详解§3.2-3.3', externalUrl: 'https://developer.volcengine.com/articles/7400235677893591078' },
          ],
        },
      },
      {
        blockId: 'rec-06-b7',
        type: 'formula',
        payload: {
          name: '多目标融合（乘法/加权幂乘）',
          expression: 'score = Π factor_i × (α_i + score_i)^β_i，如 score = pVTR^w1 × pVCR^w2 × pSHR^w3 × f(video_len)',
          symbolNotes: [
            { symbol: 'score_i', meaning: '各目标预估分（pCTR/pCVR/时长/互动率）' },
            { symbol: 'β_i / w_i', meaning: '指数权重——策略 PM 的调参面，超参通过线上实验优化' },
            { symbol: 'α_i', meaning: '平滑项，防止某目标预估趋零时一票否决' },
            { symbol: 'f(video_len)', meaning: '时长的非线性变换（sigmoid/log），做时长公平性校正' },
          ],
          intuition: [
            { text: '加法融合（Σ 加权和）适合目标少的场景，但目标增多后各目标量纲互相牵制、新增目标受 scale 影响；乘法融合让目标间相互独立——一个目标预估低了，总分指数级下降，形成「短板效应」，天然符合「各项体验都不能太差」的业务直觉。电商变体：score = pCTR × (α + pCVR) × (β + price) × stay^a × cart^b × collect^c × rule_weight。' },
          ],
          sourceRefs: [
            { briefId: 'D4', briefSection: '算法详解§3.4', externalUrl: 'https://lumingdong.cn/multi-task-learning-in-recommendation-system.html' },
          ],
        },
      },
      {
        blockId: 'rec-06-b8',
        type: 'case',
        payload: {
          company: '爱奇艺',
          companyLogoKey: 'iqiyi',
          scenario: '多目标从加法融合切换为乘法融合',
          background: [{ text: '视频推荐要同时优化 CTR、播放时长、互动等多个目标，加法融合下各目标量纲互相牵制，目标越多排序能力越受限，调参靠拍脑袋。' }],
          approach: [{ text: '将融合公式从加法切换为乘法（加权幂乘）：各目标预估分以指数权重连乘，目标间相互独立，新增目标不受已有目标 scale 影响，权重超参通过线上实验优化。' }],
          results: [
            { metric: 'CTR', value: '+1.5%' },
            { metric: '人均播放时长', value: '+1%' },
          ],
          lesson: '融合公式的「形式选择」本身就是一次策略迭代——乘法融合的短板效应更符合多目标业务的兜底直觉。',
          sourceRefs: [
            { briefId: 'D4', briefSection: '算法详解§3.4', externalTitle: '爱奇艺多目标排序实践', externalUrl: 'https://cloud.tencent.com/developer/article/1896543' },
          ],
        },
      },
      {
        blockId: 'rec-06-b9',
        heading: '超越点击率：时长、LTV 与正样本定义权',
        type: 'keypoints',
        payload: {
          layout: 'grid-2',
          items: [
            {
              title: 'YouTube 加权逻辑回归',
              description: [{ text: '正样本按观看时长加权、负样本单位权重，逻辑回归学到的 odds ≈ 期望观看时长，serving 用 e^(Wx+b) 直接输出时长估计——「点击不代表真的喜欢」。' }],
              sourceRefs: [
                { briefId: 'D4', briefSection: '算法详解§6', externalUrl: 'https://www.cnblogs.com/hellojamest/p/11739865.html' },
                { briefId: 'D4', briefSection: '算法详解§6', externalUrl: 'https://hub.baai.ac.cn/view/34952' },
                { briefId: 'D4', briefSection: '策略产品应用场景§2' },
              ],
            },
            {
              title: '快手 D2Q：治 duration bias',
              description: [{ text: '时长本身影响视频表示的学习（自循环偏差）；D2Q 按视频时长分组做后门调整、组内回归时长分位数，线上查表还原，全量上线后是「短视频领域继 YouTube DNN 之后最好用的时长预估模型」。' }],
            },
            {
              title: 'LTV：从单次价值到长期价值',
              description: [{ text: 'LTV = LT × ARPU；DNN + ZILN 损失处理 LTV 标签大量零值与长尾分布。字节实践：LTV 用于投放、ROI、排序权重，「只投 LTV ≥ 获取成本 × 1.5 的人群」。' }],
            },
            {
              title: '正样本定义权是策略杠杆',
              description: [{ text: '爱奇艺对高 playtime 样本整体提权以优化时长；快手把「观看 <5 秒」样本标签置 0 去噪。改标签定义往往比改模型更快拿到收益。' }],
            },
          ],
        },
      },
      {
        blockId: 'rec-06-b10',
        type: 'paragraph',
        payload: {
          content: [
            { text: '人工调权重的天花板正在被打破：阿里 PE-LTR（KDD\'19）在帕累托框架下自动学习权重并保证帕累托有效；DeepPRL（阿里优酷）用超网络 + 强化学习做' },
            { text: '个性化动态权重', marks: ['bold'] },
            { text: '——不同用户给不同的目标权重组合，让 CTR、视频观看量、停留时长三个相互冲突的目标分别 +2%、+5%、+7% 同涨。这证明冲突目标并非零和，前提是权重从「全局静态」升级为「个性化动态」。但要清醒：权重自动化不等于责任自动化，每次调权仍是全局利益再分配，必须配 A/B + 长期指标（留存、LTV）验证。' },
          ],
          sourceRefs: [
            { briefId: 'D4', briefSection: '算法详解§3.4', externalUrl: 'https://hub.baai.ac.cn/paper/4ccd25ab-5777-4731-b574-aff689cc7eff' },
          ],
        },
      },
      {
        blockId: 'rec-06-b11',
        type: 'quote',
        payload: {
          variant: 'principle',
          text: '融合公式权重是分发负责人的「货币政策」——每次调权都是一次全局利益再分配，需配 A/B 与长期指标验证。',
          attribution: '分发策略方法论',
          sourceRefs: [
            { briefId: 'D4', briefSection: '策略产品应用场景§3' },
          ],
        },
      },
    ],
    keyTakeaways: [
      'CVR 预估两大顽疾：SSB（点击集训练、全空间推理）与 DS（样本差 1-3 个数量级）；ESMM 用 pCTCVR = pCTR × pCVR 全空间建模 + 共享 Embedding 借力。',
      'MMoE 软共享治负迁移；PLE「共享专家 + 专属专家」治跷跷板现象（腾讯 RecSys\'20 Best Paper）。',
      '乘法融合目标独立、有短板效应；爱奇艺实证 CTR +1.5%、时长 +1%；超参一律线上实验优化。',
      '时长建模经典解法：YouTube 加权逻辑回归（odds≈期望时长）、快手 D2Q 后门调整治 duration bias。',
      '正样本定义权与融合权重是策略 PM 最锋利的两根杠杆；DeepPRL 证明动态个性化权重可让冲突目标同涨。',
    ],
    relatedSections: ['rec-05', 'rec-07', 'strategy-05', 'eval-01'],
    diagramsUsed: ['fig-esmm-ctr-cvr', 'fig-mmoe-ple'],
    updatedAt: '2026-09-01',
  },
  // ----------------------------------------------------------
  // rec-07 粗排与重排：算力阀门与列表最优
  // ----------------------------------------------------------
  {
    sectionId: 'rec-07',
    chapterSlug: 'recommendation',
    title: '粗排与重排：算力阀门与列表最优',
    tagline: '粗排管「算力预算」，重排管「列表整体最优」——重排是策略产品可自主迭代的主战场。',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    keywords: ['粗排', '知识蒸馏', '重排', 'MMR', 'DPP', '上下文感知'],
    summary: [
      {
        text: '粗排在 20ms 内把数千候选压到数百，靠蒸馏对齐精排；重排把 Pointwise 的「单点最优」升级为 Listwise 的「列表最优」，MMR/DPP/PRM 与打散规则是策略 PM 的主战场。',
      },
    ],
    blocks: [
      {
        blockId: 'rec-07-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: [
            { text: '漏斗首尾两层最受关注，但分发负责人的日常杠杆往往藏在中间和末端：' },
            { text: '粗排是算力阀门，重排是列表最优的最后一道工序', marks: ['bold'] },
            { text: '。粗排要在约 20ms 内把数千候选截到数百，决定精排「看得到什么」；重排在精排 Top-N 上做去重、打散、强插与上下文重排，决定用户「最终看到什么」。' },
          ],
          sourceRefs: [
            { briefId: 'D4', briefSection: '核心概念框架§1', externalUrl: 'https://www.woshipm.com/pd/4519608.html' },
          ],
        },
      },
      {
        blockId: 'rec-07-b2',
        type: 'paragraph',
        payload: {
          content: [
            { text: '粗排主流是双塔：item 向量可预计算，线上只做内积。注意粗排双塔与召回双塔的差别：召回的打分空间是全库、必须负采样；粗排的打分空间已收窄到数千，曝光样本与打分样本差异较小，SSB 较轻，因此粗排可以像精排一样用多目标公式融合。粗排的核心技术动作是' },
            { text: '知识蒸馏', marks: ['term'] },
            { text: '：让轻量粗排模型学习精排的打分分布（logits/序关系），「用 bias 换 variance」，提升粗精一致性，减少「精排高分候选在粗排被误杀」。阿里 COLD 更进一步：在可控算力下把深度特征交叉引入粗排，突破双塔后期融合的限制。' },
          ],
          sourceRefs: [
            { briefId: 'D4', briefSection: '算法详解§4', externalUrl: 'https://blog.csdn.net/qq_21997625/article/details/138294078' },
            { briefId: 'D4', briefSection: '算法详解§4', externalUrl: 'https://docs.feishu.cn/v/wiki/LO2HwqabbiOhkKkynTvcv5AqnGd/ak' },
          ],
        },
      },
      {
        blockId: 'rec-07-b3',
        heading: '粗排的三个监控面',
        type: 'keypoints',
        payload: {
          layout: 'grid-3',
          items: [
            {
              title: '截断量级 = 算力预算',
              description: [{ text: '截到几百是产品决策：给精排越多候选、效果上限越高，但延迟与成本线性上涨。' }],
              sourceRefs: [
                { briefId: 'D4', briefSection: '算法详解§4' },
              ],
            },
            {
              title: '粗精一致性',
              description: [{ text: '用「粗排输出与精排 Top-K 的重合度」做监控指标；蒸馏程度越深，一致性越高。' }],
            },
            {
              title: '误杀率',
              description: [{ text: '精排高分候选在粗排被截掉的比例，是粗排迭代的第一护栏指标。' }],
            },
          ],
        },
      },
      {
        blockId: 'rec-07-b4',
        type: 'paragraph',
        payload: {
          content: [
            { text: '重排存在的根本原因：精排是 Pointwise 打分，' },
            { text: '看不见上下文', marks: ['bold'] },
            { text: '——用户是否点击一个商品，除了和它自身有关，还和它周围的其他 item 息息相关。一屏全是同质内容，单条分数再高，整体体验也是差的。重排的任务就是把「单点最优」升级为「列表最优」，手段分两类：多样性算法与上下文感知模型。' },
          ],
          sourceRefs: [
            { briefId: 'D4', briefSection: '算法详解§5.2', externalUrl: 'https://cloud.tencent.cn/developer/article/1976753' },
          ],
        },
      },
      {
        blockId: 'rec-07-b5',
        type: 'diagram',
        payload: {
          diagramId: 'fig-mmr-dpp',
          caption: 'MMR 与 DPP：多样性重排的两种经典机制',
          altText: '左侧 MMR：候选按 θ·相关性 − (1−θ)·与已选集最大相似度 贪心挑选；右侧 DPP：item 向量张成的超平行体，体积（行列式）越大越多样。',
        },
      },
      {
        blockId: 'rec-07-b6',
        type: 'formula',
        payload: {
          name: 'MMR（最大边际相关，SIGIR\'98）',
          expression: 'MR_i = θ × reward_i − (1 − θ) × max_{j∈S} sim(i, j)',
          symbolNotes: [
            { symbol: 'reward_i', meaning: '候选 i 的质量分（通常用精排分）' },
            { symbol: 'max sim(i,j)', meaning: '候选 i 与已选列表 S 中最相似 item 的相似度——「重复惩罚项」' },
            { symbol: 'θ', meaning: '相关性 vs 多样性的权衡旋钮，策略 PM 直接可调' },
          ],
          intuition: [
            { text: '每轮从候选池里挑「质量好、且与已选列表最不重复」的 item。工业界常用滑动窗口 MMR：用户顺序浏览，只要连续 1-2 屏不重复就能感知到多样性，窗口化大幅降低计算量。注意相似度度量的选择：用 CLIP 等预训练模型从图文内容提取的向量效果最好；双塔向量头部效应严重，不推荐用于多样性目的。DPP（Hulu/YouTube，NeurIPS\'18）则把「质量 × 多样性」建模为集合向量张成的体积（行列式），NP-hard 但可用 Cholesky 加速的 Fast Greedy 求解；pDPP 还能按用户兴趣熵个性化多样性强度。' },
          ],
          sourceRefs: [
            { briefId: 'D4', briefSection: '算法详解§5.1', externalUrl: 'https://blog.csdn.net/m0_64449391/article/details/151590405' },
          ],
        },
      },
      {
        blockId: 'rec-07-b7',
        type: 'diagram',
        payload: {
          diagramId: 'fig-rerank-context',
          caption: '上下文感知重排（PRM）：让 item 在重打分时「看见彼此」',
          altText: '精排 Top-N 列表输入 PRM：每个 item 向量 + 个性化向量 PV + 位置编码 PE 汇入 self-attention 编码块，item 间互相连线表示看见彼此，softmax 重打分后 beam search 生成最终序列。',
        },
      },
      {
        blockId: 'rec-07-b8',
        type: 'paragraph',
        payload: {
          content: [
            { text: '上下文感知重排有五条技术路线：树模型（LambdaMart）、RNN（DLCM、Seq2Slate）、两段式（PRS：PMatch 生成候选排列 + PRank 评估）、' },
            { text: 'self-attention', marks: ['term'] },
            { text: '（PRM、SetRank：item 向量 + 个性化向量 PV + 位置编码 PE 一起进 self-attention，让每个 item 打分时「看见」整页其他 item）、强化学习（LIRD/GRN 直接优化序列级收益）。更激进的路线是生成式重排：把重排当序列生成问题，Generator 产出候选列表、Evaluator 评估整页收益；快手 OneRec 则用一个端到端生成模型直接替代「召回-粗排-精排-重排」整条级联（详见 5.3 节）。' },
          ],
          sourceRefs: [
            { briefId: 'D4', briefSection: '算法详解§5.2-5.3', externalUrl: 'https://cloud.tencent.cn/developer/article/1976753' },
          ],
        },
      },
      {
        blockId: 'rec-07-b9',
        type: 'case',
        payload: {
          company: '快手',
          companyLogoKey: 'kuaishou',
          scenario: 'OneRec：端到端生成式模型替代整条级联（含重排）',
          background: [{ text: '级联架构存在目标不一致（各层优化 Pointwise 而用户消费的是 Listwise）、误差累积、模块间通信存储开销大（超 50% 资源耗在通信而非计算）三大痛点；重排规则越堆越多，链路越来越不可控。' }],
          approach: [{ text: 'OneRec 用单一端到端生成模型直接产出推荐列表：行为序列 token 化输入，生成式解码输出整页结果，把召回、粗排、精排、重排的目标统一进一个模型，从根上消除级联间的目标错位。' }],
          results: [
            { metric: '线上承接流量', value: '约 25% QPS' },
            { metric: '运营成本', value: 'OPEX 仅为传统级联链路的 10.6%，算子数量从 1.5 万降到 1200' },
            { metric: '观看时长', value: '+1.6%' },
          ],
          lesson: '端到端不是「更贵的玩具」而是「更便宜的重构」——但它并不全面替代漏斗，中短期与级联架构并存（详见 5.3 节）。',
          sourceRefs: [
            { briefId: 'D7', briefSection: '技术路线详解§2.4', externalTitle: '快手 OneRec 端到端生成式推荐', externalUrl: 'https://developer.jdcloud.com/article/4373' },
          ],
        },
      },
      {
        blockId: 'rec-07-b10',
        type: 'table',
        payload: {
          caption: '分发负责人的策略抓手面板：每层调什么',
          columns: [
            { key: 'stage', title: '环节' },
            { key: 'lever', title: '策略抓手' },
            { key: 'action', title: '典型动作' },
          ],
          rows: [
            { stage: '召回', lever: '通道设计、配额与冷启流量', action: '新增兴趣探索通道、新内容保量召回、通道效果归因' },
            { stage: '粗排', lever: '截断量级、粗精一致性', action: '调候选量（算力预算）、监控粗排误杀率' },
            { stage: '精排', lever: '目标定义、样本与特征策略、融合公式权重', action: '定义正样本（有效播放阈值）、新增实时特征、调多目标权重' },
            { stage: '重排', lever: '多样性/打散规则、强插、生态调控', action: '同类目窗口打散、作者防霸屏、商业化强插位' },
            { stage: '混排', lever: '内容 vs 广告的流量分配', action: 'eCPM 门槛、广告 load 调控、PID 控速' },
          ],
          highlightRowKeys: [],
          sourceRefs: [
            { briefId: 'D4', briefSection: '策略产品应用场景§1', externalUrl: 'https://www.woshipm.com/pd/4519608.html' },
          ],
        },
      },
      {
        blockId: 'rec-07-b11',
        type: 'quote',
        payload: {
          variant: 'insight',
          text: '理解模型能力边界才能提对需求：双塔做不了交叉（所以要 COLD），Pointwise 看不见上下文（所以要重排），精排打不准绝对值（所以广告竞价才需要 PCOC 校准）。',
          attribution: '分发负责人认知升级要点',
          sourceRefs: [
            { briefId: 'D4', briefSection: '策略产品应用场景§3' },
          ],
        },
      },
    ],
    keyTakeaways: [
      '粗排是算力阀门：数千→数百、约 20ms、双塔为主；SSB 较轻，可用多目标公式融合。',
      '蒸馏让粗排学精排的打分分布，「用 bias 换 variance」，核心护栏是粗精一致性与误杀率。',
      '重排的动机是 Pointwise 缺上下文；MMR 用 θ 权衡相关性与多样性，滑动窗口版是工业标配。',
      '相似度度量用 CLIP 内容向量优于双塔向量（头部效应）；DPP 用行列式度量「质量×多样性」，pDPP 按兴趣熵个性化。',
      '上下文感知五路线：树模型/RNN/两段式/self-attention/RL；生成式重排与 OneRec 指向端到端终局。',
    ],
    relatedSections: ['rec-01', 'rec-03', 'rec-06', 'strategy-03', 'llm-03'],
    diagramsUsed: ['fig-mmr-dpp', 'fig-rerank-context'],
    updatedAt: '2026-09-01',
  },
];
