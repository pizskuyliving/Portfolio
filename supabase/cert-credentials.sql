-- Kolom ID dan link kredensial sertifikat, lalu isi ID dari LinkedIn. Aman diulang, tidak menghapus data.
-- Jalankan setelah content-linkedin.sql. Sertifikat dicocokkan lewat judulnya.

alter table public.certifications
  add column if not exists credential_id text,
  add column if not exists url text;

update public.certifications c set credential_id = v.id
from (values
  ('Skills Boost Arcade Trivia July 2025 Week 4', '17162875'),
  ('Skills Boost Arcade Trivia July 2025 Week 3', '17162285'),
  ('Skills Boost Arcade Trivia July 2025 Week 1', '17161788'),
  ('Level 3: Advanced App Operations', '17135187'),
  ('Level 2: Modern Application Deployment', '17122258'),
  ('Level 1: Core Infrastructure and Security', '17100963'),
  ('Skills Boost Arcade Base Camp July 2025', '17066362'),
  ('Introduction to Data Analytics on Google Cloud', '17044065'),
  ('Introduction to Security in the World of AI', '17037818'),
  ('Responsible AI for Developers: Privacy & Safety', '17036296'),
  ('Responsible AI for Developers: Interpretability & Transparency', '17034788'),
  ('Responsible AI for Developers: Fairness & Bias', '17034310'),
  ('Machine Learning Operations (MLOps) dengan Vertex AI: Evaluasi Model', '17031140'),
  ('Machine Learning Operations (MLOps) for Generative AI', '17030645')
) as v(title, id)
where c.title = v.title;
