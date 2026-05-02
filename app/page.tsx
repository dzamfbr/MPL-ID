"use client";

import { Icon } from "@iconify/react";
import chevronLeft from "@iconify-icons/mdi/chevron-left";
import chevronRight from "@iconify-icons/mdi/chevron-right";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { SiteNavbar } from "@/app/_components/site-navbar";

type StandingItem = {
  id: number;
  rank: number;
  teamName: string;
  logoUrl: string;
  matchPoints: number;
  matchWins: number;
  matchLosses: number;
  netGameWin: number;
  gameWins: number;
  gameLosses: number;
};

export default function Home() {
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [standings, setStandings] = useState<StandingItem[]>([]);
  const [isLoadingStandings, setIsLoadingStandings] = useState(true);
  const indonesiaRef = useRef<HTMLParagraphElement | null>(null);
  const banners = [
    "/images/Banner%20MPL%20ID%201.png",
    "/images/Banner%20MPL%20ID%202.png",
    "/images/Banner%20MPL%20ID%203.png",
    "/images/Banner%20MPL%20ID%204.png",
  ];

  useEffect(() => {
    const observedElement = indonesiaRef.current;

    if (!observedElement) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNavbarVisible(!entry.isIntersecting);
      },
      {
        threshold: 0,
      },
    );

    observer.observe(observedElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setCurrentBanner((previousBanner) => (previousBanner + 1) % banners.length);
    }, 5000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [currentBanner, banners.length]);

  useEffect(() => {
    let isMounted = true;

    async function loadStandings() {
      try {
        const response = await fetch("/api/standings", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Gagal memuat klasemen.");
        }

        const payload = (await response.json()) as {
          standings?: StandingItem[];
        };

        if (isMounted) {
          setStandings(payload.standings ?? []);
        }
      } catch {
        if (isMounted) {
          setStandings([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingStandings(false);
        }
      }
    }

    loadStandings();

    return () => {
      isMounted = false;
    };
  }, []);

  const showPreviousBanner = () => {
    setCurrentBanner((previousBanner) =>
      previousBanner === 0 ? banners.length - 1 : previousBanner - 1,
    );
  };

  const showNextBanner = () => {
    setCurrentBanner((previousBanner) => (previousBanner + 1) % banners.length);
  };

  return (
    <>
      <SiteNavbar isVisible={isNavbarVisible} />

      <main className="bg-white text-black">
        <section
          id="hero"
          className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16 sm:px-10"
        >
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
            <div className="relative w-full max-w-[270px] sm:max-w-[340px] lg:max-w-[430px]">
              <Image
                src="/images/Logo%20MPL%20ID.png"
                alt="Logo MPL Indonesia"
                width={512}
                height={512}
                priority
                className="h-auto w-full drop-shadow-[0_22px_40px_rgba(0,0,0,0.18)]"
              />
            </div>

            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="mt-8 max-w-4xl text-[2.05rem] font-black uppercase leading-[0.88] tracking-[0.07em] text-black [text-shadow:0_10px_28px_rgba(0,0,0,0.12)] sm:text-[3.4rem] lg:text-[4.95rem]"
            >
              <span className="inline-block bg-[#d10000] px-[0.3em] py-[0.16em] text-white">
                Mobile Legends
              </span>
              <span className="mt-3 block whitespace-nowrap bg-[#d10000] px-[0.3em] py-[0.16em] text-white">
                Professional League
              </span>
            </h1>

            <p
              id="indonesia"
              ref={indonesiaRef}
              style={{ fontFamily: "var(--font-accent)" }}
              className="mt-5 text-xs font-bold uppercase tracking-[0.58em] text-[#c20000] sm:text-sm"
            >
              Indonesia
            </p>
          </div>
        </section>

        <section id="featured-banners" className="bg-white">
          <div className="relative w-full overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentBanner * 100}%)` }}
            >
              {banners.map((bannerSrc, index) => (
                <div
                  key={bannerSrc}
                  className="relative w-full shrink-0"
                  aria-hidden={index !== currentBanner}
                >
                  <div className="relative aspect-[1024/576] w-full">
                    <Image
                      src={bannerSrc}
                      alt={`Banner MPL Indonesia ${index + 1}`}
                      fill
                      quality={100}
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={showPreviousBanner}
              aria-label="Lihat banner sebelumnya"
              className="absolute left-0 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center bg-black/52 text-white transition hover:bg-black/68 md:h-20 md:w-20"
            >
              <Icon icon={chevronLeft} className="text-[1.7rem]" />
            </button>

            <button
              type="button"
              onClick={showNextBanner}
              aria-label="Lihat banner berikutnya"
              className="absolute right-0 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center bg-black/52 text-white transition hover:bg-black/68 md:h-20 md:w-20"
            >
              <Icon icon={chevronRight} className="text-[1.7rem]" />
            </button>
          </div>
        </section>

        <section id="standings" className="border-t border-black/8 bg-[#f7f4f1] py-14">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="text-center">
              <h2
                style={{ fontFamily: "var(--font-display)" }}
                className="inline-flex items-center justify-center bg-[#d10000] px-6 py-2 text-[2.35rem] font-black uppercase tracking-[0.14em] text-white sm:text-[2.8rem]"
              >
                Peringkat
              </h2>
              <p
                style={{ fontFamily: "var(--font-accent)" }}
                className="mt-4 text-[0.85rem] font-bold uppercase tracking-[0.38em] text-[#d10000]"
              >
                Reguler Season
              </p>
            </div>

            <div className="mt-8 overflow-hidden border border-black/10 bg-white shadow-[0_18px_40px_rgba(0,0,0,0.04)]">
              <div className="hidden md:grid md:grid-cols-[0.42fr_1.8fr_0.95fr_1.05fr_0.9fr_1fr] md:bg-black">
                {["", "Team", "Match Point", "Match W-L", "Net Game Win", "Game W-L"].map((label) => (
                  <div
                    key={label}
                    className={`flex min-h-[3.3rem] items-center px-4 py-2 text-[0.9rem] font-black uppercase leading-tight tracking-[0.01em] ${
                      label === "Match Point" || label === "Net Game Win"
                        ? "text-[#ff1a1a]"
                        : "text-white"
                    } ${
                      label === "" ? "justify-center" : label === "Team" ? "" : "justify-center text-center"
                    }`}
                  >
                    {label}
                  </div>
                ))}
              </div>

              {isLoadingStandings ? (
                <div className="px-6 py-10 text-sm text-black/48">
                  Memuat data klasemen...
                </div>
              ) : null}

              {!isLoadingStandings && standings.length === 0 ? (
                <div className="px-6 py-10 text-sm text-black/48">
                  Belum ada data klasemen. Tambahkan tim dari halaman admin
                  supaya tabel ini terisi.
                </div>
              ) : null}

              {!isLoadingStandings && standings.length > 0 ? (
                <>
                  <div className="hidden md:block">
                    {standings.map((team) => (
                      <div
                        key={team.id}
                        className="grid grid-cols-[0.42fr_1.8fr_0.95fr_1.05fr_0.9fr_1fr] items-center border-b border-[#cfd5db] bg-[#f3f3f3] last:border-b-0"
                      >
                        <div className="px-2 py-1">
                          <span className="inline-flex h-[2.45rem] w-[2.1rem] items-center justify-center border-[3px] border-black bg-black text-[1.55rem] font-black leading-[0.9] text-white">
                            {team.rank}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-3">
                          <div className="flex h-10 w-10 items-center justify-center overflow-hidden">
                            {team.logoUrl ? (
                              <img
                                src={team.logoUrl}
                                alt={team.teamName}
                                className="h-full w-full object-contain"
                                loading="lazy"
                              />
                            ) : (
                              <span className="text-xs font-black uppercase text-[#d10000]">
                                {team.teamName.slice(0, 3)}
                              </span>
                            )}
                          </div>
                          <span className="text-[1.05rem] font-black uppercase tracking-[0.01em] text-[#0b1d39]">
                            {team.teamName}
                          </span>
                        </div>
                        <div className="px-4 py-3 text-center text-[1.05rem] font-black text-[#ff1a1a]">
                          {team.matchPoints}
                        </div>
                        <div className="px-4 py-3 text-center text-[1.05rem] font-black text-[#0b1d39]">
                          {team.matchWins}-{team.matchLosses}
                        </div>
                        <div className="px-4 py-3 text-center text-[1.05rem] font-black text-[#ff1a1a]">
                          {team.netGameWin}
                        </div>
                        <div className="px-4 py-3 text-center text-[1.05rem] font-black text-[#0b1d39]">
                          {team.gameWins}-{team.gameLosses}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4 p-4 md:hidden">
                    {standings.map((team) => (
                      <article
                        key={`mobile-${team.id}`}
                        className="border border-black/10 bg-[#fffaf8] px-4 py-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden bg-white">
                              {team.logoUrl ? (
                                <img
                                  src={team.logoUrl}
                                  alt={team.teamName}
                                  className="h-full w-full object-contain"
                                  loading="lazy"
                                />
                              ) : (
                                <span className="text-xs font-black uppercase text-[#d10000]">
                                  {team.teamName.slice(0, 3)}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="inline-flex h-9 min-w-[3.2rem] items-center justify-center border border-black/12 bg-[#f4f1ed] px-3 text-xs font-semibold uppercase tracking-[0.22em] text-black">
                                {team.rank}
                              </p>
                              <p className="mt-2 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-black/42">
                                Rank {team.rank}
                              </p>
                              <h3 className="mt-1 text-sm font-semibold text-black">
                                {team.teamName}
                              </h3>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#d10000]">
                              Point
                            </p>
                            <p className="mt-1 text-lg font-black text-[#d10000]">
                              {team.matchPoints}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-black/38">
                              Match
                            </p>
                            <p className="mt-1 text-black/72">
                              {team.matchWins}-{team.matchLosses}
                            </p>
                          </div>
                          <div>
                            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#d10000]">
                              Net Game
                            </p>
                            <p className="mt-1 font-semibold text-[#d10000]">
                              {team.netGameWin}
                            </p>
                          </div>
                          <div>
                            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-black/38">
                              Game
                            </p>
                            <p className="mt-1 text-black/72">
                              {team.gameWins}-{team.gameLosses}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </section>

        <section
          id="runway"
          className="relative min-h-[900vh] border-t border-black/8 bg-white"
        >
           <div
             aria-hidden="true"
             className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-black/6"
           />

          <div className="sticky top-0 flex min-h-screen items-center justify-center px-6">
            <div className="rounded-[2rem] border border-black/8 bg-white/92 px-8 py-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.05)] backdrop-blur">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.48em] text-black/35">
                MPL Indonesia
              </p>

              <h2
                style={{ fontFamily: "var(--font-display)" }}
                className="mt-4 text-3xl font-semibold uppercase tracking-[0.18em] text-black sm:text-5xl"
              >
                Scroll Runway
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-black/45 sm:text-base">
                Halaman ini sengaja dipanjangkan sampai sekitar 1000vh dulu,
                jadi flow hero dan navbar-nya sudah kebentuk sambil kamu lanjut
                isi section-section berikutnya.
              </p>
            </div>
          </div>
        </section>

         </main>
       </>
     );
 }
