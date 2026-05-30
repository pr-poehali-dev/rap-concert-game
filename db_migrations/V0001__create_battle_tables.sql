
CREATE TABLE IF NOT EXISTS t_p27856411_rap_concert_game.battle_rooms (
  id          TEXT PRIMARY KEY,
  host_id     TEXT NOT NULL,
  guest_id    TEXT,
  artist_id   TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  artist_color TEXT NOT NULL,
  bpm         INT  NOT NULL,
  status      TEXT NOT NULL DEFAULT 'waiting',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p27856411_rap_concert_game.battle_players (
  room_id     TEXT NOT NULL,
  player_id   TEXT NOT NULL,
  player_name TEXT NOT NULL DEFAULT 'Игрок',
  score       INT  NOT NULL DEFAULT 0,
  health      INT  NOT NULL DEFAULT 100,
  combo       INT  NOT NULL DEFAULT 0,
  max_combo   INT  NOT NULL DEFAULT 0,
  accuracy    INT  NOT NULL DEFAULT 100,
  total_notes INT  NOT NULL DEFAULT 0,
  hit_notes   INT  NOT NULL DEFAULT 0,
  alive       BOOL NOT NULL DEFAULT TRUE,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (room_id, player_id)
);
