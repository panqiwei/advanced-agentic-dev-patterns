# 个例因果与类型因果（Token vs Type Causation）

## 定义

因果声称可以分为两大类：

- **个例因果**（Token Causation / Singular Causation / Actual Causation）：关于特定事件之间的因果关系。"这场干旱导致了这次饥荒。"
- **类型因果**（Type Causation / General Causation）：关于事件类型之间的因果关系。"疲劳驾驶导致车祸。"

这一区分进一步与**常量**（constants）和**变量**（variables）的区分交叉，形成四种因果声称的 2×2 矩阵。

## 两者关系的三种立场

### 1. 类型因果 = 个例因果的概括

Lewis (1973)、Hausman (1998, 2005) 持此立场。"吸烟导致癌症"只是说"个别吸烟史通常是个别癌症的个例原因"。这里的"通常"按泛称句（generics）理解——就像"蚊子携带西尼罗病毒"是真的，即使大多数蚊子并不携带。

### 2. 个例因果通过类型因果成立

Hume (1739-40, 1748)、Mill (1843)、Davidson (1967) 持此立场。这是[规则性理论](../concepts/regularity-theory.md)的自然推论：个例因果之所以成立，是因为存在涵盖它的更广泛规律或法则。Chris 的吸烟导致他的癌症，（至少部分）是因为吸烟导致癌症。

### 3. 两者独立

Eells (1991) 主张两者都不比另一个更基本，需要分别分析。他的论证：喝一夸脱钚*导致*死亡（类型因果为真），但从未有人真正喝过（不存在对应的个例因果），所以类型因果不可能是个例因果的概括。

## 无对应类型的个例因果

反过来的情况也存在。Scriven (1962)：你伸手拿烟时打翻墨水瓶弄脏地毯——个例因果为真，但"伸手拿烟导致地毯染色"作为类型因果不成立。Suppes/Rosen 的高尔夫球例子：球击中树后反弹入洞——个例因果，但"击中树导致一杆进洞"不是普遍规律。

## 净效应与分量效应

类型因果还需要区分净效应和分量效应（Hitchcock 2001b）。避孕药对血栓的净效应可以为零（直接促进 + 通过预防怀孕间接抑制），但沿特定路径的分量效应仍然存在。详见[概率因果](../concepts/probabilistic-causation.md)。

## 与影响（Influence）的区分

源文章还区分了因果（causation，常量之间的关系）和影响（influence，变量之间的关系），形成完整的 2×2 分类：

|  | 个例（Tokens） | 类型（Types） |
|---|---|---|
| **常量（Constants）** | 个例因果 | 类型因果 |
| **变量（Variables）** | 个例影响 | 类型影响 |

变量间的影响关系由[因果模型](../concepts/causal-models.md)（结构方程模型）编码。

## References

- Stanford Encyclopedia of Philosophy, "The Metaphysics of Causation", `sources/sep-causation-metaphysics.md`
