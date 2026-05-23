import { useState } from 'react';
import { products } from '@/data/products';
import Icon from '@/components/ui/icon';

const mockStats = [
  { label: 'Выручка за месяц', value: '184 500₽', change: '+23%', icon: 'TrendingUp', color: '#00C9A7' },
  { label: 'Заказов', value: '142', change: '+18%', icon: 'ShoppingBag', color: '#00A86B' },
  { label: 'Товаров в каталоге', value: '28', change: '+5', icon: 'Package', color: '#FFB800' },
  { label: 'Рейтинг', value: '4.9 ★', change: 'Топ 5%', icon: 'Star', color: '#FF6B2C' },
];

const tabs = ['Дашборд', 'Товары', 'Заказы', 'Настройки'];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [registered, setRegistered] = useState(false);
  const [form, setForm] = useState({ shopName: '', category: '', description: '', phone: '', email: '' });

  if (!registered) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="rounded-3xl p-8" style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl" style={{ background: 'linear-gradient(135deg, #FF6B2C, #FFB800)' }}>
              🏪
            </div>
            <h1 className="font-montserrat font-black text-white text-2xl mb-2">Открыть магазин</h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Продавайте на АПСНЫ — первом маркетплейсе Абхазии
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[['1%', 'комиссия'], ['1 день', 'верификация'], ['150+', 'продавцов']].map(([n, l]) => (
              <div key={l} className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,107,44,0.08)', border: '1px solid rgba(255,107,44,0.15)' }}>
                <div className="font-montserrat font-black text-2xl" style={{ color: '#FF6B2C' }}>{n}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{l}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {[
              { key: 'shopName', label: 'Название магазина', placeholder: 'Например: Горные пасеки Гудауты' },
              { key: 'category', label: 'Основная категория', placeholder: 'Продукты, вина, ремёсла...' },
              { key: 'phone', label: 'Телефон', placeholder: '+7 (840) ...' },
              { key: 'email', label: 'Email', placeholder: 'your@email.com' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.45)' }}>{f.label}</label>
                <input
                  type="text"
                  placeholder={f.placeholder}
                  value={form[f.key as keyof typeof form]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  className="input-dark"
                />
              </div>
            ))}
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.45)' }}>Описание</label>
              <textarea
                placeholder="Расскажите о вашем магазине..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="input-dark resize-none"
              />
            </div>
            <button
              onClick={() => form.shopName && setRegistered(true)}
              className="btn-orange w-full py-3 text-base"
            >
              Подать заявку
            </button>
            <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Нажимая кнопку, вы соглашаетесь с условиями работы платформы
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-montserrat font-black text-white text-2xl">Панель продавца</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{form.shopName || 'Мой магазин'}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="tag-badge flex items-center gap-1" style={{ color: '#FFB800', background: 'rgba(255,184,0,0.1)', borderColor: 'rgba(255,184,0,0.2)' }}>
            <Icon name="Clock" size={11} />
            На верификации
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className="flex-1 py-2 text-sm font-medium rounded-lg transition-all"
            style={{
              background: activeTab === i ? 'linear-gradient(135deg, #00A86B, #00C9A7)' : 'transparent',
              color: activeTab === i ? 'white' : 'rgba(255,255,255,0.45)',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {activeTab === 0 && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {mockStats.map(stat => (
              <div key={stat.label} className="rounded-2xl p-5" style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                    <Icon name={stat.icon as 'TrendingUp'} size={18} style={{ color: stat.color }} />
                  </div>
                  <span className="text-xs font-semibold" style={{ color: '#00C9A7' }}>{stat.change}</span>
                </div>
                <div className="font-montserrat font-black text-xl text-white">{stat.value}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Chart placeholder */}
          <div className="rounded-2xl p-6 mb-6" style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="font-montserrat font-bold text-white mb-4">Продажи за 30 дней</h3>
            <div className="flex items-end gap-1 h-32">
              {[40,65,45,80,55,90,70,85,60,95,75,88,50,72,65,80,55,90,68,78,85,70,92,65,80,88,75,95,70,85].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm transition-all hover:opacity-80 cursor-pointer"
                  style={{
                    height: `${h}%`,
                    background: i > 25 ? 'linear-gradient(to top, #00A86B, #00C9A7)' : 'rgba(0,200,167,0.25)',
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
              <span>1 мая</span><span>15 мая</span><span>Сегодня</span>
            </div>
          </div>
        </div>
      )}

      {/* Products */}
      {activeTab === 1 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-montserrat font-bold text-white text-lg">Мои товары</h2>
            <button className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
              <Icon name="Plus" size={15} className="text-white" />
              Добавить товар
            </button>
          </div>
          <div className="space-y-2">
            {products.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <img src={p.image} alt={p.name} className="w-14 h-14 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">{p.name}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>★ {p.rating} · {p.reviews} отзывов</p>
                </div>
                <div className="text-right">
                  <div className="font-bold" style={{ color: '#00C9A7' }}>{p.price.toLocaleString()}₽</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>В наличии</div>
                </div>
                <div className="flex gap-1">
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all">
                    <Icon name="Edit2" size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
                  </button>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-all">
                    <Icon name="Trash2" size={14} style={{ color: 'rgba(255,100,100,0.5)' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders */}
      {activeTab === 2 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📦</div>
          <p className="text-white font-semibold mb-1">Заказы появятся после верификации</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Обычно верификация занимает 1-3 рабочих дня</p>
        </div>
      )}

      {/* Settings */}
      {activeTab === 3 && (
        <div className="max-w-lg space-y-4">
          <h2 className="font-montserrat font-bold text-white text-lg mb-4">Настройки магазина</h2>
          {[
            { label: 'Название магазина', defaultVal: form.shopName || 'Мой магазин' },
            { label: 'Телефон', defaultVal: form.phone },
            { label: 'Email', defaultVal: form.email },
          ].map(f => (
            <div key={f.label}>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.45)' }}>{f.label}</label>
              <input defaultValue={f.defaultVal} className="input-dark" />
            </div>
          ))}
          <button className="btn-primary py-2.5 px-6">Сохранить</button>
        </div>
      )}
    </div>
  );
}
