# Fractal Architecture（Anton Telesh, 2016）

## 来源信息

- **标题**: Fractal Architecture
- **作者**: Anton Telesh
- **发布日期**: 2016-03-16
- **URL**: http://antontelesh.github.io/architecture/2016/03/16/fractal-architecture.html
- **本地路径**: `sources/fractal-architecture-cyclejs.md`

## 结构化摘要

这篇文章提出了"分形架构"（fractal architecture）的概念，用以描述一类在现代前端框架中反复出现的组件化模式。作者从 React、Angular、Elm、Cycle.js 等框架中提取共性，归纳出四条分形架构规则。

### 四条规则

1. **应用是由相同 API 的组件组成的树**——所有组件暴露统一接口
2. **每个组件可以包含（使用）其他组件**——组合是递归的
3. **顶层组件与其他组件无本质区别**——自相似性，根节点不享有特权
4. **胶水代码与应用逻辑分离**——引导/装配在组件体系之外完成

### 框架实例

| 框架 | 组件 API | 引导方式 |
|------|---------|---------|
| React/Angular | 类 XML 声明式组件 | bootstrap API（与组件 API 不同） |
| Elm | `init`/`update`/`view` 三函数 | `main` 函数传入根组件 |
| Cycle.js | 纯函数：接收 observables → 返回 observables | 单独的 wiring 层 |

### Redux 的反模式分析

文章指出 Redux 本身并无问题，但许多应用违反了分形架构原则：

- 组件直接依赖全局 store，而非通过参数注入
- 组件负责创建 store（本应是 singleton 的依赖）
- 没有定义清晰的模块边界和 API

修复方案：让每个 Redux 模块导出 `reducer` + `view`（统一 API），不负责 store 创建，通过参数访问自己的状态切片。引导代码在模块体系之外完成组装。

## 关键收获

1. **自相似性是可扩展架构的核心**：如果你理解一个组件的工作方式，你就理解了所有组件
2. **可组合性来自统一接口**：相同的 API 形状使任意组件可嵌入任意上下文
3. **引导与逻辑的分离**：这是分形架构能成立的前提——组件不知道自己是"根"还是"叶"
4. **每个子树都是有效的树**：任何子组件都可以独立提取为独立应用，便于重构、测试和复用

## 与 Wiki 其他概念的联系

- [分形架构](../concepts/fractal-architecture.md)——本文提出的核心模式
- [隐式循环架构](../concepts/implicit-loop-architecture.md)——Cycle.js 的纯函数组件与隐式循环的"行为由约束塑造"有结构呼应
- [Agent Skills](../concepts/agent-skills.md)——技能的可组合打包与分形架构的"统一 API + 递归组合"高度同构
- [Cycle.js](../entities/cycle-js.md)——本文的主要示例框架

## References

- Anton Telesh, "Fractal Architecture", 2016-03-16 — `sources/fractal-architecture-cyclejs.md`
