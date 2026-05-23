import { useStore } from '@/store/useStore';
import Icon from '@/components/ui/icon';

const mockOrders = [
  {
    id: '#AB-2024-0892', date: '18.05.2024', status: 'delivered',
    items: [
      { name: 'Вино «Лыхны» красное', qty: 1, price: 890 },
      { name: 'Мёд горный цветочный', qty: 1, price: 650 },
    ],
    total: 1540, region: 'Сухум', address: 'ул. Лакоба, 42',
    tracking: 'AB892024SH',
  },
  {
    id: '#AB-2024-0781', date: '10.05.2024', status: 'transit',
    items: [{ name: 'Аджика абхазская острая', qty: 2, price: 320 }],
    total: 640, region: 'Гудаута', address: 'ул. Гагарина, 15',
    tracking: 'AB782024GD',
  },
  {
    id: '#AB-2024-0654', date: '02.05.2024', status: 'processing',
    items: [
      { name: 'Чай «Рица»', qty: 1, price: 480 },
      { name: 'Варенье из инжира', qty: 1, price: 380 },
    ],
    total: 860, region: 'Гагра', address: 'пр. Красных Партизан, 8',
    tracking: 'AB654024GG',
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: 'CheckCircle' | 'Truck' | 'Clock' | 'Package'; steps: number }> = {
  delivered: { label: 'Доставлен', color: '#00C9A7', icon: 'CheckCircle', steps: 4 },
  transit: { label: 'В пути', color: '#FFB800', icon: 'Truck', steps: 3 },
  processing: { label: 'Обрабатывается', color: '#FF6B2C', icon: 'Clock', steps: 1 },
};

const stepLabels = ['Принят', 'Собирается', 'В доставке', 'Доставлен'];

export default function OrdersPage() {
  const { setPage, isLoggedIn } = useStore();

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">📦</div>
        <h2 className="font-montserrat font-bold text-white text-xl mb-2">Войдите в аккаунт</h2>
        <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>Чтобы видеть историю заказов</p>
        <button onClick={() => setPage('profile')} className="btn-primary">Войти</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-montserrat font-bold text-white text-3xl mb-2">Мои заказы</h1>
      <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>{mockOrders.length} заказа</p>

      <div className="space-y-6">
        {mockOrders.map(order => {
          const st = statusConfig[order.status];
          return (
            <div key={order.id} className="rounded-3xl overflow-hidden" style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {/* Order header */}
              <div className="p-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-3" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-montserrat font-bold text-white">{order.id}</h3>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ background: `${st.color}15`, color: st.color, border: `1px solid ${st.color}25` }}>
                      <Icon name={st.icon} size={12} />
                      {st.label}
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {order.date} · 📍 {order.region}, {order.address}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-montserrat font-bold text-xl" style={{ color: '#00C9A7' }}>{order.total.toLocaleString()}₽</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Трек: {order.tracking}</div>
                </div>
              </div>

              {/* Progress */}
              <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-0">
                  {stepLabels.map((label, i) => {
                    const done = i < st.steps;
                    const active = i === st.steps - 1;
                    return (
                      <div key={label} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{
                              background: done ? (active ? st.color : '#00A86B') : 'rgba(255,255,255,0.1)',
                              color: done ? 'white' : 'rgba(255,255,255,0.3)',
                              boxShadow: active ? `0 0 12px ${st.color}60` : 'none',
                            }}
                          >
                            {done ? '✓' : i + 1}
                          </div>
                          <span className="text-xs mt-1 whitespace-nowrap" style={{ color: done ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)', fontSize: '10px' }}>
                            {label}
                          </span>
                        </div>
                        {i < stepLabels.length - 1 && (
                          <div className="h-0.5 flex-1 mx-1 mb-4" style={{ background: i < st.steps - 1 ? '#00A86B' : 'rgba(255,255,255,0.08)' }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items */}
              <div className="p-5">
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <span style={{ color: 'rgba(255,255,255,0.65)' }}>{item.name} × {item.qty}</span>
                      <span className="font-medium text-white">{(item.price * item.qty).toLocaleString()}₽</span>
                    </div>
                  ))}
                </div>
                {order.status === 'delivered' && (
                  <button className="mt-4 text-sm px-4 py-2 rounded-xl transition-all" style={{ background: 'rgba(0,200,167,0.1)', color: '#00C9A7', border: '1px solid rgba(0,200,167,0.2)' }}>
                    Оставить отзыв
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
