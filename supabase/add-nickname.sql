-- Menambah nama panggilan untuk navbar. Jalankan sekali di SQL Editor.
-- Ganti 'Apiz' dengan panggilan yang kamu mau, atau ubah nanti di /admin/profile.

alter table public.profile add column if not exists nickname text;
update public.profile set nickname = 'Apiz' where id = 1;
