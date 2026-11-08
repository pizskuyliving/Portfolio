# Portofolio (Next.js + Supabase)

## Setup lokal
1. Buat project di https://supabase.com.
2. Buka **SQL Editor**, tempel isi `supabase/schema.sql`. **Ganti `emailkamu@example.com`** dengan email admin kamu, lalu jalankan.
3. **Authentication > Providers > Email**: matikan "Allow new users to sign up".
4. **Authentication > Users > Add user**: buat akun admin (email + kata sandi, centang auto-confirm).
5. Salin `.env.example` menjadi `.env.local`, isi URL dan anon key (Project Settings > API) serta `ADMIN_EMAIL`.
6. `npm install` lalu `npm run dev`.
7. Buka `http://localhost:3000/admin`, masuk, lalu isi profil, skill, dan project.

## Deploy ke Vercel
1. Push ke GitHub, import repo di Vercel.
2. Isi environment variable yang sama dengan `.env.local`.
3. Deploy.

## Keamanan
- Tulis data hanya boleh oleh email admin (Row Level Security + fungsi `is_admin()`); publik hanya bisa membaca.
- `/admin` dilindungi middleware dan dicek ulang di setiap server action.
- Upload foto langsung dari browser ke Supabase Storage (bucket `portfolio`).

## Struktur
- `src/app/page.tsx` halaman utama, `src/app/projects/[slug]` detail project
- `src/app/admin` panel admin (login, profil, project, skill)
- `src/app/admin/actions.ts` semua aksi tulis (server actions)

## Update v2 (konten + tampilan baru)
1. SQL Editor: jalankan `supabase/update-v2.sql` (tabel pengalaman + kategori skill).
2. Opsional: jalankan `supabase/seed.sql` sekali untuk isi awal (profil, pengalaman, skill, project).
3. Isi sendiri lewat /admin: foto, email kontak, LinkedIn, hobi, dan screenshot tiap project.

## Update v3 (palet baru + animasi)
Hanya mengganti tampilan: `globals.css`, `layout.tsx`, `page.tsx`, `projects/[slug]/page.tsx`,
`components/BrowserFrame.tsx`, dan komponen baru `components/Reveal.tsx`. Tidak ada perubahan database.
Animasi otomatis mati bila pengguna memilih "kurangi gerakan" di perangkatnya.

## Update v4 (isi dari LinkedIn)
1. SQL Editor: jalankan `supabase/update-v3.sql` (kategori organisasi + tabel sertifikasi).
2. Jalankan `supabase/content-linkedin.sql` sekali. File ini MENGGANTI isi pengalaman, skill, dan sertifikasi, serta bio/email/LinkedIn di profil.
3. Kelola sertifikasi di /admin/certifications.
