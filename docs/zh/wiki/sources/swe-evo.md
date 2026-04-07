# SWE-EVO: Benchmarking Coding Agents in Long-Horizon Software Evolution Scenarios

## 元信息

- **来源**: `sources/arxiv_papers/2512.18470-swe-evo.md`
- **URL**: https://arxiv.org/abs/2512.18470
- **作者**: Minh Vu Thai Pham, Tue Le, Dung Nguyen Manh, Huy Nhat Phan, Nghi D. Q. Bui (FPT Software AI Center)
- **发表**: arXiv 2025-12（v5 更新至 2026）
- **ljg-paper 分析**: `wikis/sources/20260407T174415--paper-swe-evo-long-horizon-benchmark__paper.org`

## 摘要

现有 AI 编码 agent benchmark（如 SWE-Bench）聚焦于单 issue 修复——一个 bug、一个补丁、几个测试。SWE-EVO 将评估维度从"单点修复"升级为"软件演进"：给定 release notes 和当前代码库，agent 需要理解高层需求、跨多文件协调改动、将系统从一个版本推进到下一个版本。

## 核心数据

- **48 个任务**，来自 7 个成熟 Python 开源项目（scikit-learn、pydantic 等）
- 每个任务平均跨 **21 个文件**，面对 **874 个测试**
- 输入为 release notes（非单个 GitHub issue），强制 agent 理解高层需求
- 评估指标：Resolved Rate（严格二值）+ Fix Rate（软评分，衡量部分进展）

## 关键发现

### 断崖式能力差距

| 模型 | SWE-Bench Verified | SWE-EVO |
|---|---|---|
| GPT-5.4 | — | 25.00% |
| GPT-5.2 | 72.80% | 18.75%–22.92% |
| GPT-5 | 65.00% | 18.75%–20.83% |
| DeepSeek-V3p2 | 70.00% | 20.83%–23.40% |

从"大部分能做"到"大部分做不了"——不是微小下降，是量级跨越。

### 误差级联效应

单步能力无法线性外推到多步任务。这是误差级联（error cascade）的直接证据：前一步的小错在后续步骤中被放大，导致多步整体成功率远低于单步成功率的乘积。任务涉及的 PR 数量越多（即步骤越多），失败率越高——难度与 PR 数量强相关。

### 失败模式分层

- **强模型**（GPT-5 系列）：主要失败在 *指令遵循*（60%+），即理解歪了 release notes 的意图
- **弱模型**：失败在更基础的语法错误、工具使用、陷入循环
- 说明 SWE-EVO 的难度来自 *语义推理*，而非接口操作

### 模型-框架交互效应

GLM-5 在 SWE-agent 上 37.5%（超 GPT-5.4），在 [OpenHands](../entities/openhands.md) 上仅 8.33%。Agent 能力是模型 x 框架的函数，不能只看模型 benchmark 分数。

### Fix Rate 的价值

软评分揭示了二值 Resolved Rate 隐藏的差异：GPT-4.1 和 GPT-oss-120b 都只解决 2.08%，但 Fix Rate 分别为 4.65% 和 2.08%——前者做了更多部分修复。

## 与 wiki 已有知识的关联

- **[Long-running agents](../concepts/long-running-agents.md)**：SWE-EVO 为"增量推进而非一次性尝试"提供了量化证据。Anthropic 的 initializer-coder 架构正是为了对抗这种多步耦合失败
- **[Harness engineering](../concepts/harness-engineering.md)**：误差级联发现强化了 harness 中 checkpoint、rollback、feature tracking 的必要性
- **[Context management](../concepts/context-management.md)**：论文 Section 2.3 专门讨论了 context engineering 对长 horizon 任务的关键性，引用了 Meta Context Engineering（89.1% on SWE-bench Verified vs 70.7% 手工基线）
- **[Evaluator-optimizer](../concepts/evaluator-optimizer.md)**：Fix Rate 的"部分通过率 + 回归惩罚"设计可迁移到 harness 内部评估机制

## References

- `sources/arxiv_papers/2512.18470-swe-evo.md`
