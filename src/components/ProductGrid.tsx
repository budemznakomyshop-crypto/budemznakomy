import { ProductCard } from "./ProductCard";
import { BeansCard } from "./BeansCard";
import { CartItem } from "./CartModal";

interface ProductGridProps {
  cart: CartItem[];
  onAddToCart: (name: string, price: number, grindType: string | undefined, element: HTMLElement) => void;
  onRemoveFromCart: (name: string, grindType?: string) => void;
}

const beansProducts = [
  {
    image: "ethiopia.jpg",
    name: "Эфиопия Арричи",
    processing: "Мытая обработка",
    weight: "250 г",
    flavors: ["Цитрус", "Ягоды", "Цветы"],
    price: 680,
  },
  {
    image: "kostarica.jpg",
    name: "Коста-Рика Тарразу",
    processing: "Мытая обработка",
    weight: "250 г",
    flavors: ["Мёд", "Яблоко", "Миндаль"],
    price: 620,
  },
];

const dripProducts = [
  {
    image: "dripkostarica.jpg",
    name: "Коста-Рика Торразу",
    country: "Мытая обработка",
    quantity: "дрип-пакет",
    flavors: ["Шоколад", "Карамель", "Орех"],
    price: 130,
  },
  {
    image: "dripethopia.jpg",
    name: "Эфиопия Арричи",
    country: "Мытая обработка",
    quantity: "дрип-пакет",
    flavors: ["Цитрус", "Ягоды", "Цветы"],
    price: 130,
  },
];

export function ProductGrid({ cart, onAddToCart, onRemoveFromCart }: ProductGridProps) {
  const getCartQuantity = (name: string, grindType?: string) => {
    const itemId = grindType ? `${name}-${grindType}` : name;
    const item = cart.find(i => i.id === itemId || i.name === name);
    return item ? item.quantity : 0;
  };

  return (
    <section id="products" className="py-12 px-6 bg-white">
      <div className="max-w-[1400px] mx-auto">
        {/* Beans section - теперь первым */}
        <div className="mb-16">
          <div className="mb-10 text-center">
            <h2 className="display text-[#1E1E1E] mb-2">
              ЗЕРНОВОЙ КОФЕ
            </h2>
            <p className="handwritten text-4xl text-[#FF6B35] -rotate-2 inline-block">
              выберите помол под ваш способ приготовления
            </p>
          </div>
          
          {/* 8-column grid - 4 products per row */}
          <div className="grid grid-cols-8 gap-6">
            {beansProducts.map((product, index) => (
              <div key={index} className="col-span-8 sm:col-span-4 lg:col-span-2">
                <BeansCard 
                  {...product} 
                  cartQuantity={getCartQuantity(product.name, "whole")}
                  onAddToCart={onAddToCart}
                  onRemoveFromCart={onRemoveFromCart}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Drip section - теперь вторым */}
        <div>
          <div className="mb-10 text-center">
            <h2 className="display text-[#1E1E1E] mb-2">
              ДРИП-ПАКЕТЫ
            </h2>
            <p className="handwritten text-4xl text-[#FF6B35] -rotate-2 inline-block">
              удобно заваривать где угодно
            </p>
          </div>
          
          {/* 8-column grid - 4 products per row */}
          <div className="grid grid-cols-8 gap-6">
            {dripProducts.map((product, index) => (
              <div key={index} className="col-span-8 sm:col-span-4 lg:col-span-2">
                <ProductCard 
                  {...product}
                  cartQuantity={getCartQuantity(product.name)}
                  onAddToCart={(name, price, element) => onAddToCart(name, price, undefined, element)} 
                  onRemoveFromCart={(name) => onRemoveFromCart(name)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
