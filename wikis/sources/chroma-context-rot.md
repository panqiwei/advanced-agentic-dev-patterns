# Context Rot: How Increasing Input Tokens Impacts LLM Performance

- **来源**: `sources/chroma-context-rot.md`
- **URL**: https://research.trychroma.com/context-rot
- **作者**: Kelly Hong, Anton Troynikov, Jeff Huber (Chroma Research)
- **发表**: 2025

## 摘要

Chroma 对 18 个前沿 LLM（包括 GPT-4.1、Claude 4、Gemini 2.5、Qwen3）的系统性实验，揭示了一个核心事实：**模型性能随输入长度增长而可测量地退化**，即使在极其简单的任务上。研究者将这一现象命名为 **context rot**（上下文腐烂）。

研究的关键方法论贡献：通过保持任务难度不变、仅变化输入长度，隔离了输入长度本身作为性能退化的变量。

## 核心发现

### 三种退化机制

1. **Needle-question similarity 效应**：当 needle 与 question 的语义相似度降低时，性能退化随输入长度增长更快。低相似度配对在短 context 下仍可成功——退化不源于任务内在难度，而源于输入长度本身。

2. **Distractor interference（干扰项干涉）**：即使单个 distractor 也会降低性能，四个 distractor 进一步恶化。不同 distractor 的影响非均匀——某些 distractor 比其他 distractor 造成更大的性能下降。这种非均匀性随输入长度增长而放大。

3. **Haystack structure 效应**：令人意外的发现——保持逻辑连贯结构的 haystack 反而比随机打乱句子顺序的 haystack 更损害模型性能。这暗示注意力机制对输入结构敏感。

### 模型行为差异

- **Claude 系列**：保守策略，不确定时倾向弃权（"找不到答案"），幻觉率最低
- **GPT 系列**：自信策略，面对 distractor 时倾向生成看似正确但错误的回答，幻觉率最高
- **Gemini/Qwen**：介于两者之间

### Repeated Words 实验

要求模型精确复制重复词序列——任务极其简单。结果：
- 所有模型在 context 增长后性能退化
- Claude Opus 4 退化最慢但有 2.89% 拒绝率
- GPT-4.1 有 2.55% 拒绝率
- Qwen3-8B 在 5000 词后生成完全无关内容
- Gemini 2.5 Pro 在 500-750 词后开始生成随机字符

### LongMemEval 实验

对比 focused input（仅相关部分，~300 tokens）和 full input（完整对话，~113k tokens）：所有模型在 full input 上性能显著下降。Claude 系列差距最大（保守弃权策略导致）。

## 关键洞察

1. **NIAH 基准不够**：Needle in a Haystack 仅测试词汇级检索，现实任务需要语义理解和消歧。NIAH 上的高分不代表长 context 能力可靠。

2. **Context rot 是系统性的**：不是特定模型的 bug，而是所有 18 个测试模型的共同模式。输入长度增加 = 性能退化，无一例外。

3. **Context engineering 的必要性**：信息是否在 context 中不是唯一重要的事——信息如何呈现同样重要。这为 [context management](../concepts/context-management.md) 实践提供了实证基础。

4. **对 agent 系统的影响**：实验使用简单任务；实际 agent 任务涉及多步推理和更大模糊性，预期退化更严重。这对 [长时运行 agent](../concepts/long-running-agents.md) 和 [harness engineering](../concepts/harness-engineering.md) 有直接影响。

## 与其他来源的关系

- 为 [context management](../concepts/context-management.md) 中的 compaction 策略提供了实证理由——不是因为 token 不够，而是因为更多 token 主动损害性能
- 与 [mechanistic interpretability](../concepts/mechanistic-interpretability.md) 的交叉：研究指出 haystack structure 影响注意力机制，但未深入解释机制，呼吁解释性研究
- [Chroma](../entities/chroma.md) 作为向量数据库公司，研究动机指向 RAG 优于纯长 context 的论证

## References

- `sources/chroma-context-rot.md`
