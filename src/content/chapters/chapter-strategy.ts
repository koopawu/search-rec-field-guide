// ============================================================
// 篇章三：分发策略实战篇（/chapters/strategy）
// 素材来源：D5 searchrec_dim05_strategy_practice.md（主），D3/D4/D6（交叉引用）
// 写作规范：site_ia.md 第 5 节；图示 id 见 site_ia.md 第 4 节
// 注意：行业二手数据（流量池层级、晋级率、流量分配比例等）均已标注
//      “行业解读口径 / 研报口径 / 公开课口径，仅供参考量级”
// ============================================================

import type { Chapter, RichText, Section } from '../types';

/** 纯文本快捷包装为 RichText（数据本身仍可 JSON.stringify） */
const t = (text: string): RichText => [{ text }];

const strategySections: Section[] = [
  // ----------------------------------------------------------
  // 3.1 冷启动：用户、物品与系统的三重冷启动
  // ----------------------------------------------------------
  {
    sectionId: 'strategy-01',
    title: '冷启动：用户、物品与系统的三重冷启动',
    tagline: '冷启动解决“没有数据怎么推”，UGC 物品冷启最难、也最能体现策略功力。',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    keywords: ['冷启动', '新用户推荐', '物品冷启动', '探针策略', '流量池赛马', '差异化保量', '冷启动指标'],
    chapterSlug: 'strategy',
    summary: t('冷启动分用户、物品、系统三类，其中 UGC 物品冷启最难。本节给出新用户冷启的六手段阶梯（含探针策略实测数据）、物品冷启的三目标与阶梯流量池赛马机制、以及作者侧/用户侧/内容侧的冷启指标框架。'),
    blocks: [
      {
        blockId: 'strategy-01-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: t('这一节你将拿走三样东西：冷启动“用户/物品/系统”三分类的判断框架、两套可直接复用的机制（新用户探针、阶梯流量池赛马），以及一套冷启效果的三侧指标框架。'),
        },
      },
      {
        blockId: 'strategy-01-b2',
        type: 'keypoints',
        heading: '三类冷启动：先分类，再开方',
        payload: {
          layout: 'grid-3',
          items: [
            {
              title: '用户冷启动',
              description: t('新用户没有任何行为，如何做个性化？手段按信息粒度从粗到细：热门兜底 → 注册信息分群 → 兴趣选择页 → 社交关系链 → 探针策略 → 在线学习/元学习等快速收敛技术。'),
              sourceRefs: [
                { briefId: 'D5', briefSection: '方法与机制§2.1.1', externalTitle: '51CTO《推荐系统冷启动问题》', externalUrl: 'https://blog.51cto.com/u_15785643/5667686' },
              ],
            },
            {
              title: '物品冷启动',
              description: t('新内容如何触达可能感兴趣的用户？UGC 平台这一类最难：内容良莠不齐、量很大，既难人工评判，也很难让运营逐条做流量调控，必须靠机制。'),
              sourceRefs: [
                { briefId: 'D5', briefSection: '核心概念框架§1', externalTitle: '王树森《小红书推荐系统公开课》笔记', externalUrl: 'https://juejin.cn/post/7480455260839837715' },
              ],
            },
            {
              title: '系统冷启动',
              description: t('新产品没有数据时，先用热门、规则与专家知识兜底，快速积累数据进入正循环。除非推荐本身就是核心竞争力（如今日头条），否则早期清晰的导航与搜索比个性化更要紧。'),
              sourceRefs: [
                { briefId: 'D5', briefSection: '方法与机制§2.1.3', externalTitle: '51CTO《从零开始了解推荐系统全貌》', externalUrl: 'https://www.51cto.com/article/802679.html' },
              ],
            },
          ],
        },
      },
      {
        blockId: 'strategy-01-b3',
        type: 'diagram',
        payload: {
          diagramId: 'fig-coldstart-ladder',
          caption: '阶梯流量池赛马机制：新内容逐级入池、按同级赛马晋级（图中数值为行业解读口径，仅供参考量级）',
          altText: '五级阶梯流量池示意图：新视频先入 200-500 曝光的初始池，按完播率、点赞、评论、转发综合打分，每约 10 分钟与同赛道同级作品赛马，晋级率约 15-20%，逐级进入千级、万级、十万级直至全站热门池；不达标内容停滞或淘汰。',
        },
      },
      {
        blockId: 'strategy-01-b4',
        type: 'paragraph',
        payload: {
          content: t('用户冷启动的关键，是用最低成本换取第一批有效行为信号。热门兜底最安全但拿不到个人信息；注册信息与设备信息（机型、IP 归属地、下载渠道）能做粗粒度分群；兴趣选择页用轻交互直接收集偏好。更进一步是探针策略：新用户前 N 刷有意覆盖多个品类，观察点击快速更新画像，随后切换为个性化推荐。某阅读 App 的实测是：前 3 刷探针、第 4 刷切个性化后，新用户首日点击率从 5% 提升到 12%，7 日留存率从 10% 提升到 18%。冷启动期的留存与推荐实时性高度相关——要“短时间内让用户感到刷新的变化，觉得系统懂我”。'),
          sourceRefs: [
            { briefId: 'D5', briefSection: '方法与机制§2.1.1', externalTitle: 'e 书通·个性化推荐实战', externalUrl: 'https://www.eshutong.com/tag/%E4%B8%AA%E6%80%A7%E5%8C%96%E6%8E%A8%E8%8D%90/' },
            { briefId: 'D5', briefSection: '方法与机制§2.1.1', externalTitle: 'ProcessOn 内容类产品推荐策略方法', externalUrl: 'https://www.processon.com/view/666be86108848275d4d09b14' },
          ],
        },
      },
      {
        blockId: 'strategy-01-b5',
        type: 'paragraph',
        payload: {
          content: t('物品冷启动是 UGC 平台的硬仗。王树森把它的优化目标归纳为三件事：精准推荐（克服冷启把新内容推给合适的人，不引起反感）、激励发布（流量向低曝光新内容倾斜，让作者拿到正反馈）、挖掘高潜（用初期小流量试探找出高质量内容，再给流量倾斜）。落地靠两条腿：一是全链路优化——召回侧用类目、关键词、聚类、Look-Alike 人群扩散等冷启友好通道（ItemCF 在没有行为数据时不可用，双塔需去掉 ID embedding 依赖做改造），排序侧针对新内容加速特征与样本迭代；二是流量调控——强插、提权、保量、差异化保量，这套打法在 3.4 节展开。'),
          sourceRefs: [
            { briefId: 'D5', briefSection: '方法与机制§2.1.2', externalTitle: '王树森《小红书推荐系统公开课》笔记', externalUrl: 'https://juejin.cn/post/7480455260839837715' },
            { briefId: 'D3', briefSection: '策略产品应用场景§2' },
          ],
        },
      },
      {
        blockId: 'strategy-01-b10',
        type: 'paragraph',
        payload: {
          content: t('把三类冷启动翻译成决策场景：新功能上线评审时先问三个问题——新用户的前 3 刷看到的是什么（热门兜底还是探针）？新内容多久拿到第一次曝光（首次曝光时长是作者侧的命脉指标）？赛马晋级的考分指标和平台真正想要的内容生态是否一致（只考完播率会筛出“短平快”，想扶持深度内容就得把完读、收藏写进考分）？三个问题都有明确答案，冷启动方案才算闭环。'),
          sourceRefs: [
            { briefId: 'D5', briefSection: '典型指标与评估§1' },
          ],
        },
      },
      {
        blockId: 'strategy-01-b6',
        type: 'case',
        payload: {
          company: '抖音',
          companyLogoKey: 'douyin',
          scenario: '短视频新内容的阶梯流量池赛马',
          background: t('平台每日新增海量投稿，新视频没有任何行为数据，系统需要用尽量小的流量成本，快速判断哪些内容值得给大流量。'),
          approach: t('视频过审后先进入初始种子流量池（约 200-500 次曝光）；系统按“完播率 > 点赞 > 评论 > 转发”的反馈优先级综合打分，每约 10 分钟与同赛道、同层级作品横向赛马，数据优于同级者晋级更大流量池，逐级进入千级、万级、十万级，最终进入全站热门池形成精品召回池；表现不佳者停留或淘汰。'),
          results: [
            { metric: '初始种子流量池', value: '约 200-500 次曝光（行业解读口径，仅供参考量级）' },
            { metric: '同级赛马周期', value: '约 10 分钟一轮（行业解读口径，仅供参考量级）' },
            { metric: '逐级晋级率', value: '约 15-20%（行业解读口径，仅供参考量级）' },
          ],
          lesson: '赛马机制把冷启动变成“标准化考试”，用统一考分替代人工评判；但层级与晋级率数值是行业二手解读，自家平台的参数必须用 AB 反推，不要照搬。',
          sourceRefs: [
            { briefId: 'D5', briefSection: '策略产品应用场景·抖音', externalTitle: '蝉妈妈《抖音的内容推荐算法是什么？》', externalUrl: 'https://www.chanmama.com/yunyingquan/question/4161.html' },
            { briefId: 'D5', briefSection: '策略产品应用场景·抖音', externalTitle: '东方证券《产品与算法：抖音、快手的生态成因》', externalUrl: 'https://pdf.dfcfw.com/pdf/H3_AP202010201422479434_1.pdf' },
            { briefId: 'D5', briefSection: '方法与机制§2.1.2', externalTitle: 'opp2 抖音流量池机制解读', externalUrl: 'https://www.opp2.com/384920.html' },
          ],
        },
      },
      {
        blockId: 'strategy-01-b7',
        type: 'table',
        heading: '冷启动指标：作者侧、用户侧、内容侧三侧框架',
        payload: {
          caption: '冷启动效果不能只看消费指标，作者侧的“正反馈速度”同样是一级指标',
          columns: [
            { key: 'side', title: '视角' },
            { key: 'metrics', title: '核心指标' },
            { key: 'note', title: '判读要点' },
          ],
          rows: [
            { side: '作者侧', metrics: '发布渗透率、人均发布量', note: '首次曝光与首次交互来得越快，越能激励作者持续创作；首次曝光时长是关键过程指标' },
            { side: '用户侧', metrics: '新内容点击率/交互率 + 大盘消费时长、DAU', note: '扶持新内容不能以伤害消费体验为代价，大盘指标是护栏' },
            { side: '内容侧', metrics: '高热内容占比、赛马晋级率', note: '衡量冷启机制“挖掘高潜”的效率，晋级率过低说明初始池或考分设计有问题' },
          ],
          sourceRefs: [
            { briefId: 'D5', briefSection: '典型指标与评估§1', externalTitle: '王树森《小红书推荐系统公开课》笔记', externalUrl: 'https://juejin.cn/post/7480455260839837715' },
            { briefId: 'D5', briefSection: '典型指标与评估§1', externalTitle: 'geekdaxue 冷启笔记', externalUrl: 'https://geekdaxue.co/read/xf015y@wo1guk/ud7yvq' },
          ],
        },
      },
      {
        blockId: 'strategy-01-b8',
        type: 'quote',
        payload: {
          text: '用户自己上传的内容良莠不齐，而且量很大，很难用人工去评判，很难让运营人员做流量调控。',
          attribution: '王树森《小红书推荐系统公开课》，谈 UGC 物品冷启动为什么最难',
          variant: 'insight',
          sourceRefs: [
            { briefId: 'D5', briefSection: '核心概念框架§1', externalUrl: 'https://juejin.cn/post/7480455260839837715' },
          ],
        },
      },
      {
        blockId: 'strategy-01-b9',
        type: 'paragraph',
        payload: {
          variant: 'note',
          content: t('系统冷启的选型经验法则：冷启动期用热门召回 + 分组热门兜底，成长期引入协同过滤，成熟期再上双塔向量与多路融合。最后提醒：本节涉及的流量池层级、赛马周期、晋级率等数值均来自券商研报与行业自媒体的二手解读，仅供建立量级感，不代表平台官方口径；写方案引用时务必标注来源性质。'),
          sourceRefs: [
            { briefId: 'D3', briefSection: '策略产品应用场景§2' },
            { briefId: 'D5', briefSection: '策略产品应用场景·抖音' },
          ],
        },
      },
    ],
    keyTakeaways: [
      '冷启动先分类再开方：用户、物品、系统三类，UGC 物品冷启最难也最见策略功力',
      '新用户冷启的核心是低成本换信号，探针策略曾让某阅读 App 首日点击率 5%→12%、7 日留存 10%→18%',
      '物品冷启三目标：精准推荐、激励发布、挖掘高潜；落地 = 全链路优化 + 流量调控',
      'ItemCF 在冷启不可用、双塔需去 ID 改造，类目/关键词/聚类/Look-Alike 是冷启友好召回通道',
      '行业流传的流量池数值仅供参考量级，自家参数必须 AB 反推',
    ],
    relatedSections: ['strategy-04', 'strategy-06', 'rec-03', 'eval-04'],
    diagramsUsed: ['fig-coldstart-ladder'],
    updatedAt: '2026-09-10',
  },
  // ----------------------------------------------------------
  // 3.2 探索与利用：Bandit 框架与探索流量设计
  // ----------------------------------------------------------
  {
    sectionId: 'strategy-02',
    title: '探索与利用：Bandit 框架与探索流量设计',
    tagline: 'EE 是推荐的元问题——要不要牺牲短期效率换长期信息；算法是 Bandit，抓手是流量规则。',
    difficulty: 'advanced',
    estimatedMinutes: 11,
    keywords: ['探索与利用', 'EE', 'Bandit', 'UCB', 'Thompson Sampling', 'LinUCB', '探索流量'],
    chapterSlug: 'strategy',
    summary: t('探索与利用（EE）是推荐的元问题。本节对比 ε-Greedy、UCB、Thompson Sampling、LinUCB 四类 Bandit 算法的适用边界，给出比例预留、兴趣探索召回、机制层探索、兴趣分层四种探索流量设计，以及“长期持有测试”的度量方法。'),
    blocks: [
      {
        blockId: 'strategy-02-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: t('这一节讲清推荐的元问题 EE：四类 Bandit 算法各自的适用边界，以及比算法更重要的两件事——探索流量的工程化设计，和探索收益的长期度量。'),
        },
      },
      {
        blockId: 'strategy-02-b2',
        type: 'diagram',
        payload: {
          diagramId: 'fig-bandit-ee',
          caption: 'Bandit 探索-利用权衡：已知臂吃均值，未知臂吃置信上界',
          altText: '三台老虎机臂各挂一个收益分布曲线：已知臂分布窄、均值高，标注“利用”；未知臂分布宽、均值低但置信上界高，标注“探索”；UCB 公式条 a = argmax(均值 + 置信上界)；右侧对比 ε-Greedy、UCB、Thompson Sampling、LinUCB 四算法特征。',
        },
      },
      {
        blockId: 'strategy-02-b3',
        type: 'paragraph',
        payload: {
          content: t('EE 的账其实很好算：利用（Exploitation）是把流量给当前已知最优的内容，最大化今天的 CTR 与时长；探索（Exploration）是把流量分给不确定的内容与兴趣，换取信息以降低明天的不确定性。Bandit（多臂老虎机）把这个问题形式化为“最小化累计遗憾（Regret）”，理论最优可达 O(log T) 的对数级遗憾——翻译成人话：探索成本随时间增长得极慢，只要活得足够久，探索是便宜的。'),
          sourceRefs: [
            { briefId: 'D5', briefSection: '核心概念框架§2' },
          ],
        },
      },
      {
        blockId: 'strategy-02-b4',
        type: 'table',
        heading: '四类经典 Bandit 算法对比',
        payload: {
          caption: '记住一句话口诀：ε-Greedy 盲探、UCB 吃上界、TS 抽签、LinUCB 借特征',
          columns: [
            { key: 'algo', title: '算法' },
            { key: 'mechanism', title: '核心机制' },
            { key: 'explore', title: '探索逻辑' },
            { key: 'fit', title: '适用与坑' },
          ],
          rows: [
            { algo: 'ε-Greedy', mechanism: '以 1-ε 概率选当前最优臂，ε 概率随机探索', explore: '探索完全随机，不看不确定性', fit: '实现极简，常作兜底基线；ε 需随流量衰减，纯随机探索浪费流量' },
            { algo: 'UCB', mechanism: '选“均值 + 置信上界”最大的臂', explore: '尝试次数少的臂上界大，自动获得机会', fit: '静态环境表现好；奖励分布漂移的动态环境不如 TS/LinTS' },
            { algo: 'Thompson Sampling', mechanism: '每个臂维护 Beta 后验，各抽一签比大小', explore: '新臂后验分布宽，经常抽到高值，探索自动发生', fit: '对冷启动物品优于 UCB1；工程上需为每个臂维护后验分布' },
            { algo: 'LinUCB（上下文 Bandit）', mechanism: '假设收益与上下文特征线性相关，用方差项做探索奖励', explore: '新物品可“借”相似物品的特征经验泛化', fit: '适合带用户/物品特征的新闻推荐与重排场景；特征质量决定上限' },
          ],
          sourceRefs: [
            { briefId: 'D5', briefSection: '方法与机制§2.1.4', externalTitle: '阿里云 PAI-Rec《什么是 Contextual Bandit 算法》', externalUrl: 'https://help.aliyun.com/zh/airec/what-is-pai-rec/use-cases/contextual-bandit-algorithms' },
            { briefId: 'D5', briefSection: '方法与机制§2.1.4', externalTitle: 'airsota《Bandits and Online Decision》', externalUrl: 'https://talentme.airsota.com/resources/p/RL/bandits-and-online-decision' },
            { briefId: 'D5', briefSection: '方法与机制§2.1.4', externalTitle: '靠谱客《推荐系统中的冷启动和探索利用问题探讨》', externalUrl: 'https://kaopuke.com/article/k-p-k_13_u_7_o_10_fw_14_zgx.html' },
          ],
        },
      },
      {
        blockId: 'strategy-02-b5',
        type: 'paragraph',
        payload: {
          content: t('但丑话要说在前面：工业界的坦率经验是“理性 Bandit 很少直接好用”。真实流量环境里，奖励分布持续漂移、候选池每天换血、延迟反馈与位置偏差交织，教科书的静态假设很难成立。多数公司实际用的是发散性策略——适当降低整体相关性、提高探索比例的流量规则与小技巧。所以你要把 Bandit 当思考框架，把流量规则当落地抓手。也有一个值得记住的数字：MAB 动态分流相比固定 50:50 分流，可降低约 80% 的机会成本——这是用算法替代拍脑袋分流最直接的收益论证。'),
          sourceRefs: [
            { briefId: 'D5', briefSection: '方法与机制§2.1.4', externalTitle: '卢明冬《推荐系统中的探索和利用》', externalUrl: 'https://lumingdong.cn/exploration-and-exploitation-in-the-recommendation-system.html' },
            { briefId: 'D5', briefSection: '方法与机制§2.1.4', externalUrl: 'https://talentme.airsota.com/resources/p/RL/bandits-and-online-decision' },
          ],
        },
      },
      {
        blockId: 'strategy-02-b6',
        type: 'keypoints',
        heading: '探索流量的四种工程设计',
        payload: {
          items: [
            {
              title: '比例预留',
              description: t('切出固定比例流量做纯探索。快手多目标在线调参的做法：5% 流量、每轮并行探索几十组参数，用黑箱优化持续寻优。'),
              sourceRefs: [{ briefId: 'D5', briefSection: '方法与机制§2.2', externalTitle: '腾讯云《快手短视频推荐中的多目标排序》', externalUrl: 'https://cloud.tencent.com/developer/article/2318416' }],
            },
            {
              title: '兴趣探索召回',
              description: t('在召回层做发散：相似话题 A→B→C 跨越式扩展、Graph Walking 随机游走、UserCF 找弱相关人群聚类做探索。'),
              sourceRefs: [{ briefId: 'D5', briefSection: '方法与机制§2.2', externalTitle: '卢明冬《推荐系统中的探索和利用》', externalUrl: 'https://lumingdong.cn/exploration-and-exploitation-in-the-recommendation-system.html' }],
            },
            {
              title: '机制层探索',
              description: t('在系统链路与机制层面提升多样性，如淘宝 Visual EE、Impression Discounting（曝光折扣：降低已曝光内容的权重）。'),
              sourceRefs: [{ briefId: 'D5', briefSection: '方法与机制§2.2', externalTitle: '淘系技术《生成式重排在内容推荐中的应用实践》', externalUrl: 'https://www.6aiq.com/article/1653718089624' }],
            },
            {
              title: '兴趣分层',
              description: t('58 同城经验：原始兴趣优先级最高，相关扩展次之，泛扩展最低——扩展兴趣的效果远低于原始兴趣，必须分层控量而非均匀撒。'),
              sourceRefs: [{ briefId: 'D5', briefSection: '方法与机制§2.2', externalTitle: 'CSDN《多业务融合推荐策略实践与思考》', externalUrl: 'https://blog.csdn.net/hellozhxy/article/details/108389727' }],
            },
          ],
        },
      },
      {
        blockId: 'strategy-02-b10',
        type: 'paragraph',
        payload: {
          content: t('什么时候值得为探索付出流量成本？给你三个判断变量：候选池更新快不快（日更的 UGC 平台比标品电商更需要探索）、用户兴趣漂移快不快（资讯强于工具）、画像误差的代价高不高（新用户占比大的成长期产品最高）。三者都成立，探索比例就该上调；反之在候选稳定、意图明确的场景（如电商搜索），把预算留给利用更划算。探索预算不是信仰，是按这三个变量算出来的。'),
          sourceRefs: [
            { briefId: 'D5', briefSection: '方法与机制§2.2' },
          ],
        },
      },
      {
        blockId: 'strategy-02-b7',
        type: 'case',
        payload: {
          company: '快手',
          companyLogoKey: 'kuaishou',
          scenario: '多目标排序参数的在线探索调参',
          background: t('多目标融合公式的权重长期靠人工调参：试错成本高、收敛慢，且参数会随内容生态漂移失效。'),
          approach: t('线上固定切出约 5% 流量做探索，每轮并行探索几十组参数，用 CEM/ES/贝叶斯优化等黑箱方法自动寻优。Reward 设计区分收益项与约束项：收益项是主要优化目标（如视频观看时长）；约束项（播放、点赞、关注等互动）使用非线性约束——阈值内线性弱衰减，超出阈值指数强衰减，防止主目标优化过度损害互动生态。'),
          results: [
            { metric: '探索流量占比', value: '约 5%（快手公开分享口径）' },
            { metric: '并行探索参数组数', value: '几十组/轮（快手公开分享口径）' },
          ],
          lesson: '探索不是“浪费流量”，而是把调参从人肉拍脑袋变成可复利的系统能力；约束项的非线性衰减设计，是“要探索但不要失控”的标准写法。',
          sourceRefs: [
            { briefId: 'D5', briefSection: '方法与机制§2.2', externalTitle: '腾讯云《快手短视频推荐中的多目标排序》', externalUrl: 'https://cloud.tencent.com/developer/article/2318416' },
          ],
        },
      },
      {
        blockId: 'strategy-02-b8',
        type: 'paragraph',
        payload: {
          content: t('探索的度量，是策略 PM 最容易栽跟头的地方。代价（CTR、时长下降）当期可见，收益（画像信息增益、长期留存）却滞后数周——传统 AB 实验只看几天 CTR，几乎必然误杀探索与多样性类策略。正确姿势是长期持有测试（4-8 周，以 LTV 和留存为核心观测指标）配合交错实验。双赢是可能的：58 同城引入时间衰减的动态化策略后，点击效果比基准累计提升 6.5%、CTR 提高 7%，多样性同时明显改善——探索与效率不是零和博弈。'),
          sourceRefs: [
            { briefId: 'D5', briefSection: '方法与机制§2.2', externalTitle: 'tixiaolu《突破信息茧房：AI 推荐多样性优化实战指南》', externalUrl: 'https://www.tixiaolu.com/posts/kw-0293c9d6/' },
            { briefId: 'D5', briefSection: '方法与机制§2.2', externalTitle: 'CSDN《多业务融合推荐策略实践与思考》', externalUrl: 'https://blog.csdn.net/hellozhxy/article/details/108389727' },
          ],
        },
      },
      {
        blockId: 'strategy-02-b9',
        type: 'quote',
        payload: {
          text: '在工业界真正的应用实践中，Bandit 算法不一定好用，因此很少有公司直接使用理性 Bandit 算法，取而代之的是一些具有发散性的策略或者一些小技巧。',
          attribution: '卢明冬《推荐系统中的探索和利用》',
          variant: 'warning',
          sourceRefs: [
            { briefId: 'D5', briefSection: '方法与机制§2.1.4', externalUrl: 'https://lumingdong.cn/exploration-and-exploitation-in-the-recommendation-system.html' },
          ],
        },
      },
    ],
    keyTakeaways: [
      'EE 是元问题：牺牲短期效率换长期信息，Bandit 的理论遗憾界是 O(log T)',
      '四类算法一句话口诀：ε-Greedy 盲探、UCB 吃上界、Thompson 抽签、LinUCB 借特征',
      '工业界主流不是理性 Bandit，而是“降相关性、加探索比例”的发散性流量规则',
      '探索的代价当期可见、收益滞后数周——必须配 4-8 周长期持有测试，否则必然误杀',
      '58 同城证明双赢可能：动态化后点击累计 +6.5%、CTR +7%，多样性同时改善',
    ],
    relatedSections: ['strategy-01', 'strategy-03', 'eval-04'],
    diagramsUsed: ['fig-bandit-ee'],
    updatedAt: '2026-09-10',
  },
  // ----------------------------------------------------------
  // 3.3 多样性与信息茧房治理
  // ----------------------------------------------------------
  {
    sectionId: 'strategy-03',
    title: '多样性与信息茧房治理',
    tagline: '多样性不只是体验问题更是生态问题，且已被监管写成硬性要求。',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    keywords: ['推荐多样性', '信息茧房', '窗口打散', 'MMR', 'DPP', '频控', '基尼系数', '算法监管'],
    chapterSlug: 'strategy',
    summary: t('同质化对用户是茧房、对生态是扼杀长尾。本节给出重排打散规则工具箱（去重/频控/窗口打散/长尾加权）、MMR/DPP 等模型层方法、ILD/覆盖率/基尼系数等多样性度量，以及算法监管红线与破茧产品化实践。'),
    blocks: [
      {
        blockId: 'strategy-03-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: t('这一节解决“用户不腻、生态不死”：一套打散规则工具箱、一组多样性度量指标、一条躲不开的监管红线，以及快手用基尼系数做流量公平分配的完整范本。'),
        },
      },
      {
        blockId: 'strategy-03-b2',
        type: 'quote',
        payload: {
          text: '以点击率/转化率等效率目标进行优化的算法虽然能够做到用户-内容的精准匹配，但其 point-wise 最优的排序策略容易导致相似的内容聚集扎堆出现。对用户而言看到的内容越来越单一和同质化，信息茧房不断加重……对内容而言，系统流量逐渐被头部高热内容占据，长尾内容无法得到有效曝光，创作者的积极性也会受到打击。',
          attribution: '《大淘宝技术实战 2022》，每平每屋频道推荐实践',
          variant: 'insight',
          sourceRefs: [
            { briefId: 'D5', briefSection: '核心概念框架§3', externalTitle: '《大淘宝技术实战 2022》', externalUrl: 'https://tb-tech.oss-cn-hangzhou.aliyuncs.com/The%20Complete%20Works%20of%20Tao%20Technology%202022.pdf' },
          ],
        },
      },
      {
        blockId: 'strategy-03-b3',
        type: 'diagram',
        payload: {
          diagramId: 'fig-diversity-window',
          caption: '窗口打散前后对比：同类目内容在窗口内强制间隔',
          altText: '上下两排各 10 个内容卡片：上排未打散，连续 4 个同类目卡片标红；下排窗口打散后同类目间隔不小于 k，颜色均匀分布；标注三个参数：最小间隔 k、单次请求最多次数 m、窗口大小 n。',
        },
      },
      {
        blockId: 'strategy-03-b4',
        type: 'keypoints',
        heading: '重排打散规则工具箱',
        payload: {
          layout: 'grid-3',
          items: [
            {
              title: '去重',
              description: t('已推荐 item 短时间内不再推荐；用户侧曝光去重常用 BloomFilter 记录已曝光集合。'),
              sourceRefs: [{ briefId: 'D5', briefSection: '方法与机制§2.3.1', externalTitle: '博客园《推荐算法之去重策略》', externalUrl: 'https://www.cnblogs.com/gczr/p/11232171.html' }],
            },
            {
              title: '频控',
              description: t('相同属性（作者、类目、品牌）的 item 在单位时间或单次会话内限制出现次数。'),
              sourceRefs: [{ briefId: 'D5', briefSection: '方法与机制§2.3.1', externalTitle: '墨滴《推荐系统多样性建模》', externalUrl: 'https://mdnice.com/writing/8db2e632626b494b80a2142affd7d95c' }],
            },
            {
              title: '最小间隔 k / 最多次数 m',
              description: t('同类内容最多连续出现 k 次；单次请求内同类最多 m 个。两个参数常联用。'),
              sourceRefs: [{ briefId: 'D5', briefSection: '方法与机制§2.3.1', externalUrl: 'https://mdnice.com/writing/8db2e632626b494b80a2142affd7d95c' }],
            },
            {
              title: '窗口打散',
              description: t('大小为 n 的滑动窗口内不允许同类目重复出现，是工业界最常用的打散形态。'),
              sourceRefs: [{ briefId: 'D5', briefSection: '方法与机制§2.3.1', externalUrl: 'https://mdnice.com/writing/8db2e632626b494b80a2142affd7d95c' }],
            },
            {
              title: '长尾加权',
              description: t('降低热门 item 被推荐概率、提升冷门利基 item 概率，直接对抗马太效应。'),
              sourceRefs: [{ briefId: 'D5', briefSection: '方法与机制§2.3.1', externalUrl: 'https://mdnice.com/writing/8db2e632626b494b80a2142affd7d95c' }],
            },
            {
              title: '疲劳度调控',
              description: t('抖音的产品化打散：同类型内容连续出现约 3 条后自动降权，避免兴趣固化（行业媒体口径）。'),
              sourceRefs: [{ briefId: 'D5', briefSection: '方法与机制§2.3.2', externalTitle: '蝉妈妈《抖音的内容推荐算法是什么？》', externalUrl: 'https://www.chanmama.com/yunyingquan/question/4161.html' }],
            },
          ],
        },
      },
      {
        blockId: 'strategy-03-b5',
        type: 'paragraph',
        payload: {
          content: t('规则之上是模型层。MMR 用一个系数 θ 在相关性与多样性之间折中，工业界常用滑动窗口版本降复杂度，且相似度用 CLIP 等多模态向量优于双塔向量（双塔向量头部效应重，相似内容全挤在头部）；DPP 用行列式直接度量“质量 × 多样性”，YouTube、Hulu 都采用，并可按用户兴趣熵个性化；再往上是 PRM、SlateQ 这类上下文感知与强化学习方法。原则只有一条：多样性是带约束优化——在 CTR 下跌可控（例如 <1%）的前提下最大化多样性，而不是为多样而多样。'),
          sourceRefs: [
            { briefId: 'D4', briefSection: '算法详解§5.1' },
            { briefId: 'D5', briefSection: '典型指标与评估§2' },
            { briefId: 'D6', briefSection: '典型指标与评估§2' },
          ],
        },
      },
      {
        blockId: 'strategy-03-b6',
        type: 'case',
        payload: {
          company: '淘宝',
          companyLogoKey: 'taobao',
          scenario: '每平每屋频道的多样性全链路治理',
          background: t('家装垂类频道以点击/转化为目标优化，point-wise 最优排序导致相似商品扎堆：用户侧内容越来越单一，供给侧长尾商品拿不到曝光，浏览深度不足。'),
          approach: t('全链路配套而非单点修补：召回层引入 MIND 多兴趣向量召回、基于淘宝商品行为的跨域向量召回，并对召回结果做类目数量控制；排序层引入用户超长周期历史行为；重排层组合窗口打散、MMR、DPP；机制层叠加 Visual EE 与曝光折扣。'),
          results: [
            { metric: '推荐结果多样性', value: '显著提升（淘系技术公开分享口径）' },
            { metric: '浏览深度', value: '显著提升（淘系技术公开分享口径）' },
          ],
          lesson: '多样性不是重排一个点的事——召回配额、重排打散、机制探索必须全链路配套，否则下游再打散也救不回上游的同质化。',
          sourceRefs: [
            { briefId: 'D5', briefSection: '方法与机制§2.3.1', externalTitle: '淘系技术《生成式重排在内容推荐中的应用实践》', externalUrl: 'https://www.6aiq.com/article/1653718089624' },
            { briefId: 'D5', briefSection: '核心概念框架§3', externalTitle: '《大淘宝技术实战 2022》', externalUrl: 'https://tb-tech.oss-cn-hangzhou.aliyuncs.com/The%20Complete%20Works%20of%20Tao%20Technology%202022.pdf' },
          ],
        },
      },
      {
        blockId: 'strategy-03-b7',
        type: 'diagram',
        payload: {
          diagramId: 'fig-gini-curve',
          caption: '洛伦兹曲线与基尼系数：用一条曲线量化流量分配的贫富差距',
          altText: '坐标系内绝对平等线（对角线）与实际曝光分布洛伦兹曲线（下凹），两线间面积为 A、曲线下方面积为 B，Gini = A/(A+B)；标注快手“30% 头部 / 70% 中长尾”刻度线与“Gini2 大于 Gini1 即算法有马太效应”的判读提示。',
        },
      },
      {
        blockId: 'strategy-03-b8',
        type: 'paragraph',
        payload: {
          content: t('供给侧的多样性要用“分配公平”的尺子量。快手的做法是给曝光分布的基尼系数封顶：视频热度越过一定阈值后，曝光机会主动降低，整体约 30% 流量给头部热门、70% 给中长尾（东方证券研报口径，仅供参考量级）。更系统的做法是算法审计指标：新老账号流量分配比例（如新账号首周播放量不低于基础池的 50%）、头部垄断度（TOP1% 账号流量占比 ≤40%）、长尾内容二次推荐率 ≥30%——这组阈值是行业审计视角的示例口径，具体数值要按自家生态校准。直觉判读：基尼系数若高达 0.9，意味着约 90% 流量可能都给了极少数爆款，那是生态警报。'),
          sourceRefs: [
            { briefId: 'D5', briefSection: '方法与机制§2.3.3', externalTitle: '东方证券《产品与算法：抖音、快手的生态成因》', externalUrl: 'https://pdf.dfcfw.com/pdf/H3_AP202010201422479434_1.pdf' },
            { briefId: 'D5', briefSection: '方法与机制§2.3.3', externalTitle: '头条《抖音算法审计的指标体系》', externalUrl: 'https://www.toutiao.com/article/7525687392817365543/' },
            { briefId: 'D5', briefSection: '典型指标与评估§2', externalTitle: '腾讯云《推荐系统的多样性怎么衡量？》', externalUrl: 'https://cloud.tencent.com/developer/article/2651500' },
          ],
        },
      },
      {
        blockId: 'strategy-03-b9',
        type: 'table',
        heading: '多样性与生态度量指标',
        payload: {
          caption: '覆盖率必须配合分布指标一起看：99% 流量给 1% 热门时，绝对覆盖率可能很高但生态很差',
          columns: [
            { key: 'metric', title: '指标' },
            { key: 'meaning', title: '含义' },
            { key: 'read', title: '判读要点' },
          ],
          rows: [
            { metric: 'ILD（列表内不相似度）', meaning: '推荐列表两两物品相似度的补数均值', read: '越高越多样，但需防“为多样而多样”' },
            { metric: '类目覆盖度', meaning: '列表覆盖的类目数量', read: '要结合用户当前意图看，意图单一时强拉类目反而伤体验' },
            { metric: '物品覆盖率', meaning: '被推荐过的物品占总物品池比例', read: '衡量长尾发掘能力，生态健康核心指标' },
            { metric: '信息熵', meaning: '曝光分布的均匀程度', read: '越均匀熵越大' },
            { metric: '基尼系数', meaning: '曝光集中度（0-1）', read: '越接近 1 马太效应越严重；对比自然分布与算法分发后的 Gini 可判定算法是否加剧集中' },
          ],
          sourceRefs: [
            { briefId: 'D5', briefSection: '典型指标与评估§2', externalTitle: '腾讯云《推荐系统的多样性怎么衡量？》', externalUrl: 'https://cloud.tencent.com/developer/article/2651500' },
            { briefId: 'D6', briefSection: '典型指标与评估§2' },
          ],
        },
      },
      {
        blockId: 'strategy-03-b10',
        type: 'paragraph',
        payload: {
          content: t('监管已经把“去同质化”写成硬性要求。2022 年 3 月施行的《互联网信息服务算法推荐管理规定》明确鼓励平台综合运用内容去重、打散干预等技术策略积极化解信息茧房，并要求保障用户关闭个性化推荐的选择权。2025 年“清朗·网络平台算法典型问题治理”专项行动后，抖音升级“使用管理助手”、以可视化呈现用户近期浏览偏好，小红书上线“内容偏好评估与调节”“探索更多”功能。给你的落点很具体：打散与频控参数必须预留合规开关，茧房评估类指标（类目覆盖、负反馈、关闭率）要进日常周报，而不是等监管来查。'),
          sourceRefs: [
            { briefId: 'D5', briefSection: '方法与机制§2.3.2', externalTitle: '河南网信网转载专家解读《算法推荐管理规定》', externalUrl: 'https://www.hnwx.gov.cn/2022/01-06/51972.html' },
            { briefId: 'D5', briefSection: '方法与机制§2.3.2', externalTitle: '中央网信办《持续加强信息推荐算法治理》', externalUrl: 'https://www.cac.gov.cn/2025-05/22/c_1749536203490537.htm' },
          ],
        },
      },
    ],
    keyTakeaways: [
      '同质化双杀：用户侧信息茧房加重，供给侧长尾无曝光、创作者积极性受挫',
      '规则工具箱五件：去重、频控、最小间隔 k / 最多次数 m、窗口打散、长尾加权；模型层 MMR/DPP/PRM/SlateQ',
      '多样性是带约束优化：CTR 下跌可控（如 <1%）前提下最大化多样性',
      '供给侧公平看基尼系数与审计指标：TOP1% 流量占比、新老账号流量比、长尾二次推荐率',
      '破茧已是监管硬要求：打散参数预留合规开关，茧房指标进周报',
    ],
    relatedSections: ['rec-07', 'strategy-02', 'eval-01'],
    diagramsUsed: ['fig-diversity-window', 'fig-gini-curve'],
    updatedAt: '2026-09-10',
  },
  // ----------------------------------------------------------
  // 3.4 流量调控四件套：打散、隔离、提权、强插
  // ----------------------------------------------------------
  {
    sectionId: 'strategy-04',
    title: '流量调控四件套：打散、隔离、提权、强插',
    tagline: '流量调控技术从强插到差异化保量的四阶段演进，是“策略从规则到机制化”的最佳范本。',
    difficulty: 'advanced',
    estimatedMinutes: 13,
    keywords: ['流量调控', '打散', '隔离', '提权', '强插', '保量', '差异化保量', '定向分发', '低质打压', '反作弊'],
    chapterSlug: 'strategy',
    summary: t('流量调控是策略 PM 的日常主战场。本节给出“打散/隔离/提权/强插”四件套定义表、“强插→提权→保量→差异化保量”四阶段演进阶梯与动态提权保量公式、定向分发与生态治理配套，以及每条策略的生命周期管理清单。'),
    blocks: [
      {
        blockId: 'strategy-04-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: t('这一节是全篇最“日常”的一节：一张四件套定义表帮你给需求归类，一条四阶段演进阶梯帮你判断自家扶持技术处在哪一代，外加定向分发、生态治理与策略生命周期管理三张配套清单。'),
        },
      },
      {
        blockId: 'strategy-04-b2',
        type: 'table',
        heading: '流量调控四件套定义表',
        payload: {
          caption: '任何流量干预需求，先归到这四类之一，再谈实现',
          columns: [
            { key: 'name', title: '策略' },
            { key: 'goal', title: '核心目标' },
            { key: 'how', title: '实现方式' },
            { key: 'risk', title: '主要风险' },
          ],
          rows: [
            { name: '打散', goal: '多样性体验优化', how: '调整同类内容在 Feed 中的密度，避免相邻出现', risk: '过度打散损失效率，需配合 CTR 护栏' },
            { name: '隔离', goal: '生态调控、底线体验', how: '限定内容只出现在特定场景、人群或位置', risk: '隔离池过大损伤收，池内体验被忽视' },
            { name: '提权', goal: '流量调控、扶持特定内容', how: '调整排序权重（分数 × boost 系数）提升曝光竞争力', risk: '曝光量对系数敏感，易过度或不充分曝光' },
            { name: '强插', goal: '政策合规、战略级曝光', how: '限定内容出现在固定位置（如首屏）', risk: '体验风险最大，必须严格配额与准入' },
          ],
          sourceRefs: [
            { briefId: 'D5', briefSection: '核心概念框架§4', externalTitle: '什么值得买《推荐系统重排阶段的四种核心干预策略》', externalUrl: 'https://post.smzdm.com/p/al32xx3g' },
          ],
        },
      },
      {
        blockId: 'strategy-04-b3',
        type: 'diagram',
        payload: {
          diagramId: 'fig-traffic-regulation-ladder',
          caption: '新内容扶持技术的四阶段演进：从强插到差异化保量',
          altText: '四级上升台阶：强插（占坑位，标注“粗暴”）→ 提权（分数乘 boost 系数，标注“敏感难控”）→ 保量（24 小时 100 次曝光目标线，标注“可控”）→ 差异化保量（100-500 次区间条：基础 100 + 内容质量最多 +200 + 作者质量最多 +200，标注“最优”）。',
        },
      },
      {
        blockId: 'strategy-04-b4',
        type: 'paragraph',
        payload: {
          content: t('王树森总结的新内容扶持技术演进，是“策略从规则到机制化”的最佳范本。第一阶段强插：直接在推荐结果里占坑位，粗暴但见效快。第二阶段提权：给新内容的排序分乘一个大于 1 的 boost 系数——容易实现、投入产出比好，但曝光量对系数极其敏感，很难精确控制，容易过度曝光或不充分曝光，抖音、小红书早期都是这么做的。第三阶段保量：不管内容质量高低，都保证 24 小时获得约 100 次曝光，工程上用动态提权实现。第四阶段差异化保量：按内容质量与作者质量拉开保量档次，是目前公认的最优解。'),
          sourceRefs: [
            { briefId: 'D5', briefSection: '方法与机制§2.4.1', externalTitle: '王树森《小红书推荐系统公开课》笔记', externalUrl: 'https://juejin.cn/post/7480455260839837715' },
            { briefId: 'D5', briefSection: '方法与机制§2.4.1', externalTitle: 'CSDN《一文看懂推荐系统：物品冷启05：流量调控》', externalUrl: 'https://blog.csdn.net/weixin_46838716/article/details/126496886' },
          ],
        },
      },
      {
        blockId: 'strategy-04-b5',
        type: 'formula',
        heading: '动态提权保量公式',
        payload: {
          name: '动态提权保量',
          expression: '提权系数 = f（已过时间 / 目标时间， 已有曝光 / 目标曝光）',
          symbolNotes: [
            { symbol: '已过时间 / 目标时间', meaning: '发布后在保量窗口内的时间进度，越接近截止、缺口越大，系数越高' },
            { symbol: '已有曝光 / 目标曝光', meaning: '保量完成度，缺口越大系数越大，达标后系数归零' },
            { symbol: 'f', meaning: '单调递增的分段或平滑函数；工程上常用 PID 控制器做精细的动态提权' },
          ],
          intuition: t('保量的本质是闭环控制：把“24 小时 100 次曝光”当作目标值，根据当前进度缺口实时调整提权力度——缺口大就猛推，接近达标就收手，避免静态系数造成的过度或欠曝。火山引擎的工业实践是在召回与粗排侧做保量让冷启内容进入排序，重排侧做强插或提权精细控制曝光。'),
          sourceRefs: [
            { briefId: 'D5', briefSection: '方法与机制§2.4.1', externalTitle: 'CSDN《一文看懂推荐系统：物品冷启05：流量调控》', externalUrl: 'https://blog.csdn.net/weixin_46838716/article/details/126496886' },
            { briefId: 'D5', briefSection: '方法与机制§2.4.1', externalTitle: '火山引擎《推荐系统内容冷启——工业文》', externalUrl: 'https://developer.volcengine.com/articles/7387286347494457363' },
          ],
        },
      },
      {
        blockId: 'strategy-04-b6',
        type: 'paragraph',
        payload: {
          content: t('差异化保量的细则值得直接抄作业：基础保量 24 小时约 100 次曝光；模型判定内容质量高者额外最多加 200 次；作者历史内容质量高者再额外最多加 200 次——一篇新笔记的保量区间是 100-500 次，达标即停止扶持，回到自然分发与老内容公平竞争。为什么必须差异化？因为“拔苗助长”有真实代价：把内容硬推给不合适的受众，点击率、点赞率等指标会偏低，长期反而被系统打上低质标签，更难长成热门。扶持的目标不是“给流量”，而是“给对的流量，试探出真实水平”。'),
          sourceRefs: [
            { briefId: 'D5', briefSection: '方法与机制§2.4.1', externalTitle: 'CSDN《一文看懂推荐系统：物品冷启05：流量调控》', externalUrl: 'https://blog.csdn.net/weixin_46838716/article/details/126496886' },
            { briefId: 'D5', briefSection: '方法与机制§2.4.1', externalTitle: '墨滴《搜索推荐广告业务场景下的流量调控算法》', externalUrl: 'https://mdnice.com/writing/1f1d4c9e08c54b149d8e48e59c27f7c3' },
          ],
        },
      },
      {
        blockId: 'strategy-04-b7',
        type: 'case',
        payload: {
          company: '小红书',
          companyLogoKey: 'xiaohongshu',
          scenario: '新笔记冷启动的四阶段流量调控',
          background: t('UGC 社区每日新增海量笔记，新笔记没有任何行为数据：既要让作者拿到正反馈持续创作，又不能因扶持伤害消费体验。'),
          approach: t('全链路优化 + 流量调控双管齐下：召回侧用类目、关键词、聚类、Look-Alike 通道补充新笔记曝光机会，排序侧针对新内容加速特征与样本迭代；流量侧从强插一路演进到提权、保量、差异化保量，目标 24 小时 100 次基础曝光，优质内容与优质作者最高保 500 次，达标即撤扶持。'),
          results: [
            { metric: '基础保量', value: '24 小时约 100 次曝光（王树森公开课口径，仅供参考量级）' },
            { metric: '差异化保量上限', value: '约 500 次/24h（王树森公开课口径，仅供参考量级）' },
          ],
          lesson: '保量不是目的，而是给每条新内容一次“标准化考场”的机会；达标后立即撤掉拐杖，否则扶持本身就扭曲了赛马结果。',
          sourceRefs: [
            { briefId: 'D5', briefSection: '策略产品应用场景·小红书', externalTitle: '王树森《小红书推荐系统公开课》笔记', externalUrl: 'https://juejin.cn/post/7480455260839837715' },
          ],
        },
      },
      {
        blockId: 'strategy-04-b8',
        type: 'paragraph',
        payload: {
          content: t('四件套之外是两条辅线。一是定向分发，解决结构性引导：新闻场景对新热内容加速给推荐位；垂类运营用类目加权系数引导供给（行业解读中的示例：教育类初始权重 1.3x、科技数码 1.2x、娱乐类降至 0.8x，仅供参考量级）；低频与新用户前几刷隔离软色情等风险内容。二是生态治理，解决“什么内容不该有流量”：UC 对标题党、低俗、空短内容加强判定并打压流量、处罚账号后，低质率下降 66%、原创优质内容流量整体提升 2 倍；SimHash 指纹加汉明距离做内容消重（距离 ≤3 判重）；BloomFilter 做用户侧曝光去重；设备指纹 + SimHash 聚类把几十万台表面无关的群控设备聚成黑产簇，是反作弊的标准动作。'),
          sourceRefs: [
            { briefId: 'D5', briefSection: '方法与机制§2.4.2', externalTitle: '搜狐·抖音垂类加权系数解读', externalUrl: 'https://www.sohu.com/a/885012891_122320270' },
            { briefId: 'D5', briefSection: '方法与机制§2.5.1', externalTitle: '新浪科技《UC 推 3+7+X 收益法则》', externalUrl: 'https://k.sina.com.cn/article_6405589968_17dcd8bd000100afbh.html' },
            { briefId: 'D5', briefSection: '方法与机制§2.5.2', externalTitle: '博客园《推荐算法之去重策略》', externalUrl: 'https://www.cnblogs.com/gczr/p/11232171.html' },
            { briefId: 'D5', briefSection: '方法与机制§2.5.4', externalTitle: 'openinstall《设备指纹对撞找出刷量农场》', externalUrl: 'https://www.openinstall.com/article/wiki/anti-fraud-device-fingerprint-farm-clustering-detection' },
          ],
        },
      },
      {
        blockId: 'strategy-04-b9',
        type: 'keypoints',
        heading: '策略生命周期管理：从规则兜底到机制化',
        payload: {
          layout: 'list',
          items: [
            {
              title: '① 规则兜底',
              description: t('先用硬规则实现 MVP 验证方向，接受粗糙，换取上线速度。'),
            },
            {
              title: '② 参数化',
              description: t('把阈值与系数做成可配置项，运营与策略可调，不再发版改代码。'),
            },
            {
              title: '③ 模型化',
              description: t('用模型预估替代静态系数（如 PID 动态提权、RL 调控），从“拍参数”到“学参数”。'),
            },
            {
              title: '④ 机制化',
              description: t('策略固化为平台机制（赛马制度、保量制度），规则本身成为生态契约。'),
            },
            {
              title: '全生命周期档案',
              description: t('每条策略配套：目标指标 + 护栏指标 + AB/双边实验方案 + 推全后衰减监控 + 定期下线评审。运营策略（北极星）保持稳定，手段快速迭代。'),
            },
          ],
        },
      },
    ],
    keyTakeaways: [
      '四件套记牢：打散管多样性、隔离管底线、提权管扶持、强插管战略曝光',
      '扶持技术四阶段：强插 → 提权 → 保量 → 差异化保量；提权敏感难控，差异化保量是公认最优解',
      '保量本质是闭环控制：工程上“召回/粗排保量 + 重排强插或提权”，精细控制上 PID',
      '拔苗助长有代价：错误受众导致低指标，长期反被系统打压——扶持必须差异化',
      '每条策略都要有生命周期档案：目标 + 护栏 + 实验方案 + 衰减监控 + 下线评审',
    ],
    relatedSections: ['strategy-01', 'strategy-05', 'strategy-06', 'eng-01'],
    diagramsUsed: ['fig-traffic-regulation-ladder'],
    updatedAt: '2026-09-10',
  },
  // ----------------------------------------------------------
  // 3.5 商业化混排：eCPM 与内容广告博弈
  // ----------------------------------------------------------
  {
    sectionId: 'strategy-05',
    title: '商业化混排：eCPM 与内容广告博弈',
    tagline: '混排是商业化与用户体验博弈的主战场，eCPM 是统一度量衡。',
    difficulty: 'advanced',
    estimatedMinutes: 11,
    keywords: ['混排', 'eCPM', '信息流广告', 'Blending', '广告 Load', 'CrossDQN', '强化学习混排'],
    chapterSlug: 'strategy',
    summary: t('混排决定广告插在内容流的哪里。本节讲透 eCPM = pCTR × pCVR × bid × 1000 这本统一账本、Blending Server 混排架构与广告 Load/频控/相关性下限三条体验约束，并对照字节 DEAR、美团 CrossDQN、阿里 MDP-DOTA、快手 Duel DQN 的强化学习混排方案。'),
    blocks: [
      {
        blockId: 'strategy-05-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: t('这一节讲清三件事：eCPM 这个统一度量衡怎么算、混排架构如何把广告与内容两条排序链合成一屏、以及体验约束该怎么设——这是商业化与用户体验每天正面交锋的地方。'),
        },
      },
      {
        blockId: 'strategy-05-b2',
        type: 'diagram',
        payload: {
          diagramId: 'fig-ecpm-blending',
          caption: '广告混排 Blending 架构：两条独立排序链，汇入点决定广告位置',
          altText: '左右两条独立排序链：内容流（召回→排序）与广告流（召回→eCPM 排序），汇入 Blending Server 决定广告插入位置但不改变广告相对序；输出一屏内容卡与广告卡交错的列表；公式条 eCPM = pCTR × pCVR × bid × 1000；底部约束条：广告 Load 上限、频控、相关性下限。',
        },
      },
      {
        blockId: 'strategy-05-b3',
        type: 'formula',
        heading: 'eCPM 与混排打分公式',
        payload: {
          name: 'eCPM 与 Rank_Score',
          expression: 'eCPM = pCTR × pCVR × bid × 1000；Rank_Score = a × eCPM + b × Q',
          symbolNotes: [
            { symbol: 'pCTR / pCVR', meaning: '预估点击率 / 预估转化率（纯 CPC 计费时 pCVR 项可省略）' },
            { symbol: 'bid', meaning: '广告主出价；eCPM 把 CPC/CPM/CPS 等不同出价方式折算成同一种货币' },
            { symbol: 'Q', meaning: '质量分：广告商品质量、历史销量、好评率等体验因子' },
            { symbol: 'a / b', meaning: '收入与质量的权衡权重，是平台商业化意志的直接表达' },
          ],
          intuition: t('eCPM 的物理含义是“这条广告曝光一千次，平台预期收入多少”。它让广告之间、广告与内容之间可以在同一把尺子上比较。广告收入大盘 = PV × PVR（广告曝光占比）× eCPM——混排要解的就是“在 PVR 被体验约束卡死的前提下，让总收入最大化”。'),
          sourceRefs: [
            { briefId: 'D5', briefSection: '方法与机制§2.4.3', externalTitle: '智源社区《都是推荐系统，广告算法和推荐算法有啥区别？》', externalUrl: 'https://hub.baai.ac.cn/view/14664' },
            { briefId: 'D4', briefSection: '策略产品应用场景§2' },
            { briefId: 'D6', briefSection: '典型指标与评估§3' },
          ],
        },
      },
      {
        blockId: 'strategy-05-b4',
        type: 'paragraph',
        payload: {
          content: t('先纠正一个误区：混排不是“把广告按 eCPM 插进内容流”这么简单。内容优化的是用户时长与留存，广告优化的是收入，两者的目标函数、生命周期、评估口径都不同。标准架构是让广告与自然结果在各自系统内独立召回与排序，最后由 Blending Server（混排服务）决定广告插入哪些位置，经典约束有三条：广告 Load（曝光占比）上限、频控、相关性下限。强化学习是当前混排的主流方向：字节 DEAR 用 RL 决定广告插入位置；美团 CrossDQN 的关键设计是“不改变广告的相对序”，保住拍卖机制的激励性质；快手混排 RL 的 reward 是长期价值与近期价值的组合，动作空间内置业务约束。'),
          sourceRefs: [
            { briefId: 'D5', briefSection: '方法与机制§2.4.3', externalTitle: '腾讯云《基于强化学习的信息流广告分配方法 CrossDQN[美团]》', externalUrl: 'https://cloud.tencent.com/developer/article/2222034' },
            { briefId: 'D5', briefSection: '方法与机制§2.4.3', externalTitle: 'CSDN《漫谈广告机制设计|混排》', externalUrl: 'https://blog.csdn.net/bigheadyushan/article/details/134086398' },
            { briefId: 'D5', briefSection: '方法与机制§2.4.3', externalTitle: '新浪科技《重排序在快手短视频推荐系统中的演进》', externalUrl: 'https://t.cj.sina.cn/articles/view/2674405451/9f68304b01900zljn?from=tech' },
          ],
        },
      },
      {
        blockId: 'strategy-05-b5',
        type: 'table',
        heading: '强化学习混排代表方案对照',
        payload: {
          caption: '共同趋势：把广告位分配建模为“体验约束下长期价值最大化”的序贯决策',
          columns: [
            { key: 'company', title: '平台' },
            { key: 'scheme', title: '方案' },
            { key: 'design', title: '核心设计' },
          ],
          rows: [
            { company: '字节', scheme: 'DEAR', design: '强化学习端到端决定广告插入位置，联合优化收入与体验' },
            { company: '美团', scheme: 'CrossDQN', design: '混排只定位置、不改广告相对序，保持拍卖机制的激励性质' },
            { company: '阿里', scheme: 'MDP-DOTA / 手淘多目标重排', design: '混排调控框架，手淘信息流已迭代四代' },
            { company: '快手', scheme: 'Duel DQN 混排', design: 'reward = 长期价值 + 近期价值组合，动作空间内置业务约束（如广告位数量与间隔）' },
          ],
          sourceRefs: [
            { briefId: 'D5', briefSection: '方法与机制§2.4.3', externalUrl: 'https://cloud.tencent.com/developer/article/2222034' },
            { briefId: 'D5', briefSection: '方法与机制§2.4.3', externalUrl: 'https://blog.csdn.net/bigheadyushan/article/details/134086398' },
            { briefId: 'D5', briefSection: '发展与前沿', externalUrl: 'https://t.cj.sina.cn/articles/view/2674405451/9f68304b01900zljn?from=tech' },
          ],
        },
      },
      {
        blockId: 'strategy-05-b6',
        type: 'case',
        payload: {
          company: '美团',
          companyLogoKey: 'meituan',
          scenario: '信息流广告的 CrossDQN 混排',
          background: t('广告插入位置直接影响平台收入与用户体验，但若混排阶段重排广告顺序，就会破坏广告拍卖机制的激励相容——广告主的出价策略建立在“相对序由拍卖决定”的假设上。'),
          approach: t('CrossDQN 把广告位分配建模为强化学习序贯决策：状态是当前请求上下文，动作是“各条广告放到哪个位置”，在广告曝光占比约束下优化长期收入；关键设计是只决定广告插到哪里，绝不改变广告系统内部产出的相对排序，从而保持拍卖的激励性质不被混排破坏。'),
          results: [
            { metric: '优化目标', value: '一定广告曝光约束下平台收入最大化，同时尽可能减少用户体验损失（论文/公开分享口径）' },
            { metric: '机制约束', value: '广告相对序不变，拍卖激励性质保持（论文/公开分享口径）' },
          ],
          lesson: '混排策略 PM 的第一课：广告不是普通内容，它背后是一个拍卖市场——动它的相对序，就是在动广告主的出价激励。',
          sourceRefs: [
            { briefId: 'D5', briefSection: '方法与机制§2.4.3', externalTitle: '腾讯云《基于强化学习的信息流广告分配方法 CrossDQN[美团]》', externalUrl: 'https://cloud.tencent.com/developer/article/2222034' },
          ],
        },
      },
      {
        blockId: 'strategy-05-b7',
        type: 'paragraph',
        payload: {
          content: t('体验约束怎么定，是混排里最“产品”的部分。广告 Load 每提一个点，都是收入与留存的一次交换，必须有明确的护栏指标盯着：留存、负反馈率、人均时长。还要记住广告侧比推荐侧多出一整本账：出价 bid、广告主 ROI、预算消耗节奏、合规审核，以及 pCTR 的 PCOC 校准——预估值系统性偏高一成，平台和广告主就有一方在持续亏钱。另一个心法是阶段化目标：新业务期重 GMV 兼顾 CTR，留存期重时长与满意度——融合公式的权重就是产品战略的直接编码，调权重之前先回答“公司这个阶段的北极星是什么”。'),
          sourceRefs: [
            { briefId: 'D4', briefSection: '策略产品应用场景§1-2' },
            { briefId: 'D4', briefSection: '典型指标与评估§1' },
            { briefId: 'D2', briefSection: '策略产品应用场景§3' },
          ],
        },
      },
      {
        blockId: 'strategy-05-b9',
        type: 'paragraph',
        payload: {
          variant: 'note',
          content: t('提广告 Load 是商业化 PM 最常打的一张牌，也是最需要纪律的一张。标准决策流程：先用历史数据估算 Load-收入弹性曲线，找到边际收益递减的拐点；再用小流量实验验证护栏指标（留存、负反馈率、人均时长）的可接受跌幅；推全时保留反转桶长期观察。直接全量提 Load 看收入的做法，等于用留存换当期收入——账期错位，亏在长期。'),
          sourceRefs: [
            { briefId: 'D4', briefSection: '策略产品应用场景§1' },
            { briefId: 'D6', briefSection: '方法与算法详解§3' },
          ],
        },
      },
      {
        blockId: 'strategy-05-b8',
        type: 'keypoints',
        heading: '混排策略抓手面板',
        payload: {
          layout: 'grid-2',
          items: [
            {
              title: 'eCPM 门槛',
              description: t('低于门槛的广告不进入混排，保护体验底线；门槛本身是收入与体验的调节阀。'),
            },
            {
              title: '广告 Load 调控',
              description: t('分人群、分场景的差异化 Load（新用户更低），而非全局一刀切。'),
            },
            {
              title: '插入位置规则',
              description: t('首屏免广告、固定坑位 vs 动态位置的权衡；动态位置收益高但需要 RL 级别的系统能力。'),
            },
            {
              title: '频控与疲劳度',
              description: t('单广告、单类目对单用户的曝光上限；与内容侧疲劳度调控共用一套机制语言。'),
            },
            {
              title: 'PID 控速',
              description: t('控制广告预算消耗节奏，避免预算早早烧完后时段收入塌陷。'),
              sourceRefs: [{ briefId: 'D4', briefSection: '策略产品应用场景§1' }],
            },
            {
              title: '校准监控',
              description: t('PCOC（预估/实际点击率比）偏离即告警——pCTR 高估直接侵蚀拍卖生态。'),
              sourceRefs: [{ briefId: 'D4', briefSection: '典型指标与评估§1' }],
            },
          ],
        },
      },
    ],
    keyTakeaways: [
      'eCPM = pCTR × pCVR × bid × 1000，是广告世界的统一货币；Rank_Score = a×eCPM + b×Q',
      '混排架构：广告与内容各自排序，Blending Server 决定插入位置；广告曝光占比约束下最大化收入',
      '机制红线：混排不改广告相对序，否则破坏拍卖激励——美团 CrossDQN 的设计精髓',
      '体验约束四件：广告 Load、频控、相关性下限、PID 控速；每条都要配护栏指标',
      '融合权重即战略编码：调权前先回答“本阶段北极星是什么”',
    ],
    relatedSections: ['rec-06', 'rec-07', 'eval-01'],
    diagramsUsed: ['fig-ecpm-blending'],
    updatedAt: '2026-09-10',
  },
  // ----------------------------------------------------------
  // 3.6 大厂分发机制对照：抖音、快手、小红书、B站、淘宝
  // ----------------------------------------------------------
  {
    sectionId: 'strategy-06',
    title: '大厂分发机制对照：抖音、快手、小红书、B站、淘宝',
    tagline: '五家平台的分发机制是五种价值观的算法化——赛马集权、基尼普惠、冷启扶持、创作者激励、多样性全链路。',
    difficulty: 'intermediate',
    estimatedMinutes: 13,
    keywords: ['分发机制', '抖音赛马', '快手基尼系数', '小红书冷启动', 'B站创作激励', '集中式调控', '市场式机制', '三方平衡'],
    chapterSlug: 'strategy',
    summary: t('用一张对照表横向比较抖音、快手、小红书、B站、淘宝的分发机制与价值观，并以快手重排体系、小红书 AB 溢出效应、B站停更风波三个案例收束出分发负责人的方法论：市场式赛马为底 + 集中式调控纠偏，用户-创作者-平台三方平衡。'),
    blocks: [
      {
        blockId: 'strategy-06-b1',
        type: 'paragraph',
        payload: {
          variant: 'lead',
          content: t('这一节是全篇的收束：五家平台的分发机制对照表帮你建立“机制即价值观”的直觉，三个真实案例（快手重排、小红书 AB 溢出、B站停更）帮你在述职与评审中讲清机制设计的代价。'),
        },
      },
      {
        blockId: 'strategy-06-b2',
        type: 'diagram',
        payload: {
          diagramId: 'fig-three-party-balance',
          caption: '用户-创作者-平台三方平衡：任何一侧长期受损都会反噬大盘',
          altText: '三角天平图：三个顶点分别为用户（体验与信息茧房）、创作者（激励与公平）、平台（时长与收入），中心为分发机制；每条边标注双向作用力与反噬案例标签，如 B 站停更风波、信息茧房、马太效应。',
        },
      },
      {
        blockId: 'strategy-06-b3',
        type: 'table',
        heading: '五大平台分发机制对照表',
        payload: {
          caption: '机制即价值观；表中数值多为研报/公开课/行业解读口径，仅供参考量级',
          columns: [
            { key: 'platform', title: '平台' },
            { key: 'mechanism', title: '核心机制' },
            { key: 'value', title: '价值观' },
            { key: 'data', title: '代表性做法与数据（口径）' },
            { key: 'risk', title: '主要风险' },
          ],
          rows: [
            { platform: '抖音', mechanism: '集中式赛马 + 强运营调控', value: '效率优先、强公域掌控', data: '阶梯流量池逐级赛马，反馈优先级完播>点赞>评论>转发；垂类加权系数、疲劳度调控（行业解读口径）', risk: '生态贫富差距大，中腰部创作者出头难' },
            { platform: '快手', mechanism: '去中心化 + 基尼系数封顶', value: '公平普惠、重社交关系', data: '约 30% 流量给头部、70% 给中长尾；粉丝看到关注达人新视频概率 30-40%（东方证券研报口径，抖音约 10%）', risk: '效率天花板较低，头部爆款能力弱于抖音' },
            { platform: '小红书', mechanism: '物品冷启全链路 + 四阶段保量', value: '种草生态、新人友好', data: '新笔记 24h 基础保量约 100 次、差异化保量上限约 500 次（王树森公开课口径）', risk: '保量资源有限，新笔记之间互相挤占' },
            { platform: 'B站', mechanism: '创作激励与流量倾斜绑定', value: '创作者驱动、社区文化', data: '粉丝 <1 万 UP 主获约 50% 冷启动流量倾斜；2024 年近 310 万 UP 主获得收入（ESG 报告口径）', risk: '激励规则变更极敏感，2022 年改版曾引发头部 UP 主停更风波' },
            { platform: '淘宝', mechanism: '多样性全链路 + 混排调控', value: '逛的体验、长尾商品分发', data: '召回类目控制 + 窗口打散 + MMR/DPP + Visual EE；新店 30 天扶持期（质量分 ≥80 + 7 日内有真实成交）', risk: '商业目标与多样性目标天然拉扯' },
          ],
          sourceRefs: [
            { briefId: 'D5', briefSection: '策略产品应用场景', externalTitle: '东方证券《产品与算法：抖音、快手的生态成因》', externalUrl: 'https://pdf.dfcfw.com/pdf/H3_AP202010201422479434_1.pdf' },
            { briefId: 'D5', briefSection: '策略产品应用场景·小红书', externalUrl: 'https://juejin.cn/post/7480455260839837715' },
            { briefId: 'D5', briefSection: '策略产品应用场景·B站', externalTitle: '网经社《B站发布 ESG 报告》', externalUrl: 'http://www.100ec.cn/detail--6648514.html' },
            { briefId: 'D5', briefSection: '策略产品应用场景·淘宝', externalUrl: 'https://www.6aiq.com/article/1653718089624' },
          ],
        },
      },
      {
        blockId: 'strategy-06-b4',
        type: 'case',
        payload: {
          company: '快手',
          companyLogoKey: 'kuaishou',
          scenario: '公平普惠机制与重排技术体系',
          background: t('快手要在短视频、直播、广告等十余种业务混排中同时追求效率与“公平普惠”的价值观，防止流量过度集中于头部。'),
          approach: t('机制侧引入基尼系数调控曝光分布：视频热度越过阈值后曝光机会主动降低；技术侧重排体系三级演进——服务端序列重排、多源内容混排（Duel DQN，reward 为长期价值与近期价值的组合）、端上重排（实时感知、实时反馈、千人千模、算力分配到端）。'),
          results: [
            { metric: '端上重排 CTR', value: '+2.53pp（快手公开分享口径）' },
            { metric: '端上重排 LTR / WTR', value: '+4.81pp / +1.36pp（快手公开分享口径）' },
            { metric: '流量分配比例', value: '约 30% 头部 / 70% 中长尾（东方证券研报口径，仅供参考量级）' },
          ],
          lesson: '公平不是口号而是可工程化的约束：把价值观写成基尼系数上限，再用重排技术在约束内榨效率。',
          sourceRefs: [
            { briefId: 'D5', briefSection: '策略产品应用场景·快手', externalTitle: '掘金《重排在快手短视频推荐系统中的应用》', externalUrl: 'https://juejin.cn/post/7210310775276519484' },
            { briefId: 'D5', briefSection: '策略产品应用场景·快手', externalTitle: '东方证券《产品与算法：抖音、快手的生态成因》', externalUrl: 'https://pdf.dfcfw.com/pdf/H3_AP202010201422479434_1.pdf' },
          ],
        },
      },
      {
        blockId: 'strategy-06-b5',
        type: 'case',
        payload: {
          company: '小红书',
          companyLogoKey: 'xiaohongshu',
          scenario: '新笔记提权策略的 AB 实验溢出效应',
          background: t('新笔记提权是常规扶持手段，上线前需要 AB 实验验证收益——但作者侧策略的实验会踩一个很隐蔽的坑。'),
          approach: t('实验组把新笔记的排序权重增大两倍，观察新笔记消费指标；对照组不变。实验期间 diff 为正，团队准备推全。'),
          results: [
            { metric: 'AB 期间新笔记指标 diff', value: '约 +2%（王树森公开课口径）' },
            { metric: '推全后 diff', value: '2% → 0，收益消失——新笔记之间互抢流量，溢出效应吃掉收益（同上）' },
          ],
          lesson: '流量池是共享的，单边分组必然高估扶持类策略收益；更可信的是用户 + 笔记双边隔离实验，代价是新笔记池减半、体验受损——实验设计本身就是权衡。',
          sourceRefs: [
            { briefId: 'D5', briefSection: '策略产品应用场景·小红书', externalTitle: '王树森《小红书推荐系统公开课》笔记', externalUrl: 'https://juejin.cn/post/7480455260839837715' },
            { briefId: 'D5', briefSection: '典型指标与评估§4', externalTitle: '火山引擎《如何做复杂的 AB 实验设计》', externalUrl: 'https://www.cnblogs.com/volcengine-developer/articles/18781121' },
          ],
        },
      },
      {
        blockId: 'strategy-06-b6',
        type: 'paragraph',
        payload: {
          content: t('B站的教训值得每个分发负责人背下来：2022 年创作激励改版将收入与“三连”等互动因素挂钩，直接导致创作激励下降，引发头部 UP 主停更舆情。激励规则变更不是一次普通迭代，而是对供给侧的“货币政策调整”——创作者是平台的供给侧，激励设计必须让“做好内容”成为创作者的最优策略（激励相容）。正向例子同样来自 B 站：“新星 UP 主流量扶持包”向粉丝量低于 1 万的创作者倾斜约 50% 冷启动流量（ESG 报告口径），2024 年近 310 万 UP 主获得收入。流量激励与现金激励怎么选？学术研究的结论是：市场规模大且创作者少时，宜用流量激励；市场变小或创作者增多后，转向现金激励。'),
          sourceRefs: [
            { briefId: 'D5', briefSection: '方法与机制§2.3.4', externalTitle: 'AI 中国网·B 站停更风波报道', externalUrl: 'https://www.cnaiplus.com/a/news/3371737.html' },
            { briefId: 'D5', briefSection: '方法与机制§2.3.4', externalTitle: '网经社《B站发布 ESG 报告》', externalUrl: 'http://www.100ec.cn/detail--6648514.html' },
            { briefId: 'D5', briefSection: '方法与机制§2.3.4', externalTitle: '《内容营销背景下商家对创作者的激励策略研究》', externalUrl: 'https://manu68.magtech.com.cn/glxb/CN/Y2025/V22/I12/2306' },
          ],
        },
      },
      {
        blockId: 'strategy-06-b7',
        type: 'paragraph',
        payload: {
          content: t('最后收束成分发负责人的方法论。流量分配有两种体制：集中式（强插、提权、保量、系数调控）见效快、可控性强，适合冷启扶持与战略级目标，但参数敏感、容易被策略套利；市场式（竞价、赛马、激励相容的分成规则）自组织、可持续，但要防马太效应与作弊。成熟平台无一例外是“市场式赛马为底 + 集中式调控纠偏”的混合体制——抖音的赛马加垂类加权、快手的赛马加基尼封顶，都是例证。而所有机制设计的最终校验，是用户（体验与茧房）、创作者（激励与公平）、平台（时长与收入）的三方平衡：任何一侧长期受损，都会以留存下滑、停更潮或监管处罚的形式反噬大盘。'),
          sourceRefs: [
            { briefId: 'D5', briefSection: '发展与前沿·方法论收束' },
          ],
        },
      },
      {
        blockId: 'strategy-06-b10',
        type: 'paragraph',
        payload: {
          content: t('对照五家时最常被问的问题是“我们该学谁”。判断依据不是谁更大，而是谁的发展阶段与供给侧结构跟你像：供给过剩、追求消费效率的阶段学抖音赛马；供给稀缺、依赖社区氛围的阶段学快手普惠与 B 站激励；新品/新内容驱动的交易平台学小红书保量与淘宝多样性全链路。机制没有高下，只有匹配——把别人的价值观原样抄过来，往往水土不服。'),
          sourceRefs: [
            { briefId: 'D5', briefSection: '策略产品应用场景' },
          ],
        },
      },
      {
        blockId: 'strategy-06-b8',
        type: 'quote',
        payload: {
          text: '只关注用户侧指标会导致长尾现象和雪球效应等不公平现象……内容生产者无法得到正反馈而离开，进而使得平台的内容丰富性和多样性下降。',
          attribution: '清华大学学位论文（信息流推荐内容公平性研究）摘要',
          variant: 'warning',
          sourceRefs: [
            { briefId: 'D5', briefSection: '核心概念框架§5', externalTitle: '清华大学学位论文', externalUrl: 'https://newetds.lib.tsinghua.edu.cn/qh/paper/summary?dbCode=ETDQH&sysId=284950' },
          ],
        },
      },
      {
        blockId: 'strategy-06-b9',
        type: 'list',
        heading: '分发机制设计的常见误区',
        payload: {
          variant: 'myths',
          items: [
            t('把行业二手口径（如抖音流量池层级数值）当作平台官方数据写进方案与汇报'),
            t('只盯消费侧指标，忽视策略对作者投稿意愿的供给侧影响——双边影响需要双边实验'),
            t('把激励规则变更当普通迭代处理，不做创作者沟通、灰度与舆情预案'),
            t('认为集中式调控与市场式机制是二选一——成熟平台是“赛马为底 + 调控纠偏”的混合体制'),
            t('为多样性而多样性：不顾用户当前意图强拉类目覆盖，效率与体验双输'),
          ],
          sourceRefs: [
            { briefId: 'D5', briefSection: '发展与前沿·方法论收束' },
          ],
        },
      },
    ],
    keyTakeaways: [
      '五平台五种价值观：抖音赛马集权、快手基尼普惠、小红书冷启扶持、B站创作者激励、淘宝多样性全链路',
      '分发机制 = 市场式赛马为底 + 集中式调控纠偏，二者不是选择题',
      '供给侧策略的 AB 有溢出效应：小红书新笔记提权 AB diff 推全后从 2% 归零',
      '激励规则变更是高风险生态操作，B站 2022 停更风波是前车之鉴',
      '三方平衡是最终校验：用户、创作者、平台任何一侧长期受损都会反噬大盘',
    ],
    relatedSections: ['strategy-01', 'strategy-04', 'eval-04', 'eng-05'],
    diagramsUsed: ['fig-three-party-balance'],
    updatedAt: '2026-09-10',
  },
];

// ============================================================
// 篇章元信息
// ============================================================

export const chapterStrategy: Chapter = {
  chapterId: 'ch-strategy',
  slug: 'strategy',
  order: 3,
  title: '分发策略实战篇',
  subtitle: '算法是手段，流量规则与业务目标才是抓手——本篇直接对应分发负责人的日常决策场景。',
  icon: 'dashboard-scale',
  themeColor: '#F59E0B',
  sections: strategySections,
  learningGoals: [
    '能设计一套新内容冷启动流量方案：探针策略 + 阶梯赛马 + 差异化保量',
    '能为 EE 问题选择合适的 Bandit 算法或发散性流量规则，并设计 4-8 周长期评估方案',
    '能用打散/隔离/提权/强插四件套落地流量调控需求，并预判各自代价与护栏',
    '能读懂 eCPM 混排账本，在收入与体验之间设定约束、权重与护栏指标',
    '能从用户-创作者-平台三方视角评审一条分发策略的全生命周期',
  ],
};
