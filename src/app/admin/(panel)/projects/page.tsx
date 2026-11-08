import Link from "next/link";
import { getProjects } from "@/lib/data";
import { deleteProject } from "../../actions";

export default async function ProjectsAdmin() {
  const projects = await getProjects({ includeDrafts: true });
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Project</h1>
        <Link href="/admin/projects/new" className="btn">Tambah project</Link>
      </div>
      {projects.length === 0 && <p className="mt-8 text-ink/70">Belum ada project.</p>}
      <ul className="mt-8 divide-y divide-ink/15 border-y border-ink/15">
        {projects.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-lg font-medium">{p.title}</p>
              <p className="text-sm text-ink/60">{p.published ? "Tayang" : "Draf"}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/projects/${p.id}`} className="btn-ghost">Edit</Link>
              <form action={deleteProject}>
                <input type="hidden" name="id" value={p.id} />
                <button className="btn-danger">Hapus</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
