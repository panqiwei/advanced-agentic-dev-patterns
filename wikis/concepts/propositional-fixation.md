# 命题固着（Propositional Fixation）

**定义：** John McCarthy 提出的概念，描述神经网络在逻辑表达能力上的根本局限：神经网络可以表示命题逻辑和一阶逻辑的有限片段，但无法表示完整的一阶逻辑或高阶逻辑。

---

## 含义

神经网络擅长的逻辑层次：
- **可表示：** 命题逻辑，非单调逻辑程序，命题模态逻辑，一阶逻辑的有限片段
- **不可表示：** 完整的一阶逻辑（含函数符号、无限量化链），高阶逻辑

这一局限并非实现细节，而是与神经网络的基本计算结构有关——分布式连续表示不能实现任意深度的递归绑定和量化。

---

## 工程含义

**关系学习的天花板：** 学习"祖先"关系（∀X,Y,Z: ancestor(X,Z) ← parent(X,Y) ∧ ancestor(Y,Z)）需要任意深度的递归推理链，神经网络无法直接处理；需要借助符号推理层。

**泛化的上界：** 神经网络学到的规则是命题级的（grounded），无法自然地外推到新变量组合；符号系统的全称量化可以实现真正的组合外推。

---

## 回应策略

1. **Logic Tensor Networks（LTN）：** 将逻辑陈述转化为损失函数，绕过命题固着——但这是近似，非精确表示
2. **神经符号混合架构：** 将精确推理交给符号层，神经层负责感知/学习（见 [neurosymbolic-ai-taxonomy](neurosymbolic-ai-taxonomy.md) Type 3–6）
3. **知识提取循环：** 让神经网络学习，再将学到的规律提取为符号描述，再用符号做精确推理

---

## 与其他概念的关联

- **[neurosymbolic-ai](neurosymbolic-ai.md)：** 命题固着是推动神经符号集成的核心理论动机之一
- **[constrained-decoding](constrained-decoding.md)：** 约束解码在形式上是对神经生成施加命题级符号约束，本质上是接受并补偿命题固着的工程策略
- **[ladder-of-causation](ladder-of-causation.md)：** 命题固着意味着纯神经系统难以超越因果之梯第一级（关联层）

---

## References

- d'Avila Garcez, A. & Lamb, L.C. (2023). Neurosymbolic AI: The 3rd Wave. *Artificial Intelligence Review*. [wikis/sources/2012.05876-neurosymbolic-ai-third-wave.md](../sources/2012.05876-neurosymbolic-ai-third-wave.md)
- McCarthy, J. (原始概念，多处引用于神经符号文献）
