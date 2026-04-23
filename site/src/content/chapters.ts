/**
 * Single source of truth for the 7 mental-model chapters.
 * Shape mirrors 心智七篇/app/chapters.js — kept as plain data so both the
 * Home mosaic and the Reader can consume it without importing the MDX.
 */

export type ChapterId =
  | "orthogonality"
  | "cybernetics"
  | "entropy"
  | "operating-system"
  | "fractal"
  | "causality"
  | "symbols-connectionism";

export interface ChapterSection {
  num: string;
  zh: string;
  en: string;
  slug: string;
}

export interface Chapter {
  id: ChapterId;
  index: number;
  numHan: string;
  numRoman: string;
  titleZh: string;
  titleEn: string;
  kickerZh: string;
  kickerEn: string;
  leadZh: string;
  leadEn: string;
  sections: ChapterSection[];
  /** Mosaic placement variant used in Home.astro */
  variant:
    | "orthogonal"
    | "cybernetic"
    | "entropy"
    | "os"
    | "fractal"
    | "causality"
    | "symbols";
}

export const CHAPTERS: Chapter[] = [
  {
    id: "orthogonality",
    index: 1,
    numHan: "一",
    numRoman: "I",
    titleZh: "正交",
    titleEn: "Orthogonality",
    kickerZh: "篇 I · 心智模型",
    kickerEn: "Chapter I · Mental Models",
    leadZh: "两股独立的力 —— 模型能力的轴 × harness 工程的轴。",
    leadEn: "Two independent forces — the axis of model capability and the axis of harness engineering.",
    variant: "orthogonal",
    sections: [
      { num: "01", zh: "两股独立的力", en: "The Forces", slug: "01-the-forces" },
      { num: "02", zh: "模型是什么", en: "What is the Model", slug: "02-what-is-the-model" },
      { num: "03", zh: "模型能力,强且增长", en: "How Strong & Growing", slug: "03-how-strong" },
      { num: "04", zh: "它在走向何处", en: "Where is it Going", slug: "04-where-is-it-going" },
      { num: "05", zh: "正交分解", en: "Orthogonal Decomposition", slug: "05-orthogonal-decomposition" },
    ],
  },
  {
    id: "cybernetics",
    index: 2,
    numHan: "二",
    numRoman: "II",
    titleZh: "控制论",
    titleEn: "Cybernetics",
    kickerZh: "篇 II · 心智模型",
    kickerEn: "Chapter II · Mental Models",
    leadZh: "舵手、反馈、必要多样性 —— 系统如何在扰动里保持方向。",
    leadEn: "Helmsman, feedback, requisite variety — how a system stays on course under perturbation.",
    variant: "cybernetic",
    sections: [
      { num: "01", zh: "舵手", en: "The Helmsman", slug: "01-the-helmsman" },
      { num: "02", zh: "开闭原则", en: "OCP", slug: "02-ocp" },
      { num: "03", zh: "必要多样性", en: "Requisite Variety", slug: "03-requisite-variety" },
      { num: "04", zh: "非典型状态机", en: "Atypical FSM", slug: "04-atypical-fsm" },
      { num: "05", zh: "反馈层", en: "Feedback Layers", slug: "05-feedback-layers" },
      { num: "06", zh: "二阶控制", en: "Second Order", slug: "06-second-order" },
      { num: "07", zh: "边界", en: "The Boundary", slug: "07-the-boundary" },
    ],
  },
  {
    id: "entropy",
    index: 3,
    numHan: "三",
    numRoman: "III",
    titleZh: "熵",
    titleEn: "Entropy",
    kickerZh: "篇 III · 心智模型",
    kickerEn: "Chapter III · Mental Models",
    leadZh: "上下文腐化、错误级联、麦克斯韦妖 —— 熵视角下的工程。",
    leadEn: "Context rot, error cascade, Maxwell's demon — engineering through an entropy lens.",
    variant: "entropy",
    sections: [
      { num: "01", zh: "熵是什么", en: "What is Entropy", slug: "01-what-is-entropy" },
      { num: "02", zh: "智能体中的熵", en: "Entropy in Agents", slug: "02-entropy-in-agents" },
      { num: "03", zh: "上下文腐化", en: "Context Rot", slug: "03-context-rot" },
      { num: "04", zh: "错误级联", en: "Error Cascade", slug: "04-error-cascade" },
      { num: "05", zh: "麦克斯韦妖", en: "Maxwell's Demon", slug: "05-maxwells-demon" },
      { num: "06", zh: "熵下的工程", en: "Engineering Under Entropy", slug: "06-engineering-under-entropy" },
    ],
  },
  {
    id: "operating-system",
    index: 4,
    numHan: "四",
    numRoman: "IV",
    titleZh: "操作系统",
    titleEn: "Operating System",
    kickerZh: "篇 IV · 心智模型",
    kickerEn: "Chapter IV · Mental Models",
    leadZh: "五根支柱、内存、调度、信任 —— 把 agent runtime 看成 OS。",
    leadEn: "Five pillars — memory, scheduling, trust, protocols — seeing the agent runtime as an OS.",
    variant: "os",
    sections: [
      { num: "01", zh: "五根支柱", en: "The Five Pillars", slug: "01-five-pillars" },
      { num: "02", zh: "内存管理", en: "Memory Management", slug: "02-memory-management" },
      { num: "03", zh: "调度", en: "Scheduling", slug: "03-scheduling" },
      { num: "04", zh: "信任边界", en: "Trust Boundaries", slug: "04-trust-boundaries" },
      { num: "05", zh: "协作协议", en: "Collaboration Protocols", slug: "05-collaboration-protocols" },
    ],
  },
  {
    id: "fractal",
    index: 5,
    numHan: "五",
    numRoman: "V",
    titleZh: "分形",
    titleEn: "Fractal",
    kickerZh: "篇 V · 心智模型",
    kickerEn: "Chapter V · Mental Models",
    leadZh: "prompt / agent / swarm —— 同一结构在三个尺度上自相似。",
    leadEn: "prompt / agent / swarm — the same structure echoing across three scales.",
    variant: "fractal",
    sections: [
      { num: "01", zh: "自相似", en: "Self-similarity", slug: "01-self-similarity" },
      { num: "02", zh: "三个尺度", en: "Three Scales", slug: "02-three-scales" },
      { num: "03", zh: "跨层迁移", en: "Cross-scale Transfer", slug: "03-cross-scale-transfer" },
    ],
  },
  {
    id: "causality",
    index: 6,
    numHan: "六",
    numRoman: "VI",
    titleZh: "因果",
    titleEn: "Causality",
    kickerZh: "篇 VI · 心智模型",
    kickerEn: "Chapter VI · Mental Models",
    leadZh: "从相关性之海到因果纪律 —— 智能体真正知道了什么？",
    leadEn: "From a sea of correlations to causal discipline — what does the agent really know?",
    variant: "causality",
    sections: [
      { num: "01", zh: "相关性之海", en: "Sea of Correlation", slug: "01-sea-of-correlation" },
      { num: "02", zh: "因果纪律", en: "Causal Discipline", slug: "02-causal-discipline" },
      { num: "03", zh: "它知道什么", en: "What it Knows", slug: "03-what-it-knows" },
      { num: "04", zh: "它怎么知道的", en: "How it Knows", slug: "04-how-it-knows" },
    ],
  },
  {
    id: "symbols-connectionism",
    index: 7,
    numHan: "七",
    numRoman: "VII",
    titleZh: "符号与联结",
    titleEn: "Symbols & Connectionism",
    kickerZh: "篇 VII · 心智模型",
    kickerEn: "Chapter VII · Mental Models",
    leadZh: "两种表征、翻译的代价、张力轴 —— 符号和联结主义如何并存。",
    leadEn: "Two representations, the cost of translation, the tension axis — symbols and connectionism coexisting.",
    variant: "symbols",
    sections: [
      { num: "01", zh: "两种表征", en: "Two Representations", slug: "01-two-roads" },
      { num: "02", zh: "翻译的代价", en: "Cost of Translation", slug: "04-cost-of-translation" },
      { num: "03", zh: "张力轴", en: "The Tension Axis", slug: "05-tension-axis" },
    ],
  },
];

export const CHAPTER_BY_ID = Object.fromEntries(
  CHAPTERS.map((c) => [c.id, c] as const),
) as Record<ChapterId, Chapter>;
