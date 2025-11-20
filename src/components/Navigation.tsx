import React, { useEffect, useRef, useState } from "react";
import { ShoppingCart, MapPin, Phone, Clock, X, Navigation as NavigationIcon } from "lucide-react";
interface NavigationProps {
  onBuyClick: () => void;
  cartCount: number;
  onCartClick: () => void;
  menus?: {
    rizhskiy?: React.ReactNode;
    maly?: React.ReactNode;
  };
}
// Типы для выбора карт
type LocationKey = "rizhskiy" | "maly";
type ModalType = LocationKey | "map-rizhskiy" | "map-maly" | null;
function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastActive = useRef<HTMLElement | null>(null);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const el = dialogRef.current;
        if (!el) return;
        const focusable = el.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    if (open) {
      lastActive.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", onKey);
      setTimeout(() => dialogRef.current?.focus(), 0);
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      lastActive.current?.focus();
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || "Модальное окно"}
        tabIndex={-1}
        ref={dialogRef}
        className="relative z-10 max-w-md w-full bg-white rounded-2xl shadow-xl p-6 mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
export function Navigation({ onBuyClick, cartCount, onCartClick, menus }: NavigationProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const mapLinks = {
    rizhskiy: [
      { name: "Яндекс Карты", url: "https://yandex.ru/maps/?text=Санкт-Петербург+Рижский+проспект+2" },
      { name: "Google Maps", url: "https://www.google.com/maps/search/?api=1&query=Saint+Petersburg+Rizhsky+prospekt+2" },
      { name: "2ГИС", url: "https://2gis.ru/spb/search/Рижский%20проспект%202" },
    ],
    maly: [
      { name: "Яндекс Карты", url: "https://yandex.ru/maps/?text=Санкт-Петербург+Малый+проспект+П.С.+60/19" },
      { name: "Google Maps", url: "https://www.google.com/maps/search/?api=1&query=Saint+Petersburg+Maly+prospekt+PS+60" },
      { name: "2ГИС", url: "https://2gis.ru/spb/search/Малый%20проспект%20П.С.%2060" },
    ]
  };
  const defaultMenus = {
    rizhskiy: (
      <div className="w-full flex justify-center">
        <img
          src="menu-rizhskiy.jpg"
          alt="Меню — Рижский пр-т, 2"
          loading="lazy"
          className="max-w-full max-h-[66vh] object-contain rounded-xl shadow-lg"
        />
      </div>
    ),
    maly: (
      <div className="w-full flex justify-center">
        <img
          src="menu-maly.jpg"
          alt="Меню — Малый пр-т П.С., 60/19"
          loading="lazy"
          className="max-w-full max-h-[66vh] object-contain rounded-xl shadow-lg"
        />
      </div>
    ),
  } as const;
  const getMenuContent = (key: LocationKey) => {
    return (menus && menus[key]) || defaultMenus[key];
  };
  const renderModalContent = () => {
    if (!activeModal) return null;
    if (activeModal === "map-rizhskiy" || activeModal === "map-maly") {
      const locKey = activeModal === "map-rizhskiy" ? "rizhskiy" : "maly";
      const links = mapLinks[locKey];
      return (
        <div className="flex flex-col gap-3 py-2">
          <p className="text-sm text-gray-600 mb-2">Выберите приложение для построения маршрута:</p>
          {links.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl border hover:border-[#4A90E2] hover:text-[#4A90E2] hover:bg-blue-50 transition-all group"
            >
              <span className="font-bold">{link.name}</span>
              <NavigationIcon className="w-5 h-5 text-gray-400 group-hover:text-[#4A90E2]" />
            </a>
          ))}
        </div>
      );
    }
    return getMenuContent(activeModal as LocationKey);
  };
  const getModalTitle = () => {
    switch (activeModal) {
      case "rizhskiy": return "Меню — Рижский пр-т, 2";
      case "maly": return "Меню — Малый пр-т П.С., 60/19";
      case "map-rizhskiy": return "Маршрут на Рижский пр-т, 2";
      case "map-maly": return "Маршрут на Малый пр-т П.С.";
      default: return "";
    }
  };
  return (
    <nav className="py-8 relative">
      {/* ФИКСИРОВАННЫЕ КНОПКИ */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        {/* Кнопка "Купить зерна" с оранжевой тенью */}
        <button
          onClick={onBuyClick}
          className="bg-[#FF6B35] text-white px-4 py-2 rounded-full font-bold hover:bg-white hover:text-[#FF6B35] transition-colors border-2 border-[#FF6B35] text-xs md:text-sm uppercase tracking-wider whitespace-nowrap shadow-lg shadow-[#FF6B35]/50"
        >
          Купить зерна
        </button>
        <button
          onClick={onCartClick}
          className="relative group p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all"
          aria-label="Открыть корзину"
        >
          <ShoppingCart className="w-6 h-6 text-[#FF6B35]" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#FF6B35] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse border-2 border-[#1e1e1e]">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Spacer — чтобы отодвинуть весь блок навигации чуть ниже.
          Не влияет на фиксированные кнопки. */}
      <div className="h-6 md:h-12 lg:h-16" aria-hidden="true" />

      {/* Основной контейнер: добавлен верхний отступ (mt-*) для точной подгонки */}
      <div className="max-w-[1400px] mx-auto px-6 mt-6 md:mt-10 lg:mt-12">
        <div className="grid grid-cols-8 gap-6 mb-8">
          <div className="col-span-8">
            <h1 className="display text-white mb-2">БУДЕМ ЗНАКОМЫ</h1>
            <p className="handwritten text-4xl text-[#FF6B35] -rotate-2 inline-block">Семейная кофейня в Петербурге</p>
          </div>
        </div>
        <div className="grid grid-cols-8 gap-6">
          <div className="col-span-8">
            <div className="flex flex-wrap items-start justify-between gap-6 p-4">
              <div className="flex flex-wrap gap-6">
                
                {/* location 1: Рижский */}
                <div>
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-[#FF6B35] flex-shrink-0 mt-1" />
                    <div>
                      {/* Ссылка-адрес с оранжевым ховером */}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveModal("map-rizhskiy");
                        }}
                        className="text-left transition-colors text-white hover:text-[#FF6B35] text-sm font-bold mb-1"
                      >
                        Рижский пр-т, 2 &gt;
                      </a>
                    
                      <p className="text-xs text-[#666666] flex items-center gap-1 mb-2">
                        <Clock className="w-3 h-3" /> Пн–Пт: 9–20, Сб–Вс: 10–20
                      </p>
                      {/* Кнопка "Меню" с обводкой */}
                      <button
                        type="button"
                        onClick={() => setActiveModal("rizhskiy")}
                        className="inline-block border-2 border-white text-white px-3 py-1 rounded-full hover:bg-white hover:text-[#FF6B35] transition-all text-xs font-bold"
                      >
                        Меню
                      </button>
                    </div>
                  </div>
                </div>
                {/* location 2: Малый */}
                <div>
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-[#FF6B35] flex-shrink-0 mt-1" />
                    <div>
                      {/* Ссылка-адрес с оранжевым ховером */}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveModal("map-maly");
                        }}
                        className="text-left transition-colors text-white hover:text-[#FF6B35] text-sm font-bold mb-1"
                      >
                        Малый пр-т П.С., 60/19 &gt;
                      </a>
                      <p className="text-xs text-[#666666] flex items-center gap-1 mb-2">
                        <Clock className="w-3 h-3" /> Пн–Пт: 9–21, Сб–Вс: 10–21
                      </p>
                      {/* Кнопка "Меню" с обводкой */}
                      <button
                        type="button"
                        onClick={() => setActiveModal("maly")}
                        className="inline-block border-2 border-white text-white px-3 py-1 rounded-full hover:bg-white hover:text-[#FF6B35] transition-all text-xs font-bold"
                      >
                        Меню
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start gap-3">
                <div className="flex flex-wrap gap-3">
                  <a href="https://t.me/budemznakomycoffee" target="_blank" rel="noopener noreferrer" className="border-2 border-[#FF6B35] text-[#FF6B35] px-4 py-2 rounded-full hover:bg-[#FF6B35] hover:text-white transition-all hover:scale-105 font-bold text-xs">Telegram</a>
                  <a href="https://vk.com/budemznakomycoffee" target="_blank" rel="noopener noreferrer" className="border-2 border-[#FF6B35] text-[#FF6B35] px-4 py-2 rounded-full hover:bg-[#FF6B35] hover:text-white transition-all hover:scale-105 font-bold text-xs">VK</a>
                </div>
                {/* Номер телефона */}
                <a href="tel:+79817175842" className="flex items-center gap-2 text-white hover:text-[#FF6B35] transition-colors" aria-label="Позвонить">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm font-bold">+7 981 717 58 42</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={activeModal !== null}
        onClose={() => setActiveModal(null)}
        title={getModalTitle()}
      >
        {renderModalContent()}
      </Modal>
    </nav>
  );
}
