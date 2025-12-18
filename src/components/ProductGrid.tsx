import { Plus, Minus } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { HandDrawnCard } from "./HandDrawnCard";
import { useRef } from "react";
import { BeansCard } from "./BeansCard";
import { CartItem } from "./CartModal";

// --- КОМПОНЕНТ КАРТОЧКИ АДВЕНТ-КАЛЕНДАРЯ (ОБНОВЛЕННЫЙ: ВЕРТИКАЛЬНЫЙ) ---
interface AdventCardProps {
  image: string;
  cartQuantity: number;
  onAddToCart: (name: string, price: number, element: HTMLElement) => void;
  onRemoveFromCart: (name: string) => void;
}

function AdventCard({ image, cartQuantity, onAddToCart, onRemoveFromCart }: AdventCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const name = "Адвент-календарь";
  const price = 3500;

  const handleAddToCart = () => {
    if (cardRef.current) {
      onAddToCart(name, price, cardRef.current);
    }
  };

  return (
    // Убрали w-full, чтобы карточка не пыталась растянуться
    <HandDrawnCard className="group hover:scale-[1.02] transition-transform duration-300 relative h-full flex flex-col">
      <div ref={cardRef} className="flex flex-col h-full">
        
        {/* Изображение - теперь квадратное сверху, как у остальных */}
        <div className="aspect-square overflow-hidden rounded-2xl mb-4 relative">
          <ImageWithFallback
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Бейдж */}
          <div className="absolute top-3 left-3 bg-[#FF6B35] text-white px-2 py-1 rounded-full text-xs font-bold -rotate-2 shadow-md z-10">
            Limited Series
          </div>
        </div>

        {/* Заголовок */}
        <h3 className="display text-[#1E1E1E] text-lg mb-1 leading-tight">
          {name}
        </h3>
        
        {/* Подзаголовок (country style) */}
        <p className="handwritten text-xl text-[#FF6B35] -rotate-2 mb-2 leading-tight">
          Подарок для близких
        </p>

        {/* Описание вместо обработки/веса */}
        <div className="text-xs text-[#666666] mb-4 font-medium leading-relaxed">
          <p className="mb-1">Ограниченная серия.</p>
          <p className="font-bold text-[#1E1E1E]"></p>
        </div>

        {/* Низ: Цена и Кнопка */}
        <div className="flex items-end justify-between mt-auto pt-2">
          <div className="-ml-2 -mb-2">
             <p className="handwritten text-7xl text-[#4A90E2] -rotate-12 font-bold drop-shadow-sm leading-none">
              {price}₽
            </p>
          </div>

          {cartQuantity === 0 ? (
            <button 
              onClick={handleAddToCart}
              className="bg-[#FF6B35] text-white p-2.5 rounded-full hover:bg-[#FF5722] transition-all hover:scale-110 active:scale-95 flex-shrink-0 shadow-sm"
            >
              <Plus className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-[#FF6B35] text-white rounded-full px-2 py-1.5 flex-shrink-0 shadow-sm">
              <button 
                onClick={() => onRemoveFromCart(name)}
                className="hover:scale-110 transition-transform"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-bold text-sm min-w-[20px] text-center">{cartQuantity}</span>
              <button 
                onClick={handleAddToCart}
                className="hover:scale-110 transition-transform"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </HandDrawnCard>
  );
}

// --- КОМПОНЕНТ ОБЫЧНОЙ КАРТОЧКИ (БЕЗ ИЗМЕНЕНИЙ) ---
interface ProductCardProps {
  image: string;
  name: string;
  country: string;
  processing: string;
  quantity: string;
  flavors: string[];
  price: number;
  cartQuantity: number;
  onAddToCart: (name: string, price: number, element: HTMLElement) => void;
  onRemoveFromCart: (name: string) => void;
}

export function ProductCard({ image, name, country, processing, quantity, flavors, price, cartQuantity, onAddToCart, onRemoveFromCart }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleAddToCart = () => {
    if (cardRef.current) {
      onAddToCart(name, price, cardRef.current);
    }
  };

  return (
    <HandDrawnCard className="group hover:scale-[1.02] transition-transform duration-300 relative h-full flex flex-col">
      <div ref={cardRef} className="flex flex-col h-full">
        <div className="aspect-square overflow-hidden rounded-2xl mb-4">
          <ImageWithFallback
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <h4 className="display text-[#1E1E1E] mb-1 leading-tight text-lg">
          {name}
        </h4>
        <p className="handwritten text-2xl text-[#FF6B35] -rotate-2 mb-1">
          {country}
        </p>
        <p className="handwritten text-xl text-[#666666] -rotate-1 mb-2">
          {processing}
        </p>
        <p className="text-xs text-[#666666] mb-3 font-bold">{quantity}</p>
        <div className="mb-auto pb-4">
          <p className="text-xs text-[#999999] mb-2 font-bold">Вкус:</p>
          <div className="flex flex-wrap gap-2">
            {flavors.map((flavor, index) => (
              <span key={index} className="text-xs px-2 py-1 bg-white text-[#FF6B35] rounded-full font-bold">
                {flavor}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-end justify-between pt-4 mt-auto">
          <div className="-ml-2 -mb-2">
            <p className="handwritten text-7xl text-[#4A90E2] -rotate-12 font-bold drop-shadow-sm leading-none">
              {price}₽
            </p>
          </div>
          {cartQuantity === 0 ? (
            <button 
              onClick={handleAddToCart}
              className="bg-[#FF6B35] text-white p-2.5 rounded-full hover:bg-[#FF5722] transition-all hover:scale-110 active:scale-95 flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-[#FF6B35] text-white rounded-full px-2 py-1.5 flex-shrink-0">
              <button onClick={() => onRemoveFromCart(name)} className="hover:scale-110 transition-transform">
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-bold text-sm min-w-[20px] text-center">{cartQuantity}</span>
              <button onClick={handleAddToCart} className="hover:scale-110 transition-transform">
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </HandDrawnCard>
  );
}

// --- ДАННЫЕ ПРОДУКТОВ ---
const beansProducts = [
  {
    image: "ethiopia.jpg",
    name: "Эфиопия Буле Хора",
    processing: "Мытая обработка",
    weight: "200 г",
    flavors: ["Цитрус", "Ягоды", "Цветы"],
    price: 850,
  },
  {
    image: "columbia.jpg",
    name: "Колумбия Манзана",
    processing: "Мытая обработка",
    weight: "200 г",
    flavors: ["Шоколад", "Цитрус", "Карамель"],
    price: 850,
  },
  {
    image: "rwanda.jpg",
    name: "Руанда Гашару",
    processing: "Мытая обработка",
    weight: "200 г",
    flavors: ["Орех", "Шоколад", "Карамель"],
    price: 850,
  },
];

const dripProducts = [
  {
    image: "dripethopia.jpg",
    name: "Эфиопия",
    country: "Мытая обработка",
    quantity: "дрип-пакет",
    flavors: ["Цитрус", "Ягоды", "Цветы"],
    price: 130,
  },
  {
    image: "dripkostarica.jpg",
    name: "Коста-Рика",
    country: "Мытая обработка",
    quantity: "дрип-пакет",
    flavors: ["Шоколад", "Цитрус", "Карамель"],
    price: 130,
  },
  {
    image: "dripguatemala.jpg",
    name: "Гватемала",
    country: "Мытая обработка",
    quantity: "дрип-пакет",
    flavors: ["Орех", "Шоколад", "Карамель"],
    price: 130,
  },
];

// --- ГЛАВНЫЙ КОМПОНЕНТ СЕТКИ ---
interface ProductGridProps {
  cart: CartItem[];
  onAddToCart: (name: string, price: number, grindType: string | undefined, element: HTMLElement) => void;
  onRemoveFromCart: (name: string, grindType?: string) => void;
}

export function ProductGrid({ cart, onAddToCart, onRemoveFromCart }: ProductGridProps) {
  const getCartQuantity = (name: string, grindType?: string) => {
    const itemId = grindType ? `${name}-${grindType}` : name;
    const item = cart.find(i => i.id === itemId || i.name === name);
    return item ? item.quantity : 0;
  };

  return (
    <section id="products" className="py-12 px-6 bg-white">
      <div className="max-w-[1400px] mx-auto">
        
        {/* ========================================== */}
        {/* НОВАЯ СЕКЦИЯ: АДВЕНТ КАЛЕНДАРЬ */}
        {/* ========================================== */}
        {/* Изменен отступ с mb-32 на mb-16, чтобы не было гигантской дыры, но и не прилипало */}
        <div className="mb-16"> 
          <div className="mb-8 text-center">
            <h2 className="display text-[#1E1E1E] mb-2">
              НОВЫЙ ГОД
            </h2>
            <p className="handwritten text-3xl text-[#FF6B35] -rotate-1 inline-block">
              успейте заказать подарок
            </p>
          </div>

          <div className="grid grid-cols-8 gap-6">
            {/* ИЗМЕНЕНИЯ В СЕТКЕ:
               1. col-span-8 sm:col-span-4 lg:col-span-2 -> Стандартный размер карточки (как у других товаров).
               2. lg:col-start-4 -> Центрирование карточки на больших экранах (смещение к центру сетки).
               На мобильных она будет занимать всю ширину, на планшетах половину.
            */}
            <div className="col-span-8 sm:col-span-4 sm:col-start-3 lg:col-span-2 lg:col-start-4 h-auto">
              <AdventCard 
                image="advent.jpg"
                cartQuantity={getCartQuantity("Адвент-календарь")}
                onAddToCart={(name, price, element) => onAddToCart(name, price, undefined, element)}
                onRemoveFromCart={(name) => onRemoveFromCart(name)}
              />
            </div>
          </div>
        </div>
        {/* ========================================== */}


        {/* Beans section */}
        <div className="mb-16">
          <div className="mb-10 text-center">
            <h2 className="display text-[#1E1E1E] mb-2">
              ЗЕРНОВОЙ КОФЕ
            </h2>
            <p className="handwritten text-4xl text-[#FF6B35] -rotate-2 inline-block">
              выберите помол под ваш способ приготовления
            </p>
          </div>
          
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

        {/* Drip section */}
        <div>
          <div className="mb-10 text-center">
            <h2 className="display text-[#1E1E1E] mb-2">
              ДРИП-ПАКЕТЫ
            </h2>
            <p className="handwritten text-4xl text-[#FF6B35] -rotate-2 inline-block">
              удобно заваривать где угодно
            </p>
          </div>
          
          <div className="grid grid-cols-8 gap-6">
            {dripProducts.map((product, index) => (
              <div key={index} className="col-span-8 sm:col-span-4 lg:col-span-2">
                <ProductCard 
                  {...product}
                  processing={product.country}
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

