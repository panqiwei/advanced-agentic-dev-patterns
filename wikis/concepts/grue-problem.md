# Grue 问题（新归纳之谜）

## 定义

Grue 问题——也称"新归纳之谜"（new riddle of induction）——是 [Nelson Goodman](../entities/nelson-goodman.md) 1955 年提出的对归纳推理的深化质疑。即使承认归纳推理在原则上有效，同一组观察数据可以支持互相矛盾的归纳结论，取决于我们使用哪些谓词来描述观察结果。

## Goodman 的论证

定义谓词 "grue"：一个对象是 grue 的，当且仅当它在时间 *t* 之前被观察到且为绿色，或在时间 *t* 之后被观察到且为蓝色。

现在考虑在时间 *t* 之前观察到的所有翡翠都是绿色的：

- 用"绿色"描述：所有观察到的翡翠是绿色的 → 所有翡翠是绿色的 → 时间 *t* 后观察到的翡翠将是**绿色**的
- 用"grue"描述：所有观察到的翡翠是 grue 的 → 所有翡翠是 grue 的 → 时间 *t* 后观察到的翡翠将是**蓝色**的

两个推理使用完全相同的归纳模式，基于完全相同的观察数据，却得出矛盾的预测。

## 超越休谟：从"能否归纳"到"如何归纳"

[休谟](../entities/david-hume.md)的[归纳问题](../concepts/induction-problem.md)问的是：归纳推理是否有理性基础？Goodman 的问题更深一层：即使我们接受归纳有效，我们仍需解释为什么某些谓词（green）是"可投射的"（projectible），而另一些（grue）不是。

休谟描述了我们如何做归纳推理——基于恒常连结和[习惯](../concepts/custom-and-habit.md)——但他留下了一个空白：为什么我们投射"绿色"而不是"grue"？

## "可投射性"的本质

Goodman 自己的回答是"习惯化"（entrenchment）：一个谓词是可投射的，当且仅当它在过去的成功归纳中被频繁使用。"绿色"比"grue"更深地嵌入了我们的语言实践。

这个回答引发争议——它似乎将归纳的辩护建立在语言惯例之上，而非客观的世界结构。

## 与 LLM/Agent 工程的映射

Grue 问题是特征工程和表示学习的哲学基础：

- **特征选择 = 谓词选择**：从原始数据中选择哪些特征来描述数据，等价于选择用哪些谓词描述观察。选错特征，模型学到的"模式"就是 grue 式的虚假关联。
- **过拟合的哲学本质**：过拟合就是学到了 grue 式谓词——在训练时间段内完美解释数据，但在部署后预测失败。
- **[归纳偏置](../concepts/bayesian-induction.md)**：模型架构本身隐含了哪些谓词是"可投射的"——卷积网络假设空间平移不变性，Transformer 假设注意力机制。
- **分布偏移中的时间依赖**：grue 谓词的核心特征是时间依赖性——某些特征在某个时间点之前有效，之后失效。这正是生产环境中模型退化的典型模式。

## 与本 wiki 其他概念的关系

- **[归纳问题](../concepts/induction-problem.md)**：Grue 问题是归纳问题的深化——从"是否"到"如何"
- **[齐一性原则](../concepts/uniformity-principle.md)**：Grue 问题表明 UP 的表述过于模糊——未来与过去在哪个方面相似？
- **[经验主义](../concepts/empiricism.md)**：Grue 问题挑战了纯经验主义——仅凭观察无法区分 green 和 grue
- **[误差级联](../concepts/error-cascade.md)**：在多步推理中，grue 式错误会被级联放大

## References

- Goodman, Nelson, 1955, *Fact, Fiction and Forecast*, Cambridge, MA: Harvard University Press.
- Stanford Encyclopedia of Philosophy, "The Problem of Induction", Section 4.2, https://plato.stanford.edu/entries/induction-problem/
