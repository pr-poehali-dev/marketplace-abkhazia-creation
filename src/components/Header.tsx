import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { useStore } from '@/store/useStore';

export default function Header() {
  const { currentPage, setPage, getTotalItems, setCartOpen, isLoggedIn, searchQuery, setSearchQuery } = useStore();
  const totalItems = getTotalItems();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Главная', page: 'home' as const },
    { label: 'Каталог', page: 'catalog' as const },
    { label: 'Продавцы', page: 'sellers' as const },
    { label: 'Закладки', page: 'bookmarks' as const },
    { label: 'Поддержка', page: 'support' as const },
  ];

  return (
    <header className="sticky top-0 z-50 w-full" style={{ background: 'rgba(10, 22, 40, 0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0, 200, 167, 0.12)' }}>
      {/* Top bar */}
      <div className="border-b" style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
          <div className="flex items-center gap-4">
            <span>Маркетплейс Абхазии</span>
            <span className="hidden md:inline">Доставка по всем регионам</span>
          </div>
          <div className="flex items-center gap-4">
            <span>📞 +7 (840) 200-20-20</span>
            <button
              onClick={() => setPage('admin')}
              className="hidden md:inline hover:text-white transition-colors"
            >
              Для продавцов
            </button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <button
            onClick={() => setPage('home')}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold" style={{ background: 'linear-gradient(135deg, #00A86B, #00C9A7)' }}>
              А
            </div>
            <div className="hidden sm:block">
              <div className="font-montserrat font-800 text-white text-base leading-tight">АПСНЫ</div>
              <div className="text-xs" style={{ color: '#00C9A7' }}>маркетплейс</div>
            </div>
          </button>

          {/* Search */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Найти товары, продавцов, категории..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setPage('catalog');
                }}
                className="input-dark pr-12 text-sm"
              />
              <button
                onClick={() => setPage('catalog')}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{ background: 'linear-gradient(135deg, #00A86B, #00C9A7)' }}
              >
                <Icon name="Search" size={15} className="text-white" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Bookmarks */}
            <button
              onClick={() => setPage('bookmarks')}
              className="hidden md:flex w-10 h-10 rounded-xl items-center justify-center transition-all hover:bg-white/5"
              title="Закладки"
            >
              <Icon name="Heart" size={20} style={{ color: 'rgba(255,255,255,0.6)' }} />
            </button>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 px-3 h-10 rounded-xl transition-all"
              style={{ background: 'rgba(0, 200, 167, 0.12)', border: '1px solid rgba(0,200,167,0.2)' }}
            >
              <Icon name="ShoppingCart" size={18} style={{ color: '#00C9A7' }} />
              <span className="hidden sm:block text-sm font-semibold text-white">Корзина</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white animate-scale-in" style={{ background: 'linear-gradient(135deg, #FF6B2C, #FFB800)' }}>
                  {totalItems}
                </span>
              )}
            </button>

            {/* Profile */}
            <button
              onClick={() => setPage('profile')}
              className="flex items-center gap-2 px-3 h-10 rounded-xl transition-all"
              style={{ background: isLoggedIn ? 'rgba(0, 168, 107, 0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isLoggedIn ? 'rgba(0,168,107,0.3)' : 'rgba(255,255,255,0.08)'}` }}
            >
              <Icon name="User" size={18} style={{ color: isLoggedIn ? '#00C9A7' : 'rgba(255,255,255,0.6)' }} />
              <span className="hidden sm:block text-sm font-medium text-white">
                {isLoggedIn ? 'Профиль' : 'Войти'}
              </span>
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={20} style={{ color: 'rgba(255,255,255,0.8)' }} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1 mt-2">
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => setPage(link.page)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                color: currentPage === link.page ? '#00C9A7' : 'rgba(255,255,255,0.55)',
                background: currentPage === link.page ? 'rgba(0, 200, 167, 0.1)' : 'transparent',
                border: currentPage === link.page ? '1px solid rgba(0,200,167,0.2)' : '1px solid transparent',
              }}
            >
              {link.label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-3 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <button onClick={() => setPage('orders')} className="flex items-center gap-1 hover:text-white transition-colors">
              <Icon name="Package" size={13} />
              <span>Мои заказы</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t animate-fade-in" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(10,22,40,0.98)' }}>
          <div className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => { setPage(link.page); setMobileMenuOpen(false); }}
                className="py-3 px-4 rounded-xl text-left text-sm font-medium transition-all"
                style={{
                  color: currentPage === link.page ? '#00C9A7' : 'rgba(255,255,255,0.7)',
                  background: currentPage === link.page ? 'rgba(0,200,167,0.08)' : 'transparent',
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}