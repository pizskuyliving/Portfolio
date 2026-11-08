import Link from "next/link";
import { getProjects, getSkills } from "@/lib/data";

export default async function AdminHome() {
  const [projects, skills] = await Promise.all([getProjects({ includeDrafts: true }), getSkills()]);
  return (
    <div>
      <h1 className="text-3xl font-semibold">Ringkasan</h1>
      <p className="mt-4">
        {projects.length} project ({projects.filter((p) => p.published).length} tayang) dan {skills.length} skill.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/projects/new" className="btn">Tambah project</Link>
        <Link href="/admin/profile" className="btn-ghost">Edit profil</Link>
        <Link href="/admin/skills" className="btn-ghost">Kelola skill</Link>
      </div>
    </div>
  );
}
