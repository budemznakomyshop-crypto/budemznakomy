import React, { useState, FormEvent } from "react";
import { X, CheckCircle2 } from "lucide-react"; // Добавили иконку для красоты
import type { CartItem } from "./CartModal";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onOrderComplete: () => void;
}

export function OrderModal({ isOpen, onClose, items, total, onOrderComplete }: OrderModalProps) {
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
  const [selectedCafe, setSelectedCafe] = useState<"rizhskiy" | "maly">("rizhskiy");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", address: "", comment: "", });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Состояние для показа экрана "Спасибо"

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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

    // --- ОПТИМИСТИЧНЫЙ ПОДХОД ---
    setIsSubmitting(true);

    const orderDetails = items
      .map((item) => `${item.name} x${item.quantity} - ${item.price * item.quantity} ₽`)
      .join("\n");

    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      comment: formData.comment,
      product: orderDetails,
      total,
      deliveryType,
      selectedCafe,
    };

    // 1. Сразу переключаем интерфейс на "Успех"
    setIsSuccess(true);
    
    // 2. Очищаем корзину через небольшую паузу для плавности
    setTimeout(() => {
      onOrderComplete();
    }, 500);

    // 3. Отправляем запрос "в фоне", не используя await для блокировки интерфейса
    fetch("https://telegram-orders-server.onrender.com/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(response => {
      if (!response.ok) throw new Error("Background fetch failed");
      console.log("Заказ успешно доставлен на сервер (в фоне)");
    }).catch(err => {
      // Если всё-таки упало совсем, логируем. 
      // В идеале тут можно вывести тихое уведомление (toast)
      console.error("Критическая ошибка отправки:", err);
    });

    // 4. Через 3 секунды автоматически закрываем модалку совсем
    setTimeout(() => {
      onClose();
      // Сбрасываем состояние успеха, чтобы при следующем открытии снова была форма
      setTimeout(() => setIsSuccess(false), 500);
    }, 3500);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl relative" 
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#666666] hover:text-[#1E1E1E] transition-colors z-10"
          aria-label="Закрыть"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          {isSuccess ? (
            // ЭКРАН УСПЕХА (показывается мгновенно)
            <div className="py-12 text-center animate-in fade-in zoom-in duration-300">
              <div className="flex justify-center mb-6">
                <CheckCircle2 className="w-20 h-20 text-green-500" />
              </div>
              <h2 className="display text-3xl text-[#1E1E1E] mb-4">СПАСИБО!</h2>
              <p className="handwritten text-3xl text-[#FF6B35] mb-6">
                Ваш заказ принят в работу
              </p>
              <p className="text-[#666666] mb-8">
                Мы свяжемся с вами по номеру <br/>
                <span className="font-bold text-[#1E1E1E]">{formData.phone}</span> <br/>
                в ближайшее время.
              </p>
              <button
                onClick={onClose}
                className="bg-[#FF6B35] text-white px-8 py-3 rounded-full hover:bg-[#FF5722] transition-colors font-bold"
              >
                Вернуться на сайт
              </button>
            </div>
          ) : (
            // ОБЫЧНАЯ ФОРМА
            <>
              <h2 className="display text-[#1E1E1E] mb-2">ОФОРМЛЕНИЕ</h2>
              <p className="handwritten text-3xl text-[#FF6B35] -rotate-1 mb-6 inline-block">
                мы свяжемся с вами для уточнения деталей
              </p>

              <div className="mb-6 p-4 bg-[#FFF5F0] rounded-2xl">
                <p className="font-bold text-[#1E1E1E] mb-2">Ваш заказ:</p>
                {items.map((item) => (
                  <p key={item.id} className="text-sm text-[#666666]">
                    {item.name} x{item.quantity} — {item.price * item.quantity} ₽
                  </p>
                ))}
                <p className="handwritten text-3xl text-[#4A90E2] font-bold mt-2">Итого: {total} ₽</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* ... (весь остальной код полей формы остается без изменений) ... */}
                <div>
                  <label className="block text-sm font-bold text-[#1E1E1E] mb-3">Способ получения</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryType("delivery")}
                      className={`flex-1 px-6 py-3 rounded-full transition-all font-bold ${
                        deliveryType === "delivery" ? "bg-[#FF6B35] text-white" : "bg-[#F5F5F5] text-[#666666] hover:bg-[#FFF5F0]"
                      }`}
                    >Доставка</button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType("pickup")}
                      className={`flex-1 px-6 py-3 rounded-full transition-all font-bold ${
                        deliveryType === "pickup" ? "bg-[#FF6B35] text-white" : "bg-[#F5F5F5] text-[#666666] hover:bg-[#FFF5F0]"
                      }`}
                    >Самовывоз</button>
                  </div>
                </div>

                {deliveryType === "pickup" && (
                  <div>
                    <label className="block text-sm font-bold text-[#1E1E1E] mb-3">Выберите кофейню</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-4 border-2 border-[#E0E0E0] rounded-2xl cursor-pointer hover:border-[#FF6B35] transition-colors">
                        <input type="radio" checked={selectedCafe === "rizhskiy"} onChange={() => setSelectedCafe("rizhskiy")} className="w-5 h-5 text-[#FF6B35]" />
                        <div>
                          <p className="font-bold text-[#1E1E1E]">Рижский проспект, 2</p>
                          <p className="text-sm text-[#666666]">Пн–Пт: 9:00–20:00, Сб–Вс: 10:00–20:00</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-4 border-2 border-[#E0E0E0] rounded-2xl cursor-pointer hover:border-[#FF6B35] transition-colors">
                        <input type="radio" checked={selectedCafe === "maly"} onChange={() => setSelectedCafe("maly")} className="w-5 h-5 text-[#FF6B35]" />
                        <div>
                          <p className="font-bold text-[#1E1E1E]">Малый проспект П.С., 60/19</p>
                          <p className="text-sm text-[#666666]">Пн–Пт: 9:00–21:00, Сб–Вс: 10:00–21:00</p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Ваше имя *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border-2 border-[#E0E0E0] rounded-2xl focus:border-[#FF6B35] focus:outline-none transition-colors" placeholder="Иван" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Телефон *</label>
                  <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 border-2 border-[#E0E0E0] rounded-2xl focus:border-[#FF6B35] focus:outline-none transition-colors" placeholder="+7 900 000 00 00" />
                </div>

                {deliveryType === "delivery" && (
                  <div>
                    <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Адрес доставки *</label>
                    <input type="text" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-3 border-2 border-[#E0E0E0] rounded-2xl focus:border-[#FF6B35] focus:outline-none transition-colors" placeholder="Улица, дом, квартира" />
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <input type="checkbox" id="agreeToTerms" checked={agreeToTerms} onChange={(e) => setAgreeToTerms(e.target.checked)} className="w-5 h-5 mt-0.5 text-[#FF6B35] rounded" />
                  <label htmlFor="agreeToTerms" className="text-sm text-[#666666]">Я даю согласие на обработку персональных данных</label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full bg-[#FF6B35] text-white px-8 py-4 rounded-full hover:bg-[#FF5722] transition-all hover:scale-105 font-bold text-lg uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Отправка..." : "Отправить заказ"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

