import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteNavbar } from "@/app/_components/site-navbar";
import { teams } from "@/app/_components/teams-data";

export function generateStaticParams() {
  return teams.map((team) => ({ slug: team.slug }));
}

export default async function TeamDetailPage(
  props: PageProps<"/tim/[slug]">,
) {
  const { slug } = await props.params;
  const team = teams.find((item) => item.slug === slug);

  if (!team) {
    notFound();
  }

  return (
    <>
      <SiteNavbar />

      <main className="min-h-screen bg-[#faf8f6] px-6 pb-16 pt-28 text-black sm:px-10">
        <section className="mx-auto max-w-5xl">
          <Link
            href="/tim"
            style={{ fontFamily: "var(--font-accent)" }}
            className="text-sm font-bold uppercase tracking-[0.22em] text-[#9f0000] transition hover:text-[#7d0000]"
          >
            Kembali Ke Tim
          </Link>

          <div className="mt-8 overflow-hidden border border-black/10 bg-white shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
            <div
              className="px-6 py-4 text-center sm:px-10"
              style={{ backgroundColor: team.accent }}
            >
              <h1
                style={{ fontFamily: "var(--font-display)" }}
                className="text-[2.2rem] font-black uppercase tracking-[0.08em] text-white sm:text-[3.2rem]"
              >
                {team.code}
              </h1>
            </div>

            <div className="flex flex-col items-center px-6 py-10 text-center sm:px-10">
              <Image
                src={team.logo}
                alt={team.name}
                width={260}
                height={260}
                className="h-auto max-h-[12rem] w-auto max-w-[12rem] object-contain sm:max-h-[15rem] sm:max-w-[15rem]"
              />

              <h2
                style={{ fontFamily: "var(--font-display)" }}
                className="mt-8 text-[2rem] font-black uppercase tracking-[0.06em] text-black sm:text-[2.8rem]"
              >
                {team.name}
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-black/58 sm:text-base">
                Halaman tim khusus untuk {team.name}. Nanti bagian ini bisa kita
                isi roster, statistik, jadwal main, atau profil singkat tim.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
