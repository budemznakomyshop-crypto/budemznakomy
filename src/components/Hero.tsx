import React, { useEffect, useRef, useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

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
  const videoRef = useRef<HTMLVideoElement | null>(null); // ⬅️ ДОБАВЛЕНО: Ссылка на видео-элемент
  const rafRef = useRef<number | null>(null);
  const [height, setHeight] = useState<number>(800);
  const [loadVideo, setLoadVideo] = useState<boolean>(false);

  // --- 1. Проверка условий для загрузки видео ---
  useEffect(() => {
    if (typeof window === "undefined") return;
    setHeight(window.innerHeight);

    const mr = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    const nav: any = navigator;
    const conn = nav?.connection || nav?.mozConnection || nav?.webkitConnection;
    const saveData = conn?.saveData || nav?.saveData;

    if ((mr && mr.matches) || saveData) {
      setLoadVideo(false);
    } else {
      setLoadVideo(false);
    }
  }, []);

  // --- 2. Обновление высоты (логика "прилипания" к блоку #coffee) ---
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

  // --- 3. Lazy Load видео ---
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

  // 💥 4. ХАК ДЛЯ IPHONE (Принудительный запуск через JS) 💥
  useEffect(() => {
    if (loadVideo && videoRef.current) {
        const video = videoRef.current;
        
        // 1. Принудительно устанавливаем свойства для iOS
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;

        // 2. Пытаемся запустить
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch((error) => {
                // Если запуск не удался (например, Low Power Mode), это нормально
                console.warn("Autoplay blocked by browser policy:", error); 
            });
        }
    }
  }, [loadVideo]);

  // --- 5. Скролл к контенту ---
  const scrollToContent = () => {
    const coffee = document.getElementById("coffee");
    if (coffee) {
      coffee.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: height, behavior: "smooth" });
    }
  };

  return (
    <div
      ref={rootRef}
      className="relative w-full overflow-hidden bg-black"
      style={{ height: `${height}px`, minHeight: `${minHeight}px` }}
    >
      {loadVideo ? (
        <video
          ref={videoRef} // ⬅️ ДОБАВЛЕНО: Привязываем ref к видео
          className="absolute inset-0 w-full h-full object-cover"
          src={videoSrc} // ⬅️ Использует вашу ссылку на CDN
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

      {/* Затемнение (Overlay) */}
      <div className="video-overlay-dark absolute inset-0 pointer-events-none" />

      {/* Контент (Навигация) */}
      <div className="relative z-20 w-full h-full">
        {children}
      </div>

      {/* 🚀 СТРЕЛКА ВНИЗ */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 group focus:outline-none"
        aria-label="Scroll down"
      >
        <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg group-hover:bg-white/20 transition-all duration-300">
          <ChevronDown className="w-8 h-8 text-white animate-bounce-slow drop-shadow-md" />
        </div>
      </button>
    </div>
  );
}

