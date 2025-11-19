import { Plus, Minus } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { HandDrawnCard } from "./HandDrawnCard";
import { useState, useRef } from "react";

interface BeansCardProps {
  image: string;
  name: string;
  processing: string;
  weight: string;
  flavors: string[];
  price: number;
  cartQuantity: number;
  onAddToCart: (name: string, price: number, grindType: string, element: HTMLElement) => void;
  onRemoveFromCart: (name: string, grindType: string) => void;
}

export function BeansCard({ image, name, processing, weight, flavors, price, cartQuantity, onAddToCart, onRemoveFromCart }: BeansCardProps) {
  const [grindType, setGrindType] = useState<string>("whole");
  const cardRef = useRef<HTMLDivElement>(null);

  const grindOptions = [
    { value: "whole", label: "Зерно" },
    { value: "espresso", label: "Эспрессо" },
    { value: "filter", label: "Фильтр" },
    { value: "french-press", label: "Френч-пресс" },
    { value: "turkish", label: "Турка" },
  ];

  const handleAddToCart = () => {
    if (cardRef.current) {
      onAddToCart(`${name} (${grindOptions.find(o => o.value === grindType)?.label})`, price, grindType, cardRef.current);
    }
  };

  const handleRemove = () => {
    onRemoveFromCart(name, grindType);
  };

  return (
    <HandDrawnCard className="group hover:scale-[1.02] transition-transform duration-300 relative h-full flex flex-col">
      <div ref={cardRef} className="flex flex-col h-full">
        {/* Image */}
        <div className="aspect-square overflow-hidden rounded-2xl mb-4">
          <ImageWithFallback
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Title */}
        <h4 className="display text-[#1E1E1E] mb-1 leading-tight text-lg">
          {name}
        </h4>
        
        <p className="handwritten text-2xl text-[#FF6B35] -rotate-2 mb-2">
          {processing}
        </p>

        <p className="text-xs text-[#666666] mb-3 font-bold">{weight}</p>

        {/* Flavor notes */}
        <div className="mb-4">
          <p className="text-xs text-[#999999] mb-2 font-bold">Вкус:</p>
          <div className="flex flex-wrap gap-2">
            {flavors.map((flavor, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-white text-[#FF6B35] rounded-full font-bold"
              >
                {flavor}
              </span>
            ))}
          </div>
        </div>

        {/* Grind selection */}
        <div className="mb-auto pb-4">
          <p className="text-xs text-[#999999] mb-2 font-bold">Помол:</p>
          <div className="flex flex-wrap gap-1.5">
            {grindOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setGrindType(option.value)}
                className={`text-xs px-2 py-1 rounded-full transition-all font-bold ${
                  grindType === option.value
                    ? 'bg-[#FF6B35] text-white'
                    : 'bg-white text-[#666666] hover:bg-[#FFE5DC]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom: Price left, Button right */}
        <div className="flex items-end justify-between pt-4 mt-auto">
          {/* Price - bottom left, larger, slightly outside */}
          <div className="-ml-2 -mb-2">
            <p className="handwritten text-7xl text-[#4A90E2] -rotate-12 font-bold drop-shadow-sm leading-none">
              {price}₽
            </p>
          </div>

          {/* Add to cart button - bottom right, smaller */}
          {cartQuantity === 0 ? (
            <button 
              onClick={handleAddToCart}
              className="bg-[#FF6B35] text-white p-2.5 rounded-full hover:bg-[#FF5722] transition-all hover:scale-110 active:scale-95 flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-[#FF6B35] text-white rounded-full px-2 py-1.5 flex-shrink-0">
              <button 
                onClick={handleRemove}
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
