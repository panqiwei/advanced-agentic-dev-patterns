# Routing（路由）

## 定义

对输入进行分类，然后导向专门化的后续处理流程。实现关注点分离——不同类型的输入由不同的专用 prompt 处理，避免为一类输入优化时损害其他类型的表现。

## 适用场景

任务有明确的类别划分，且分类本身可以准确完成（LLM 或传统分类器均可）。

**典型用例**：
- 客服系统：一般问题、退款请求、技术支持导向不同处理流程
- 模型选择：简单问题用小模型（Haiku），复杂问题用大模型（Sonnet）

## 在 agentic 系统中的位置

属于 [agentic systems](agentic-systems.md) 中的 workflow 模式。是 [prompt chaining](prompt-chaining.md) 的分支变体——从线性变为分叉。

## References

- `sources/anthropic_official/building-effective-agents.md`
