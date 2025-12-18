import React, { useState, FormEvent } from "react"; 
import { X } from "lucide-react"; 
import type { CartItem } from "./CartModal";

interface OrderModalProps { isOpen: boolean; onClose: () => void; items: CartItem[]; total: number; onOrderComplete: () => void; }

export function OrderModal({ isOpen, onClose, items, total, onOrderComplete }: OrderModalProps) { 
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery"); 
  const [selectedCafe, setSelectedCafe] = useState<"rizhskiy" | "maly">("rizhskiy"); 
  const [agreeToTerms, setAgreeToTerms] = useState(false); 
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", address: "", comment: "", }); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => { 
    e.preventDefault();

    if (items.length === 0) {
      alert("В корзине нет товаров");
      return;
    }

    if (!agreeToTerms) {
      alert("Пожалуйста, дайте согласие на обработку персональных данных");
      return;
    }

    if (deliveryType === "delivery" && !formData.address.trim()) {
      alert("Пожалуйста, укажите адрес доставки");
      return;
    }

    setIsSubmitting(true);

    const orderDetails = items
      .map((item) => `${item.name} x${item.quantity} - ${item.price * item.quantity} ₽`)
      .join("\n");

    // --- ФОНОВАЯ ОТПРАВКА ---
    fetch("https://telegram-orders-server.onrender.com/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        phone: formData.phone,
        email: formData.email, // Email на месте
        address: formData.address,
        comment: formData.comment,
        product: orderDetails,
        total: total,
        deliveryType: deliveryType,
        selectedCafe: selectedCafe
      }),
    }).catch(err => console.error("Ошибка отправки:", err));

    // --- МГНОВЕННЫЙ ОТВЕТ ---
    setTimeout(() => {
      onOrderComplete(); 
      onClose();         
      setIsSubmitting(false);
      alert("Заказ принят! Мы свяжемся с вами в ближайшее время.");
    }, 400); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-6 right-6 text-[#666666] hover:text-[#1E1E1E] transition-colors z-10">
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <h2 className="display text-[#1E1E1E] mb-2">ОФОРМЛЕНИЕ</h2>
          <p className="handwritten text-3xl text-[#FF6B35] -rotate-1 mb-6 inline-block">
            мы свяжемся с вами для уточнения деталей
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#1E1E1E] mb-3">Способ получения</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryType("delivery")}
                  className={`flex-1 px-6 py-3 rounded-full transition-all font-bold ${deliveryType === "delivery" ? "bg-[#FF6B35] text-white" : "bg-[#F5F5F5] text-[#666666] hover:bg-[#FFF5F0]"}`}
                >Доставка</button>
                <button
                  type="button"
                  onClick={() => setDeliveryType("pickup")}
                  className={`flex-1 px-6 py-3 rounded-full transition-all font-bold ${deliveryType === "pickup" ? "bg-[#FF6B35] text-white" : "bg-[#F5F5F5] text-[#666666] hover:bg-[#FFF5F0]"}`}
                >Самовывоз</button>
              </div>
            </div>

            {deliveryType === "pickup" && (
              <div className="space-y-3">
                <label className="block text-sm font-bold text-[#1E1E1E] mb-3">Выберите кофейню</label>
                <div className="grid gap-3">
                  <label className={`flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all ${selectedCafe === "rizhskiy" ? "border-[#FF6B35] bg-[#FFF5F0]" : "border-[#E0E0E0] hover:border-[#FF6B35]"}`}>
                    <input type="radio" name="cafe" checked={selectedCafe === "rizhskiy"} onChange={() => setSelectedCafe("rizhskiy")} className="w-5 h-5 text-[#FF6B35]" />
                    <div>
                      <p className="font-bold text-[#1E1E1E]">Рижский проспект, 2</p>
                      <p className="text-xs text-[#666666]">Пн–Пт: 9:00–20:00, Сб–Вс: 10:00–20:00</p>
                    </div>
                  </label>
                  <label className={`flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all ${selectedCafe === "maly" ? "border-[#FF6B35] bg-[#FFF5F0]" : "border-[#E0E0E0] hover:border-[#FF6B35]"}`}>
                    <input type="radio" name="cafe" checked={selectedCafe === "maly"} onChange={() => setSelectedCafe("maly")} className="w-5 h-5 text-[#FF6B35]" />
                    <div>
                      <p className="font-bold text-[#1E1E1E]">Малый проспект П.С., 60/19</p>
                      <p className="text-xs text-[#666666]">Пн–Пт: 9:00–21:00, Сб–Вс: 10:00–21:00</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Ваше имя *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border-2 border-[#E0E0E0] rounded-2xl focus:border-[#FF6B35] focus:outline-none transition-colors" placeholder="Иван" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Телефон *</label>
                <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 border-2 border-[#E0E0E0] rounded-2xl focus:border-[#FF6B35] focus:outline-none transition-colors" placeholder="+7 999 000-00-00" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Электронная почта *</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 border-2 border-[#E0E0E0] rounded-2xl focus:border-[#FF6B35] focus:outline-none transition-colors" placeholder="example@mail.ru" />
            </div>

            {deliveryType === "delivery" && (
              <div>
                <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Адрес доставки *</label>
                <input type="text" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-3 border-2 border-[#E0E0E0] rounded-2xl focus:border-[#FF6B35] focus:outline-none transition-colors" placeholder="Улица, дом, квартира" />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Комментарий к заказу</label>
              <textarea value={formData.comment} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} className="w-full px-4 py-3 border-2 border-[#E0E0E0] rounded-2xl focus:border-[#FF6B35] focus:outline-none transition-colors resize-none" rows={3} placeholder="Особые пожелания или вопросы" />
            </div>

            <div className="flex items-start gap-3">
              <input type="checkbox" id="agreeToTerms" checked={agreeToTerms} onChange={(e) => setAgreeToTerms(e.target.checked)} className="w-5 h-5 mt-0.5 text-[#FF6B35] rounded" />
              <label htmlFor="agreeToTerms" className="text-sm text-[#666666]">
                Я даю согласие на обработку персональных данных в соответствии с <a href="#" className="text-[#FF6B35] hover:underline font-bold">политикой конфиденциальности</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="w-full bg-[#FF6B35] text-white px-8 py-4 rounded-full hover:bg-[#FF5722] transition-all hover:scale-105 font-bold text-lg uppercase disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Отправка..." : "Отправить заказ"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
