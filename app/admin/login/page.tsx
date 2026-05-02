import { Icon } from "@iconify/react";
import chevronLeft from "@iconify-icons/mdi/chevron-left";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/app/admin/login/login-form";
import { getAdminAccount, readAdminSession } from "@/lib/admin-auth";

export const metadata = {
  title: "Login Admin | Portofolio Dzamfbr - Web MPL ID",
};

export default async function AdminLoginPage() {
  const adminSession = await readAdminSession();
  const adminAccount = await getAdminAccount();

  if (adminSession) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-[#f6f0ee] px-6 py-10 text-black sm:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-stretch overflow-hidden border border-black/10 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
        <section className="hidden w-[46%] bg-[#d10000] p-10 text-white lg:flex lg:items-center lg:justify-center">
          <div className="flex items-center justify-center gap-5">
            <div className="relative w-full max-w-[210px]">
              <Image
                src="/images/Logo%20MPL%20ID.png"
                alt="Logo MPL Indonesia"
                width={280}
                height={280}
                className="h-auto w-full object-contain"
              />
            </div>

            <div className="relative w-full max-w-[115px]">
              <Image
                src="/images/We%20Own%20This.png"
                alt="We Own This"
                width={160}
                height={38}
                className="h-auto w-full object-contain brightness-0 invert"
              />
            </div>
          </div>
        </section>

        <section className="flex flex-1 items-center px-6 py-10 sm:px-10 lg:px-14">
          <div className="mx-auto w-full max-w-md">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-black/48 transition hover:text-[#d10000]"
            >
              <Icon icon={chevronLeft} className="text-sm" />
              Kembali ke halaman user
            </Link>

            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="mt-6 text-[2.4rem] font-black uppercase leading-[0.92] tracking-[0.12em] text-black"
            >
              Login Admin
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-7 text-black/55">
              Masukkan password admin untuk membuka dashboard.
            </p>

            <LoginForm username={adminAccount?.username ?? "adminmplid"} />
          </div>
        </section>
      </div>
    </main>
  );
}
