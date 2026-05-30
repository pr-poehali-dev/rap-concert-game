import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { createRoom, joinRoom, startRoom, getRoom } from '@/lib/battleApi';

interface Artist {
  id: string; name: string; emoji: string; genre: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  bpm: number; color: string; tracks: string[]; locked: boolean;
}

interface Props {
  onNavigate: (page: string) => void;
  onBattleStart: (roomId: string, artist: Artist, isHost: boolean) => void;
  playerName: string;
  playerId: string;
  selectedArtist: Artist | null;
}

type LobbyState = 'choose' | 'creating' | 'waiting' | 'joining' | 'ready';

export default function BattleLobby({ onNavigate, onBattleStart, playerName, playerId, selectedArtist }: Props) {
  const [state, setState] = useState<LobbyState>('choose');
  const [roomId, setRoomId] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [roomData, setRoomData] = useState<{ status: string; players: Record<string, { name: string }> } | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [battleArtist, setBattleArtist] = useState<Artist | null>(selectedArtist);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Polling комнаты
  useEffect(() => {
    if (!roomId || (state !== 'waiting' && state !== 'ready')) return;
    pollRef.current = setInterval(async () => {
      const data = await getRoom(roomId);
      if (data.error) return;
      setRoomData(data);
      if (data.status === 'ready' && state === 'waiting') setState('ready');
      if (data.status === 'playing') {
        clearInterval(pollRef.current!);
        onBattleStart(roomId, battleArtist!, isHost);
      }
    }, 1500);
    return () => clearInterval(pollRef.current!);
  }, [roomId, state]);

  const handleCreate = async () => {
    if (!battleArtist) { setError('Сначала выбери артиста в разделе "Играть"'); return; }
    setState('creating');
    setError('');
    const res = await createRoom(playerId, playerName, battleArtist);
    if (res.error) { setError(res.error); setState('choose'); return; }
    setRoomId(res.room_id);
    setIsHost(true);
    setState('waiting');
  };

  const handleJoin = async () => {
    const code = joinCode.trim().toUpperCase();
    if (!code || code.length < 4) { setError('Введи код комнаты'); return; }
    setState('joining');
    setError('');
    const res = await joinRoom(playerId, playerName, code);
    if (res.error) { setError(res.error); setState('choose'); return; }
    // Строим artist из данных сервера
    const art: Artist = {
      id: res.artist.id, name: res.artist.name, emoji: '🎤',
      genre: 'Батл', difficulty: 'hard',
      bpm: res.artist.bpm, color: res.artist.color,
      tracks: [], locked: false,
    };
    setBattleArtist(art);
    setRoomId(code);
    setIsHost(false);
    setState('ready');
  };

  const handleStart = async () => {
    await startRoom(playerId, playerName, roomId);
    onBattleStart(roomId, battleArtist!, true);
  };

  const guestCount = roomData ? Object.keys(roomData.players || {}).length : (state === 'waiting' ? 1 : 0);
  const guestName = roomData
    ? Object.entries(roomData.players)
        .find(([pid]) => pid !== playerId)?.[1]?.name
    : null;
  void guestCount;

  return (
    <div className="relative z-10 min-h-screen px-4 py-8 flex flex-col">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8 animate-slide-down">
        <button
          onClick={() => onNavigate('menu')}
          className="w-10 h-10 rap-card flex items-center justify-center"
        >
          <Icon name="ArrowLeft" size={18} style={{ color: '#FFD700' }} />
        </button>
        <div>
          <h2 className="font-oswald font-bold text-3xl tracking-widest" style={{ color: '#FF006E' }}>
            ОНЛАЙН БАТЛ
          </h2>
          <p className="font-rubik text-rap-muted text-xs tracking-wider">Реальный соперник • Счёт + Здоровье</p>
        </div>
        <div className="ml-auto">
          <div
            className="w-3 h-3 rounded-full animate-pulse-neon"
            style={{ background: '#39FF14', boxShadow: '0 0 8px #39FF14' }}
          />
        </div>
      </div>

      {/* CHOOSE */}
      {state === 'choose' && (
        <div className="flex-1 flex flex-col gap-4 animate-fade-scale">
          {/* Artist preview */}
          {battleArtist ? (
            <div className="rap-card p-4 mb-2" style={{ border: `1px solid ${battleArtist.color}44` }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{battleArtist.emoji}</span>
                <div>
                  <div className="font-oswald font-bold text-base" style={{ color: battleArtist.color }}>
                    {battleArtist.name}
                  </div>
                  <div className="font-rubik text-xs text-rap-muted">{battleArtist.bpm} BPM</div>
                </div>
                <button
                  onClick={() => onNavigate('select')}
                  className="ml-auto font-rubik text-xs text-rap-muted underline underline-offset-2"
                >
                  сменить
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('select')}
              className="rap-card p-4 flex items-center gap-3 border-dashed"
              style={{ border: '1px dashed rgba(255,215,0,0.3)' }}
            >
              <Icon name="Music" size={20} style={{ color: '#FFD700' }} />
              <span className="font-rubik text-rap-muted text-sm">Выбери артиста перед батлом</span>
              <Icon name="ChevronRight" size={16} className="ml-auto" style={{ color: '#FFD700' }} />
            </button>
          )}

          {/* CREATE */}
          <button
            onClick={handleCreate}
            className="w-full btn-neon py-5 rounded-xl font-oswald font-bold text-xl tracking-widest relative overflow-hidden"
            style={{ background: '#FF006E', color: '#fff', boxShadow: '0 0 30px #FF006E44' }}
          >
            <div className="flex items-center justify-center gap-3">
              <Icon name="Plus" size={22} style={{ color: '#fff' }} />
              СОЗДАТЬ КОМНАТУ
            </div>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'var(--rap-border)' }} />
            <span className="font-rubik text-xs text-rap-muted">или</span>
            <div className="flex-1 h-px" style={{ background: 'var(--rap-border)' }} />
          </div>

          {/* JOIN */}
          <div className="rap-card p-4" style={{ border: '1px solid rgba(0,255,255,0.2)' }}>
            <p className="font-oswald font-semibold text-sm tracking-widest text-rap-muted mb-3">ВОЙТИ ПО КОДУ</p>
            <div className="flex gap-2">
              <input
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleJoin()}
                placeholder="XXXXXX"
                maxLength={6}
                className="flex-1 bg-transparent border rounded-lg px-4 py-3 font-oswald font-bold text-xl tracking-[0.4em] text-center outline-none"
                style={{ borderColor: 'rgba(0,255,255,0.3)', color: '#00FFFF', background: 'rgba(0,255,255,0.05)' }}
              />
              <button
                onClick={handleJoin}
                className="btn-neon px-5 rounded-lg font-oswald font-bold tracking-wider"
                style={{ background: '#00FFFF', color: '#000' }}
              >
                ВОЙТИ
              </button>
            </div>
          </div>

          {error && (
            <div className="rap-card px-4 py-3 text-center" style={{ border: '1px solid #FF006E44', background: '#FF006E11' }}>
              <p className="font-rubik text-sm" style={{ color: '#FF006E' }}>{error}</p>
            </div>
          )}
        </div>
      )}

      {/* WAITING (хост ждёт) */}
      {(state === 'waiting' || state === 'ready') && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 animate-fade-scale">
          <div className="text-center">
            <div
              className="font-oswald font-black text-7xl tracking-[0.3em] mb-2"
              style={{ color: '#FFD700', textShadow: '0 0 30px #FFD70066' }}
            >
              {roomId}
            </div>
            <p className="font-rubik text-rap-muted text-sm">Поделись кодом с соперником</p>
          </div>

          {/* Players */}
          <div className="w-full max-w-xs space-y-3">
            <div className="rap-card px-4 py-3 flex items-center gap-3" style={{ border: '1px solid rgba(57,255,20,0.3)' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: '#39FF14' }} />
              <span className="font-rubik font-medium text-rap-text flex-1">{playerName}</span>
              <span className="font-oswald text-xs" style={{ color: '#39FF14' }}>ХОЗ</span>
            </div>
            <div
              className="rap-card px-4 py-3 flex items-center gap-3"
              style={{ border: state === 'ready' ? '1px solid rgba(0,255,255,0.3)' : '1px dashed rgba(255,255,255,0.1)' }}
            >
              {state === 'ready' ? (
                <>
                  <div className="w-2 h-2 rounded-full" style={{ background: '#00FFFF' }} />
                  <span className="font-rubik font-medium text-rap-text flex-1">{guestName || 'Соперник'}</span>
                  <span className="font-oswald text-xs" style={{ color: '#00FFFF' }}>ГОТОВ</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full animate-pulse-neon" style={{ background: 'var(--rap-muted)' }} />
                  <span className="font-rubik text-rap-muted flex-1">Ожидание соперника...</span>
                </>
              )}
            </div>
          </div>

          {battleArtist && (
            <div className="rap-card px-4 py-3 flex items-center gap-3 w-full max-w-xs" style={{ border: `1px solid ${battleArtist.color}33` }}>
              <span className="text-lg">{battleArtist.emoji}</span>
              <div>
                <div className="font-oswald font-semibold text-sm" style={{ color: battleArtist.color }}>{battleArtist.name}</div>
                <div className="font-rubik text-xs text-rap-muted">{battleArtist.bpm} BPM</div>
              </div>
            </div>
          )}

          {state === 'ready' && isHost && (
            <button
              onClick={handleStart}
              className="w-full max-w-xs btn-neon py-4 rounded-xl font-oswald font-black text-xl tracking-widest animate-beat"
              style={{ background: '#FF006E', color: '#fff', boxShadow: '0 0 30px #FF006E66' }}
            >
              ⚔️ НАЧАТЬ БАТЛ
            </button>
          )}

          {state === 'ready' && !isHost && (
            <div className="font-rubik text-rap-muted text-sm animate-pulse-neon">
              Ожидаем хоста...
            </div>
          )}

          {state === 'waiting' && (
            <button
              onClick={() => { setState('choose'); setRoomId(''); }}
              className="font-rubik text-rap-muted text-sm underline underline-offset-4"
            >
              Отменить
            </button>
          )}
        </div>
      )}

      {/* JOINING */}
      {state === 'joining' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="font-oswald font-bold text-2xl text-rap-muted animate-pulse-neon">Подключение...</div>
          </div>
        </div>
      )}

      {/* CREATING */}
      {state === 'creating' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="font-oswald font-bold text-2xl text-rap-muted animate-pulse-neon">Создаём комнату...</div>
          </div>
        </div>
      )}
    </div>
  );
}