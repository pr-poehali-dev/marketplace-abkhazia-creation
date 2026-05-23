import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { products, categories } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import Icon from '@/components/ui/icon';

const heroSlides = [
  {
    title: 'Вкус настоящей\nАбхазии',
    subtitle: 'Мёд, вино, аджика — прямо от производителей',
    tag: '🍷 Более 800 товаров',
    gradient: 'linear-gradient(135deg, rgba(0,168,107,0.3) 0%, rgba(0,200,167,0.1) 100%)',
    accent: '#00C9A7',
  },
  {
    title: 'Ремёсла\nАпсны',
    subtitle: 'Уникальные изделия мастеров Абхазии',
    tag: '🏺 Ручная работа',
    gradient: 'linear-gradient(135deg, rgba(255,107,44,0.25) 0%, rgba(255,184,0,0.1) 100%)',
    accent: '#FF6B2C',
  },
  {
    title: 'Доставка по всей\nАбхазии',
    subtitle: 'Быстрая доставка в любой регион',
    tag: '📦 1–4 дня',
    gradient: 'linear-gradient(135deg, rgba(0,100,200,0.2) 0%, rgba(0,168,107,0.15) 100%)',
    accent: '#00A86B',
  },
];

export default function HomePage() {
  const { setPage, setSelectedCategory } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrentSlide(prev => (prev + 1) % heroSlides.length);
        setAnimating(false);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = heroSlides[currentSlide];
  const featuredProducts = products.slice(0, 8);
  const newProducts = products.filter(p => p.badge === 'Новинка' || !p.badge).slice(0, 4);
  const hotProducts = products.filter(p => p.badge && p.badge.includes('%')).slice(0, 4);

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    setPage('catalog');
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ minHeight: '500px' }}>
        <div
          className="hero-bg absolute inset-0 transition-all duration-700"
          style={{ background: slide.gradient ? `${slide.gradient}, linear-gradient(135deg, #0A1628 0%, #0D2137 60%, #031A12 100%)` : undefined }}
        />

        {/* Decorative orbs */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-10 animate-float" style={{ background: `radial-gradient(circle, ${slide.accent}, transparent)` }} />
        <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full opacity-8 animate-float" style={{ background: `radial-gradient(circle, #FFB800, transparent)`, animationDelay: '1s' }} />

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className={`transition-all duration-300 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              <div className="tag-badge inline-flex mb-4" style={{ borderColor: `${slide.accent}40`, color: slide.accent, background: `${slide.accent}15` }}>
                {slide.tag}
              </div>
              <h1 className="font-montserrat font-black text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: '1.1', whiteSpace: 'pre-line' }}>
                {slide.title}
              </h1>
              <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>{slide.subtitle}</p>

              <div className="flex flex-wrap gap-3">
                <button onClick={() => setPage('catalog')} className="btn-primary flex items-center gap-2">
                  <Icon name="ShoppingBag" size={18} className="text-white" />
                  Перейти в каталог
                </button>
                <button
                  onClick={() => setPage('sellers')}
                  className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:bg-white/10"
                  style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  Все продавцы
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-10">
                {[['800+', 'товаров'], ['150+', 'продавцов'], ['7', 'регионов']].map(([num, label]) => (
                  <div key={label}>
                    <div className="font-montserrat font-bold text-2xl" style={{ color: slide.accent }}>{num}</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero cards */}
            <div className="hidden md:grid grid-cols-2 gap-3">
              {products.slice(0, 4).map((p, i) => (
                <div
                  key={p.id}
                  className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                  style={{
                    background: 'rgba(13,33,55,0.8)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    animationDelay: `${i * 0.1}s`,
                  }}
                  onClick={() => { useStore.getState().setSelectedProduct(p); setPage('product'); }}
                >
                  <div className="h-28 overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-white line-clamp-1">{p.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#00C9A7' }}>{p.price.toLocaleString()}₽</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slide indicators */}
          <div className="flex gap-2 mt-8">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: i === currentSlide ? '32px' : '8px',
                  background: i === currentSlide ? slide.accent : 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-montserrat font-bold text-white text-2xl">Категории</h2>
          <button onClick={() => setPage('catalog')} className="text-sm flex items-center gap-1 transition-colors hover:text-white" style={{ color: '#00C9A7' }}>
            Все категории <Icon name="ChevronRight" size={16} />
          </button>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 hover:scale-105 animate-fade-in animate-opacity-0"
              style={{
                background: 'rgba(13,33,55,0.8)',
                border: '1px solid rgba(255,255,255,0.06)',
                animationDelay: `${i * 0.05}s`,
                animationFillMode: 'forwards',
              }}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs text-center font-medium leading-tight" style={{ color: 'rgba(255,255,255,0.7)' }}>{cat.name}</span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{cat.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* BANNER — Доставка */}
      <section className="max-w-7xl mx-auto px-4 mb-10">
        <div className="relative overflow-hidden rounded-3xl p-8 md:p-10"
          style={{ background: 'linear-gradient(135deg, #003D2B 0%, #00A86B 50%, #00C9A7 100%)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, white, transparent)', transform: 'translate(30%, -30%)' }} />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="tag-badge mb-3" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
                🚚 Доставка по всей Абхазии
              </div>
              <h3 className="font-montserrat font-black text-white text-2xl md:text-3xl mb-2">
                Бесплатная доставка<br />от 2000₽
              </h3>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Доставляем в Сухум, Гудауту, Гагру, Гал, Очамчиру и другие регионы
              </p>
            </div>
            <div className="flex flex-col gap-2 text-sm min-w-max">
              {[['📍 Сухум', '1-2 дня'], ['📍 Гудаута', '1-3 дня'], ['📍 Гагра', '2-3 дня'], ['📍 Россия', '5-14 дней']].map(([city, time]) => (
                <div key={city} className="flex items-center justify-between gap-6" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  <span>{city}</span>
                  <span className="font-semibold">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOT DEALS */}
      {hotProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-montserrat font-bold text-white text-2xl flex items-center gap-2">
              🔥 Горячие скидки
            </h2>
            <button onClick={() => setPage('catalog')} className="text-sm flex items-center gap-1 transition-colors hover:text-white" style={{ color: '#FF6B2C' }}>
              Все акции <Icon name="ChevronRight" size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hotProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* FEATURED */}
      <section className="max-w-7xl mx-auto px-4 mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-montserrat font-bold text-white text-2xl">Популярные товары</h2>
          <button onClick={() => setPage('catalog')} className="text-sm flex items-center gap-1 transition-colors hover:text-white" style={{ color: '#00C9A7' }}>
            Смотреть все <Icon name="ChevronRight" size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* BANNER — Стать продавцом */}
      <section className="max-w-7xl mx-auto px-4 mb-10">
        <div className="relative overflow-hidden rounded-3xl p-8 md:p-10"
          style={{ background: 'linear-gradient(135deg, #1a0a00 0%, #3d1500 50%, #FF6B2C22 100%)', border: '1px solid rgba(255,107,44,0.2)' }}>
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(255,107,44,0.15) 0%, transparent 60%)' }} />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="tag-badge tag-orange mb-3">Для продавцов</div>
              <h3 className="font-montserrat font-black text-white text-2xl md:text-3xl mb-2">
                Продавайте на АПСНЫ
              </h3>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Присоединяйтесь к 150+ продавцам. Простая регистрация, честная комиссия.
              </p>
            </div>
            <button onClick={() => setPage('admin')} className="btn-orange flex-shrink-0 px-8 py-4 text-base">
              Открыть магазин
            </button>
          </div>
        </div>
      </section>

      {/* SELLERS promo */}
      <section className="max-w-7xl mx-auto px-4 mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-montserrat font-bold text-white text-2xl">Лучшие продавцы</h2>
          <button onClick={() => setPage('sellers')} className="text-sm flex items-center gap-1 transition-colors hover:text-white" style={{ color: '#00C9A7' }}>
            Все продавцы <Icon name="ChevronRight" size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: 'Абхазские вина', icon: '🍷', rating: 4.8, products: 45, location: 'Сухум', id: 1 },
            { name: 'Горные пасеки', icon: '🍯', rating: 4.9, products: 28, location: 'Гудаута', id: 2 },
            { name: 'Ремёсла Абхазии', icon: '🏺', rating: 5.0, products: 67, location: 'Сухум', id: 5 },
          ].map((seller) => (
            <button
              key={seller.id}
              onClick={() => { useStore.getState().setSelectedSellerId(seller.id); setPage('seller'); }}
              className="glass-card glass-card-hover p-5 rounded-2xl text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  {seller.icon}
                </div>
                <div>
                  <p className="font-semibold text-white">{seller.name}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>📍 {seller.location}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: '#FFB800' }}>★ {seller.rating}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>{seller.products} товаров</span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
