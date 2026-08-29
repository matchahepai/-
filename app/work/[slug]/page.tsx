import Link from "next/link";
import type { Metadata } from "next";
import { projects } from "../../project-data";
import ProjectGallery from "./ProjectGallery";

const siteUrl = "https://wang-bochen-portfolio.abbotaveryqfr.chatgpt.site";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return { title: "项目未找到｜王博晨作品集" };
  const title = `${project.title}｜王博晨作品集`;
  const description = `${project.category}：${project.summary}`;
  const image = `${siteUrl}${project.visual}`;
  return {
    title,
    description,
    openGraph: { title, description, url: `${siteUrl}/work/${project.slug}`, images: [{ url: image }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projectIndex = projects.findIndex((item) => item.slug === slug);
  const project = projects[projectIndex];

  if (!project) {
    return <main className="not-found"><p>没有找到这个项目。</p><Link href="/#works">返回作品目录</Link></main>;
  }

  const nextProject = projects[(projectIndex + 1) % projects.length];

  return (
    <main className={`project-page tone-${project.tone}`}>
      <section className="project-hero">
        <Link className="project-back" href="/#works" aria-label="返回作品目录"><span aria-hidden="true">←</span> 返回项目目录</Link>
        <div className="project-hero-copy">
          <p className="project-hero-label">项目 {project.number} / {String(projects.length).padStart(2, "0")}</p>
          <h1>{project.title}</h1>
          <span>{project.summary}</span>
          <div className="project-facts" aria-label="项目概览">
            <span><small>年份</small>{project.year}</span>
            <span><small>方向</small>{project.category.split(" · ")[0]}</span>
            <span><small>类型</small>{project.category.split(" · ")[1] ?? "设计项目"}</span>
          </div>
        </div>
      </section>

      <section id="project-content" className="project-viewer" aria-label={`${project.title}完整项目页面`}>
        <header className="project-viewer-head">
          <h2>项目全览</h2>
          <p>左右滑动或使用方向键，连续查看每一面。</p>
        </header>
        <ProjectGallery title={project.title} pages={project.pages} />
      </section>

      <section className="next-project">
        <p>下一个项目 · {nextProject.number}</p>
        <Link href={`/work/${nextProject.slug}`}>
          <span className="next-project-meta">{nextProject.category}<small>{nextProject.summary}</small></span>
          <strong>{nextProject.title}</strong>
          <img src={nextProject.visual} alt="" aria-hidden="true" />
          <b aria-hidden="true">→</b>
        </Link>
      </section>
    </main>
  );
}
