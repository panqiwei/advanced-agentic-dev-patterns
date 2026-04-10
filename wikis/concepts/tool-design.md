# Tool Design（工具设计）

## 定义

为 LLM agent 设计工具接口的工程实践。工具定义和规格需要与整体 prompt 同等程度的 prompt engineering。

## 核心要点

1. **格式选择**：同一个操作可以有多种表示方式（diff vs 重写文件、markdown code block vs JSON）。选择 LLM 最容易正确生成的格式：
   - 给模型足够的 token 来"思考"，避免一开始就把自己写进死角
   - 格式接近模型在训练数据中自然见过的
   - 没有格式开销（如维护精确行数、对代码做字符串转义）

2. **文档质量**：好的工具定义应包含使用示例、边界情况、输入格式要求、与其他工具的清晰边界。

3. **防误设计（Poka-yoke）**：通过改变参数设计让犯错更难，而不是靠提示词约束。

## Token 效率与 Context Engineering

[Effective Context Engineering](../sources/anthropic-effective-context-engineering.md) 从 [context engineering](context-engineering.md) 的角度补充了工具设计的效率维度：

- **工具返回值的 token 效率**：工具定义了 agent 与信息/行动空间的契约，返回值应尽量紧凑——冗余的工具输出直接消耗模型的注意力预算
- **最小可行工具集**：膨胀的工具集覆盖太多功能或导致歧义决策点，是最常见的 agent 失败模式。如果人类工程师无法确定性地说出在某情境下该用哪个工具，agent 也做不到
- **工具集精简的二阶收益**：较少的工具不仅减少选择歧义，还使 context 的维护和修剪更可靠

## 双模式 + 双输出：CLI-Anything 的具体模式

[CLI-Anything](../entities/cli-anything.md) 从实践中归纳出两个可直接迁移的工具设计 pattern：

- **双交互模式**：同一个二进制既是 subcommand CLI（scripting/pipeline），也是有状态 REPL（多步试错）——无参进 REPL，有参做一次性调用。详见 [repl-for-agents](repl-for-agents.md)
- **双输出格式**：每个命令内建 `--json` flag，切换机器可读结构和人类可读表格；agent 通过 `--help` / `which` 等 POSIX 原语发现能力，无需额外 SDK

这两个模式合起来让同一个工具同时服务人类和 agent 两种用户类型，是 [agent-native-software](agent-native-software.md) 原则在工具层的具体实现。

## 相关概念

- [ACI](aci.md) — 工具设计是 ACI 的具体实践
- [Augmented LLM](augmented-llm.md) — 工具是 LLM 增强能力之一
- [Context engineering](context-engineering.md) — 工具效率是 context engineering 的组成部分

## References

- `sources/anthropic_official/building-effective-agents.md`
- `sources/anthropic_official/effective-context-engineering-for-ai-agents.md`
