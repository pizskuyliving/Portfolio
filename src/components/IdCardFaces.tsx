"use client";
import Image from "next/image";
import { useState } from "react";
import type { CardData, Contact } from "@/lib/card";
import { uploadImage } from "@/lib/upload";

const BARS = [2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1, 1, 2, 1, 3, 2, 1, 2, 1, 3, 1, 2, 2, 1, 3, 1];
const SHADOW = "shadow-[0_30px_46px_-22px_rgba(13,48,68,0.65)]";

/** Bila diberikan, teks di kartu menjadi kolom isian dan foto bisa diganti langsung di kartu. */
export type EditApi = { set: (key: keyof CardData, value: string | null) => void };

type TxtProps = {
  value: string;
  onChange?: (v: string) => void;
  className: string;
  as?: "p" | "dd" | "h3";
  ring?: string;
  multiline?: boolean;
  rows?: number;
  label: string;
  placeholder?: string;
};

function Txt({ value, onChange, className, as: Tag = "p", ring = "ring-navy/25", multiline, rows = 2, label, placeholder }: TxtProps) {
  if (!onChange) return value ? <Tag className={className}>{value}</Tag> : null;
  const cls = `${className} block w-full resize-none rounded bg-transparent px-1 -mx-1 outline-none ring-1 ring-dashed ${ring} placeholder:opacity-50 hover:ring-sun focus:ring-2 focus:ring-ember`;
  return multiline ? (
    <textarea aria-label={label} className={cls} rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
  ) : (
    <input aria-label={label} className={cls} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
  );
}

function PhotoBox({ data, edit }: { data: CardData; edit?: EditApi }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const content = data.photoUrl ? (
    <Image src={data.photoUrl} alt={`Foto ${data.name}`} fill priority draggable={false} sizes="112px" className="object-cover" />
  ) : (
    <div className="flex h-full items-center justify-center text-5xl font-extrabold text-white/90">{data.name.slice(0, 1)}</div>
  );
  if (!edit) return content;

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !edit) return;
    setBusy(true);
    setErr("");
    try {
      edit.set("photoUrl", await uploadImage(file, "profile"));
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Upload gagal");
    } finally {
      setBusy(false);
    }
  }

  return (
    <label className="group relative block h-full w-full cursor-pointer">
      {content}
      <span className="absolute inset-0 grid place-items-center bg-navy/60 px-2 text-center text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
        {busy ? "Mengunggah..." : err || "Klik untuk ganti foto"}
      </span>
      <input type="file" accept="image/*" className="sr-only" onChange={pick} disabled={busy} />
    </label>
  );
}

export function CardFront({
  data,
  edit,
  glareRef,
  inert,
  className = "",
}: {
  data: CardData;
  edit?: EditApi;
  glareRef?: React.Ref<HTMLDivElement>;
  inert?: boolean;
  className?: string;
}) {
  const on = (k: keyof CardData) => (edit ? (v: string) => edit.set(k, v) : undefined);
  const showPanel = edit || data.education || data.location;

  return (
    <div inert={inert} className={`${className} relative overflow-hidden rounded-3xl bg-white ${SHADOW} ring-1 ring-navy/10`}>
      <div className="relative flex items-center gap-3 overflow-hidden bg-navy px-5 pb-2.5 pt-6">
        <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full border-[14px] border-sky/25" aria-hidden="true" />
        <div className="absolute left-1/2 top-2 h-2 w-12 -translate-x-1/2 rounded-full bg-paper ring-1 ring-black/20" aria-hidden="true" />
        <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sun text-sm font-extrabold text-navy" aria-hidden="true">
          {data.name.slice(0, 1)}
        </span>
        <div className="relative min-w-0 flex-1 leading-tight text-white">
          <Txt value={data.title} onChange={on("title")} className="text-sm font-bold" ring="ring-white/40" label="Judul kartu" placeholder="Judul kartu" />
          <Txt value={data.subtitle} onChange={on("subtitle")} className="text-xs text-white/70" ring="ring-white/40" label="Subjudul kartu" placeholder="Subjudul" />
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3.5 px-5">
        <div className="relative h-36 w-28 shrink-0">
          <div className="relative h-full w-full overflow-hidden rounded-2xl border-4 border-sun bg-sky">
            <PhotoBox data={data} edit={edit} />
          </div>
          <span
            className="pointer-events-none absolute -bottom-2 -right-2 h-9 w-9 rounded-full border-2 border-white shadow"
            style={{ background: "conic-gradient(from 90deg, #64b1cb, #fbb716, #f58409, #64b1cb)" }}
            aria-hidden="true"
          />
        </div>
        <div className="min-w-0 flex-1 pt-1">
          <p className="text-lg font-extrabold leading-tight tracking-tight">{data.name}</p>
          <div className="mt-1.5">
            <Txt value={data.role} onChange={on("role")} multiline rows={3} className="text-xs font-medium leading-snug text-muted" label="Peran" placeholder="Peran / jabatan" />
          </div>
        </div>
      </div>

      {showPanel && (
        <dl className="mx-5 mt-4 space-y-2 rounded-xl bg-mist p-3 text-left">
          {(edit || data.education) && (
            <div>
              <dt className="text-xs text-muted">Pendidikan</dt>
              <Txt as="dd" value={data.education} onChange={on("education")} multiline rows={2} className="text-[0.8rem] font-semibold leading-snug" label="Pendidikan" placeholder="Pendidikan" />
            </div>
          )}
          {(edit || data.location) && (
            <div>
              <dt className="text-xs text-muted">Lokasi</dt>
              <Txt as="dd" value={data.location} onChange={on("location")} className="text-[0.8rem] font-semibold" label="Lokasi" placeholder="Lokasi" />
            </div>
          )}
        </dl>
      )}

      <div className="flex items-center justify-between px-5 py-3" aria-hidden="true">
        <div className="relative h-8 w-11 overflow-hidden rounded-md border border-navy/30 bg-[linear-gradient(135deg,#ffd45a,#fbb716_55%,#e89a0b)]">
          <span className="absolute inset-x-0 top-1/2 h-px bg-navy/30" />
          <span className="absolute inset-y-0 left-1/3 w-px bg-navy/30" />
          <span className="absolute inset-y-0 left-2/3 w-px bg-navy/30" />
        </div>
        <div className="flex h-8 items-stretch gap-0.5">
          {BARS.map((w, i) => (
            <span key={i} className="bg-navy" style={{ width: `${w * 1.5}px` }} />
          ))}
        </div>
      </div>
      <div className="flex h-2.5" aria-hidden="true">
        <span className="flex-1 bg-sky" />
        <span className="flex-1 bg-sun" />
        <span className="flex-1 bg-ember" />
      </div>

      {glareRef && (
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 z-20 bg-no-repeat opacity-60"
          style={{
            backgroundImage: "linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.7) 50%, transparent 62%)",
            backgroundSize: "260% 100%",
            backgroundPosition: "50% 0",
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export function CardBack({
  data,
  contacts,
  edit,
  inert,
  className = "",
}: {
  data: CardData;
  contacts: Contact[];
  edit?: EditApi;
  inert?: boolean;
  className?: string;
}) {
  const on = (k: keyof CardData) => (edit ? (v: string) => edit.set(k, v) : undefined);
  return (
    <div inert={inert} className={`${className} flex flex-col overflow-hidden rounded-3xl bg-navy text-white ${SHADOW}`}>
      <div className="mt-8 h-9 bg-[#06141c]" aria-hidden="true" />
      <div className="flex-1 px-5 pt-4">
        <Txt as="h3" value={data.backTitle} onChange={on("backTitle")} className="text-lg font-extrabold leading-tight" ring="ring-white/40" label="Judul sisi belakang" placeholder="Judul" />
        <div className="mt-1.5">
          <Txt value={data.backText} onChange={on("backText")} multiline rows={2} className="text-xs text-white/75" ring="ring-white/40" label="Teks sisi belakang" placeholder="Teks pengantar" />
        </div>
        {contacts.length > 0 ? (
          <ul className="mt-3 space-y-2.5">
            {contacts.map((c) => (
              <li key={c.label}>
                <p className="text-[0.7rem] leading-none text-white/60">{c.label}</p>
                {edit ? (
                  <span className="break-all text-sm font-semibold leading-tight text-sun underline">{c.text}</span>
                ) : (
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="break-all text-sm font-semibold leading-tight text-sun underline"
                  >
                    {c.text}
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-white/75">Kontak belum ditambahkan.</p>
        )}
      </div>
      <p className="px-5 pb-3 text-xs text-white/60">
        {data.name}
        {data.location ? `, ${data.location}` : ""}
      </p>
      <div className="flex h-2.5" aria-hidden="true">
        <span className="flex-1 bg-sky" />
        <span className="flex-1 bg-sun" />
        <span className="flex-1 bg-ember" />
      </div>
    </div>
  );
}
