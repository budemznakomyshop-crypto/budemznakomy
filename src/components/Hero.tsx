// Hero.tsx
import React, { useEffect, useRef, useState } from "react";

type HeroProps = {
  videoSrc?: string;
  poster?: string;
  minHeight?: number; // минимальная высота в px
};

export function Hero({
  videoSrc = "video.webm",
  poster = "/video-poster.jpg",
  minHeight = 240,
}: HeroProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [height, setHeight] = useState<number>(window.innerHeight);
  const [loadVideo, setLoadVideo] = useState<boolean>(false);

  // Проверки reduced-motion / save-data / плохое соединение
  useEffect(() => {
    const mr = typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
    const nav: any = navigator;
    const conn = nav?.connection || nav?.mozConnection || nav?.webkitConnection;
    const saveData = conn?.saveData || nav?.saveData;

    if (mr && mr.matches) {
      setLoadVideo(false);
      return;
    }
    if (saveData) {
      setLoadVideo(false);
      return;
    }
    // не грузим сразу — включим через IntersectionObserver (ниже)
    setLoadVideo(false);
  }, []);

  // Рассчитать высоту до верхней границы #coffee
  const updateHeight = () => {
    const coffee = document.getElementById("coffee");
    let newH = window.innerHeight; // fallback — 1 экран
    if (coffee) {
      const rect = coffee.getBoundingClientRect();
      const topAbs = Math.max(0, Math.floor(rect.top + window.scrollY));
      newH = topAbs;
    }
    newH = Math.max(minHeight, newH);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => setHeight(newH));
  };

  // Добавляем слушатели и ResizeObserver
  useEffect(() => {
    updateHeight();

    const onResize = () => updateHeight();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    window.addEventListener("load", updateHeight);

    // учёт загрузки веб-шрифтов
    if ((document as any).fonts && (document as any).fonts.ready) {
      (document as any).fonts.ready.then(updateHeight).catch(() => {});
    }

    let ro: ResizeObserver | null = null;
    const coffeeEl = document.getElementById("coffee");
    if (coffeeEl && (window as any).ResizeObserver) {
      ro = new ResizeObserver(() => updateHeight());
      ro.observe(coffeeEl);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.removeEventListener("load", updateHeight);
      if (ro && coffeeEl) ro.unobserve(coffeeEl);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // IntersectionObserver для lazy-load видео
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (loadVideo) return;

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting || e.intersectionRatio > 0) {
              // перед включением проверим снова reduced-motion/save-data/very slow network
              const mr = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
              const nav: any = navigator;
              const conn = nav?.connection || nav?.mozConnection || nav?.webkitConnection;
              const saveData = conn?.saveData || nav?.saveData;
              if ((mr && mr.matches) || saveData || (conn && /2g|slow-2g/i.test(conn.effectiveType || ""))) {
                setLoadVideo(false);
              } else {
                setLoadVideo(true);
              }
              io.disconnect();
              return;
            }
          }
        },
        { root: null, rootMargin: "200px", threshold: 0.01 }
      );
      io.observe(el);
    } else {
      // если IO не поддерживается — сразу грузим (с учётом предыдущих проверок)
      setLoadVideo(true);
    }

    return () => {
      if (io) io.disconnect();
    };
  }, [loadVideo]);

  return (
    <div
      ref={rootRef}
      className="relative w-full overflow-hidden"
      style={{ height: `${height}px`, minHeight: `${minHeight}px` }}
      aria-hidden="true"
    >
      {loadVideo ? (
        <video
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          src={videoSrc}
          poster={poster}
          preload="metadata"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <div
          className="absolute inset-0 bg-center bg-cover pointer-events-none"
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}

      {/* затемнение для контраста (стили описаны ниже) */}
      <div className="video-overlay-dark absolute inset-0 pointer-events-none" />

      {/* нижний плавный fade для перехода к следующему блоку */}
      <div className="video-bottom-blur absolute left-0 right-0 bottom-0 pointer-events-none" />
    </div>
  );
}
