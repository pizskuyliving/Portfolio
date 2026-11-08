import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Pastikan yang mengakses adalah admin. Mengembalikan client Supabase yang sudah terautentikasi. */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  if (!user || (adminEmail && user.email?.toLowerCase() !== adminEmail)) {
    redirect("/admin/login");
  }
  return supabase;
}
