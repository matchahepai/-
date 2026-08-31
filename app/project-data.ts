export type Project = {
  slug: string;
  number: string;
  title: string;
  category: string;
  summary: string;
  year: string;
  cover: number;
  visual: string;
  pages: number[];
  tone: string;
};

export const projects: Project[] = [
  { slug: "sugar", number: "01", title: "SUGAR 方糖", category: "老年医疗 · 产品设计", summary: "帮助老年家庭更轻松地记录和管理健康", year: "2024", cover: 5, visual: "/project-visuals/sugar.webp", pages: [5,6,7,8,9,10], tone: "yellow" },
  { slug: "cloud-between", number: "02", title: "云间", category: "智慧出行 · UX / UI", summary: "为合租生活设计一套轻量的心理支持服务", year: "2025", cover: 11, visual: "/project-visuals/cloud-between.webp", pages: [11,12,13,14,15,16], tone: "blue" },
  { slug: "langsheng", number: "03", title: "朗圣问问", category: "交互设计 · 健康体验", summary: "让大学生更容易获得可靠、不过度说教的性教育信息", year: "2024", cover: 17, visual: "/project-visuals/langsheng.webp", pages: [17,18,19,20], tone: "violet" },
  { slug: "circuit-breaker", number: "04", title: "万能框架断路器", category: "工业产品 · 产品设计", summary: "重新梳理断路器的结构、操作方式与外观", year: "2023", cover: 21, visual: "/project-visuals/circuit-breaker.webp", pages: [21,22,23], tone: "deepblue" },
  { slug: "spell-light", number: "05", title: "Spell Light", category: "儿童产品 · 产品设计", summary: "让儿童自己拼出一盏能讲故事的灯", year: "2022", cover: 24, visual: "/project-visuals/spell-light.webp", pages: [24,25,26], tone: "amber" },
  { slug: "chuyue", number: "06", title: "CHUYUE 楚乐", category: "文化创新 · 产品设计", summary: "把楚文化的声音与形态带进日常产品", year: "2023", cover: 27, visual: "/project-visuals/chuyue.webp", pages: [27,28], tone: "red" },
  { slug: "cloud-axis", number: "07", title: "云轴及其他", category: "智能家居 · 视觉实践", summary: "一组关于智能家居与视觉表达的设计练习", year: "2024", cover: 29, visual: "/project-visuals/cloud-axis.webp", pages: [29,30,31], tone: "sky" },
];

export const imagePath = (page: number) => `/portfolio/page-${String(page).padStart(2, "0")}.webp`;
