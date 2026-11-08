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
