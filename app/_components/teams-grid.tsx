import Image from "next/image";
import Link from "next/link";

import { teams } from "@/app/_components/teams-data";

export function TeamsGrid() {
  return (
    <div className="grid grid-cols-3 gap-x-3 gap-y-10 sm:gap-x-4 sm:gap-y-12 lg:gap-x-6 lg:gap-y-16">
      {teams.map((team) => (
        <Link
          key={team.name}
          href={`/tim/${team.slug}`}
          className="group mx-auto flex w-full max-w-[16rem] flex-col overflow-visible transition-transform duration-200 hover:-translate-y-1"
        >
          <div className="bg-[#7d0000] px-2 py-2 text-center shadow-[0_8px_20px_rgba(0,0,0,0.14)] sm:px-3">
            <span
              style={{ fontFamily: "var(--font-accent)" }}
              className="text-[0.72rem] font-black uppercase tracking-[0.05em] text-white sm:text-base lg:text-xl"
            >
              {team.code}
            </span>
          </div>
          <div className="relative flex min-h-[11.5rem] items-center justify-center bg-white px-2 py-4 shadow-[0_10px_28px_rgba(0,0,0,0.16)] sm:min-h-[13rem] sm:px-3 lg:min-h-[17rem] lg:px-6 lg:py-7">
            <Image
              src={team.logo}
              alt={team.name}
              width={180}
              height={180}
              className="h-auto max-h-[3.6rem] w-auto max-w-[4rem] object-contain transition-transform duration-200 group-hover:scale-[1.03] sm:max-h-[4.8rem] sm:max-w-[5.2rem] lg:max-h-[7.8rem] lg:max-w-[8.5rem]"
            />
            <div className="absolute -bottom-7 left-1/2 h-0 w-0 -translate-x-1/2 border-l-[3.2rem] border-r-[3.2rem] border-t-[1.8rem] border-l-transparent border-r-transparent border-t-white sm:-bottom-8 sm:border-l-[4rem] sm:border-r-[4rem] sm:border-t-[2rem] lg:-bottom-10 lg:border-l-[5rem] lg:border-r-[5rem] lg:border-t-[2.6rem]" />
            <div className="absolute bottom-0 left-[18%] h-0 w-0 border-l-[1rem] border-r-[1rem] border-t-[0.8rem] border-l-transparent border-r-transparent border-t-[#ececec] sm:border-l-[1.2rem] sm:border-r-[1.2rem] lg:border-l-[1.5rem] lg:border-r-[1.5rem] lg:border-t-[1rem]" />
            <div className="absolute bottom-0 right-[18%] h-0 w-0 border-l-[1rem] border-r-[1rem] border-t-[0.8rem] border-l-transparent border-r-transparent border-t-[#ececec] sm:border-l-[1.2rem] sm:border-r-[1.2rem] lg:border-l-[1.5rem] lg:border-r-[1.5rem] lg:border-t-[1rem]" />
            <div
              className="absolute inset-x-0 top-0 h-[2px] opacity-70"
              style={{ backgroundColor: team.accent }}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
