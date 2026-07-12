# KADS LABS Enterprise Corporate Website

A premium, futuristic, AI-first corporate website for **KADS LABS** and its three divisions: **KADS LABS**, **KADS MEDIA**, and **KADS TECHNOLOGIES**. Built to enterprise standards with a real-time CMS, role-based dashboards, media library, CRM, and PWA support.

## 🌐 Live Preview

Open `dist/index.html` in a browser to view the built website, or run `npm run dev` for development.

## 🚀 Tech Stack

- **Next.js 15** (App Router, Static Export)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** — animations, scroll effects, page transitions
- **React Hook Form + Zod** — contact form validation
- **Lucide React** — icons
- **Supabase** — auth, real-time database, storage, and analytics

## ✨ Enterprise Features

### Website
- Premium hero, about, divisions, portfolio, testimonials, FAQ, blogs, careers, and contact sections
- Sticky glassmorphism navbar with real-time navigation management
- Mobile responsive menu with hamburger animation
- Loading screen with animated logo
- Scroll progress bar
- Cursor glow effect (desktop)
- Particle background network
- Smooth scroll navigation
- SEO metadata and OpenGraph tags
- JSON-LD structured data
- Blogs and careers sections with CMS management

### Real-time CMS (Developer Control Centre)
Located at `/admin`, the Control Centre lets authorized users edit every website element without touching frontend code:
- Homepage content
- About, leadership, team members
- Services, divisions, portfolio
- Blogs, careers, testimonials, FAQs
- Contact details, social links, navigation, footer
- SEO, images, videos, files, analytics, settings

All changes sync instantly via Supabase Realtime.

### Leadership & Team Management
- Leadership information is fully data-driven, never hardcoded
- Edit name, designation, biography, profile photo, skills, social links, and experience
- Team members and divisions are managed from the Control Centre

### Media Library
Professional media library at `/admin` supporting:
- Images, videos, PDFs, ZIPs, documents
- Upload, delete, rename, move, search, filter, preview
- Bulk upload and bulk delete
- Folder organization

### Contact CRM
Every enquiry automatically:
- Saves to the database
- Creates a CRM lead
- Notifies the Founder Dashboard
- Sends a confirmation email (via configured webhook)
- Tracks status and supports internal notes

### Authentication & Role-Based Dashboards
- Public users: register, login, reset password, verify email, update profile
- **Developer Control Centre** at `/admin` for admin, director, founder, and super developer roles
- **Founder Dashboard** at `/founder` for CRM and notifications
- **Super Developer Dashboard** at `/super` for assigning Founder, Director, Admin, or privileged roles
- Role hierarchy: `super_developer` > `founder` > `director` > `admin` > `user`
- Demo mode works without Supabase credentials (localStorage fallback)

### Progressive Web App
- Installable app with standalone display
- Offline support via service worker caching
- Splash screen and adaptive icon support
- Manifest, background sync ready, push notification ready, auto update ready

## 📁 Project Structure

```
kadslabs-website/
├── app/
│   ├── admin/              # Developer Control Centre
│   ├── auth/reset/         # Password reset page
│   ├── components/         # Reusable UI components
│   ├── components/admin/   # Admin dashboard components
│   ├── founder/            # Founder dashboard
│   ├── profile/            # User profile page
│   ├── sections/           # Page sections
│   ├── super/              # Super Developer dashboard
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/                    # Utilities, Supabase, CMS, CRM, media, roles
├── public/                 # Logo, manifest, service worker, team images
├── dist/                   # Static export output
├── next.config.js
├── tailwind.config.ts
└── package.json
```

## 🛠️ Getting Started

```bash
# Install dependencies
npm install --legacy-peer-deps

# Development server
npm run dev

# Production build (exports to dist/)
npm run build
```

## ⚙️ Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `DATABASE_SCHEMA.md` to create tables, indexes, RLS policies, and storage bucket.
3. Copy your project URL and anon key into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_ADMIN_EMAILS=developer@krish.com
   ```
4. Enable Realtime on `site_data`, `contact_submissions`, `media`, and `notifications`.
5. Enable Email and Google OAuth providers in Auth settings.
6. Create a `website-assets` storage bucket with public read access.

See `DATABASE_SCHEMA.md` for the complete production schema.

## 📱 PWA & Web App

- Manifest: `public/manifest.json`
- Service worker: `public/sw.js` (offline caching, background sync, push ready)
- Installable on Android/iOS home screen
- Standalone display mode
- Theme color and Apple mobile web app meta tags

## 🎨 Brand Identity

- **Electric Blue** `#2563EB`
- **Deep Navy** `#050B18`
- **White / Glassmorphism / Blue Glow Effects**

## 📄 License

© 2026 KADS LABS. All Rights Reserved.
