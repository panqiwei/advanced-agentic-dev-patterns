# 规则循环

## 定义

规则循环（rule-circularity）是在辩护推理规则时产生的一种循环：使用推理规则 R 来论证 R 本身是可靠的。与前提循环（premise-circularity）不同，规则循环不在前提中预设结论，而是在推理过程中使用了待辩护的规则本身。

## 前提循环 vs 规则循环

- **前提循环**（恶性）：论证的前提包含了结论，或预设了结论为真。
- **规则循环**（争议中）：论证依赖某条推理规则来得出结论——该推理规则是可靠的。

休谟的[归纳问题](../concepts/induction-problem.md)中，归纳的归纳辩护看起来是循环的。但有些哲学家（van Cleve, Papineau）论证这只是规则循环，而规则循环可能并非恶性的。理由：

1. **演绎也有同样的问题**：演绎推理无法被非循环地辩护——Lewis Carroll 的"阿基里斯与乌龟"对话表明，不能说服一个拒绝使用 modus ponens 的人去使用 modus ponens。
2. **基础性推理规则无处可退**："对于基础性推理形式，我们能合理要求的全部，就是它认可自身"（Lange 2011）。

## 反归纳的自我支持问题

规则循环辩护的一个严重困难：反归纳规则同样可以自我支持。

反归纳规则 CI：「大多数观察到的 A 是 B → 大多数 A 不是 B」

CI 的自我辩护：「大多数 CI 推理过去失败了 →（根据 CI）大多数 CI 推理不会失败 → CI 可靠」

如果归纳可以通过规则循环自我辩护，反归纳也可以——这大大削弱了规则循环辩护的力度。

## 与本 wiki 其他概念的关系

- **[归纳问题](../concepts/induction-problem.md)**：规则循环是归纳问题第二角的核心难点
- **[齐一性原则](../concepts/uniformity-principle.md)**：齐一性原则的循环辩护是规则循环的典型实例
- **[证伪主义](../concepts/falsificationism.md)**：Popper 通过回避归纳来回避规则循环问题
- **[元归纳](../concepts/meta-induction.md)**：Schurz 通过在元层面引入独立辩护来绕过规则循环

## References

- Carroll, Lewis, 1895, "What the Tortoise said to Achilles", *Mind*, 4(14): 278–280.
- Papineau, David, 1992, "Reliabilism, Induction and Scepticism", *The Philosophical Quarterly*, 42(166): 1–20.
- Lange, Marc, 2011, "Hume and the Problem of Induction", in *Inductive Logic* (Handbook of the History of Logic, Vol. 10).
- Stanford Encyclopedia of Philosophy, "The Problem of Induction", Section 4.1, https://plato.stanford.edu/entries/induction-problem/
