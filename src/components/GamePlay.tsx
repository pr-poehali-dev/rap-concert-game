import { useState, useEffect, useCallback, useRef } from 'react';
import Icon from '@/components/ui/icon';
import ConcertBg from '@/components/ConcertBg';

interface Artist {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bpm: number;
  tracks: string[];
  difficulty: string;
}

interface Note {
  id: number;
  lane: number;
  y: number;
  hit: boolean;
  missed: boolean;
}

interface Props {
  artist: Artist;
  onNavigate: (page: string) => void;
  onGameEnd: (score: number, combo: number, accuracy: number) => void;
}

const LANE_KEYS = ['s', 'd', 'f', ' ', 'j', 'k'];
const LANE_COLORS = ['#00FFFF', '#FFD700', '#FF006E', '#39FF14', '#BF5FFF', '#FF8800'];
const LANE_LABELS = ['S', 'D', 'F', '⎵', 'J', 'K'];

const HIT_ZONE_Y = 82; // percent from top
const NOTE_SPEED_BASE = 1.8;
const NOTE_HIT_WINDOW = 8; // percent range

export default function GamePlay({ artist, onNavigate, onGameEnd }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [health, setHealth] = useState(100);
  const [totalHits, setTotalHits] = useState(0);
  const [totalNotes, setTotalNotes] = useState(0);
  const [laneActive, setLaneActive] = useState<boolean[]>(Array(6).fill(false));
  const [hitFeedback, setHitFeedback] = useState<{ text: string; color: string } | null>(null);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [gameTime, setGameTime] = useState(0);

  const noteIdRef = useRef(0);
  const bpmInterval = 60000 / artist.bpm;

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
      let pts = 0;
      let feedback = '';
      let col = '';

      if (dist < 2) { pts = 300; feedback = 'PERFECT!'; col = '#FFD700'; }
      else if (dist < 4) { pts = 200; feedback = 'GREAT!'; col = '#00FFFF'; }
      else if (dist < 7) { pts = 100; feedback = 'GOOD'; col = '#39FF14'; }
      else { pts = 50; feedback = 'OK'; col = '#BF5FFF'; }

      setScore(s => s + pts * (1 + Math.floor(combo / 10)));
      setCombo(c => {
        const nc = c + 1;
        setMaxCombo(m => Math.max(m, nc));
        return nc;
      });
      setTotalHits(h => h + 1);
      showFeedback(feedback, col);

      return prev.map(n => n.id === target.id ? { ...n, hit: true } : n);
    });
  }, [combo, showFeedback]);

  // Keyboard handler
  useEffect(() => {
    if (!started || finished) return;
    const down = (e: KeyboardEvent) => {
      const idx = LANE_KEYS.indexOf(e.key.toLowerCase() === ' ' ? ' ' : e.key.toLowerCase());
      if (e.key === ' ') {
        e.preventDefault();
        const lIdx = LANE_KEYS.indexOf(' ');
        setLaneActive(prev => { const a = [...prev]; a[lIdx] = true; return a; });
        handleHit(lIdx);
        return;
      }
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
  }, [started, finished, handleHit]);

  // Note movement
  useEffect(() => {
    if (!started || finished) return;
    const speed = NOTE_SPEED_BASE * (1 + (artist.bpm - 100) / 200);
    const interval = setInterval(() => {
      setNotes(prev => {
        return prev
          .map(n => {
            if (n.hit) return n;
            const newY = n.y + speed;
            if (newY > HIT_ZONE_Y + NOTE_HIT_WINDOW && !n.missed) {
              setCombo(0);
              setHealth(h => Math.max(0, h - 8));
              return { ...n, y: newY, missed: true };
            }
            return { ...n, y: newY };
          })
          .filter(n => n.y < 110);
      });
    }, 16);
    return () => clearInterval(interval);
  }, [started, finished, artist.bpm]);

  // Note spawner
  useEffect(() => {
    if (!started || finished) return;
    const interval = setInterval(spawnNote, bpmInterval * 0.6);
    return () => clearInterval(interval);
  }, [started, finished, bpmInterval, spawnNote]);

  // Game timer
  useEffect(() => {
    if (!started || finished) return;
    const interval = setInterval(() => {
      setGameTime(t => {
        if (t >= 60) {
          setFinished(true);
          return t;
        }
        return t + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [started, finished]);

  // Health check
  useEffect(() => {
    if (health <= 0 && !finished) {
      setFinished(true);
    }
  }, [health, finished]);

  // Game end
  useEffect(() => {
    if (finished) {
      const accuracy = totalNotes > 0 ? Math.round((totalHits / totalNotes) * 100) : 0;
      setTimeout(() => onGameEnd(score, maxCombo, accuracy), 500);
    }
  }, [finished, score, maxCombo, totalHits, totalNotes, onGameEnd]);

  const accuracy = totalNotes > 0 ? Math.round((totalHits / totalNotes) * 100) : 100;

  if (!started) {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <ConcertBg color={artist.color} bpm={artist.bpm} combo={0} active={false} />
        <div className="relative z-10 text-center animate-fade-scale">
          <div className="text-6xl mb-4">{artist.emoji}</div>
          <h2
            className="font-oswald font-black text-5xl tracking-widest mb-2"
            style={{ color: artist.color, textShadow: `0 0 30px ${artist.color}` }}
          >
            {artist.name}
          </h2>
          <p className="font-rubik text-rap-muted mb-2">{artist.bpm} BPM</p>
          <div className="rap-card p-4 mb-8 max-w-xs mx-auto">
            <p className="font-rubik text-rap-muted text-sm mb-3">Управление:</p>
            <div className="flex gap-2 justify-center">
              {LANE_LABELS.map((k, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rap-card flex items-center justify-center font-oswald font-bold text-sm"
                  style={{ color: LANE_COLORS[i], border: `1px solid ${LANE_COLORS[i]}44` }}
                >
                  {k}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setStarted(true)}
            className="btn-neon px-12 py-4 rounded-xl font-oswald font-black text-xl tracking-widest"
            style={{
              background: artist.color,
              color: '#000',
              boxShadow: `0 0 30px ${artist.color}66`,
            }}
          >
            🎤 НАЧАТЬ
          </button>
          <div className="mt-4">
            <button
              onClick={() => onNavigate('select')}
              className="font-rubik text-rap-muted text-sm underline underline-offset-4"
            >
              Назад к выбору
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen flex flex-col overflow-hidden select-none">
      <ConcertBg color={artist.color} bpm={artist.bpm} combo={combo} active={started} />
      {/* TOP HUD */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ background: 'linear-gradient(to bottom, rgba(5,5,8,0.85) 0%, transparent 100%)' }}
      >
        <div>
          <div className="font-oswald font-black text-2xl" style={{ color: artist.color }}>
            {score.toLocaleString()}
          </div>
          <div className="font-rubik text-xs text-rap-muted">СЧЁТ</div>
        </div>

        <div className="text-center">
          <div className="font-oswald font-black text-xl text-white">
            {artist.emoji} {artist.name}
          </div>
          <div className="health-bar w-32 mx-auto mt-1">
            <div
              className="health-fill"
              style={{
                width: `${health}%`,
                background: health > 50
                  ? `linear-gradient(to right, #39FF14, #00cc00)`
                  : health > 25
                  ? `linear-gradient(to right, #FFD700, #ff8800)`
                  : `linear-gradient(to right, #FF006E, #cc0044)`,
              }}
            />
          </div>
        </div>

        <div className="text-right">
          <div
            className="font-oswald font-black text-2xl"
            style={{ color: combo > 20 ? '#FFD700' : combo > 10 ? '#00FFFF' : 'white' }}
          >
            x{combo}
          </div>
          <div className="font-rubik text-xs text-rap-muted">COMBO</div>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="relative z-10 flex items-center justify-between px-4 mb-2 flex-shrink-0">
        <span className="font-rubik text-xs text-rap-muted">Точность: <span className="text-white">{accuracy}%</span></span>
        <span className="font-rubik text-xs text-rap-muted">
          {Math.max(0, 60 - gameTime)}с
        </span>
        <span className="font-rubik text-xs text-rap-muted">Макс. combo: <span className="text-white">{maxCombo}</span></span>
      </div>

      {/* LANES */}
      <div className="relative z-10 flex flex-1 gap-1 px-2 pb-4 overflow-hidden">
        {LANE_COLORS.map((color, laneIdx) => (
          <div
            key={laneIdx}
            className="flex-1 note-lane relative rounded-lg"
            style={{
              background: laneActive[laneIdx]
                ? `${color}15`
                : 'rgba(255,255,255,0.02)',
              border: `1px solid ${laneActive[laneIdx] ? color : 'rgba(255,255,255,0.05)'}`,
              transition: 'all 0.08s',
              boxShadow: laneActive[laneIdx] ? `0 0 12px ${color}44` : 'none',
            }}
          >
            {/* Lane stripe */}
            <div
              className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px opacity-10"
              style={{ background: color }}
            />

            {/* Notes */}
            {notes.filter(n => n.lane === laneIdx && !n.hit).map(note => (
              <div
                key={note.id}
                className="note-block"
                style={{
                  top: `${note.y}%`,
                  height: 32,
                  background: note.missed
                    ? 'rgba(255,255,255,0.1)'
                    : `linear-gradient(180deg, ${color}, ${color}aa)`,
                  border: note.missed ? '1px solid rgba(255,255,255,0.1)' : `1px solid ${color}`,
                  boxShadow: note.missed ? 'none' : `0 0 10px ${color}88`,
                  borderRadius: 6,
                  opacity: note.missed ? 0.3 : 1,
                }}
              />
            ))}

            {/* Hit zone */}
            <div
              className="hit-zone absolute left-1 right-1"
              style={{
                top: `${HIT_ZONE_Y}%`,
                height: 36,
                borderRadius: 8,
                background: laneActive[laneIdx]
                  ? `${color}44`
                  : `${color}11`,
                border: `2px solid ${color}${laneActive[laneIdx] ? 'cc' : '44'}`,
                boxShadow: laneActive[laneIdx] ? `0 0 16px ${color}88` : 'none',
                transition: 'all 0.08s',
              }}
            >
              <div
                className="absolute inset-0 flex items-center justify-center font-oswald font-bold text-xs"
                style={{ color: `${color}${laneActive[laneIdx] ? 'ff' : '66'}` }}
              >
                {LANE_LABELS[laneIdx]}
              </div>
            </div>
          </div>
        ))}

        {/* HIT FEEDBACK */}
        {hitFeedback && (
          <div
            className="absolute left-1/2 -translate-x-1/2 font-oswald font-black text-3xl tracking-widest pointer-events-none z-20"
            style={{
              top: '60%',
              color: hitFeedback.color,
              textShadow: `0 0 20px ${hitFeedback.color}`,
              animation: 'fade-in-scale 0.1s ease-out',
            }}
          >
            {hitFeedback.text}
          </div>
        )}
      </div>

      {/* MOBILE BUTTONS */}
      <div className="relative z-10 flex gap-1 px-2 pb-4 flex-shrink-0 md:hidden">
        {LANE_COLORS.map((color, i) => (
          <button
            key={i}
            className="flex-1 h-14 rounded-lg font-oswald font-bold text-sm active:scale-95 transition-transform"
            style={{
              background: `${color}22`,
              border: `2px solid ${color}44`,
              color: color,
            }}
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