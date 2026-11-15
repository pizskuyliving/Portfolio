import type { Certification } from "@/lib/types";

/** Sertifikat dikelompokkan per penerbit. `detail` menampilkan ID kredensial dan link verifikasi. */
export default function CertGroups({ certs, detail = false }: { certs: Certification[]; detail?: boolean }) {
  // urutan grup = urutan kemunculan pertama (data sudah terurut dari database)
  const groups = Object.entries(Object.groupBy(certs, (c) => c.issuer));
  const Heading = detail ? "h2" : "h3"; // di halaman utama, judul bagian "Sertifikasi" sudah h2
  return (
    <div className="space-y-6">
      {groups.map(([issuer, items = []]) => (
        <div key={issuer} className="rounded-3xl bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <Heading className="text-2xl">{issuer}</Heading>
            <p className="text-sm text-muted">{items.length} sertifikat</p>
          </div>
          <ul className="mt-5 grid grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-2">
            {items.map((c) => (
              <li key={c.id} className="border-b border-line pb-2">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="min-w-0 font-medium">{c.title}</span>
                  <span className="shrink-0 text-sm text-muted">{c.issued}</span>
                </div>
                {detail && (c.credential_id || c.url) && (
                  <p className="mt-1 flex flex-wrap gap-x-4 text-sm text-muted">
                    {c.credential_id && <span>ID kredensial: {c.credential_id}</span>}
                    {c.url && (
                      <a href={c.url} target="_blank" rel="noreferrer" className="font-semibold text-navy underline">
                        Lihat kredensial
                      </a>
                    )}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
