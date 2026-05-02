CREATE TABLE IF NOT EXISTS public.team_standings (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  team_name VARCHAR(120) NOT NULL UNIQUE,
  logo_url TEXT NOT NULL DEFAULT '',
  match_points INTEGER NOT NULL DEFAULT 0,
  match_wins INTEGER NOT NULL DEFAULT 0,
  match_losses INTEGER NOT NULL DEFAULT 0,
  game_wins INTEGER NOT NULL DEFAULT 0,
  game_losses INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.team_standings (
  team_name,
  logo_url,
  match_points,
  match_wins,
  match_losses,
  game_wins,
  game_losses,
  is_active
)
VALUES
  ('RRQ HOSHI', '/images/Logo RRQ MPL.png', 0, 0, 0, 0, 0, TRUE),
  ('EVOS', '/images/Logo Evos MPL.png', 0, 0, 0, 0, 0, TRUE),
  ('ONIC', '/images/Logo Onic MPL.png', 0, 0, 0, 0, 0, TRUE),
  ('ALTER EGO', '/images/Logo Alter Ego MPL.png', 0, 0, 0, 0, 0, TRUE),
  ('NAVI', '/images/Logo Navi MPL.png', 0, 0, 0, 0, 0, TRUE),
  ('BIGETRON BY VIT', '/images/Logo Bigetron MPL.png', 0, 0, 0, 0, 0, TRUE),
  ('GEEK FAM', '/images/Logo Geek Fam MPL.png', 0, 0, 0, 0, 0, TRUE),
  ('DEWA UNITED', '/images/Logo Dewa MPL.png', 0, 0, 0, 0, 0, TRUE),
  ('TEAM LIQUID ID', '/images/Logo TLID MPL.png', 0, 0, 0, 0, 0, TRUE)
ON CONFLICT (team_name) DO NOTHING;

SELECT *
FROM public.team_standings
ORDER BY match_points DESC, (game_wins - game_losses) DESC, game_wins DESC, team_name ASC;
