# 归纳问题

## 定义

归纳问题（problem of induction）是休谟哲学中发现的根本认识论困难：从"过去一直如此"到"未来也将如此"的推理，无法获得理性上的合理化。这一发现表明，我们最基本的知识获取方式——从经验中学习并推广到未来——在逻辑上缺乏理性基础。

## 休谟的论证

### 问题的提出

休谟通过两个明显不同的命题揭示归纳问题：

- (1) 我发现，服用阿司匹林后头痛总是得到缓解
- (2) 我现在服用的阿司匹林将缓解我的头痛

从 (1) 到 (2) 的推理似乎完全自然，且"总是被做出"。但连接它们的推理链条是什么？

### 理性来源的穷举排除

休谟逐一排除了从 (1) 到 (2) 的所有理性路径：

**演绎推理失败**：无论过去阿司匹林多少次缓解了头痛，"这次阿司匹林不会起作用"并不构成矛盾。自然进程发生变化在逻辑上是完全可想象的。因此，演绎推理无法弥合过去与未来的鸿沟。

**概率推理循环**：从 (1) 到 (2) 的概率推理需要一个"连接原则"来桥接过去与未来。最自然的候选者是齐一性原则（Uniformity Principle）：

> [UP] 未来将与过去相似

采用 [UP] 确实能让我们从 (1) 推出 (2)。但 [UP] 本身既非直觉可知，也非可证明——它只能通过概率论证来确立。而概率论证本身最终需要援引 [UP]，构成恶性循环。

### 休谟的解答

休谟将归纳问题视为证明因果推理不由理性决定的关键论据。他的解答不是找到归纳推理的理性基础，而是揭示其实际基础——[习惯](../concepts/custom-and-habit.md)：

- 驱动我们从过去推向未来的，不是理性论证，而是重复经验形成的心理倾向
- 齐一性原则本身就是习惯的产物——我们"相信"未来与过去相似，是因为习惯使然，不是因为有理由这样相信
- 这种安排是"自然的普通智慧"，比"理性的谬误演绎"更可靠

## 形式化重构

SEP 条目（Henderson 2022）将休谟的论证重构为精确的逻辑结构：

- **P1**（休谟之叉）：论证只有演示性（demonstrative）和概率性（probable）两种
- **P2**：归纳推理 I 预设[齐一性原则](../concepts/uniformity-principle.md)（UP）
- **第一角**（C1）：演示性论证无法建立 UP——UP 的否定不构成矛盾
- **第二角**（C2）：概率论证预设 UP 本身——[规则循环](../concepts/rule-circularity.md)
- **C5**：归纳推理没有辩护

关于 P2 存在争议。Okasha/Sober 指出休谟可能犯了量词换位谬误：应该说"每个归纳推理有某个预设"，而非"存在一个所有归纳推理共享的预设"。如果每个归纳推理依赖不同的经验前提，循环就变成了回归（regress）——这可能不那么致命。

## 主要回应方案

归纳问题是哲学史上影响最深远的发现之一，催生了多条主要回应路线：

- **康德**：被休谟"从独断论的迷梦中唤醒"，试图通过先验哲学重建因果知识的必然性基础——综合先验命题的可能性
- **[波普尔](../entities/karl-popper.md)**：接受归纳问题不可解决，提出[证伪主义](../concepts/falsificationism.md)作为替代方案——科学不需要归纳。但"佐证"概念暗中重引归纳
- **[古德曼](../entities/nelson-goodman.md)**：通过[grue 问题](../concepts/grue-problem.md)将归纳问题推向"新归纳之谜"——即使承认归纳有效，哪些归纳是合法的？
- **[贝叶斯方案](../concepts/bayesian-induction.md)**：用概率更新框架重新表述归纳推理。提供了最精确的数学处理，但先验概率的选择引入不可消除的经验假设
- **[元归纳](../concepts/meta-induction.md)**（Schurz）：不直接辩护归纳，而是证明"追随当前最成功方法"的元策略是先验最优的
- **日常语言消解**（Strawson）：符合归纳标准就是"合理"的全部意思——不存在进一步的辩护需求
- **[No Free Lunch 定理](../concepts/no-free-lunch.md)**：归纳问题第一角的数学化身——在所有可能的数据序列上，任何算法不比随机好。但模型相对的保证仍然可能

## 与本 wiki 其他概念的关系

- **[因果性（休谟）](../concepts/causation-hume.md)**：归纳问题是休谟因果性批判的核心论据
- **[恒常连结](../concepts/constant-conjunction.md)**：归纳推理的经验基础——我们从恒常连结出发，但无法合理化从恒常连结到因果必然性的跃迁
- **[必然联系](../concepts/necessary-connection.md)**：归纳问题的哲学后果——如果归纳推理没有理性基础，因果"必然联系"就不可能来自理性
- **[经验主义](../concepts/empiricism.md)**：归纳问题是经验主义内部发现的困难——经验主义自身的方法论揭示了经验知识的理性基础的缺失
- **[齐一性原则](../concepts/uniformity-principle.md)**：归纳推理预设的核心假设——"未来将与过去相似"
- **[grue 问题](../concepts/grue-problem.md)**：归纳问题的深化——从"是否"到"如何"
- **[证伪主义](../concepts/falsificationism.md)**：Popper 对归纳问题的回应——科学不需要归纳
- **[贝叶斯归纳](../concepts/bayesian-induction.md)**：用概率框架重新表述归纳推理的最精确方案
- **[元归纳](../concepts/meta-induction.md)**：在元层面绕过归纳问题的最新策略
- **[No Free Lunch 定理](../concepts/no-free-lunch.md)**：归纳问题在机器学习中的数学化身
- **[规则循环](../concepts/rule-circularity.md)**：归纳问题第二角的核心难点
- **[缩放定律](../concepts/scaling-laws.md)**：缩放定律是一种归纳推理——从过去的数据规律（参数量/数据量与性能的关系）推断未来趋势，面临休谟式质疑
- **[误差级联](../concepts/error-cascade.md)**：多步归纳推理中的误差累积——每一步的不确定性在链条中放大

## References

- Stanford Encyclopedia of Philosophy, "David Hume", Section 5.1: Causal Inference: Critical Phase, https://plato.stanford.edu/entries/hume/#Cau
- Stanford Encyclopedia of Philosophy, "The Problem of Induction", https://plato.stanford.edu/entries/induction-problem/
