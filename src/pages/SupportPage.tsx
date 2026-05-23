import { useState } from 'react';
import { deliveryInfo } from '@/data/products';
import Icon from '@/components/ui/icon';

const faqs = [
  { q: 'Как сделать заказ?', a: 'Выберите товар в каталоге, добавьте в корзину и оформите заказ. Понадобится указать адрес доставки и контактные данные.' },
  { q: 'Как оплатить заказ?', a: 'Принимаем оплату картой онлайн, наличными при получении и переводом на расчётный счёт.' },
  { q: 'Доставляете ли в Россию?', a: 'Да, доставляем в Россию через транспортные компании. Срок 5-14 рабочих дней, стоимость от 500₽.' },
  { q: 'Как вернуть товар?', a: 'Возврат товара надлежащего качества — в течение 14 дней с момента получения. Свяжитесь с поддержкой.' },
  { q: 'Как стать продавцом?', a: 'Нажмите «Открыть магазин», заполните анкету и дождитесь верификации. Обычно занимает 1-3 рабочих дня.' },
  { q: 'Что такое «Органик» метка?', a: 'Продукты с этой меткой производятся без химических удобрений и пестицидов, имеют сертификат органического производства.' },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (form.name && form.email && form.message) setSent(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-montserrat font-bold text-white text-3xl mb-2">Центр поддержки</h1>
      <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>Мы готовы помочь с любым вопросом</p>

      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {[
          { icon: '📞', title: 'Телефон', info: '+7 (840) 200-20-20', sub: 'Пн-Сб, 9:00–20:00' },
          { icon: '✉️', title: 'Email', info: 'help@apsny.market', sub: 'Ответим за 24 часа' },
          { icon: '✈️', title: 'Telegram', info: '@apsny_support', sub: 'Быстрые ответы' },
        ].map(c => (
          <div key={c.title} className="rounded-2xl p-5 text-center" style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-3xl mb-2">{c.icon}</div>
            <p className="font-semibold text-white mb-1">{c.title}</p>
            <p className="text-sm" style={{ color: '#00C9A7' }}>{c.info}</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        {/* FAQ */}
        <div>
          <h2 className="font-montserrat font-bold text-white text-xl mb-4">Частые вопросы</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between"
                >
                  <span className="font-medium text-white text-sm">{faq.q}</span>
                  <Icon name={openFaq === i ? 'ChevronUp' : 'ChevronDown'} size={16} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm" style={{ color: 'rgba(255,255,255,0.55)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="pt-3">{faq.a}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact form */}
        <div>
          <h2 className="font-montserrat font-bold text-white text-xl mb-4">Написать нам</h2>
          <div className="rounded-2xl p-6" style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {sent ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="font-montserrat font-bold text-white mb-2">Сообщение отправлено!</h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Мы ответим в течение 24 часов</p>
                <button onClick={() => setSent(false)} className="mt-4 btn-primary text-sm py-2 px-5">Написать ещё</button>
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  { key: 'name', label: 'Имя', type: 'text', placeholder: 'Ваше имя' },
                  { key: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
                  { key: 'subject', label: 'Тема', type: 'text', placeholder: 'Тема обращения' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.45)' }}>{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={form[f.key as keyof typeof form]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      className="input-dark"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.45)' }}>Сообщение</label>
                  <textarea
                    placeholder="Опишите ваш вопрос..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    rows={4}
                    className="input-dark resize-none"
                  />
                </div>
                <button onClick={handleSend} className="btn-primary w-full py-3">Отправить</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delivery table */}
      <div>
        <h2 className="font-montserrat font-bold text-white text-xl mb-4">Доставка по регионам Абхазии</h2>
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="grid grid-cols-3 px-5 py-3 text-xs font-semibold" style={{ background: 'rgba(0,200,167,0.08)', color: '#00C9A7' }}>
            <span>Регион</span>
            <span>Срок</span>
            <span>Стоимость</span>
          </div>
          {deliveryInfo.regions.map((r, i) => (
            <div key={r.name} className="grid grid-cols-3 px-5 py-3.5 text-sm" style={{ background: i % 2 === 0 ? 'rgba(13,33,55,0.8)' : 'rgba(13,33,55,0.5)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>📍 {r.name}</span>
              <span style={{ color: 'rgba(255,255,255,0.55)' }}>{r.time}</span>
              <span style={{ color: '#00C9A7' }}>{r.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
