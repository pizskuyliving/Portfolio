-- Jalankan di Supabase: SQL Editor > New query.
-- GANTI 'emailkamu@example.com' dengan email akun admin kamu (di 1 tempat, fungsi is_admin).

create table if not exists public.profile (
  id int primary key default 1 check (id = 1),
  name text not null default '',
  headline text default '',
  bio text default '',
  photo_url text,
  location text,
  email text,
  github text,
  linkedin text,
  hobbies text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  level smallint not null default 3 check (level between 1 and 5),
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text default '',
  description text default '',
  tech text[] not null default '{}',
  demo_url text,
  repo_url text,
  cover_url text,
  published boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  url text not null,
  caption text default '',
  sort int not null default 0
);

insert into public.profile (id, name, headline, location)
values (1, 'Muhammad Al Hafiz', 'Lulusan Teknik Informatika yang membangun aplikasi web', 'Pekanbaru, Riau')
on conflict (id) do nothing;

-- Admin = satu email saja
create or replace function public.is_admin() returns boolean
language sql stable as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'emailkamu@example.com'
$$;

alter table public.profile enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;

create policy "profile read" on public.profile for select using (true);
create policy "profile admin" on public.profile for all using (public.is_admin()) with check (public.is_admin());

create policy "skills read" on public.skills for select using (true);
create policy "skills admin" on public.skills for all using (public.is_admin()) with check (public.is_admin());

create policy "projects read" on public.projects for select using (published or public.is_admin());
create policy "projects admin" on public.projects for all using (public.is_admin()) with check (public.is_admin());

create policy "images read" on public.project_images for select using (true);
create policy "images admin" on public.project_images for all using (public.is_admin()) with check (public.is_admin());

-- Storage untuk foto & screenshot
insert into storage.buckets (id, name, public) values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

create policy "portfolio read" on storage.objects for select using (bucket_id = 'portfolio');
create policy "portfolio insert" on storage.objects for insert with check (bucket_id = 'portfolio' and public.is_admin());
create policy "portfolio update" on storage.objects for update using (bucket_id = 'portfolio' and public.is_admin());
create policy "portfolio delete" on storage.objects for delete using (bucket_id = 'portfolio' and public.is_admin());

-- === v2: kategori skill + pengalaman/pendidikan ===
-- Jalankan sekali di SQL Editor (database yang sudah berjalan). Aman diulang.

alter table public.skills add column if not exists category text not null default 'Lainnya';

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'work' check (kind in ('work', 'education')),
  role text not null,
  org text not null,
  period text not null,
  description text default '',
  sort int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.experiences enable row level security;
drop policy if exists "experiences read" on public.experiences;
drop policy if exists "experiences admin" on public.experiences;
create policy "experiences read" on public.experiences for select using (true);
create policy "experiences admin" on public.experiences for all using (public.is_admin()) with check (public.is_admin());

-- === v3: organisasi + sertifikasi ===
-- Jalankan sekali di SQL Editor (setelah update-v2.sql). Aman diulang.

-- 1) jenis "organisasi" untuk pengalaman
alter table public.experiences drop constraint if exists experiences_kind_check;
alter table public.experiences add constraint experiences_kind_check
  check (kind in ('work', 'education', 'organization'));

-- 2) tabel sertifikasi
create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issued text not null default '',
  sort int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.certifications enable row level security;
drop policy if exists "certifications read" on public.certifications;
drop policy if exists "certifications admin" on public.certifications;
create policy "certifications read" on public.certifications for select using (true);
create policy "certifications admin" on public.certifications for all using (public.is_admin()) with check (public.is_admin());

-- === v5: nama panggilan ===
alter table public.profile add column if not exists nickname text;
