import Image from "next/image";

function hostOf(url?: string | null) {
  if (!url) return "";
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

export default function BrowserFrame({
  src,
  alt,
  url,
  priority = false,
}: {
  src?: string | null;
  alt: string;
  url?: string | null;
  priority?: boolean;
}) {
  return (
    <figure className="overflow-hidden rounded-2xl bg-white shadow-[0_12px_32px_-14px_rgba(13,48,68,0.5)]">
      <div className="flex h-9 items-center gap-3 bg-mist px-4">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-ember" />
          <span className="h-2.5 w-2.5 rounded-full bg-sun" />
          <span className="h-2.5 w-2.5 rounded-full bg-sky" />
        </span>
        {hostOf(url) && (
          <span className="truncate rounded-full bg-white px-3 py-0.5 text-xs text-muted">{hostOf(url)}</span>
        )}
      </div>
      <div className="relative aspect-[16/10] bg-mist">
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            Screenshot belum ditambahkan
          </div>
        )}
      </div>
    </figure>
  );
}
