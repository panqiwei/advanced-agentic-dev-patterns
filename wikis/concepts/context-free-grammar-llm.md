# 上下文无关文法在 LLM 中的应用（CFG for LLM）

## 定义

上下文无关文法（Context-Free Grammar，CFG）是形式语言理论中的一种语法描述框架，由一组产生式规则（production rules）定义，每条规则的左侧只有一个非终结符。CFG 能够表达比正则语言更复杂的结构——包括嵌套和递归。

在 LLM 领域，CFG 被用作将 JSON Schema 等结构化格式的语法规则编译为可在推理时执行的约束。

## 形式语言背景

乔姆斯基层级（Chomsky Hierarchy）中，语言由强到弱分为：

```
正则语言（Regular）⊂ 上下文无关语言（Context-Free）⊂ 上下文相关语言（Context-Sensitive）⊂ 递归可枚举语言
```

- **正则语言**：有限状态机（FSM）可识别，无法处理嵌套
- **上下文无关语言**：下推自动机（PDA）可识别，能处理一层嵌套/递归
- JSON 和 JSON Schema 属于上下文无关语言

这一理论区别对 LLM 约束解码有实际影响：FSM 无法原生处理递归 JSON 结构，而 CFG 可以。

## 在结构化输出中的工作流

```
JSON Schema
    ↓ 编译
上下文无关文法（CFG）
    ↓ 预处理 + 缓存
采样时可查询的制品（artifact）
    ↓ 推理时
每步采样：已生成序列 + CFG → 合法 next token 集合 → Token Masking
```

### 关键步骤

1. **Schema → CFG**：将 JSON Schema 的类型规则（object/array/string/number 等）和约束（required/enum/additionalProperties 等）转换为 CFG 产生式

2. **预处理 + 缓存**：首次请求时，对 CFG 做预计算（构建查找结构），生成在采样中可高效查询的制品。这导致**首次请求延迟**（通常 <10 秒，复杂 schema 可达 1 分钟）。后续使用相同 schema 的请求直接复用缓存，无额外延迟。

3. **动态约束**：推理时，每生成一个 token，根据当前已生成序列更新 CFG 解析状态，查询合法 next token 集合。

4. **Token Masking**：将非法 token 的 logit（采样前的原始分数）置为负无穷，使其采样概率为 0。合法 token 的相对分布不变。

## 递归结构的处理

CFG 相对 FSM 的核心优势在于递归：

```json
{
  "type": "object",
  "properties": {
    "type": { "enum": ["div", "button"] },
    "children": {
      "type": "array",
      "items": { "$ref": "#" }
    }
  }
}
```

上述 schema 描述的是递归 UI 树结构（children 引用了自身）。FSM 无法表达此类结构，需要引入最大深度限制等变通。CFG 的递归产生式天然支持这类 schema。

## 与 LLM 符号主义/联结主义的关系

CFG 是形式语言理论的工具，属于符号主义传统（明确规则 + 精确推导）。将其编译到 LLM 推理路径上，实现的是：

> **在神经网络的概率选择空间上叠加符号规则的硬约束**

模型的参数不变，改变的是采样时的"搜索空间"。这是 ch-07 符号主义 vs 联结主义讨论中一个具体的工程化交汇点：两者不是零和竞争，而是可以在架构层互补——神经网络贡献语义理解和灵活性，符号系统贡献形式保证和可验证性。

## 开源实现

- **lark**：通用 Python CFG 解析库，被多个约束解码系统使用
- **outlines**（dottxt-ai）：基于 CFG/FSM 的约束解码主流开源库
- **llama.cpp 的 grammar 支持**：使用 BNF 文法直接约束本地模型采样

## 相关概念

- [约束解码](constrained-decoding.md) — CFG 的应用场景
- [结构化输出](structured-outputs.md) — CFG 编译技术在 API 中的产品化
- [ACI](aci.md) — 形式化接口契约
- [Tool design](tool-design.md) — schema 作为工具参数的规范描述

## References

- `sources/openai_official/introducing-structured-outputs-in-the-api.md`
