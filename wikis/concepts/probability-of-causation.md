# 因果概率（Probability of Causation）

因果概率是"效果的原因"类问题的形式化表达——给定事件已经发生，评估某个因素"是否是"该事件的原因。这类问题在法律（药物致害诉讼）、医学（某患者的病是否因暴露所致）和日常推理（是阿司匹林治好了我的头痛还是电视节目？）中普遍存在。

## 三种因果概率

### 必然性概率（Probability of Necessity, PN）

给定 X=x 且 Y=y 已发生，"若 X 非 x，Y 是否非 y"的概率：

PN(x,y) = P(Y_{x'} = y' | X=x, Y=y)

法律标准中的"but-for"因果检验直接对应 PN 的计算。

### 充分性概率（Probability of Sufficiency, PS）

给定 X=x' 且 Y=y'（即因素未出现且效果未发生），"若 X 为 x，Y 是否为 y"的概率：

PS(x,y) = P(Y_x = y | X=x', Y=y')

### 必然且充分概率（PNS）

P(Y_x = y, Y_{x'} = y') — 即同一个体既因 X 而得 Y，又因非 X 而免 Y 的概率。

## 识别性

因果概率涉及同一个体在两个互斥条件下的反事实结果，原则上不可观测。但 Pearl 证明，在**单调性假设**（Y_1(u) >= Y_0(u) 对所有个体 u 成立）下，PN 可从数据中识别：

PN = [P(y|x) - P(y|x')] / P(y|x) + [P(y|x') - P(y|do(x'))] / P(x,y)

第一项是经典的超额风险比（ERR），第二项是混淆偏差的校正。当无混淆时，P(y|x') = P(y|do(x'))，校正项消失，PN 退化为 ERR。

在一般（非单调）情况下，可以推导出 PN 的上下界：

max{0, [P(y) - P(y|do(x'))] / P(x,y)} <= PN <= min{1, [P(y'|do(x')) - P(x',y')] / P(x,y)}

Pearl 展示了一个惊人的结果：在某些实验+观测数据的组合下，即使每种数据单独看不到因果关系，PN 的下界可以达到 1——即因果关系以概率一成立。

## 经验内容

因果概率最初看起来"假设性的、不可定义的、不可检验的"——它要求知道同一个人在接受治疗和未接受治疗两种情况下的结果。但 Pearl 的分析表明它是可定义的（通过 SCM 的手术定义）、部分可检验的（通过上下界）、在特定条件下完全可识别的。

这一结果是反事实经验内容的最有力证明之一——看似纯哲学思辨的概念可以被形式化分析转化为实证可操作的量。

## 与 wiki 已有概念的关系

- **[因果之梯](ladder-of-causation.md)**: 因果概率是第三级（反事实）的典型查询——无法从第二级（干预）实验中回答
- **[结构因果模型](structural-causal-model.md)**: PN 的定义依赖 SCM 的反事实手术定义
- **[do 演算](do-calculus.md)**: PN 的识别公式中使用 P(y|do(x')) 作为成分
- **[因果性（休谟）](causation-hume.md)**: 休谟的"但若非此则非彼"（but-for）因果直觉在 PN 中获得了精确的数学表达
- **[反事实理论](counterfactual-theory.md)**: PN 是 Lewis 式反事实依赖的概率化和操作化版本

## References

- Pearl, Judea (2010). "An Introduction to Causal Inference." *The International Journal of Biostatistics*, 6(2). `sources/pearl-intro-causal-inference-2010.md`
- Pearl, Judea (2009). *Causality: Models, Reasoning, and Inference*. Cambridge University Press, Chapter 9.
- Tian, Jin; Pearl, Judea (2000). "Probabilities of Causation: Bounds and Identification." *Annals of Mathematics and Artificial Intelligence*, 28.
