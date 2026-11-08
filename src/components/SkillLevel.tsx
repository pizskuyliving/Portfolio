const LABELS = ["Dasar", "Berkembang", "Menengah", "Mahir", "Sangat mahir"];

export default function SkillLevel({ level }: { level: number }) {
  return (
    <span className="flex items-center gap-2" title={LABELS[level - 1]}>
      <span className="flex gap-1" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={`h-2 w-5 rounded-sm ${n <= level ? "bg-forest" : "bg-ink/15"}`} />
        ))}
      </span>
      <span className="sr-only">{LABELS[level - 1]}</span>
    </span>
  );
}
