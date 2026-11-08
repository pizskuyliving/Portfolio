import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <nav className="flex flex-wrap items-center gap-5 border-b border-ink/15 pb-4 text-sm">
        <Link href="/admin" className="font-semibold">Admin</Link>
        <Link href="/admin/profile" className="hover:underline">Profil</Link>
        <Link href="/admin/experiences" className="hover:underline">Pengalaman</Link>
        <Link href="/admin/certifications" className="hover:underline">Sertifikasi</Link>
        <Link href="/admin/projects" className="hover:underline">Project</Link>
        <Link href="/admin/skills" className="hover:underline">Skill</Link>
        <Link href="/" className="hover:underline" target="_blank">Lihat situs</Link>
        <form action={logout} className="ml-auto">
          <button className="btn-ghost">Keluar</button>
        </form>
      </nav>
      <div className="py-8">{children}</div>
    </div>
  );
}
