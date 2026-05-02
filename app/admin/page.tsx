import { redirect } from "next/navigation";

import { saveStandingTeam } from "@/app/admin/actions";
import { readAdminSession } from "@/lib/admin-auth";
import { getTeamStandings } from "@/lib/standings";

export const metadata = {
  title: "Admin | Portofolio Dzamfbr - Web MPL ID",
};

export default async function AdminPage() {
  const adminSession = await readAdminSession();
  const teamStandings = await getTeamStandings({ includeInactive: true });

  if (!adminSession) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#f4f4f1] px-6 py-10 text-black sm:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <section className="border border-black/10 bg-white px-6 py-6 shadow-[0_18px_40px_rgba(0,0,0,0.04)] sm:px-8">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.34em] text-black/42">
            Kelola Klasemen
          </p>

          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="mt-4 text-3xl font-black uppercase tracking-[0.1em]"
          >
            Data Tim Dan Peringkat
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-black/58">
            Atur point match dan game tiap tim dari sini. Ranking di homepage
            akan otomatis berubah menyesuaikan.
          </p>

          <div className="mt-8 space-y-4">
            {teamStandings.length === 0 ? (
              <div className="border border-dashed border-black/14 px-5 py-6 text-sm text-black/52">
                Belum ada data tim. Tambahkan tim pertama dari form di atas.
              </div>
            ) : null}

            {teamStandings.map((team) => (
              <form
                key={team.id}
                action={saveStandingTeam}
                className="grid gap-4 border border-black/10 bg-[#faf8f6] px-4 py-4 md:grid-cols-2 xl:grid-cols-[1.4fr_1.2fr_repeat(4,0.7fr)_0.8fr_0.8fr]"
              >
                <input type="hidden" name="id" value={team.id} />

                <div className="space-y-2">
                  <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/42">
                    Nama Tim
                  </label>
                  <input
                    name="teamName"
                    defaultValue={team.teamName}
                    required
                    className="w-full border border-black/14 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#d10000]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/42">
                    Logo URL
                  </label>
                  <input
                    name="logoUrl"
                    defaultValue={team.logoUrl}
                    className="w-full border border-black/14 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#d10000]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/42">
                    M Win
                  </label>
                  <input
                    name="matchWins"
                    type="number"
                    min="0"
                    defaultValue={team.matchWins}
                    className="w-full border border-black/14 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#d10000]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/42">
                    M Lose
                  </label>
                  <input
                    name="matchLosses"
                    type="number"
                    min="0"
                    defaultValue={team.matchLosses}
                    className="w-full border border-black/14 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#d10000]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/42">
                    G Win
                  </label>
                  <input
                    name="gameWins"
                    type="number"
                    min="0"
                    defaultValue={team.gameWins}
                    className="w-full border border-black/14 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#d10000]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/42">
                    G Lose
                  </label>
                  <input
                    name="gameLosses"
                    type="number"
                    min="0"
                    defaultValue={team.gameLosses}
                    className="w-full border border-black/14 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#d10000]"
                  />
                </div>

                <div className="flex flex-wrap items-end gap-2">
                  <button
                    type="submit"
                    className="bg-[#d10000] px-4 py-3 text-[0.68rem] font-black uppercase tracking-[0.2em] text-white transition hover:bg-[#b00000]"
                  >
                    Simpan
                  </button>

                  <div className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
                    Net{" "}
                    {team.netGameWin >= 0
                      ? `+${team.netGameWin}`
                      : team.netGameWin}
                  </div>
                </div>
              </form>
            ))}
          </div>

          <form
            action={saveStandingTeam}
            className="mt-8 grid gap-4 border-t border-black/10 pt-8 md:grid-cols-2 xl:grid-cols-4"
          >
            <input type="hidden" name="isActive" value="on" />

            <input
              name="teamName"
              placeholder="Nama tim"
              required
              className="border border-black/14 px-4 py-3 text-sm outline-none transition focus:border-[#d10000]"
            />
            <input
              name="logoUrl"
              placeholder="/images/logo-tim.png atau https://..."
              className="border border-black/14 px-4 py-3 text-sm outline-none transition focus:border-[#d10000]"
            />
            <input
              name="matchWins"
              type="number"
              min="0"
              placeholder="Match win"
              className="border border-black/14 px-4 py-3 text-sm outline-none transition focus:border-[#d10000]"
            />
            <input
              name="matchLosses"
              type="number"
              min="0"
              placeholder="Match lose"
              className="border border-black/14 px-4 py-3 text-sm outline-none transition focus:border-[#d10000]"
            />
            <input
              name="gameWins"
              type="number"
              min="0"
              placeholder="Game win"
              className="border border-black/14 px-4 py-3 text-sm outline-none transition focus:border-[#d10000]"
            />
            <input
              name="gameLosses"
              type="number"
              min="0"
              placeholder="Game lose"
              className="border border-black/14 px-4 py-3 text-sm outline-none transition focus:border-[#d10000]"
            />
            <button
              type="submit"
              className="bg-[#d10000] px-4 py-3 text-[0.72rem] font-black uppercase tracking-[0.24em] text-white transition hover:bg-[#b00000]"
            >
              Tambah Tim
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
