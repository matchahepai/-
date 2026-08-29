"use client";

import { useEffect, useRef, useState } from "react";
import { Phone } from "lucide-react";
import { projects } from "./project-data";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [coverReady, setCoverReady] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const coverRef = useRef<HTMLElement>(null);
  const profileRef = useRef<HTMLElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);
  const catalogAnimationRef = useRef<number | null>(null);
  const catalogHoverRef = useRef(false);
  const catalogPauseUntilRef = useRef(0);
  const catalogDragRef = useRef({
    active: false,
    startX: 0,
    startScrollLeft: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    moved: false,
  });
  const softwareTools = [
    { name: "Figma", className: "tool-figma", mark: "Fi" },
    { name: "Photoshop", className: "tool-ps", mark: "Ps" },
    { name: "Illustrator", className: "tool-ai", mark: "Ai" },
    { name: "Rhino", className: "tool-rhino", mark: "Rh" },
    { name: "KeyShot", className: "tool-keyshot", mark: "Ks" },
    { name: "Creo", className: "tool-proe", mark: "Cr" },
    { name: "剪映", className: "tool-cut", mark: "剪" },
    { name: "ChatGPT", className: "tool-gpt", mark: "AI" },
    { name: "Gemini", className: "tool-gemini", mark: "Gm" },
  ];

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal],[data-stagger]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((target) => {
        if (target.hasAttribute("data-reveal")) target.classList.add("is-visible");
        if (target.hasAttribute("data-stagger")) target.classList.add("is-shown");
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;
        if (target.hasAttribute("data-stagger")) {
          if (entry.isIntersecting) {
            target.classList.remove("is-hiding");
            target.classList.add("is-shown");
          } else if (target.classList.contains("is-shown")) {
            target.classList.remove("is-shown");
            target.classList.add("is-hiding");
          }
          return;
        }
        if (entry.isIntersecting) {
          target.classList.add("is-visible");
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -7% 0px" });

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setCoverReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const profile = profileRef.current;
    if (!profile) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = window.requestAnimationFrame(() => setProfileOpen(true));
      return () => window.cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(([entry]) => setProfileOpen(entry.isIntersecting), {
      threshold: 0.2,
      rootMargin: "-4% 0px -8% 0px",
    });
    observer.observe(profile);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => {
    if (catalogAnimationRef.current) window.cancelAnimationFrame(catalogAnimationRef.current);
  }, []);

  useEffect(() => {
    const container = catalogRef.current;
    if (!container || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let previousTime = performance.now();
    const tick = (time: number) => {
      const delta = Math.min(32, time - previousTime);
      previousTime = time;
      const group = container.querySelector<HTMLElement>(".catalog-group");
      const grid = container.querySelector<HTMLElement>(".catalog-grid");
      const gap = grid ? Number.parseFloat(window.getComputedStyle(grid).gap) || 12 : 12;
      const loopWidth = (group?.offsetWidth ?? 0) + gap;

      if (!catalogDragRef.current.active && !catalogHoverRef.current && time > catalogPauseUntilRef.current && !catalogAnimationRef.current) {
        container.scrollLeft += delta * 0.032;
      }
      if (loopWidth > 0 && container.scrollLeft >= loopWidth) container.scrollLeft -= loopWidth;
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const cover = coverRef.current;
    if (!cover || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const updateCoverMotion = () => {
      const travel = Math.max(1, cover.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / travel));
      cover.style.setProperty("--paper-pull", `${progress * 760}px`);
      cover.style.setProperty("--paper-tilt", `${progress * 3.5}deg`);
      cover.style.setProperty("--folder-y", `${progress * -236}px`);
      cover.style.setProperty("--cover-copy-shift", `${progress * -36}px`);
      cover.style.setProperty("--cover-copy-opacity", `${Math.max(0, 1 - progress / 0.72)}`);
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateCoverMotion);
    };

    updateCoverMotion();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const hero = profileRef.current;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const updateHeroMotion = () => {
      const progress = Math.min(1, Math.max(0, (window.scrollY - hero.offsetTop) / Math.max(hero.offsetHeight, 1)));
      hero.style.setProperty("--hero-type-shift", `${progress * 54}px`);
      hero.style.setProperty("--hero-type-shift-2", `${progress * 76}px`);
      hero.style.setProperty("--portrait-shift", `${progress * 22}px`);
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateHeroMotion);
    };

    updateHeroMotion();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const getCatalogMetrics = () => {
    const container = catalogRef.current;
    const card = container?.querySelector<HTMLElement>(".catalog-tilt");
    const grid = container?.querySelector<HTMLElement>(".catalog-grid");
    const gap = grid ? Number.parseFloat(window.getComputedStyle(grid).gap) || 14 : 14;
    return { container, step: (card?.offsetWidth ?? 300) + gap };
  };

  const animateCatalogTo = (requestedTarget: number, initialVelocity = 0) => {
    const { container } = getCatalogMetrics();
    if (!container) return;
    if (catalogAnimationRef.current) window.cancelAnimationFrame(catalogAnimationRef.current);

    const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
    const target = Math.min(maxScroll, Math.max(0, requestedTarget));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      container.scrollLeft = target;
      return;
    }

    let position = container.scrollLeft;
    let velocity = initialVelocity;
    let previousTime = performance.now();
    const tick = (time: number) => {
      const delta = Math.min((time - previousTime) / 1000, 0.032);
      previousTime = time;
      const acceleration = 170 * (target - position) - 26 * velocity;
      velocity += acceleration * delta;
      position += velocity * delta;
      container.scrollLeft = position;

      if (Math.abs(target - position) < 0.5 && Math.abs(velocity) < 5) {
        container.scrollLeft = target;
        catalogAnimationRef.current = null;
        return;
      }
      catalogAnimationRef.current = window.requestAnimationFrame(tick);
    };
    catalogAnimationRef.current = window.requestAnimationFrame(tick);
  };

  const scrollCatalog = (direction: number) => {
    const { container, step } = getCatalogMetrics();
    if (!container) return;
    catalogPauseUntilRef.current = performance.now() + 2200;
    const index = Math.round(container.scrollLeft / step) + direction;
    animateCatalogTo(index * step);
  };

  const onCatalogPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const container = event.currentTarget;
    catalogPauseUntilRef.current = performance.now() + 1800;
    if (catalogAnimationRef.current) window.cancelAnimationFrame(catalogAnimationRef.current);
    catalogAnimationRef.current = null;
    catalogDragRef.current = {
      active: true,
      startX: event.clientX,
      startScrollLeft: container.scrollLeft,
      lastX: event.clientX,
      lastTime: performance.now(),
      velocity: 0,
      moved: false,
    };
  };

  const onCatalogPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = catalogDragRef.current;
    if (!drag.active) return;
    const container = event.currentTarget;
    const now = performance.now();
    const elapsed = Math.max(8, now - drag.lastTime);
    const distance = event.clientX - drag.startX;
    if (!drag.moved && Math.abs(distance) > 5) {
      drag.moved = true;
      container.setPointerCapture(event.pointerId);
      container.classList.add("is-dragging");
    }
    if (!drag.moved) return;
    event.preventDefault();
    container.scrollLeft = drag.startScrollLeft - distance;
    drag.velocity = ((drag.lastX - event.clientX) / elapsed) * 1000;
    drag.lastX = event.clientX;
    drag.lastTime = now;
  };

  const finishCatalogDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = catalogDragRef.current;
    if (!drag.active) return;
    const container = event.currentTarget;
    drag.active = false;
    container.classList.remove("is-dragging");
    if (container.hasPointerCapture(event.pointerId)) container.releasePointerCapture(event.pointerId);
    if (!drag.moved) return;
    const { step } = getCatalogMetrics();
    const projected = container.scrollLeft + drag.velocity * 0.18;
    animateCatalogTo(Math.round(projected / step) * step, drag.velocity);
    window.setTimeout(() => { drag.moved = false; }, 0);
  };

  const onTiltPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    const hitArea = event.currentTarget;
    const card = hitArea.querySelector<HTMLElement>(".t-tilt-card");
    if (!card) return;
    const bounds = hitArea.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    const y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
    hitArea.style.setProperty("--tilt-rx", `${(0.5 - y) * 7}deg`);
    hitArea.style.setProperty("--tilt-ry", `${(x - 0.5) * 8}deg`);
    hitArea.style.setProperty("--tilt-gx", `${x * 100}%`);
    hitArea.style.setProperty("--tilt-gy", `${y * 100}%`);
    hitArea.classList.add("is-hover");
    card.classList.add("is-tilting");
  };

  const resetTilt = (event: React.PointerEvent<HTMLDivElement>) => {
    const hitArea = event.currentTarget;
    const card = hitArea.querySelector<HTMLElement>(".t-tilt-card");
    hitArea.style.setProperty("--tilt-rx", "0deg");
    hitArea.style.setProperty("--tilt-ry", "0deg");
    hitArea.style.setProperty("--tilt-gx", "50%");
    hitArea.style.setProperty("--tilt-gy", "50%");
    hitArea.classList.remove("is-hover");
    card?.classList.remove("is-tilting");
  };

  return (
    <main>
      <header className="site-nav" aria-label="主导航">
        <a className="brand" href="#top" aria-label="返回首页"><strong>王博晨</strong></a>
        <nav className="desktop-nav" aria-label="页面目录">
          <a href="#top">封面</a>
          <a href="#profile">个人</a>
          <a href="#works">作品</a>
        </nav>
        <a className="contact-link" href="mailto:654676340@qq.com"><span>联系我</span><b aria-hidden="true">↗</b></a>
        <button className="menu-button" aria-label={menuOpen ? "关闭导航" : "打开导航"} aria-expanded={menuOpen}
          onPointerDown={(event) => event.currentTarget.classList.add("pressed")}
          onPointerUp={(event) => event.currentTarget.classList.remove("pressed")}
          onPointerCancel={(event) => event.currentTarget.classList.remove("pressed")}
          onClick={() => setMenuOpen((value) => !value)}>
          <span className={menuOpen ? "open" : ""} /><span className={menuOpen ? "open" : ""} />
        </button>
      </header>

      <div className={`mobile-sheet ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <a href="#top" onClick={closeMenu}>作品封面</a>
        <a href="#profile" onClick={closeMenu}>个人主页</a>
        <a href="#works" onClick={closeMenu}>作品目录</a>
        <a href="mailto:654676340@qq.com">联系我 <span aria-hidden="true">↗</span></a>
      </div>

      <section id="top" className="cover" ref={coverRef} aria-label="王博晨个人作品集封面">
        <div className="cover-inner">
          <div className={`cover-copy t-stagger ${coverReady ? "is-shown" : ""}`}>
            <h1 className="t-stagger-line t-stagger-line--1">Portfolio</h1>
            <p className="t-stagger-line t-stagger-line--2">2021—2025 · 王博晨个人作品集</p>
          </div>

          <div className="folder-stage" aria-label="按年份整理的作品文件夹">
            <div className="folder folder-purple"><i className="folder-inset" aria-hidden="true" /><span><b>2021</b><small>基础探索</small></span></div>
            <div className="folder folder-yellow"><i className="folder-inset" aria-hidden="true" /><span><b>2022</b><small>形态实验</small></span></div>
            <div className="folder folder-stone"><i className="folder-inset" aria-hidden="true" /><span><b>2023</b><small>系统设计</small></span></div>
            <div className="folder folder-blue"><i className="folder-inset" aria-hidden="true" /><span><b>2024</b><small>体验设计</small></span></div>
            <div className="folder folder-front">
              <article className="cover-paper">
                <small>王博晨 · 2021—2025</small>
                <b>项目精选</b>
                <span>工业产品</span>
                <span>交互设计</span>
                <span>文化创新</span>
                <span>AI / AIGC</span>
              </article>
              <i className="folder-front-sheet" aria-hidden="true" />
              <strong>2025</strong><em>个人作品集 · 07 项目</em>
            </div>
          </div>

          <a className="cover-scroll" href="#profile"><span>向下浏览</span><b aria-hidden="true">↓</b></a>
        </div>
      </section>

      <section id="profile" className="hero" ref={profileRef} aria-label="王博晨个人作品集首页">
        <div className="hero-background-type" aria-hidden="true">
          <span>Hello, I&apos;m</span>
          <strong>Bochen.</strong>
        </div>

        <div className="portrait-stage" aria-label="王博晨个人形象照">
          <img src="/assets/portrait-profile.webp" alt="王博晨" />
        </div>

        <article className="profile-card hero-widget t-panel-slide" data-open={profileOpen}>
          <div className="profile-card-copy">
            <h1>王博晨</h1>
            <span className="profile-title">产品设计师</span>
            <strong className="profile-role">我喜欢先去现场看看问题，再把复杂的事情做得更清楚、更好用。</strong>
            <p>从用户研究和交互原型，到工业建模与视觉表达，我会一路把方案推到能被理解、被使用的状态。</p>
            <div className="profile-highlights" aria-label="作品集概览">
              <span><b>07</b><small>项目实践</small></span>
              <span><b>04</b><small>设计方向</small></span>
              <span><b>21—25</b><small>创作年份</small></span>
            </div>
          </div>
          <a href="mailto:654676340@qq.com">联系我</a>
        </article>

        <aside className="role-panel hero-widget t-panel-slide" data-open={profileOpen} aria-label="求职方向与能力">
          <div className="role-panel-head">核心能力</div>
          <ul>
            <li><span>产品策略与用户研究</span></li>
            <li><span>交互原型与界面设计</span></li>
            <li><span>工业设计与建模</span></li>
            <li className="skill-highlight"><span>AI 辅助设计工作流</span></li>
            <li><span>视觉叙事与提案表达</span></li>
          </ul>
        </aside>

        <div className="contact-dock hero-widget t-panel-slide" data-open={profileOpen} aria-label="联系方式">
          <div className="contact-avatar"><img src="/assets/portrait-profile.webp" alt="" /></div>
          <div><strong>王博晨</strong><a href="mailto:654676340@qq.com">654676340@qq.com</a></div>
          <a className="contact-action contact-decline" href="#works" aria-label="稍后联系">×</a>
          <a className="contact-action contact-phone" href="tel:17720204186" aria-label="拨打电话"><Phone size={19} strokeWidth={2.2} aria-hidden="true" /></a>
        </div>

        <div className="browser-bar hero-widget t-panel-slide" data-open={profileOpen} aria-label="个人网站地址">
          <span>AA</span><strong><i aria-hidden="true">●</i> wangbochen.design</strong><b aria-hidden="true">↻</b>
        </div>

        <div className="software-dock hero-widget t-panel-slide" data-open={profileOpen} aria-label="软件技能">
          <ul>
            {softwareTools.map((tool) => <li key={tool.name}><span className={`tool-icon ${tool.className}`} aria-hidden="true">{tool.mark}</span><small>{tool.name}</small></li>)}
          </ul>
        </div>
      </section>

      <section id="works" className="catalog-section" aria-labelledby="works-title">
        <div className="catalog-head t-stagger" data-stagger>
          <h2 id="works-title" className="t-stagger-line t-stagger-line--1">我做过的项目</h2>
          <p className="catalog-intro t-stagger-line t-stagger-line--2">这些项目横跨实体产品、公共健康和数字体验。每一个都从真实问题开始，最后落到可以被看见、被使用的方案。</p>
        </div>

        <div
          className="catalog-viewport"
          ref={catalogRef}
          onPointerDown={onCatalogPointerDown}
          onPointerMove={onCatalogPointerMove}
          onPointerUp={finishCatalogDrag}
          onPointerCancel={finishCatalogDrag}
          onMouseEnter={() => { catalogHoverRef.current = true; }}
          onMouseLeave={() => { catalogHoverRef.current = false; }}
          onClickCapture={(event) => {
            if (!catalogDragRef.current.moved) return;
            event.preventDefault();
            event.stopPropagation();
            catalogDragRef.current.moved = false;
          }}
        >
          <div className="catalog-grid">
            {[0, 1].map((setIndex) => (
              <div className="catalog-group" key={setIndex} aria-hidden={setIndex === 1 ? "true" : undefined}>
                {projects.map((project, index) => (
                  <div
                    className="catalog-tilt t-tilt"
                    key={`${setIndex}-${project.slug}`}
                    data-reveal
                    onPointerMove={onTiltPointerMove}
                    onPointerLeave={resetTilt}
                    onPointerCancel={resetTilt}
                    style={{ "--reveal-delay": `${index * 60}ms` } as React.CSSProperties}
                  >
                    <a className={`catalog-card t-tilt-card card-${index + 1} tone-${project.tone}`} href={`/work/${project.slug}`} tabIndex={setIndex === 1 ? -1 : undefined}>
                      <div className="catalog-image">
                        <img src={project.visual} alt={setIndex === 0 ? `${project.title}项目展示图` : ""} loading={index < 2 && setIndex === 0 ? "eager" : "lazy"} />
                      </div>
                      <div className="catalog-card-copy">
                        <div className="catalog-card-meta"><span>{project.number}</span><b>{project.category}</b></div>
                        <h3>{project.title}</h3>
                        <p>{project.summary}</p>
                      </div>
                      <span className="card-arrow" aria-hidden="true">↗</span>
                      <span className="t-tilt-glare" aria-hidden="true" />
                    </a>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="catalog-controls" aria-label="项目卡片切换">
          <button type="button" onClick={() => scrollCatalog(-1)} aria-label="查看上一个项目">‹</button>
          <span>拖动浏览</span>
          <button type="button" onClick={() => scrollCatalog(1)} aria-label="查看下一个项目">›</button>
        </div>
      </section>

      <footer className="footer">
        <div className="t-stagger" data-stagger>
          <p className="t-stagger-line t-stagger-line--1">有合适的项目或实习，<br />欢迎来聊聊。</p>
          <div className="footer-contacts t-stagger-line t-stagger-line--2">
            <a href="mailto:654676340@qq.com"><small>邮箱</small>654676340@qq.com <span aria-hidden="true">↗</span></a>
            <a href="tel:17720204186"><small>电话</small>177 2020 4186 <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className="footer-bottom"><span>王博晨个人作品集</span><span>© 2026</span></div>
      </footer>
    </main>
  );
}
