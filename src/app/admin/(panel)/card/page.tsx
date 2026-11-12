import CardEditor from "@/components/CardEditor";
import { contactsOf, resolveCard } from "@/lib/card";
import { getExperiences, getProfile } from "@/lib/data";
import { resetCard, saveCard } from "../../actions";

export default async function CardAdmin({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [profile, experiences, { saved }] = await Promise.all([getProfile(), getExperiences(), searchParams]);
  const education = experiences.find((e) => e.kind === "education");

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold">Kartu ID</h1>
      {saved && <p className="mt-4 rounded bg-mist px-3 py-2 text-sm">Kartu disimpan.</p>}
      <div className="mt-8">
        <CardEditor
          initial={resolveCard(profile, education)}
          contacts={contactsOf(profile)}
          saveAction={saveCard}
          resetAction={resetCard}
        />
      </div>
    </div>
  );
}
