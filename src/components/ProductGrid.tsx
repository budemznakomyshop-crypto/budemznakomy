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
    image: "https://images.unsplash.com/photo-1663911278520-0fa05ff61eaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzYyODMyNzUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    name: "Эфиопия Арричи",
    processing: "Мытая обработка",
    weight: "250 г",
    flavors: ["Цитрус", "Ягоды", "Цветы"],
    price: 680,
  },
  {
    image: "https://images.unsplash.com/photo-1663911278520-0fa05ff61eaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzYyODMyNzUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    name: "Коста-Рика Тарразу",
    processing: "Мытая обработка",
    weight: "250 г",
    flavors: ["Мёд", "Яблоко", "Миндаль"],
    price: 620,
  },
];

const dripProducts = [
  {
    image: "https://images.unsplash.com/photo-1512372388054-a322888e67a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmlwJTIwY29mZmVlJTIwYmFnJTIwcGFja2FnZXxlbnwxfHx8fDE3NjI4NjQ3NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    name: "Колумбия Хорхе",
    country: "Колумбия",
    processing: "Мытая обработка",
    quantity: "10 дрип-пакетов",
    flavors: ["Шоколад", "Карамель", "Орех"],
    price: 890,
  },
  {
    image: "https://images.unsplash.com/photo-1760307256225-59037ef0eb83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY29mZmVlJTIwYmVhbnN8ZW58MXx8fHwxNzYyODY0NzU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    name: "Эфиопия Арричи",
    country: "Эфиопия",
    processing: "Мытая обработка",
    quantity: "10 дрип-пакетов",
    flavors: ["Цитрус", "Ягоды", "Цветы"],
    price: 950,
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
