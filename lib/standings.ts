import type { QueryResultRow } from "pg";

import { queryPostgres } from "@/lib/postgres";
import { getSupabaseAdmin } from "@/lib/supabase-server";

type TeamStandingRow = QueryResultRow & {
  id: number;
  team_name: string;
  logo_url: string | null;
  match_points: number;
  match_wins: number;
  match_losses: number;
  game_wins: number;
  game_losses: number;
  is_active: boolean;
};

export type TeamStanding = {
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
  isActive: boolean;
};

type TeamStandingInput = {
  id?: number;
  teamName: string;
  logoUrl: string;
  matchPoints: number;
  matchWins: number;
  matchLosses: number;
  gameWins: number;
  gameLosses: number;
  isActive?: boolean;
};

function normalizeStanding(
  row: TeamStandingRow,
  rank: number,
): TeamStanding {
  return {
    id: row.id,
    rank,
    teamName: row.team_name,
    logoUrl: row.logo_url ?? "",
    matchPoints: row.match_points,
    matchWins: row.match_wins,
    matchLosses: row.match_losses,
    netGameWin: row.game_wins - row.game_losses,
    gameWins: row.game_wins,
    gameLosses: row.game_losses,
    isActive: row.is_active,
  };
}

function sortStandings(rows: TeamStandingRow[]) {
  return [...rows].sort((leftTeam, rightTeam) => {
    const pointDifference = rightTeam.match_points - leftTeam.match_points;

    if (pointDifference !== 0) {
      return pointDifference;
    }

    const netGameDifference =
      rightTeam.game_wins -
      rightTeam.game_losses -
      (leftTeam.game_wins - leftTeam.game_losses);

    if (netGameDifference !== 0) {
      return netGameDifference;
    }

    const gameWinDifference = rightTeam.game_wins - leftTeam.game_wins;

    if (gameWinDifference !== 0) {
      return gameWinDifference;
    }

    return leftTeam.team_name.localeCompare(rightTeam.team_name);
  });
}

function isMissingTeamStandingsTableError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.message.includes('relation "public.team_standings" does not exist') ||
    error.message.includes('relation "team_standings" does not exist')
  );
}

export async function getTeamStandings(options?: { includeInactive?: boolean }) {
  const includeInactive = options?.includeInactive ?? false;

  if (process.env.DATABASE_URL) {
    try {
      const rows = await queryPostgres<TeamStandingRow>(
        `SELECT id, team_name, logo_url, match_points, match_wins, match_losses,
                game_wins, game_losses, is_active
         FROM public.team_standings
         ${includeInactive ? "" : "WHERE is_active = TRUE"}`,
      );

      return sortStandings(rows).map((row, index) =>
        normalizeStanding(row, index + 1),
      );
    } catch (error) {
      if (isMissingTeamStandingsTableError(error)) {
        return [];
      }

      throw error;
    }
  }

  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("team_standings")
    .select(
      "id, team_name, logo_url, match_points, match_wins, match_losses, game_wins, game_losses, is_active",
    );

  if (!includeInactive) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return sortStandings((data ?? []) as TeamStandingRow[]).map((row, index) =>
    normalizeStanding(row, index + 1),
  );
}

export async function saveTeamStanding(input: TeamStandingInput) {
  const payload = {
    team_name: input.teamName,
    logo_url: input.logoUrl,
    match_points: input.matchPoints,
    match_wins: input.matchWins,
    match_losses: input.matchLosses,
    game_wins: input.gameWins,
    game_losses: input.gameLosses,
    is_active: input.isActive ?? true,
  };

  if (process.env.DATABASE_URL) {
    try {
      if (input.id) {
        await queryPostgres(
          `UPDATE public.team_standings
           SET team_name = $1,
               logo_url = $2,
               match_points = $3,
               match_wins = $4,
               match_losses = $5,
               game_wins = $6,
               game_losses = $7,
               is_active = $8,
               updated_at = NOW()
           WHERE id = $9`,
          [
            payload.team_name,
            payload.logo_url,
            payload.match_points,
            payload.match_wins,
            payload.match_losses,
            payload.game_wins,
            payload.game_losses,
            payload.is_active,
            input.id,
          ],
        );

        return;
      }

      await queryPostgres(
        `INSERT INTO public.team_standings
          (team_name, logo_url, match_points, match_wins, match_losses, game_wins, game_losses, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          payload.team_name,
          payload.logo_url,
          payload.match_points,
          payload.match_wins,
          payload.match_losses,
          payload.game_wins,
          payload.game_losses,
          payload.is_active,
        ],
      );
    } catch (error) {
      if (isMissingTeamStandingsTableError(error)) {
        throw new Error(
          "Tabel team_standings belum dibuat. Jalankan file sql/team-standings.sql di Supabase dulu.",
        );
      }

      throw error;
    }

    return;
  }

  const supabase = getSupabaseAdmin();
  const teamStandingsTable = supabase.from("team_standings") as any;
  const { error } = input.id
    ? await teamStandingsTable.update(payload).eq("id", input.id)
    : await teamStandingsTable.insert(payload);

  if (error) {
    throw new Error(error.message);
  }
}

export async function removeTeamStanding(id: number) {
  if (process.env.DATABASE_URL) {
    try {
      await queryPostgres(`DELETE FROM public.team_standings WHERE id = $1`, [id]);
    } catch (error) {
      if (isMissingTeamStandingsTableError(error)) {
        throw new Error(
          "Tabel team_standings belum dibuat. Jalankan file sql/team-standings.sql di Supabase dulu.",
        );
      }

      throw error;
    }

    return;
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("team_standings").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
