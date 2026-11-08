import Image from "next/image";
import Link from "next/link";
import BrowserFrame from "@/components/BrowserFrame";
import CountUp from "@/components/CountUp";
import IdCard from "@/components/IdCard";
import { resolveCard } from "@/lib/card";
import Reveal from "@/components/Reveal";
import { getCertifications, getExperiences, getProfile, getProjects, getSkills } from "@/lib/data";
import type { Certification, Skill } from "@/lib/types";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export default async function Home() {
  const [profile, skills, projects, experiences, certs] = await Promise.all([
    getProfile(),
    getSkills(),
    getProjects(),
    getExperiences(),
    getCertifications(),
  ]);
  const name = profile?.name || "Nama Kamu";
  const navName = profile?.nickname || name; // nama di navbar: panggilan bila diisi, selain itu nama lengkap

  const groups: { name: string; items: Skill[] }[] = [];
  for (const s of skills) {
    const g = groups.find((x) => x.name === s.category);
    if (g) g.items.push(s);
    else groups.push({ name: s.category, items: [s] });
  }
  const work = experiences.filter((e) => e.kind === "work");
  const education = experiences.filter((e) => e.kind === "education");
  const orgs = experiences.filter((e) => e.kind === "organization");

  const certGroups: { issuer: string; items: Certification[] }[] = [];
  for (const c of certs) {
    const g = certGroups.find((x) => x.issuer === c.issuer);
    if (g) g.items.push(c);
    else certGroups.push({ issuer: c.issuer, items: [c] });
  }
  const skillNames = skills.map((s) => s.name);

  // ringkasan angka dari data yang ada (tidak ada angka karangan)
  const years = work.flatMap((e) => (e.period.match(/\b20\d{2}\b/g) ?? []).map(Number));
  const since = years.length ? Math.min(...years) : null;
  const stats: { label: string; value: React.ReactNode; bar: string }[] = [];
  if (projects.length > 0) stats.push({ label: "Project", value: <CountUp to={projects.length} />, bar: "bg-sun" });
  if (skills.length > 0) stats.push({ label: "Teknologi dipakai", value: <CountUp to={skills.length} />, bar: "bg-ember" });
  if (since) stats.push({ label: "Pengalaman sejak", value: String(since), bar: "bg-sky" });
  const featured = projects[0];

  return (
    <main className="overflow-x-clip">
      {/* Navigasi */}
      <header className="sticky top-4 z-30 px-4">
        <nav
          aria-label="Navigasi utama"
          className="mx-auto flex max-w-3xl items-center justify-between rounded-full bg-navy/95 px-6 py-3 text-sm text-white backdrop-blur"
        >
          <a href="#" className="font-extrabold">{navName}</a>
          <ul className="flex items-center gap-5 font-medium">
            <li className="hidden sm:block"><a href="#tentang" className="hover:text-sun">Tentang</a></li>
            <li className="hidden sm:block"><a href="#pengalaman" className="hover:text-sun">Pengalaman</a></li>
            <li><a href="#project" className="hover:text-sun">Project</a></li>
            <li className="hidden sm:block"><a href="#keahlian" className="hover:text-sun">Keahlian</a></li>
            <li><a href="#kontak" className="hover:text-sun">Kontak</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-14 px-6 pb-20 pt-10 lg:grid-cols-[1.2fr_1fr] lg:items-start lg:pt-10">
        <div className="min-w-0 lg:pt-8">
          <p className="rise text-lg font-semibold text-muted" style={delay(0)}>Halo, saya</p>
          <h1 className="rise mt-2 text-[clamp(2.75rem,8vw,5.5rem)]" style={delay(120)}>{name}</h1>
          {profile?.headline && (
            <p className="rise mt-6 max-w-xl text-xl text-muted" style={delay(240)}>{profile.headline}</p>
          )}
          {profile?.location && (
            <p className="rise mt-3 font-medium" style={delay(320)}>{profile.location}</p>
          )}
          <div className="rise mt-9 flex flex-wrap gap-3" style={delay(420)}>
            <a
              href="#project"
              className="rounded-full bg-sun px-7 py-3 font-bold text-navy transition duration-200 hover:-translate-y-0.5 hover:bg-ember"
            >
              Lihat project
            </a>
            <a
              href="#kontak"
              className="rounded-full border-2 border-navy px-7 py-3 font-bold transition duration-200 hover:bg-navy hover:text-white"
            >
              Hubungi saya
            </a>
          </div>

          {stats.length > 0 && (
            <dl className="rise mt-12 grid max-w-xl grid-cols-3 gap-3" style={delay(520)}>
              {stats.map((st) => (
                <div key={st.label} className="flex flex-col rounded-2xl bg-white p-3 sm:p-4">
                  <span className={`block h-1.5 w-8 rounded-full ${st.bar}`} aria-hidden="true" />
                  <dd className="order-1 mt-3 text-3xl font-extrabold leading-none tracking-tight sm:text-4xl">{st.value}</dd>
                  <dt className="order-2 mt-1.5 text-sm text-muted">{st.label}</dt>
                </div>
              ))}
            </dl>
          )}

          {featured && (
            <Link
              href={`/projects/${featured.slug}`}
              className="rise mt-5 flex w-full min-w-0 max-w-xl items-center gap-4 rounded-2xl border border-line bg-white p-3 transition duration-200 hover:-translate-y-0.5 hover:border-sun"
              style={delay(640)}
            >
              <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-mist">
                {featured.cover_url ? (
                  <Image src={featured.cover_url} alt="" fill sizes="96px" className="object-cover object-top" />
                ) : (
                  <span className="flex h-full items-center justify-center text-2xl font-extrabold text-muted">
                    {featured.title.slice(0, 1)}
                  </span>
                )}
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold text-muted">Project pilihan</span>
                <span className="block truncate font-bold">{featured.title}</span>
                {featured.summary && <span className="block truncate text-sm text-muted">{featured.summary}</span>}
              </span>
            </Link>
          )}
        </div>

        <IdCard
          data={resolveCard(profile, education[0])}
          email={profile?.email}
          github={profile?.github}
          linkedin={profile?.linkedin}
        />
      </section>

      {/* Pita skill berjalan */}
      {skillNames.length > 0 && (
        <div className="marquee overflow-hidden bg-sun py-4 text-navy" aria-hidden="true">
          <div
            className="marquee-track flex w-max items-center gap-10 whitespace-nowrap text-xl font-extrabold"
            style={{ animationDuration: `${Math.max(60, skillNames.length * 9)}s` }}
          >
            {[0, 1, 2, 3].flatMap((r) =>
              skillNames.map((n) => (
                <span key={`${r}-${n}`} className="flex items-center gap-10">
                  {n}
                  <span className="h-2.5 w-2.5 rounded-full bg-navy" />
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tentang */}
      <section id="tentang" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28">
        <Reveal className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr]">
          <h2 className="text-4xl sm:text-5xl">Sedikit tentang saya</h2>
          <div>
            {profile?.bio && <div className="max-w-[62ch] space-y-5 whitespace-pre-line">{profile.bio}</div>}
            {profile && profile.hobbies.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl">Di luar pekerjaan</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {profile.hobbies.map((h) => (
                    <li key={h} className="rounded-full bg-mist px-4 py-1.5 text-[0.95rem] font-medium">{h}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Reveal>
      </section>

      {/* Pengalaman */}
      <section id="pengalaman" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-28">
        <Reveal>
          <h2 className="text-4xl sm:text-5xl">Perjalanan saya</h2>
          <ol className="relative mt-12 max-w-3xl space-y-12 border-l-2 border-sky pl-8">
            {work.map((e) => (
              <li key={e.id} className="relative">
                <span className="absolute -left-[41px] top-1.5 h-4 w-4 rounded-full bg-ember ring-4 ring-paper" aria-hidden="true" />
                <p className="inline-block rounded-full bg-mist px-3 py-0.5 text-sm font-semibold">{e.period}</p>
                <h3 className="mt-2 text-2xl">{e.role}</h3>
                <p className="font-medium text-muted">{e.org}</p>
                {e.description && <p className="mt-3 max-w-[60ch]">{e.description}</p>}
              </li>
            ))}
          </ol>

          {education.length > 0 && (
            <>
              <h3 className="mt-20 text-3xl">Pendidikan</h3>
              <ol className="relative mt-10 max-w-3xl space-y-10 border-l-2 border-sky pl-8">
                {education.map((e) => (
                  <li key={e.id} className="relative">
                    <span className="absolute -left-[41px] top-1.5 h-4 w-4 rounded-full bg-sky ring-4 ring-paper" aria-hidden="true" />
                    <p className="inline-block rounded-full bg-mist px-3 py-0.5 text-sm font-semibold">{e.period}</p>
                    <h4 className="mt-2 text-xl font-bold">{e.role}</h4>
                    <p className="font-medium text-muted">{e.org}</p>
                    {e.description && <p className="mt-2 max-w-[60ch]">{e.description}</p>}
                  </li>
                ))}
              </ol>
            </>
          )}

          {orgs.length > 0 && (
            <>
              <h3 className="mt-20 text-3xl">Organisasi</h3>
              <ol className="relative mt-10 max-w-3xl space-y-10 border-l-2 border-sky pl-8">
                {orgs.map((e) => (
                  <li key={e.id} className="relative">
                    <span className="absolute -left-[41px] top-1.5 h-4 w-4 rounded-full bg-sun ring-4 ring-paper" aria-hidden="true" />
                    <p className="inline-block rounded-full bg-mist px-3 py-0.5 text-sm font-semibold">{e.period}</p>
                    <h4 className="mt-2 text-xl font-bold">{e.role}</h4>
                    <p className="font-medium text-muted">{e.org}</p>
                    {e.description && <p className="mt-2 max-w-[60ch]">{e.description}</p>}
                  </li>
                ))}
              </ol>
            </>
          )}
        </Reveal>
      </section>

      {/* Project */}
      <section id="project" className="scroll-mt-16 bg-navy py-28 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <h2 className="text-4xl sm:text-5xl">Project yang sudah saya kerjakan</h2>
            <p className="mt-4 max-w-xl text-lg text-white/80">
              Klik salah satu untuk melihat tampilan, teknologi, dan cerita di baliknya.
            </p>
          </Reveal>
          {projects.length === 0 && <p className="mt-10 text-white/80">Belum ada project yang ditayangkan.</p>}
          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2">
            {projects.map((p, i) => (
              <Reveal key={p.id} delay={Math.min(i, 3) * 90}>
                <article className="group h-full rounded-3xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1.5 hover:border-sky/70 hover:bg-white/10">
                  <Link href={`/projects/${p.slug}`} className="block" aria-label={`Lihat detail ${p.title}`}>
                    <BrowserFrame src={p.cover_url} alt={p.title} url={p.demo_url} priority={i === 0} />
                  </Link>
                  <div className="px-1 pb-1 pt-6">
                    <h3 className="text-2xl">{p.title}</h3>
                    {p.summary && <p className="mt-2 text-white/80">{p.summary}</p>}
                    {p.tech.length > 0 && (
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {p.tech.map((t) => (
                          <li key={t} className="rounded-full bg-white/10 px-3 py-1 text-sm">{t}</li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
                      <Link
                        href={`/projects/${p.slug}`}
                        className="rounded-full bg-sun px-5 py-2 text-sm font-bold text-navy transition hover:bg-ember"
                      >
                        Lihat detail
                      </Link>
                      {p.demo_url && (
                        <a className="text-sm font-semibold text-sun underline" href={p.demo_url} target="_blank" rel="noreferrer">Demo</a>
                      )}
                      {p.repo_url && (
                        <a className="text-sm font-semibold text-sun underline" href={p.repo_url} target="_blank" rel="noreferrer">Kode sumber</a>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Keahlian */}
      <section id="keahlian" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28">
        <Reveal>
          <h2 className="text-4xl sm:text-5xl">Yang sering saya pakai</h2>
          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2">
            {groups.map((g) => (
              <div key={g.name}>
                <h3 className="text-xl">{g.name}</h3>
                <ul className="mt-4 flex flex-wrap gap-2.5">
                  {g.items.map((s) => (
                    <li
                      key={s.id}
                      className="rounded-full border border-line bg-white px-4 py-1.5 font-medium transition duration-200 hover:-translate-y-0.5 hover:border-sun hover:bg-sun"
                    >
                      {s.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Sertifikasi */}
      {certs.length > 0 && (
        <section id="sertifikasi" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-28">
          <Reveal>
            <h2 className="text-4xl sm:text-5xl">Sertifikasi</h2>
            <div className="mt-10 space-y-6">
              {certGroups.map((g) => (
                <div key={g.issuer} className="rounded-3xl bg-white p-6 sm:p-8">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-2xl">{g.issuer}</h3>
                    <p className="text-sm text-muted">{g.items.length} sertifikat</p>
                  </div>
                  <ul className="mt-5 grid grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-2">
                    {g.items.map((c) => (
                      <li key={c.id} className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
                        <span className="min-w-0 font-medium">{c.title}</span>
                        <span className="shrink-0 text-sm text-muted">{c.issued}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* Kontak */}
      <section id="kontak" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-sun p-10 sm:p-16">
            <div className="absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-ember" aria-hidden="true" />
            <div className="absolute -right-4 top-10 h-16 w-16 rounded-full bg-sky" aria-hidden="true" />
            <div className="relative max-w-xl">
              <h2 className="text-4xl text-navy sm:text-5xl">Yuk, ngobrol!</h2>
              <p className="mt-4 text-lg text-navy">
                Punya lowongan yang cocok, atau proyek yang ingin dikerjakan bersama? Kirim pesan, saya senang berdiskusi.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {profile?.email && (
                  <a href={`mailto:${profile.email}`} className="rounded-full bg-navy px-6 py-3 font-bold text-white transition hover:-translate-y-0.5">
                    Kirim email
                  </a>
                )}
                {profile?.github && (
                  <a href={profile.github} target="_blank" rel="noreferrer" className="rounded-full border-2 border-navy px-6 py-3 font-bold text-navy transition hover:bg-navy hover:text-white">
                    GitHub
                  </a>
                )}
                {profile?.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" className="rounded-full border-2 border-navy px-6 py-3 font-bold text-navy transition hover:bg-navy hover:text-white">
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </Reveal>
        <p className="mt-10 text-center text-sm text-muted">© {new Date().getFullYear()} {name}</p>
      </section>
    </main>
  );
}
