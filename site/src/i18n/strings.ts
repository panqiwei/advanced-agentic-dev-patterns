export type Locale = "en" | "zh";

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALES: Locale[] = ["en", "zh"];

export const STRINGS = {
  en: {
    siteTitle: "On Seven Mental Models",
    siteSubtitle: "Seven Mental Models for Agentic Systems",
    nav: {
      hall: "Hall",
      mm: "Mental Models",
      lab: "Lab",
      wiki: "Index",
      map: "Map",
      guide: "Guide",
    },
    topbarOverview: "Overview",
    year: "2026",
    mapLabel: "Seven · Map",
    homeLead: {
      kicker: "Overview · Seven Mental Models · 2026",
      side: "On Seven Mental Models for Agentic Systems — a quiet room of models, built to be read slowly and returned to.",
      sideMono: "A curated exhibition",
    },
    meta: {
      hall: "Hall · Mental Models",
      rooms: "Seven Rooms",
      guide: "Guide · from one to seven",
    },
    footer: {
      about: "About",
      aboutBody: "A small museum of mental models for people building agents. Read, pause, return.",
      colophon: "Colophon",
      colophonBody:
        "Paper: #F4EEE2 · Ink: #1A1614 · Seal: #9A3B2C. Fonts: LXGW WenKai, Cormorant Garamond, IBM Plex Mono.",
      rights: "Index",
      rightsBody: "Content is written by humans. Source in GitHub.",
    },
  },
  zh: {
    siteTitle: "心智七篇",
    siteSubtitle: "关于智能体系统的七种心智模型",
    nav: {
      hall: "大堂",
      mm: "心智模型",
      lab: "工坊",
      wiki: "Wiki",
      map: "地图",
      guide: "指南",
    },
    topbarOverview: "总览",
    year: "2026",
    mapLabel: "七篇地图 / Map",
    homeLead: {
      kicker: "总览 · 心智七篇 · 2026",
      side: "一间安静的展厅，陈列七种给智能体系统用的心智模型。慢读，可反复。",
      sideMono: "精选展陈",
    },
    meta: {
      hall: "馆 · HALL · 心智 MENTAL MODELS",
      rooms: "七个展厅 · SEVEN ROOMS",
      guide: "浏览指南 · GUIDE · 由一至七",
    },
    footer: {
      about: "关于",
      aboutBody: "为正在构造智能体的人做的一间小型博物馆。读一章，停一下，再回来。",
      colophon: "版式",
      colophonBody:
        "纸 #F4EEE2 · 墨 #1A1614 · 朱印 #9A3B2C。字：霞鹜文楷 / Cormorant Garamond / IBM Plex Mono。",
      rights: "索引",
      rightsBody: "内容由人撰写，源码在 GitHub。",
    },
  },
} as const;

export function t(locale: Locale) {
  return STRINGS[locale] ?? STRINGS[DEFAULT_LOCALE];
}

export function altLocale(locale: Locale): Locale {
  return locale === "en" ? "zh" : "en";
}
// altUrl used to live here; it's been replaced by `altPath` in ~/lib/urls
// because URL generation needs to know about Astro's `base` config.
