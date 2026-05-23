/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { api } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import Icon from '@/components/ui/icon';

const mapProduct = (p: any) => ({
  id: p.id as number,
  name: p.name as string,
  price: Number(p.price),
  oldPrice: p.old_price ? Number(p.old_price) : undefined,
  rating: Number(p.rating),
  reviews: p.reviews_count as number,
  category: p.category_slug as string,
  seller: (p.seller_name as string) || '',
  sellerId: p.seller_id as number,
  image: p.image_url as string,
  badge: p.badge as string | undefined,
  badgeType: p.badge_type as 'green' | 'orange' | 'gold' | undefined,
  region: p.region as string,
  inStock: p.in_stock as boolean,
  description: (p.description as string) || '',
  tags: (p.tags as string[]) || [],
});

export default function ProductPage() {
  const { selectedProduct, addToCart, toggleBookmark, bookmarks, setPage, setCartOpen } = useStore();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'delivery' | 'reviews'>('desc');
  const [related, setRelated] = useState<ReturnType<typeof mapProduct>[]>([]);

  useEffect(() => {
    if (!selectedProduct) return;
    api.getProducts({ limit: '4', sort: 'popular' })
      .then(data => {
        const prods = Array.isArray(data) ? data : (data.products || []);
        const mapped = (prods as any[]).map(mapProduct).filter(
          (r: ReturnType<typeof mapProduct>) => r.category === selectedProduct.category && r.id !== selectedProduct.id
        ).slice(0, 4);
        setRelated(mapped);
      });
  }, [selectedProduct]);

  if (!selectedProduct) { setPage('catalog'); return null; }

  const p = selectedProduct;
  const isBookmarked = bookmarks.includes(p.id);

  const handleBuy = () => {
    for (let i = 0; i < qty; i++) addToCart(p);
    setCartOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm flex-wrap">
        {[['Главная', 'home'], ['Каталог', 'catalog']].map(([label, page]) => (
          <span key={page} className="flex items-center gap-2">
            <button onClick={() => setPage(page as 'home' | 'catalog')} className="transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {label}
            </button>
            <Icon name="ChevronRight" size={14} style={{ color: 'rgba(255,255,255,0.2)' }} />
          </span>
        ))}
        <span className="text-white font-medium truncate max-w-xs">{p.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Image */}
        <div>
          <div className="relative rounded-3xl overflow-hidden mb-4" style={{ aspectRatio: '1', background: 'rgba(13,33,55,0.8)' }}>
            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
            {p.badge && (
              <div className={`absolute top-4 left-4 tag-badge text-sm py-1 px-3 ${p.badgeType === 'orange' ? 'tag-orange' : p.badgeType === 'gold' ? 'tag-gold' : ''}`}>
                {p.badge}
              </div>
            )}
            <button
              onClick={() => toggleBookmark(p.id)}
              className="absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              style={{ background: 'rgba(10,22,40,0.85)', backdropFilter: 'blur(8px)', border: `1px solid ${isBookmarked ? 'rgba(255,107,44,0.4)' : 'rgba(255,255,255,0.1)'}` }}
            >
              <Icon name="Heart" size={18} style={{ color: isBookmarked ? '#FF6B2C' : 'rgba(255,255,255,0.6)', fill: isBookmarked ? '#FF6B2C' : 'none' }} />
            </button>
          </div>
          {/* Thumbnails placeholder */}
          <div className="flex gap-3">
            {[0,1,2,3].map(i => (
              <div key={i} className="w-20 h-20 rounded-xl overflow-hidden cursor-pointer transition-all hover:opacity-80" style={{ border: i === 0 ? '2px solid #00C9A7' : '2px solid rgba(255,255,255,0.06)', background: 'rgba(13,33,55,0.8)' }}>
                <img src={p.image} alt="" className="w-full h-full object-cover opacity-70" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start gap-3 mb-2">
            <div className="flex-1">
              <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {p.seller} · 📍 {p.region}
              </p>
              <h1 className="font-montserrat font-bold text-white text-2xl md:text-3xl leading-tight">{p.name}</h1>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => (
                <span key={i} className="text-lg" style={{ color: i <= Math.round(p.rating) ? '#FFB800' : 'rgba(255,255,255,0.15)' }}>★</span>
              ))}
            </div>
            <span className="font-bold" style={{ color: '#FFB800' }}>{p.rating}</span>
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{p.reviews} отзывов</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {p.tags.map(tag => (
              <span key={tag} className="tag-badge">{tag}</span>
            ))}
          </div>

          {/* Price */}
          <div className="rounded-2xl p-5 mb-5" style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-end gap-3 mb-4">
              <span className="font-montserrat font-black text-3xl" style={{ color: '#00C9A7' }}>{(p.price * qty).toLocaleString()}₽</span>
              {p.oldPrice && (
                <span className="text-lg line-through mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{(p.oldPrice * qty).toLocaleString()}₽</span>
              )}
              {p.oldPrice && (
                <span className="tag-badge tag-orange mb-1">
                  -{Math.round((1 - p.price / p.oldPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Qty */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Количество:</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/10" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Icon name="Minus" size={14} style={{ color: 'rgba(255,255,255,0.7)' }} />
                </button>
                <span className="w-10 text-center font-bold text-white text-lg">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/10" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Icon name="Plus" size={14} style={{ color: 'rgba(255,255,255,0.7)' }} />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleBuy} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <Icon name="ShoppingCart" size={18} className="text-white" />
                В корзину
              </button>
              <button
                onClick={() => toggleBookmark(p.id)}
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
                style={{ border: `1px solid ${isBookmarked ? 'rgba(255,107,44,0.4)' : 'rgba(255,255,255,0.1)'}` }}
              >
                <Icon name="Heart" size={18} style={{ color: isBookmarked ? '#FF6B2C' : 'rgba(255,255,255,0.6)' }} />
              </button>
            </div>
          </div>

          {/* Delivery info */}
          <div className="rounded-2xl p-4" style={{ background: 'rgba(0,200,167,0.05)', border: '1px solid rgba(0,200,167,0.12)' }}>
            <div className="flex items-center gap-2 text-sm mb-2" style={{ color: '#00C9A7' }}>
              <Icon name="Truck" size={16} />
              <span className="font-semibold">Доставка</span>
            </div>
            <div className="space-y-1 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <div>📍 По Абхазии: 1-4 дня, от 150₽ (бесплатно от 2000₽)</div>
              <div>📦 Самовывоз: {p.region}</div>
              <div>🌍 В Россию: 5-14 дней, от 500₽</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex gap-2 mb-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {[['desc', 'Описание'], ['delivery', 'Доставка'], ['reviews', 'Отзывы']].map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'desc' | 'delivery' | 'reviews')}
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

        <div className="rounded-2xl p-6" style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {activeTab === 'desc' && (
            <div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>{p.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {[
                  ['Продавец', p.seller],
                  ['Регион', p.region],
                  ['Категория', p.category],
                  ['В наличии', p.inStock ? 'Да' : 'Нет'],
                  ['Рейтинг', `${p.rating} / 5`],
                  ['Отзывы', `${p.reviews}`],
                ].map(([key, val]) => (
                  <div key={key}>
                    <p className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{key}</p>
                    <p className="text-sm font-medium text-white">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'delivery' && (
            <div className="space-y-3">
              {[
                ['Сухум', '1-2 дня', 'Бесплатно от 2000₽'],
                ['Гудаута', '1-3 дня', '150₽'],
                ['Гагра', '2-3 дня', '200₽'],
                ['Гал', '2-4 дня', '250₽'],
                ['Россия', '5-14 дней', 'от 500₽'],
              ].map(([city, time, price]) => (
                <div key={city} className="flex items-center justify-between py-2 border-b text-sm" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <span className="text-white">📍 {city}</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{time}</span>
                  <span style={{ color: '#00C9A7' }}>{price}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {[
                { name: 'Аслан К.', rating: 5, text: 'Отличный товар! Доставили быстро, всё соответствует описанию.', date: '15.03.2024' },
                { name: 'Нана Г.', rating: 4, text: 'Очень понравилось, буду заказывать ещё. Рекомендую!', date: '02.03.2024' },
                { name: 'Руслан А.', rating: 5, text: 'Качество на высшем уровне. Настоящий абхазский продукт!', date: '18.02.2024' },
              ].map((r) => (
                <div key={r.name} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(135deg, #00A86B, #00C9A7)', color: 'white' }}>
                        {r.name[0]}
                      </div>
                      <span className="font-medium text-white text-sm">{r.name}</span>
                    </div>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{r.date}</span>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= r.rating ? '#FFB800' : 'rgba(255,255,255,0.15)' }}>★</span>)}
                  </div>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="font-montserrat font-bold text-white text-xl mb-4">Похожие товары</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map(r => (
              <ProductCard key={r.id} product={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
