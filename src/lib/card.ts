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

export type Contact = { label: string; text: string; href: string };

const trimUrl = (u: string) => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/** Kontak di sisi belakang kartu, dipakai situs dan pratinjau admin. */
export function contactsOf(profile: Profile | null): Contact[] {
  const out: Contact[] = [];
  if (profile?.email) out.push({ label: "Email", text: profile.email, href: `mailto:${profile.email}` });
  if (profile?.github) out.push({ label: "GitHub", text: trimUrl(profile.github), href: profile.github });
  if (profile?.linkedin) out.push({ label: "LinkedIn", text: trimUrl(profile.linkedin), href: profile.linkedin });
  return out;
}

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
