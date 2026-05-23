import { useStore } from '@/store/useStore';
import Icon from '@/components/ui/icon';

export default function Footer() {
  const { setPage } = useStore();

  return (
    <footer className="mt-16" style={{ background: 'linear-gradient(180deg, #0A1628 0%, #060E1C 100%)', borderTop: '1px solid rgba(0,200,167,0.1)' }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold" style={{ background: 'linear-gradient(135deg, #00A86B, #00C9A7)' }}>
                А
              </div>
              <div>
                <div className="font-montserrat font-bold text-white text-lg">АПСНЫ</div>
                <div className="text-xs" style={{ color: '#00C9A7' }}>маркетплейс Абхазии</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Первый маркетплейс Абхазии. Продукты, ремёсла, вина и услуги с доставкой по всем регионам.
            </p>
            <div className="flex items-center gap-3">
              {['Telegram', 'Instagram', 'Youtube'].map((s) => (
                <div key={s} className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {s === 'Telegram' ? '✈' : s === 'Instagram' ? '📷' : '▶'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-montserrat font-bold text-white mb-4 text-sm">Покупателям</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Каталог товаров', page: 'catalog' as const },
                { label: 'Мои заказы', page: 'orders' as const },
                { label: 'Закладки', page: 'bookmarks' as const },
                { label: 'Поддержка', page: 'support' as const },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => setPage(item.page)}
                    className="text-sm transition-colors hover:text-teal-400"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-montserrat font-bold text-white mb-4 text-sm">Продавцам</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Стать продавцом', page: 'admin' as const },
                { label: 'Все продавцы', page: 'sellers' as const },
                { label: 'Условия работы', page: 'support' as const },
                { label: 'Тарифы', page: 'support' as const },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => setPage(item.page)}
                    className="text-sm transition-colors hover:text-teal-400"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Delivery */}
          <div>
            <h4 className="font-montserrat font-bold text-white mb-4 text-sm">Доставка по Абхазии</h4>
            <ul className="space-y-2">
              {['Сухум', 'Гудаута', 'Гагра', 'Гал', 'Очамчира', 'Новый Афон'].map((city) => (
                <li key={city} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  <span className="text-teal-500">📍</span>
                  {city}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t mb-6" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.25)' }}>
            © 2024 АПСНЫ Маркетплейс. Все права защищены. Республика Абхазия.
          </p>
          <div className="flex items-center gap-4">
            {['Политика конфиденциальности', 'Пользовательское соглашение'].map((item) => (
              <span key={item} className="text-xs cursor-pointer hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.25)' }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
