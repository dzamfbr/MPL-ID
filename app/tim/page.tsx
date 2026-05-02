import { SiteNavbar } from "@/app/_components/site-navbar";
import { TeamsGrid } from "@/app/_components/teams-grid";

export default function TeamsPage() {
  return (
    <>
      <SiteNavbar />

      <main className="min-h-screen bg-[#faf8f6] px-6 pb-16 pt-28 text-black sm:px-10">
        <section className="mx-auto max-w-6xl">
          <div className="text-center">
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="inline-flex items-center justify-center bg-[#d10000] px-8 py-2 text-[3.2rem] font-black uppercase leading-none tracking-[0.04em] text-white sm:text-[4.8rem]"
            >
              Tim
            </h1>
          </div>

          <div className="mt-12">
            <TeamsGrid />
          </div>
        </section>
      </main>
    </>
  );
}
