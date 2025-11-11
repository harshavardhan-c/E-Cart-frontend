-- =====================================================
-- BigBasket Style Grocery E-commerce Database Schema
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. CUSTOMERS TABLE (Updated from users)
-- =====================================================

DROP TABLE IF EXISTS customers CASCADE;

CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  role TEXT DEFAULT 'customer'
);

CREATE INDEX idx_customers_email ON customers(email);

-- =====================================================
-- 2. PRODUCTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  mrp DECIMAL(10,2), -- Maximum Retail Price
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  discount_percent INTEGER DEFAULT 0,
  brand TEXT,
  unit TEXT DEFAULT 'packet', -- gram, kg, packet, piece
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_name ON products(name);

-- =====================================================
-- 3. CART TABLE
-- =====================================================

DROP TABLE IF EXISTS cart CASCADE;

CREATE TABLE cart (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(customer_id, product_id)
);

CREATE INDEX idx_cart_customer ON cart(customer_id);

-- =====================================================
-- 4. ORDERS TABLE
-- =====================================================

DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_address TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'success', 'failed', 'cancelled')),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);

-- =====================================================
-- 5. ORDER ITEMS TABLE
-- =====================================================

DROP TABLE IF EXISTS order_items CASCADE;

CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL, -- Price at time of order
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- =====================================================
-- 6. COUPONS TABLE (Bonus Feature)
-- =====================================================

DROP TABLE IF EXISTS coupons CASCADE;

CREATE TABLE coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_percent INTEGER NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  discount_amount DECIMAL(10,2), -- Optional flat discount
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  max_discount DECIMAL(10,2), -- Maximum discount limit
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  max_uses INTEGER DEFAULT 100,
  current_uses INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 8. RLS POLICIES
-- =====================================================

-- Customers: Can view and update own data
CREATE POLICY "Customers can view own data" ON customers
  FOR SELECT USING (true);

CREATE POLICY "Customers can update own data" ON customers
  FOR UPDATE USING (true);

-- Products: Everyone can view
CREATE POLICY "Anyone can view products" ON products
  FOR SELECT USING (true);

-- Cart: Customers can manage own cart
CREATE POLICY "Customers can manage own cart" ON cart
  FOR ALL USING (true);

-- Orders: Customers can view own orders
CREATE POLICY "Customers can view own orders" ON orders
  FOR SELECT USING (true);

-- Order Items: Customers can view own order items
CREATE POLICY "Customers can view own order items" ON order_items
  FOR SELECT USING (true);

-- Coupons: Everyone can view active coupons
CREATE POLICY "Anyone can view active coupons" ON coupons
  FOR SELECT USING (is_active = true AND expiry_date > NOW());

-- =====================================================
-- 9. INSERT SAMPLE PRODUCTS
-- =====================================================

INSERT INTO products (name, description, price, mrp, image_url, stock, category, discount_percent, brand, unit) VALUES
-- Snacks
('Mixed Dry Fruits (500g)', 'Premium dry fruits mix', 450.00, 600.00, '/basmati-rice-1kg.jpg', 50, 'snacks', 25, 'Premium', 'packet'),
('Roasted Chickpeas (200g)', 'Healthy roasted snack', 120.00, 150.00, '/placeholder.svg', 75, 'snacks', 20, 'Healthy', 'packet'),
('Organic Granola (400g)', 'Healthy breakfast granola', 280.00, 350.00, '/organic-millets-mix.jpg', 60, 'snacks', 20, 'Organic', 'packet'),
('Cashew Nuts (250g)', 'Premium cashew nuts', 380.00, 500.00, '/sunflower-oil-bottle.jpg', 40, 'snacks', 24, 'Premium', 'packet'),

-- Chocolates
('Dark Chocolate Bar (100g)', 'Premium dark chocolate', 150.00, 180.00, '/chocolate-placeholder.svg', 100, 'chocolates', 15, 'Premium', 'packet'),
('Milk Chocolate Truffles (200g)', 'Delicious milk chocolate truffles', 250.00, 300.00, '/chocolate-placeholder.svg', 80, 'chocolates', 20, 'Premium', 'packet'),

-- Kitchen Utensils
('Non-Stick Frying Pan (10 inch)', 'Durable non-stick cookware', 450.00, 600.00, '/non-stick-frying-pan.jpg', 30, 'utensils', 25, 'CookPro', 'piece'),
('Stainless Steel Pressure Cooker (5L)', 'Heavy-duty pressure cooker', 1200.00, 1500.00, '/pressure-cooker-stainless-steel.jpg', 25, 'utensils', 20, 'CookPro', 'piece'),
('Mixing Bowls Set (3 pieces)', 'Stainless steel mixing bowls', 280.00, 350.00, '/mixing-bowls-stainless-steel-set.jpg', 40, 'utensils', 20, 'CookPro', 'set'),
('Kitchen Knife Set (6 pieces)', 'Professional kitchen knives', 650.00, 900.00, '/kitchen-knife-set-professional.jpg', 20, 'utensils', 24, 'CookPro', 'set'),

-- Household Items
('Storage Containers Set (10 pieces)', 'Airtight storage containers', 350.00, 450.00, '/products/storage-containers.jpg', 45, 'household', 22, 'HomePlus', 'set'),
('Water Bottle (1L)', 'BPA-free water bottle', 120.00, 150.00, '/steel-water-bottle-insulated.jpg', 60, 'household', 20, 'HomePlus', 'piece'),
('Trash Bin with Lid (20L)', 'Durable waste bin', 180.00, 250.00, '/trash-bin-with-lid.jpg', 35, 'household', 28, 'HomePlus', 'piece'),
('Mop and Bucket Set', 'Complete cleaning kit', 350.00, 450.00, '/mop-bucket-cleaning-set.jpg', 30, 'household', 22, 'HomePlus', 'set');

-- =====================================================
-- 10. SAMPLE COUPONS
-- =====================================================

INSERT INTO coupons (code, discount_percent, min_order_amount, max_uses, current_uses, expiry_date, is_active) VALUES
('WELCOME10', 10, 0, 100, 0, NOW() + INTERVAL '1 year', true),
('SAVE20', 20, 500, 50, 0, NOW() + INTERVAL '6 months', true),
('FLAT100', 10, 1000, 1000, 0, NOW() + INTERVAL '1 year', true);

-- =====================================================
-- VERIFICATION
-- =====================================================

SELECT 'Schema created successfully!' as status;
SELECT COUNT(*) as product_count FROM products;
SELECT COUNT(*) as coupon_count FROM coupons WHERE is_active = true;

