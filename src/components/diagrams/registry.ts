// ============================================================
// 图示注册表聚合（增量注册约定）：
// 每个图示一个文件、default export 组件；后续代理只新增文件
// 并在本对象中追加 `{ [diagramId]: Component }` 条目即可。
// ============================================================

import type { ComponentType } from 'react';
import type { DiagramProps } from './tokens';
import FigRecFunnel from './figures/FigRecFunnel';
import FigTwinTower from './figures/FigTwinTower';
import FigColdstartLadder from './figures/FigColdstartLadder';
import FigRagArchitecture from './figures/FigRagArchitecture';
import FigGenerativeVsCascade from './figures/FigGenerativeVsCascade';
import FigThreeLayerArchitecture from './figures/FigThreeLayerArchitecture';
// ---- 架构与漏斗 ----
import FigSearchFunnel from './figures/FigSearchFunnel';
import FigQpPipeline from './figures/FigQpPipeline';
import FigDataDecisionLoop from './figures/FigDataDecisionLoop';
import FigUnifiedGenerativeDistribution from './figures/FigUnifiedGenerativeDistribution';
import FigRecallFusion from './figures/FigRecallFusion';
import FigHybridRetrieval from './figures/FigHybridRetrieval';
import FigLatencyBudget from './figures/FigLatencyBudget';
// ---- 模型结构 ----
import FigDinAttention from './figures/FigDinAttention';
import FigEsmmCtrCvr from './figures/FigEsmmCtrCvr';
import FigMmoePle from './figures/FigMmoePle';
import FigSemanticIdRqvae from './figures/FigSemanticIdRqvae';
import FigCfFamilyTree from './figures/FigCfFamilyTree';
import FigSequenceRecallEvolution from './figures/FigSequenceRecallEvolution';
import FigMultiInterest from './figures/FigMultiInterest';
import FigGraphEmbedding from './figures/FigGraphEmbedding';
import FigRerankContext from './figures/FigRerankContext';
import FigIndexBuild from './figures/FigIndexBuild';
// ---- 机制与策略 ----
import FigBanditEe from './figures/FigBanditEe';
import FigTrafficRegulationLadder from './figures/FigTrafficRegulationLadder';
import FigEcpmBlending from './figures/FigEcpmBlending';
import FigThreePartyBalance from './figures/FigThreePartyBalance';
import FigDiversityWindow from './figures/FigDiversityWindow';
import FigGiniCurve from './figures/FigGiniCurve';
import FigMmrDpp from './figures/FigMmrDpp';
import FigIntentRouting from './figures/FigIntentRouting';
import FigNoisyChannel from './figures/FigNoisyChannel';
// ---- 评估与实验 ----
import FigMetricsPyramid from './figures/FigMetricsPyramid';
import FigAbLayering from './figures/FigAbLayering';
import FigSwitchback from './figures/FigSwitchback';
import FigOfflineOnlineGap from './figures/FigOfflineOnlineGap';
import FigHoldoutReverse from './figures/FigHoldoutReverse';
import FigBadcaseAttribution from './figures/FigBadcaseAttribution';
import FigRelevanceVsCtr from './figures/FigRelevanceVsCtr';
import FigAnnTradeoff from './figures/FigAnnTradeoff';
// ---- 流程与演进 ----
import FigRankingEvolutionTimeline from './figures/FigRankingEvolutionTimeline';
import FigRagEvolution from './figures/FigRagEvolution';
import FigDeepResearchLoop from './figures/FigDeepResearchLoop';
import FigHnswLayers from './figures/FigHnswLayers';
import FigInvertedIndex from './figures/FigInvertedIndex';
import FigModelUpdateCadence from './figures/FigModelUpdateCadence';
import FigRecScalingLaw from './figures/FigRecScalingLaw';
import FigInferenceCostToolbox from './figures/FigInferenceCostToolbox';
import FigPmCapabilityMap from './figures/FigPmCapabilityMap';
import FigTeamInterface from './figures/FigTeamInterface';

export const diagramRegistry: Record<string, ComponentType<DiagramProps>> = {
  // ---- 全站核心图（6 张，精细绘制） ----
  'fig-rec-funnel': FigRecFunnel,
  'fig-twin-tower': FigTwinTower,
  'fig-coldstart-ladder': FigColdstartLadder,
  'fig-rag-architecture': FigRagArchitecture,
  'fig-generative-vs-cascade': FigGenerativeVsCascade,
  'fig-three-layer-architecture': FigThreeLayerArchitecture,
  // ---- 架构与漏斗 ----
  'fig-search-funnel': FigSearchFunnel,
  'fig-qp-pipeline': FigQpPipeline,
  'fig-data-decision-loop': FigDataDecisionLoop,
  'fig-unified-generative-distribution': FigUnifiedGenerativeDistribution,
  'fig-recall-fusion': FigRecallFusion,
  'fig-hybrid-retrieval': FigHybridRetrieval,
  'fig-latency-budget': FigLatencyBudget,
  // ---- 模型结构 ----
  'fig-din-attention': FigDinAttention,
  'fig-esmm-ctr-cvr': FigEsmmCtrCvr,
  'fig-mmoe-ple': FigMmoePle,
  'fig-semantic-id-rqvae': FigSemanticIdRqvae,
  'fig-cf-family-tree': FigCfFamilyTree,
  'fig-sequence-recall-evolution': FigSequenceRecallEvolution,
  'fig-multi-interest': FigMultiInterest,
  'fig-graph-embedding': FigGraphEmbedding,
  'fig-rerank-context': FigRerankContext,
  'fig-index-build': FigIndexBuild,
  // ---- 机制与策略 ----
  'fig-bandit-ee': FigBanditEe,
  'fig-traffic-regulation-ladder': FigTrafficRegulationLadder,
  'fig-ecpm-blending': FigEcpmBlending,
  'fig-three-party-balance': FigThreePartyBalance,
  'fig-diversity-window': FigDiversityWindow,
  'fig-gini-curve': FigGiniCurve,
  'fig-mmr-dpp': FigMmrDpp,
  'fig-intent-routing': FigIntentRouting,
  'fig-noisy-channel': FigNoisyChannel,
  // ---- 评估与实验 ----
  'fig-metrics-pyramid': FigMetricsPyramid,
  'fig-ab-layering': FigAbLayering,
  'fig-switchback': FigSwitchback,
  'fig-offline-online-gap': FigOfflineOnlineGap,
  'fig-holdout-reverse': FigHoldoutReverse,
  'fig-badcase-attribution': FigBadcaseAttribution,
  'fig-relevance-vs-ctr': FigRelevanceVsCtr,
  'fig-ann-tradeoff': FigAnnTradeoff,
  // ---- 流程与演进 ----
  'fig-ranking-evolution-timeline': FigRankingEvolutionTimeline,
  'fig-rag-evolution': FigRagEvolution,
  'fig-deep-research-loop': FigDeepResearchLoop,
  'fig-hnsw-layers': FigHnswLayers,
  'fig-inverted-index': FigInvertedIndex,
  'fig-model-update-cadence': FigModelUpdateCadence,
  'fig-rec-scaling-law': FigRecScalingLaw,
  'fig-inference-cost-toolbox': FigInferenceCostToolbox,
  'fig-pm-capability-map': FigPmCapabilityMap,
  'fig-team-interface': FigTeamInterface,
};
