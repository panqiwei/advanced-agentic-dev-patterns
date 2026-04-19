# Wes Gurnee

**机构：** 麻省理工学院（MIT）
**研究方向：** LLM 可解释性、神经网络内部表征、稀疏探针

## 主要贡献

Wes Gurnee 是 LLM 可解释性领域的核心研究者之一。

### Language Models Represent Space and Time（2023）

与 [Max Tegmark](max-tegmark.md) 合作，发表于 ICLR 2024。首次系统证明 Llama-2 在内部形成了真实世界地理坐标和历史时间坐标的线性表征，并定位了个体"空间神经元"和"时间神经元"。

详见：[时空世界模型](../concepts/spatiotemporal-world-model.md)，[线性表征假说](../concepts/linear-representation-hypothesis.md)

### Finding Neurons in a Haystack（2023）

提出稀疏探针方法，通过极少数神经元定位模型内部编码的特定信息（如性别、职业、年份）。

## 研究风格

倾向于构建大规模实证数据集，结合线性探针与因果干预进行系统验证，而非理论先行。代表性方法：构建 6 个时空数据集（累计 >18 万样本）+ 全层探针扫描 + 神经元消融验证。

## References

- `sources/arxiv_papers/2310.02207-language-models-represent-space-and-time.md`
