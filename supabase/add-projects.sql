-- Menambah dan menyelaraskan daftar project dengan repo GitHub. Jalankan sekali di SQL Editor.
-- Project yang slug-nya sudah ada (call-ihure, absen-qr-pegawai, virtual-tour-teknik-informatika,
-- ai-virtual-office) akan diperbarui teks, teknologi, link repo, status tayang, dan urutannya.
-- Screenshot yang sudah kamu unggah TIDAK berubah. Project Flex tidak disentuh.

insert into public.projects (slug, title, summary, description, tech, repo_url, published, sort) values
 ('virtual-tour-teknik-informatika', 'Virtual Tour 360 Program Studi Teknik Informatika',
  'Situs tur virtual 360 derajat untuk mengenalkan lingkungan Program Studi Teknik Informatika UIR secara daring.',
  'Situs ini memungkinkan calon mahasiswa dan pengunjung menjelajahi ruang-ruang Program Studi Teknik Informatika Universitas Islam Riau dari peramban, tanpa harus datang ke kampus.',
  '{"Tur virtual 360",JavaScript}', 'https://github.com/pizskuyliving/Virtual-tour-website', true, 2),

 ('ai-virtual-office', 'AI Virtual Office',
  'Proyek pribadi: sekelompok agen AI yang bekerja bersama untuk memproduksi konten YouTube Shorts.',
  'AI Virtual Office menyusun alur kerja produksi konten pendek dengan beberapa agen AI, masing-masing memegang satu peran dalam proses pembuatannya.',
  '{"Agen AI","Otomasi konten",TypeScript}', null, true, 3),

 ('call-ihure', 'Call iHure (SIHUMAS UIR)',
  'Sistem web untuk Bagian Humas dan Promosi UIR dalam mengelola tindak lanjut telemarketing calon mahasiswa.',
  'Call iHure, sebelumnya bernama SIHUMAS UIR, membantu tim humas mencatat dan memantau tindak lanjut telemarketing secara terpusat. Dibangun dengan Laravel. Status: dalam pengembangan.',
  '{Laravel,PHP}', 'https://github.com/pizskuyliving/SIHUMAS-UIR', true, 4),

 ('absen-qr-pegawai', 'Absen QR Pegawai',
  'Aplikasi presensi pegawai berbasis kode QR dengan pelacakan lokasi, yang berjalan di iPhone maupun Android.',
  'Absen QR Pegawai dibangun sebagai aplikasi web progresif (PWA) sehingga pegawai dapat melakukan presensi dari perangkat apa pun. Dibangun dengan Laravel. Status: dalam pengembangan.',
  '{Laravel,PHP,PWA}', 'https://github.com/pizskuyliving/QR-attendance-with-location-tracking', true, 5),

 ('deteksi-aktivitas-mencurigakan-yolov11', 'Deteksi Aktivitas Mencurigakan dengan YOLOv11',
  'Sistem computer vision yang mendeteksi aktivitas mencurigakan menggunakan model YOLOv11.',
  'Proyek ini memanfaatkan YOLOv11 untuk mengenali aktivitas yang tidak wajar pada video atau gambar secara otomatis.',
  '{Python,YOLOv11,"Computer vision"}', 'https://github.com/pizskuyliving/Suspicious-activity-detection-using-YOLOv11', true, 6),

 ('terjemah-medis-awam', 'Terjemah Medis Awam',
  'Aplikasi yang menerjemahkan istilah medis ke bahasa yang mudah dipahami orang awam.',
  'Terjemah Medis Awam membantu pengguna memahami istilah kedokteran tanpa perlu latar belakang medis. Dibangun dengan TypeScript.',
  '{TypeScript}', 'https://github.com/pizskuyliving/terjemah-medis-awam', true, 7)
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  tech = excluded.tech,
  repo_url = excluded.repo_url,
  published = excluded.published,
  sort = excluded.sort;
