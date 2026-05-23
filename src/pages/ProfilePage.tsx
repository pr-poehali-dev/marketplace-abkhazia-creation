import { useState } from 'react';
import { useStore } from '@/store/useStore';
import Icon from '@/components/ui/icon';

const mockOrders = [
  { id: '#AB-2024-0892', date: '18.05.2024', status: 'delivered', items: ['Вино «Лыхны»', 'Мёд горный'], total: 1540, region: 'Сухум' },
  { id: '#AB-2024-0781', date: '10.05.2024', status: 'transit', items: ['Аджика абхазская'], total: 320, region: 'Гудаута' },
  { id: '#AB-2024-0654', date: '02.05.2024', status: 'processing', items: ['Чай «Рица»', 'Варенье из инжира'], total: 860, region: 'Гагра' },
];

const statusMap: Record<string, { label: string; color: string; icon: string }> = {
  delivered: { label: 'Доставлен', color: '#00C9A7', icon: 'CheckCircle' },
  transit: { label: 'В пути', color: '#FFB800', icon: 'Truck' },
  processing: { label: 'Обрабатывается', color: '#FF6B2C', icon: 'Clock' },
};

export default function ProfilePage() {
  const { isLoggedIn, user, login, logout, setPage } = useStore();
  const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'addresses'>('info');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = () => {
    if (!email) { setLoginError('Введите email'); return; }
    login(email, password);
    setLoginError('');
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="rounded-3xl p-8" style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl" style={{ background: 'linear-gradient(135deg, #00A86B, #00C9A7)' }}>
              👤
            </div>
            <h1 className="font-montserrat font-bold text-white text-2xl mb-2">Войти в аккаунт</h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Чтобы видеть заказы и управлять профилем</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-dark"
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Пароль</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="input-dark"
              />
            </div>
            {loginError && <p className="text-xs text-red-400">{loginError}</p>}
            <button onClick={handleLogin} className="btn-primary w-full py-3 text-base">
              Войти
            </button>
            <p className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Нет аккаунта?{' '}
              <button className="transition-colors hover:text-white" style={{ color: '#00C9A7' }}>
                Зарегистрироваться
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: 'linear-gradient(135deg, #00A86B, #00C9A7)' }}>
            {user?.avatar}
          </div>
          <div>
            <h1 className="font-montserrat font-bold text-white text-2xl">{user?.name}</h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all hover:bg-red-500/10"
          style={{ color: 'rgba(255,100,100,0.7)', border: '1px solid rgba(255,100,100,0.15)' }}
        >
          <Icon name="LogOut" size={16} />
          Выйти
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        {[['info', 'Профиль'], ['orders', 'Заказы'], ['addresses', 'Адреса']].map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'info' | 'orders' | 'addresses')}
            className="px-5 py-3 text-sm font-medium transition-all -mb-px"
            style={{
              color: activeTab === tab ? '#00C9A7' : 'rgba(255,255,255,0.45)',
              borderBottom: activeTab === tab ? '2px solid #00C9A7' : '2px solid transparent',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'info' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl p-6" style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="font-montserrat font-bold text-white mb-4">Личные данные</h3>
            <div className="space-y-4">
              {[
                { label: 'Имя', value: user?.name || '' },
                { label: 'Email', value: user?.email || '' },
                { label: 'Телефон', value: user?.phone || '' },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.4)' }}>{f.label}</label>
                  <input defaultValue={f.value} className="input-dark" />
                </div>
              ))}
              <button className="btn-primary w-full py-2.5">Сохранить изменения</button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl p-5" style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="font-montserrat font-semibold text-white mb-3">Статистика</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[['3', 'Заказа'], ['2', 'Отзыва'], ['5', 'Закладок']].map(([n, l]) => (
                  <div key={l}>
                    <div className="text-2xl font-montserrat font-bold" style={{ color: '#00C9A7' }}>{n}</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,107,44,0.06)', border: '1px solid rgba(255,107,44,0.15)' }}>
              <h3 className="font-semibold mb-2" style={{ color: '#FF6B2C' }}>Хотите продавать?</h3>
              <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>Откройте свой магазин на АПСНЫ</p>
              <button onClick={() => setPage('admin')} className="btn-orange text-sm py-2 px-4">Стать продавцом</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          {mockOrders.map(order => {
            const st = statusMap[order.status];
            return (
              <div key={order.id} className="rounded-2xl p-5" style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-montserrat font-bold text-white">{order.id}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{order.date} · 📍 {order.region}</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold" style={{ background: `${st.color}15`, color: st.color, border: `1px solid ${st.color}30` }}>
                    <Icon name={st.icon as 'CheckCircle'} size={12} />
                    {st.label}
                  </div>
                </div>
                <div className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {order.items.join(', ')}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold" style={{ color: '#00C9A7' }}>{order.total.toLocaleString()}₽</span>
                  <div className="flex gap-2">
                    <button className="text-xs px-3 py-1.5 rounded-lg transition-all hover:bg-white/10" style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      Детали
                    </button>
                    {order.status === 'delivered' && (
                      <button className="text-xs px-3 py-1.5 rounded-lg transition-all" style={{ background: 'rgba(0,200,167,0.1)', color: '#00C9A7', border: '1px solid rgba(0,200,167,0.2)' }}>
                        Оставить отзыв
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="rounded-2xl p-5" style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-white">Домашний адрес</p>
              <span className="tag-badge">Основной</span>
            </div>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Республика Абхазия, г. Сухум, ул. Лакоба, 42</p>
          </div>
          <button className="w-full py-4 rounded-2xl text-sm font-medium transition-all border-dashed" style={{ border: '2px dashed rgba(0,200,167,0.2)', color: '#00C9A7' }}>
            + Добавить адрес
          </button>
        </div>
      )}
    </div>
  );
}
