"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const BARS = [2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1, 1, 2, 1, 3, 2, 1, 2, 1, 3, 1, 2, 2, 1, 3, 1];
const trimUrl = (u: string) => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

// Parameter fisika bandul
const W0 = 9.5; // kekuatan gravitasi (kuadrat frekuensi alami)
const K2 = 55; // kekakuan sendi kartu terhadap tali
const C2 = 4.5; // redaman sendi kartu
const COUPLE = 2; // seberapa besar kartu "tertinggal" saat tali bergerak
const CLASP_Y = 104; // jarak titik temu tali (crimp) dari puncak kartu

const geo = () => {
  const lg = typeof window !== "undefined" && window.innerWidth >= 1024;
  const htop = lg ? 300 : 80; // tinggi tali di atas kartu sampai titik gantung
  return { lg, htop, sp: lg ? 64 : 30, L: htop + CLASP_Y };
};

type Props = {
  name: string;
  photoUrl?: string | null;
  role?: string | null;
  education?: string | null;
  location?: string | null;
  email?: string | null;
  github?: string | null;
  linkedin?: string | null;
};

/**
 * Kartu ID berlanyard dengan fisika bandul: bisa ditarik, dilempar, dan berayun alami.
 * Klik/ketuk kartu atau tombol "Balik kartu" untuk melihat sisi belakang (kontak).
 */
export default function IdCard({ name, photoUrl, role, education, location, email, github, linkedin }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [grabbing, setGrabbing] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const laneRef = useRef<SVGGElement>(null);
  const fadeRef = useRef<SVGLinearGradientElement>(null);

  const phys = useRef({ th: 0, w: 0, r: 0, rw: 0, acc: 0, drag: false, px: 0, py: 0, off: 0, last: 0, damp: 1.1 });
  const rafId = useRef<number | null>(null);
  const kickRef = useRef<() => void>(() => {});
  const ready = useRef(false);
  const moved = useRef(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const p = phys.current;
    p.damp = reduced.current ? 7 : 1.1;

    // elemen tali (dua helai membentuk huruf V)
    const straps = [0, 1].map((i) => {
      const g = laneRef.current?.querySelector(`[data-strap="${i}"]`);
      const m: Record<string, SVGElement> = {};
      g?.querySelectorAll("[data-k]").forEach((el) => {
        m[(el as SVGElement).dataset.k as string] = el as SVGElement;
      });
      return m;
    });
    const setLine = (el: SVGElement | undefined, ax: number, ay: number, cx: number, cy: number, nx: number, ny: number, o: number) => {
      if (!el) return;
      el.setAttribute("x1", String(ax + nx * o));
      el.setAttribute("y1", String(ay + ny * o));
      el.setAttribute("x2", String(cx + nx * o));
      el.setAttribute("y2", String(cy + ny * o));
    };
    const drawStrap = (m: Record<string, SVGElement>, ax: number, ay: number, cx: number, cy: number) => {
      const dx = cx - ax;
      const dy = cy - ay;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      setLine(m.border, ax, ay, cx, cy, nx, ny, 0);
      setLine(m.body, ax, ay, cx, cy, nx, ny, 0);
      setLine(m.weave, ax, ay, cx, cy, nx, ny, 0);
      setLine(m.st1, ax, ay, cx, cy, nx, ny, -8.5);
      setLine(m.st2, ax, ay, cx, cy, nx, ny, 8.5);
      m.path?.setAttribute("d", `M${ax} ${ay} L${cx} ${cy}`);
    };

    const render = () => {
      const { lg, sp, L } = geo();
      if (groupRef.current) groupRef.current.style.transform = `rotate(${p.th}rad)`;
      // titik temu tali berayun mengelilingi titik gantung (di atas halaman)
      const cx = -L * Math.sin(p.th);
      const cy = L * Math.cos(p.th);
      drawStrap(straps[0], -sp, -20, cx, cy);
      drawStrap(straps[1], sp, -20, cx, cy);
      fadeRef.current?.setAttribute("y1", lg ? "-30" : "0");
      fadeRef.current?.setAttribute("y2", lg ? "-20" : "70");
      if (cardRef.current) cardRef.current.style.transform = `rotate(${p.r}rad)`;
      if (glareRef.current) glareRef.current.style.backgroundPosition = `${50 - (p.th + p.r) * 90}% 0`;
    };

    const tick = (t: number) => {
      const dt = Math.min((t - (p.last || t)) / 1000, 1 / 30);
      p.last = t;
      if (dt > 0) {
        if (p.drag && wrapRef.current) {
          const b = wrapRef.current.getBoundingClientRect();
          const dx = p.px - (b.left + b.width / 2);
          const dy = Math.max(p.py - (b.top - geo().htop), 40);
          const target = clamp(-Math.atan2(dx, dy) - p.off, -1.25, 1.25);
          const prev = p.th;
          p.th += (target - p.th) * (1 - Math.exp(-dt * 22));
          const nw = (p.th - prev) / dt;
          p.acc = clamp((nw - p.w) / dt, -20, 20);
          p.w = nw;
        } else {
          const steps = 2;
          const h = dt / steps;
          for (let i = 0; i < steps; i++) {
            p.acc = -W0 * Math.sin(p.th) - p.damp * p.w;
            p.w += p.acc * h;
            p.th += p.w * h;
          }
        }
        const ra = -K2 * p.r - C2 * p.rw - COUPLE * p.acc;
        p.rw += ra * dt;
        p.r = clamp(p.r + p.rw * dt, -0.7, 0.7);
      }
      render();

      const resting =
        !p.drag && Math.abs(p.th) < 0.0008 && Math.abs(p.w) < 0.004 && Math.abs(p.r) < 0.0008 && Math.abs(p.rw) < 0.01;
      if (resting) {
        p.th = p.w = p.r = p.rw = 0;
        render();
        rafId.current = null;
        p.last = 0;
        return;
      }
      rafId.current = requestAnimationFrame(tick);
    };

    render();
    window.addEventListener("resize", render);

    kickRef.current = () => {
      if (rafId.current == null) {
        p.last = 0;
        rafId.current = requestAnimationFrame(tick);
      }
    };

    // ayunan pertama saat kartu mendarat, lalu kartu siap ditarik
    const swingTimer = setTimeout(() => {
      if (!reduced.current) {
        p.w = 0.75;
        kickRef.current();
      }
    }, 950);
    const readyTimer = setTimeout(() => {
      ready.current = true;
    }, 1350);

    return () => {
      window.removeEventListener("resize", render);
      clearTimeout(swingTimer);
      clearTimeout(readyTimer);
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!ready.current || e.button > 0) return;
    if ((e.target as HTMLElement).closest("a,button")) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    const p = phys.current;
    const b = wrap.getBoundingClientRect();
    const pivotY = b.top - geo().htop;
    const ang0 = -Math.atan2(e.clientX - (b.left + b.width / 2), Math.max(e.clientY - pivotY, 40));
    p.drag = true;
    p.px = e.clientX;
    p.py = e.clientY;
    p.off = ang0 - p.th; // supaya kartu tidak "melompat" saat dipegang
    moved.current = false;
    const sx = e.clientX;
    const sy = e.clientY;
    setGrabbing(true);
    kickRef.current();

    const move = (ev: PointerEvent) => {
      p.px = ev.clientX;
      p.py = ev.clientY;
      if (!moved.current && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 6) moved.current = true;
    };
    const up = () => {
      p.drag = false;
      setGrabbing(false);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      kickRef.current();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  }

  const contacts = [
    email && { label: "Email", text: email, href: `mailto:${email}` },
    github && { label: "GitHub", text: trimUrl(github), href: github },
    linkedin && { label: "LinkedIn", text: trimUrl(linkedin), href: linkedin },
  ].filter(Boolean) as { label: string; text: string; href: string }[];

  return (
    <div className="relative mx-auto mt-12 w-full max-w-[17.5rem] pb-2 lg:mt-0">
      {/* latar statis */}
      <div className="absolute left-1/2 top-40 h-[20rem] w-[20rem] -translate-x-1/2 rounded-full bg-sun" aria-hidden="true" />
      <div className="absolute -left-6 bottom-16 h-20 w-20 rounded-full bg-ember" aria-hidden="true" />
      <div className="absolute -right-4 top-52 h-10 w-10 rounded-full bg-sky" aria-hidden="true" />

      <div ref={wrapRef} className="id-drop relative z-10" style={{ animationDelay: "200ms" }}>
        {/* lanyard: dua helai tali membentuk V, ujung atasnya tetap, ujung bawahnya mengikuti kartu */}
        <svg
          className="pointer-events-none absolute z-0 overflow-visible"
          style={{ left: "calc(50% - 160px)", top: "calc(var(--htop) * -1)" }}
          width="320"
          height="720"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="lanyard-fade" ref={fadeRef} gradientUnits="userSpaceOnUse" x1="0" y1="-30" x2="0" y2="-20">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="1" stopColor="#fff" stopOpacity="1" />
            </linearGradient>
            <mask id="lanyard-mask" maskUnits="userSpaceOnUse" x="-300" y="-200" width="700" height="1200">
              <rect x="-300" y="-200" width="700" height="1200" fill="url(#lanyard-fade)" />
            </mask>
          </defs>
          <g transform="translate(160 0)">
            <g ref={laneRef} mask="url(#lanyard-mask)">
              {[0, 1].map((i) => (
                <g key={i} data-strap={i}>
                  <line data-k="border" stroke="#06141c" strokeOpacity="0.4" strokeWidth="27" />
                  <line data-k="body" stroke="#0d3044" strokeWidth="24" />
                  <line data-k="weave" stroke="#64b1cb" strokeOpacity="0.25" strokeWidth="24" strokeDasharray="1.2 3.2" />
                  <line data-k="st1" stroke="#fbb716" strokeOpacity="0.65" strokeWidth="1" strokeDasharray="4 3" />
                  <line data-k="st2" stroke="#fbb716" strokeOpacity="0.65" strokeWidth="1" strokeDasharray="4 3" />
                  <path id={`lanyard-path-${i}`} data-k="path" fill="none" />
                  <text dy="3.5" fontSize="10" fontWeight="800" fill="#fbb716" letterSpacing="1.4">
                    <textPath href={`#lanyard-path-${i}`} startOffset="48">
                      {`${name} • `.repeat(5)}
                    </textPath>
                  </text>
                </g>
              ))}
            </g>
          </g>
        </svg>

        <div
          ref={groupRef}
          onPointerDown={onPointerDown}
          onClickCapture={(e) => {
            if (moved.current) {
              e.preventDefault();
              e.stopPropagation();
              moved.current = false;
            }
          }}
          style={{ transformOrigin: "50% calc(var(--htop) * -1)" }}
          className={`touch-pan-y select-none will-change-transform ${grabbing ? "cursor-grabbing" : "cursor-grab"}`}
        >
          {/* ruang tempat tali bertemu */}
          <div style={{ height: CLASP_Y - 6 }} aria-hidden="true" />
          {/* crimp logam + pengait */}
          <svg className="relative z-10 mx-auto block" width="36" height="62" viewBox="0 0 36 62" aria-hidden="true">
            <defs>
              <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f3f7f9" />
                <stop offset="1" stopColor="#8fa3ad" />
              </linearGradient>
            </defs>
            <rect x="4" y="0" width="28" height="15" rx="4" fill="url(#metal)" stroke="#5f737c" strokeOpacity="0.55" />
            <rect x="15" y="15" width="6" height="6" fill="#8fa3ad" />
            <rect x="8" y="20" width="20" height="38" rx="10" fill="none" stroke="url(#metal)" strokeWidth="5" />
            <rect x="8" y="20" width="20" height="38" rx="10" fill="none" stroke="#5f737c" strokeOpacity="0.35" />
          </svg>
          {/* klip */}
          <div
            className="relative z-10 mx-auto -mb-3 -mt-5 h-8 w-11 rounded-md border border-navy/25 bg-[linear-gradient(#eef3f5,#9db0b9)] shadow"
            aria-hidden="true"
          >
            <div className="absolute inset-x-2 top-2 h-1 rounded-full bg-navy/30" />
          </div>

          {/* kartu (berayun relatif terhadap tali) */}
          <div ref={cardRef} className="origin-top">
            <div className="[perspective:1400px]">
              <div
                className={`flipper preserve-3d relative ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
                onClick={() => setFlipped((f) => !f)}
              >
                {/* DEPAN */}
                <div
                  inert={flipped}
                  className="backface-hidden relative overflow-hidden rounded-3xl bg-white shadow-[0_30px_46px_-22px_rgba(13,48,68,0.65)] ring-1 ring-navy/10"
                >
                  <div className="relative flex items-center gap-3 overflow-hidden bg-navy px-5 pb-2.5 pt-6">
                    <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full border-[14px] border-sky/25" aria-hidden="true" />
                    <div className="absolute left-1/2 top-2 h-2 w-12 -translate-x-1/2 rounded-full bg-paper ring-1 ring-black/20" aria-hidden="true" />
                    <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sun text-sm font-extrabold text-navy" aria-hidden="true">
                      {name.slice(0, 1)}
                    </span>
                    <div className="relative leading-tight text-white">
                      <p className="text-sm font-bold">Kartu Pengenal</p>
                      <p className="text-xs text-white/70">Portofolio</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-3.5 px-5">
                    <div className="relative h-36 w-28 shrink-0">
                      <div className="relative h-full w-full overflow-hidden rounded-2xl border-4 border-sun bg-sky">
                        {photoUrl ? (
                          <Image src={photoUrl} alt={`Foto ${name}`} fill priority draggable={false} sizes="112px" className="object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-5xl font-extrabold text-white/90">
                            {name.slice(0, 1)}
                          </div>
                        )}
                      </div>
                      {/* stiker hologram */}
                      <span
                        className="absolute -bottom-2 -right-2 h-9 w-9 rounded-full border-2 border-white shadow"
                        style={{ background: "conic-gradient(from 90deg, #64b1cb, #fbb716, #f58409, #64b1cb)" }}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="min-w-0 pt-1">
                      <p className="text-lg font-extrabold leading-tight tracking-tight">{name}</p>
                      {role && <p className="mt-1.5 text-xs font-medium leading-snug text-muted">{role}</p>}
                    </div>
                  </div>

                  {(education || location) && (
                    <dl className="mx-5 mt-4 space-y-2 rounded-xl bg-mist p-3 text-left">
                      {education && (
                        <div>
                          <dt className="text-xs text-muted">Pendidikan</dt>
                          <dd className="text-[0.8rem] font-semibold leading-snug">{education}</dd>
                        </div>
                      )}
                      {location && (
                        <div>
                          <dt className="text-xs text-muted">Lokasi</dt>
                          <dd className="text-[0.8rem] font-semibold">{location}</dd>
                        </div>
                      )}
                    </dl>
                  )}

                  <div className="flex items-center justify-between px-5 py-3" aria-hidden="true">
                    <div className="relative h-8 w-11 overflow-hidden rounded-md border border-navy/30 bg-[linear-gradient(135deg,#ffd45a,#fbb716_55%,#e89a0b)]">
                      <span className="absolute inset-x-0 top-1/2 h-px bg-navy/30" />
                      <span className="absolute inset-y-0 left-1/3 w-px bg-navy/30" />
                      <span className="absolute inset-y-0 left-2/3 w-px bg-navy/30" />
                    </div>
                    <div className="flex h-8 items-stretch gap-0.5">
                      {BARS.map((w, i) => (
                        <span key={i} className="bg-navy" style={{ width: `${w * 1.5}px` }} />
                      ))}
                    </div>
                  </div>
                  <div className="flex h-2.5" aria-hidden="true">
                    <span className="flex-1 bg-sky" />
                    <span className="flex-1 bg-sun" />
                    <span className="flex-1 bg-ember" />
                  </div>

                  {/* kilau yang ikut bergerak saat kartu berayun */}
                  <div
                    ref={glareRef}
                    className="pointer-events-none absolute inset-0 z-20 bg-no-repeat opacity-60"
                    style={{
                      backgroundImage:
                        "linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.7) 50%, transparent 62%)",
                      backgroundSize: "260% 100%",
                      backgroundPosition: "50% 0",
                    }}
                    aria-hidden="true"
                  />
                </div>

                {/* BELAKANG */}
                <div
                  inert={!flipped}
                  className="backface-hidden absolute inset-0 flex flex-col overflow-hidden rounded-3xl bg-navy text-white shadow-[0_30px_46px_-22px_rgba(13,48,68,0.65)] [transform:rotateY(180deg)]"
                >
                  <div className="mt-8 h-9 bg-[#06141c]" aria-hidden="true" />
                  <div className="flex-1 px-5 pt-4">
                    <h3 className="text-lg">Ayo terhubung</h3>
                    <p className="mt-1.5 text-xs text-white/75">Kirim pesan lewat salah satu kanal ini.</p>
                    {contacts.length > 0 ? (
                      <ul className="mt-3 space-y-2.5">
                        {contacts.map((c) => (
                          <li key={c.label}>
                            <p className="text-[0.7rem] leading-none text-white/60">{c.label}</p>
                            <a
                              href={c.href}
                              target={c.href.startsWith("http") ? "_blank" : undefined}
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="break-all text-sm font-semibold leading-tight text-sun underline"
                            >
                              {c.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-sm text-white/75">Kontak belum ditambahkan.</p>
                    )}
                  </div>
                  <p className="px-5 pb-3 text-xs text-white/60">
                    {name}
                    {location ? `, ${location}` : ""}
                  </p>
                  <div className="flex h-2.5" aria-hidden="true">
                    <span className="flex-1 bg-sky" />
                    <span className="flex-1 bg-sun" />
                    <span className="flex-1 bg-ember" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 text-center">
          <button
            type="button"
            aria-pressed={flipped}
            onClick={() => setFlipped((f) => !f)}
            className="rounded-full bg-navy px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            {flipped ? "Lihat depan" : "Balik kartu"}
          </button>
          <p className="mt-3 text-xs text-muted">Kartunya bisa ditarik, lho. Coba saja.</p>
        </div>
      </div>
    </div>
  );
}
