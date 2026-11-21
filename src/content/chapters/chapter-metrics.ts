// ============================================================
// 篇章四：评估与实验篇（chapter-metrics.ts）
// 素材来源：D6（评估体系与 AB 实验简报），少量引用 D1/D2/D4/D5
// 对应 IA：site_ia.md 第 2 节「篇章四：评估与实验篇」5 个小节（eval-01 ~ eval-05）
// ============================================================

import type { Chapter, Section } from '../types';

export const chapterMetrics: Chapter = {
  chapterId: 'ch-eval',
  slug: 'evaluation',
  order: 4,
  title: '评估与实验篇',
  subtitle: '评估体系是分发负责人的「第一工程」——指标定义错了，全公司会朝错误方向优化。',
  icon: 'ab-test',
  themeColor: '#F59E0B',
  learningGoals: [
    '搭建「北极星 + 体验/生态/商业 + 护栏」的分层指标金字塔，说出北极星五条设计标准',
    '掌握 P/R@K、AUC/GAUC、NDCG、LogLoss/PCOC 的适用边界，能排查「离线涨线上不涨」',
    '独立设计一个 AB 实验：分流分层、MDE 样本量速算、AA 测试与 SRM 检验、CUPED 方差缩减',
    '识别 SUTVA 违反与长期效应场景，会用 Holdout、反转实验、Switchback、DID/合成控制',
    '建立八大数据陷阱的「免疫系统」，掌握异动归因与 badcase 分层归因的闭环方法',
  ],
  sections: [
    {
      sectionId: 'eval-01',
      title: '指标体系：北极星、护栏与分层指标金字塔',
      tagline: '指标不是平铺清单而是分层金字塔，「北极星 + 护栏」组合是分发场景的标准打法。',
      difficulty: 'foundational',
      estimatedMinutes: 10,
      keywords: ['北极星指标', '护栏指标', '指标金字塔', '生态指标', '基尼系数'],
    },
    {
      sectionId: 'eval-02',
      title: '离线评估：从 AUC 到 GAUC/NDCG 的指标选型',
      tagline: '离线指标决定模型有没有资格进场，理解每个指标的盲区才能避免被「离线涨线上跌」打脸。',
      difficulty: 'intermediate',
      estimatedMinutes: 11,
      keywords: ['AUC', 'GAUC', 'NDCG', '离线评估', '特征穿越', '离线在线鸿沟'],
    },
    {
      sectionId: 'eval-03',
      title: 'AB 实验基本功：分流、分层、显著性',
      tagline: '样本量不是拍脑袋是算出来的；AA 测试 + SRM 检验是实验质量控制的双保险。',
      difficulty: 'intermediate',
      estimatedMinutes: 12,
      keywords: ['AB 实验', '分流', '分层实验框架', 'MDE', 'SRM', 'CUPED'],
    },
    {
      sectionId: 'eval-04',
      title: '进阶实验：Holdout、反转、Switchback 与双边实验',
      tagline: '当策略影响双边市场或效果有长期滞后时，朴素 AB 会给出错误答案——这是分发负责人与普通 PM 的分水岭。',
      difficulty: 'advanced',
      estimatedMinutes: 12,
      keywords: ['Holdout', '反转实验', 'Switchback', 'SUTVA', '双边实验', '合成控制'],
    },
    {
      sectionId: 'eval-05',
      title: '归因与数据陷阱：从指标异动到 badcase 闭环',
      tagline: '会读数比会做数更稀缺——八大经典陷阱与「先召回后排序」的分层归因是每个策略 PM 的保命技能。',
      difficulty: 'advanced',
      estimatedMinutes: 12,
      keywords: ['数据陷阱', '辛普森悖论', '新奇效应', '指标异动归因', 'badcase 分析'],
    },
  ],
};

// ============================================================
// 小节正文
// ============================================================

export const evalSections: Section[] = [
  // ----------------------------------------------------------
  // eval-01 指标体系：北极星、护栏与分层指标金字塔
  // ----------------------------------------------------------
  {
    sectionId: 'eval-01',
    chapterSlug: 'evaluation',
    title: '指标体系：北极星、护栏与分层指标金字塔',
    tagline: '指标不是平铺清单而是分层金字塔，「北极星 + 护栏」组合是分发场景的标准打法。',
    difficulty: 'foundational',
    estimatedMinutes: 10,
    keywords: ['北极星指标', '护栏指标', '指标金字塔', '生态指标', '基尼系数'],
    summary: [
      {
        text: '推荐系统的迭代本质是「提出假设 → 离线验证 → 小流量实验 → 推全 → 长期观察」的闭环，而指标金字塔决定了这个闭环的方向盘。本节讲清北极星五条标准、体验/生态/商业/护栏的分层设计，以及小红书的三边北极星实践。',
      },
    ],
    blocks: [
      {
        blockId: 'eval-01-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: [
            { text: '为什么说评估体系是分发负责人的「第一工程」？因为分发系统的每一次迭代——改模型、调权重、加策略——都要靠指标回答「变好了还是变坏了」。', },
            { text: '指标定义错了，全公司会朝错误的方向优化', marks: ['bold'] },
            { text: '。行业共识是：评估体系必须深度融入产品核心战略，用多维度指标矩阵评估价值、用清晰的指标映射链路保证优化方向正确、用严谨的 AB 平台做科学决策，并用「北极星 + 护栏」组合实现健康平衡。' },
          ],
          sourceRefs: [
            { briefId: 'D6', briefSection: '核心概念框架§1', externalTitle: '从0构建大型AI推荐系统：如何定义效果评估体系', externalUrl: 'https://www.woshipm.com/pd/6238896.html' },
          ],
        },
      },
      {
        blockId: 'eval-01-b2',
        type: 'paragraph',
        payload: {
          content: [
            { text: '先看评估的「三层世界」。' },
            { text: '离线评估', marks: ['term'] },
            { text: '用历史数据切分训练/测试集，实施简单、不需要与用户交互，但只能说明预测环节的能力，「能说明的问题较少」，适合用来淘汰明显不行的算法；' },
            { text: '在线 AB 实验', marks: ['term'] },
            { text: '是因果推断的黄金标准，能测出真实因果效应，但成本高、周期长、还受网络效应干扰；' },
            { text: '用户研究', marks: ['term'] },
            { text: '（问卷、访谈、人工评估）成本高、样本小，却能捕捉满意度、惊喜度、信任度这些行为数据测不到的维度。三者不是替代关系，工业界的做法是离线 + 在线结合、定期做用户调研。' },
          ],
          sourceRefs: [
            { briefId: 'D6', briefSection: '核心概念框架§2', externalTitle: '项亮《推荐系统实践》综述', externalUrl: 'https://yongfeng.me/attach/rs-survey-zhang.pdf' },
            { briefId: 'D6', briefSection: '核心概念框架§2', externalUrl: 'https://carlos9310.github.io/2019/01/12/introduction-and-evaluation-for-RS/' },
          ],
        },
      },
      {
        blockId: 'eval-01-b3',
        type: 'paragraph',
        payload: {
          content: [
            { text: '三层世界之外还有两个值得知道的补充方法。一是 Netflix 提出的 ' },
            { text: 'Replay（动态离线评估）', marks: ['term'] },
            { text: '——「重放」线上日志，比静态离线评估更接近线上环境；二是 ' },
            { text: 'Interleaving（交错实验）', marks: ['term'] },
            { text: '：把算法 A、B 的结果交替混排给同一批用户，用点击归属判胜负，' },
            { text: '10³ 个样本就能达到 AB 测试 10⁵ 个样本的判别力', marks: ['bold'] },
            { text: '。但它只能测「相对偏好」，测不出完整业务表现，所以 Netflix 采用「Interleaving 快速筛选 + AB 测长期影响」的两阶段结构——先用便宜的实验淘汰 99% 的候选，再把昂贵的 AB 留给真正值得测的。' },
          ],
          sourceRefs: [
            { briefId: 'D6', briefSection: '核心概念框架§2', externalTitle: 'Netflix 快速线上评估方法 Interleaving（王喆译）', externalUrl: 'https://cloud.tencent.com/developer/article/1457260' },
            { briefId: 'D6', briefSection: '核心概念框架§2', externalTitle: '王喆《深度学习推荐系统》7.3 节', externalUrl: 'https://blog.csdn.net/MYJace/article/details/120324554' },
          ],
        },
      },
      {
        blockId: 'eval-01-b4',
        type: 'diagram',
        payload: {
          diagramId: 'fig-metrics-pyramid',
          caption: '北极星 + 护栏指标金字塔：塔尖 1 个北极星，塔基一排护栏',
          altText: '五层金字塔图：塔尖为北极星指标（如人均时长），向下依次为用户体验层（CTR/CVR/完播/留存）、生态层（多样性/覆盖率/基尼系数）、商业层（GMV/eCPM/LTV），塔基为护栏横条（流失率/负反馈率/加载延迟），每层右侧挂小红书与电商实例标签。',
        },
      },
      {
        blockId: 'eval-01-b5',
        type: 'paragraph',
        payload: {
          content: [
            { text: '对分发负责人而言，指标不是平铺的清单，而是分层的金字塔：塔尖是 ' },
            { text: '1 个北极星指标', marks: ['bold'] },
            { text: '，往下依次是用户体验指标（CTR、CVR、完播率、时长、留存，过程性、短期可观测）、生态指标（多样性、覆盖率、基尼系数、长尾曝光，偏长期护栏）、商业指标（GMV、广告收入、eCPM、ROI），塔基是一排护栏指标（流失率、负反馈率、加载延迟、接口错误率）——任何优化如果击穿护栏，即使北极星上涨也不能推全。' },
          ],
          sourceRefs: [
            { briefId: 'D6', briefSection: '核心概念框架§3', externalUrl: 'https://www.woshipm.com/pd/6238896.html' },
          ],
        },
      },
      {
        blockId: 'eval-01-b6',
        type: 'keypoints',
        payload: {
          layout: 'grid-2',
          heading: '北极星指标的五条设计标准',
          items: [
            {
              title: '反映产品核心价值',
              description: [{ text: '用户从产品获得的核心价值是什么，北极星就该度量什么。内容平台常选日均使用时长，电商平台建议「每日下单用户数」而非 GMV——后者易被大促与客单价操纵。' }],
            },
            {
              title: '能被策略显著影响',
              description: [{ text: '如果推荐策略怎么改都撼不动这个指标，它就不能当北极星——它只是大盘天气，不是你的方向盘。' }],
            },
            {
              title: '简单易懂、全员可沟通',
              description: [{ text: '北极星要在晨会上 10 秒钟讲清楚。复合公式指标（如加权综合分）适合内部监控，不适合当北极星。' }],
            },
            {
              title: '先导而非滞后',
              description: [{ text: '月度营收、ARPU 是滞后指标，不能提前给出产品变化的信号；北极星应该先行反映趋势，给迭代留出反应时间。' }],
            },
            {
              title: '可操作、可拆解',
              description: [{ text: '能向下拆解成体验/生态/商业的过程指标，让每个团队的迭代都能映射回北极星的变化链路。' }],
            },
          ],
          sourceRefs: [
            { briefId: 'D6', briefSection: '核心概念框架§3', externalTitle: '指标体系构建：如何设计北极星指标', externalUrl: 'https://www.modb.pro/db/1858334610048954368' },
            { briefId: 'D6', briefSection: '核心概念框架§3', externalUrl: 'https://www.wikipie.com/docs/product-growth-metrics-commercialization/key-metrics-system' },
          ],
        },
      },
      {
        blockId: 'eval-01-b7',
        type: 'case',
        payload: {
          company: '小红书',
          companyLogoKey: 'xiaohongshu',
          scenario: '三边平台的北极星指标体系',
          background: [{ text: '小红书是「用户-内容消费者-创作者」三边平台，只盯单一消费指标会伤害供给侧，只盯规模又容易透支体验，需要一套能平衡三边利益的北极星组合。' }],
          approach: [{ text: '北极星目标按三边拆分：用户规模看 DAU/MAU，消费侧看人均使用推荐时长，供给侧看发布率；短期过程指标用点击率、点赞率、阅读完成率，其中阅读完成率 = 滑动到底次数 / 点击次数 × f(笔记长度)——用笔记长度做公平性校正，避免长笔记天然吃亏。' }],
          results: [
            { metric: '北极星结构', value: 'DAU/MAU + 人均推荐时长 + 发布率（三边各一）' },
            { metric: '过程指标公平性', value: '阅读完成率按笔记长度校正（王树森公开课口径）' },
          ],
          lesson: '多生态位平台的北极星必须是「组合」而非单点；过程指标要先做公平性校正，否则优化方向天然偏向某类内容。',
          sourceRefs: [
            { briefId: 'D6', briefSection: '核心概念框架§3', externalTitle: '王树森小红书推荐算法公开课笔记', externalUrl: 'https://github-wiki-see.page/m/swchen1234/Machine-Deep-Learning-Summary/wiki/小红书推荐算法‐1' },
          ],
        },
      },
      {
        blockId: 'eval-01-b8',
        type: 'paragraph',
        payload: {
          content: [
            { text: '生态指标是最容易「看起来很好」的一层，两个解读陷阱要牢记。第一，' },
            { text: '覆盖率必须配合分布指标看', marks: ['bold'] },
            { text: '：如果 99% 的流量都给了 1% 的热门物品，绝对覆盖率可以很高，但生态已经很差——所以覆盖率要搭配基尼系数或长尾曝光占比一起看。第二，判断算法有没有马太效应的判据是：用初始用户行为算出物品流行度的基尼系数 Gini1，再从推荐列表算出 Gini2，' },
            { text: 'Gini2 > Gini1 即说明推荐算法在放大马太效应', marks: ['bold'] },
            { text: '。护栏侧的经典设定是「推荐列表中非爆款商品占比不低于 30%」这类硬约束，配合流失率、负反馈率、加载延迟一起构成红线。' },
          ],
          sourceRefs: [
            { briefId: 'D6', briefSection: '典型指标与评估§2', externalTitle: '达观数据：怎样评价推荐系统的结果质量', externalUrl: 'https://www.jiqizhixin.com/articles/2020-04-01-12' },
            { briefId: 'D6', briefSection: '核心概念框架§3', externalUrl: 'https://www.woshipm.com/pd/6238896.html' },
          ],
        },
      },
      {
        blockId: 'eval-01-b9',
        type: 'quote',
        payload: {
          variant: 'principle',
          text: '「北极星 + 护栏」不是装饰：北极星回答「往哪开」，护栏回答「什么不能撞」。监控推荐优化过程中可能产生的负面影响，防止为追求北极星而损害用户体验或平台生态。',
          attribution: '人人都是产品经理《从0构建大型AI推荐系统》',
          sourceRefs: [
            { briefId: 'D6', briefSection: '核心概念框架§3', externalUrl: 'https://www.woshipm.com/pd/6238896.html' },
          ],
        },
      },
      {
        blockId: 'eval-01-b10',
        type: 'list',
        payload: {
          variant: 'myths',
          heading: '指标设计的三个常见误区',
          items: [
            [{ text: '把 CTR 当北极星。CTR 极易被标题党操纵，必须与完播、时长、负反馈联合看——只优化 CTR 的内容 Feed 必然走向低质。' }],
            [{ text: '用 GMV 当电商北极星。GMV = 流量 × CVR × 客单价，被大促与客单价结构操纵的空间太大；多篇来源建议改用「每日下单用户数」。' }],
            [{ text: '只看绝对覆盖率。覆盖率高不等于生态健康，必须配合基尼系数/长尾曝光占比等分布指标交叉验证。' }],
          ],
          sourceRefs: [
            { briefId: 'D6', briefSection: '典型指标与评估§1-3', externalUrl: 'https://www.woshipm.com/pd/6238896.html' },
          ],
        },
      },
    ],
    keyTakeaways: [
      '迭代闭环是「假设→离线验证→小流量→推全→长期观察」，评估体系是方向盘；指标定义错误会让全公司朝错误方向优化。',
      '指标金字塔 = 1 个北极星 + 体验/生态/商业三层 + 一排护栏；优化击穿护栏线即不可推全。',
      '北极星五标准：反映核心价值、可被策略影响、简单可沟通、先导而非滞后、可操作。',
      '小红书实践：三边北极星（DAU/MAU、人均时长、发布率），过程指标需做公平性校正。',
      '生态指标防自欺：覆盖率配分布指标看，Gini2 > Gini1 即算法放大马太效应。',
    ],
    relatedSections: ['eval-02', 'eval-03', 'strategy-03', 'strategy-06'],
    diagramsUsed: ['fig-metrics-pyramid'],
    updatedAt: '2026-09-01',
  },

  // ----------------------------------------------------------
  // eval-02 离线评估：从 AUC 到 GAUC/NDCG 的指标选型
  // ----------------------------------------------------------
  {
    sectionId: 'eval-02',
    chapterSlug: 'evaluation',
    title: '离线评估：从 AUC 到 GAUC/NDCG 的指标选型',
    tagline: '离线指标决定模型有没有资格进场，理解每个指标的盲区才能避免被「离线涨线上跌」打脸。',
    difficulty: 'intermediate',
    estimatedMinutes: 11,
    keywords: ['AUC', 'GAUC', 'NDCG', '离线评估', '特征穿越', '离线在线鸿沟'],
    summary: [
      {
        text: '离线指标是模型进入小流量实验的入场券。本节梳理 P/R@K、AUC、GAUC、NDCG、LogLoss/PCOC 的适用边界与盲区，给出「离线涨线上不涨」的五类原因清单与修正路径。',
      },
    ],
    blocks: [
      {
        blockId: 'eval-02-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: [
            { text: '离线评估的定位要摆正：它不是效果证明书，而是', },
            { text: '淘汰赛的资格赛', marks: ['bold'] },
            { text: '——用最低成本把预测明显不准的算法刷掉，把昂贵的线上流量留给值得测的候选。用错指标做资格赛，要么放进不该进的模型浪费流量，要么误杀好模型。所以策略 PM 不需要会推导每个公式，但必须说清每个指标', },
            { text: '衡量什么、不衡量什么', marks: ['bold'] },
            { text: '。' },
          ],
          sourceRefs: [
            { briefId: 'D6', briefSection: '核心概念框架§2', externalUrl: 'https://yongfeng.me/attach/rs-survey-zhang.pdf' },
          ],
        },
      },
      {
        blockId: 'eval-02-b2',
        type: 'paragraph',
        payload: {
          content: [
            { text: '基础指标族先过一遍。' },
            { text: 'Precision@K', marks: ['term'] },
            { text: ' = Top-K 列表中命中数 / K，衡量「推得准不准」；' },
            { text: 'Recall@K', marks: ['term'] },
            { text: ' = Top-K 命中数 / 该用户实际相关物品数，衡量「捞得全不全」，是召回层的核心指标；' },
            { text: 'HR@K（HitRate）', marks: ['term'] },
            { text: '统计 Top-K 至少命中一个的用户占比，每用户只有一个相关物品时等价于 Recall@K；' },
            { text: 'MAP', marks: ['term'] },
            { text: '对命中位置的 Precision 取平均再对用户取均值，注意它是分用户排序后计算的，与全量排序的 P-R 曲线口径不同；' },
            { text: 'NDCG@K', marks: ['term'] },
            { text: ' = DCG（Σ rel_i / log₂(i+1)）除以理想排序 IDCG 归一化，衡量「相关性大的结果是否排在前面」。' },
          ],
          sourceRefs: [
            { briefId: 'D6', briefSection: '方法与算法详解§1(1)', externalUrl: 'http://esnl.hnu.edu.cn/liusiping_biyelunwen.pdf' },
            { briefId: 'D6', briefSection: '方法与算法详解§1(1)', externalUrl: 'https://www.biaodianfu.com/recommendation-system-metrics.html' },
            { briefId: 'D6', briefSection: '方法与算法详解§1(1)', externalUrl: 'https://paddlepedia.readthedocs.io/en/latest/tutorials/recommendation_system/evaluation_metric.html' },
          ],
        },
      },
      {
        blockId: 'eval-02-b3',
        type: 'keypoints',
        payload: {
          layout: 'grid-2',
          heading: '四个高频指标的盲区地图',
          items: [
            {
              title: 'AUC：衡量 pairwise 排序，仅此而已',
              description: [{ text: '物理含义是「随机抽一对正负样本，模型给正样本打分更高的概率」。它不衡量校准、不衡量 Top-K 收益、不衡量流量分配与长期留存——AUC 涨 1 个点不能推出 CTR 涨。' }],
              sourceRefs: [{ briefId: 'D6', briefSection: '方法与算法详解§1(2)', externalUrl: 'https://mianshidashi.cn/interview-questions/bytedance/algorithm-engineer/bytedance-algorithm-offline-online-auc-gap' }],
            },
            {
              title: 'GAUC：按用户分组的 AUC，精排核心离线指标',
              description: [{ text: 'AUC 的致命缺陷是跨用户计算，而线上排序永远只在「同一用户的一次请求内」比较 item。GAUC 按用户（session）分组算 AUC 再按曝光数加权，更贴近线上点击偏好——全局排序强不代表同请求内排序强。' }],
              sourceRefs: [{ briefId: 'D6', briefSection: '方法与算法详解§1(2)', externalTitle: '推荐模型离线评测效果好，线上效果却不佳的原因', externalUrl: 'https://yangxudong.github.io/why-rec-model-fail/' }],
            },
            {
              title: 'NDCG：位置敏感，「排在前面的错误更伤体验」',
              description: [{ text: 'AUC/GAUC 对错排第 2 名与第 20 名的惩罚差异有限，NDCG 用 log 折扣显式惩罚高位错误。搜索排序、首页推荐、重排阶段的评估应优先看 NDCG。注意最新研究警告：采样版 NDCG 与未采样版可能不一致，应避免混用。' }],
              sourceRefs: [{ briefId: 'D6', briefSection: '发展与前沿§1', externalUrl: 'https://arxiv.org/pdf/2307.15053.pdf' }],
            },
            {
              title: 'LogLoss 与 PCOC：广告场景的校准线',
              description: [{ text: 'pCTR 参与竞价计费时，系统性高估/低估直接影响收入与广告主 ROI。LogLoss 衡量概率质量，PCOC（预测 CTR / 实际 CTR）衡量校准偏差——排序模型看 AUC，竞价模型必须同时盯校准。' }],
              sourceRefs: [{ briefId: 'D4', briefSection: '典型指标与评估§1' }],
            },
          ],
        },
      },
      {
        blockId: 'eval-02-b4',
        type: 'diagram',
        payload: {
          diagramId: 'fig-offline-online-gap',
          caption: '离线-在线鸿沟：五类原因与对应修正路径',
          altText: '左侧「离线评估涨」气泡与右侧「线上指标不动或下跌」气泡之间隔着五个断桥障碍：冰山效应、特征穿越、样本构造偏差、链路吞噬、目标错位；每个障碍下挂一行修正路径小字（时间切分、shadow scoring、IPS、小流量 AB 终验）。',
        },
      },
      {
        blockId: 'eval-02-b5',
        type: 'paragraph',
        payload: {
          content: [
            { text: '「离线涨了 2 个点，上线纹丝不动」是策略 PM 最常遇到的撕扯点。系统化的排查清单有五类原因。' },
            { text: '一是冰山效应（模型主场效应）', marks: ['bold'] },
            { text: '：离线训练用的是「有偏的冰山上的数据」（被曝光过的样本），线上预估面对的却是整个冰山——新模型给从未曝光的灰色样本打了高分，一旦真实表现不好，离线涨、线上跌。缓解思路是无偏数据上采样、增大实验流量与训练周期。' },
            { text: '二是特征穿越', marks: ['bold'] },
            { text: '：训练时提前获取了预测时刻不可得的信息。' },
            { text: '三是样本构造偏差', marks: ['bold'] },
            { text: '：随机负采样采到大量容易区分的负样本，AUC 虚高，应从真实曝光未点击、同召回池或 hard negative 中采样。' },
            { text: '四是链路吞噬收益', marks: ['bold'] },
            { text: '：精排收益在召回覆盖、粗排截断、重排打散、频控、审核过滤、缓存降级中被层层稀释，离线评估完全看不到。' },
            { text: '五是目标错位', marks: ['bold'] },
            { text: '：NDCG 只度量单用户相对排序，覆盖不了多样性、整页布局协调等业务诉求。' },
          ],
          sourceRefs: [
            { briefId: 'D6', briefSection: '方法与算法详解§1(3)', externalUrl: 'https://yangxudong.github.io/why-rec-model-fail/' },
            { briefId: 'D6', briefSection: '方法与算法详解§1(3)', externalUrl: 'https://mathmach.com/3d4b29dd/' },
            { briefId: 'D6', briefSection: '方法与算法详解§1(3)', externalUrl: 'https://mianshidashi.cn/interview-questions/bytedance/algorithm-engineer/bytedance-algorithm-offline-online-auc-gap' },
          ],
        },
      },
      {
        blockId: 'eval-02-b6',
        type: 'case',
        payload: {
          company: '某短视频平台',
          companyLogoKey: 'generic',
          scenario: '特征穿越导致的「AUC 0.98 神话」',
          background: [{ text: '算法团队提交了一个离线 AUC 高达 0.98 的推荐模型，离线评估全面碾压旧模型，团队信心满满推上小流量。' }],
          approach: [{ text: '上线后 CTR 不升反暴跌 30%。排查发现训练样本把「用户当天的点赞行为」作为历史特征输入——预测时刻该信息根本不可得，模型学到的是「作弊答案」。修复特征口径后离线 AUC 回落到正常水位，线上效果才与离线对齐。' }],
          results: [
            { metric: '离线 AUC', value: '0.98（穿越特征作弊）→ 修复后回归正常水位' },
            { metric: '线上 CTR', value: '上线后暴跌 30%（CSDN 案例口径）' },
          ],
          lesson: '离线指标好得离谱时，第一反应不是庆祝而是怀疑：查特征时间戳口径、查标签泄漏、查训练/线上分布是否一致。',
          sourceRefs: [
            { briefId: 'D6', briefSection: '方法与算法详解§1(3)', externalTitle: '推荐算法离线评估与线上效果的差距分析', externalUrl: 'https://blog.csdn.net/2501_94449023/article/details/160859350' },
          ],
        },
      },
      {
        blockId: 'eval-02-b7',
        type: 'table',
        payload: {
          caption: '离线-在线指标对照表：每个环节盯什么、在哪断裂',
          columns: [
            { key: 'stage', title: '环节' },
            { key: 'offline', title: '核心离线指标' },
            { key: 'online', title: '对应线上指标' },
            { key: 'gap', title: '常见断裂点' },
          ],
          rows: [
            { stage: '召回', offline: 'Recall@K、HitRate、多路覆盖', online: '曝光量、覆盖用户数', gap: '离线用全库测，线上有截断与过滤' },
            { stage: '粗排/精排', offline: 'AUC、GAUC、LogLoss、NDCG@K', online: 'CTR、CVR、时长', gap: '冰山效应、特征穿越、AUC 跨用户' },
            { stage: '重排', offline: 'ILD、类目熵', online: '多样性、负反馈率', gap: '离线无法测用户真实「腻」的感受' },
            { stage: '全链路', offline: 'Replay 回放', online: '留存、GMV、eCPM', gap: '长期效应离线不可测' },
          ],
          sourceRefs: [
            { briefId: 'D6', briefSection: '典型指标与评估§4' },
          ],
        },
      },
      {
        blockId: 'eval-02-b8',
        type: 'paragraph',
        payload: {
          content: [
            { text: '对应的修正路径是一条流水线：先把离线评估集对齐到线上分布（按时间切分而非随机切分），再用 shadow scoring 在线上无影响地记录特征与分数 diff，接着用 IPS（曝光倾向加权）纠正选择偏差，辅以切片分析定位是哪个人群断裂，最后——也是唯一终验——', },
            { text: '小流量 AB 实验', marks: ['bold'] },
            { text: '。记住流程纪律：离线评估只有资格赛效力，任何离线收益都必须以线上 AB 确认为准。' },
          ],
          sourceRefs: [
            { briefId: 'D6', briefSection: '方法与算法详解§1(3)', externalUrl: 'https://mianshidashi.cn/interview-questions/bytedance/algorithm-engineer/bytedance-algorithm-offline-online-auc-gap' },
          ],
        },
      },
      {
        blockId: 'eval-02-b9',
        type: 'quote',
        payload: {
          variant: 'warning',
          text: '离线涨只是「获得做 AB 的资格」，不是「拿到了收益」。把离线指标涨幅当成业务收益去汇报，是策略 PM 信用破产的最快路径。',
          attribution: '工业界离线-在线鸿沟排查共识',
          sourceRefs: [
            { briefId: 'D6', briefSection: '方法与算法详解§1(3)', externalUrl: 'https://yangxudong.github.io/why-rec-model-fail/' },
          ],
        },
      },
    ],
    keyTakeaways: [
      '离线评估是资格赛：低成本淘汰预测不准的算法，终验只能靠小流量 AB。',
      'AUC 只衡量 pairwise 排序能力；GAUC 按用户分组加权，更贴近线上点击偏好，是精排核心离线指标。',
      'NDCG 位置敏感，适合搜索排序与重排场景；广告竞价模型必须同时盯 LogLoss/PCOC 校准。',
      '离线涨线上不涨五类原因：冰山效应、特征穿越、样本构造偏差、链路吞噬、目标错位。',
      '修正路径：时间切分对齐分布 → shadow scoring → IPS 加权 → 切片分析 → 小流量 AB 终验。',
    ],
    relatedSections: ['eval-01', 'eval-03', 'rec-05', 'search-05'],
    diagramsUsed: ['fig-offline-online-gap'],
    updatedAt: '2026-09-01',
  },

  // ----------------------------------------------------------
  // eval-03 AB 实验基本功：分流、分层、显著性
  // ----------------------------------------------------------
  {
    sectionId: 'eval-03',
    chapterSlug: 'evaluation',
    title: 'AB 实验基本功：分流、分层、显著性',
    tagline: '样本量不是拍脑袋是算出来的；AA 测试 + SRM 检验是实验质量控制的双保险。',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    keywords: ['AB 实验', '分流', '分层实验框架', 'MDE', 'SRM', 'CUPED'],
    summary: [
      {
        text: 'AB 实验是因果推断的黄金标准，但「做了 AB」不等于「做对了 AB」。本节讲透哈希分流与 Google 分层框架、MDE 样本量速算、AA 测试与 SRM 检验、CUPED 方差缩减，以及一套能说服上级的实验方案结构。',
      },
    ],
    blocks: [
      {
        blockId: 'eval-03-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: [
            { text: 'AB 实验的价值在于把「我觉得」变成「数据显示」，但它的可信度完全建立在机制细节上：分流是否均匀正交、样本量是否够、实验过程有没有被污染。这一节是基本功——', },
            { text: '基本功不过关，实验结果连讨论的资格都没有', marks: ['bold'] },
            { text: '。' },
          ],
          sourceRefs: [
            { briefId: 'D6', briefSection: '方法与算法详解§2', externalUrl: 'https://developer.volcengine.com/articles/7322139710725718067' },
          ],
        },
      },
      {
        blockId: 'eval-03-b2',
        type: 'paragraph',
        payload: {
          content: [
            { text: '分流的主流做法是哈希分桶：把每个实验桶的流量占比映射到 0-100 区间，用「用户 ID + 每层不同的 hash 因子」做哈希再取模。工程上有四个关键细节：① 用 MurmurHash 等低碰撞算法；② ' },
            { text: '每层独立加盐', marks: ['bold'] },
            { text: '保证层间正交（否则两层的实验会粘连）；③ 流量调整时优先在自己的区域内选择、只调整邻边，避免污染无关实验；④ 得物的做法是二次 Hash——第一次保证层间正交、第二次保证层内前后实验正交，并用卡方拟合优度检验验证 Hash 的均匀性与正交性。分流单元可以是用户、物品、会话或时间片，按干扰结构选择。' },
          ],
          sourceRefs: [
            { briefId: 'D6', briefSection: '方法与算法详解§2(1)', externalTitle: 'AB实验设计实现与分流算法', externalUrl: 'https://developer.volcengine.com/articles/7322139710725718067' },
            { briefId: 'D6', briefSection: '方法与算法详解§2(1)', externalTitle: '得物AB实验平台数据驱动决策实践', externalUrl: 'https://tech.dewu.com/article?id=122' },
          ],
        },
      },
      {
        blockId: 'eval-03-b3',
        type: 'diagram',
        payload: {
          diagramId: 'fig-ab-layering',
          caption: 'Google 重叠实验框架：同层互斥、不同层正交',
          altText: '左侧总流量域竖切，中间为召回层、粗排层、精排层、UI 层等水平层，每层内部若干实验槽位；一个请求穿过每层各命中一个实验；右侧发布层承载已验证策略作为新默认值；标注分流公式 mod = f(cookie, layer)。',
        },
      },
      {
        blockId: 'eval-03-b4',
        type: 'keypoints',
        payload: {
          layout: 'grid-2',
          heading: 'Google 分层实验框架的三个核心概念',
          items: [
            {
              title: '域（domain）：流量的划分',
              description: [{ text: '先把流量切成域，域内再做实验；普通域做日常迭代，保留域做对照。' }],
            },
            {
              title: '层（layer）：参数的子集',
              description: [{ text: '参数按模块划分到层，同一参数不能出现在多个层。同层实验互斥（一个请求只命中一个实验），不同层正交（一个请求每层各命中一个实验）。' }],
            },
            {
              title: '发布层（Launch layer）',
              description: [{ text: '已验证策略进入发布层成为新默认值，支持逐步放量；避免「旧默认值永远不动」的锚定。' }],
            },
            {
              title: '工业界落地版：按「相互影响」分层',
              description: [{ text: '王树森的总结更实用：把容易相互增强或抵消的实验放在同一层（如都改召回配额），互不相关的放不同层。分桶用 mod = f(cookie, layer) 而非 f(cookie)，保证跨层独立。' }],
            },
          ],
          sourceRefs: [
            { briefId: 'D6', briefSection: '方法与算法详解§2(2)', externalTitle: 'Google 重叠实验框架', externalUrl: 'https://logosty.github.io/2019/11/22/分层实验框架-Google-重叠实验框架-更多-更好-更快地实验.html' },
            { briefId: 'D6', briefSection: '方法与算法详解§2(2)', externalTitle: '王树森推荐系统公开课笔记', externalUrl: 'https://rubyjiang18.github.io/posts/2024/06/blog-post-4/' },
          ],
        },
      },
      {
        blockId: 'eval-03-b5',
        type: 'formula',
        payload: {
          name: 'AB 实验最小样本量速算',
          expression: 'n = 16 × p × (1 − p) / δ²',
          symbolNotes: [
            { symbol: 'p', meaning: '基线转化率（如 CTR = 5%）' },
            { symbol: 'δ', meaning: 'MDE，最小可检测效应的绝对值（业务上有意义的最小提升）' },
            { symbol: 'n', meaning: '每组所需样本量（α = 0.05、功效 = 0.8 时）' },
          ],
          intuition: [
            { text: '样本量由四个参数决定：基线 p、MDE、显著性水平 α（常取 0.05）、统计功效 1−β（常取 0.8）。基准 5% 转化率检测 1% 相对提升约需每组 7600 样本；而 ' },
            { text: 'MDE 从 1% 缩小到 0.1%，样本量要放大 100 倍', marks: ['bold'] },
            { text: '。需要天数 = 最小样本量 / 每天可用样本量，再向上取整到 7 的倍数以覆盖完整周期；字节的实践是留存类实验至少 14 天、覆盖两个完整周。' },
          ],
          sourceRefs: [
            { briefId: 'D6', briefSection: '方法与算法详解§2(3)', externalUrl: 'https://github.com/zsc/growth_hacker/blob/main/chapter6.md' },
            { briefId: 'D6', briefSection: '方法与算法详解§2(3)', externalUrl: 'https://www.ppmy.cn/news/1193536.html' },
            { briefId: 'D6', briefSection: '方法与算法详解§2(3)', externalTitle: 'AB实验在字节跳动推荐系统中的应用与实践', externalUrl: 'https://www.cnblogs.com/bytedata/p/17999746' },
          ],
        },
      },
      {
        blockId: 'eval-03-b6',
        type: 'steps',
        payload: {
          orientation: 'vertical',
          heading: '实验质量控制流程：AA → SRM → 效果判读',
          steps: [
            {
              title: '① AA 空跑',
              description: [{ text: '各分组跑完全相同的无策略空跑实验，探查 SDK 接入、埋点、指标管道问题——AA 都能显著，实验平台就有 bug。' }],
              badge: '前置必做',
            },
            {
              title: '② SRM 卡方检验',
              description: [{ text: '用卡方拟合优度检验实际分流人数与期望比例是否一致。只看比例不够（比例缺乏样本量信息），必须做统计检验。出现 SRM 就找到根因重跑，而不是简单加权。' }],
              badge: '微软 ExP 阈值 p < 0.0005',
            },
            {
              title: '③ 正式实验，不偷看',
              description: [{ text: '实验开始后不改配置、不中途看 p 值决定停止（Peeking 会系统性抬高假阳性）。预先确定时长与样本量，或改用序贯检验/mSPRT。' }],
            },
            {
              title: '④ 四种结果状态，各有决策预案',
              description: [{ text: '大幅显著→推全；小幅显著→扩流量或 CUPED 降方差再验；显著负向→回滚并归因；不显著→用 MDE 判断是真无效还是灵敏度不足。' }],
            },
          ],
          sourceRefs: [
            { briefId: 'D6', briefSection: '方法与算法详解§2(4)', externalUrl: 'https://cloud.tencent.com/developer/article/2036080' },
            { briefId: 'D6', briefSection: '策略产品应用场景§1', externalUrl: 'https://www.woshipm.com/user-research/6078115.html' },
          ],
        },
      },
      {
        blockId: 'eval-03-b7',
        type: 'case',
        payload: {
          company: '微软',
          companyLogoKey: 'microsoft',
          scenario: 'ExP 实验平台的 SRM 检验体系',
          background: [{ text: '微软 ExP 平台每年跑数万个实验，发现相当比例的实验存在样本比例不匹配（SRM）：实验组与对照组的实际人数偏离设计比例。这类实验的结论从根上不可信，但如果只看转化率 diff 完全无感。' }],
          approach: [{ text: '把 SRM 卡方检验做成平台级自动检查，采用极保守阈值 p < 0.0005 报警。并明确方法论纪律：SRM 是「各种质量问题的症状」，根源可能在分流配置、用户 ID 不稳定、上报丢失、数据 join 或分析筛选条件——最科学的做法是找到根因后按原设计重跑实验，而不是用统计加权「抢救」数据。eBay 后续用 SPRT 序贯检验做实时 SRM 监控，检测精确率从 28% 提升到 95%。' }],
          results: [
            { metric: 'SRM 报警阈值', value: 'p < 0.0005（微软 ExP 保守口径）' },
            { metric: 'SPRT 实时监控精确率', value: '28% → 95%（eBay）' },
          ],
          lesson: '看效果之前先看质量：SRM 不通过的实验，diff 再漂亮也要作废重跑。',
          sourceRefs: [
            { briefId: 'D6', briefSection: '方法与算法详解§2(4)', externalTitle: 'A/B测试中诊断样本比例不匹配（SRM）问题（KDD19 译介）', externalUrl: 'https://developer.volcengine.com/articles/7387285895289765938' },
            { briefId: 'D6', briefSection: '发展与前沿§2', externalTitle: 'Ensure A/B Test Quality at Scale with SRM Detection（eBay）', externalUrl: 'https://arxiv.org/pdf/2208.07766' },
          ],
        },
      },
      {
        blockId: 'eval-03-b8',
        type: 'case',
        payload: {
          company: '得物',
          companyLogoKey: 'dewu',
          scenario: 'CUPED 方差缩减救活「不显著」实验',
          background: [{ text: '得物实验平台上部分指标天然方差大（如 UV 价值），常规检验下假阳性率高、实验灵敏度不足，很多真实有效的策略被判「不显著」。' }],
          approach: [{ text: '引入微软 2013 年提出的 CUPED：利用实验前数据构造协变量 X，计算 Y_cv = Y − θX，修正后均值仍是 Y 的无偏估计，而方差变为 Var(Y)×(1−ρ²)——协变量与指标相关性越高，方差缩减越明显。得物叠加 Delta 方法修正 UV 类比率指标。' }],
          results: [
            { metric: 'UV 价值第一类错误率', value: '15.37% → 4.63%（得物实验平台）' },
          ],
          lesson: '「不显著」先别急着放弃：用 CUPED 缩减方差、扩流量或延长周期，都可能把埋在噪声里的真实效应捞出来。',
          sourceRefs: [
            { briefId: 'D6', briefSection: '方法与算法详解§2(4)', externalTitle: '得物AB实验平台数据驱动决策实践', externalUrl: 'https://tech.dewu.com/article?id=122' },
            { briefId: 'D6', briefSection: '方法与算法详解§2(4)', externalTitle: '实验效果不显著？用 CUPED 缩减方差', externalUrl: 'https://jeffshow.com/use-cuped-to-variance-reduction-in-abtest.html' },
          ],
        },
      },
      {
        blockId: 'eval-03-b9',
        type: 'keypoints',
        payload: {
          layout: 'list',
          heading: '向上汇报：一套能说服上级的实验方案结构',
          items: [
            {
              title: '先对齐目标，再谈实验',
              description: [{ text: '把策略收益映射到「北极星 + 护栏」框架，说清预期影响哪一级指标、为什么。汇报顺序：核心指标（是否达预期）→ 辅助指标（机理是否自洽）→ 护栏/反向指标（负面影响是否可接受）。' }],
            },
            {
              title: '统计参数写进方案',
              description: [{ text: '基线值、MDE、α、功效、所需样本量与天数、是否覆盖完整周期——全部实验前定死；先跑 AA 验证分流与埋点，SRM 通过后才看效果。' }],
            },
            {
              title: '「不显著」的判读话术',
              description: [{ text: '用 MDE 区分真无效与灵敏度不足：MDE=0.5% < 预期提升 1%，说明真的不显著；MDE=2% > 预期提升，说明灵敏度不足，应扩流量或延长观察。且要声明「实验期间增幅 ≠ 推全后增幅」。' }],
              sourceRefs: [{ briefId: 'D6', briefSection: '策略产品应用场景§1', externalUrl: 'https://www.volcengine.com/docs/6287/65838' }],
            },
            {
              title: '预注册纪律',
              description: [{ text: '实验开始后不改配置、不偷看停止；四种结果状态（大幅显著/小幅显著/显著负向/不显著）预先写好各自的决策预案，防止「看数下菜碟」。' }],
            },
          ],
          sourceRefs: [
            { briefId: 'D6', briefSection: '策略产品应用场景§1', externalUrl: 'https://www.woshipm.com/user-research/6078115.html' },
          ],
        },
      },
      {
        blockId: 'eval-03-b10',
        type: 'quote',
        payload: {
          variant: 'principle',
          text: '样本量不是拍脑袋，是算出来的。把基线、MDE、α、功效写进实验方案，是策略 PM 从「提需求的人」变成「做决策的人」的第一步。',
          attribution: '增长黑客实验方法论',
          sourceRefs: [
            { briefId: 'D6', briefSection: '策略产品应用场景§1', externalUrl: 'https://github.com/zsc/growth_hacker/blob/main/chapter6.md' },
          ],
        },
      },
    ],
    keyTakeaways: [
      '分流靠哈希分桶：MurmurHash、每层独立加盐、流量调整只动邻边；得物用二次 Hash + 卡方检验验证正交性。',
      'Google 分层框架：域/层/实验三概念，同层互斥、不同层正交，发布层承载已验证策略。',
      '样本量四参数：基线 p、MDE、α=0.05、功效 0.8；n = 16p(1−p)/δ²，天数取整到 7 的倍数，留存实验 ≥14 天。',
      'AA 测试 + SRM 卡方检验是双保险；微软 ExP 阈值 p<0.0005，出现 SRM 找根因重跑而非加权。',
      'CUPED 用实验前协变量缩减方差 1−ρ²，得物第一类错误率 15.37%→4.63%；汇报时用 MDE 判读「不显著」。',
    ],
    relatedSections: ['eval-02', 'eval-04', 'eval-05'],
    diagramsUsed: ['fig-ab-layering'],
    updatedAt: '2026-09-01',
  },

  // ----------------------------------------------------------
  // eval-04 进阶实验：Holdout、反转、Switchback 与双边实验
  // ----------------------------------------------------------
  {
    sectionId: 'eval-04',
    chapterSlug: 'evaluation',
    title: '进阶实验：Holdout、反转、Switchback 与双边实验',
    tagline: '当策略影响双边市场或效果有长期滞后时，朴素 AB 会给出错误答案——这是分发负责人与普通 PM 的分水岭。',
    difficulty: 'advanced',
    estimatedMinutes: 12,
    keywords: ['Holdout', '反转实验', 'Switchback', 'SUTVA', '双边实验', '合成控制'],
    summary: [
      {
        text: '朴素 AB 有两个致命盲区：长期滞后效应看不见、双边市场相互污染。本节覆盖 Holdout 与反转实验的长期观测机制、SUTVA 违反与 Switchback 时间片轮转、以及无法随机化时的 DID 与合成控制法。',
      },
    ],
    blocks: [
      {
        blockId: 'eval-04-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: [
            { text: '普通 AB 实验回答的是「这几天、这批用户、这个指标」的问题。但分发负责人要回答两个更难的问题：' },
            { text: '一年下来整个部门的累计收益是多少？', marks: ['bold'] },
            { text: '这个策略放到双边市场里还成立吗？', marks: ['bold'] },
            { text: '前者需要 Holdout 与反转实验，后者需要 Switchback 与双边实验设计——这是进阶实验要解决的问题。' },
          ],
        },
      },
      {
        blockId: 'eval-04-b2',
        type: 'diagram',
        payload: {
          diagramId: 'fig-holdout-reverse',
          caption: 'Holdout 与反转桶：部门收益的度量衡与长期效果的观测窗',
          altText: '用户池横切为 10% Holdout 桶与 90% 实验桶（实验桶内再分 AB）；下方时间轴展示推全时刻新建推全层并保留 5% 反转桶继续跑旧策略；标注「实验收益不能简单相加」与「反转桶关闭才是真正 100% 推全」。',
        },
      },
      {
        blockId: 'eval-04-b3',
        type: 'paragraph',
        payload: {
          content: [
            { text: 'Holdout 机制解决「部门收益怎么算」：取 10% 用户作为 holdout 桶，' },
            { text: '推荐系统只用剩余 90% 用户做实验，两者互斥', marks: ['bold'] },
            { text: '；考核期末，10% holdout 桶 vs 90% 实验桶的归一化 diff，就是整个部门的业务收益。为什么要这么麻烦？因为' },
            { text: '实验叠加通常有折损，单个实验的收益不能简单相加', marks: ['bold'] },
            { text: '——两个各报 +2% 的实验推全后往往只贡献 +3%。每个考核周期结束后清空 holdout 桶、重新随机划分，防止桶内用户被「养废」。' },
          ],
          sourceRefs: [
            { briefId: 'D6', briefSection: '方法与算法详解§3(1)', externalTitle: '王树森推荐系统公开课笔记', externalUrl: 'https://rubyjiang18.github.io/posts/2024/06/blog-post-4/' },
          ],
        },
      },
      {
        blockId: 'eval-04-b4',
        type: 'paragraph',
        payload: {
          content: [
            { text: '反转实验解决「尽快推全腾桶」与「长期指标有滞后」的矛盾。点击率、点赞率、完播率会立刻响应新策略，但留存滞后非常严重——' },
            { text: '短期可能观测不到显著变化，却在之后几个月持续改善', marks: ['bold'] },
            { text: '。做法是：推全时新建一个与其他层正交的「推全层」，保留约 5% 反转桶继续跑旧策略，长期观测新旧策略的 diff；反转实验完成、关闭反转桶的那一刻，才是真正的 100% 推全。向上级承诺短期收益的同时用反转桶回答「长期是否仍然成立」，是分发负责人建立信任的关键动作。' },
          ],
          sourceRefs: [
            { briefId: 'D6', briefSection: '方法与算法详解§3(1)', externalTitle: '推荐系统笔记：反转实验', externalUrl: 'https://github.com/daydayde/RecommenderSystemNotes/blob/main/推荐系统.md' },
            { briefId: 'D6', briefSection: '策略产品应用场景§1' },
          ],
        },
      },
      {
        blockId: 'eval-04-b5',
        type: 'keypoints',
        payload: {
          layout: 'grid-2',
          heading: '朴素 AB 失效的两个根源与武器库',
          items: [
            {
              title: 'SUTVA 违反：一个用户的处理影响其他用户',
              description: [{ text: 'AB 隐含个体干预稳定性假设（SUTVA），但双边市场里用户共享同一批运力/流量池：给实验组的策略会污染对照组。Blake 和 Coey（2014）在拍卖实验中发现，竞标者间干扰使处理效应估计错误地扩大了两倍。' }],
              sourceRefs: [{ briefId: 'D6', briefSection: '方法与算法详解§3(2)', externalUrl: 'https://arxiv.org/pdf/2002.05670v3' }],
            },
            {
              title: 'Switchback：时间片轮转对抗空间溢出',
              description: [{ text: '实验单元在时间轴上反复切换实验组/对照组状态。时间粒度越粗，时间干扰偏差越小但方差越大；还要警惕携带效应（Carryover）——时刻 t 的策略影响延续到 t+m。配对随机轮转可节约资源，适合天气等不可控因素场景。' }],
              sourceRefs: [{ briefId: 'D6', briefSection: '方法与算法详解§3(3)', externalTitle: '美团《可信实验白皮书04》', externalUrl: 'https://tech.meituan.com/2025/06/06/meituan-AB-Online-Controlled-Experiment-04.html' }],
            },
            {
              title: '双边实验：流量数量和质量都要打平',
              description: [{ text: '推荐策略同时影响消费侧与供给侧（作者投稿意愿）。抖音集团信息流的经验是需要保持两套排序策略，保证「流量数量和质量都打平」，否则供给侧效应会把结论带偏。' }],
              sourceRefs: [{ briefId: 'D5', briefSection: '典型指标与评估§4' }],
            },
            {
              title: '无法随机化时：DID 与合成控制',
              description: [{ text: '美团决策树：可随机→RCT/轮转；只能按区域半随机→双重差分 DID；只能整城干预→合成控制法，对潜在控制组样本库做线性加权，构造与受干预地区政策前完全类似的「反事实替身」。' }],
              sourceRefs: [{ briefId: 'D6', briefSection: '方法与算法详解§3(4)', externalTitle: '2025 可信实验白皮书', externalUrl: 'https://s3plus.meituan.net/ddfile/2025可信实验白皮书2025.8.20.pdf' }],
            },
          ],
        },
      },
      {
        blockId: 'eval-04-b6',
        type: 'diagram',
        payload: {
          diagramId: 'fig-switchback',
          caption: 'Switchback 时间片轮转：用时间维度换空间维度的干净',
          altText: '时间轴上交替染色的实验组与对照组时间片（A-B-A-B-A…）；旁挂「粒度越粗偏差越小、方差越大」的权衡曲线小图；对照小图展示普通 AB 在双边市场中实验组用户共享对照组运力的污染箭头。',
        },
      },
      {
        blockId: 'eval-04-b7',
        type: 'case',
        payload: {
          company: '快手',
          companyLogoKey: 'kuaishou',
          scenario: '直播双边市场的「双边分流 + 时间片轮转」组合实验',
          background: [{ text: '直播场景是典型双边市场：主播侧与观众侧共享同一直播间流量，只对观众随机分流时，实验组观众的涌入会改变主播行为，进而影响对照组观众的体验——SUTVA 被严重违反。' }],
          approach: [{ text: '快手采用「双边实验（主播侧 + 观众侧同时分流）+ 时间片轮转」的组合设计：先在供给侧与消费侧分别独立分流，再叠加 Switchback 让策略状态在时间轴上交替，通过比较多时间段内实验/对照状态的差异来估计真实效应。' }],
          results: [
            { metric: '实验设计', value: '双边分流 + Switchback 轮转组合（快手实践）' },
          ],
          lesson: '双边市场没有银弹：分流单元、轮转粒度、携带效应检验都要按业务干扰结构定制——先画清「谁影响谁」的因果图，再选实验设计。',
          sourceRefs: [
            { briefId: 'D6', briefSection: '方法与算法详解§3(3)', externalTitle: '快手因果推断与实验设计', externalUrl: 'https://www.sohu.com/a/487950696_121124371' },
            { briefId: 'D6', briefSection: '方法与算法详解§3(3)', externalUrl: 'https://juejin.cn/post/7323028184667471923' },
          ],
        },
      },
      {
        blockId: 'eval-04-b8',
        type: 'case',
        payload: {
          company: '小红书',
          companyLogoKey: 'xiaohongshu',
          scenario: '新笔记提权实验的溢出效应翻车',
          background: [{ text: '小红书做「新笔记提权」扶持策略的 AB 实验：实验组新笔记获得额外曝光加权，对照组不加。小流量阶段实验组笔记数据显著更好，diff 为正，看起来扶持策略有效。' }],
          approach: [{ text: '推全后收益却消失了。归因发现：新笔记之间共享同一个流量池，小流量时实验组笔记抢的是对照组笔记的量（diff 被高估）；推全后所有新笔记都被提权，等于没有提权——这是典型的溢出效应，需要双边隔离设计才能测准。' }],
          results: [
            { metric: '小流量 AB diff', value: '显著为正（溢出效应高估）' },
            { metric: '推全后收益', value: '消失（小红书新笔记提权案例）' },
          ],
          lesson: '凡是「策略对象之间共享资源池」的实验（创作者扶持、商家补贴、广告竞价），都要先怀疑溢出效应，diff 为正不等于推全有收益。',
          sourceRefs: [
            { briefId: 'D5', briefSection: '策略产品应用场景·小红书' },
          ],
        },
      },
      {
        blockId: 'eval-04-b9',
        type: 'table',
        payload: {
          caption: '场景-方法决策矩阵：按可随机化程度选实验设计',
          columns: [
            { key: 'scene', title: '场景' },
            { key: 'method', title: '推荐方法' },
            { key: 'note', title: '注意事项' },
          ],
          rows: [
            { scene: '可按用户随机化', method: '随机对照 RCT', note: '首选；配合 AA + SRM 质控' },
            { scene: '空间溢出/样本量不足', method: 'Switchback 时间片轮转', note: '粒度权衡偏差与方差；警惕携带效应' },
            { scene: '双边市场（主播/观众、骑手/用户）', method: '双边分流 + 轮转组合', note: '保证流量数量与质量双打平' },
            { scene: '只能按区域半随机', method: '双重差分 DID', note: '如半城分组设计' },
            { scene: '只能整城干预、干预不受控', method: '合成控制法', note: '用 Donor Pool 加权构造反事实替身' },
            { scene: '长期滞后指标（留存）', method: 'Holdout + 反转实验', note: '反转桶关闭才是真正 100% 推全' },
          ],
          sourceRefs: [
            { briefId: 'D6', briefSection: '方法与算法详解§3', externalUrl: 'https://s3plus.meituan.net/ddfile/2025可信实验白皮书2025.8.20.pdf' },
          ],
        },
      },
      {
        blockId: 'eval-04-b10',
        type: 'quote',
        payload: {
          variant: 'insight',
          text: '多样性、探索类策略的收益滞后于代价：短期 CTR 会跌，长期留存才涨。传统只看几天 CTR 的 AB 会系统性误杀这类策略——它们需要 4-8 周的长期持有测试加交错实验。',
          attribution: '工业界 EE 策略评估经验',
          sourceRefs: [
            { briefId: 'D5', briefSection: '方法与机制§2.2' },
          ],
        },
      },
    ],
    keyTakeaways: [
      'Holdout：10% 桶 vs 90% 实验桶的归一化 diff 作为部门收益；实验叠加有折损，收益不能简单相加；考核期末清空重划。',
      '反转实验：推全时保留 5% 旧策略桶长期观测留存等滞后指标；关闭反转桶才是真正 100% 推全。',
      'SUTVA 违反会让效应估计严重失真（拍卖实验曾放大两倍）；Switchback 用时间片轮转对抗空间溢出，粒度越粗偏差越小方差越大。',
      '双边实验要「数量与质量双打平」；小红书新笔记提权案例证明溢出效应会让 AB diff 推全后消失。',
      '无法随机化时的降级路径：半随机→DID，整城干预→合成控制法构造反事实替身。',
    ],
    relatedSections: ['eval-03', 'eval-05', 'strategy-02', 'strategy-06'],
    diagramsUsed: ['fig-holdout-reverse', 'fig-switchback'],
    updatedAt: '2026-09-01',
  },

  // ----------------------------------------------------------
  // eval-05 归因与数据陷阱：从指标异动到 badcase 闭环
  // ----------------------------------------------------------
  {
    sectionId: 'eval-05',
    chapterSlug: 'evaluation',
    title: '归因与数据陷阱：从指标异动到 badcase 闭环',
    tagline: '会读数比会做数更稀缺——八大经典陷阱与「先召回后排序」的分层归因是每个策略 PM 的保命技能。',
    difficulty: 'advanced',
    estimatedMinutes: 12,
    keywords: ['数据陷阱', '辛普森悖论', '新奇效应', '指标异动归因', 'badcase 分析'],
    summary: [
      {
        text: '指标异动先排外因后定内因；八大数据陷阱人人会背、人人会踩。本节给出异动归因的标准流程与拆解方法、八陷阱对照表，以及「先召回后排序」的 badcase 分层归因闭环。',
      },
    ],
    blocks: [
      {
        blockId: 'eval-05-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: [
            { text: '晋升分发负责人后，你的日常会从「设计策略」变成「解读数据」：老板问「昨天时长为什么跌了 3%」，业务方问「这个实验到底算不算成功」。', },
            { text: '会读数比会做数更稀缺', marks: ['bold'] },
            { text: '——这一节给你两套保命工具：指标异动的归因流程，和八大数据陷阱的免疫系统。' },
          ],
        },
      },
      {
        blockId: 'eval-05-b2',
        type: 'paragraph',
        payload: {
          content: [
            { text: '指标异动的标准流程是「' },
            { text: '先排外因，后定内因', marks: ['bold'] },
            { text: '」：外因包括数据统计错误、产品/策略变更、政策规则变动、大促营销；排完外因再用指标拆解 + 维度下钻定位内因。拆解方法按指标类型选择：' },
            { text: '加法指标', marks: ['term'] },
            { text: '（DAU、GMV）适用 Delta 法；' },
            { text: '比率指标', marks: ['term'] },
            { text: '适用剔除法、加权占比法；' },
            { text: '乘法漏斗', marks: ['term'] },
            { text: '（曝光→点击→转化）适用 LMDI 对数分解法。一个铁律：' },
            { text: '比率指标下钻必须拆成「结构效应 × 效率效应」', marks: ['bold'] },
            { text: '——占比变化与分项自身变化分开算，否则必然陷入辛普森悖论。' },
          ],
          sourceRefs: [
            { briefId: 'D6', briefSection: '方法与算法详解§4(1)', externalTitle: '指标异动归因', externalUrl: 'https://shootingwang.github.io/DataAnalysis-AttributionAnalysis.html' },
            { briefId: 'D6', briefSection: '方法与算法详解§4(1)', externalTitle: '异动分析技术解决方案——指标拆解', externalUrl: 'https://developer.aliyun.com/article/880392' },
          ],
        },
      },
      {
        blockId: 'eval-05-b3',
        type: 'table',
        payload: {
          caption: '八大数据陷阱对照表：表现、案例与对策',
          columns: [
            { key: 'trap', title: '陷阱' },
            { key: 'symptom', title: '表现' },
            { key: 'fix', title: '对策' },
          ],
          rows: [
            { trap: '新奇效应', symptom: '新功能上线短期指标大涨，数周后回落到与对照组无差', fix: '高粘性产品实验 ≥30 天，覆盖 7/30 日留存，观察指标衰减曲线' },
            { trap: '周期效应', symptom: '只跑 3 天，样本被高频用户主导，忽略周中周末差异', fix: '天数取整到 7 的倍数，≥2 个完整周' },
            { trap: '辛普森悖论', symptom: '分组看都赢，合并后反而输（微软周五 1% vs 周六 50% 流量案例）', fix: '中途不改流量配比；分层/分群分析；拆结构效应' },
            { trap: '偷看效应', symptom: '每天看 p 值，一显著就停，假阳性被系统性抬高', fix: '预先确定时长与样本量；用序贯检验/mSPRT' },
            { trap: '幸存者偏差', symptom: '只分析留存用户得出「功能受欢迎」，忽略 90% 流失用户', fix: '全量用户分析，分别看留存与流失原因' },
            { trap: '分流污染', symptom: '实验组分享的内容被对照组看到，对照组间接受益', fix: '评估网络效应，必要时换分流单元或 Switchback' },
            { trap: '选择性看数', symptom: '只汇报支持自己观点的切片', fix: '预注册指标体系；切片用于诊断而非挑结论' },
            { trap: 'p-hacking', symptom: '反复换口径、换指标，试到 p<0.05 为止', fix: '先定分析方案再执行；多重比较校正' },
          ],
          sourceRefs: [
            { briefId: 'D6', briefSection: '策略产品应用场景§2', externalUrl: 'https://github.com/zsc/growth_hacker/blob/main/chapter6.md' },
            { briefId: 'D6', briefSection: '策略产品应用场景§2', externalUrl: 'https://www.woshipm.com/user-research/6078115.html' },
            { briefId: 'D6', briefSection: '策略产品应用场景§2', externalUrl: 'http://blog.reyun.com/?p=4006' },
          ],
        },
      },
      {
        blockId: 'eval-05-b4',
        type: 'case',
        payload: {
          company: 'Airbnb',
          companyLogoKey: 'airbnb',
          scenario: '价格过滤器调整的新奇效应误判',
          background: [{ text: 'Airbnb 把价格过滤器上限从 300 美金调到 1000 美金并做了 AB 实验，上线 7 天后数据显示新版本提升显著，团队准备推全。' }],
          approach: [{ text: '团队顶住压力继续跑了 30 天，发现新旧版本的差异逐渐消失——早期收益来自用户对新功能的「好奇点击」而非真实价值。事后复盘：这是典型的新奇效应（Novelty Effect），如果 7 天就推全，等于把虚假收益写进了全年业绩。' }],
          results: [
            { metric: '7 天实验结论', value: '新版本提升显著' },
            { metric: '30 天实验结论', value: '与对照组差别不大（Airbnb 复盘口径）' },
          ],
          lesson: '高粘性产品的 UI/交互类改动尤其容易触发新奇效应：实验至少跑满 30 天并覆盖 7/30 日留存，画「指标随时间衰减曲线」再下结论。',
          sourceRefs: [
            { briefId: 'D6', briefSection: '策略产品应用场景§2', externalTitle: 'AB测试长期效应评估——新奇效应排除', externalUrl: 'https://www.eshutong.com/archives/46924.html' },
            { briefId: 'D6', briefSection: '策略产品应用场景§2', externalUrl: 'https://www.woshipm.com/user-research/6078115.html' },
          ],
        },
      },
      {
        blockId: 'eval-05-b5',
        type: 'case',
        payload: {
          company: '微软',
          companyLogoKey: 'microsoft',
          scenario: '流量配比中途变更引发的辛普森悖论',
          background: [{ text: '微软一个实验周五用 1% 流量、周六放量到 50%。分开看：周五新版本赢、周六新版本也赢；把两天数据合并计算，新版本反而输了——结论自相矛盾。' }],
          approach: [{ text: '归因发现两天用户结构不同（周末用户行为模式差异大），流量配比变更让对照组与实验组的「用户结构权重」在合并时发生翻转，落入辛普森悖论。对策是制度性的：实验中途不改流量配比；分析时按层/分群看；比率指标必须拆结构效应与效率效应。' }],
          results: [
            { metric: '分组结论', value: '周五、周六分别看新版本均胜' },
            { metric: '合并结论', value: '新版本反而落败（辛普森悖论）' },
          ],
          lesson: '「分着赢、合着输」不是数据错了，是你把不同结构的样本粗暴加权了——比率指标合并前先拆结构效应。',
          sourceRefs: [
            { briefId: 'D6', briefSection: '策略产品应用场景§2', externalTitle: '如何分析 A/B 实验结果', externalUrl: 'https://www.woshipm.com/user-research/6078115.html' },
          ],
        },
      },
      {
        blockId: 'eval-05-b6',
        type: 'paragraph',
        payload: {
          content: [
            { text: '回到日常排查。实验失败或大盘异动时，先做' },
            { text: '漏斗分析', marks: ['term'] },
            { text: '：沿「曝光 → 点击 → 有效消费/完播 → 转化 → 留存/复购」逐层算转化率，哪一层跌就先查哪一层，找出与假设不一致的环节。漏斗定位到层之后，进入 badcase 分层归因——核心决策树是' },
            { text: '先判「没召回来」还是「召回来但排错了」', marks: ['bold'] },
            { text: '，再逐层下钻到重排误杀或前端展示。这里有一条工程红线：每条样本必须保存中间产物（各路候选及分数、融合排名、重排前后排名），没有中间产物，就无法判断错误发生在哪一层。' },
          ],
          sourceRefs: [
            { briefId: 'D6', briefSection: '方法与算法详解§4(2)', externalUrl: 'https://www.woshipm.com/user-research/6078115.html' },
            { briefId: 'D6', briefSection: '方法与算法详解§4(2)', externalUrl: 'https://stack.i-tudou.com/devpedia-hub/interview/career-planning/knowledge-notes/llm-app/rag-evaluation-interview.html' },
          ],
        },
      },
      {
        blockId: 'eval-05-b7',
        type: 'diagram',
        payload: {
          diagramId: 'fig-badcase-attribution',
          caption: 'badcase 分层归因决策树：先召回、后排序、再重排',
          altText: '决策树根节点为 badcase，第一问「Gold 内容进候选集了吗」，否则查解析/切片/Embedding/索引，是则第二问「排序靠前吗」，否则查融合与重排；叶子节点为四类归因：召回缺失、排序靠后、重排误杀、展示问题；侧边标注「每条样本保存中间产物」。',
        },
      },
      {
        blockId: 'eval-05-b8',
        type: 'steps',
        payload: {
          orientation: 'vertical',
          cyclic: true,
          heading: 'badcase 体系闭环：从抽样到上线门禁',
          steps: [
            {
              title: '① 抽样建评测集',
              description: [{ text: '按场景分层抽样建立评测集，标注期望结果；标注一致性本身是指标工程——神马搜索时效性标注的拟合率曾从不足 60% 提升到 75-85%，标注不一致时所有下游结论都是噪声。' }],
              badge: '地基',
            },
            {
              title: '② 链路归因',
              description: [{ text: '用中间产物回放：召回缺失 / 排序靠后 / 重排误杀 / 展示问题，四分法定到层。' }],
            },
            {
              title: '③ 分类归档，对症修复',
              description: [{ text: '知识问题修知识库、流程问题修路由、模型问题才进训练——不是所有 badcase 都该进模型。' }],
            },
            {
              title: '④ 同集回归验证',
              description: [{ text: '修复后用同一评测集回归，确认旧 case 修好且没引入新 case。' }],
            },
            {
              title: '⑤ 回灌与门禁',
              description: [{ text: '线上确认的 badcase 持续回灌为回归集，接入上线门禁——新模型/新策略必须通过回归集才能发布，闭环形成。' }],
              badge: '闭环',
            },
          ],
          sourceRefs: [
            { briefId: 'D2', briefSection: '策略产品应用场景§2' },
            { briefId: 'D1', briefSection: '策略产品应用场景§2' },
            { briefId: 'D1', briefSection: '典型指标与评估§1' },
          ],
        },
      },
      {
        blockId: 'eval-05-b9',
        type: 'quote',
        payload: {
          variant: 'warning',
          text: '数据不会说谎，但会选择性地说真话。你看到的每一个「显著收益」，都值得先过一遍八陷阱清单再汇报。',
          attribution: '本节方法论收束',
          sourceRefs: [
            { briefId: 'D6', briefSection: '策略产品应用场景§2' },
          ],
        },
      },
    ],
    keyTakeaways: [
      '异动归因标准流程：先排外因（统计错误/变更/大促）后定内因；加法指标用 Delta 法、比率指标用剔除/加权占比法、乘法漏斗用 LMDI。',
      '比率指标下钻必须拆「结构效应 × 效率效应」，否则陷入辛普森悖论（微软流量配比案例）。',
      '八大数据陷阱：新奇效应、周期效应、辛普森悖论、偷看效应、幸存者偏差、分流污染、选择性看数、p-hacking。',
      '漏斗分析先定位跌的层；badcase 归因先判「没召回来」还是「排错了」，每条样本必须保存中间产物。',
      'badcase 闭环：评测集→链路归因→分类归档→同集回归→回灌为上线门禁；知识问题修知识库，模型问题才进训练。',
    ],
    relatedSections: ['eval-03', 'eval-04', 'search-06', 'strategy-04'],
    diagramsUsed: ['fig-badcase-attribution'],
    updatedAt: '2026-09-01',
  },
];
