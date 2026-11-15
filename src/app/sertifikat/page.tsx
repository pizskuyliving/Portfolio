import type { Metadata } from "next";
import Link from "next/link";
import CertGroups from "@/components/CertGroups";
import { getCertifications } from "@/lib/data";

export const metadata: Metadata = { title: "Sertifikasi", description: "Daftar sertifikat beserta ID kredensialnya." };

export default async function CertificationsPage() {
  const certs = await getCertifications();
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link href="/#sertifikasi" className="inline-block rounded-full bg-mist px-4 py-1.5 text-sm font-semibold transition hover:bg-sun">
        Kembali
      </Link>
      <h1 className="mt-10 text-4xl sm:text-6xl">Sertifikasi</h1>
      <p className="mt-5 max-w-[60ch] text-xl text-muted">{certs.length} sertifikat, dikelompokkan per penerbit.</p>
      <div className="mt-12">
        {certs.length > 0 ? <CertGroups certs={certs} detail /> : <p className="text-muted">Belum ada sertifikat.</p>}
      </div>
    </main>
  );
}
