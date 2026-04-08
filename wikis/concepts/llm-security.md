# LLM Security（LLM 安全）

## 定义

大型语言模型作为新兴计算范式面临的特有安全挑战。[Karpathy](../entities/andrej-karpathy.md) 在 [2023 年演讲](../sources/karpathy-intro-to-large-language-models.md) 中将其类比为传统操作系统安全问题的翻版——新的计算栈必然带来新的攻击面。

## 三大攻击类型

### 1. 越狱 (Jailbreak)

绕过模型安全对齐，使其生成本应拒绝的内容。

**攻击手法**：
- **角色扮演**：让模型扮演"不受限制的 AI"或特定角色（祖母讲 Napalm 配方）
- **编码绕过**：用 base64 等编码方式提交有害请求——安全训练数据多为英文，模型在其他"语言"（包括编码格式）上的拒绝能力较弱
- **通用对抗后缀**：通过优化搜索到一个可附加到任意 prompt 的后缀，自动越狱模型。修补特定后缀后可重新优化出新的
- **对抗性图像**：精心设计的噪声图案附加到图像上，肉眼不可见但对模型构成越狱指令

核心难点：安全对齐本质上是在高维空间中划定"拒绝边界"，而攻击者可以从无数方向绕过这个边界。

### 2. 提示注入 (Prompt Injection)

劫持模型的指令流——让模型将数据中嵌入的文本误认为新的用户指令。

**攻击场景**：
- 图像中隐藏白色文本指令（人眼不可见，模型可读取）
- 网页中嵌入劫持文本，通过 Bing 搜索触达模型（钓鱼链接注入）
- Google Docs 中嵌入指令，通过 Bard 读取文档触发数据窃取

核心难点：模型无法可靠区分"用户指令"和"数据中包含的类似指令的文本"。

### 3. 数据投毒 (Data Poisoning / Backdoor)

在训练数据中植入触发模式，使模型在遇到特定触发词时行为异常。

Karpathy 引用的研究中，触发词"James Bond"被植入微调数据，导致模型在遇到该词时预测崩溃（标题生成输出无意义单字符、威胁检测判断失效）。类似"满洲候选人"——潜伏的后门在特定信号激活时发作。

## 与传统安全的对应

| 传统 OS 安全 | LLM 安全对应 | 类比本质 |
|-------------|-------------|---------|
| 缓冲区溢出 | Jailbreak | 突破执行边界 |
| 代码注入 (SQL injection) | Prompt injection | 数据被当作指令执行 |
| 供应链攻击 | Data poisoning | 信任链上游被污染 |
| 杀毒软件/防火墙 | [Guardrails](guardrails.md) | 运行时检测与防御 |

## 安全作为持续博弈

Karpathy 强调这是一场"猫鼠游戏"——每种攻击都有对应的防御，但防御修补后攻击者会找到新的路径。这与传统信息安全的攻防动态完全一致。

## 与 Wiki 已有概念的关系

- [Guardrails](guardrails.md) — 防御侧的运行时安全机制，与这里描述的攻击侧互补
- [LLM-OS Analogy](llm-os-analogy.md) — Karpathy 明确将 LLM 安全挑战类比为 OS 安全挑战
- [Harness Engineering](harness-engineering.md) — harness 的权限控制和沙箱执行是防御 prompt injection 的工程手段

## References

- `sources/karpathy-intro-to-large-language-models.md`
