import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { products, categories, regions } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import Icon from '@/components/ui/icon';

export default function CatalogPage() {
  const { selectedCategory, setSelectedCategory, selectedRegion, setSelectedRegion, searchQuery } = useStore();
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating'>('popular');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCategory) list = list.filter(p => p.category === selectedCategory);
    if (selectedRegion && selectedRegion !== 'Все регионы') list = list.filter(p => p.region === selectedRegion);
    if (searchQuery) list = list.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    if (priceMin) list = list.filter(p => p.price >= Number(priceMin));
    if (priceMax) list = list.filter(p => p.price <= Number(priceMax));

    if (sortBy === 'price_asc') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [selectedCategory, selectedRegion, searchQuery, priceMin, priceMax, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-montserrat font-bold text-white text-2xl md:text-3xl">Каталог товаров</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Найдено {filtered.length} товаров</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
          style={{ background: 'rgba(0,200,167,0.1)', border: '1px solid rgba(0,200,167,0.2)', color: '#00C9A7' }}
        >
          <Icon name="SlidersHorizontal" size={16} />
          Фильтры
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside
          className={`w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}
          style={{
            position: window.innerWidth >= 768 ? 'sticky' : undefined,
            top: '100px',
            maxHeight: 'calc(100vh - 120px)',
            overflowY: 'auto',
          }}
        >
          <div className="space-y-4">
            {/* Categories */}
            <div className="rounded-2xl p-4" style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="font-montserrat font-bold text-white mb-3 text-sm">Категории</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('')}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm transition-all"
                  style={{
                    background: !selectedCategory ? 'rgba(0,200,167,0.12)' : 'transparent',
                    color: !selectedCategory ? '#00C9A7' : 'rgba(255,255,255,0.55)',
                    border: !selectedCategory ? '1px solid rgba(0,200,167,0.2)' : '1px solid transparent',
                  }}
                >
                  Все категории
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm transition-all flex items-center justify-between"
                    style={{
                      background: selectedCategory === cat.id ? 'rgba(0,200,167,0.12)' : 'transparent',
                      color: selectedCategory === cat.id ? '#00C9A7' : 'rgba(255,255,255,0.55)',
                      border: selectedCategory === cat.id ? '1px solid rgba(0,200,167,0.2)' : '1px solid transparent',
                    }}
                  >
                    <span>{cat.icon} {cat.name}</span>
                    <span className="text-xs opacity-60">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Region */}
            <div className="rounded-2xl p-4" style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="font-montserrat font-bold text-white mb-3 text-sm">Регион</h3>
              <div className="space-y-1">
                {regions.map(region => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region === 'Все регионы' ? '' : region)}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm transition-all"
                    style={{
                      background: (region === 'Все регионы' ? !selectedRegion : selectedRegion === region) ? 'rgba(0,200,167,0.12)' : 'transparent',
                      color: (region === 'Все регионы' ? !selectedRegion : selectedRegion === region) ? '#00C9A7' : 'rgba(255,255,255,0.55)',
                      border: (region === 'Все регионы' ? !selectedRegion : selectedRegion === region) ? '1px solid rgba(0,200,167,0.2)' : '1px solid transparent',
                    }}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="rounded-2xl p-4" style={{ background: 'rgba(13,33,55,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="font-montserrat font-bold text-white mb-3 text-sm">Цена, ₽</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="От"
                  value={priceMin}
                  onChange={e => setPriceMin(e.target.value)}
                  className="input-dark text-sm"
                />
                <input
                  type="number"
                  placeholder="До"
                  value={priceMax}
                  onChange={e => setPriceMax(e.target.value)}
                  className="input-dark text-sm"
                />
              </div>
            </div>

            {/* Reset */}
            {(selectedCategory || selectedRegion || priceMin || priceMax) && (
              <button
                onClick={() => { setSelectedCategory(''); setSelectedRegion(''); setPriceMin(''); setPriceMax(''); }}
                className="w-full py-2 rounded-xl text-sm transition-all hover:bg-red-500/20"
                style={{ color: 'rgba(255,100,100,0.7)', border: '1px solid rgba(255,100,100,0.2)' }}
              >
                Сбросить фильтры
              </button>
            )}
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          {/* Sort */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Сортировка:</span>
            {[
              { key: 'popular', label: 'Популярные' },
              { key: 'rating', label: 'По рейтингу' },
              { key: 'price_asc', label: 'Дешевле' },
              { key: 'price_desc', label: 'Дороже' },
            ].map(s => (
              <button
                key={s.key}
                onClick={() => setSortBy(s.key as typeof sortBy)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: sortBy === s.key ? 'rgba(0,200,167,0.15)' : 'rgba(255,255,255,0.05)',
                  color: sortBy === s.key ? '#00C9A7' : 'rgba(255,255,255,0.5)',
                  border: `1px solid ${sortBy === s.key ? 'rgba(0,200,167,0.25)' : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filtered.map((p, i) => (
                <div key={p.id} className="animate-fade-in animate-opacity-0" style={{ animationDelay: `${i * 0.04}s`, animationFillMode: 'forwards' }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-montserrat font-bold text-white text-lg mb-2">Ничего не найдено</h3>
              <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Попробуйте изменить фильтры или поисковый запрос</p>
              <button
                onClick={() => { setSelectedCategory(''); setSelectedRegion(''); setPriceMin(''); setPriceMax(''); }}
                className="btn-primary"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
