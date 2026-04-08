# 分形维数（Fractal Dimension）

## 定义

分形维数是对欧氏整数维度的扩展，用来量化不规则几何对象的"空间填充程度"。一条完全光滑的线是 1 维的，一个平面是 2 维的；海岸线、雪花曲线等分形对象的维数落在 1 和 2 之间，表示它比线复杂但又没有填满平面。

## 直觉理解

想象你用边长为 $\varepsilon$ 的方格覆盖一个几何对象：
- 一条直线段：方格数 $\propto \varepsilon^{-1}$（维数 = 1）
- 一个正方形面：方格数 $\propto \varepsilon^{-2}$（维数 = 2）
- 英国海岸线：方格数 $\propto \varepsilon^{-1.25}$（维数 $\approx$ 1.25）

分形维数 $D$ 正是这个指数。$D$ 越大，对象在缩小测量尺度时"生长"出的细节越多。

## Hausdorff 维数与 Minkowski-Bouligand 维数

分形维数有多种严格定义：

- **Hausdorff 维数**：基于最优覆盖集的测度理论定义，是最基本的分形维数概念。[Mandelbrot](../entities/benoit-mandelbrot.md) 在 1967 年论文中将 Richardson 的经验参数 $D$ 识别为 Hausdorff 维数的非整数形式
- **Minkowski-Bouligand 维数**（盒计数维数）：基于固定尺寸方格覆盖的计数，计算上更易操作，是实际测量中最常用的近似

两者在数学上不完全等价，但对于自然界中遇到的大多数分形对象，它们给出相同的值。

## Richardson 公式中的角色

在 [Richardson 效应](richardson-effect.md) 的数学表述中：

$$L(\varepsilon) \sim F \varepsilon^{1-D}$$

$D$ 直接决定了长度随测量精度增加的发散速率：
- $D = 1$：光滑曲线，$L$ 与 $\varepsilon$ 无关，收敛到确定值
- $D = 1.02$：南非海岸，几乎光滑，$L$ 随 $\varepsilon$ 减小缓慢增长
- $D = 1.25$：英国西海岸，$L$ 随 $\varepsilon$ 减小显著增长
- $D = 2$：Peano 曲线，完全填充平面

## 自然界中的分形维数

| 对象 | 近似分形维数 |
|------|-------------|
| 南非海岸线 | ~1.02 |
| 英国西海岸 | ~1.25 |
| 湖泊岸线（典型值）| ~1.28 |
| Koch 雪花 | ~1.26 |
| Sierpinski 曲线 | 依阶数变化 |

## 相关概念

- [海岸线悖论](coastline-paradox.md) — 分形维数概念诞生的直接背景
- [Richardson 效应](richardson-effect.md) — 分形维数在测量中的经验表现
- [统计自相似性](statistical-self-similarity.md) — 自然分形具有分形维数的结构基础

## References

- `sources/wikipedia-coastline-paradox.md`
