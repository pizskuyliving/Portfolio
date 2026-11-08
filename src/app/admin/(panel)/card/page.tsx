import CardEditor from "@/components/CardEditor";
import type { Contact } from "@/components/IdCardFaces";
import { resolveCard } from "@/lib/card";
import { getExperiences, getProfile } from "@/lib/data";
import { resetCard, saveCard } from "../../actions";

const trimUrl = (u: string) => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export default async function CardAdmin({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [profile, experiences, { saved }] = await Promise.all([getProfile(), getExperiences(), searchParams]);
  const education = experiences.find((e) => e.kind === "education");

  const contacts = [
    profile?.email && { label: "Email", text: profile.email, href: `mailto:${profile.email}` },
    profile?.github && { label: "GitHub", text: trimUrl(profile.github), href: profile.github },
    profile?.linkedin && { label: "LinkedIn", text: trimUrl(profile.linkedin), href: profile.linkedin },
  ].filter(Boolean) as Contact[];

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold">Kartu ID</h1>
      {saved && <p className="mt-4 rounded bg-mist px-3 py-2 text-sm">Kartu disimpan.</p>}
      <div className="mt-8">
        <CardEditor
          initial={resolveCard(profile, education)}
          contacts={contacts}
          saveAction={saveCard}
          resetAction={resetCard}
        />
      </div>
    </div>
  );
}
