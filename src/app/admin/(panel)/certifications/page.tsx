import { getCertifications } from "@/lib/data";
import type { Certification } from "@/lib/types";
import { deleteCertification, saveCertification } from "../../actions";

function Fields({ c }: { c?: Certification }) {
  return (
    <div className="grid gap-4">
      <input type="hidden" name="id" value={c?.id ?? ""} />
      <label className="block">
        <span className="label">Nama sertifikat</span>
        <input name="title" required defaultValue={c?.title ?? ""} className="input" />
      </label>
      <label className="block">
        <span className="label">Penerbit (sertifikat dengan penerbit sama dikelompokkan)</span>
        <input name="issuer" required defaultValue={c?.issuer ?? ""} className="input" />
      </label>
      <label className="block">
        <span className="label">Terbit (contoh: Jul 2025)</span>
        <input name="issued" defaultValue={c?.issued ?? ""} className="input" />
      </label>
      <label className="block">
        <span className="label">Urutan</span>
        <input name="sort" type="number" defaultValue={c?.sort ?? 0} className="input w-24" />
      </label>
    </div>
  );
}

export default async function CertificationsAdmin() {
  const items = await getCertifications();
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold">Sertifikasi</h1>

      <details className="mt-8 rounded border border-ink/20 bg-white p-4">
        <summary className="cursor-pointer font-medium">Tambah baru</summary>
        <form action={saveCertification} className="mt-4">
          <Fields />
          <button className="btn mt-5">Simpan</button>
        </form>
      </details>

      <ul className="mt-8 space-y-3">
        {items.map((c) => (
          <li key={c.id}>
            <details className="rounded border border-ink/20 bg-white p-4">
              <summary className="cursor-pointer">
                <span className="font-medium">{c.title}</span>
                <span className="text-ink/60"> ({c.issuer}, {c.issued})</span>
              </summary>
              <form action={saveCertification} className="mt-4">
                <Fields c={c} />
                <button className="btn mt-5">Simpan perubahan</button>
              </form>
              <form action={deleteCertification} className="mt-3">
                <input type="hidden" name="id" value={c.id} />
                <button className="btn-danger">Hapus</button>
              </form>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
