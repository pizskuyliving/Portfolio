-- Isi portofolio dari profil LinkedIn. Jalankan SETELAH update-v2.sql dan update-v3.sql.
-- PERHATIAN: file ini MENGGANTI isi tabel experiences, skills, dan certifications,
-- serta bio/kalimat pembuka/email/LinkedIn di profil. Nama dan foto tidak disentuh.
-- Project tidak diubah.

update public.profile set
  headline = 'Software engineer dan web developer, tertarik pada AI dan teknologi pendidikan.',
  location = 'Pekanbaru, Riau',
  email = 'muhammadalhafiz.info@gmail.com',
  linkedin = 'https://www.linkedin.com/in/apiz',
  github = 'https://github.com/pizskuyliving',
  bio = 'Lulusan S1 Teknik Informatika Universitas Islam Riau dengan pengalaman di IT support, pengembangan web, dan administrasi sistem. Di BPS Provinsi Riau, saya mengembangkan sistem pendaftaran magang berbasis web dan membantu kelancaran operasional kantor lewat dukungan teknis.

Sebagai asisten dosen, saya mendampingi mahasiswa belajar dasar pemrograman, pemrograman web, dan pemrograman berorientasi objek. Setelah itu saya menjadi Master Teacher di Kalananti by Ruangguru, mengajarkan coding kepada siswa dengan Scratch. Saya juga Google Cloud Arcade Facilitator 2025, dan terus memperdalam AI dan machine learning sambil mengerjakan proyek IT dan pendidikan yang berdampak.'
where id = 1;

delete from public.experiences;
insert into public.experiences (kind, role, org, period, description, sort) values
  ('work', 'Staf Kontrak, Biro Humas dan Promosi', 'Universitas Islam Riau', 'Jan 2026 - sekarang',
   'Mengumpulkan dan merapikan data mahasiswa, melakukan analisis data, serta menindaklanjuti mahasiswa untuk kebutuhan promosi dan humas universitas. Di luar tugas rutin, mengembangkan sistem web untuk mendukung pekerjaan tim.', 1),
  ('work', 'Master Teacher', 'Kalananti by Ruangguru, Pekanbaru', 'Jul 2025 - Jan 2026',
   'Mengajarkan konsep coding kepada siswa dengan Scratch, membuat proyek mini-game bersama siswa, dan mengevaluasi kemajuan belajar lewat laporan perkembangan yang terperinci.', 2),
  ('work', 'Asisten Dosen', 'Universitas Islam Riau', 'Sep 2023 - Mei 2024',
   'Mendampingi mahasiswa Teknik Informatika di empat mata kuliah: Pemrograman Berorientasi Objek, Pemrograman Web, Dasar Pemrograman Mobile, dan Pengenalan Pemrograman Dasar. Mengadakan tutorial dan praktikum mingguan, memberi umpan balik pada tugas dan project, membantu debugging, serta mendampingi pengembangan final project.', 3),
  ('work', 'IT Support Technician (Magang)', 'BPS Provinsi Riau', 'Jul 2023 - Sep 2023',
   'Merancang dan mengembangkan website pendaftaran magang untuk mengoptimalkan proses rekrutmen dan administrasi peserta. Memberi dukungan teknis perangkat keras dan lunak, menyelesaikan masalah teknis pengguna, serta membantu pemeliharaan infrastruktur IT kantor.', 4),
  ('education', 'S1 Teknik Informatika', 'Universitas Islam Riau', 'Sep 2020 - Jul 2025', '', 1),
  ('education', 'Pertukaran Mahasiswa Merdeka (Computer Science)', 'Universitas Gadjah Mada', 'Agu 2022 - Des 2022',
   'Terpilih sebagai peserta Program Pertukaran Mahasiswa Merdeka untuk mengambil mata kuliah lintas program studi selama satu semester.', 2),
  ('organization', 'Staff Dinas Kaderisasi', 'Himpunan Mahasiswa Teknik Informatika UIR', 'Feb 2023 - Feb 2024', '', 1),
  ('organization', 'Sekretaris Departemen Media Komunikasi dan Informasi', 'BEM Fakultas Teknik UIR', 'Nov 2021 - Nov 2022', '', 2),
  ('organization', 'Badan Pemilihan Raya Mahasiswa', 'Fakultas Teknik UIR', 'Jul 2021 - Nov 2021', '', 3);

delete from public.skills;
insert into public.skills (category, name, sort) values
  ('Bahasa', 'Python', 10), ('Bahasa', 'JavaScript', 11), ('Bahasa', 'TypeScript', 12), ('Bahasa', 'PHP', 13),
  ('Bahasa', 'Java', 14), ('Bahasa', 'C++', 15), ('Bahasa', 'HTML5', 16), ('Bahasa', 'CSS3', 17), ('Bahasa', 'Scratch', 18),

  ('Framework dan library', 'React', 20), ('Framework dan library', 'Next.js', 21),
  ('Framework dan library', 'Laravel', 22), ('Framework dan library', 'Tailwind CSS', 23),

  ('Database dan backend', 'Node.js', 30), ('Database dan backend', 'MySQL', 31), ('Database dan backend', 'PostgreSQL', 32),
  ('Database dan backend', 'Firebase', 33), ('Database dan backend', 'Supabase', 34),

  ('AI, data, dan cloud', 'Machine Learning', 40), ('AI, data, dan cloud', 'MLOps', 41), ('AI, data, dan cloud', 'Vertex AI', 42),
  ('AI, data, dan cloud', 'Google Cloud', 43), ('AI, data, dan cloud', 'Analisis data', 44),

  ('Alat bantu AI', 'OpenAI', 50), ('Alat bantu AI', 'Claude', 51), ('Alat bantu AI', 'Cursor', 52), ('Alat bantu AI', 'DeepSeek', 53),

  ('Alat pengembangan', 'Git dan GitHub', 60), ('Alat pengembangan', 'Visual Studio Code', 61),
  ('Alat pengembangan', 'Postman', 62), ('Alat pengembangan', 'Vercel', 63);

delete from public.certifications;
insert into public.certifications (issuer, title, issued, sort) values
  ('Google', 'Skills Boost Arcade Base Camp July 2025', 'Jul 2025', 1),
  ('Google', 'Skills Boost Arcade Trivia July 2025 Week 1', 'Jul 2025', 2),
  ('Google', 'Skills Boost Arcade Trivia July 2025 Week 3', 'Jul 2025', 3),
  ('Google', 'Skills Boost Arcade Trivia July 2025 Week 4', 'Jul 2025', 4),
  ('Google', 'Level 1: Core Infrastructure and Security', 'Jul 2025', 5),
  ('Google', 'Level 2: Modern Application Deployment', 'Jul 2025', 6),
  ('Google', 'Level 3: Advanced App Operations', 'Jul 2025', 7),
  ('Google', 'The Basics of Google Cloud Compute Skill Badge', 'Jul 2025', 8),
  ('Google', 'Cloud Functions: 3 Ways Skill Badge', 'Jul 2025', 9),
  ('Google', 'App Engine: 3 Ways Skill Badge', 'Jul 2025', 10),
  ('Google', 'Introduction to Data Analytics on Google Cloud', 'Jul 2025', 11),
  ('Google', 'Build and Deploy Machine Learning Solutions on Vertex AI Skill Badge', 'Jul 2025', 12),
  ('Google', 'Introduction to Security in the World of AI', 'Jul 2025', 13),
  ('Google', 'Responsible AI for Developers: Fairness & Bias', 'Jul 2025', 14),
  ('Google', 'Responsible AI for Developers: Privacy & Safety', 'Jul 2025', 15),
  ('Google', 'Responsible AI for Developers: Interpretability & Transparency', 'Jul 2025', 16),
  ('Google', 'Machine Learning Operations (MLOps) dengan Vertex AI: Evaluasi Model', 'Jul 2025', 17),
  ('Google', 'Machine Learning Operations (MLOps) for Generative AI', 'Jul 2025', 18),
  ('Cisco Networking Academy', 'Cisco Certified Network Associate Cyber Ops (CCNA)', 'Feb 2024', 30),
  ('Universiti Teknologi MARA', 'International Competitive Programming and Multimedia Competition (sertifikat partisipasi)', 'Okt 2023', 40);
