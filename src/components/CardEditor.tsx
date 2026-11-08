"use client";
import { useState } from "react";
import { CardBack, CardFront, type Contact } from "@/components/IdCardFaces";
import type { CardData } from "@/lib/card";

/** Editor kartu ID: teks dan foto diedit langsung di atas kartu. */
export default function CardEditor({
  initial,
  contacts,
  saveAction,
  resetAction,
}: {
  initial: CardData;
  contacts: Contact[];
  saveAction: (fd: FormData) => Promise<void>;
  resetAction: (fd: FormData) => Promise<void>;
}) {
  const [d, setD] = useState<CardData>(initial);
  const [side, setSide] = useState<"front" | "back">("front");
  const edit = { set: (k: keyof CardData, v: string | null) => setD((p) => ({ ...p, [k]: v })) };

  return (
    <div>
      <form action={saveAction}>
        <input type="hidden" name="card_title" value={d.title} />
        <input type="hidden" name="card_subtitle" value={d.subtitle} />
        <input type="hidden" name="card_role" value={d.role} />
        <input type="hidden" name="card_education" value={d.education} />
        <input type="hidden" name="card_location" value={d.location} />
        <input type="hidden" name="card_photo_url" value={d.photoUrl ?? ""} />
        <input type="hidden" name="card_back_title" value={d.backTitle} />
        <input type="hidden" name="card_back_text" value={d.backText} />

        <div className="flex flex-wrap items-center gap-3">
          <div role="group" aria-label="Sisi kartu" className="inline-flex rounded-full border border-ink/25 p-1">
            {(["front", "back"] as const).map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={side === s}
                onClick={() => setSide(s)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold ${side === s ? "bg-navy text-white" : "hover:bg-mist"}`}
              >
                {s === "front" ? "Sisi depan" : "Sisi belakang"}
              </button>
            ))}
          </div>
          <button className="btn">Simpan kartu</button>
        </div>

        <p className="mt-4 max-w-md text-sm text-ink/70">
          Klik langsung teks di kartu untuk mengubahnya. Klik foto untuk menggantinya. Perubahan baru tampil di
          situs setelah kamu menekan Simpan kartu.
        </p>

        <div className="mx-auto mt-8 w-full max-w-[17.5rem]">
          {side === "front" ? (
            <CardFront data={d} edit={edit} />
          ) : (
            <CardBack data={d} contacts={contacts} edit={edit} className="min-h-[25rem]" />
          )}
        </div>
        {side === "back" && (
          <p className="mx-auto mt-4 max-w-[17.5rem] text-center text-xs text-ink/60">
            Email, GitHub, dan LinkedIn diatur di halaman Profil.
          </p>
        )}
      </form>

      <form action={resetAction} className="mt-10 border-t border-ink/15 pt-6">
        <p className="text-sm text-ink/70">
          Ingin kartu kembali mengikuti profil dan pendidikan secara otomatis? Semua isi kartu yang kamu ubah akan
          dihapus.
        </p>
        <button className="btn-ghost mt-3">Kembalikan ke isi otomatis</button>
      </form>
    </div>
  );
}
