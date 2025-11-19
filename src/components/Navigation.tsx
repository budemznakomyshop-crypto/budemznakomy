import React, { useEffect, useRef, useState } from "react";
import { ShoppingCart, MapPin, Phone, Clock, X } from "lucide-react";

interface NavigationProps {
  onBuyClick: () => void;
  cartCount: number;
  onCartClick: () => void;
  /**
   * Optional override for menu contents. If not provided, component will render
   * default images from `/public` (menu-rizhskiy.jpg / menu-maly.jpg).
   */
  menus?: {
    rizhskiy?: React.ReactNode;
    maly?: React.ReactNode;
  };
}

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
        // minimal focus trap
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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || "Меню"}
        tabIndex={-1}
        ref={dialogRef}
        className="relative z-10 max-w-4xl w-full bg-white rounded-2xl shadow-xl p-6 mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-auto flex items-center justify-center">
          {children}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full border font-bold"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

export function Navigation({ onBuyClick, cartCount, onCartClick, menus }: NavigationProps) {
  const [openMenu, setOpenMenu] = useState<null | "rizhskiy" | "maly">(null);

  // default content: images from public/
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

  const getMenuContent = (key: "rizhskiy" | "maly") => {
    return (menus && menus[key]) || defaultMenus[key];
  };

  return (
    <nav className="py-8">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* grid */}
        <div className="grid grid-cols-8 gap-6 mb-8">
          <div className="col-span-8 lg:col-span-6">
            <h1 className="display text-white mb-2">БУДЕМ ЗНАКОМЫ</h1>
            <p className="handwritten text-4xl text-[#FF6B35] -rotate-2 inline-block">Семейная кофейня в Петербурге</p>
          </div>

          <div className="col-span-8 lg:col-span-2 flex items-center justify-end gap-3">
            <button
              onClick={onCartClick}
              className="fixed top-4 right-4 z-50 group"
              data-cart-button
              aria-label="Открыть корзину"
            >
              <ShoppingCart className="w-6 h-6 text-[#1E1E1E] group-hover:text-[#FF6B35] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF6B35] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-8 gap-6">
          <div className="col-span-8">
            <div className="flex flex-wrap items-start justify-between gap-6 p-4">
              <div className="flex flex-wrap gap-6">
                {/* location 1 */}
                <div>
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-[#FF6B35] flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-bold text-white mb-1">Рижский пр-т, 2</p>
                      <p className="text-xs text-[#666666] flex items-center gap-1 mb-2">
                        <Clock className="w-3 h-3" /> Пн–Пт: 9–20, Сб–Вс: 10–20
                      </p>

                      <button
                        type="button"
                        onClick={() => setOpenMenu("rizhskiy")}
                        className="inline-block border-2 border-white text-white px-3 py-1 rounded-full hover:bg-white hover:text-white transition-all text-xs font-bold"
                      >
                        Меню
                      </button>
                    </div>
                  </div>
                </div>

                {/* location 2 */}
                <div>
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-[#FF6B35] flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-bold text-white mb-1">Малый пр-т П.С., 60/19</p>
                      <p className="text-xs text-[#666666] flex items-center gap-1 mb-2">
                        <Clock className="w-3 h-3" /> Пн–Пт: 9–21, Сб–Вс: 10–21
                      </p>

                      <button
                        type="button"
                        onClick={() => setOpenMenu("maly")}
                        className="inline-block border-2 border-white text-white px-3 py-1 rounded-full hover:bg-white hover:text-white transition-all text-xs font-bold"
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
                  <a href="https://instagram.com/budemznakomycoffee" target="_blank" rel="noopener noreferrer" className="border-2 border-[#FF6B35] text-[#FF6B35] px-4 py-2 rounded-full hover:bg-[#FF6B35] hover:text-white transition-all hover:scale-105 font-bold text-xs">Instagram</a>
                </div>

                <a href="tel:+79817175842" className="flex items-center gap-2 text-white hover:text-[#FF6B35] transition-colors" aria-label="Позвонить">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm font-bold">+7 981 717 58 42</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* modal */}
      <Modal
        open={openMenu !== null}
        onClose={() => setOpenMenu(null)}
        title={
          openMenu === "rizhskiy" ? "Меню — Рижский пр-т, 2" : "Меню — Малый пр-т П.С., 60/19"
        }
      >
        {openMenu ? getMenuContent(openMenu) : null}
      </Modal>
    </nav>
  );
}
