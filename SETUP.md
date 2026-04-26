# SalonOS — Complete Setup Guide

## 🇬🇧 UK Luxury Unisex Salon — Booking Platform

A full-stack Next.js 15 platform for a premium London salon with online booking, stylist dashboards, Supabase Storage for all media, and a complete admin panel.

---

## Tech Stack

| Layer        | Technology                                      |
|--------------|-------------------------------------------------|
| Framework    | Next.js 15 · App Router · TypeScript            |
| Database     | PostgreSQL via Supabase                         |
| ORM          | Prisma 7 (pooled via PgBouncer)                 |
| Auth         | Supabase Auth (email/password + Google OAuth)   |
| Storage      | Supabase Storage (5 buckets, RLS-protected)     |
| Styling      | Tailwind CSS 4 + custom design system           |
| Animations   | Framer Motion                                   |
| Forms        | React Hook Form + Zod                           |
| UI Primitives| Radix UI (9 packages)                           |
| Images       | Next.js Image + custom Supabase loader          |
| Icons        | Lucide React                                    |
| Toasts       | Sonner                                          |
| Email        | Resend                                          |

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase and Resend credentials
```

### 3. Set up the database
```bash
# Push schema and generate Prisma client
npx prisma db push
npx prisma generate
```

### 4. Set up Supabase Storage
Run the SQL in `prisma/storage-setup.sql` in your **Supabase SQL Editor**:
- Dashboard → SQL Editor → New Query → paste file contents → Run

This creates 5 storage buckets with correct RLS policies:
| Bucket          | Used For                          | Max Size |
|-----------------|-----------------------------------|----------|
| `avatars`       | Customer & stylist profile photos | 2 MB     |
| `stylist-photos`| Stylist hero/featured images      | 5 MB     |
| `portfolios`    | Stylist portfolio/work images     | 8 MB     |
| `services`      | Service category images           | 4 MB     |
| `blog`          | Blog post cover images            | 5 MB     |

### 5. Enable Google OAuth (optional)
In Supabase Dashboard → Authentication → Providers → Google:
- Add your Google OAuth client ID and secret
- Add `http://localhost:3000/api/auth/callback` to allowed redirect URLs

### 6. Run the dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## User Roles & Access

| Role       | Portal URL          | Access                                           |
|------------|---------------------|--------------------------------------------------|
| Customer   | `/dashboard`        | Browse stylists, book, manage own appointments   |
| Stylist    | `/stylist/dashboard`| Manage schedule, availability, portfolio, services|
| Admin      | `/admin/dashboard`  | Full platform control                            |

On first signup, users are directed to `/onboarding` to choose their role.

---

## Storage — How It Works

### Upload Flow
```
User selects file → ImageUpload component validates (type + size)
→ POST /api/storage/upload (authenticated)
→ Supabase Storage (RLS policy checks user)
→ Returns public CDN URL
→ URL saved to database (Prisma)
```

### Image Optimisation
The custom Next.js image loader (`src/lib/supabase/image-loader.ts`) automatically:
- Routes Supabase Storage URLs through the **Supabase Image Transformation API**
- Resizes images on the CDN edge (no server-side processing)
- Serves AVIF/WebP via `formats` config in `next.config.ts`
- Falls back to standard Next.js optimisation for Unsplash placeholder images

### Bucket Paths
```
avatars/         {userId}/avatar-{timestamp}.jpg
stylist-photos/  {stylistId}/hero-{timestamp}.jpg
portfolios/      {stylistId}/{timestamp}-{random}.jpg
services/        {serviceId}-{timestamp}.jpg
blog/            {postId}-{timestamp}.jpg
```

---

## Deployment (Vercel)

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local.example`
4. Deploy — Vercel auto-detects Next.js

**Important:** Use the **pooled** Supabase connection string (port 6543) for `DATABASE_URL` in production. Serverless functions require connection pooling.

---

## Project Structure

```
src/
├── app/
│   ├── (marketing)/     Home, Services, Stylists, About, Blog, Contact
│   ├── (auth)/          Login, Register, Onboarding
│   ├── (customer)/      Dashboard, Book, Bookings, Profile
│   ├── (stylist)/       Dashboard, Availability, Bookings, Services, Profile
│   ├── (admin)/         Dashboard, Stylists, Services, Bookings, Blog, Settings
│   ├── api/
│   │   ├── availability/ GET  → compute free slots for a date
│   │   ├── bookings/     POST → create booking (conflict-checked)
│   │   ├── stylists/     GET list / PATCH own profile
│   │   ├── profile/      POST upsert on onboarding / GET own profile
│   │   ├── storage/
│   │   │   ├── upload/   POST → upload file to Supabase Storage
│   │   │   └── delete/   DELETE → remove file from Supabase Storage
│   │   └── auth/callback/ OAuth redirect handler
│   ├── sitemap.ts       Auto-generated XML sitemap
│   └── robots.ts        Protects /admin, /stylist, /api from indexing
├── components/
│   ├── ui/              25 design system components
│   ├── layout/          Navbar, Footer, Sidebars, DashboardShell
│   ├── marketing/       Hero, Services, Stylists, Testimonials, CTA
│   ├── booking/         4-step wizard (Service → Stylist → DateTime → Confirm)
│   └── shared/          ImageUpload, PortfolioUpload
├── hooks/               useAvailableSlots, useBooking, useRealtime, useStorage
├── lib/
│   ├── supabase/        client, server, middleware, image-loader, storage utils
│   ├── prisma/          singleton client
│   ├── seo/             metadata helpers, JSON-LD generators
│   ├── utils/           cn, dates, slots computation, images
│   └── validations/     Zod schemas (booking, availability)
└── types/               Shared TypeScript types
```

---

## Scripts

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npx prisma studio    # Visual database browser
npx prisma db push   # Push schema changes to database
npx prisma generate  # Regenerate Prisma client after schema changes
```

---

## Salon Details (Update These)

Search the codebase for these and replace with your real details:

| Placeholder                          | Replace With              |
|--------------------------------------|---------------------------|
| `14 Portobello Road`                 | Your salon address        |
| `Notting Hill, London W11 2DH`       | Your postcode             |
| `+44 20 7946 0958`                   | Your phone number         |
| `hello@salonos.co.uk`               | Your email                |
| `salonos.co.uk`                      | Your domain               |
| `@salonos.uk` / `@salonos_uk`        | Your social handles       |

---

Built with Next.js 15 · Prisma · Supabase · Tailwind CSS
