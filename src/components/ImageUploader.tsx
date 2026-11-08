"use client";
import { useState } from "react";
import { uploadImage } from "@/lib/upload";

export default function ImageUploader({
  name,
  folder,
  defaultValue,
}: {
  name: string;
  folder: string;
  defaultValue?: string | null;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      setUrl(await uploadImage(file, folder));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={url} />
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Pratinjau" className="mb-3 h-40 w-32 rounded border border-ink/20 object-cover" />
      )}
      <input type="file" accept="image/*" onChange={onChange} disabled={busy} className="block text-sm" />
      {busy && <p className="mt-1 text-sm">Mengunggah...</p>}
      {error && <p className="mt-1 text-sm text-clay">{error}</p>}
    </div>
  );
}
