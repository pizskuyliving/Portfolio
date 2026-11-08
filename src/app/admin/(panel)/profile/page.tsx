import ImageUploader from "@/components/ImageUploader";
import { getProfile } from "@/lib/data";
import { saveProfile } from "../../actions";

export default async function ProfileAdmin({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [profile, { saved }] = await Promise.all([getProfile(), searchParams]);
  return (
    <div>
      <h1 className="text-3xl font-semibold">Profil</h1>
      {saved && <p className="mt-4 rounded bg-mist px-3 py-2 text-sm">Profil disimpan.</p>}
      <form action={saveProfile} className="mt-8 max-w-2xl space-y-5">
        <div>
          <span className="label">Foto</span>
          <ImageUploader name="photo_url" folder="profile" defaultValue={profile?.photo_url} />
        </div>
        <div>
          <label className="label" htmlFor="name">Nama</label>
          <input id="name" name="name" required defaultValue={profile?.name ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="nickname">Nama panggilan (tampil di navbar; kosongkan untuk memakai nama lengkap)</label>
          <input id="nickname" name="nickname" defaultValue={profile?.nickname ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="headline">Kalimat pembuka</label>
          <input id="headline" name="headline" defaultValue={profile?.headline ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="location">Lokasi</label>
          <input id="location" name="location" defaultValue={profile?.location ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="bio">Biodata</label>
          <textarea id="bio" name="bio" rows={6} defaultValue={profile?.bio ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="hobbies">Hobi (pisahkan dengan koma)</label>
          <input id="hobbies" name="hobbies" defaultValue={profile?.hobbies?.join(", ") ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email kontak</label>
          <input id="email" name="email" type="email" defaultValue={profile?.email ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="github">Tautan GitHub</label>
          <input id="github" name="github" type="url" defaultValue={profile?.github ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="linkedin">Tautan LinkedIn</label>
          <input id="linkedin" name="linkedin" type="url" defaultValue={profile?.linkedin ?? ""} className="input" />
        </div>
        <button className="btn">Simpan profil</button>
      </form>
    </div>
  );
}
