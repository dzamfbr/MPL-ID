"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  clearAdminSessionCookie,
  createAdminSessionCookie,
  readAdminSession,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import { removeTeamStanding, saveTeamStanding } from "@/lib/standings";

export type AdminLoginState = {
  error: string | null;
};

export async function loginAdmin(
  _: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const password = String(formData.get("password") ?? "").trim();

  if (!password) {
    return {
      error: "Password admin wajib diisi.",
    };
  }

  try {
    const adminAccount = await verifyAdminPassword(password);

    if (!adminAccount) {
      return {
        error: "Password admin tidak cocok.",
      };
    }

    await createAdminSessionCookie(adminAccount);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Gagal memproses login admin.",
    };
  }

  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSessionCookie();
  redirect("/admin/login");
}

function toNonNegativeNumber(value: FormDataEntryValue | null) {
  const parsedValue = Number(value ?? 0);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return Math.floor(parsedValue);
}

async function requireAdminSession() {
  const adminSession = await readAdminSession();

  if (!adminSession) {
    redirect("/admin/login");
  }

  return adminSession;
}

export async function saveStandingTeam(formData: FormData) {
  await requireAdminSession();

  const teamName = String(formData.get("teamName") ?? "").trim();

  if (!teamName) {
    throw new Error("Nama tim wajib diisi.");
  }

  const idValue = String(formData.get("id") ?? "").trim();

  await saveTeamStanding({
    id: idValue ? Number(idValue) : undefined,
    teamName,
    logoUrl: String(formData.get("logoUrl") ?? "").trim(),
    matchPoints: toNonNegativeNumber(formData.get("matchWins")),
    matchWins: toNonNegativeNumber(formData.get("matchWins")),
    matchLosses: toNonNegativeNumber(formData.get("matchLosses")),
    gameWins: toNonNegativeNumber(formData.get("gameWins")),
    gameLosses: toNonNegativeNumber(formData.get("gameLosses")),
    isActive: String(formData.get("isActive") ?? "on") === "on",
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteStandingTeam(formData: FormData) {
  await requireAdminSession();

  const id = Number(formData.get("id") ?? 0);

  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("ID tim tidak valid.");
  }

  await removeTeamStanding(id);

  revalidatePath("/");
  revalidatePath("/admin");
}
