# 后门准则（Backdoor Criterion）

后门准则是 [Judea Pearl](../entities/judea-pearl.md) 提出的图形化判据，用于在 [因果 DAG](causal-dag.md) 上判断哪些变量集合足以消除混淆偏差。它解决了困扰流行病学家和社会科学家数十年的变量选择问题——给定一个因果图，哪些变量应该被"控制"以获得无偏的因果效应估计？

## 定义

变量集 S 满足后门准则（相对于有序变量对 (X, Y)），当且仅当：

1. **S 中没有 X 的后代**
2. **S 阻断 X 到 Y 的所有"后门路径"**——即所有以箭头指向 X 结尾的路径

其中"阻断"遵循 d-分离规则（链/叉中的中间节点阻断路径；对撞节点默认阻断路径，被条件化后打开路径）。

## 含义

当 S 满足后门准则时，以下等式成立：

P(Y=y | do(X=x)) = Σ_s P(Y=y | X=x, S=s) P(S=s)

这就是**后门调整公式**（也称逆概率加权）：将干预后的分布转换为观测条件概率的加权平均。右侧全部可从观测数据中估计。

## 直觉

DAG 中从 X 到 Y 的路径分两类：

- **正向路径**（箭头从 X 指向 Y 方向）——传递真实的因果影响
- **后门路径**（至少一条箭头指向 X）——传递虚假的混淆关联

条件化满足后门准则的变量集 S，阻断了所有虚假关联通道，同时保留了所有真实因果通道。排除 X 的后代是因为条件化后代可能打开对撞路径，引入新的偏差。

## 重要细节

### 充分集不唯一

同一个 DAG 中可能存在多个满足后门准则的变量集。研究者可以在其中选择测量成本最低或采样变异最小的集合。

### 不是所有预处理变量都应该被控制

Pearl 特别强调：盲目地将所有可用的预处理变量纳入调整集是危险的。某些变量（如 DAG 中的对撞节点）被条件化后反而**增加**混淆偏差。倾向得分方法中"尽可能多地控制变量"的常见建议可能导致错误。

### c-等价性

Pearl 和 Paz (2009) 进一步定义了 c-等价性——两个变量集产生相同混淆偏差的充要条件。这允许研究者在调整前就比较不同变量集的效果，选择最优策略。

## 与 wiki 已有概念的关系

- **[因果 DAG](causal-dag.md)**: 后门准则在 DAG 上操作，利用 d-分离判定路径阻断
- **[do 演算](do-calculus.md)**: 后门调整公式是 do 演算规则 2（干预与观察互换）的特例
- **[因果干预](causal-intervention.md)**: 后门调整是估计 do(X=x) 效应的主要技术之一
- **[前门准则](frontdoor-criterion.md)**: 当后门调整不可行（混淆变量不可观测）时的替代方案
- **[中介分析](mediation-analysis.md)**: 自然直接效应的识别需要对 Z→Y 路径应用后门准则

## References

- Pearl, Judea (2010). "An Introduction to Causal Inference." *The International Journal of Biostatistics*, 6(2). `sources/pearl-intro-causal-inference-2010.md`
- Pearl, Judea (2009). *Causality: Models, Reasoning, and Inference*. Cambridge University Press.
- Pearl, Judea (1993). "Bayesian Analysis in Expert Systems: Comment." *Statistical Science*, 8(3).
