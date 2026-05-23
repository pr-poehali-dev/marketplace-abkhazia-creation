import { useStore } from '@/store/useStore';
import Icon from '@/components/ui/icon';

export default function CartDrawer() {
  const { isCartOpen, setCartOpen, cartItems, removeFromCart, updateQuantity, getTotalPrice, setPage, clearCart } = useStore();

  const total = getTotalPrice();

  if (!isCartOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
        onClick={() => setCartOpen(false)}
      />
      <div
        className="fixed right-0 top-0 h-full z-50 flex flex-col w-full max-w-md animate-slide-in-right"
        style={{ background: 'linear-gradient(180deg, #0D2137 0%, #0A1628 100%)', borderLeft: '1px solid rgba(0,200,167,0.15)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div>
            <h2 className="font-montserrat font-bold text-white text-xl">Корзина</h2>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {cartItems.length} {cartItems.length === 1 ? 'товар' : cartItems.length < 5 ? 'товара' : 'товаров'}
            </p>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
          >
            <Icon name="X" size={18} style={{ color: 'rgba(255,255,255,0.6)' }} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
              <div className="text-5xl mb-4">🛒</div>
              <h3 className="font-montserrat font-bold text-white text-lg mb-2">Корзина пуста</h3>
              <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>Добавьте товары из каталога</p>
              <button
                onClick={() => { setCartOpen(false); setPage('catalog'); }}
                className="btn-primary px-6"
              >
                Перейти в каталог
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product.id}
                className="rounded-2xl p-4 flex gap-3"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div
                  className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium leading-tight line-clamp-2 mb-1">{item.product.name}</p>
                  <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.product.seller}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold" style={{ color: '#00C9A7' }}>
                      {(item.product.price * item.quantity).toLocaleString()}₽
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-white/10"
                        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <Icon name="Minus" size={12} style={{ color: 'rgba(255,255,255,0.7)' }} />
                      </button>
                      <span className="w-7 text-center text-sm font-semibold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-white/10"
                        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <Icon name="Plus" size={12} style={{ color: 'rgba(255,255,255,0.7)' }} />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="self-start w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-red-500/20"
                >
                  <Icon name="Trash2" size={13} style={{ color: 'rgba(255,100,100,0.6)' }} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            {/* Delivery hint */}
            <div className="rounded-xl p-3 mb-3 flex items-center gap-2" style={{ background: 'rgba(0,200,167,0.08)', border: '1px solid rgba(0,200,167,0.15)' }}>
              <Icon name="Truck" size={14} style={{ color: '#00C9A7' }} />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Доставка по регионам Абхазии {total >= 2000 ? '— бесплатно!' : `— от 150₽ (бесплатно от 2000₽)`}
              </span>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Итого:</span>
              <span className="text-2xl font-montserrat font-bold text-white">{total.toLocaleString()}₽</span>
            </div>

            <button
              onClick={() => { setCartOpen(false); setPage('profile'); }}
              className="btn-primary w-full text-center py-3 text-base"
            >
              Оформить заказ
            </button>

            <button
              onClick={clearCart}
              className="mt-2 w-full text-center py-2 text-sm transition-all hover:text-white"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              Очистить корзину
            </button>
          </div>
        )}
      </div>
    </>
  );
}
