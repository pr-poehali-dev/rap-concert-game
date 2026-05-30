import { useState, useEffect, useCallback, useRef } from 'react';
import ConcertBg from '@/components/ConcertBg';
import { updatePlayer, finishRoom, getRoom } from '@/lib/battleApi';
import Icon from '@/components/ui/icon';

interface Artist {
  id: string; name: string; emoji: string; color: string; bpm: number;
  tracks: string[]; difficulty: string;
}

interface Props {
  roomId: string;
  artist: Artist;
  isHost: boolean;
  playerId: string;
  playerName: string;
  onNavigate: (page: string) => void;
  onBattleEnd: (myScore: number, opponentScore: number, won: boolean) => void;
}

interface Note { id: number; lane: number; y: number; hit: boolean; missed: boolean; }

const LANE_KEYS = ['s', 'd', 'f', ' ', 'j', 'k'];
const LANE_COLORS = ['#00FFFF', '#FFD700', '#FF006E', '#39FF14', '#BF5FFF', '#FF8800'];
const LANE_LABELS = ['S', 'D', 'F', '⎵', 'J', 'K'];
const HIT_ZONE_Y = 82;
const NOTE_SPEED_BASE = 1.8;
const NOTE_HIT_WINDOW = 8;
const GAME_DURATION = 60;

export default function BattleGame({ roomId, artist, isHost, playerId, playerName, onNavigate, onBattleEnd }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [health, setHealth] = useState(100);
  const [totalHits, setTotalHits] = useState(0);
  const [totalNotes, setTotalNotes] = useState(0);
  const [laneActive, setLaneActive] = useState<boolean[]>(Array(6).fill(false));
  const [hitFeedback, setHitFeedback] = useState<{ text: string; color: string } | null>(null);
  const [gameTime, setGameTime] = useState(0);
  const [finished, setFinished] = useState(false);

  // Opponent state
  const [oppName, setOppName] = useState('Соперник');
  const [oppScore, setOppScore] = useState(0);
  const [oppHealth, setOppHealth] = useState(100);
  const [oppCombo, setOppCombo] = useState(0);
  const [oppAlive, setOppAlive] = useState(true);
  const [connected, setConnected] = useState(false);

  const noteIdRef = useRef(0);
  const scoreRef = useRef(0);
  const healthRef = useRef(100);
  const comboRef = useRef(0);
  const maxComboRef = useRef(0);
  const totalHitsRef = useRef(0);
  const totalNotesRef = useRef(0);
  const finishedRef = useRef(false);

  const bpmInterval = 60000 / artist.bpm;

  // keep refs in sync
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { healthRef.current = health; }, [health]);
  useEffect(() => { comboRef.current = combo; }, [combo]);
  useEffect(() => { maxComboRef.current = maxCombo; }, [maxCombo]);
  useEffect(() => { totalHitsRef.current = totalHits; }, [totalHits]);
  useEffect(() => { totalNotesRef.current = totalNotes; }, [totalNotes]);

  // Spawn notes
  const spawnNote = useCallback(() => {
    const lane = Math.floor(Math.random() * 6);
    noteIdRef.current += 1;
    setNotes(prev => [...prev, { id: noteIdRef.current, lane, y: -5, hit: false, missed: false }]);
    setTotalNotes(prev => prev + 1);
  }, []);

  const showFeedback = useCallback((text: string, color: string) => {
    setHitFeedback({ text, color });
    setTimeout(() => setHitFeedback(null), 400);
  }, []);

  const handleHit = useCallback((lane: number) => {
    setNotes(prev => {
      const target = prev.find(n => !n.hit && !n.missed && n.lane === lane && Math.abs(n.y - HIT_ZONE_Y) < NOTE_HIT_WINDOW);
      if (!target) return prev;
      const dist = Math.abs(target.y - HIT_ZONE_Y);
      let pts = 0; let feedback = ''; let col = '';
      if (dist < 2) { pts = 300; feedback = 'PERFECT!'; col = '#FFD700'; }
      else if (dist < 4) { pts = 200; feedback = 'GREAT!'; col = '#00FFFF'; }
      else if (dist < 7) { pts = 100; feedback = 'GOOD'; col = '#39FF14'; }
      else { pts = 50; feedback = 'OK'; col = '#BF5FFF'; }
      setScore(s => s + pts * (1 + Math.floor(comboRef.current / 10)));
      setCombo(c => { const nc = c + 1; setMaxCombo(m => Math.max(m, nc)); return nc; });
      setTotalHits(h => h + 1);
      showFeedback(feedback, col);
      return prev.map(n => n.id === target.id ? { ...n, hit: true } : n);
    });
  }, [showFeedback]);

  // Keyboard
  useEffect(() => {
    if (finished) return;
    const down = (e: KeyboardEvent) => {
      if (e.key === ' ') { e.preventDefault(); }
      const key = e.key === ' ' ? ' ' : e.key.toLowerCase();
      const idx = LANE_KEYS.indexOf(key);
      if (idx === -1) return;
      setLaneActive(prev => { const a = [...prev]; a[idx] = true; return a; });
      handleHit(idx);
    };
    const up = (e: KeyboardEvent) => {
      const key = e.key === ' ' ? ' ' : e.key.toLowerCase();
      const idx = LANE_KEYS.indexOf(key);
      if (idx === -1) return;
      setLaneActive(prev => { const a = [...prev]; a[idx] = false; return a; });
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [finished, handleHit]);

  // Note movement
  useEffect(() => {
    if (finished) return;
    const speed = NOTE_SPEED_BASE * (1 + (artist.bpm - 100) / 200);
    const iv = setInterval(() => {
      setNotes(prev => prev.map(n => {
        if (n.hit) return n;
        const newY = n.y + speed;
        if (newY > HIT_ZONE_Y + NOTE_HIT_WINDOW && !n.missed) {
          setCombo(0);
          setHealth(h => Math.max(0, h - 8));
          return { ...n, y: newY, missed: true };
        }
        return { ...n, y: newY };
      }).filter(n => n.y < 110));
    }, 16);
    return () => clearInterval(iv);
  }, [finished, artist.bpm]);

  // Note spawner
  useEffect(() => {
    if (finished) return;
    const iv = setInterval(spawnNote, bpmInterval * 0.6);
    return () => clearInterval(iv);
  }, [finished, bpmInterval, spawnNote]);

  // Game timer
  useEffect(() => {
    if (finished) return;
    const iv = setInterval(() => {
      setGameTime(t => {
        if (t + 1 >= GAME_DURATION) {
          setFinished(true);
          finishedRef.current = true;
          return GAME_DURATION;
        }
        return t + 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [finished]);

  // Health death
  useEffect(() => {
    if (health <= 0 && !finished) { setFinished(true); finishedRef.current = true; }
  }, [health, finished]);

  // Push state to server every 1.5s
  useEffect(() => {
    if (finished) return;
    const iv = setInterval(() => {
      updatePlayer(playerId, playerName, {
        room_id: roomId,
        score: scoreRef.current,
        health: healthRef.current,
        combo: comboRef.current,
        max_combo: maxComboRef.current,
        total_notes: totalNotesRef.current,
        hit_notes: totalHitsRef.current,
        alive: healthRef.current > 0,
      });
    }, 1500);
    return () => clearInterval(iv);
  }, [finished, playerId, playerName, roomId]);

  // Poll opponent state every 1.5s
  useEffect(() => {
    const iv = setInterval(async () => {
      const data = await getRoom(roomId);
      if (data.error) return;
      setConnected(true);
      const players = data.players as Record<string, { name: string; score: number; health: number; combo: number; alive: boolean }>;
      const oppEntry = Object.entries(players).find(([pid]) => pid !== playerId);
      if (oppEntry) {
        const [, opp] = oppEntry;
        setOppName(opp.name);
        setOppScore(opp.score);
        setOppHealth(opp.health);
        setOppCombo(opp.combo);
        setOppAlive(opp.alive);
      }
      if (data.status === 'finished' && !finishedRef.current) {
        setFinished(true);
        finishedRef.current = true;
      }
    }, 1500);
    return () => clearInterval(iv);
  }, [playerId, roomId]);

  // On finish → send final state + determine winner
  useEffect(() => {
    if (!finished) return;
    const myFinalScore = scoreRef.current;
    const myFinalHealth = healthRef.current;
    updatePlayer(playerId, playerName, {
      room_id: roomId, score: myFinalScore, health: myFinalHealth,
      combo: comboRef.current, max_combo: maxComboRef.current,
      total_notes: totalNotesRef.current, hit_notes: totalHitsRef.current,
      alive: myFinalHealth > 0,
    });
    finishRoom(playerId, playerName, roomId);
    // Small delay so opponent state syncs
    setTimeout(() => {
      // Win = more score, tiebreak = health
      const won = myFinalScore > oppScore || (myFinalScore === oppScore && myFinalHealth > oppHealth);
      onBattleEnd(myFinalScore, oppScore, won);
    }, 1200);
  }, [finished]);

  const accuracy = totalNotes > 0 ? Math.round((totalHits / totalNotes) * 100) : 100;
  const timeLeft = Math.max(0, GAME_DURATION - gameTime);
  const isHype = combo >= 20;

  return (
    <div className="relative h-screen flex flex-col overflow-hidden select-none">
      <ConcertBg color={artist.color} bpm={artist.bpm} combo={combo} active={!finished} />

      {/* ── VS HEADER ─────────────────────────────────────────── */}
      <div
        className="relative z-10 flex-shrink-0 px-3 pt-2 pb-1"
        style={{ background: 'linear-gradient(to bottom, rgba(5,5,8,0.95) 0%, rgba(5,5,8,0.6) 100%)' }}
      >
        <div className="flex items-center gap-2">
          {/* ME */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#39FF14' }} />
              <span className="font-oswald font-bold text-sm truncate" style={{ color: '#39FF14' }}>{playerName}</span>
            </div>
            <div className="font-oswald font-black text-lg leading-none" style={{ color: artist.color }}>
              {score.toLocaleString()}
            </div>
            <div className="health-bar mt-1" style={{ height: 5 }}>
              <div className="health-fill" style={{
                width: `${health}%`,
                background: health > 50 ? '#39FF14' : health > 25 ? '#FFD700' : '#FF006E',
                transition: 'width 0.3s',
              }} />
            </div>
          </div>

          {/* CENTER */}
          <div className="flex flex-col items-center flex-shrink-0 px-2">
            <div className="font-oswald font-black text-base" style={{ color: '#FF006E' }}>VS</div>
            <div
              className="font-oswald font-bold text-xl tabular-nums"
              style={{ color: timeLeft <= 10 ? '#FF006E' : '#FFD700', minWidth: 32, textAlign: 'center' }}
            >
              {timeLeft}
            </div>
            {isHype && (
              <div className="font-oswald text-xs animate-pulse-neon" style={{ color: '#FFD700' }}>HYPE!</div>
            )}
          </div>

          {/* OPPONENT */}
          <div className="flex-1 min-w-0 text-right">
            <div className="flex items-center gap-1.5 justify-end mb-1">
              <span className="font-oswald font-bold text-sm truncate" style={{ color: oppAlive ? '#00FFFF' : '#FF006E' }}>
                {oppName}
              </span>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: oppAlive ? (connected ? '#00FFFF' : '#FFD700') : '#FF006E' }} />
            </div>
            <div className="font-oswald font-black text-lg leading-none" style={{ color: '#00FFFF' }}>
              {oppScore.toLocaleString()}
            </div>
            <div className="health-bar mt-1" style={{ height: 5 }}>
              <div className="health-fill" style={{
                width: `${oppHealth}%`,
                background: oppHealth > 50 ? '#39FF14' : oppHealth > 25 ? '#FFD700' : '#FF006E',
                transition: 'width 0.3s',
              }} />
            </div>
          </div>
        </div>

        {/* Mini stats row */}
        <div className="flex justify-between mt-1 px-1">
          <span className="font-rubik text-xs text-rap-muted">x{combo} combo</span>
          <span className="font-rubik text-xs text-rap-muted">{accuracy}% точность</span>
          <span className="font-rubik text-xs text-rap-muted">opp x{oppCombo}</span>
        </div>
      </div>

      {/* ── LANES ─────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-1 gap-1 px-2 pb-2 overflow-hidden">
        {LANE_COLORS.map((color, laneIdx) => (
          <div
            key={laneIdx}
            className="flex-1 note-lane relative rounded-lg"
            style={{
              background: laneActive[laneIdx] ? `${color}15` : 'rgba(255,255,255,0.02)',
              border: `1px solid ${laneActive[laneIdx] ? color : 'rgba(255,255,255,0.05)'}`,
              boxShadow: laneActive[laneIdx] ? `0 0 12px ${color}44` : 'none',
              transition: 'all 0.08s',
            }}
          >
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px opacity-10" style={{ background: color }} />
            {notes.filter(n => n.lane === laneIdx && !n.hit).map(note => (
              <div key={note.id} className="note-block" style={{
                top: `${note.y}%`, height: 30,
                background: note.missed ? 'rgba(255,255,255,0.1)' : `linear-gradient(180deg, ${color}, ${color}aa)`,
                border: note.missed ? '1px solid rgba(255,255,255,0.1)' : `1px solid ${color}`,
                boxShadow: note.missed ? 'none' : `0 0 10px ${color}88`,
                opacity: note.missed ? 0.3 : 1,
                borderRadius: 6,
              }} />
            ))}
            <div
              className="absolute left-1 right-1"
              style={{
                top: `${HIT_ZONE_Y}%`, height: 34, borderRadius: 8,
                background: laneActive[laneIdx] ? `${color}44` : `${color}11`,
                border: `2px solid ${color}${laneActive[laneIdx] ? 'cc' : '44'}`,
                boxShadow: laneActive[laneIdx] ? `0 0 16px ${color}88` : 'none',
                transition: 'all 0.08s',
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center font-oswald font-bold text-xs"
                style={{ color: `${color}${laneActive[laneIdx] ? 'ff' : '66'}` }}>
                {LANE_LABELS[laneIdx]}
              </div>
            </div>
          </div>
        ))}

        {hitFeedback && (
          <div className="absolute left-1/2 -translate-x-1/2 font-oswald font-black text-3xl tracking-widest pointer-events-none z-20"
            style={{ top: '58%', color: hitFeedback.color, textShadow: `0 0 20px ${hitFeedback.color}`, animation: 'fade-in-scale 0.1s ease-out' }}>
            {hitFeedback.text}
          </div>
        )}

        {/* Opponent health death overlay */}
        {!oppAlive && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <div className="font-oswald font-black text-2xl tracking-widest animate-pulse-neon"
              style={{ color: '#39FF14', textShadow: '0 0 20px #39FF14' }}>
              СОПЕРНИК ПАЛ! 💀
            </div>
          </div>
        )}
      </div>

      {/* ── MOBILE BUTTONS ──────────────────────────────────────── */}
      <div className="relative z-10 flex gap-1 px-2 pb-3 flex-shrink-0 md:hidden">
        {LANE_COLORS.map((color, i) => (
          <button key={i}
            className="flex-1 h-12 rounded-lg font-oswald font-bold text-sm active:scale-95 transition-transform"
            style={{ background: `${color}22`, border: `2px solid ${color}44`, color }}
            onTouchStart={() => { setLaneActive(prev => { const a = [...prev]; a[i] = true; return a; }); handleHit(i); }}
            onTouchEnd={() => setLaneActive(prev => { const a = [...prev]; a[i] = false; return a; })}
          >
            {LANE_LABELS[i]}
          </button>
        ))}
      </div>
    </div>
  );
}
