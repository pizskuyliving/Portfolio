-- Skill gabungan LinkedIn + GitHub. Jalankan sekali di SQL Editor.
-- Hanya mengganti isi tabel skills (pengalaman, project, dan lainnya tidak berubah).

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
