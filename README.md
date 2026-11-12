# Portofolio (Next.js + Supabase)

## Setup lokal
1. Buat project di https://supabase.com.
2. Buka **SQL Editor**, tempel isi `supabase/schema.sql`. **Ganti `emailkamu@example.com`** dengan email admin kamu, lalu jalankan. File ini aman dijalankan ulang (selalu ganti emailnya dulu).
3. **Authentication > Providers > Email**: matikan "Allow new users to sign up".
4. **Authentication > Users > Add user**: buat akun admin (email + kata sandi, centang auto-confirm).
5. Salin `.env.example` menjadi `.env.local`, isi URL dan anon key (Project Settings > API).
6. `npm install` lalu `npm run dev`.
7. Buka `http://localhost:3000/admin`, masuk, lalu isi profil, skill, dan project.

Isi awal (opsional, jalankan sekali): `supabase/seed.sql`, `supabase/content-linkedin.sql` (MENGGANTI pengalaman, skill, sertifikasi, dan bio/email/LinkedIn), `supabase/add-projects.sql`, `supabase/update-skills.sql` (MENGGANTI semua skill).

## Tes
`npm test` (memakai test runner bawaan Node, butuh Node 22.18+ atau 23.6+).

## Deploy ke Vercel
1. Push ke GitHub, import repo di Vercel.
2. Isi environment variable yang sama dengan `.env.local`.
3. Deploy.

## Keamanan
- Admin ditentukan di satu tempat: fungsi SQL `is_admin()`. Database (Row Level Security) dan server action sama-sama memakainya; publik hanya bisa membaca.
- `/admin` dilindungi middleware dan dicek ulang di setiap server action.
- Upload foto langsung dari browser ke Supabase Storage (bucket `portfolio`).

## Struktur
- `src/app/page.tsx` halaman utama, `src/app/projects/[slug]` detail project
- `src/app/admin` panel admin (login, profil, kartu ID, pengalaman, sertifikasi, project, skill)
- `src/app/admin/actions.ts` semua aksi tulis (server actions)
- `supabase/schema.sql` skema lengkap database
