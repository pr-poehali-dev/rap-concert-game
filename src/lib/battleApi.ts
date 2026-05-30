const BASE = 'https://functions.poehali.dev/d399c3d5-03fd-4527-b84b-bccf9828660a';

function headers(playerId: string, playerName: string) {
  return {
    'Content-Type': 'application/json',
    'X-Player-Id': playerId,
    'X-Player-Name': playerName,
  };
}

export async function createRoom(playerId: string, playerName: string, artist: object) {
  const r = await fetch(`${BASE}/create`, {
    method: 'POST',
    headers: headers(playerId, playerName),
    body: JSON.stringify({ artist }),
  });
  return r.json();
}

export async function joinRoom(playerId: string, playerName: string, roomId: string) {
  const r = await fetch(`${BASE}/join`, {
    method: 'POST',
    headers: headers(playerId, playerName),
    body: JSON.stringify({ room_id: roomId }),
  });
  return r.json();
}

export async function startRoom(playerId: string, playerName: string, roomId: string) {
  const r = await fetch(`${BASE}/start`, {
    method: 'POST',
    headers: headers(playerId, playerName),
    body: JSON.stringify({ room_id: roomId }),
  });
  return r.json();
}

export async function updatePlayer(playerId: string, playerName: string, data: {
  room_id: string; score: number; health: number; combo: number;
  max_combo: number; total_notes: number; hit_notes: number; alive: boolean;
}) {
  const r = await fetch(`${BASE}/update`, {
    method: 'PUT',
    headers: headers(playerId, playerName),
    body: JSON.stringify(data),
  });
  return r.json();
}

export async function finishRoom(playerId: string, playerName: string, roomId: string) {
  const r = await fetch(`${BASE}/finish`, {
    method: 'POST',
    headers: headers(playerId, playerName),
    body: JSON.stringify({ room_id: roomId }),
  });
  return r.json();
}

export async function getRoom(roomId: string) {
  const r = await fetch(`${BASE}/room?room_id=${roomId}`);
  return r.json();
}
