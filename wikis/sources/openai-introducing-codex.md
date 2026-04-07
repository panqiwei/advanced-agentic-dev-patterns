# Introducing Codex

- **来源**: `sources/openai_official/introducing-codex.md`
- **URL**: https://openai.com/index/introducing-codex/
- **作者**: OpenAI

## 概述

Codex 产品发布公告。云端软件工程 agent，支持并行多任务，基于 codex-1（o3 针对软件工程的 RL 微调版）。每个任务在独立沙箱中运行，预装用户仓库。

## 关键特征

- **AGENTS.md 引导**：repository 内的文本文件指导 agent 如何导航代码库、运行测试、遵循项目规范
- **codex-1 模型**：通过 RL 在真实编码任务上训练，产出更接近人类风格的代码
- **可验证性**：通过 terminal logs、test outputs 提供操作证据链
- **安全设计**：不确定时明确沟通，用户需审查所有 agent 生成的代码

## 与其他概念的关联

- [Codex](../entities/codex.md) — 本文是产品发布公告
- [Harness engineering](../concepts/harness-engineering.md) — AGENTS.md 是 harness 知识的载体

## References

- `sources/openai_official/introducing-codex.md`
