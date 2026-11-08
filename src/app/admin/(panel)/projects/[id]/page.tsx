import { notFound } from "next/navigation";
import GalleryEditor from "@/components/GalleryEditor";
import { getProjectById } from "@/lib/data";
import { saveProject } from "../../../actions";

export default async function ProjectForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const p = isNew ? null : await getProjectById(id);
  if (!isNew && !p) notFound();

  return (
    <div>
      <h1 className="text-3xl font-semibold">{isNew ? "Tambah project" : "Edit project"}</h1>
      <form action={saveProject} className="mt-8 max-w-2xl space-y-5">
        <input type="hidden" name="id" value={p?.id ?? ""} />
        <div>
          <label className="label" htmlFor="title">Judul</label>
          <input id="title" name="title" required defaultValue={p?.title ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="slug">Slug URL (kosongkan untuk otomatis dari judul)</label>
          <input id="slug" name="slug" defaultValue={p?.slug ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="summary">Ringkasan singkat</label>
          <input id="summary" name="summary" defaultValue={p?.summary ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="description">Deskripsi lengkap</label>
          <textarea id="description" name="description" rows={6} defaultValue={p?.description ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="tech">Teknologi (pisahkan dengan koma)</label>
          <input id="tech" name="tech" defaultValue={p?.tech?.join(", ") ?? ""} className="input" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="demo_url">Tautan demo</label>
            <input id="demo_url" name="demo_url" type="url" defaultValue={p?.demo_url ?? ""} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="repo_url">Tautan repositori</label>
            <input id="repo_url" name="repo_url" type="url" defaultValue={p?.repo_url ?? ""} className="input" />
          </div>
        </div>
        <div>
          <span className="label">Screenshot / layout</span>
          <GalleryEditor
            initial={(p?.project_images ?? []).map((i) => ({ url: i.url, caption: i.caption ?? "" }))}
          />
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={p?.published ?? true} className="h-4 w-4" />
            Tayangkan di situs
          </label>
          <label className="flex items-center gap-2 text-sm">
            Urutan
            <input name="sort" type="number" defaultValue={p?.sort ?? 0} className="input w-20" />
          </label>
        </div>
        <button className="btn">Simpan project</button>
      </form>
    </div>
  );
}
