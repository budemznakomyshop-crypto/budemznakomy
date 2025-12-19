import { HandDrawnCard } from "./HandDrawnCard";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Как долго хранится кофе?",
    answer: "Обжаренный кофе лучше всего употребить в течение 2-8 недель после обжарки для максимальной свежести. Храните кофе в герметичной упаковке в тёмном прохладном месте."
  },
  {
    question: "Какой помол выбрать?",
    answer: "Зерно — если у вас есть кофемолка. Эспрессо — для кофемашин. Фильтр — для пуровера и капельных кофеварок. Френч-пресс — крупный помол. Турка — самый мелкий помол."
  },
  {
    question: "Что такое дрип-пакеты?",
    answer: "Дрип-пакеты — это одноразовые фильтры с молотым кофе. Просто закрепите пакет на чашке, залейте горячей водой (90-95°C) и через 2-3 минуты наслаждайтесь свежезаваренным кофе. Идеально для путешествий и офиса."
  },
  {
    question: "Как быстро вы доставляете?",
    answer: "По Санкт-Петербургу доставка обычно занимает 1-2 дня. Также доступен самовывоз из наших кофеен в удобное для вас время."
  },
  {
    question: "Можно ли попробовать кофе перед покупкой?",
    answer: "Конечно! Приходите в любую из наших кофеен, где вы сможете попробовать кофе и получить консультацию бариста."
  },
  {
    question: "Какая у вас обжарка?",
    answer: "Сегодня мы продаем упаковки по 200 грамм, которые пожарены для фильтра. Если хотите обжарку под эспрессо, напишите!"
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 px-6 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-10 text-center">
          <h2 className="display text-[#1E1E1E] mb-2">
            ВОПРОСЫ И ОТВЕТЫ
          </h2>
          <p className="handwritten text-4xl text-[#FF6B35] -rotate-2 inline-block">
            всё, что нужно знать о нашем кофе
          </p>
        </div>

        <div className="grid grid-cols-8 gap-6">
          <div className="col-span-8 lg:col-span-6 lg:col-start-2 space-y-4">
            {faqs.map((faq, index) => (
              <HandDrawnCard key={index} className="cursor-pointer">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left"
                >
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="display text-lg text-[#1E1E1E] leading-tight">
                      {faq.question}
                    </h4>
                    <div className="flex-shrink-0 text-[#FF6B35] mt-1">
                      {openIndex === index ? (
                        <Minus className="w-5 h-5" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                  {openIndex === index && (
                    <p className="mt-4 text-[#666666] leading-relaxed">
                      {faq.answer}
                    </p>
                  )}
                </button>
              </HandDrawnCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
