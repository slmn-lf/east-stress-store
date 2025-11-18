# 🚀 Setup & Environment Configuration Guide

Panduan lengkap untuk setup project dan konfigurasi environment sebelum development atau deployment.

---

## 📋 Prerequisites

Pastikan sudah terinstall:

- **Node.js** v18.17+ atau lebih baru
- **npm** atau **yarn** package manager
- **Git** untuk version control
- **PostgreSQL** (untuk local development)

---

## 🔧 Initial Setup

### 1. Install Dependencies

```bash
npm install
# atau jika menggunakan yarn
yarn install
```

### 2. Setup Database

**Setup Prisma & PostgreSQL:**

```bash
# Buat database PostgreSQL di local atau cloud
# Update DATABASE_URL di .env.local

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

### 3. Environment Variables

Buat file `.env.local` di root project dengan konfigurasi berikut:

#### Database Configuration

```env
# Database URL untuk Prisma
DATABASE_URL="postgresql://user:password@localhost:5432/preorder_db"
```

#### Next.js Configuration

```env
# Node Environment
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

#### Cloudinary Configuration (untuk upload gambar)

```env
# Cloudinary API
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### WhatsApp Integration (optional)

```env
# WhatsApp API (jika menggunakan service seperti Twilio atau WhatsApp Business API)
WHATSAPP_API_URL=your_whatsapp_api_url
WHATSAPP_API_TOKEN=your_api_token
WHATSAPP_PHONE_NUMBER=your_business_number
```

#### Authentication (jika diperlukan)

```env
# NextAuth atau Authentication Provider
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
```

---

## 🛢️ Database Setup

### Local PostgreSQL Setup

```bash
# Jika menggunakan Homebrew (macOS)
brew install postgresql@16
brew services start postgresql@16

# Buat database baru
createdb preorder_db

# Setup user (opsional)
psql -U postgres -c "CREATE USER preorder_user WITH PASSWORD 'password';"
psql -U postgres -c "ALTER USER preorder_user CREATEDB;"
```

### Run Migrations

```bash
# Create & run migration
npx prisma migrate dev

# View database GUI
npx prisma studio
```

### Seed Data (opsional)

Jika ada file `prisma/seed.ts`:

```bash
npx prisma db seed
```

---

## 🚀 Development Server

```bash
# Start development server
npm run dev
# atau
yarn dev

# Server berjalan di http://localhost:3000
```

---

## 🏗️ Building for Production

```bash
# Build project
npm run build

# Start production server
npm run start
```

---

## 🌐 Deployment Checklist

Sebelum deploy ke Vercel, pastikan:

### Environment Variables di Vercel

Set semua variabel di Vercel Dashboard → Project Settings → Environment Variables:

- `DATABASE_URL` (PostgreSQL, gunakan Neon atau Supabase)
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- Environment lainnya sesuai kebutuhan

### Database untuk Production

```
Recommended services:
- Neon (PostgreSQL) → https://neon.tech
- Supabase (PostgreSQL) → https://supabase.com
- Vercel Postgres → https://vercel.com/storage/postgres
```

### Update Production URLs

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com
```

### Pre-Deployment Build Test

```bash
# Test build process
npm run build

# Jika ada error, fix terlebih dahulu sebelum push
```

---

## 📁 Project Structure

```
pre-order/
├── app/                          # Next.js App Router
│   ├── actions/                  # Server Actions
│   ├── admin/                    # Admin dashboard
│   ├── api/                      # API routes
│   ├── auth/                     # Authentication pages
│   ├── components/               # React components
│   ├── context/                  # React Context
│   ├── products/                 # Product pages
│   └── layout.tsx               # Root layout
├── lib/                          # Utility functions
├── prisma/                       # Database schema & migrations
├── public/                       # Static assets
├── .env.local                    # Environment variables (not committed)
├── .gitignore                    # Git ignore rules
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

---

## 🔐 .gitignore Explanation

File `.gitignore` mencegah file tertentu di-commit ke git:

```gitignore
# Dependencies
/node_modules          # Installed packages (regenerate dengan npm install)

# Environment
.env                   # Sensitive credentials
.env.local            # Local environment variables
.env.*.local          # Environment-specific files

# Build outputs
/.next/               # Next.js build cache
/out/                 # Static export output
/build/               # Build directory

# Logs
npm-debug.log*        # NPM error logs
yarn-error.log*       # Yarn error logs

# IDE & OS
.vscode/              # VS Code settings (some files committed)
.idea/                # JetBrains IDE
.DS_Store             # macOS files
Thumbs.db             # Windows files

# Database
prisma/*.db           # Local SQLite (jika ada)
prisma/*.db-journal   # Database journal files
```

---

## ✅ Verification Checklist

- [ ] Node.js & npm terinstall
- [ ] Dependencies di-install (`npm install`)
- [ ] `.env.local` file created dengan semua variables
- [ ] Database connect successfully
- [ ] Prisma migrations run
- [ ] Development server berjalan (`npm run dev`)
- [ ] Build success (`npm run build`)
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] `.gitignore` configured correctly
- [ ] Sensitive files tidak di-commit

---

## 🐛 Troubleshooting

### Build Error: "DATABASE_URL not found"

```bash
# Solution: Pastikan .env.local ada di root directory
touch .env.local
# Tambahkan DATABASE_URL ke file tersebut
```

### Prisma Client error

```bash
# Solution: Regenerate Prisma Client
npx prisma generate
```

### Port 3000 sudah digunakan

```bash
# Solution: Gunakan port berbeda
npm run dev -- -p 3001
```

### Module not found error

```bash
# Solution: Clear cache dan reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

---

## 📞 Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Vercel Docs**: https://vercel.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

---

**Last Updated**: November 18, 2025
**Status**: Ready for Production Deployment ✅
