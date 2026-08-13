# KADS LABS Enterprise Database Schema

This document describes the Supabase tables, storage, and Row Level Security (RLS) policies required for the full production deployment of the KADS LABS enterprise website.

## Tables

### 1. `site_data` — Real-time CMS content store

```sql
create table site_data (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

alter table site_data enable row level security;

-- Anyone can read public content
create policy "Public read site_data"
  on site_data for select
  using (true);

-- Only privileged users can write
create policy "Privileged write site_data"
  on site_data for all
  using (auth.role() in ('admin', 'director', 'founder', 'super_developer'))
  with check (auth.role() in ('admin', 'director', 'founder', 'super_developer'));
```

Rows are keyed by section name:
- `siteContent`, `leadership`, `team`, `divisions`, `services`, `process`, `industries`, `divisionPortfolio`, `divisionTestimonials`, `portfolio`, `blogs`, `careers`, `testimonials`, `faqs`, `navigation`, `footer`, `contact`, `social`, `seo`, `settings`, `analytics`.

Enable Realtime on `site_data` in the Supabase dashboard.

### 2. `contact_submissions` — CRM leads

```sql
create table contact_submissions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  company text,
  service text,
  budget text,
  message text,
  status text default 'new',
  source text default 'website',
  assigned_to uuid references auth.users(id),
  user_id uuid references auth.users(id),
  notes jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table contact_submissions enable row level security;

create policy "Public insert submissions"
  on contact_submissions for insert
  with check (true);

create policy "Privileged read submissions"
  on contact_submissions for select
  using (auth.role() in ('admin', 'director', 'founder', 'super_developer'));

create policy "Privileged update submissions"
  on contact_submissions for update
  using (auth.role() in ('admin', 'director', 'founder', 'super_developer'));
```

### 3. `media` — Media library metadata (optional)

```sql
create table media (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type text not null,
  url text not null,
  size bigint,
  mime_type text,
  folder text default '/',
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table media enable row level security;

create policy "Public read media"
  on media for select
  using (true);

create policy "Privileged write media"
  on media for all
  using (auth.role() in ('admin', 'director', 'founder', 'super_developer'))
  with check (auth.role() in ('admin', 'director', 'founder', 'super_developer'));
```

### 4. `user_roles` — Role-based access control

```sql
create table user_roles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  email text not null,
  role text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

alter table user_roles enable row level security;

create policy "Users read own role"
  on user_roles for select
  using (auth.uid() = user_id);

create policy "Super developer manage roles"
  on user_roles for all
  using (exists (select 1 from user_roles where user_id = auth.uid() and role = 'super_developer'))
  with check (exists (select 1 from user_roles where user_id = auth.uid() and role = 'super_developer'));
```

### 5. `profiles` — Public user profiles

```sql
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  company text,
  phone text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Public read profiles"
  on profiles for select
  using (true);

create policy "Users update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users insert own profile"
  on profiles for insert
  with check (auth.uid() = id);
```

### 6. `notifications` — Founder dashboard notifications

```sql
create table notifications (
  id uuid default gen_random_uuid() primary key,
  type text not null,
  title text,
  message text,
  lead_id uuid references contact_submissions(id),
  read boolean default false,
  created_at timestamptz default now()
);

alter table notifications enable row level security;

create policy "Privileged read notifications"
  on notifications for select
  using (auth.role() in ('founder', 'super_developer'));

create policy "Privileged update notifications"
  on notifications for update
  using (auth.role() in ('founder', 'super_developer'));
```

### 7. `analytics_events` — Scalable analytics

```sql
create table analytics_events (
  id uuid default gen_random_uuid() primary key,
  type text not null,
  payload jsonb,
  created_at timestamptz default now()
);

-- Add indexes for scale
create index idx_analytics_events_type on analytics_events(type);
create index idx_analytics_events_created_at on analytics_events(created_at desc);

-- Consider a materialized view or daily rollup for reporting at 100k+ records.
```

## Storage

Create a bucket named `website-assets` with public access for website images, videos, documents, and downloads. Use folders to organize content by page or purpose (e.g., `team/`, `portfolio/`, `blog/`).

Enable RLS on the bucket and allow read access to anon while restricting writes to privileged roles.

## Auth

Enable email/password and Google OAuth providers in Supabase Auth. Configure the site URL and redirect URLs in Auth settings to match the hosted domain (e.g., `https://www.kadslabs.com`).

## Realtime

Enable Realtime for `site_data`, `contact_submissions`, `media`, and `notifications` so dashboard changes appear instantly on the live website without redeployment.

## Scalability Notes

- Use database indexes on frequently filtered columns (`status`, `created_at`, `folder`, `type`, `role`).
- Paginate large lists in the admin dashboards (media, leads, blogs, careers, portfolio).
- Use Supabase Storage CDN and image transformations for 25,000+ media files.
- For 100,000+ analytics records, implement a daily rollup table or use an external analytics provider.
- Use connection pooling and Supabase read replicas if traffic exceeds 1,000 daily visitors significantly.
