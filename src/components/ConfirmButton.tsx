"use client";

/** Tombol submit yang minta konfirmasi dulu; dipakai untuk aksi yang tidak bisa dibatalkan. */
export default function ConfirmButton({
  children,
  message = "Yakin hapus? Tindakan ini tidak bisa dibatalkan.",
  className = "btn-danger",
}: {
  children: React.ReactNode;
  message?: string;
  className?: string;
}) {
  return (
    <button className={className} onClick={(e) => { if (!confirm(message)) e.preventDefault(); }}>
      {children}
    </button>
  );
}
