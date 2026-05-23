import { Product } from '@/data/products';
import { useStore } from '@/store/useStore';
import Icon from '@/components/ui/icon';

interface Props {
  product: Product;
  onView?: () => void;
}

export default function ProductCard({ product, onView }: Props) {
  const { addToCart, toggleBookmark, bookmarks, setPage, setSelectedProduct } = useStore();
  const isBookmarked = bookmarks.includes(product.id);

  const handleView = () => {
    setSelectedProduct(product);
    setPage('product');
    onView?.();
  };

  const badgeClass = product.badgeType === 'orange' ? 'tag-badge tag-orange'
    : product.badgeType === 'gold' ? 'tag-badge tag-gold'
    : 'tag-badge';

  return (
    <div className="product-card group cursor-pointer" onClick={handleView}>
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: '200px' }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 overlay-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge */}
        {product.badge && (
          <div className={`absolute top-3 left-3 ${badgeClass}`}>
            {product.badge}
          </div>
        )}

        {/* Bookmark */}
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
          style={{ background: 'rgba(10,22,40,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { e.stopPropagation(); toggleBookmark(product.id); }}
        >
          <Icon
            name={isBookmarked ? 'Heart' : 'Heart'}
            size={15}
            style={{ color: isBookmarked ? '#FF6B2C' : 'rgba(255,255,255,0.7)', fill: isBookmarked ? '#FF6B2C' : 'none' }}
          />
        </button>

        {/* Quick add */}
        <button
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #00A86B, #00C9A7)' }}
          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
        >
          + В корзину
        </button>

        {/* Region */}
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <span className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(10,22,40,0.85)', color: 'rgba(255,255,255,0.6)' }}>
            📍 {product.region}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{product.seller}</p>
        <h3 className="text-sm font-semibold text-white leading-tight mb-2 line-clamp-2 group-hover:text-teal-300 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map(i => (
              <span key={i} className="text-xs" style={{ color: i <= Math.round(product.rating) ? '#FFB800' : 'rgba(255,255,255,0.15)' }}>★</span>
            ))}
          </div>
          <span className="text-xs font-medium" style={{ color: '#FFB800' }}>{product.rating}</span>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-montserrat font-bold" style={{ color: '#00C9A7' }}>
              {product.price.toLocaleString()}₽
            </div>
            {product.oldPrice && (
              <div className="text-xs line-through" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {product.oldPrice.toLocaleString()}₽
              </div>
            )}
          </div>
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'linear-gradient(135deg, #00A86B, #00C9A7)' }}
            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
          >
            <Icon name="ShoppingCart" size={15} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
