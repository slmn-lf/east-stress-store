# 🚀 Pre-Order System

A modern pre-order management system built with Next.js, featuring WhatsApp integration, product catalog, and admin dashboard.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Key Features & Implementation](#key-features--implementation)
- [Database Schema](#database-schema)
- [API & Server Actions](#api--server-actions)
- [Components](#components)
- [Deployment](#deployment)

---

## ✨ Features

- 🛍️ **Product Catalog** - Browse and search pre-order products with detailed information
- 📝 **Order Form** - Customer can submit pre-orders with validation
- 💬 **WhatsApp Integration** - Auto-generate and send order confirmations via WhatsApp
- 👥 **Customer Management** - Track all customer orders and information
- 📊 **Admin Dashboard** - Manage products, view orders, and track pre-order status
- 🔐 **Authentication** - Login system for admin access
- 📱 **Responsive Design** - Mobile-friendly interface with Tailwind CSS
- 🖼️ **Image Management** - Upload and manage product images with Cloudinary
- 🔄 **Dynamic Forms** - Support for custom fields based on product requirements

---

## 🛠 Tech Stack

- **Frontend**: Next.js 16 with TypeScript, React 19, Tailwind CSS
- **Backend**: Next.js Server Actions, API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom login system
- **File Storage**: Cloudinary for image uploads
- **UI Components**: Lucide React icons
- **Deployment**: Vercel ready

---

## 📁 Project Structure

```
pre-order/
├── app/
│   ├── actions/              # Server actions
│   │   ├── auth.ts          # Authentication actions
│   │   ├── order.ts         # Order management
│   │   ├── product.ts       # Product operations
│   │   └── update-product.ts # Product updates
│   ├── admin/               # Admin pages
│   │   └── dashboard/
│   │       ├── products/    # Product management
│   │       └── profile/     # Admin profile
│   ├── api/                 # API routes
│   │   └── upload/          # Image upload endpoint
│   ├── auth/                # Authentication pages
│   │   └── login/
│   ├── products/            # Public product pages
│   │   └── [id]/
│   ├── components/          # Reusable components
│   │   ├── Admin/
│   │   ├── Form/
│   │   ├── layout/
│   │   └── Navbar/
│   ├── context/             # React context
│   └── layout.tsx           # Root layout
├── lib/
│   ├── prisma.ts           # Prisma client
│   └── whatsapp.ts         # WhatsApp utilities
├── prisma/
│   └── schema.prisma       # Database schema
├── public/                 # Static assets
└── package.json            # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Cloudinary account (for image uploads)
- Environment variables configured

### Installation

1. **Clone or navigate to the project:**

```bash
cd /Users/slmnlfrs/Projects/NEXT_JS/pre-order/pre-order
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables** (see [Environment Setup](#environment-setup) below)

4. **Setup the database:**

```bash
npx prisma migrate dev
npx prisma db seed  # if seed script exists
```

5. **Run development server:**

```bash
npm run dev
```

6. **Open in browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🔧 Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/pre_order_db"

# Cloudinary (Image Uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Admin credentials (if needed)
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="secure_password"

# WhatsApp (Business Account Number)
WHATSAPP_BUSINESS_NUMBER="628123456789"
```

---

## 🎯 Key Features & Implementation

### 1. Order Management System

**User Flow:**

1. Browse products on home page
2. Click "Pesan Sekarang" (Order Now) button
3. Fill in order form with:
   - Name (required)
   - WhatsApp number (required)
   - Email (optional)
   - Address (optional)
   - Quantity (required)
   - Additional custom fields (if defined for product)
4. Submit order
5. Success modal appears and auto-redirects to WhatsApp

**Related Files:**

- `app/actions/order.ts` - Server-side order processing
- `app/products/[id]/ProductOrderForm.tsx` - Order form component
- `app/components/OrderSuccessModal.tsx` - Success confirmation UI

### 2. WhatsApp Integration

Automatically generates and sends order confirmations with:

- Customer name and details
- Product name and specifications
- Order quantity and total
- Deep linking to WhatsApp Business Account

**Related Files:**

- `lib/whatsapp.ts` - WhatsApp utility functions

### 3. Admin Dashboard

- View and manage all products
- Create new products with custom fields
- Edit existing products
- Delete products
- View customer orders
- Track pre-order counts

**Related Files:**

- `app/admin/dashboard/` - Admin pages
- `app/admin/dashboard/products/` - Product management

### 4. Product Management

Products can have:

- Name, description, price
- Stock information
- Category
- Images (via Cloudinary)
- Pre-order counter
- Custom additional fields (JSON format)

---

## 💾 Database Schema

### Customer Table

```prisma
model Customer {
  id          String   @id @default(cuid())
  name        String
  email       String?
  phone       String   // WhatsApp number
  address     String?
  product     Product  @relation(fields: [productId], references: [id])
  productId   String
  quantity    Int
  customFields Json?   // Additional form fields
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Product Table

```prisma
model Product {
  id              String   @id @default(cuid())
  name            String
  description     String?
  price           Float
  stock           Int?
  category        String?
  image           String?  // Cloudinary URL
  totalPreOrder   Int      @default(0)
  additionalFields Json?  // Custom form fields definition
  customers       Customer[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

---

## 🔌 API & Server Actions

### Order Actions (`app/actions/order.ts`)

- **submitOrder()** - Submit new pre-order, saves customer, updates product counter
- **getOrders()** - Retrieve all orders with filtering options
- **getOrdersByProduct()** - Get orders for specific product

### Product Actions (`app/actions/product.ts`)

- **getProducts()** - Fetch all products
- **getProductById()** - Get single product details
- **searchProducts()** - Search products by name/category

### Auth Actions (`app/actions/auth.ts`)

- **login()** - Authenticate admin user
- **logout()** - Clear session

### Upload API (`app/api/upload/route.ts`)

- **POST /api/upload** - Upload image to Cloudinary

---

## 🎨 Components

### Layout Components

- **Navbar** - Main navigation with branding
- **BottomNav** - Mobile navigation bar
- **AdminLayout** - Admin dashboard wrapper
- **AdminSidebar** - Admin navigation

### Form Components

- **FormInput** - Reusable text input with validation
- **LoginForm** - Admin login form

### Business Components

- **OrderSuccessModal** - Order confirmation dialog
- **ProductOrderForm** - Complete order form with dynamic fields
- **ImageCarousel** - Product image gallery

---

## 🌐 Deployment

### ✅ Deployment Status

**PROJECT IS PRODUCTION-READY FOR VERCEL**

Build verification:

- ✅ Successful build with no errors
- ✅ TypeScript strict mode enabled
- ✅ All dependencies resolved
- ✅ Environment variables documented
- ✅ Database schema ready (Prisma)

---

### Deploy on Vercel (Recommended)

#### Step 1: Prepare Repository

1. Ensure all code is committed to GitHub

   ```bash
   git add .
   git commit -m "chore: prepare for Vercel deployment"
   git push origin main
   ```

2. Verify `.env.local` is in `.gitignore` (not pushed to repository)

3. Check `.gitignore` contains:
   ```
   .env*
   .vercel
   .next/
   node_modules/
   ```

#### Step 2: Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com)
2. Sign in with GitHub account (or create account)
3. Click **"Add New"** → **"Project"**
4. Select your repository from the GitHub list
5. Vercel will auto-detect Next.js framework
6. Click **"Deploy"** (or configure below first)

#### Step 3: Configure Build Settings (Optional)

Vercel should auto-detect these, but verify:

- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

#### Step 4: Set Environment Variables

In your Vercel Project Settings:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

```env
DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[database]"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

**Important**: Set each variable for:

- ✅ Production (required)
- ✅ Preview (optional)
- ✅ Development (optional)

#### Step 5: Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (2-3 minutes typically)
3. Once complete, you'll receive your live URL
4. Vercel automatically provides a domain: `https://[project-name].vercel.app`

#### Step 6: Post-Deployment Database Setup

After successful deployment, run database migrations:

**Option A: Using Vercel CLI**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Pull production environment variables locally
vercel env pull

# Run migrations against production database
npx prisma migrate deploy
```

**Option B: Direct command**

```bash
export DATABASE_URL="your_production_database_url"
npx prisma migrate deploy
npx prisma db push
```

---

### Vercel Configuration Best Practices

✅ Already configured in your project:

- Image optimization via `next.config.ts`
- Cloudinary remote patterns configured
- TypeScript strict mode enabled
- Edge middleware ready

---

### Monitoring After Deployment

1. **View Deployments**: Vercel Dashboard → Deployments tab
2. **Check Logs**: Deployments → Build Logs / Function Logs
3. **Monitor Analytics**: Analytics tab
4. **Error Tracking**: Function Logs for API errors

---

### Rollback to Previous Deployment

If issues occur:

1. Go to **Deployments** tab
2. Find previous successful deployment
3. Click **...** (three dots)
4. Select **"Promote to Production"**

---

### Custom Domain Setup

To use your own domain instead of vercel.app:

1. In Vercel Project Settings → **Domains**
2. Enter your custom domain
3. Follow DNS configuration instructions (CNAME or A records)
4. SSL certificate automatically provisioned
5. Domain active within minutes

---

### Troubleshooting Vercel Deployment

**Build Fails: "Cannot find module"**

- Clear cache: Deployments → Redeploy
- Check `package.json` dependencies
- Verify `tsconfig.json` path aliases

**Database Connection Timeout**

- Verify `DATABASE_URL` format
- Confirm PostgreSQL is accessible from Vercel
- Check database firewall whitelist

**Image Uploads Not Working**

- Verify Cloudinary credentials in Vercel env vars
- Test locally with same credentials first
- Check Cloudinary API key has upload permissions

**WhatsApp Integration Issues**

- Verify phone number format (include country code)
- Test locally before production
- Check browser console for JavaScript errors

---

### Database Migration Commands Reference

```bash
# Show migration status
npx prisma migrate status

# Apply pending migrations (production)
npx prisma migrate deploy

# Create schema snapshot
npx prisma db push

# Generate Prisma client
npx prisma generate

# Reset database (development only - deletes data!)
npx prisma migrate reset
```

---

## 📝 Development Notes

### Adding a New Custom Field to Product

1. Edit product in admin dashboard
2. Define field in "Additional Fields" as JSON:

```json
{
  "fields": [
    {
      "name": "color",
      "label": "Warna",
      "type": "text",
      "required": true
    }
  ]
}
```

3. Form will automatically render these fields in order form

### Updating WhatsApp Number

Edit `lib/whatsapp.ts` and update the business number in the message generation function.

### Changing Product Images

1. Use Cloudinary dashboard to manage assets
2. Update product image URL in database
3. Images auto-display in product pages

---

## 🐛 Troubleshooting

**Database Connection Error**

- Verify `DATABASE_URL` in `.env.local`
- Ensure PostgreSQL service is running
- Check database credentials

**WhatsApp Link Not Working**

- Verify WhatsApp number format (include country code)
- Check if browser allows redirects
- Test on desktop WhatsApp Web first

**Image Upload Failed**

- Verify Cloudinary credentials
- Check file size limits
- Ensure correct image format (JPG, PNG, WebP)

**Admin Login Not Working**

- Check `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env.local`
- Clear browser cookies/cache
- Check authentication logic in `app/actions/auth.ts`

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Cloudinary API](https://cloudinary.com/documentation)

---

## 📄 License

This project is private and proprietary.

---

**Last Updated:** November 18, 2025  
**Deployment Status:** ✅ Production-Ready
