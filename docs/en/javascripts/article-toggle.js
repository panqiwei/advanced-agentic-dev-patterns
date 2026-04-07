/**
 * Article Toggle — 图/文切换
 * Adds a reading-mode toggle to any page with `.mm-article[data-card]`.
 * Card mode is default; text mode shows the article.
 */
;(function () {
  "use strict"

  var STORAGE_KEY = "mm_view_mode" // persist preference across pages

  function getMode() {
    try { return localStorage.getItem(STORAGE_KEY) || "card" }
    catch (e) { return "text" }
  }

  function setMode(mode) {
    try { localStorage.setItem(STORAGE_KEY, mode) } catch (e) {}
  }

  function init() {
    var articles = document.querySelectorAll(".mm-article[data-card]")
    if (!articles.length) return

    var savedMode = getMode()

    articles.forEach(function (article) {
      var cardSrc = article.getAttribute("data-card")
      var cardAlt = article.getAttribute("data-card-alt") || "Infograph"
      if (!cardSrc) return

      // Fix relative path: mkdocs generates subdir pages (01-xxx/index.html),
      // so "assets/foo.png" resolves wrong. Prepend "../" if needed.
      if (cardSrc.indexOf("/") === -1 || cardSrc.startsWith("assets/")) {
        cardSrc = "../" + cardSrc
      }

      // Create toggle bar
      var bar = document.createElement("div")
      bar.className = "mm-toggle-bar"

      // Detect language from <html lang="...">
      var lang = document.documentElement.lang || "en"
      var labelText = lang.startsWith("zh") ? "📖 文" : "📖 Text"
      var labelCard = lang.startsWith("zh") ? "🗺️ 图" : "🗺️ Image"

      var btnText = document.createElement("button")
      btnText.className = "mm-toggle-btn"
      btnText.setAttribute("data-mode", "text")
      btnText.textContent = labelText

      var btnCard = document.createElement("button")
      btnCard.className = "mm-toggle-btn"
      btnCard.setAttribute("data-mode", "card")
      btnCard.textContent = labelCard

      bar.appendChild(btnText)
      bar.appendChild(btnCard)

      // Create card container
      var cardWrap = document.createElement("div")
      cardWrap.className = "mm-card-view"
      var img = document.createElement("img")
      img.src = cardSrc
      img.alt = cardAlt
      img.loading = "lazy"
      cardWrap.appendChild(img)

      // Insert before article
      article.parentNode.insertBefore(bar, article)
      article.parentNode.insertBefore(cardWrap, article.nextSibling)

      // Apply mode
      function applyMode(mode) {
        if (mode === "card") {
          article.style.display = "none"
          cardWrap.style.display = "block"
          btnCard.classList.add("active")
          btnText.classList.remove("active")
        } else {
          article.style.display = ""
          cardWrap.style.display = "none"
          btnText.classList.add("active")
          btnCard.classList.remove("active")
        }
        setMode(mode)
      }

      btnText.addEventListener("click", function () { applyMode("text") })
      btnCard.addEventListener("click", function () { applyMode("card") })

      applyMode(savedMode)
    })
  }

  // MkDocs Material instant navigation support
  if (typeof document$ !== "undefined") {
    document$.subscribe(function () { init() })
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }
})()
