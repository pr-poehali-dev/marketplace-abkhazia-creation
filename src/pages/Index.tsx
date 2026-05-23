import { useStore } from '@/store/useStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import HomePage from '@/pages/HomePage';
import CatalogPage from '@/pages/CatalogPage';
import ProductPage from '@/pages/ProductPage';
import ProfilePage from '@/pages/ProfilePage';
import SellersPage from '@/pages/SellersPage';
import SellerPage from '@/pages/SellerPage';
import BookmarksPage from '@/pages/BookmarksPage';
import OrdersPage from '@/pages/OrdersPage';
import SupportPage from '@/pages/SupportPage';
import AdminPage from '@/pages/AdminPage';

export default function Index() {
  const { currentPage } = useStore();

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'catalog': return <CatalogPage />;
      case 'product': return <ProductPage />;
      case 'profile': return <ProfilePage />;
      case 'sellers': return <SellersPage />;
      case 'seller': return <SellerPage />;
      case 'bookmarks': return <BookmarksPage />;
      case 'orders': return <OrdersPage />;
      case 'support': return <SupportPage />;
      case 'admin': return <AdminPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#0A1628' }}>
      <Header />
      <main>
        {renderPage()}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
