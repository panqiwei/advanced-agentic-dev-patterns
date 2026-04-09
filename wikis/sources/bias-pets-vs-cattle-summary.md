# The History of Pets vs Cattle

- **来源**: `sources/bias-pets-vs-cattle.md`
- **URL**: https://cloudscaling.com/blog/cloud-computing/the-history-of-pets-vs-cattle/
- **作者**: Randy Bias
- **发布**: 2016-09-19

## 摘要

Pets vs Cattle 类比的权威历史和规范定义。Bias 在 2011-2012 年将 Bill Baker 关于 SQL Server scale-up vs scale-out 的类比重新解读，强调核心区分是**可处置性**而非扩展方向：服务器是不可失去的唯一个体（宠物），还是可随时替换的群体成员（牲畜）。

文章纠正了一些常见误用（如 Kubernetes Pet Sets 将 Cassandra/Kafka 等 cattle 架构的数据存储称为"pet"），维护类比的精确性。

## 与其他 source 的关联

- [Managed Agents](anthropic-managed-agents.md) 将此模式从基础设施层引入 agent 架构——初始的单容器设计是"宠物"，brain-hands 解耦后每个组件变为"牲畜"
- 与 [Agent Sandboxing](../concepts/agent-sandboxing.md) 互补——cattle 化是安全隔离的前提

## References

- `sources/bias-pets-vs-cattle.md`
