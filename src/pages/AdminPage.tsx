/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Icon from '@/components/ui/icon';

const ADMIN_EMAIL = 'admin@apsny.market';
const ADMIN_PASSWORD = 'admin2024';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  processing:  { label: 'Обрабатывается', color: '#FF6B2C' },
  assembly:    { label: 'Собирается',     color: '#FFB800' },
  transit:     { label: 'В пути',         color: '#00A86B' },
  delivered:   { label: 'Доставлен',      color: '#00C9A7' },
  cancelled:   { label: 'Отменён',        color: '#ef4444' },
};

type Tab = 'dashboard' | 'products' | 'orders' | 'sellers' | 'users';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass]  = useState('');
  const [loginErr, setLoginErr]    = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [tab, setTab] = useState<Tab>('dashboard');
   
  const [stats, setStats]     = useState<any>(null);
   
  const [products, setProducts] = useState<any[]>([]);
   
  const [orders, setOrders]   = useState<any[]>([]);
   
  const [sellers, setSellers] = useState<any[]>([]);
   
  const [users, setUsers]     = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name:'', price:'', category_slug:'food', region:'Сухум', description:'', image_url:'', badge:'', badge_type:'', in_stock: true });
  const [addLoading, setAddLoading] = useState(false);
  const [addMsg, setAddMsg] = useState('');

  const handleLogin = async () => {
    if (!loginEmail || !loginPass) { setLoginErr('Введите email и пароль'); return; }
    setLoginLoading(true);
    try {
      const res = await api.login(loginEmail.trim().toLowerCase(), loginPass);
      if (res.user && res.user.role === 'admin') {
        setAuthed(true);
        setLoginErr('');
      } else if (res.error) {
        setLoginErr(res.error);
      } else {
        setLoginErr('Недостаточно прав. Только администраторы.');
      }
    } catch {
      setLoginErr('Ошибка соединения');
    }
    setLoginLoading(false);
  };

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    api.admin.getStats().then(setStats).finally(() => setLoading(false));
  }, [authed]);

  useEffect(() => {
    if (!authed) return;
    if (tab === 'products') api.admin.getProducts().then(setProducts);
    if (tab === 'orders')   api.admin.getOrders().then(setOrders);
    if (tab === 'sellers')  api.admin.getSellers().then(setSellers);
    if (tab === 'users')    api.admin.getUsers().then(setUsers);
  }, [tab, authed]);

  const updateOrderStatus = async (orderId: number, status: string) => {
    await api.admin.updateOrderStatus(orderId, status);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) { setAddMsg('Заполните название и цену'); return; }
    setAddLoading(true);
    const res = await api.createProduct({ ...newProduct, price: parseFloat(newProduct.price) });
    if (res.id) {
      setAddMsg('✅ Товар добавлен!');
      setProducts(prev => [res, ...prev]);
      setNewProduct({ name:'', price:'', category_slug:'food', region:'Сухум', description:'', image_url:'', badge:'', badge_type:'', in_stock: true });
      setTimeout(() => { setAddMsg(''); setShowAddProduct(false); }, 2000);
    } else {
      setAddMsg('Ошибка: ' + (res.error || 'неизвестная'));
    }
    setAddLoading(false);
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #060E1C 0%, #0A1628 100%)' }}>
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 text-4xl" style={{ background: 'linear-gradient(135deg, #00A86B, #00C9A7)', boxShadow: '0 0 40px rgba(0,200,167,0.3)' }}>
              👑
            </div>
            <h1 className="font-montserrat font-black text-white text-3xl">Админ-панель</h1>
            <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>АПСНЫ Маркетплейс · Только для администраторов</p>
          </div>

          <div className="rounded-3xl p-8" style={{ background: 'rgba(13,33,55,0.9)', border: '1px solid rgba(0,200,167,0.15)', boxShadow: '0 0 60px rgba(0,0,0,0.4)' }}>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Email администратора</label>
                <input type="email" placeholder="admin@apsny.market" value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)} className="input-dark" />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Пароль</label>
                <input type="password" placeholder="••••••••" value={loginPass}
                  onChange={e => setLoginPass(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  className="input-dark" />
              </div>
              {loginErr && (
                <div className="text-sm px-3 py-2 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                  {loginErr}
                </div>
              )}
              <button onClick={handleLogin} disabled={loginLoading} className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2">
                {loginLoading ? <><Icon name="Loader" size={18} className="animate-spin text-white" /> Вход...</> : <><Icon name="Lock" size={18} className="text-white" /> Войти в панель</>}
              </button>
            </div>

            <div className="mt-6 p-4 rounded-xl text-xs" style={{ background: 'rgba(0,200,167,0.06)', border: '1px solid rgba(0,200,167,0.1)', color: 'rgba(255,255,255,0.4)' }}>
              <p className="font-semibold mb-1" style={{ color: 'rgba(0,200,167,0.8)' }}>Тестовый доступ:</p>
              <p>Email: {ADMIN_EMAIL}</p>
              <p>Пароль: {ADMIN_PASSWORD}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'dashboard', label: 'Дашборд',  icon: 'LayoutDashboard' },
    { key: 'products',  label: 'Товары',   icon: 'Package' },
    { key: 'orders',    label: 'Заказы',   icon: 'ShoppingBag' },
    { key: 'sellers',   label: 'Продавцы', icon: 'Store' },
    { key: 'users',     label: 'Пользователи', icon: 'Users' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#060E1C' }}>
      {/* Admin Header */}
      <div className="sticky top-0 z-40 border-b" style={{ background: 'rgba(6,14,28,0.96)', backdropFilter: 'blur(20px)', borderColor: 'rgba(0,200,167,0.12)' }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: 'linear-gradient(135deg, #00A86B, #00C9A7)' }}>👑</div>
            <span className="font-montserrat font-bold text-white">Панель администратора</span>
            <span className="tag-badge hidden md:inline-flex">АПСНЫ</span>
          </div>
          <button onClick={() => setAuthed(false)} className="flex items-center gap-1.5 text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <Icon name="LogOut" size={15} />
            Выйти
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto scrollbar-hidden pb-1">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all flex-shrink-0"
              style={{
                background: tab === t.key ? 'linear-gradient(135deg, #00A86B, #00C9A7)' : 'rgba(255,255,255,0.04)',
                color: tab === t.key ? 'white' : 'rgba(255,255,255,0.5)',
                border: `1px solid ${tab === t.key ? 'transparent' : 'rgba(255,255,255,0.06)'}`,
              }}>
              <Icon name={t.icon as 'Package'} size={15} />
              {t.label}
            </button>
          ))}
        </div>

        {/* ===== DASHBOARD ===== */}
        {tab === 'dashboard' && (
          <div>
            {loading || !stats ? (
              <div className="text-center py-20" style={{ color: 'rgba(255,255,255,0.4)' }}>Загрузка статистики...</div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                  {[
                    { label: 'Выручка', value: `${Number(stats.revenue).toLocaleString()}₽`, icon: 'TrendingUp', color: '#00C9A7' },
                    { label: 'Заказов',  value: stats.orders,    icon: 'ShoppingBag', color: '#00A86B' },
                    { label: 'Товаров',  value: stats.products,  icon: 'Package',     color: '#FFB800' },
                    { label: 'Продавцов',value: stats.sellers,   icon: 'Store',       color: '#FF6B2C' },
                    { label: 'Покупателей',value: stats.users,   icon: 'Users',       color: '#a78bfa' },
                  ].map(s => (
                    <div key={s.label} className="rounded-2xl p-5" style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${s.color}15` }}>
                        <Icon name={s.icon as 'TrendingUp'} size={18} style={{ color: s.color }} />
                      </div>
                      <div className="font-montserrat font-black text-2xl text-white">{s.value}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent orders */}
                <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <h3 className="font-montserrat font-bold text-white">Последние заказы</h3>
                    <button onClick={() => setTab('orders')} className="text-xs" style={{ color: '#00C9A7' }}>Все заказы →</button>
                  </div>
                  <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    { }
                    {(stats.recent_orders || []).map((o: any) => {
                      const st = STATUS_MAP[o.status] || STATUS_MAP.processing;
                      return (
                        <div key={o.id} className="px-5 py-3 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-white">{o.order_number}</p>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{o.user_name || '—'} · {o.delivery_region}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-sm" style={{ color: '#00C9A7' }}>{Number(o.total_price).toLocaleString()}₽</span>
                            <span className="text-xs px-2 py-1 rounded-lg" style={{ background: `${st.color}15`, color: st.color }}>{st.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ===== PRODUCTS ===== */}
        {tab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-montserrat font-bold text-white text-xl">Все товары ({products.length})</h2>
              <button onClick={() => setShowAddProduct(!showAddProduct)} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
                <Icon name="Plus" size={15} className="text-white" />
                Добавить товар
              </button>
            </div>

            {/* Add product form */}
            {showAddProduct && (
              <div className="rounded-2xl p-6 mb-4 animate-fade-in" style={{ background: 'rgba(0,200,167,0.05)', border: '1px solid rgba(0,200,167,0.2)' }}>
                <h3 className="font-montserrat font-bold text-white mb-4">Новый товар</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium mb-1 block" style={{ color: 'rgba(255,255,255,0.45)' }}>Название *</label>
                    <input value={newProduct.name} onChange={e => setNewProduct(p => ({...p, name: e.target.value}))} placeholder="Название товара" className="input-dark" />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: 'rgba(255,255,255,0.45)' }}>Цена (₽) *</label>
                    <input type="number" value={newProduct.price} onChange={e => setNewProduct(p => ({...p, price: e.target.value}))} placeholder="0" className="input-dark" />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: 'rgba(255,255,255,0.45)' }}>Категория</label>
                    <select value={newProduct.category_slug} onChange={e => setNewProduct(p => ({...p, category_slug: e.target.value}))} className="input-dark">
                      {['food','wine','honey','crafts','textiles','cosmetics','tea','tourism','electronics','clothing','shoes','kids','sport','home','beauty','books'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: 'rgba(255,255,255,0.45)' }}>Регион</label>
                    <select value={newProduct.region} onChange={e => setNewProduct(p => ({...p, region: e.target.value}))} className="input-dark">
                      {['Сухум','Гудаута','Гагра','Гал','Очамчира','Новый Афон','Пицунда'].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: 'rgba(255,255,255,0.45)' }}>Метка (badge)</label>
                    <input value={newProduct.badge} onChange={e => setNewProduct(p => ({...p, badge: e.target.value}))} placeholder="Хит продаж" className="input-dark" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-xs font-medium mb-1 block" style={{ color: 'rgba(255,255,255,0.45)' }}>URL изображения</label>
                    <input value={newProduct.image_url} onChange={e => setNewProduct(p => ({...p, image_url: e.target.value}))} placeholder="https://..." className="input-dark" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-xs font-medium mb-1 block" style={{ color: 'rgba(255,255,255,0.45)' }}>Описание</label>
                    <textarea value={newProduct.description} onChange={e => setNewProduct(p => ({...p, description: e.target.value}))} placeholder="Описание товара..." rows={2} className="input-dark resize-none" />
                  </div>
                </div>
                {addMsg && <p className="mt-2 text-sm" style={{ color: addMsg.startsWith('✅') ? '#00C9A7' : '#ef4444' }}>{addMsg}</p>}
                <div className="flex gap-3 mt-4">
                  <button onClick={handleAddProduct} disabled={addLoading} className="btn-primary py-2 px-6 flex items-center gap-2">
                    {addLoading ? <Icon name="Loader" size={15} className="animate-spin text-white" /> : <Icon name="Plus" size={15} className="text-white" />}
                    Сохранить
                  </button>
                  <button onClick={() => setShowAddProduct(false)} className="px-4 py-2 rounded-xl text-sm transition-all hover:bg-white/10" style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>Отмена</button>
                </div>
              </div>
            )}

            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                {products.slice(0, 50).map((p: any) => (
                  <div key={p.id} className="px-5 py-3 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm truncate">{p.name}</p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{p.category_slug} · {p.seller_name || '—'} · {p.region}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold" style={{ color: '#00C9A7' }}>{Number(p.price).toLocaleString()}₽</div>
                      <div className="text-xs mt-0.5" style={{ color: p.in_stock ? '#00A86B' : '#ef4444' }}>{p.in_stock ? 'В наличии' : 'Нет'}</div>
                    </div>
                    {p.badge && <span className="tag-badge flex-shrink-0 hidden md:inline">{p.badge}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== ORDERS ===== */}
        {tab === 'orders' && (
          <div>
            <h2 className="font-montserrat font-bold text-white text-xl mb-4">Все заказы ({orders.length})</h2>
            <div className="space-y-3">
              {orders.map((o: any) => {
                const st = STATUS_MAP[o.status] || STATUS_MAP.processing;
                return (
                  <div key={o.id} className="rounded-2xl p-5" style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                      <div>
                        <p className="font-montserrat font-bold text-white">{o.order_number}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                          {o.user_name || 'Аноним'} · {o.user_email || ''} · 📍 {o.delivery_region}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-bold" style={{ color: '#00C9A7' }}>{Number(o.total_price).toLocaleString()}₽</span>
                        <select
                          value={o.status}
                          onChange={e => updateOrderStatus(o.id, e.target.value)}
                          className="text-xs px-3 py-1.5 rounded-lg border-none outline-none cursor-pointer"
                          style={{ background: `${st.color}15`, color: st.color, border: `1px solid ${st.color}30` }}
                        >
                          {Object.entries(STATUS_MAP).map(([k, v]) => (
                            <option key={k} value={k}>{v.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {o.items && o.items.length > 0 && (
                      <div className="text-xs space-y-1 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)' }}>
                        {o.items.map((item: any) => (
                          <div key={item.id} className="flex justify-between">
                            <span>{item.product_name} × {item.quantity}</span>
                            <span>{(Number(item.price) * item.quantity).toLocaleString()}₽</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
                      Трек: {o.tracking_code} · Адрес: {o.delivery_address || '—'}
                    </p>
                  </div>
                );
              })}
              {orders.length === 0 && (
                <div className="text-center py-12" style={{ color: 'rgba(255,255,255,0.35)' }}>Заказов ещё нет</div>
              )}
            </div>
          </div>
        )}

        {/* ===== SELLERS ===== */}
        {tab === 'sellers' && (
          <div>
            <h2 className="font-montserrat font-bold text-white text-xl mb-4">Продавцы ({sellers.length})</h2>
            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                {sellers.map((s: any) => (
                  <div key={s.id} className="px-5 py-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>{s.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">{s.name}</p>
                        {s.verified && <span className="tag-badge text-xs py-0">✓</span>}
                      </div>
                      <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.email} · 📍 {s.location}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div style={{ color: '#FFB800' }}>★ {Number(s.rating).toFixed(1)}</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.products_count} товаров</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== USERS ===== */}
        {tab === 'users' && (
          <div>
            <h2 className="font-montserrat font-bold text-white text-xl mb-4">Пользователи ({users.length})</h2>
            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                {users.map((u: any) => (
                  <div key={u.id} className="px-5 py-3 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>{u.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm">{u.name}</p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{u.email} · {u.phone || '—'}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`tag-badge text-xs ${u.role === 'admin' ? 'tag-gold' : u.role === 'seller' ? '' : ''}`}>
                        {u.role === 'admin' ? '👑 admin' : u.role === 'seller' ? '🏪 seller' : '👤 user'}
                      </span>
                    </div>
                    <div className="text-xs flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {new Date(u.created_at).toLocaleDateString('ru')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}