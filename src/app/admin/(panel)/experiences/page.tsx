import { getExperiences } from "@/lib/data";
import type { Experience } from "@/lib/types";
import { deleteExperience, saveExperience } from "../../actions";

function Fields({ e }: { e?: Experience }) {
  return (
    <div className="grid gap-4">
      <input type="hidden" name="id" value={e?.id ?? ""} />
      <label className="block">
        <span className="label">Jenis</span>
        <select name="kind" defaultValue={e?.kind ?? "work"} className="input">
          <option value="work">Pengalaman kerja</option>
          <option value="education">Pendidikan</option>
          <option value="organization">Organisasi</option>
        </select>
      </label>
      <label className="block">
        <span className="label">Posisi atau program</span>
        <input name="role" required defaultValue={e?.role ?? ""} className="input" />
      </label>
      <label className="block">
        <span className="label">Instansi</span>
        <input name="org" required defaultValue={e?.org ?? ""} className="input" />
      </label>
      <label className="block">
        <span className="label">Periode (contoh: Feb 2026 - Nov 2026)</span>
        <input name="period" required defaultValue={e?.period ?? ""} className="input" />
      </label>
      <label className="block">
        <span className="label">Deskripsi</span>
        <textarea name="description" rows={4} defaultValue={e?.description ?? ""} className="input" />
      </label>
      <label className="block">
        <span className="label">Urutan</span>
        <input name="sort" type="number" defaultValue={e?.sort ?? 0} className="input w-24" />
      </label>
    </div>
  );
}

export default async function ExperiencesAdmin() {
  const items = await getExperiences();
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold">Pengalaman dan pendidikan</h1>

      <details className="mt-8 rounded border border-ink/20 bg-white p-4">
        <summary className="cursor-pointer font-medium">Tambah baru</summary>
        <form action={saveExperience} className="mt-4">
          <Fields />
          <button className="btn mt-5">Simpan</button>
        </form>
      </details>

      <ul className="mt-8 space-y-3">
        {items.map((e) => (
          <li key={e.id}>
            <details className="rounded border border-ink/20 bg-white p-4">
              <summary className="cursor-pointer">
                <span className="font-medium">{e.role}</span>
                <span className="text-ink/60">, {e.org} ({e.period})</span>
              </summary>
              <form action={saveExperience} className="mt-4">
                <Fields e={e} />
                <button className="btn mt-5">Simpan perubahan</button>
              </form>
              <form action={deleteExperience} className="mt-3">
                <input type="hidden" name="id" value={e.id} />
                <button className="btn-danger">Hapus</button>
              </form>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
