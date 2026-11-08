"use client";
import { useState } from "react";
import { uploadImage } from "@/lib/upload";

type Item = { url: string; caption: string };

export default function GalleryEditor({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState<Item[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setBusy(true);
    setError("");
    try {
      const added: Item[] = [];
      for (const f of files) added.push({ url: await uploadImage(f, "projects"), caption: "" });
      setItems((prev) => [...prev, ...added]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  const move = (i: number, dir: -1 | 1) =>
    setItems((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <div>
      <input type="hidden" name="images" value={JSON.stringify(items)} />
      <p className="mb-3 text-sm text-ink/70">Gambar pertama dipakai sebagai sampul project.</p>
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={it.url} className="flex gap-3 rounded border border-ink/20 bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.url} alt="" className="h-20 w-32 rounded object-cover object-top" />
            <div className="flex-1">
              <input
                className="input"
                placeholder="Keterangan (opsional)"
                value={it.caption}
                onChange={(e) =>
                  setItems((prev) => prev.map((x, k) => (k === i ? { ...x, caption: e.target.value } : x)))
                }
              />
              <div className="mt-2 flex gap-2">
                <button type="button" className="btn-ghost" onClick={() => move(i, -1)}>Naikkan</button>
                <button type="button" className="btn-ghost" onClick={() => move(i, 1)}>Turunkan</button>
                <button type="button" className="btn-danger" onClick={() => setItems((p) => p.filter((_, k) => k !== i))}>
                  Hapus
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <input type="file" accept="image/*" multiple onChange={onPick} disabled={busy} className="mt-4 block text-sm" />
      {busy && <p className="mt-1 text-sm">Mengunggah...</p>}
      {error && <p className="mt-1 text-sm text-clay">{error}</p>}
    </div>
  );
}
