# Beyond pass@1: A Reliability Science Framework for Long-Horizon LLM Agents

## 元信息

- **论文**: Beyond pass@1: A Reliability Science Framework for Long-Horizon LLM Agents
- **作者**: Aaditya Khanal, Yangyang Tao, Junxiu Zhou (Northern Kentucky University)
- **发表**: arXiv 2603.29231, 2026-03-31
- **源文件**: `sources/arxiv_papers/2603.29231-beyond-pass-at-1-reliability-science-framework.md`
- **ljg-paper 分析**: `wikis/sources/beyond-pass-at-1-reliability-framework.org`

## 核心问题

现有 agent 基准只报告 pass@1（单次尝试成功率），在短原子任务上评测。这衡量的是**能力**（capability），不是**可靠性**（reliability）。生产部署需要的是：在不同时长、不同领域的任务上反复运行，模型能否一致地成功。

## 框架：四个指标

论文提出了四个互补的可靠性指标，形成多维评估框架：

### RDC（可靠性衰减曲线）

将 pass^k（k 次重复全部成功的概率）画成任务时长的函数。曲线越平越好——可靠性不随任务变长而衰减。用线性回归斜率 RDS 做标量摘要。

### VAF（方差放大因子）

长任务 pass@1 的方差除以短任务 pass@1 的方差。**反直觉发现**：高 VAF 是能力标志而非不稳定标志。前沿模型 VAF >= 2.37（有时成功有时失败），弱模型 VAF < 1.26（稳定地失败，所以方差小）。

### GDS（优雅退化评分）

部分完成的加权评分（0-1），用任务子步骤的关键性权重加权。在长任务上 pass@1 接近零时，GDS 仍能区分模型质量。GDS 和 pass@1 的差距随任务时长增大——二进制评估丢掉的信息越来越多。

### MOP（熔断起始点）

通过滑动窗口（w=5）内工具调用分布的信息熵检测行为崩溃。熵突然飙升 = agent 进入无序状态（反复调用、自相矛盾、幻觉工具输出）。

## 实验设计

- **任务**: 396 个任务，3 领域 (SE/WR/DP) x 4 时长档 (short/medium/long/very-long)，每格 33 个
- **模型**: 10 个开源模型（DeepSeek V3、Kimi K2.5、MiniMax M2.5、GLM-4.5 Air、Qwen3 32B/30B、Llama 3.3 70B/3.1 8B、Mistral 24B/Nemo）
- **规模**: 23,392 个 episode（k=3 重复，两种脚手架 ReAct + Memory）
- **成本**: ~$80-120 总计

## 核心发现

### 1. 可靠性普遍超线性衰减

平均 pass@1 从短任务 76.3% 降到超长任务 52.1%。衰减速度超过独立错误假设下的几何衰减——错误正相关（犯错后倾向继续犯错）。

### 2. 领域决定衰减速度

SE（代码编辑）最惨：GDS 从 0.90 掉到 0.44。DP（文档处理）几乎不掉：0.74 到 0.71。人类估计的任务时长和 agent 实际复杂度正交——DP 长任务人要做 45 分钟，agent 只需 4-8 步。

### 3. VAF 二分为能力标志

前四名 VAF >= 2.37，后六名 VAF <= 1.26。高方差 = 有时能完成长任务 = 有能力。低方差 = 稳定失败。

### 4. 能力排名 != 可靠性排名

GLM-4.5 Air 短任务第一（94.9%），超长任务掉到第四（66.7%）。Llama 3.3 70B 短任务第五六，超长任务升到第三四。按短任务选模型会选错。

### 5. MOP 悖论：前沿模型熔断率最高

DeepSeek V3 超长任务 19% 熔断，MiniMax M2.5 13%。弱模型几乎不熔断。原因：强模型尝试激进多步策略，成功时 GDS 高，失败时螺旋。

### 6. 记忆脚手架全线失败

Memory scaffold 在长任务上：6 个模型变差，4 个中性，0 个改善。便签本占步数、占 context，长任务上代价超过收益。

## 实践启示

- **模型选择**：不要按短任务 pass@1 选模型，要测 RDC 在目标时长档的表现
- **任务分解**：RDC 斜率越陡，拆解长任务为短任务的收益越大（Qwen3 30B 可获 41.5pp 增益）
- **MOP 检测**：检测到熔断信号应触发 context reset 而非终止——保存进度、重置 context、从检查点继续
- **记忆设计**：不要默认启用 episodic memory，需要校准 overhead-vs-benefit 后再决定

## 与现有知识的联系

- [长时运行 agent](../concepts/long-running-agents.md) — 论文量化了长时运行的可靠性代价，验证了 context reset 策略的价值
- [Harness engineering](../concepts/harness-engineering.md) — MOP 检测可嵌入 harness 监控层；任务分解决策可量化
- [Context management](../concepts/context-management.md) — 记忆脚手架的失败与 context 开销直接相关
- [Guardrails](../concepts/guardrails.md) — MOP 可作为运行时 guardrail 的熵检测层
- [可靠性衰减](../concepts/reliability-decay.md) — 本论文定义的核心概念：pass^k 随任务时长的超线性衰减
- [Agent 可靠性评估](../concepts/agent-reliability-evaluation.md) — 四指标框架（RDC、VAF、GDS、MOP）
- [ReliabilityBench](reliabilitybench.md) — 论文引用的先行工作（arXiv 2601.06112）

## References

- `sources/arxiv_papers/2603.29231-beyond-pass-at-1-reliability-science-framework.md`
