import { useStore } from '@/store/useStore';
import { sellers, products } from '@/data/products';
import Icon from '@/components/ui/icon';

export default function SellersPage() {
  const { setPage, setSelectedSellerId } = useStore();

  const openSeller = (id: number) => {
    setSelectedSellerId(id);
    setPage('seller');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-montserrat font-bold text-white text-3xl mb-2">Продавцы</h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {sellers.length} проверенных продавца из всех регионов Абхазии
        </p>
      </div>

      {/* Top sellers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {sellers.slice(0, 3).map((seller, i) => (
          <button
            key={seller.id}
            onClick={() => openSeller(seller.id)}
            className="relative glass-card glass-card-hover rounded-3xl p-6 text-left animate-fade-in animate-opacity-0"
            style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'forwards' }}
          >
            {i === 0 && (
              <div className="absolute top-4 right-4 tag-badge tag-gold">👑 Топ продавец</div>
            )}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                {seller.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-montserrat font-bold text-white">{seller.name}</h3>
                  {seller.verified && <span className="text-teal-400">✓</span>}
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>📍 {seller.location} · с {seller.joinDate}</p>
              </div>
            </div>
            <p className="text-sm mb-4 line-clamp-2" style={{ color: 'rgba(255,255,255,0.55)' }}>{seller.description}</p>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <span style={{ color: '#FFB800' }}>★ {seller.rating}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>({seller.reviews})</span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>{seller.productsCount} товаров</span>
            </div>
          </button>
        ))}
      </div>

      {/* All sellers */}
      <div className="space-y-3">
        {sellers.slice(3).map((seller, i) => (
          <button
            key={seller.id}
            onClick={() => openSeller(seller.id)}
            className="w-full glass-card glass-card-hover rounded-2xl p-5 text-left flex items-center gap-4 animate-fade-in animate-opacity-0"
            style={{ animationDelay: `${i * 0.08}s`, animationFillMode: 'forwards' }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
              {seller.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-white">{seller.name}</h3>
                {seller.verified && <span className="tag-badge text-xs py-0">✓ Верифицирован</span>}
              </div>
              <p className="text-sm truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>{seller.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div style={{ color: '#FFB800' }}>★ {seller.rating}</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{seller.productsCount} товаров</div>
            </div>
            <Icon name="ChevronRight" size={18} style={{ color: 'rgba(255,255,255,0.25)' }} />
          </button>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 rounded-3xl p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(0,168,107,0.12) 0%, rgba(0,200,167,0.06) 100%)', border: '1px solid rgba(0,200,167,0.15)' }}>
        <h3 className="font-montserrat font-bold text-white text-2xl mb-2">Станьте продавцом</h3>
        <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Продавайте свои товары миллионам покупателей. Простая регистрация, честная комиссия.
        </p>
        <button onClick={() => setPage('admin')} className="btn-primary px-8 py-3 text-base">
          Открыть магазин
        </button>
      </div>
    </div>
  );
}
