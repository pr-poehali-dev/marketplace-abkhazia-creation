import { useStore } from '@/store/useStore';
import { sellers, products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import Icon from '@/components/ui/icon';

export default function SellerPage() {
  const { selectedSellerId, setPage } = useStore();
  const seller = sellers.find(s => s.id === selectedSellerId);
  const sellerProducts = products.filter(p => p.sellerId === selectedSellerId);

  if (!seller) { setPage('sellers'); return null; }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back */}
      <button onClick={() => setPage('sellers')} className="flex items-center gap-2 mb-6 text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.4)' }}>
        <Icon name="ChevronLeft" size={18} />
        Все продавцы
      </button>

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 mb-8" style={{ background: 'linear-gradient(135deg, rgba(0,168,107,0.12), rgba(0,200,167,0.06))', border: '1px solid rgba(0,200,167,0.15)' }}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }}>
            {seller.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="font-montserrat font-black text-white text-2xl">{seller.name}</h1>
              {seller.verified && (
                <span className="tag-badge flex items-center gap-1">
                  <Icon name="BadgeCheck" size={12} />
                  Верифицирован
                </span>
              )}
            </div>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.55)' }}>{seller.description}</p>
            <div className="flex flex-wrap gap-6 text-sm">
              {[
                ['★ ' + seller.rating, seller.reviews + ' отзывов', '#FFB800'],
                ['📍 ' + seller.location, 'Регион', 'rgba(255,255,255,0.6)'],
                [seller.productsCount + ' товаров', 'В каталоге', '#00C9A7'],
                ['С ' + seller.joinDate + ' года', 'На платформе', 'rgba(255,255,255,0.6)'],
              ].map(([main, sub, color]) => (
                <div key={main}>
                  <div className="font-bold" style={{ color }}>{main}</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
          <button className="btn-primary flex items-center gap-2 flex-shrink-0">
            <Icon name="MessageCircle" size={16} className="text-white" />
            Написать
          </button>
        </div>
      </div>

      {/* Products */}
      <div>
        <h2 className="font-montserrat font-bold text-white text-xl mb-4">
          Товары продавца ({sellerProducts.length})
        </h2>
        {sellerProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sellerProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-12" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <div className="text-4xl mb-3">📦</div>
            <p>У этого продавца пока нет товаров</p>
          </div>
        )}
      </div>
    </div>
  );
}
