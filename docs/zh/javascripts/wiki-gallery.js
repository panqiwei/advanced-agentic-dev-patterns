/**
 * Wiki Gallery v2 — Observatory
 * Dynamic card sizing, persistent click tracking,
 * attention-weighted layout with heat bars and gacha.
 */
;(function () {
  "use strict"

  var STORAGE_KEY = "wiki_gallery_clicks"
  var HEAT_W = 0.7
  var FRESH_W = 0.3
  var BATCH_SIZE = 24 // cards revealed per infinite-scroll batch

  /* ── persistence ─────────────────────────────────────────── */

  function getClicks() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") }
    catch (e) { return {} }
  }

  function bumpClick(slug) {
    var c = getClicks()
    c[slug] = (c[slug] || 0) + 1
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c))
  }

  /* ── scoring ─────────────────────────────────────────────── */

  function scoreCards(cards) {
    var clicks = getClicks()
    var maxC = 0
    cards.forEach(function (el) {
      var v = clicks[el.dataset.slug] || 0
      if (v > maxC) maxC = v
    })
    if (maxC === 0) maxC = 1

    var mtimes = []
    cards.forEach(function (el) { mtimes.push(+(el.dataset.mtime) || 0) })
    var minT = Math.min.apply(null, mtimes)
    var maxT = Math.max.apply(null, mtimes)
    var rangeT = maxT - minT || 1

    var result = []
    cards.forEach(function (el) {
      var slug = el.dataset.slug
      var c = clicks[slug] || 0
      var cn = c / maxC
      var fn = ((+(el.dataset.mtime)) - minT) / rangeT
      // When no clicks exist, use freshness + content-length heuristic
      var descLen = (el.querySelector(".wg-card-desc") || {}).textContent || ""
      var lenBonus = Math.min(descLen.length / 150, 0.3) // longer desc = slightly bigger
      var sc = maxC > 1
        ? HEAT_W * cn + FRESH_W * fn
        : FRESH_W * fn + 0.4 * lenBonus + 0.3 * Math.random()
      result.push({ el: el, score: sc, clicks: c })
    })
    return result
  }

  /* ── sizing ──────────────────────────────────────────────── */

  function assignSizes(scored) {
    var sorted = scored.slice().sort(function (a, b) { return b.score - a.score })
    var n = sorted.length
    // Buckets: 1 featured, ~8% large, ~35% medium, rest small
    var lgCut = Math.max(2, Math.ceil(n * 0.08))
    var mdCut = Math.ceil(n * 0.45)

    sorted.forEach(function (item, i) {
      item.el.classList.remove("wg-featured", "wg-lg", "wg-md", "wg-sm")
      if (i === 0) {
        item.el.classList.add("wg-featured")
      } else if (i <= lgCut) {
        item.el.classList.add("wg-lg")
      } else if (i <= mdCut) {
        item.el.classList.add("wg-md")
      } else {
        item.el.classList.add("wg-sm")
      }
    })
  }

  /* ── shuffled layout (size from score, position random) ──── */

  function shuffleCards(scored, grid) {
    // Fisher-Yates shuffle — position is fully random
    var arr = scored.slice()
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1))
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp
    }
    arr.forEach(function (item) { grid.appendChild(item.el) })
  }

  /* ── heat bars ───────────────────────────────────────────── */

  function renderHeatBars(scored) {
    var maxC = 0
    scored.forEach(function (s) { if (s.clicks > maxC) maxC = s.clicks })
    if (maxC === 0) maxC = 1

    scored.forEach(function (item) {
      var fill = item.el.querySelector(".wg-heat-fill")
      if (!fill) return
      var pct = Math.round((item.clicks / maxC) * 100)
      // Use requestAnimationFrame for smooth entrance
      requestAnimationFrame(function () {
        fill.style.width = pct + "%"
      })
    })
  }

  /* ── build card DOM from data attributes ─────────────────── */
  // MkDocs' Python-Markdown strips nested divs unpredictably, so the
  // static HTML is kept flat (spans only). JS builds the full structure:
  //   <a class="wg-card wg-flippable" data-card-img="...">
  //     <div class="wg-card-front"> ... spans ... </div>
  //     <div class="wg-card-back" style="background-image:url(...)"></div>
  //   </a>

  function buildCardDom(grid) {
    grid.querySelectorAll(".wg-card").forEach(function (card) {
      // Wrap existing span children into .wg-card-front
      var front = document.createElement("div")
      front.className = "wg-card-front"
      while (card.firstChild) {
        front.appendChild(card.firstChild)
      }
      card.appendChild(front)

      // If card has an image, create back div + set front bg + add flippable
      var imgUrl = card.getAttribute("data-card-img")
      if (imgUrl) {
        card.classList.add("wg-flippable")
        front.style.backgroundImage = "url('" + imgUrl + "')"

        var back = document.createElement("div")
        back.className = "wg-card-back"
        back.style.backgroundImage = "url('" + imgUrl + "')"
        card.appendChild(back)
      }
    })
  }

  /* ── stagger ─────────────────────────────────────────────── */

  function stagger(grid) {
    var cards = grid.querySelectorAll(".wg-card")
    cards.forEach(function (card, i) {
      card.style.animationDelay = Math.min(i * 40, 800) + "ms"
    })
  }

  /* ── filter ──────────────────────────────────────────────── */

  function setupFilters(grid) {
    var btns = document.querySelectorAll(".wg-filter-btn")
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        btns.forEach(function (b) { b.classList.remove("active") })
        btn.classList.add("active")
        var f = btn.dataset.filter
        grid.querySelectorAll(".wg-card").forEach(function (card) {
          card.style.display = (f === "all" || card.dataset.section === f) ? "" : "none"
        })
      })
    })
  }

  /* ── infinite scroll (batch reveal) ──────────────────────── */

  function setupInfiniteScroll(grid) {
    var allCards = Array.prototype.slice.call(grid.querySelectorAll(".wg-card"))
    var total = allCards.length
    if (total <= BATCH_SIZE) return // all visible, no need

    // Hide cards beyond initial batch
    var revealed = BATCH_SIZE
    allCards.forEach(function (card, i) {
      if (i >= BATCH_SIZE) {
        card.style.display = "none"
        card.classList.add("wg-deferred")
      }
    })

    // Create sentinel element at bottom of grid
    var sentinel = document.createElement("div")
    sentinel.className = "wg-sentinel"
    grid.parentNode.insertBefore(sentinel, grid.nextSibling)

    // Counter display
    var counter = document.createElement("div")
    counter.className = "wg-load-counter"
    counter.textContent = "已显示 " + Math.min(revealed, total) + " / " + total
    grid.parentNode.insertBefore(counter, sentinel)

    function revealBatch() {
      var end = Math.min(revealed + BATCH_SIZE, total)
      for (var i = revealed; i < end; i++) {
        allCards[i].style.display = ""
        allCards[i].classList.remove("wg-deferred")
        // Stagger entrance for newly revealed cards
        allCards[i].style.animationDelay = Math.min((i - revealed) * 40, 800) + "ms"
      }
      revealed = end
      counter.textContent = "已显示 " + revealed + " / " + total

      if (revealed >= total) {
        observer.disconnect()
        sentinel.remove()
        counter.remove()
      }
    }

    var observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && revealed < total) {
        revealBatch()
      }
    }, { rootMargin: "200px" }) // trigger 200px before reaching bottom

    observer.observe(sentinel)
  }

  /* ── page-visit tracking (runs on concept/entity pages) ──── */

  function trackPageVisit() {
    // Detect if we're on a concept or entity page (not gallery index)
    var path = window.location.pathname
    var match = path.match(/\/wiki\/(concepts|entities)\/([^/]+)/)
    if (!match) return
    var slug = match[2]
    // Atomic bump — read-modify-write in one sync block
    bumpClick(slug)
  }

  /* ── gacha ───────────────────────────────────────────────── */

  function setupGacha() {
    var btn = document.querySelector(".wg-gacha-btn")
    var overlay = document.querySelector(".wg-gacha-overlay")
    if (!btn || !overlay) return

    var gCard = overlay.querySelector(".wg-gacha-card")
    var titleEl = gCard.querySelector(".wg-card-title")
    var descEl = gCard.querySelector(".wg-card-desc")
    var badgeEl = gCard.querySelector(".wg-card-badge")
    var goBtn = overlay.querySelector(".wg-gacha-go")
    var againBtn = overlay.querySelector(".wg-gacha-again")
    var closeBtn = overlay.querySelector(".wg-gacha-close")

    var pool = Array.prototype.slice.call(document.querySelectorAll(".wg-card"))

    function draw() {
      if (!pool.length) return
      var card = pool[Math.floor(Math.random() * pool.length)]
      var slug = card.dataset.slug
      var section = card.dataset.section

      titleEl.textContent = card.querySelector(".wg-card-title").textContent
      descEl.textContent = card.querySelector(".wg-card-desc").textContent
      badgeEl.textContent = section === "concepts" ? "概念" : "实体"
      gCard.setAttribute("data-section", section)
      goBtn.setAttribute("href", card.getAttribute("href"))

      // Animate in
      gCard.style.transform = "rotateY(90deg) scale(0.7)"
      overlay.classList.add("open")
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          gCard.style.transform = ""
        })
      })
    }

    function close() { overlay.classList.remove("open") }

    btn.addEventListener("click", draw)
    againBtn.addEventListener("click", function () {
      gCard.style.transform = "rotateY(-90deg) scale(0.7)"
      setTimeout(draw, 280)
    })
    closeBtn.addEventListener("click", close)
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close()
    })
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("open")) close()
    })
  }

  /* ── init ────────────────────────────────────────────────── */

  function init() {
    // Close any leftover gacha overlay from instant navigation
    var staleOverlay = document.querySelector(".wg-gacha-overlay.open")
    if (staleOverlay) staleOverlay.classList.remove("open")

    var grid = document.querySelector(".wg-grid")
    if (!grid) return
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".wg-card"))
    if (!cards.length) return

    buildCardDom(grid)

    var scored = scoreCards(cards)
    assignSizes(scored)
    shuffleCards(scored, grid)
    renderHeatBars(scored)
    stagger(grid)
    setupFilters(grid)
    setupInfiniteScroll(grid)
    setupGacha()
  }

  /* ── wiki subpage enhancements ─────────────────────────────── */

  function enhanceWikiSubpage() {
    var path = window.location.pathname
    if (!/\/wiki\//.test(path)) return

    // Hide footer prev/next nav on all wiki pages
    var links = document.querySelectorAll(".md-footer__link--prev, .md-footer__link--next")
    links.forEach(function (el) { el.style.display = "none" })

    // Inject back-to-wiki button on concept/entity pages (not index)
    if (/\/wiki\/(concepts|entities)\/[^/]/.test(path)) {
      // Avoid duplicate injection on instant nav re-run
      if (document.querySelector(".wg-back-btn")) return

      var content = document.querySelector(".md-content__inner")
      if (!content) return

      // Resolve wiki index URL relative to current path
      var wikiUrl = path.replace(/\/wiki\/(concepts|entities)\/.*$/, "/wiki/")

      var btn = document.createElement("a")
      btn.href = wikiUrl
      btn.className = "wg-back-btn"
      btn.innerHTML = "← Knowledge Atlas"
      content.insertBefore(btn, content.firstChild)
    }
  }

  function boot() {
    init()              // gallery logic (no-op if not on gallery page)
    trackPageVisit()    // bump counter if on a concept/entity page
    enhanceWikiSubpage() // hide footer nav + inject back button
  }

  // MkDocs Material instant navigation support
  if (typeof document$ !== "undefined") {
    document$.subscribe(function () { boot() })
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot)
  } else {
    boot()
  }
})()
