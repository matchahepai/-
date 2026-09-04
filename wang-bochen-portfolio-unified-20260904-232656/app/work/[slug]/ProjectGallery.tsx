"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type ProjectGalleryProps = {
  title: string;
  pages: number[];
};

const imagePath = (page: number) => `/portfolio/page-${String(page).padStart(2, "0")}.webp`;

export default function ProjectGallery({ title, pages }: ProjectGalleryProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const [current, setCurrent] = useState(0);

  const goTo = (requestedIndex: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const index = (requestedIndex + pages.length) % pages.length;
    const slide = viewport.children[index] as HTMLElement | undefined;
    viewport.scrollTo({ left: slide?.offsetLeft ?? 0, behavior: "smooth" });
    setCurrent(index);
  };

  const updateProgress = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const slides = Array.from(viewport.children) as HTMLElement[];
    const nearest = slides.reduce((best, slide, index) => {
      const distance = Math.abs(slide.offsetLeft - viewport.scrollLeft);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Number.POSITIVE_INFINITY });
    setCurrent(nearest.index);
  };

  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const viewport = event.currentTarget;
    dragRef.current = { active: true, startX: event.clientX, startScroll: viewport.scrollLeft, moved: false };
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add("is-dragging");
  };

  const moveDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) > 4) drag.moved = true;
    if (!drag.moved) return;
    event.preventDefault();
    event.currentTarget.scrollLeft = drag.startScroll - distance;
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const moved = dragRef.current.moved;
    dragRef.current.active = false;
    event.currentTarget.classList.remove("is-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (moved) {
      const slides = Array.from(event.currentTarget.children) as HTMLElement[];
      const nearest = slides.reduce((best, slide, index) => {
        const distance = Math.abs(slide.offsetLeft - event.currentTarget.scrollLeft);
        return distance < best.distance ? { index, distance } : best;
      }, { index: 0, distance: Number.POSITIVE_INFINITY });
      goTo(nearest.index);
    }
  };

  return (
    <div className="portfolio-gallery" onKeyDown={(event) => {
      if (event.key === "ArrowLeft") goTo(current - 1);
      if (event.key === "ArrowRight") goTo(current + 1);
    }}>
      <div className="portfolio-viewport" ref={viewportRef} onScroll={updateProgress} tabIndex={0}
        onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag}
        aria-label={`${title}作品集横向浏览，可使用左右方向键切换`}>
        {pages.map((page, index) => (
          <figure className="portfolio-slide" key={page}>
            <img src={imagePath(page)} width="4200" height="1211"
              alt={`${title}作品集第 ${index + 1} 面`} loading={index === 0 ? "eager" : "lazy"} draggable="false" />
          </figure>
        ))}
      </div>

      <div className="portfolio-controls">
        <Button variant="portfolio" size="control-icon" type="button" onClick={() => goTo(current - 1)} aria-label="上一面"><ChevronLeft aria-hidden="true" /></Button>
        <div className="portfolio-progress">
          <div className="portfolio-progress-meta">
            <span>第 {String(current + 1).padStart(2, "0")} 面</span>
            <strong aria-live="polite">{String(current + 1).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}</strong>
          </div>
          <div className="portfolio-progress-track" aria-hidden="true">
            <i style={{ width: `${((current + 1) / pages.length) * 100}%` }} />
          </div>
          <div className="portfolio-page-tabs" aria-label="选择作品集页面">
            {pages.map((page, index) => (
              <Button variant="portfolio" size="control-small" type="button" key={page} className={index === current ? "is-active" : ""}
                onClick={() => goTo(index)} aria-label={`查看第 ${index + 1} 面`} aria-current={index === current ? "page" : undefined}>
                {String(index + 1).padStart(2, "0")}
              </Button>
            ))}
          </div>
        </div>
        <Button asChild variant="portfolio" size="control" className="portfolio-original"><a href={imagePath(pages[current])} target="_blank" rel="noreferrer">查看原图 <span className="label-en" lang="en">Full Size</span><ArrowUpRight aria-hidden="true" /></a></Button>
        <Button variant="portfolio" size="control-icon" type="button" onClick={() => goTo(current + 1)} aria-label="下一面"><ChevronRight aria-hidden="true" /></Button>
      </div>
    </div>
  );
}
