import { useStore } from '@/store/useStore';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function BookmarksPage() {
  const { bookmarks, setPage } = useStore();
  const saved = products.filter(p => bookmarks.includes(p.id));

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
