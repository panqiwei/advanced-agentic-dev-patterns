# 手段-目的分析（Means-Ends Analysis）

## 定义

**手段-目的分析**（Means-Ends Analysis，MEA）是一种启发式搜索策略：

1. 比较当前状态与目标状态，检测两者之间的**具体差距**（difference）
2. 从可用操作中选择能**减少该差距**的操作
3. 应用操作，产生新状态，重复上述过程

MEA 的核心思想：搜索由**差距驱动**（difference-directed），而非盲目生成。

## 来源：General Problem Solver（GPS）

手段-目的分析由 Allen Newell、J.C. Shaw 与 Herbert A. Simon 在 General Problem Solver（GPS，1957）中形式化。GPS 是早期 AI 中最具影响力的程序之一，旨在提取跨任务域的通用问题求解机制。

GPS 的运作：
1. 建立目标：使当前状态与目标状态相同
2. 检测差距：哪个差距最重要？
3. 选择操作：哪个操作能减少该差距？
4. 若操作有前提条件未满足，建立子目标满足前提
5. 递归处理子目标

这种递归子目标结构使 GPS 能处理多层嵌套问题。

## 代数例子的 MEA 演示

求解 AX + B = CX + D（Newell & Simon 原文的核心例子）：

```
目标: 形如 X = E 的表达式
当前: AX + B = CX + D

差距1: 右边有 CX → 两边减去 CX → (A-C)X + B = D
差距2: 左边有 B → 两边减去 B → (A-C)X = D - B
差距3: X 有系数 (A-C) → 两边除以 (A-C) → X = (D-B)/(A-C)
```

每一步都使用**变量信息**（检测到的当前差距）和**常量信息**（内置于操作的约束：等式操作必须保持解集不变）。

> "搜索信息从何而来并无神秘——它来自任务域中可被检测并加以利用的结构。"（Newell & Simon, 1976）

## MEA 的特性

### 优势
- **信息驱动**：每步减少与目标的距离，避免无谓探索
- **可处理前提条件**：通过子目标结构处理操作的约束
- **跨任务域通用**：定理证明、规划、机器人操作均可用

### 局限
- **局部最优陷阱**：差距减少不一定单调——有时必须先"后退"才能前进
- **差距定义问题**：需要形式化地定义当前状态与目标之间的差距，并非总是显然
- **爆炸风险**：子目标递归可能产生指数量级的子问题

## 历史地位

MEA 是 AI 历史上最早的**通用**搜索技术之一，代表了从特定任务程序向通用问题求解机制的重要转变。

| 时间 | 系统 | MEA 相关性 |
|------|------|-----------|
| 1955 | Logic Theorist | 最优先搜索雏形（隐含）|
| 1957 | GPS | MEA 形式化，手段-目的结构 |
| 1960s | STRIPS | GPS 框架的规划扩展 |
| 1970s+ | 规划系统 | MEA 变体遍布自动化规划 |

## 与当代 AI 的关联

MEA 的思想在 LLM 时代以不同形式重现：

- **Chain-of-Thought（CoT）**：通过中间步骤将复杂目标分解，类似 MEA 的子目标结构，但在隐式表示空间中进行
- **ReAct 框架**：推理（差距检测）+ 行动（操作选择）循环，是 MEA 在 LLM 工具使用场景的近似
- **[评估器-优化器](evaluator-optimizer.md)模式**：生成候选解，评估与目标差距，迭代改进——是 MEA 在 agent 架构中的体现

## 关联概念

- [启发式搜索](heuristic-search.md) — MEA 所属的搜索范式
- [问题空间](problem-space.md) — MEA 操作的表示框架
- [物理符号系统假说](physical-symbol-system.md) — MEA 的理论根基
- [评估器-优化器](evaluator-optimizer.md) — MEA 思想在 agent 工作流中的现代对应

## References

- Newell, A., & Simon, H. A. (1976). "Computer Science as Empirical Inquiry: Symbols and Search." *Communications of the ACM*, 19(3), 113–126. 摘要: [`sources/newell-simon-computer-science-empirical-inquiry-1975.md`](../sources/newell-simon-computer-science-empirical-inquiry-1975.md)
- Newell, A., Shaw, J. C., & Simon, H. A. (1959). "Report on a general problem-solving program." *Proceedings of the International Conference on Information Processing*, 256–264.
