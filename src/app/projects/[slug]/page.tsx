import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BrowserFrame from "@/components/BrowserFrame";
import { getProject } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProject("slug", slug);
  return { title: p?.title ?? "Project", description: p?.summary ?? undefined };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject("slug", slug);
  if (!project || !project.published) notFound();
  const images = project.project_images ?? [];

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Link href="/#project" className="inline-block rounded-full bg-mist px-4 py-1.5 text-sm font-semibold transition hover:bg-sun">
        Semua project
      </Link>

      <h1 className="mt-10 text-4xl sm:text-6xl">{project.title}</h1>
      {project.summary && <p className="mt-5 max-w-[60ch] text-xl text-muted">{project.summary}</p>}

      {project.tech.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <li key={t} className="rounded-full bg-mist px-3 py-1 text-sm font-medium">{t}</li>
          ))}
        </ul>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        {project.demo_url && (
          <a href={project.demo_url} target="_blank" rel="noreferrer" className="rounded-full bg-sun px-6 py-2.5 font-bold transition hover:bg-ember">
            Buka demo
          </a>
        )}
        {project.repo_url && (
          <a href={project.repo_url} target="_blank" rel="noreferrer" className="rounded-full border-2 border-navy px-6 py-2.5 font-bold transition hover:bg-navy hover:text-white">
            Kode sumber
          </a>
        )}
      </div>

      {project.description && <p className="mt-12 max-w-[62ch] whitespace-pre-line">{project.description}</p>}

      <div className="mt-16 space-y-14">
        {images.map((img, i) => (
          <figure key={img.id}>
            <BrowserFrame src={img.url} alt={img.caption || `${project.title} ${i + 1}`} url={project.demo_url} />
            {img.caption && <figcaption className="mt-3 text-sm text-muted">{img.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </main>
  );
}
