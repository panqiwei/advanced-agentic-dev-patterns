# Chroma

## 概述

Chroma 是一家开源向量数据库公司，专注于 AI 应用的嵌入存储和检索。其研究部门（Chroma Research）发布了 [context rot 研究](../sources/chroma-context-rot.md)，系统性地测量了 LLM 性能随输入长度增长的退化现象。

## 与 Wiki 主题的关联

### Context Rot 研究

Chroma 在 2025 年发布的 [Context Rot](../concepts/context-rot.md) 研究是目前对 LLM 长 context 退化最系统的实证工作之一：
- 测试 18 个前沿模型
- 四类控制实验（needle-question similarity、distractor impact、needle-haystack similarity、haystack structure）
- 加上 LongMemEval 和 Repeated Words 两个补充实验

### 研究动机

作为向量数据库公司，Chroma 的研究动机指向 RAG 优于纯长 context 的论证：如果 context rot 是系统性的，那么检索相关子集（Chroma 的核心产品能力）比塞入全部内容更可靠。

这一利益关系不影响研究的方法论价值——实验设计严谨、代码开源（[GitHub](https://github.com/chroma-core/context-rot)），但在解读结论时应注意这一背景。

## References

- `sources/chroma-context-rot.md`
