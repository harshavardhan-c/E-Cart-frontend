Lalitha Mega Mall – System Architecture and Implementation Report

Overview
This document explains the technologies, architecture, data models, and end‑to‑end workflows in the Lalitha Mega Mall application. It covers both the Frontend (Next.js) and the Backend (Node.js/Supabase) pieces, including authentication, cart, checkout/payment, products, and the admin panel.

Technology Stack
- Frontend
  - Next.js 16 (App Router, React 19 client components)
  - React 19 + TypeScript
  - Redux Toolkit (global state: user, cart, products, orders, coupons)
  - Axios (API client with auth interceptors)
  - UI: Utility-class styling (Tailwind-like classes), shadcn primitives, lucide-react icons
  - Framer Motion (UI animations)
  - Razorpay Checkout web SDK (client-side payment)
  - Supabase JS client (public storage uploads from admin panel)

- Backend
  - Node.js/Express style API (see backend/)
  - Supabase (PostgreSQL + Storage)
  - Email-based OTP auth (Nodemailer) – no password flows
  - JWT access + refresh tokens

Key Frontend Modules (selected)
- Frontend/src/api/axiosConfig.ts
  - Centralized Axios with base URL (NEXT_PUBLIC_API_BASE_URL)
  - Adds Authorization header from localStorage
  - 401 refresh flow using /auth/refresh-token

- Frontend/src/api/authApi.ts
  - POST /auth/send-otp
  - POST /auth/verify-otp (returns { user, accessToken, refreshToken })
  - POST /auth/refresh-token
  - GET/PUT /auth/profile

- Frontend/src/api/productsApi.ts
  - GET /products (admin list)
  - GET /products/:category
  - GET /products/:category/:id
  - GET /products/search?q=…
  - Admin: POST /admin/:category, PUT /admin/:category/:id, DELETE /admin/:category/:id, PUT /admin/products/:id/stock

- Frontend/src/api/cartApi.ts
  - Supports two modes
    1) Guest: reads/writes localStorage('guestCart') with an event broadcast guestCartUpdated
    2) Auth: calls backend /cart endpoints and merges items

- Frontend/store/slices
  - userSlice: sendOtp, verifyOtp, getProfile, updateProfile, refreshToken
  - cartSlice: fetchCart, addToCart, updateCartItem, removeFromCart, clearCart
  - orderSlice: createOrderThunk, updateOrderStatus, fetchUserOrders, fetchOrderById
  - couponSlice: validateCoupon

- Frontend/hooks
  - use-cart.ts: high-level cart behavior for guest vs auth, sync, quantities, totals
  - use-app-dispatch.ts / use-app-selector.ts: typed Redux helpers

Backend (selected)
- backend/controllers/authController.js
  - sendOtpToEmail: validates email, generates OTP, stores to Supabase table otps with purpose (login/signup), emails OTP via Nodemailer
  - verifyOtpAndLogin: validates OTP, creates user in Supabase users table if not present, issues access/refresh tokens

- backend/models/usersModel.js
  - createUser / getUserByEmail / getUserById / updateUser etc. against Supabase users table

- backend/models/otpModel.js
  - createOtp(email, otp, expires, purpose), getOtpByEmail, updateAttempts, deleteOtp, deleteExpiredOtps

- backend/models/ordersModel.js
  - creates and retrieves orders in Supabase orders table

Data Models (primary tables)
- users
  - id (uuid, PK)
  - email (text, unique)
  - name (text)
  - role (text, default 'customer')
  - created_at (timestamp)

- products (single table as per /products endpoints)
  - id (uuid, PK)
  - name (text)
  - description (text)
  - price (numeric)
  - discount (numeric)
  - stock (int) or stock_quantity (some places map to stock)
  - stock_status (text)
  - brand (text)
  - image_url (text)
  - featured (boolean)
  - extra_images (text[] if present)
  - category (text)
  - created_at/updated_at (timestamps)

- otps
  - email, otp, expires_at, attempts, purpose

- orders
  - id, customer_id, total_amount, delivery_address, payment_status, status
  - razorpay_order_id, razorpay_payment_id, created_at

Authentication & Authorization Flow (OTP, JWT)
1) Registration (Frontend)
   - On /register, user enters name + email
   - sendOtp(email) – backend stores OTP in otps and emails it
   - User enters OTP – verifyOtp({ email, otp, name })
   - Backend creates user in users if new and returns tokens
   - Frontend stores tokens + user in localStorage and Redux

2) Login
   - Same as registration but purpose is 'login' and no user insert

3) Session
   - Axios interceptor adds Authorization: Bearer <token>
   - On 401, tries POST /auth/refresh-token with refreshToken in Redux/localStorage
   - On success, retries original request; on failure, logs out

Cart Architecture & Data Flow
Guest (no JWT)
  - use-cart.ts detects no accessToken → guest mode
  - Items kept in localStorage('guestCart') with minimal product snapshot: { id, product_id, quantity, products: { id,name,price,image_url,category } }
  - UI listens for 'guestCartUpdated' events to sync across tabs and components

Authenticated (JWT present)
  - use-cart.ts dispatches fetchCart → backend/cart
  - addToCart / updateCartItem / removeFromCart communicate with backend and refresh via fetchCart
  - Totals computed from backend response; UI reflects Redux state

Checkout & Payments
- /cart → Proceed to Checkout navigates to /checkout (no order creation here)
- /checkout (Frontend/app/checkout/page.tsx)
  - Step 1: Address entry (name/email/phone/address/city/pincode)
  - Step 2: Payment method (Razorpay, COD)
  - Step 3: Review & Place Order
  - On Place Order:
    - Dispatch createOrderThunk({ deliveryAddress, paymentMethod }) to backend
    - If COD: mark placed and navigate to orders
    - If Razorpay: load Razorpay SDK and open checkout with amount (total in paise)
      - On success handler: dispatch updateOrderStatus({ id, updateData: { payment_status:'paid', status:'processing', razorpay_payment_id, razorpay_order_id } })
      - On modal dismiss: mark payment_status:'failed'

Admin Product Management
- File: Frontend/components/admin/product-management.tsx
  - Add/Edit/Delete wired to productsApi endpoints
  - Image upload to Supabase Storage bucket 'public' → getPublicUrl → sets image_url
  - Supports feature flag, brand, discount, stock/stock_status, extra_images (URLs)
  - Search + Category filter with instant table updates; list refresh after mutations

Search & Product Pages
- /products – full product list with filters and sort (category, price range, etc.)
- /product/[id] – product detail page
  - Loads product by search API (id match) and shows related products by category

Navbar & Layout
- Navbar component exposes a client-safe action prop onCartClickAction to open the cart drawer
- Global theming toggle, wishlist shortcut, and profile dropdown

Email/OTP Infrastructure
- Nodemailer-based email sending (see backend docs and SMTP_CREDENTIALS_GUIDE)
- OTP stored in Supabase (otps table) with expiry and attempt counters

Environment Variables (Frontend)
- NEXT_PUBLIC_API_BASE_URL – base HTTP API URL
- NEXT_PUBLIC_SUPABASE_URL – Supabase URL for storage
- NEXT_PUBLIC_SUPABASE_ANON_KEY – Supabase anon key
- NEXT_PUBLIC_RAZORPAY_KEY – Razorpay public key

Environment Variables (Backend)
- SMTP credentials for Nodemailer
- Supabase service key (server)
- JWT secret for access/refresh tokens

Security Notes
- Admin routes protected by JWT – make sure backend verifies admin role
- Supabase RLS: ensure proper policies on tables; storage bucket 'public' read rules
- Do not expose service keys on the client – only anon key is used on frontend

Build/Run Quickstart
Frontend
  - env: create Frontend/.env.local with variables above
  - npm run dev

Backend
  - env: backend/.env for SMTP, Supabase, JWT
  - npm run dev (or the project’s server start script)

Operational Notes / Gaps to Confirm
- products API schema: Some slices and UI expect either stock or stock_quantity. Backend should map one to the other consistently.
- Ensure storage bucket name matches ('public' used in admin UI) and has public read policy.
- TailwindCSS: UI uses utility classes; ensure Tailwind is configured in the project where applicable.

High-Level Data Flows (Text)
User Signup (OTP)
  UI(Register) → POST /auth/send-otp → Email OTP → UI(OTP) → POST /auth/verify-otp → tokens+user → store in Redux/localStorage

Cart (Guest)
  UI → localStorage('guestCart') → UI sync via 'guestCartUpdated' events

Cart (Authenticated)
  UI → Redux thunk (add/update/remove) → Backend /cart → DB → Redux fetchCart refresh → UI

Order (Razorpay)
  UI Place Order → POST /orders (create) → Razorpay checkout → success handler → PUT /orders/:id (paid, processing)

Admin Product Lifecycle
  Admin UI → POST /admin/:category (create) or PUT /admin/:category/:id (update) → DB
  Upload → Supabase Storage (public) → image_url persisted with product
  Delete → DELETE /admin/:category/:id → DB → UI refresh


