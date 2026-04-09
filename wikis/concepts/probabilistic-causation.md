# 概率因果（Probabilistic Causation）

## 定义

概率因果理论主张因果关系的核心在于概率提升：C 是 E 的原因，当且仅当 C 提高了 E 的概率。这一框架允许因果关系在不确定性的世界中运作，不要求原因必然导致结果。

## 核心思想

概率因果的基本直觉是：原因使结果"更可能发生"。形式上：

$$P(E \mid C) > P(E \mid \neg C)$$

Suppes (1970) 在 *A Probabilistic Theory of Causality* 中给出了早期系统化理论。Eells (1991) 在 *Probabilistic Causality* 中发展了更精细的版本，分别处理类型因果和个例因果。

### Eells 的独立性论证

Eells 认为[类型因果和个例因果](../concepts/token-vs-type-causation.md)都不比另一个更基本——两者需要独立的分析。他的论证：喝一夸脱钚导致死亡，即使从未有人真正喝过——所以这个类型因果声称不可能是个例因果声称的概括。

### 净效应与分量效应

Hitchcock (2001b) 区分了两种因果效应：

- **净效应**（Net Effect）：考虑所有路径后的总体效果
- **分量效应/路径特异效应**（Component/Path-Specific Effect）：沿特定因果路径的效果

经典案例来自 Hesslow (1976)：避孕药直接促进血栓（$B \to T$），但也预防怀孕（$B \to \neg P$），而怀孕本身促进血栓（$P \to T$）。调整概率后，避孕药对血栓的*净效应*可以为零，但沿 $B \to T$ 路径的*分量效应*仍是正面的。

## 面临的挑战

- **[先占](../concepts/preemption.md)**：在先占案例中，原因可能不提高结果的概率（因为备用原因的存在），但直觉上仍是原因
- **概率降低的原因**：Schaffer (2000b) 举出原因降低结果概率但仍是原因的案例——高尔夫球击中树反弹入洞，击中树降低了一杆进洞的概率
- **Simpson 悖论**：在不同子群体中，概率提升的方向可以逆转，需要控制适当的背景变量

## 与因果模型的关系

概率因果可以在[因果模型](../concepts/causal-models.md)框架中精确表达。非确定性的变量间影响关系可以用带随机误差的结构方程模型或因果图配对概率分布来表示。Hitchcock (1993, 1995a, 1996) 发展了对比性概率因果理论，其中因果是三元关系："c 而非 c* 是 e 的原因"。

## 与其他因果理论的关系

- [反事实理论](../concepts/counterfactual-theory.md)：概率因果和反事实理论都关注"差异制造"（difference-making），但概率因果用概率提升替代反事实依赖
- [规则性理论](../concepts/regularity-theory.md)：概率因果放松了规则性理论的恒常连接要求——原因不必*总是*伴随结果
- [过程理论](../concepts/process-theories.md)：Schaffer (2001) 尝试结合概率提升和过程连接——原因是"提升过程概率的事件"

## References

- Stanford Encyclopedia of Philosophy, "The Metaphysics of Causation", `sources/sep-causation-metaphysics.md`
- Eells, Ellery, 1991, *Probabilistic Causality*, Cambridge University Press
- Suppes, Patrick, 1970, *A Probabilistic Theory of Causality*, North Holland
- Hitchcock, Christopher, 2001b, "A Tale of Two Effects", *Philosophical Review*
