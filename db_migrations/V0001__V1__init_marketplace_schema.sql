CREATE TABLE IF NOT EXISTS t_p13685580_marketplace_abkhazia.categories (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(20) NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p13685580_marketplace_abkhazia.sellers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    avatar VARCHAR(20) DEFAULT '🏪',
    description TEXT,
    location VARCHAR(100),
    phone VARCHAR(30),
    email VARCHAR(150),
    rating NUMERIC(3,2) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    products_count INT DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    join_year VARCHAR(4) DEFAULT '2024',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p13685580_marketplace_abkhazia.products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(300) NOT NULL,
    description TEXT,
    price NUMERIC(12,2) NOT NULL,
    old_price NUMERIC(12,2),
    category_slug VARCHAR(50),
    seller_id INT,
    image_url TEXT,
    badge VARCHAR(50),
    badge_type VARCHAR(10),
    region VARCHAR(100),
    in_stock BOOLEAN DEFAULT TRUE,
    rating NUMERIC(3,2) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p13685580_marketplace_abkhazia.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    role VARCHAR(20) DEFAULT 'user',
    avatar VARCHAR(20) DEFAULT '👤',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p13685580_marketplace_abkhazia.orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(30) UNIQUE NOT NULL,
    user_id INT,
    user_name VARCHAR(200),
    user_email VARCHAR(150),
    user_phone VARCHAR(30),
    status VARCHAR(30) DEFAULT 'processing',
    total_price NUMERIC(12,2) NOT NULL,
    delivery_region VARCHAR(100),
    delivery_address TEXT,
    tracking_code VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p13685580_marketplace_abkhazia.order_items (
    id SERIAL PRIMARY KEY,
    order_id INT,
    product_id INT,
    product_name VARCHAR(300),
    quantity INT NOT NULL DEFAULT 1,
    price NUMERIC(12,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS t_p13685580_marketplace_abkhazia.reviews (
    id SERIAL PRIMARY KEY,
    product_id INT,
    user_name VARCHAR(200) NOT NULL,
    rating INT,
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p13685580_marketplace_abkhazia.bookmarks (
    id SERIAL PRIMARY KEY,
    user_id INT,
    product_id INT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON t_p13685580_marketplace_abkhazia.products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_seller ON t_p13685580_marketplace_abkhazia.products(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON t_p13685580_marketplace_abkhazia.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON t_p13685580_marketplace_abkhazia.order_items(order_id);
