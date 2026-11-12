-- Skema lengkap. Jalankan di Supabase: SQL Editor > New query. Aman dijalankan ulang.
-- PENTING: GANTI 'emailkamu@example.com' di fungsi is_admin() dengan email akun admin kamu
-- SEBELUM menjalankan, juga saat menjalankan ulang (kalau tidak, admin terkunci dari menulis).
-- Ini satu-satunya tempat email admin ditulis; aplikasi menanyakannya lewat is_admin().

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

alter table public.profile
  add column if not exists nickname text,
  add column if not exists card_title text,
  add column if not exists card_subtitle text,
  add column if not exists card_role text,
  add column if not exists card_education text,
  add column if not exists card_location text,
  add column if not exists card_photo_url text,
  add column if not exists card_back_title text,
  add column if not exists card_back_text text;

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  level smallint not null default 3 check (level between 1 and 5),
  sort int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.skills add column if not exists category text not null default 'Lainnya';

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

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'work',
  role text not null,
  org text not null,
  period text not null,
  description text default '',
  sort int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.experiences drop constraint if exists experiences_kind_check;
alter table public.experiences add constraint experiences_kind_check
  check (kind in ('work', 'education', 'organization'));

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issued text not null default '',
  sort int not null default 0,
  created_at timestamptz not null default now()
);

insert into public.profile (id, name, headline, location)
values (1, 'Muhammad Al Hafiz', 'Lulusan Teknik Informatika yang membangun aplikasi web', 'Pekanbaru, Riau')
on conflict (id) do nothing;

-- Admin = satu email saja
create or replace function public.is_admin() returns boolean
language sql stable as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'emailkamu@example.com'
$$;

-- Ganti semua gambar project dalam satu transaksi: kalau insert gagal, gambar lama tidak ikut hilang.
create or replace function public.replace_project_images(p_project_id uuid, p_images jsonb)
returns void language plpgsql as $$
begin
  if not public.is_admin() then
    raise exception 'bukan admin';
  end if;
  delete from public.project_images where project_id = p_project_id;
  insert into public.project_images (project_id, url, caption, sort)
  select p_project_id, x ->> 'url', coalesce(x ->> 'caption', ''), (n - 1)::int
  from jsonb_array_elements(p_images) with ordinality as t(x, n);
end
$$;

-- Row Level Security: publik hanya membaca, admin boleh semua
alter table public.profile enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.experiences enable row level security;
alter table public.certifications enable row level security;

drop policy if exists "profile read" on public.profile;
drop policy if exists "profile admin" on public.profile;
create policy "profile read" on public.profile for select using (true);
create policy "profile admin" on public.profile for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "skills read" on public.skills;
drop policy if exists "skills admin" on public.skills;
create policy "skills read" on public.skills for select using (true);
create policy "skills admin" on public.skills for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "projects read" on public.projects;
drop policy if exists "projects admin" on public.projects;
create policy "projects read" on public.projects for select using (published or public.is_admin());
create policy "projects admin" on public.projects for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "images read" on public.project_images;
drop policy if exists "images admin" on public.project_images;
create policy "images read" on public.project_images for select using (true);
create policy "images admin" on public.project_images for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "experiences read" on public.experiences;
drop policy if exists "experiences admin" on public.experiences;
create policy "experiences read" on public.experiences for select using (true);
create policy "experiences admin" on public.experiences for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "certifications read" on public.certifications;
drop policy if exists "certifications admin" on public.certifications;
create policy "certifications read" on public.certifications for select using (true);
create policy "certifications admin" on public.certifications for all using (public.is_admin()) with check (public.is_admin());

-- Storage untuk foto & screenshot
insert into storage.buckets (id, name, public) values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

drop policy if exists "portfolio read" on storage.objects;
drop policy if exists "portfolio insert" on storage.objects;
drop policy if exists "portfolio update" on storage.objects;
drop policy if exists "portfolio delete" on storage.objects;
create policy "portfolio read" on storage.objects for select using (bucket_id = 'portfolio');
create policy "portfolio insert" on storage.objects for insert with check (bucket_id = 'portfolio' and public.is_admin());
create policy "portfolio update" on storage.objects for update using (bucket_id = 'portfolio' and public.is_admin());
create policy "portfolio delete" on storage.objects for delete using (bucket_id = 'portfolio' and public.is_admin());
