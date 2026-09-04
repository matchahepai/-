"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Box, ChevronLeft, ChevronRight, Globe, Image as ImageIcon, Menu, MessageCircle, PanelsTopLeft, Phone, Quote, Sparkles, TrendingUp, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContactPanel } from "@/components/contact-panel";
import { contactDetails as contact } from "./contact-data";
import { projects } from "./project-data";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [coverReady, setCoverReady] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const contactTriggerRef = useRef<HTMLButtonElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
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
    { name: "Figma", className: "tool-figma", icon: "/assets/software/figma.svg" },
    { name: "Photoshop", className: "tool-ps", icon: "/assets/software/photoshop.svg" },
    { name: "Illustrator", className: "tool-ai", icon: "/assets/software/illustrator.svg" },
    { name: "Rhino", className: "tool-rhino", icon: "/assets/software/rhino.svg" },
    { name: "KeyShot", className: "tool-keyshot", icon: "/assets/software/keyshot.svg" },
    { name: "Canva 可画", className: "tool-canva", icon: "/assets/software/canva.svg" },
    { name: "剪映", className: "tool-cut", icon: "/assets/software/capcut.svg" },
    { name: "ChatGPT", className: "tool-gpt", icon: "/assets/software/chatgpt.svg" },
    { name: "Gemini", className: "tool-gemini", icon: "/assets/software/gemini.svg" },
  ];

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const openContact = (event: React.MouseEvent<HTMLButtonElement>) => {
    contactTriggerRef.current = menuOpen ? menuButtonRef.current : event.currentTarget;
    setMenuOpen(false);
    setContactOpen(true);
  };

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
    if (!container || window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 760px)").matches) return;

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
          <a href="#top">封面 <span lang="en">Home</span></a>
          <a href="#profile">个人 <span lang="en">About</span></a>
          <a href="#works">作品 <span lang="en">Work</span></a>
        </nav>
        <Button variant="portfolio" size="control" className="contact-link" type="button" onClick={openContact} aria-haspopup="dialog"><span>联系我</span><span lang="en" className="label-en">Contact</span><ArrowUpRight aria-hidden="true" /></Button>
        <Button variant="portfolio-quiet" size="control-icon" ref={menuButtonRef} className="menu-button" aria-label={menuOpen ? "关闭导航" : "打开导航"} aria-expanded={menuOpen}
          onPointerDown={(event) => event.currentTarget.classList.add("pressed")}
          onPointerUp={(event) => event.currentTarget.classList.remove("pressed")}
          onPointerCancel={(event) => event.currentTarget.classList.remove("pressed")}
          onClick={() => setMenuOpen((value) => !value)}>
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </Button>
      </header>

      <div className={`mobile-sheet ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen} inert={!menuOpen}>
        <a href="#top" onClick={closeMenu}>作品封面 <span lang="en">Home</span></a>
        <a href="#profile" onClick={closeMenu}>个人主页 <span lang="en">About</span></a>
        <a href="#works" onClick={closeMenu}>作品目录 <span lang="en">Work</span></a>
        <Button variant="portfolio-quiet" size="control" type="button" onClick={openContact} aria-haspopup="dialog">联系我 <span lang="en">Contact</span></Button>
      </div>

      <ContactPanel open={contactOpen} onOpenChange={setContactOpen} returnFocus={() => contactTriggerRef.current?.focus()} />

      <section id="top" className="cover" ref={coverRef} aria-label="王博晨个人作品集封面">
        <div className="cover-inner">
          <div className={`cover-copy t-stagger ${coverReady ? "is-shown" : ""}`}>
            <h1 className="t-stagger-line t-stagger-line--1">Portfolio</h1>
          <p className="t-stagger-line t-stagger-line--2">{"2021—2025   个人作品集"}</p>
          </div>

          <div className="folder-stage" aria-label="按年份整理的作品文件夹">
            <div className="folder folder-purple"><i className="folder-inset" aria-hidden="true" /><span><b>2021</b><small>基础探索</small></span></div>
            <div className="folder folder-yellow"><i className="folder-inset" aria-hidden="true" /><span><b>2022</b><small>形态实验</small></span></div>
            <div className="folder folder-stone"><i className="folder-inset" aria-hidden="true" /><span><b>2023</b><small>系统设计</small></span></div>
            <div className="folder folder-blue"><i className="folder-inset" aria-hidden="true" /><span><b>2024</b><small>体验设计</small></span></div>
            <div className="folder folder-front">
              <article className="cover-paper">
                <small>2021—2025</small>
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

          <a className="cover-scroll" href="#profile"><span>向下浏览</span><b className="ui-arrow" aria-hidden="true"><ArrowDown /></b></a>
        </div>
      </section>

      <section id="profile" className="hero" ref={profileRef} aria-label="王博晨个人作品集首页">
        <div className="hero-composition">
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
            <span className="profile-title">产品设计师 <span className="label-en" lang="en">Product Designer</span></span>
            <strong className="profile-role"><Quote aria-hidden="true" size={27} fill="currentColor" strokeWidth={0} />我习惯先把问题想明白，再开始动手设计。</strong>
            <p>从用户研究、交互方案到工业建模和视觉呈现，我希望把复杂的想法整理成清晰、好用，也更容易被理解的方案。</p>
            <div className="profile-education" aria-label="毕业院校">
              <small>毕业院校</small>
              <div>
                <a href="https://www.gzarts.edu.cn/" target="_blank" rel="noreferrer" aria-label="预览广州美术学院官网">
                  <img src="/assets/school-gzarts.jpg" alt="广州美术学院校徽" />
                  <span className="school-copy"><b>广州美术学院</b><small>硕士 · 2026—2029</small></span>
                </a>
                <a href="https://www.hifa.edu.cn/" target="_blank" rel="noreferrer" aria-label="预览湖北美术学院官网">
                  <img src="/assets/school-hifa.jpg" alt="湖北美术学院校徽" />
                  <span className="school-copy"><b>湖北美术学院</b><small>本科 · 2021—2025</small></span>
                </a>
              </div>
            </div>
          </div>
          <Button variant="portfolio-quiet" size="control" type="button" className="profile-contact" onClick={openContact} aria-haspopup="dialog"><span>联系我 <span className="label-en" lang="en">Contact</span></span><ArrowUpRight aria-hidden="true" /></Button>
        </article>

        <aside className="role-panel hero-widget t-panel-slide" data-open={profileOpen} aria-label="求职方向与能力">
          <div className="role-panel-head"><span className="role-icon"><Sparkles size={22} fill="currentColor" /></span>擅长的事</div>
          <ul>
            <li><span className="role-icon"><UserRound size={21} /></span><span>产品思考与用户洞察</span></li>
            <li><span className="role-icon"><PanelsTopLeft size={21} /></span><span>交互方案与界面设计</span></li>
            <li><span className="role-icon"><Box size={21} /></span><span>工业设计与三维建模</span></li>
            <li className="skill-highlight"><span className="role-icon"><TrendingUp size={21} /></span><span>用新工具提升设计效率</span></li>
            <li><span className="role-icon"><ImageIcon size={21} /></span><span>视觉表达与方案呈现</span></li>
          </ul>
        </aside>

        <div className="contact-dock hero-widget t-panel-slide" data-open={profileOpen} aria-label="联系方式">
          <div className="contact-avatar"><img src="/assets/portrait-profile.webp" alt="" /></div>
          <div><strong>TEL</strong><a href={`tel:${contact.phone}`}>{contact.phone}</a></div>
          <a className="contact-action contact-decline" href="#works" aria-label="稍后联系"><Phone size={21} fill="currentColor" strokeWidth={0} style={{ transform: "rotate(135deg)" }} aria-hidden="true" /></a>
          <a className="contact-action contact-phone" href={`tel:${contact.phone}`} aria-label="拨打电话"><Phone size={21} fill="currentColor" strokeWidth={0} aria-hidden="true" /></a>
        </div>

        <a className="browser-bar hero-widget t-panel-slide" data-open={profileOpen} href={contact.website} target="_blank" rel="noreferrer" aria-label="访问个人网站 orange4186.asia">
          <Globe size={24} aria-hidden="true" /><strong>{contact.websiteLabel}</strong><ArrowUpRight size={22} aria-hidden="true" />
        </a>

        <div className="software-dock hero-widget t-panel-slide" data-open={profileOpen} aria-label="软件技能">
          <ul>
            {softwareTools.map((tool) => <li key={tool.name}><span className={`tool-icon ${tool.className}`} aria-hidden="true"><img src={tool.icon} alt="" /></span><small>{tool.name}</small></li>)}
          </ul>
        </div>
        </div>
      </section>

      <section id="works" className="catalog-section" aria-labelledby="works-title">
        <div className="catalog-head t-stagger" data-stagger>
          <div className="t-stagger-line t-stagger-line--1"><p className="section-kicker" lang="en">Selected Work</p><h2 id="works-title">我做过的项目</h2></div>
          <p className="catalog-intro t-stagger-line t-stagger-line--2">这里收录了我在产品、公共健康和数字体验方向的实践。每个项目都保留了从发现问题到做出方案的完整过程。</p>
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
                        <div className="catalog-card-meta">
                          <span>{project.number}</span>
                          <div className="catalog-category-tags">{project.category.split(" · ").map((category) => <Badge variant="outline" className="category-badge" key={category}>{category}</Badge>)}</div>
                        </div>
                        <h3>{project.title}</h3>
                        <p>{project.summary}</p>
                      </div>
                      <span className="card-arrow ui-arrow" aria-hidden="true"><ArrowUpRight /></span>
                      <span className="t-tilt-glare" aria-hidden="true" />
                    </a>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="catalog-controls" aria-label="项目卡片切换">
          <Button variant="portfolio" size="control-icon" type="button" onClick={() => scrollCatalog(-1)} aria-label="查看上一个项目"><ChevronLeft aria-hidden="true" /></Button>
          <span>左右滑动浏览</span>
          <Button variant="portfolio" size="control-icon" type="button" onClick={() => scrollCatalog(1)} aria-label="查看下一个项目"><ChevronRight aria-hidden="true" /></Button>
        </div>
      </section>

      <footer className="footer" id="contact">
        <p className="section-kicker" lang="en">Let’s Connect</p>
        <h2 className="footer-headline">好的设计，<br /><span>从一次交流开始。</span></h2>
        <div className="footer-connect">
          <div className="footer-email"><small>电子邮件</small><a href={`mailto:${contact.email}`}>{contact.email}<ArrowUpRight size={24} aria-hidden="true" /></a><a className="footer-phone" href={`tel:${contact.phone}`}>TEL · 177 2020 4186</a></div>
          <div className="footer-social"><small>也可以在这里找到我</small><div>
            <Button asChild variant="portfolio" size="control" className="footer-social-link"><a href={contact.xiaohongshu} target="_blank" rel="noreferrer"><span className="xhs-symbol" aria-hidden="true">小红书</span><span>小红书</span><ArrowUpRight aria-hidden="true" /></a></Button>
            {contact.wechatQr && <Button variant="portfolio" size="control" type="button" className="footer-social-link" onClick={openContact} aria-haspopup="dialog"><span className="wechat-symbol" aria-hidden="true"><MessageCircle /></span><span>微信</span><ArrowUpRight aria-hidden="true" /></Button>}
            <Button variant="portfolio" size="control" type="button" className="footer-all-contacts" onClick={openContact} aria-haspopup="dialog">全部联系方式<ArrowUpRight aria-hidden="true" /></Button>
          </div></div>
        </div>
        <div className="footer-bottom">
          <a className="footer-signature" href="#top">王博晨<span>产品设计 · 用户体验</span></a>
          <nav aria-label="页脚导航"><a href="#top">封面</a><a href="#profile">关于我</a><a href="#works">项目</a></nav>
          <div className="footer-copyright"><a href={contact.website} target="_blank" rel="noreferrer">{contact.websiteLabel}</a><span>© 2026 王博晨</span></div>
        </div>
      </footer>
    </main>
  );
}
