# I-JEPA: Image Joint Embedding Predictive Architecture

- **来源**: `sources/meta-i-jepa.md`
- **URL**: https://ai.meta.com/blog/yann-lecun-ai-model-i-jepa/
- **作者**: Meta AI
- **发布**: 2023

## 摘要

Meta AI 发布 I-JEPA（Image Joint Embedding Predictive Architecture），被描述为"基于 LeCun 愿景的首个 AI 模型"。核心思想：通过预测图像区域的高层表征（而非像素值）来学习，构建"原始世界模型"。

## 核心创新

- **自监督学习**：预测被遮挡图像区域的抽象表征，而非重建像素。假说：人类通过被动观察学习大量背景知识。
- **多块遮挡策略**：预测包含有意义信息的大块区域，引导语义级别的学习。
- **表征空间而非像素空间**：避免生成式方法"过度关注无关细节"的问题。

## 效率

- 632M 参数 ViT，16 A100 GPU 训练不到 72 小时
- 仅 12 个标注样本/类即达 ImageNet low-shot SOTA
- GPU 时间比同类方法少 2-10 倍

## 与世界模型的关系

I-JEPA 是 [world models](introl-world-models-race-2026.md) 赛道的理论基础之一——LeCun 的 AMI Labs 正是在此架构上构建其世界模型愿景。预测器充当"原始世界模型"，在语义级别捕获空间不确定性。

## 未来方向

研究者计划将 JEPA 方法扩展到视频、图文对等更丰富模态——指向通用世界建模。

## References

- `sources/meta-i-jepa.md`
