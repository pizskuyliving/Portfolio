-- Isi awal portofolio. Jalankan SETELAH update-v2.sql. Jalankan sekali saja.
-- Semua teks bisa diubah lewat /admin. Nama, email, dan foto tidak disentuh.

update public.profile set
  headline = 'Web developer lulusan Teknik Informatika, membangun sistem informasi dan aplikasi web.',
  location = 'Pekanbaru, Riau',
  github = 'https://github.com/pizskuyliving',
  bio = 'Lulusan S1 Teknik Informatika Universitas Islam Riau yang berfokus pada pengembangan aplikasi web dan pengolahan data. Saya terbiasa mengerjakan sistem dari awal sampai siap dipakai: merancang tampilan, membangun fitur, dan menyiapkan penerapannya.

Pengalaman saya mencakup magang sebagai IT support dan front-end developer di BPS Provinsi Riau, menjadi asisten dosen, serta bekerja sebagai staf kontrak di Bagian Humas dan Promosi UIR, tempat saya menangani pendataan, analisis data, dan tindak lanjut mahasiswa. Saat ini saya terbuka untuk kesempatan kerja di bidang teknologi informasi.'
where id = 1;

insert into public.experiences (kind, role, org, period, description, sort)
select * from (values
  ('work', 'Staf Kontrak', 'Bagian Humas dan Promosi, Universitas Islam Riau', 'Feb 2026 - Nov 2026',
   'Mengumpulkan dan merapikan data mahasiswa, melakukan analisis data, serta menindaklanjuti mahasiswa untuk kebutuhan promosi dan humas universitas. Di luar tugas rutin, mengembangkan sistem web untuk mendukung pekerjaan tim.', 1),
  ('work', 'Asisten Dosen', 'Universitas Islam Riau', '2023 - 2024',
   'Mendampingi dosen dalam kegiatan perkuliahan dan praktikum.', 2),
  ('work', 'Magang IT Support dan Front-End Developer', 'BPS Provinsi Riau', '2023',
   'Mendukung kebutuhan teknis teknologi informasi kantor dan mengerjakan antarmuka front-end.', 3),
  ('education', 'S1 Teknik Informatika', 'Universitas Islam Riau', 'Sep 2020 - Jul 2025', '', 1),
  ('education', 'Program Pertukaran Mahasiswa', 'Universitas Gadjah Mada', '2022', 'Satu semester pertukaran mahasiswa.', 2)
) as v(kind, role, org, period, description, sort)
where not exists (select 1 from public.experiences);

insert into public.skills (category, name, sort)
select * from (values
  ('Bahasa', 'JavaScript', 10), ('Bahasa', 'PHP', 11), ('Bahasa', 'HTML dan CSS', 12),
  ('Framework', 'Next.js', 20), ('Framework', 'React', 21), ('Framework', 'Laravel', 22), ('Framework', 'Tailwind CSS', 23),
  ('Platform dan alat', 'Supabase', 30), ('Platform dan alat', 'Git dan GitHub', 31), ('Platform dan alat', 'Vercel', 32),
  ('Data', 'Analisis data', 40)
) as v(category, name, sort)
where not exists (select 1 from public.skills s where s.name = v.name);

insert into public.projects (slug, title, summary, description, tech, repo_url, published, sort)
values
 ('flex', 'Flex (Flexible Learning Experience)',
  'Platform pembelajaran berbasis web untuk laboratorium Teknik Informatika UIR, dapat dipasang sebagai aplikasi.',
  'Flex adalah learning management system yang dibangun dengan Next.js dan dapat dipasang di perangkat sebagai Progressive Web App. Platform ini dirancang untuk mendukung kegiatan belajar di laboratorium Teknik Informatika Universitas Islam Riau.',
  '{Next.js,PWA}', null, true, 1),
 ('virtual-tour-teknik-informatika', 'Virtual Tour 360 Program Studi Teknik Informatika',
  'Situs tur virtual 360 derajat untuk mengenalkan lingkungan Program Studi Teknik Informatika UIR secara daring.',
  'Situs ini memungkinkan calon mahasiswa dan pengunjung menjelajahi ruang-ruang Program Studi Teknik Informatika Universitas Islam Riau dari peramban, tanpa harus datang ke kampus.',
  '{"Tur virtual 360","Web"}', 'https://github.com/pizskuyliving/Virtual-tour-website', true, 2),
 ('ai-virtual-office', 'AI Virtual Office',
  'Proyek pribadi: sekelompok agen AI yang bekerja bersama untuk memproduksi konten YouTube Shorts.',
  'AI Virtual Office menyusun alur kerja produksi konten pendek dengan beberapa agen AI, masing-masing memegang satu peran dalam proses pembuatannya.',
  '{"Agen AI","Otomasi konten"}', null, true, 3),
 ('call-ihure', 'Call iHure',
  'Sistem web untuk Bagian Humas dan Promosi UIR dalam mengelola tindak lanjut telemarketing calon mahasiswa.',
  'Call iHure (sebelumnya SIHUMAS UIR) membantu tim humas mencatat dan memantau tindak lanjut telemarketing secara terpusat.',
  '{Laravel}', null, false, 4),
 ('absen-qr-pegawai', 'Absen QR Pegawai',
  'Aplikasi presensi pegawai berbasis kode QR yang berjalan di iPhone maupun Android.',
  'Absen QR Pegawai dibangun sebagai aplikasi web progresif sehingga pegawai dapat melakukan presensi dari perangkat apa pun.',
  '{Laravel,PWA}', null, false, 5)
on conflict (slug) do nothing;
