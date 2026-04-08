# Cycle.js

## 概述

Cycle.js 是一个基于响应式编程的 JavaScript 框架，由 André Staltz 创建。其核心设计理念是将应用视为纯函数：接收外部世界的输入（sources，observables 形式），返回对外部世界的输出（sinks，也是 observables）。

## 架构特征

Cycle.js 是[分形架构](../concepts/fractal-architecture.md)的典型实现：

- **统一接口**：每个组件都是 `sources → sinks` 的纯函数，与整个应用的签名相同
- **递归组合**：组件内部可以调用其他组件，如同函数调用其他函数
- **无副作用组件**：副作用被推到框架的 driver 层（胶水与逻辑分离的体现）
- **引导分离**：组件的 wiring 在组件声明之外完成

## 与 Agent 系统的关联

Cycle.js 的"纯函数接收 observables、返回 observables"模式与[隐式循环架构](../concepts/implicit-loop-architecture.md)有结构上的相似性——两者都通过约束（而非预设路径）塑造行为。Agent 接收 context，产出 actions，由 harness 处理副作用——这与 Cycle.js 将副作用推到 driver 层的设计同构。

## References

- Anton Telesh, "Fractal Architecture", 2016-03-16 — `sources/fractal-architecture-cyclejs.md`
