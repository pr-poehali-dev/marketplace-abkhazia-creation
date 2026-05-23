/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { api } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

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

export default function BookmarksPage() {
  const { bookmarks, setPage } = useStore();
  const [allProducts, setAllProducts] = useState<ReturnType<typeof mapProduct>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts({ limit: '50' })
      .then(data => {
        const prods = Array.isArray(data) ? data : (data.products || []);
        setAllProducts((prods as any[]).map(mapProduct));
      })
      .finally(() => setLoading(false));
  }, []);

  const saved = allProducts.filter(p => bookmarks.includes(p.id));

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-montserrat font-bold text-white text-3xl mb-2">Закладки</h1>
        <p className="text-sm mt-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-montserrat font-bold text-white text-3xl mb-2">Закладки</h1>
      <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
        {saved.length} {saved.length === 1 ? 'товар' : 'товаров'} сохранено
      </p>

      {saved.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">❤️</div>
          <h3 className="font-montserrat font-bold text-white text-xl mb-2">Пока нет закладок</h3>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Нажмите ❤ на карточке товара, чтобы сохранить его
          </p>
          <button onClick={() => setPage('catalog')} className="btn-primary">
            Перейти в каталог
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {saved.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
