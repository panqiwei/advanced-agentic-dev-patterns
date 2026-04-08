# Autonomy Slider（自主度滑块）

## 定义

产品中用户可调节的 AI 自主权级别。Karpathy 在 [Software Is Changing (Again)](../sources/karpathy-software-is-changing-again.md) 中提出这个概念，用于描述一类**部分自主产品**——既不是纯手动工具，也不是全自主 agent，而是在两极之间提供一个连续的滑块。

## 具体案例

### Cursor 的自主度阶梯

| 操作 | 自主度 | 人类控制 |
|------|--------|----------|
| Tab 补全 | 最低 | 用户在掌控，AI 只提建议 |
| Cmd+K（改选中代码） | 低 | 用户指定范围和意图 |
| Cmd+L（改整个文件） | 中 | 用户给出意图，AI 决定具体改动 |
| Cmd+I（全 repo agent） | 最高 | 用户只给目标，AI 自主决策路径 |

### Perplexity 的自主度阶梯

- Quick search → Research → Deep research（10 分钟后返回结果）

### Tesla Autopilot

仪表盘 GUI 展示神经网络感知结果，自主功能渐进式扩展。Karpathy 在 Tesla 5 年的经验：2013 年完美 demo 到 12 年后仍未完全解决——"这是 agent 的十年，不是 agent 之年"。

## 设计原则

部分自主产品的四个共性特征：
1. **上下文管理**：LLM 负责信息组装
2. **多 LLM 编排**：embedding、chat、diff apply 等模型协作
3. **专用 GUI**：利用人类视觉系统加速审计（diff 的红绿比读文本快得多）
4. **自主度滑块**：用户根据任务复杂度选择交出多少控制权

## Iron Man 类比

Iron Man 战甲既是增强（Tony Stark 穿着操控）又是 agent（可自主飞行）。Karpathy 的论断：**现阶段应该造战甲（augmentation），不是造机器人（full agent）**。但不要丢掉 slider——产品应该预留向更高自主度演进的路径。

## 与 wiki 其他概念的关系

- [Agentic Systems](agentic-systems.md) — autonomy slider 是 workflows↔agents 连续体的产品化表达。Anthropic 的"从简单开始"原则在产品层表现为默认低自主度
- [Harness Engineering](harness-engineering.md) — harness 是 autonomy slider 背后的工程——约束 agent 的自由度就是在调节滑块
- [Guardrails](guardrails.md) — guardrails 在每个自主度级别提供安全边界
- [Generation-Verification Loop](generation-verification-loop.md) — 滑块越高，单次验证的 scope 越大，对 GUI 和审计工具的要求越高

## References

- `sources/karpathy-software-is-changing-again.md` — Karpathy 2025 YC 演讲
