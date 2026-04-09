# 前门准则（Frontdoor Criterion）

前门准则是 [Judea Pearl](../entities/judea-pearl.md) 提出的去混淆技术，适用于混淆变量不可观测但因果路径上存在可观测中介变量的情形。它是 [后门准则](backdoor-criterion.md) 的补充——当后门调整因不可测混淆而失败时，前门调整可能仍然成功。

## 核心思路

当 X 到 Y 的所有因果路径都经过一组可观测的中介变量 Z，且 Z 满足特定条件时，可以通过两步估计因果效应：

1. 先估计 X 对 Z 的因果效应 P(z|do(x)) = P(z|x)（利用 X→Z 路径无后门混淆）
2. 再估计 Z 对 Y 的因果效应 P(y|do(z))（利用 X 作为 Z→Y 的后门调整变量）
3. 将两个效应组合：P(y|do(x)) = Σ_z P(z|x) Σ_x' P(y|x',z) P(x')

Pearl 2010 将满足前门条件的中介变量称为"中介工具变量"（mediating instrumental variable）。

## 识别条件的一般化

Tian 和 Pearl (2002) 证明了一个更一般的充分条件：P(y|do(x)) 可识别，当且仅当 X 到其每一个子节点的每条路径至少经过一条来自已观测变量的箭头。

Shpitser 和 Pearl (2006) 进一步给出了完全的充要条件，并将结果扩展到任意反事实表达式。

## 经典应用

前门准则最经典的应用场景是吸烟与肺癌的关系：

- X = 吸烟，Y = 肺癌，Z = 焦油沉积
- 不可观测的混淆因子 U = 基因易感性（同时影响吸烟倾向和肺癌风险）
- 后门调整失败（U 不可测），但焦油沉积 Z 满足前门条件

## 与 wiki 已有概念的关系

- **[后门准则](backdoor-criterion.md)**: 后门调整的对偶——后门通过控制混淆变量，前门通过利用中介变量
- **[因果 DAG](causal-dag.md)**: 前门准则依赖 DAG 的路径结构判断
- **[do 演算](do-calculus.md)**: 前门调整是 do 演算三条规则的组合应用
- **[中介分析](mediation-analysis.md)**: 前门准则识别的变量 Z 正是因果路径上的中介变量
- **[因果干预](causal-intervention.md)**: 前门调整是将 do 表达式转换为 do-free 表达式的另一种路径

## References

- Pearl, Judea (2010). "An Introduction to Causal Inference." *The International Journal of Biostatistics*, 6(2). `sources/pearl-intro-causal-inference-2010.md`
- Pearl, Judea (2009). *Causality: Models, Reasoning, and Inference*. Cambridge University Press.
- Tian, Jin; Pearl, Judea (2002). "On the Identification of Causal Effects." Technical Report R-290, UCLA.
