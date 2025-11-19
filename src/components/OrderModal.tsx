import { useState } from "react";
import { X } from "lucide-react";
import { CartItem } from "./CartModal";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onOrderComplete: () => void;
}

export function OrderModal({ isOpen, onClose, items, total, onOrderComplete }: OrderModalProps) {
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
  const [selectedCafe, setSelectedCafe] = useState<string>("rizhskiy");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeToTerms) {
      alert("Пожалуйста, дайте согласие на обработку персональных данных");
      return;
    }

    setIsSubmitting(true);

    // Формируем текст заказа
    const orderDetails = items.map(item => 
      `${item.name} x${item.quantity} - ${item.price * item.quantity} ₽`
    ).join('\n');

    const emailBody = `
Новый заказ с сайта "Будем Знакомы"

ДЕТАЛИ ЗАКАЗА:
${orderDetails}

ИТОГО: ${total} ₽

ДАННЫЕ ПОКУПАТЕЛЯ:
Имя: ${formData.name}
Телефон: ${formData.phone}
Email: ${formData.email}

СПОСОБ ПОЛУЧЕНИЯ: ${deliveryType === "delivery" ? "Доставка" : "Самовывоз"}
${deliveryType === "delivery" ? `Адрес доставки: ${formData.address}` : `Кофейня: ${selectedCafe === "rizhskiy" ? "Рижский пр-т, 2" : "Малый проспект П.С., 60/19"}`}

Комментарий: ${formData.comment || "—"}
    `.trim();

    // В реальном приложении здесь должна быть отправка на сервер
    // Для демо просто логируем
    console.log("Отправка заказа на budemznakomyshop@gmail.com:");
    console.log(emailBody);

    // Симуляция отправки
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Спасибо за заказ! Мы свяжемся с вами по телефону ${formData.phone} для подтверждения.`);
      onOrderComplete();
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

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
          <h2 className="display text-[#1E1E1E] mb-2">ОФОРМЛЕНИЕ</h2>
          <p className="handwritten text-3xl text-[#FF6B35] -rotate-1 mb-6 inline-block">
            мы свяжемся с вами для уточнения деталей
          </p>

          {/* Order summary */}
          <div className="mb-6 p-4 bg-[#FFF5F0] rounded-2xl">
            <p className="font-bold text-[#1E1E1E] mb-2">Ваш заказ:</p>
            {items.map((item) => (
              <p key={item.id} className="text-sm text-[#666666]">
                {item.name} x{item.quantity} — {item.price * item.quantity} ₽
              </p>
            ))}
            <p className="handwritten text-3xl text-[#4A90E2] font-bold mt-2">
              Итого: {total} ₽
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Delivery type */}
            <div>
              <label className="block text-sm font-bold text-[#1E1E1E] mb-3">Способ получения</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryType("delivery")}
                  className={`flex-1 px-6 py-3 rounded-full transition-all font-bold ${
                    deliveryType === "delivery"
                      ? 'bg-[#FF6B35] text-white'
                      : 'bg-[#F5F5F5] text-[#666666] hover:bg-[#FFF5F0]'
                  }`}
                >
                  Доставка
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType("pickup")}
                  className={`flex-1 px-6 py-3 rounded-full transition-all font-bold ${
                    deliveryType === "pickup"
                      ? 'bg-[#FF6B35] text-white'
                      : 'bg-[#F5F5F5] text-[#666666] hover:bg-[#FFF5F0]'
                  }`}
                >
                  Самовывоз
                </button>
              </div>
            </div>

            {/* Cafe selection */}
            {deliveryType === "pickup" && (
              <div>
                <label className="block text-sm font-bold text-[#1E1E1E] mb-3">Выберите кофейню</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 border-2 border-[#E0E0E0] rounded-2xl cursor-pointer hover:border-[#FF6B35] transition-colors">
                    <input
                      type="radio"
                      name="cafe"
                      value="rizhskiy"
                      checked={selectedCafe === "rizhskiy"}
                      onChange={(e) => setSelectedCafe(e.target.value)}
                      className="w-5 h-5 text-[#FF6B35]"
                    />
                    <div>
                      <p className="font-bold text-[#1E1E1E]">Рижский проспект, 2</p>
                      <p className="text-sm text-[#666666]">Пн–Пт: 9:00–20:00, Сб–Вс: 10:00–20:00</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border-2 border-[#E0E0E0] rounded-2xl cursor-pointer hover:border-[#FF6B35] transition-colors">
                    <input
                      type="radio"
                      name="cafe"
                      value="maly"
                      checked={selectedCafe === "maly"}
                      onChange={(e) => setSelectedCafe(e.target.value)}
                      className="w-5 h-5 text-[#FF6B35]"
                    />
                    <div>
                      <p className="font-bold text-[#1E1E1E]">Малый проспект П.С., 60/19</p>
                      <p className="text-sm text-[#666666]">Пн–Пт: 9:00–21:00, Сб–Вс: 10:00–21:00</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Contact info */}
            <div>
              <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Ваше имя *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#E0E0E0] rounded-2xl focus:border-[#FF6B35] focus:outline-none transition-colors"
                placeholder="Иван"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Телефон *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#E0E0E0] rounded-2xl focus:border-[#FF6B35] focus:outline-none transition-colors"
                placeholder="+7 900 000 00 00"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#E0E0E0] rounded-2xl focus:border-[#FF6B35] focus:outline-none transition-colors"
                placeholder="ivan@example.com"
              />
            </div>

            {deliveryType === "delivery" && (
              <div>
                <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Адрес доставки *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#E0E0E0] rounded-2xl focus:border-[#FF6B35] focus:outline-none transition-colors"
                  placeholder="Улица, дом, квартира"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-[#1E1E1E] mb-2">Комментарий к заказу</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#E0E0E0] rounded-2xl focus:border-[#FF6B35] focus:outline-none transition-colors resize-none"
                rows={3}
                placeholder="Особые пожелания или вопросы"
              />
            </div>

            {/* Checkbox for agreement */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agreeToTerms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-5 h-5 mt-0.5 text-[#FF6B35] rounded"
                required
              />
              <label htmlFor="agreeToTerms" className="text-sm text-[#666666]">
                Я даю согласие на обработку персональных данных в соответствии с{" "}
                <a href="#" className="text-[#FF6B35] hover:underline font-bold">политикой конфиденциальности</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
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
