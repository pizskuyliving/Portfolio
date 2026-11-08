"use client";
import { createClient } from "@/lib/supabase/client";

/** Upload langsung dari browser ke Supabase Storage (menghindari batas 4,5 MB request di Vercel). */
export async function uploadImage(file: File, folder: string) {
  const supabase = createClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("portfolio")
    .upload(path, file, { cacheControl: "31536000", contentType: file.type });
  if (error) throw error;
  return supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl;
}
