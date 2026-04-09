# The Bitter Lesson

- **来源**: `sources/sutton-bitter-lesson.md`
- **URL**: http://www.incompleteideas.net/IncIdeas/BitterLesson.html
- **作者**: Rich Sutton
- **发布**: 2019-03-13

## 摘要

Rich Sutton 的标志性短文。核心论点：70 年 AI 研究的最大教训是，利用通用计算的方法最终总是以巨大优势胜出。研究者反复犯同样的错误——试图将人类领域知识内建到系统中。这在短期内有效且令研究者满足，但长期来看会停滞甚至阻碍进展。突破最终来自于相反的方法——通过搜索和学习来扩展计算。

## 关键要点

1. **模式反复出现**：国际象棋（1997 深度搜索胜 Kasparov）、围棋（AlphaGo 自我对弈学习）、语音识别（HMM/深度学习胜手工特征）、计算机视觉（CNN 胜手工边缘检测）——每个领域都经历了同样的"人类知识方法短期有效但最终被计算方法压倒"的循环
2. **两类可无限扩展的方法**：搜索和学习。只有这两类方法能随计算资源增长持续提升
3. **不要内建发现，要内建发现过程**：心智内容是不可还原地复杂的，不应试图建模。应建入能找到和捕捉复杂性的元方法

## 与其他 source 的关联

- [Managed Agents](anthropic-managed-agents.md) 直接引用 Bitter Lesson 来论证 harness 假设会过时——harness 中内建的"模型做不到什么"的知识就是 Sutton 批评的"领域知识内建"
- [Harness Engineering](../concepts/harness-engineering.md) 中"What Can I Stop Doing?"原则是 Bitter Lesson 在 agent 工程中的具体体现
- [Harnessing Claude's Intelligence](anthropic-harnessing-claudes-intelligence.md) 中三大模式（用已知工具、持续剥离假设、谨慎设边界）直接实践 Bitter Lesson

## References

- `sources/sutton-bitter-lesson.md`
