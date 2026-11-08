"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const csv = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);
const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export async function login(fd: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: str(fd, "email"),
    password: String(fd.get("password") ?? ""),
  });
  if (error) redirect("/admin/login?error=1");
  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function saveProfile(fd: FormData) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("profile").upsert({
    id: 1,
    name: str(fd, "name"),
    nickname: str(fd, "nickname") || null,
    headline: str(fd, "headline"),
    bio: str(fd, "bio"),
    photo_url: str(fd, "photo_url") || null,
    location: str(fd, "location"),
    email: str(fd, "email"),
    github: str(fd, "github"),
    linkedin: str(fd, "linkedin"),
    hobbies: csv(str(fd, "hobbies")),
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/admin/profile?saved=1");
}

export async function saveProject(fd: FormData) {
  const supabase = await requireAdmin();
  const id = str(fd, "id");
  const title = str(fd, "title");
  const slug = slugify(str(fd, "slug") || title);

  let images: { url: string; caption: string }[] = [];
  try {
    images = JSON.parse(str(fd, "images") || "[]");
  } catch {
    images = [];
  }

  const payload = {
    title,
    slug,
    summary: str(fd, "summary"),
    description: str(fd, "description"),
    tech: csv(str(fd, "tech")),
    demo_url: str(fd, "demo_url") || null,
    repo_url: str(fd, "repo_url") || null,
    cover_url: images[0]?.url ?? null,
    published: fd.get("published") === "on",
    sort: Number(str(fd, "sort")) || 0,
  };

  let projectId = id;
  if (id) {
    const { error } = await supabase.from("projects").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase.from("projects").insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    projectId = data.id;
  }

  await supabase.from("project_images").delete().eq("project_id", projectId);
  if (images.length > 0) {
    const { error } = await supabase.from("project_images").insert(
      images.map((img, i) => ({ project_id: projectId, url: img.url, caption: img.caption ?? "", sort: i }))
    );
    if (error) throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath(`/projects/${slug}`);
  redirect("/admin/projects");
}

export async function deleteProject(fd: FormData) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("projects").delete().eq("id", str(fd, "id"));
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function addSkill(fd: FormData) {
  const supabase = await requireAdmin();
  const name = str(fd, "name");
  if (!name) redirect("/admin/skills");
  const { error } = await supabase.from("skills").insert({
    name,
    category: str(fd, "category") || "Lainnya",
    sort: Number(str(fd, "sort")) || 0,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/admin/skills");
}

export async function deleteSkill(fd: FormData) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("skills").delete().eq("id", str(fd, "id"));
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/admin/skills");
}

export async function saveExperience(fd: FormData) {
  const supabase = await requireAdmin();
  const id = str(fd, "id");
  const payload = {
    kind: ["education", "organization"].includes(str(fd, "kind")) ? str(fd, "kind") : "work",
    role: str(fd, "role"),
    org: str(fd, "org"),
    period: str(fd, "period"),
    description: str(fd, "description"),
    sort: Number(str(fd, "sort")) || 0,
  };
  const { error } = id
    ? await supabase.from("experiences").update(payload).eq("id", id)
    : await supabase.from("experiences").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/admin/experiences");
}

export async function deleteExperience(fd: FormData) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("experiences").delete().eq("id", str(fd, "id"));
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/admin/experiences");
}

export async function saveCertification(fd: FormData) {
  const supabase = await requireAdmin();
  const id = str(fd, "id");
  const payload = {
    title: str(fd, "title"),
    issuer: str(fd, "issuer"),
    issued: str(fd, "issued"),
    sort: Number(str(fd, "sort")) || 0,
  };
  const { error } = id
    ? await supabase.from("certifications").update(payload).eq("id", id)
    : await supabase.from("certifications").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/admin/certifications");
}

export async function deleteCertification(fd: FormData) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("certifications").delete().eq("id", str(fd, "id"));
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/admin/certifications");
}

export async function saveCard(fd: FormData) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("profile")
    .update({
      card_title: str(fd, "card_title"),
      card_subtitle: str(fd, "card_subtitle"),
      card_role: str(fd, "card_role"),
      card_education: str(fd, "card_education"),
      card_location: str(fd, "card_location"),
      card_photo_url: str(fd, "card_photo_url") || null,
      card_back_title: str(fd, "card_back_title"),
      card_back_text: str(fd, "card_back_text"),
    })
    .eq("id", 1);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/admin/card?saved=1");
}

export async function resetCard() {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("profile")
    .update({
      card_title: null,
      card_subtitle: null,
      card_role: null,
      card_education: null,
      card_location: null,
      card_photo_url: null,
      card_back_title: null,
      card_back_text: null,
    })
    .eq("id", 1);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/admin/card?saved=1");
}
