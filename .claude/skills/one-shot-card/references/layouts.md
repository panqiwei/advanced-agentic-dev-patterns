# Layout Approaches

Six reference layouts. Each is a menu item, not a required template.
Pick the one that fits the content. If none do, compose your own.

All examples assume `layout: bleed` unless noted. Import primitives:

```mdx
import Band from '~/components/card/blocks/Band.astro';
import Kicker from '~/components/card/blocks/Kicker.astro';
import HeroHan from '~/components/card/blocks/HeroHan.astro';
import CoreDef from '~/components/card/blocks/CoreDef.astro';
import KV from '~/components/card/blocks/KV.astro';
import Formula from '~/components/card/blocks/Formula.astro';
import Quote from '~/components/card/blocks/Quote.astro';
```

---

## 1 · Hero-on-top

A signature SVG/diagram occupies the top 55-65% of the card. Below it,
a tan band with the core definition; then a smaller detail / refs band.

Good for: concepts that have a structural diagram (Causal DAG, Fractal,
Orthogonality).

```mdx
<Band tone="ink" dense>
  <Kicker>概念 · CAUSAL DAG</Kicker>
</Band>

<Band tone="paper-raised" grow>
  <h2 class="card-title">因果有向无环图</h2>
  <p class="card-subtitle">Causal DAG</p>
  <!-- large SVG showing the 3 node-topology cases here -->
  <svg viewBox="0 0 420 180" …>…</svg>
</Band>

<Band tone="tan">
  <CoreDef>条件化中间节点阻断链/叉；条件化对撞反而打开。</CoreDef>
</Band>

<Band tone="paper-sunk" dense>
  <Formula>P(Y | do(X)) = Σ<sub>z</sub> P(Y | X, Z=z) P(Z=z)</Formula>
</Band>

<Band tone="ink" dense>
  <!-- refs chips + source line -->
</Band>
```

---

## 2 · Dual-column split

Two equal-width columns comparing two things. Often with a common core
band above or below.

Good for: challenges vs strengths, symbol vs connectionist, before vs
after, two schools of thought.

```mdx
<Band tone="ink" dense>
  <Kicker>概念 · SYMBOL ↔ CONNECTIONIST</Kicker>
</Band>

<Band tone="paper-raised" dense>
  <h2 class="card-title">两种表征</h2>
  <p class="card-subtitle">离散符号 vs 连续向量</p>
</Band>

<Band tone="tan">
  <CoreDef>同一目标，两种地图——翻译的代价决定哪一种适合哪一类问题。</CoreDef>
</Band>

<Band tone="paper-raised" cols={2} grow>
  <div>
    <Kicker>SYMBOL</Kicker>
    <ul>…</ul>
  </div>
  <div>
    <Kicker>CONNECTIONIST</Kicker>
    <ul>…</ul>
  </div>
</Band>

<Band tone="ink" dense>…refs + source…</Band>
```

---

## 3 · Rule-stack

Sequential rules or steps presented as equal bands, optionally with
different tones to denote ordering (ink for the strongest / first,
paper-sunk for details).

Good for: do-calculus three rules, Ashby's requisite variety ladder,
onboarding steps.

```mdx
<Band tone="ink" dense>
  <Kicker>概念 · DO-CALCULUS</Kicker>
  <h2 class="card-title-on-ink">do 演算</h2>
  <p class="card-subtitle-on-ink">Pearl's three rules</p>
</Band>

<Band tone="paper-raised">
  <KV label="Rule 1">插入/删除观测 —— 若 Y ⊥ Z | X, W 在 G(X̄) 中成立</KV>
</Band>
<Band tone="paper-sunk">
  <KV label="Rule 2">动作 ↔ 观测 —— 若 Y ⊥ Z | X, W 在 G(X̄, Z̲) 中成立</KV>
</Band>
<Band tone="paper-raised">
  <KV label="Rule 3">插入/删除动作 —— 若 Y ⊥ Z | X, W 在 G(X̄, Z̄(W)) 中成立</KV>
</Band>

<Band tone="tan">
  <Formula>P(y | do(x)) = Σ<sub>z</sub> P(y | x, z) P(z)</Formula>
</Band>

<Band tone="ink" dense>…refs + source…</Band>
```

---

## 4 · Portrait-KV

A 2-column top region: left column a hero-han (一 or 两 or the person's
surname in Han), right column a KV stack of biographical facts. Below,
a caption band with the signature contribution.

Good for: entity cards (Judea Pearl, Herbert Simon, Karpathy).

```mdx
<Band tone="ink" cols={2} dense>
  <div>
    <Kicker>实体 · 图灵奖 2011</Kicker>
    <HeroHan size="lg">Pearl</HeroHan>
  </div>
  <div>
    <h2 class="card-title-on-ink">Judea Pearl</h2>
    <p class="card-subtitle-on-ink">因果革命的奠基者 · UCLA CS 教授</p>
  </div>
</Band>

<Band tone="paper-raised" grow>
  <KV label="生年">1936—</KV>
  <KV label="机构">UCLA Computer Science</KV>
  <KV label="图灵奖">2011 "因果与概率推理基础性贡献"</KV>
  <KV label="贡献">结构因果模型 · do 演算 · 因果之梯</KV>
</Band>

<Band tone="tan">
  <CoreDef>把因果推理从哲学思辨提升为可操作的数学学科。</CoreDef>
</Band>

<Band tone="ink" dense>…refs + source…</Band>
```

---

## 5 · Quote-hero + takeaways

A big tan band at the top contains a `<CoreDef>` with the source's
killer quote. Below, a paper-sunk band lists 2-3 numbered takeaways.

Good for: source cards (paper / blog / engineering doc digests).

```mdx
<Band tone="ink" dense>
  <Kicker>源头 · ANTHROPIC ENGINEERING · 2026</Kicker>
</Band>

<Band tone="paper-raised" dense>
  <h2 class="card-title">Effective Context Engineering for AI Agents</h2>
  <p class="card-subtitle">长时程 agent 的上下文工程总论</p>
</Band>

<Band tone="tan" grow>
  <CoreDef>注意力预算是稀缺资源 —— just-in-time / compaction / note-taking / sub-agent 是四种抵御 context rot 的工程手法。</CoreDef>
</Band>

<Band tone="paper-sunk" cols={2}>
  <div>
    <Kicker>① JUST-IN-TIME</Kicker>
    <p>按需注入，而非 upfront 堆砌。</p>
  </div>
  <div>
    <Kicker>② COMPACTION</Kicker>
    <p>旧轮次摘要化；保留结构，丢弃细节。</p>
  </div>
  <div>
    <Kicker>③ NOTE-TAKING</Kicker>
    <p>agent 自持外部笔记，跨 session 回忆。</p>
  </div>
  <div>
    <Kicker>④ SUB-AGENT</Kicker>
    <p>拆分长任务到多个独立上下文。</p>
  </div>
</Band>

<Band tone="ink" dense>…refs + source line…</Band>
```

---

## 6 · Band-rhythm (for chapter cards)

Four or five bands alternating tones, each carrying one big idea from
the chapter as a bold heading + one-line explanation.

Good for: mm chapter TL;DRs (control / entropy / fractal / causality /
symbols).

```mdx
<Band tone="ink" cols={2} dense>
  <div>
    <Kicker>篇 II · CYBERNETICS</Kicker>
    <HeroHan size="xl">舵</HeroHan>
  </div>
  <div>
    <h2 class="card-title-on-ink">控制论</h2>
    <p class="card-subtitle-on-ink">Helmsman · Feedback · Requisite Variety</p>
  </div>
</Band>

<Band tone="paper-raised">
  <Kicker>舵手</Kicker>
  <p>设定航向的是舵手不是舵；模型是舵，harness 是舵手。</p>
</Band>

<Band tone="paper-sunk">
  <Kicker>反馈</Kicker>
  <p>观测 → 误差 → 修正；没有反馈环的 agent 无法收敛。</p>
</Band>

<Band tone="tan">
  <Kicker>必要多样性 (Ashby)</Kicker>
  <p>控制器的复杂度必须不小于被控系统；越难的域需要越会 reason 的 agent。</p>
</Band>

<Band tone="ink" grow dense>
  <Kicker>二阶控制</Kicker>
  <p>当外界扰动超出一阶环的纠偏范围，让一阶目标本身变为变量。</p>
</Band>

<Band tone="paper-sunk" dense>…refs + source…</Band>
```

---

## CSS classes available to all layouts

The card title / subtitle typography you can use in any band:

```css
/* in global CSS / tokens — available everywhere */
.card-title            { font-family: var(--font-han-display); font-weight: 400; font-size: clamp(1.4rem, 2.4vw, 2rem); line-height: 1.2; letter-spacing: 0.03em; color: var(--ink); margin: 0 0 4px; }
.card-subtitle         { font-family: var(--font-latin); font-style: italic; font-size: 0.95rem; color: var(--ink-faint); margin: 0; }
.card-title-on-ink     { font-family: var(--font-han-display); font-weight: 400; font-size: clamp(1.4rem, 2.4vw, 2rem); line-height: 1.2; color: var(--paper); margin: 0 0 4px; }
.card-subtitle-on-ink  { font-family: var(--font-latin); font-style: italic; font-size: 0.95rem; color: color-mix(in oklab, var(--paper) 70%, transparent); margin: 0; }
```

If those classes aren't registered yet when you write your card, fall
back to inline styles or `<style>{`...`}</style>` blocks (MDX requires
CSS to be template-literal-wrapped to avoid JSX object-literal parsing).

## MDX gotchas

- `<style>` must wrap CSS in a JSX template literal to avoid the MDX
  parser treating `{ margin: ... }` as an object: `<style>{`.foo { margin: 0 }`}</style>`.
- JSX comments `{/* */}` CAN be used between top-level bands but tend to
  break inside deeply nested SVG. Strip them in SVG.
- When refs chips appear in a bleed card, write them manually in a
  paper-sunk or ink footer band. The shell's default `.oscard__foot` is
  NOT rendered in bleed mode.
