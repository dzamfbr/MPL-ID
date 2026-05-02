import { NextResponse } from "next/server";

import { getTeamStandings } from "@/lib/standings";

export async function GET() {
  try {
    const standings = await getTeamStandings();

    return NextResponse.json({ standings });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Gagal mengambil klasemen.",
      },
      { status: 500 },
    );
  }
}
