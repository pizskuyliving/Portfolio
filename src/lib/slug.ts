/** "Halo Dunia!" -> "halo-dunia". Bisa menghasilkan "" (judul tanpa huruf Latin/angka); pemanggil wajib mengecek. */
export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
