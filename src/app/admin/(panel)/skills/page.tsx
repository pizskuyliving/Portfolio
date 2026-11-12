import ConfirmButton from "@/components/ConfirmButton";
import { getSkills } from "@/lib/data";
import { addSkill, deleteSkill } from "../../actions";

export default async function SkillsAdmin() {
  const skills = await getSkills();
  const categories = Array.from(new Set(skills.map((s) => s.category)));
  return (
    <div>
      <h1 className="text-3xl font-semibold">Skill</h1>

      <form action={addSkill} className="mt-8 flex max-w-2xl flex-wrap items-end gap-4">
        <div>
          <label className="label" htmlFor="category">Kategori</label>
          <input id="category" name="category" list="cats" required className="input" />
          <datalist id="cats">
            {categories.map((c) => <option key={c} value={c} />)}
          </datalist>
        </div>
        <div className="flex-1">
          <label className="label" htmlFor="name">Nama</label>
          <input id="name" name="name" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="sort">Urutan</label>
          <input id="sort" name="sort" type="number" defaultValue={0} className="input w-20" />
        </div>
        <button className="btn">Tambah</button>
      </form>

      <ul className="mt-10 divide-y divide-ink/15 border-y border-ink/15">
        {skills.map((s) => (
          <li key={s.id} className="flex items-center justify-between gap-4 py-3">
            <span className="text-lg">{s.name}</span>
            <span className="text-sm text-ink/60">{s.category}</span>
            <form action={deleteSkill}>
              <input type="hidden" name="id" value={s.id} />
              <ConfirmButton>Hapus</ConfirmButton>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
