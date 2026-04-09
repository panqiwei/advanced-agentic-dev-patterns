# 元归纳

## 定义

元归纳（meta-induction）是 Gerhard Schurz 提出的归纳辩护策略：不在对象层面（object-level）直接辩护归纳推理，而是在元层面（meta-level）证明"追随当前最成功的预测方法"是所有可用方法中最优的策略。核心结果：加权元归纳策略 wMI 在长期运行中收敛到可用方法中的最大成功率。

## 对象归纳 vs 元归纳

- **对象归纳（OI）**：直接从观察到的事件做出预测——"过去 100 块面包都提供了营养 → 下一块也会"
- **元归纳（MI）**：根据各种预测方法的成功率来加权聚合它们的预测——"归纳法在过去比反归纳法成功得多 → 继续追随归纳法"

关键区别：OI 的辩护需要[齐一性原则](../concepts/uniformity-principle.md)（休谟的循环问题）；MI 的辩护是先验数学定理，不依赖经验假设。

## Schurz 的论证结构

1. **先验部分**：加权元归纳策略 wMI 被数学证明在有限方法池中是长期最优的（来自遗憾学习理论 regret-based learning）。这是先验的——纯数学推导。
2. **经验部分**：在目前可用的预测方法中，对象归纳法的成功率最高。这是经验事实。
3. **结论**：因此，追随对象归纳法是元归纳最优的——不是因为归纳法本身被先验地辩护了，而是因为先验最优的元策略（wMI）当前指向它。

这绕过了休谟的循环：归纳法不是自我辩护的，而是被一个独立辩护的元策略推荐的。

## 局限性

- **有限方法池**：原始定理要求有限个竞争方法。扩展到无限方法池是一个开放问题。
- **辩护的是 wMI 而非 OI**：严格来说，被辩护的是元归纳策略本身——如果明天某种非归纳方法开始表现更好，wMI 会转向它。对象归纳只是当前最优方法，不是永远最优。
- **只辩护下一步**：我们最多能说在下一个时间步上追随 OI 是合理的（因为 wMI 当前分配给 OI 的权重最大），而非永远追随 OI。

## 与 LLM/Agent 工程的映射

元归纳思想在 AI 系统设计中有直接的工程对应：

- **模型路由/选择**：多模型架构中，根据各模型在特定任务类型上的历史表现来动态路由请求——这就是 wMI 的工程实现。
- **[路由](../concepts/routing.md)**：路由模式天然是元归纳的——根据输入特征选择最成功的处理路径。
- **在线学习与 Bandit 算法**：多臂赌博机和 contextual bandit 与 wMI 共享相同的数学基础（遗憾最小化）。
- **持续评估的必要性**：元归纳的核心洞见——方法的相对优劣可能随时变化——解释了为什么持续的 [agent 可靠性评估](../concepts/agent-reliability-evaluation.md)不可或缺。

## 与本 wiki 其他概念的关系

- **[归纳问题](../concepts/induction-problem.md)**：元归纳是最新的回应方案——不试图直接解决，而是在元层面绕过
- **[证伪主义](../concepts/falsificationism.md)**：两者都接受归纳不可直接辩护，但提出不同的替代策略
- **[贝叶斯归纳](../concepts/bayesian-induction.md)**：贝叶斯方案需要选择先验，元归纳方案需要定义方法池——两者的经验输入不同但结构相似
- **[路由](../concepts/routing.md)**：元归纳的工程化身——根据方法的成功率动态选择

## References

- Schurz, Gerhard, 2008, "The Meta-inductivist's Winning Strategy in the Prediction Game", *Philosophy of Science*, 75(3): 278–305.
- Schurz, Gerhard, 2019, *Hume's Problem Solved: the Optimality of Meta-induction*, Cambridge, MA: MIT Press.
- Cesa-Bianchi, Nicolo, and Gabor Lugosi, 2006, *Prediction, Learning, and Games*, Cambridge: Cambridge University Press.
- Stanford Encyclopedia of Philosophy, "The Problem of Induction", Section 5.5, https://plato.stanford.edu/entries/induction-problem/
