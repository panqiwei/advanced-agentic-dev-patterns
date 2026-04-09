# 证伪主义

## 定义

证伪主义（falsificationism）是 [Karl Popper](../entities/karl-popper.md) 提出的科学方法论：科学不通过归纳积累确认证据来建立理论，而是通过大胆猜想（bold conjectures）并试图证伪（falsification）它们来推进。当一个假说的预测被实验否定时，该假说通过*演绎演绎*（modus tollens）被拒绝——这一逻辑操作完全是演绎的，无需诉诸归纳。

## 与归纳问题的关系

Popper 视[归纳问题](../concepts/induction-problem.md)为不可解决的——他接受[休谟](../entities/david-hume.md)的论证。但他的策略不是试图解决归纳问题，而是论证科学根本不需要归纳：

- **传统观点**：科学 = 观察 → 归纳 → 理论 → 预测
- **Popper 的观点**：科学 = 猜想 → 推导预测 → 实验检验 → 证伪或暂时保留

证伪的逻辑是纯演绎的：如果 H → P，且 ¬P，则 ¬H。不需要齐一性原则，不需要从过去推向未来。

## 佐证问题

Popper 的框架面临一个核心困难：当多个未被证伪的假说相互矛盾时，如何选择？Popper 引入"佐证"（corroboration）概念——经受了更多严格检验的理论更值得信赖。但这实质上是一种归纳推理的回归：

- 理论 T 在过去经受了严格检验 → T 在未来的检验中也将表现良好

这正是[齐一性原则](../concepts/uniformity-principle.md)的变体。正如 Wesley Salmon 所指出的，纯演绎主义无法为实际决策提供指导——我们似乎需要某种"超越演绎"的东西来支持实践中的科学推理。

## 与 LLM/Agent 工程的映射

证伪主义在软件工程和 AI 系统中有直接的工程化身：

- **测试驱动开发（TDD）**：不试图证明代码正确，而是编写测试来试图证伪它。通过所有测试 ≠ 正确，只是"尚未被证伪"。
- **[Agent 可靠性评估](../concepts/agent-reliability-evaluation.md)**：benchmark 不证明 agent 可靠，只是它尚未在这些测试中失败。生产中的新场景可能随时证伪它。
- **[混沌工程](../concepts/chaos-engineering-for-agents.md)**：主动注入故障来试图证伪系统的可靠性声明——纯粹的 Popper 式方法。
- **佐证困境的工程版**：当多个模型在 benchmark 上都表现良好时，如何选择？我们不自觉地回到归纳推理——选择在更多、更多样的测试中表现好的那个。

## 与本 wiki 其他概念的关系

- **[归纳问题](../concepts/induction-problem.md)**：证伪主义是对归纳问题的回应——接受它不可解，但论证科学不需要归纳
- **[因果性（休谟）](../concepts/causation-hume.md)**：Popper 继承了休谟对因果必然性的怀疑
- **[经验主义](../concepts/empiricism.md)**：证伪主义保留了经验主义的核心——理论必须接受经验检验——但拒绝了归纳经验主义
- **[贝叶斯归纳](../concepts/bayesian-induction.md)**：贝叶斯方案与证伪主义形成对比——前者量化确认程度，后者只关心否定

## References

- Popper, Karl, 1935 [1959], *The Logic of Scientific Discovery*, London: Hutchinson.
- Salmon, Wesley C., 1981, "Rational Prediction", *British Journal for the Philosophy of Science*, 32(2): 115–125.
- Stanford Encyclopedia of Philosophy, "The Problem of Induction", Section 6, https://plato.stanford.edu/entries/induction-problem/
