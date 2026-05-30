"""
Онлайн батл для RAP HERO — комнаты, состояние игроков, результат.
"""
import json
import os
import random
import string
import psycopg2

SCHEMA = "t_p27856411_rap_concert_game"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Player-Id, X-Player-Name",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def resp(status: int, body: dict) -> dict:
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(body, default=str)}


def rand_id(n=6):
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=n))


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    path   = event.get("path", "/")
    qs     = event.get("queryStringParameters") or {}
    hdrs   = {k.lower(): v for k, v in (event.get("headers") or {}).items()}
    player_id   = hdrs.get("x-player-id", "")
    player_name = hdrs.get("x-player-name", "Игрок")[:20]
    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    # ─── POST /create — создать комнату ──────────────────────────
    if method == "POST" and "/create" in path:
        if not player_id:
            return resp(400, {"error": "player_id required"})
        artist = body.get("artist", {})
        room_id = rand_id()
        conn = get_conn()
        cur = conn.cursor()
        # удалим старые waiting комнаты этого игрока
        cur.execute(f"DELETE FROM {SCHEMA}.battle_rooms WHERE host_id=%s AND status='waiting'", (player_id,))
        cur.execute(f"DELETE FROM {SCHEMA}.battle_players WHERE player_id=%s", (player_id,))
        cur.execute(
            f"INSERT INTO {SCHEMA}.battle_rooms(id,host_id,artist_id,artist_name,artist_color,bpm,status) VALUES(%s,%s,%s,%s,%s,%s,'waiting')",
            (room_id, player_id, artist.get("id","?"), artist.get("name","?"), artist.get("color","#FFD700"), int(artist.get("bpm",130)))
        )
        cur.execute(
            f"INSERT INTO {SCHEMA}.battle_players(room_id,player_id,player_name) VALUES(%s,%s,%s)",
            (room_id, player_id, player_name)
        )
        conn.commit()
        cur.close(); conn.close()
        return resp(200, {"room_id": room_id})

    # ─── POST /join — войти в комнату ────────────────────────────
    if method == "POST" and "/join" in path:
        room_id = (body.get("room_id") or "").strip().upper()
        if not player_id or not room_id:
            return resp(400, {"error": "player_id and room_id required"})
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id,host_id,guest_id,status,artist_id,artist_name,artist_color,bpm FROM {SCHEMA}.battle_rooms WHERE id=%s", (room_id,))
        row = cur.fetchone()
        if not row:
            cur.close(); conn.close()
            return resp(404, {"error": "Комната не найдена"})
        rid, host_id, guest_id, status, art_id, art_name, art_color, bpm = row
        if status != "waiting":
            cur.close(); conn.close()
            return resp(409, {"error": "Комната уже началась или закрыта"})
        if host_id == player_id:
            cur.close(); conn.close()
            return resp(409, {"error": "Ты уже в этой комнате"})
        # удалим старые записи гостя
        cur.execute(f"DELETE FROM {SCHEMA}.battle_players WHERE player_id=%s AND room_id!=%s", (player_id, room_id))
        cur.execute(
            f"UPDATE {SCHEMA}.battle_rooms SET guest_id=%s,status='ready',updated_at=NOW() WHERE id=%s",
            (player_id, room_id)
        )
        cur.execute(
            f"INSERT INTO {SCHEMA}.battle_players(room_id,player_id,player_name) VALUES(%s,%s,%s) ON CONFLICT(room_id,player_id) DO UPDATE SET player_name=%s",
            (room_id, player_id, player_name, player_name)
        )
        conn.commit()
        cur.close(); conn.close()
        return resp(200, {"room_id": room_id, "artist": {"id": art_id, "name": art_name, "color": art_color, "bpm": bpm}})

    # ─── POST /start — хост запускает игру ───────────────────────
    if method == "POST" and "/start" in path:
        room_id = body.get("room_id", "")
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT host_id,status FROM {SCHEMA}.battle_rooms WHERE id=%s", (room_id,))
        row = cur.fetchone()
        if not row or row[0] != player_id or row[1] != "ready":
            cur.close(); conn.close()
            return resp(403, {"error": "Нельзя начать"})
        cur.execute(f"UPDATE {SCHEMA}.battle_rooms SET status='playing',updated_at=NOW() WHERE id=%s", (room_id,))
        conn.commit()
        cur.close(); conn.close()
        return resp(200, {"started": True})

    # ─── PUT /update — обновить состояние игрока ─────────────────
    if method == "PUT" and "/update" in path:
        room_id = body.get("room_id", "")
        score   = int(body.get("score", 0))
        health  = int(body.get("health", 100))
        combo   = int(body.get("combo", 0))
        max_combo = int(body.get("max_combo", 0))
        total_notes = int(body.get("total_notes", 0))
        hit_notes   = int(body.get("hit_notes", 0))
        alive   = bool(body.get("alive", True))
        accuracy = round((hit_notes / total_notes * 100) if total_notes > 0 else 100)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"""UPDATE {SCHEMA}.battle_players
                SET score=%s,health=%s,combo=%s,max_combo=%s,accuracy=%s,
                    total_notes=%s,hit_notes=%s,alive=%s,updated_at=NOW()
                WHERE room_id=%s AND player_id=%s""",
            (score, health, combo, max_combo, accuracy, total_notes, hit_notes, alive, room_id, player_id)
        )
        # если оба умерли или время вышло — финиш
        if not alive:
            cur.execute(
                f"SELECT COUNT(*) FROM {SCHEMA}.battle_players WHERE room_id=%s AND alive=TRUE", (room_id,)
            )
            alive_count = cur.fetchone()[0]
            if alive_count == 0:
                cur.execute(f"UPDATE {SCHEMA}.battle_rooms SET status='finished',updated_at=NOW() WHERE id=%s", (room_id,))
        conn.commit()
        cur.close(); conn.close()
        return resp(200, {"ok": True})

    # ─── POST /finish — игрок закончил (время вышло) ─────────────
    if method == "POST" and "/finish" in path:
        room_id = body.get("room_id", "")
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.battle_players WHERE room_id=%s", (room_id,))
        total = cur.fetchone()[0]
        # помечаем живым но игра завершена
        cur.execute(
            f"UPDATE {SCHEMA}.battle_rooms SET status='finished',updated_at=NOW() WHERE id=%s AND status='playing'",
            (room_id,)
        )
        conn.commit()
        cur.close(); conn.close()
        return resp(200, {"ok": True})

    # ─── GET /room?room_id=XXX — состояние комнаты ───────────────
    if method == "GET" and "/room" in path:
        room_id = qs.get("room_id", "")
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id,host_id,guest_id,status,artist_id,artist_name,artist_color,bpm FROM {SCHEMA}.battle_rooms WHERE id=%s",
            (room_id,)
        )
        row = cur.fetchone()
        if not row:
            cur.close(); conn.close()
            return resp(404, {"error": "not found"})
        rid, host_id, guest_id, status, art_id, art_name, art_color, bpm = row
        cur.execute(
            f"SELECT player_id,player_name,score,health,combo,max_combo,accuracy,alive FROM {SCHEMA}.battle_players WHERE room_id=%s",
            (room_id,)
        )
        players = {}
        for pid, pname, sc, hp, cb, mcb, acc, alv in cur.fetchall():
            players[pid] = {"name": pname, "score": sc, "health": hp, "combo": cb, "max_combo": mcb, "accuracy": acc, "alive": alv}
        cur.close(); conn.close()
        return resp(200, {
            "room_id": rid, "host_id": host_id, "guest_id": guest_id,
            "status": status,
            "artist": {"id": art_id, "name": art_name, "color": art_color, "bpm": bpm},
            "players": players,
        })

    # ─── GET /health — ping ──────────────────────────────────────
    if method == "GET":
        return resp(200, {"status": "ok"})

    return resp(404, {"error": "not found"})