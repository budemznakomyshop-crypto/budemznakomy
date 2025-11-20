import React, { useEffect, useRef, useState, ReactNode } from "react";
// Импорт иконки больше не нужен здесь

type HeroProps = {
  videoSrc?: string;
  poster?: string;
  minHeight?: number;
  children?: ReactNode;
};

export function Hero({
  videoSrc = "https://res.cloudinary.com/dnvphtopq/video/upload/v1763573487/video_u4utvf.mp4",
  poster = "video-poster.jpg",
  minHeight = 240,
  children,
}: HeroProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [height, setHeight] = useState<number>(800);
  const [loadVideo, setLoadVideo] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setHeight(window.innerHeight);
    const mr = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    const nav: any = navigator;
    const saveData = nav?.connection?.saveData || nav?.saveData;
    if ((mr && mr.matches) || saveData) {
      setLoadVideo(false);
    } else {
      setLoadVideo(false);
    }
  }, []);

  const updateHeight = () => {
    if (typeof window === "undefined") return;
    const coffee = document.getElementById("coffee");
    let newH = window.innerHeight;
    if (coffee) {
      const rect = coffee.getBoundingClientRect();
      const topAbs = Math.max(0, Math.floor(rect.top + window.scrollY));
      newH = topAbs > 0 ? topAbs : newH;
    }
    newH = Math.max(minHeight, newH);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => setHeight(newH));
  };

  useEffect(() => {
    updateHeight();
    const onResize = () => updateHeight();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    window.addEventListener("load", updateHeight);
    let ro: ResizeObserver | null = null;
    const coffeeEl = document.getElementById("coffee");
    if (coffeeEl && window.ResizeObserver) {
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
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || loadVideo) return;
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setLoadVideo(true);
              io.disconnect();
            }
          });
        },
        { rootMargin: "200px" }
      );
      io.observe(el);
      return () => io.disconnect();
    } else {
      setLoadVideo(true);
    }
  }, [loadVideo]);

  useEffect(() => {
    if (loadVideo && videoRef.current) {
        const video = videoRef.current;
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {});
        }
    }
  }, [loadVideo]);

  return (
    <div
      ref={rootRef}
      className="relative w-full overflow-hidden bg-black"
      style={{ height: `${height}px`, minHeight: `${minHeight}px` }}
    >
      {loadVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
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
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}
      <div className="video-overlay-dark absolute inset-0 pointer-events-none" />
      <div className="relative z-20 w-full h-full">
        {children}
      </div>
      {/* ЗДЕСЬ БОЛЬШЕ НЕТ СТРЕЛКИ */}
    </div>
  );
}

