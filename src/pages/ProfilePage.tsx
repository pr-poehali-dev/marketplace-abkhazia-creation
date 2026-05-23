import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { api } from '@/lib/api';
import Icon from '@/components/ui/icon';

const statusMap: Record<string, { label: string; color: string; icon: string }> = {
  delivered: { label: 'Доставлен', color: '#00C9A7', icon: 'CheckCircle' },
  transit: { label: 'В пути', color: '#FFB800', icon: 'Truck' },
  processing: { label: 'Обрабатывается', color: '#FF6B2C', icon: 'Clock' },
};

export default function ProfilePage() {
  const { isLoggedIn, user, logout, setPage, cartItems, clearCart } = useStore();
  const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'addresses'>('info');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');

  const handleLogin = async () => {
    if (!email) { setLoginError('Введите email'); return; }
    setLoginLoading(true);
    setLoginError('');
    try {
      const result = await api.login(email, password);
      if (result.error) {
        setLoginError(result.error);
      } else if (result.user) {
        useStore.getState().setUser(result.user);
      } else {
        setLoginError('Неверный email или пароль');
      }
    } catch {
      setLoginError('Ошибка соединения');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleTabChange = async (tab: 'info' | 'orders' | 'addresses') => {
    setActiveTab(tab);
    if (tab === 'orders' && !ordersLoaded && user) {
      try {
        const data = await api.getUserOrders(user.id);
        const list = Array.isArray(data) ? data : (data.orders || []);
        setOrders(list as Record<string, unknown>[]);
      } catch {
        setOrders([]);
      } finally {
        setOrdersLoaded(true);
      }
    }
  };

  const handleCreateOrder = async () => {
    if (cartItems.length === 0) return;
    setOrderLoading(true);
    setOrderError('');
    try {
      const result = await api.createOrder({
        user_id: user?.id,
        items: cartItems.map(i => ({ product_id: i.product.id, quantity: i.quantity, price: i.product.price })),
        total: cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0),
      });
      if (result.error) {
        setOrderError(result.error);
      } else {
        clearCart();
        setOrderSuccess(true);
        setOrdersLoaded(false);
      }
    } catch {
      setOrderError('Ошибка при оформлении заказа');
    } finally {
      setOrderLoading(false);
    }
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
            <button onClick={handleLogin} disabled={loginLoading} className="btn-primary w-full py-3 text-base">
              {loginLoading ? 'Вход...' : 'Войти'}
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
            {user?.avatar || '👤'}
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

      {/* Cart checkout block */}
      {cartItems.length > 0 && (
        <div className="rounded-2xl p-5 mb-6" style={{ background: 'rgba(0,168,107,0.08)', border: '1px solid rgba(0,200,167,0.2)' }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-semibold text-white mb-1">Товары в корзине: {cartItems.length} поз.</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Итого: <span style={{ color: '#00C9A7' }}>{cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0).toLocaleString()}₽</span>
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {orderSuccess && <p className="text-xs" style={{ color: '#00C9A7' }}>Заказ успешно оформлен!</p>}
              {orderError && <p className="text-xs text-red-400">{orderError}</p>}
              <button onClick={handleCreateOrder} disabled={orderLoading} className="btn-primary px-6 py-2.5">
                {orderLoading ? 'Оформление...' : 'Оформить заказ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        {[['info', 'Профиль'], ['orders', 'Заказы'], ['addresses', 'Адреса']].map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab as 'info' | 'orders' | 'addresses')}
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
          {!ordersLoaded ? (
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Загрузка...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-12" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <div className="text-4xl mb-3">📦</div>
              <p>У вас пока нет заказов</p>
            </div>
          ) : (
            orders.map(order => {
              const status = (order.status as string) || 'processing';
              const st = statusMap[status] || statusMap.processing;
              const items = (order.items as { name?: string; product_name?: string }[]) || [];
              return (
                <div key={order.id as string} className="rounded-2xl p-5" style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-montserrat font-bold text-white">#{order.id as string}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {order.created_at as string} · 📍 {(order.region as string) || ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold" style={{ background: `${st.color}15`, color: st.color, border: `1px solid ${st.color}30` }}>
                      <Icon name={st.icon as 'CheckCircle'} size={12} />
                      {st.label}
                    </div>
                  </div>
                  <div className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {items.map(i => i.name || i.product_name || '').filter(Boolean).join(', ')}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold" style={{ color: '#00C9A7' }}>{Number(order.total).toLocaleString()}₽</span>
                    <div className="flex gap-2">
                      <button className="text-xs px-3 py-1.5 rounded-lg transition-all hover:bg-white/10" style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        Детали
                      </button>
                      {status === 'delivered' && (
                        <button className="text-xs px-3 py-1.5 rounded-lg transition-all" style={{ background: 'rgba(0,200,167,0.1)', color: '#00C9A7', border: '1px solid rgba(0,200,167,0.2)' }}>
                          Оставить отзыв
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
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
