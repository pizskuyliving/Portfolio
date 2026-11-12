import assert from "node:assert/strict";
import { test } from "node:test";
import { contactsOf, resolveCard } from "../src/lib/card.ts";
import { slugify } from "../src/lib/slug.ts";

test("slugify", () => {
  assert.equal(slugify("Halo Dunia!"), "halo-dunia");
  assert.equal(slugify("  Café -- Über  "), "cafe-uber");
  assert.equal(slugify("日本語"), ""); // pemanggil wajib menolak slug kosong
});

test("resolveCard: tanpa profil memakai teks bawaan", () => {
  const c = resolveCard(null);
  assert.equal(c.name, "Nama Kamu");
  assert.equal(c.title, "Kartu Pengenal");
  assert.equal(c.photoUrl, null);
});

test("resolveCard: kolom kartu kosong yang sudah disimpan tetap kosong, null mengikuti profil", () => {
  const profile = { name: "A", headline: "Dev, Web", location: "Pekanbaru", photo_url: "p.jpg", card_role: "", card_location: null };
  const edu = { role: "S1 Informatika", org: "UIR" };
  const c = resolveCard(profile, edu);
  assert.equal(c.role, ""); // dikosongkan sengaja di /admin/card
  assert.equal(c.location, "Pekanbaru");
  assert.equal(c.education, "S1 Informatika, UIR");
  assert.equal(c.photoUrl, "p.jpg");
});

test("contactsOf", () => {
  assert.deepEqual(contactsOf(null), []);
  assert.deepEqual(contactsOf({ github: "https://www.github.com/x/" }), [
    { label: "GitHub", text: "github.com/x", href: "https://www.github.com/x/" },
  ]);
});
