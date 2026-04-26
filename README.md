# SalonOS

**London's Premier Luxury Unisex Salon — Full-Stack Booking Platform**

Built with Next.js 15, Prisma, Supabase (Auth + Storage + Realtime), and Tailwind CSS.

## Quick Start

```bash
npm install
cp .env.local.example .env.local   # add your Supabase keys
npx prisma db push && npx prisma generate
# Run storage-setup.sql in Supabase SQL Editor
npm run dev
```

See **[SETUP.md](./SETUP.md)** for the complete setup guide including Supabase Storage configuration.

## What's Inside

- **Marketing site** — Home, Services, Stylists (with individual profile pages), About, Blog, Contact
- **Booking wizard** — 4-step flow: Service → Stylist → Date/Time → Confirm
- **Customer portal** — Dashboard, bookings history, profile
- **Stylist dashboard** — Schedule, availability manager, portfolio upload, services
- **Admin panel** — Stylists, services, bookings, customers, blog CMS, settings
- **Supabase Storage** — 5 buckets for avatars, stylist photos, portfolios, service images, blog covers
- **SEO** — JSON-LD structured data, sitemap, robots.txt, Open Graph on every page

## Roles

| Role     | URL                  |
|----------|----------------------|
| Customer | `/dashboard`         |
| Stylist  | `/stylist/dashboard` |
| Admin    | `/admin/dashboard`   |
