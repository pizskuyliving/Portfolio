-- Kolom isi kartu ID yang bisa diedit dari /admin/card. Jalankan sekali di SQL Editor.
-- Selama kolom-kolom ini kosong (null), kartu otomatis mengambil isinya dari profil dan pendidikan.

alter table public.profile
  add column if not exists card_title text,
  add column if not exists card_subtitle text,
  add column if not exists card_role text,
  add column if not exists card_education text,
  add column if not exists card_location text,
  add column if not exists card_photo_url text,
  add column if not exists card_back_title text,
  add column if not exists card_back_text text;
