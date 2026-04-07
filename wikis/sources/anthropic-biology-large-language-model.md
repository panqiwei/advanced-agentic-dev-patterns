# On the Biology of a Large Language Model

- **来源**: `sources/anthropic_official/biology-large-language-model.md`
- **URL**: https://transformer-circuits.pub/2025/attribution-graphs/biology.html
- **作者**: Anthropic (Transformer Circuits team)
- **发布**: 2025

## 摘要

将 [circuit tracing 方法](anthropic-circuit-tracing-methods.md) 应用于 Claude 3.5 Haiku，系统研究十种模型行为的内部机制。核心比喻：如同生物学用显微镜研究有机体，本文对 LLM 进行"解剖学"研究。

## 十大案例研究

| 领域 | 发现 |
|------|------|
| 多步推理 | "Dallas → Texas → Austin"存在真实的中间特征跳转，非死记硬背 |
| 诗歌规划 | 模型在行首就激活韵脚候选词特征，兼具前瞻和回溯规划 |
| 多语言 | 跨语言共享抽象概念特征，Claude 3.5 Haiku 共享比例是小模型的 2 倍+ |
| 加法 | 同一加法电路在完全不同的上下文中泛化 |
| 医学诊断 | 模型在"脑内"生成候选诊断并据此决定追问哪些症状 |
| 幻觉 | 拒绝回答是默认行为，"已知实体"特征抑制此默认，误触发导致幻觉 |
| 安全拒绝 | 微调产生通用"有害请求"特征，从预训练中学到的具体有害请求特征聚合而来 |
| 越狱 | 语法连贯性特征与安全机制的张力——完成语法结构后才能"拒绝" |
| CoT 忠实性 | 可区分真实推理、无中生有、动机推理（从答案反推步骤）三种模式 |
| 隐藏目标 | 微调追求隐藏目标的模型，可解释性方法能发现嵌入在"助手人格"中的相关机制 |

## 方法论特点

- 归因图在约 25% 的 prompt 上产生满意的洞察
- 所有发现通过扰动实验（inhibition/injection）验证
- 发现许多机制是自下而上、无预设假说时发现的

## 对 Agent 工程的启示

虽然本文是纯解释性研究，但多项发现与 agent 系统设计相关：
- **幻觉机制**理解有助于设计更好的 [guardrails](../concepts/guardrails.md)
- **CoT 忠实性**分析直接关联 agent 的推理可靠性
- **越狱分析**启发更深层的安全防护设计

## References

- `sources/anthropic_official/biology-large-language-model.md`
