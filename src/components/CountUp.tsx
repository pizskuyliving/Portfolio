"use client";
import { useEffect, useState } from "react";

/** Angka yang menghitung naik dari 0. Pengguna "kurangi gerakan" langsung melihat angka akhir. */
export default function CountUp({ to, duration = 1200, delay = 700 }: { to: number; duration?: number; delay?: number }) {
  const [v, setV] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(to);
      return;
    }
    let raf = 0;
    let start = 0;
    const timer = setTimeout(() => {
      const step = (t: number) => {
        if (!start) start = t;
        const k = Math.min((t - start) / duration, 1);
        setV(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [to, duration, delay]);

  return (
    <>
      <span aria-hidden="true">{v}</span>
      <span className="sr-only">{to}</span>
    </>
  );
}
