import { useState, useRef } from "react";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { ProductGrid } from "./components/ProductGrid";
import { FAQ } from "./components/FAQ";
import { Footer } from "./components/Footer";
import { CartModal, CartItem } from "./components/CartModal";
import { OrderModal } from "./components/OrderModal";

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const productsRef = useRef<HTMLDivElement>(null);

  const addToCart = (
    name: string,
    price: number,
    grindType: string | undefined,
    element: HTMLElement
  ) => {
    const itemId = grindType ? `${name}-${grindType}` : name;

    // Анимация полёта в корзину
    const rect = element.getBoundingClientRect();
    const cartButton = document.querySelector("[data-cart-button]");

    if (cartButton) {
      const cartRect = cartButton.getBoundingClientRect();
      const clone = element.cloneNode(true) as HTMLElement;

      clone.style.position = "fixed";
      clone.style.top = `${rect.top}px`;
      clone.style.left = `${rect.left}px`;
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.zIndex = "9999";
      clone.style.pointerEvents = "none";
      clone.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";

      document.body.appendChild(clone);

      setTimeout(() => {
        clone.style.transform = `translate(${cartRect.left - rect.left}px, ${
          cartRect.top - rect.top
        }px) scale(0.1)`;
        clone.style.opacity = "0";
      }, 50);

      setTimeout(() => {
        document.body.removeChild(clone);
      }, 850);
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);

      if (existing) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { id: itemId, name, price, quantity: 1, grindType }];
    });
  };

  const removeFromCart = (name: string, grindType?: string) => {
    const itemId = grindType ? `${name}-${grindType}` : name;

    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === itemId || item.name === name
      );
      if (!existing) return prev;

      if (existing.quantity > 1) {
        return prev.map((item) =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }

      return prev.filter((item) => item.id !== existing.id);
    });
  };

  const removeItemCompletely = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsOrderModalOpen(true);
  };

  const handleOrderComplete = () => {
    setCart([]);
  };

  const handleBuyClick = () => {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cartCount > 0) {
      setIsCartOpen(true);
    } else {
      productsRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* HERO */}
      <Hero>
        <Navigation
          onBuyClick={handleBuyClick}
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          onCartClick={() => setIsCartOpen(true)}
        />
      </Hero>

      {/* 🔑 КЛЮЧ: физический отступ после Hero */}
      <div
        ref={productsRef}
        id="coffee"
        className="relative z-10 mt-40"
      >
        <ProductGrid
          cart={cart}
          onAddToCart={addToCart}
          onRemoveFromCart={removeFromCart}
        />
      </div>

      <FAQ />
      <Footer />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemoveItem={removeItemCompletely}
        onCheckout={handleCheckout}
      />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        items={cart}
        total={total}
        onOrderComplete={handleOrderComplete}
      />
    </div>
  );
}
