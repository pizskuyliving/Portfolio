export type Profile = {
  id: number;
  name: string;
  nickname: string | null;
  headline: string | null;
  bio: string | null;
  photo_url: string | null;
  location: string | null;
  email: string | null;
  github: string | null;
  linkedin: string | null;
  hobbies: string[];
  card_title: string | null;
  card_subtitle: string | null;
  card_role: string | null;
  card_education: string | null;
  card_location: string | null;
  card_photo_url: string | null;
  card_back_title: string | null;
  card_back_text: string | null;
};

export type Skill = { id: string; name: string; category: string; level: number; sort: number };

export type ProjectImage = {
  id: string;
  project_id: string;
  url: string;
  caption: string | null;
  sort: number;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  tech: string[];
  demo_url: string | null;
  repo_url: string | null;
  cover_url: string | null;
  published: boolean;
  sort: number;
  created_at: string;
  project_images?: ProjectImage[];
};

export type Experience = {
  id: string;
  kind: "work" | "education" | "organization";
  role: string;
  org: string;
  period: string;
  description: string | null;
  sort: number;
};

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  issued: string;
  sort: number;
};
