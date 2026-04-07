# Tracing the Thoughts of a Large Language Model

- **来源**: `sources/anthropic_official/tracing-thoughts-language-model.md`
- **URL**: https://www.anthropic.com/research/tracing-thoughts-language-model
- **作者**: Anthropic
- **发布**: 2025

## 摘要

Anthropic 发布两篇配套论文的综述博文。第一篇 [Circuit Tracing](anthropic-circuit-tracing-methods.md) 介绍了将 LLM 内部计算路径可视化为"归因图"的方法论；第二篇 [On the Biology of a Large Language Model](anthropic-biology-large-language-model.md) 将该方法应用于 Claude 3.5 Haiku，研究十种关键行为的内部机制。

核心比喻：为 AI 构建"显微镜"，类似神经科学对大脑的研究方法。

## 关键发现

1. **多语言共享表征**：Claude 在不同语言间共享概念特征——存在某种"思维语言"（language of thought），先在抽象空间运算，再翻译为具体语言输出。
2. **前瞻规划**：写押韵诗时，模型在开始新行前就预选韵脚词，然后"朝目标写"。这推翻了"逐词即兴"假说。
3. **推理忠实性**：模型有时会从目标答案反向构造推理步骤（motivated reasoning），可解释性工具能"当场抓住"。
4. **幻觉机制**：默认行为是拒绝回答，"已知实体"特征抑制了此默认；当此特征误触发时产生幻觉。
5. **越狱分析**：语法连贯性特征与安全机制之间存在张力——模型倾向完成已开始的语法结构，即使已检测到危险内容。
6. **心算策略**：模型发展出自己的并行计算路径（近似值 + 精确末位数字），与其"解释"中声称的标准算法不同。

## 局限性

- 即使在短提示上，归因图仅捕获总计算量的一部分
- 需数小时人工分析，无法直接应用于现代长 CoT 推理
- 替代模型（replacement model）可能引入与底层模型不同的机制

## 与其他 source 的关联

- 方法论详见 [Circuit Tracing Methods](anthropic-circuit-tracing-methods.md)
- 案例研究详见 [Biology of a Large Language Model](anthropic-biology-large-language-model.md)
- [Emergent Introspective Awareness](anthropic-emergent-introspective-awareness.md) 进一步研究模型是否能"觉察"自身内部状态

## References

- `sources/anthropic_official/tracing-thoughts-language-model.md`
