import React, { useEffect, useRef, useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type HeroProps = {
  videoSrc?: string;
  poster?: string;
  minHeight?: number;
  children?: ReactNode;
};

export function Hero({
  videoSrc = "video.mp4",
  poster = "video-poster.jpg",
  minHeight = 240,
  children,
}: HeroProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [height, setHeight] = useState<number>(800); // Начальная высота, обновится на клиенте
  const [loadVideo, setLoadVideo] = useState<boolean>(false);

  // --- 1. Проверка условий для загрузки видео ---
  useEffect(() => {
    // Если это SSR (серверный рендеринг), ничего не делаем
    if (typeof window === "undefined") return;
    
    setHeight(window.innerHeight); // Сразу ставим высоту окна

    const mr = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    const nav: any = navigator;
    const conn = nav?.connection || nav?.mozConnection || nav?.webkitConnection;
    const saveData = conn?.saveData || nav?.saveData;

    if ((mr && mr.matches) || saveData) {
      setLoadVideo(false);
    } else {
      // По умолчанию false, включится через Observer ниже
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
      // Вычисляем абсолютную позицию верха блока #coffee
      const topAbs = Math.max(0, Math.floor(rect.top + window.scrollY));
      // Если мы еще не проскроллили далеко, Hero занимает место до #coffee
      // Но не меньше minHeight
      newH = topAbs > 0 ? topAbs : newH;
    }
    
    // Гарантируем минимальную высоту
    newH = Math.max(minHeight, newH);
    
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => setHeight(newH));
  };

  useEffect(() => {
    updateHeight();
    const onResize = () => updateHeight();
    
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    window.addEventListener("load", updateHeight); // Важно для полной загрузки

    // ResizeObserver для надежности
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

  // --- 4. Скролл к контенту ---
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
      className="relative w-full overflow-hidden bg-black" // Добавил bg-black на случай задержки загрузки
      style={{ height: `${height}px`, minHeight: `${minHeight}px` }}
    >
      {loadVideo ? (
        <video
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

      {/* Затемнение (Overlay) */}
      <div className="video-overlay-dark absolute inset-0 pointer-events-none" />

      {/* --- МЕСТО, ГДЕ БЫЛ video-bottom-blur (УДАЛЕНО) --- */}

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
        {/* Круглая подложка для гарантии видимости на любом фоне */}
        <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg group-hover:bg-white/20 transition-all duration-300">
          <ChevronDown className="w-8 h-8 text-white animate-bounce-slow drop-shadow-md" />
        </div>
      </button>
    </div>
  );
}

