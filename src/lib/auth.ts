import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Pastikan yang mengakses adalah admin. Mengembalikan client Supabase yang sudah terautentikasi.
 * Siapa admin hanya ditentukan oleh fungsi SQL is_admin(), sama dengan aturan RLS di database.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: ok, error } = await supabase.rpc("is_admin");
  if (error) throw new Error(error.message);
  if (!ok) redirect("/admin/login");
  return supabase;
}
