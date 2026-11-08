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
