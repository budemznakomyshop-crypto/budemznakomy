import { X, Trash2 } from "lucide-react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  grindType?: string;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export function CartModal({ isOpen, onClose, items, onRemoveItem, onCheckout }: CartModalProps) {
  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#666666] hover:text-[#1E1E1E] transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <h2 className="display text-[#1E1E1E] mb-2">КОРЗИНА</h2>
          <p className="handwritten text-3xl text-[#FF6B35] -rotate-1 mb-6 inline-block">
            ваш заказ
          </p>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#666666] mb-4">Корзина пуста</p>
              <button
                onClick={onClose}
                className="bg-[#FF6B35] text-white px-6 py-3 rounded-full hover:bg-[#FF5722] transition-colors font-bold"
              >
                Продолжить покупки
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-[#FFF5F0] rounded-2xl">
                    <div className="flex-1">
                      <p className="font-bold text-[#1E1E1E]">{item.name}</p>
                      <p className="text-sm text-[#666666]">Количество: {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="handwritten text-3xl text-[#4A90E2] font-bold">
                        {item.price * item.quantity} ₽
                      </p>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[#FF6B35] hover:text-[#FF5722] transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-[#1E1E1E] pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="display text-2xl text-[#1E1E1E]">ИТОГО:</span>
                  <span className="handwritten text-5xl text-[#4A90E2] font-bold">
                    {total} ₽
                  </span>
                </div>
              </div>

              <button
                onClick={onCheckout}
                className="w-full bg-[#FF6B35] text-white px-8 py-4 rounded-full hover:bg-[#FF5722] transition-all hover:scale-105 font-bold text-lg uppercase"
              >
                Оформить заказ
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
