import { createClient } from "@supabase/supabase-js";

declare global {
  var __mplIdSupabaseAdmin:
    | ReturnType<typeof createClient>
    | undefined;
}

function getSupabaseUrl() {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL belum diatur.");
  }

  return supabaseUrl;
}

function getSupabaseServiceRoleKey() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY belum diatur.");
  }

  return serviceRoleKey;
}

export function getSupabaseAdmin() {
  if (!global.__mplIdSupabaseAdmin) {
    global.__mplIdSupabaseAdmin = createClient(
      getSupabaseUrl(),
      getSupabaseServiceRoleKey(),
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }

  return global.__mplIdSupabaseAdmin;
}
