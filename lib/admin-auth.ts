import { createHmac, timingSafeEqual } from "node:crypto";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";

import { queryPostgres } from "@/lib/postgres";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export const ADMIN_SESSION_COOKIE = "mplid_admin_session";
export const ADMIN_USERNAME = "adminmplid";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

type AdminAccountRow = {
  username: string;
  display_name: string | null;
  password_hash: string;
};

export type AdminSession = {
  username: string;
  displayName: string;
  expiresAt: number;
};

function getSessionSecret() {
  const secret =
    process.env.ADMIN_SESSION_SECRET ?? process.env.AUTH_SECRET ?? "";

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET belum diatur.");
  }

  return secret;
}

function signValue(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function compareSignedValue(value: string, signature: string) {
  const expectedSignature = signValue(value);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
}

export async function getAdminAccount() {
  if (process.env.DATABASE_URL) {
    const rows = await queryPostgres<AdminAccountRow>(
      `SELECT username, display_name, password_hash
       FROM public.admin_users
       WHERE username = $1 AND is_active = TRUE
       LIMIT 1`,
      [ADMIN_USERNAME],
    );

    return rows[0] ?? null;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("admin_users")
    .select("username, display_name, password_hash")
    .eq("username", ADMIN_USERNAME)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle<AdminAccountRow>();

  if (error) {
    throw new Error(error.message);
  }

  return data ?? null;
}

export async function verifyAdminPassword(password: string) {
  const adminAccount = await getAdminAccount();

  if (!adminAccount) {
    return null;
  }

  const isPasswordMatch = await compare(password, adminAccount.password_hash);

  if (!isPasswordMatch) {
    return null;
  }

  return {
    username: adminAccount.username,
    displayName: adminAccount.display_name ?? "Admin MPL ID",
  };
}

export async function createAdminSessionCookie(session: {
  username: string;
  displayName: string;
}) {
  const expiresAt = Date.now() + SESSION_DURATION_SECONDS * 1000;
  const payload = Buffer.from(
    JSON.stringify({
      username: session.username,
      displayName: session.displayName,
      expiresAt,
    }),
  ).toString("base64url");
  const signature = signValue(payload);
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, `${payload}.${signature}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();

  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function readAdminSession() {
  const cookieStore = await cookies();
  const rawSession = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!rawSession) {
    return null;
  }

  const [payload, signature] = rawSession.split(".");

  if (!payload || !signature) {
    return null;
  }

  try {
    if (!compareSignedValue(payload, signature)) {
      return null;
    }

    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as AdminSession;

    if (session.expiresAt < Date.now()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}
