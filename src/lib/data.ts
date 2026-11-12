import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Certification, Experience, Profile, Project, Skill } from "@/lib/types";

export const getProfile = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.from("profile").select("*").eq("id", 1).maybeSingle();
  return data as Profile | null;
});

export async function getSkills() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("skills")
    .select("*")
    .order("sort", { ascending: true })
    .order("created_at", { ascending: true });
  return (data ?? []) as Skill[];
}

export async function getProjects(opts: { includeDrafts?: boolean } = {}) {
  const supabase = await createClient();
  let q = supabase.from("projects").select("*, project_images(*)");
  if (!opts.includeDrafts) q = q.eq("published", true);
  const { data } = await q
    .order("sort", { ascending: true })
    .order("created_at", { ascending: false });
  return (data ?? []) as Project[];
}

// cache(): generateMetadata dan halaman memanggil ini dengan argumen sama, cukup satu query per request
export const getProject = cache(async (col: "slug" | "id", value: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*, project_images(*)")
    .eq(col, value)
    .maybeSingle();
  if (!data) return null;
  const project = data as Project;
  project.project_images = [...(project.project_images ?? [])].sort((a, b) => a.sort - b.sort);
  return project;
});

export async function getExperiences() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("experiences")
    .select("*")
    .order("sort", { ascending: true })
    .order("created_at", { ascending: false });
  return (data ?? []) as Experience[];
}

export async function getCertifications() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("certifications")
    .select("*")
    .order("sort", { ascending: true })
    .order("created_at", { ascending: true });
  return (data ?? []) as Certification[];
}
