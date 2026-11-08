import type { Experience, Profile } from "@/lib/types";

export type CardData = {
  name: string;
  title: string;
  subtitle: string;
  role: string;
  education: string;
  location: string;
  photoUrl: string | null;
  backTitle: string;
  backText: string;
};

/** Isi kartu: nilai yang disimpan di /admin/card, atau (bila belum pernah disimpan) diturunkan dari profil. */
export function resolveCard(profile: Profile | null, education?: Experience): CardData {
  return {
    name: profile?.name || "Nama Kamu",
    title: profile?.card_title ?? "Kartu Pengenal",
    subtitle: profile?.card_subtitle ?? "Portofolio",
    role: profile?.card_role ?? profile?.headline?.split(",")[0] ?? "",
    education: profile?.card_education ?? (education ? `${education.role}, ${education.org}` : ""),
    location: profile?.card_location ?? profile?.location ?? "",
    photoUrl: profile?.card_photo_url || profile?.photo_url || null,
    backTitle: profile?.card_back_title ?? "Ayo terhubung",
    backText: profile?.card_back_text ?? "Kirim pesan lewat salah satu kanal ini.",
  };
}
