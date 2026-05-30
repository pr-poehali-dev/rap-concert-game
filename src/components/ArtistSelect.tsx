import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface Artist {
  id: string;
  name: string;
  emoji: string;
  genre: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  bpm: number;
  color: string;
  tracks: string[];
  locked: boolean;
}

const ARTISTS: Artist[] = [
  {
    id: 'noize',
    name: 'Noize MC',
    emoji: '🎙️',
    genre: 'Рок-рэп',
    difficulty: 'easy',
    bpm: 120,
    color: '#00FFFF',
    tracks: ['Танцуй', 'Mercedes S666', 'Выдыхай'],
    locked: false,
  },
  {
    id: 'oxxxy',
    name: 'Oxxxymiron',
    emoji: '🧠',
    genre: 'Хип-хоп',
    difficulty: 'hard',
    bpm: 145,
    color: '#FF006E',
    tracks: ['Больше Бена', 'Где нас нет', 'Девочка Пиздец'],
    locked: false,
  },
  {
    id: 'face',
    name: 'FACE',
    emoji: '👁️',
    genre: 'Трэп',
    difficulty: 'medium',
    bpm: 130,
    color: '#BF5FFF',
    tracks: ['Юморист', 'БОДРЫЙ', 'Хрусталь'],
    locked: false,
  },
  {
    id: 'gone',
    name: 'gone.Fludd',
    emoji: '🌊',
    genre: 'Поп-рэп',
    difficulty: 'easy',
    bpm: 115,
    color: '#39FF14',
    tracks: ['ХАГИ ВАГИ', 'WINTER', 'Moloko'],
    locked: false,
  },
  {
    id: 'slava',
    name: 'SLAVA MARLOW',
    emoji: '🔥',
    genre: 'Хип-хоп',
    difficulty: 'medium',
    bpm: 140,
    color: '#FFD700',
    tracks: ['Снова я напиваюсь', 'Мне похуй', 'Pain'],
    locked: false,
  },
  {
    id: 'legendary',
    name: '???',
    emoji: '👑',
    genre: 'Легенда',
    difficulty: 'legendary',
    bpm: 180,
    color: '#FFD700',
    tracks: ['???', '???', '???'],
    locked: true,
  },
];

const DIFFICULTY_LABELS = {
  easy: { label: 'Лёгкий', color: '#39FF14' },
  medium: { label: 'Средний', color: '#FFD700' },
  hard: { label: 'Сложный', color: '#FF006E' },
  legendary: { label: 'Легенда', color: '#BF5FFF' },
};

const DIFFICULTIES = ['all', 'easy', 'medium', 'hard', 'legendary'];

interface Props {
  onNavigate: (page: string) => void;
  onSelectArtist: (artist: Artist) => void;
}

export default function ArtistSelect({ onNavigate, onSelectArtist }: Props) {
  const [selected, setSelected] = useState<Artist | null>(null);
  const [filter, setFilter] = useState('all');

  const filtered = ARTISTS.filter(a => filter === 'all' || a.difficulty === filter);

  return (
    <div className="relative z-10 min-h-screen px-4 py-8">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8 animate-slide-down">
        <button
          onClick={() => onNavigate('menu')}
          className="w-10 h-10 rap-card flex items-center justify-center hover:border-rap-gold transition-all"
        >
          <Icon name="ArrowLeft" size={18} style={{ color: '#FFD700' }} />
        </button>
        <div>
          <h2 className="font-oswald font-bold text-3xl tracking-widest" style={{ color: '#FFD700' }}>
            ВЫБОР ИСПОЛНИТЕЛЯ
          </h2>
          <p className="font-rubik text-rap-muted text-xs tracking-wider">Выбери своего рэпера и трек</p>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {DIFFICULTIES.map(d => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            className="flex-shrink-0 px-4 py-2 rounded-lg text-xs font-oswald font-semibold tracking-wider uppercase transition-all"
            style={{
              background: filter === d
                ? (d === 'all' ? '#FFD700' : DIFFICULTY_LABELS[d as keyof typeof DIFFICULTY_LABELS]?.color ?? '#FFD700')
                : 'var(--rap-card)',
              color: filter === d ? '#000' : 'var(--rap-muted)',
              border: `1px solid ${filter === d ? 'transparent' : 'var(--rap-border)'}`,
            }}
          >
            {d === 'all' ? 'Все' : DIFFICULTY_LABELS[d as keyof typeof DIFFICULTY_LABELS]?.label}
          </button>
        ))}
      </div>

      {/* ARTIST GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {filtered.map((artist, i) => (
          <button
            key={artist.id}
            onClick={() => !artist.locked && setSelected(artist)}
            className="rap-card p-4 text-left relative overflow-hidden transition-all"
            style={{
              animationDelay: `${i * 0.05}s`,
              animation: `fade-in-scale 0.3s ease-out ${i * 0.05}s both`,
              border: selected?.id === artist.id
                ? `1px solid ${artist.color}`
                : '1px solid var(--rap-border)',
              boxShadow: selected?.id === artist.id
                ? `0 0 20px ${artist.color}44`
                : 'none',
              opacity: artist.locked ? 0.5 : 1,
            }}
          >
            {artist.locked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                <Icon name="Lock" size={24} style={{ color: '#FFD700' }} />
              </div>
            )}

            {/* Accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: artist.color, boxShadow: `0 0 8px ${artist.color}` }}
            />

            <div className="text-3xl mb-2">{artist.emoji}</div>
            <div
              className="font-oswald font-bold text-base tracking-wider leading-tight"
              style={{ color: artist.color }}
            >
              {artist.name}
            </div>
            <div className="font-rubik text-xs text-rap-muted mt-1">{artist.genre}</div>

            <div className="flex items-center justify-between mt-3">
              <span
                className="text-xs font-oswald font-semibold px-2 py-0.5 rounded"
                style={{
                  background: `${DIFFICULTY_LABELS[artist.difficulty].color}22`,
                  color: DIFFICULTY_LABELS[artist.difficulty].color,
                  border: `1px solid ${DIFFICULTY_LABELS[artist.difficulty].color}44`,
                }}
              >
                {DIFFICULTY_LABELS[artist.difficulty].label}
              </span>
              <span className="font-rubik text-xs text-rap-muted">{artist.bpm} BPM</span>
            </div>
          </button>
        ))}
      </div>

      {/* SELECTED PANEL */}
      {selected && (
        <div
          className="rap-card p-4 mb-4 animate-fade-scale"
          style={{ border: `1px solid ${selected.color}44` }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{selected.emoji}</span>
            <div>
              <div className="font-oswald font-bold text-lg" style={{ color: selected.color }}>
                {selected.name}
              </div>
              <div className="font-rubik text-xs text-rap-muted">{selected.genre} • {selected.bpm} BPM</div>
            </div>
          </div>
          <div className="space-y-1 mb-4">
            {selected.tracks.map((t, i) => (
              <div key={i} className="flex items-center gap-2 font-rubik text-sm text-rap-text">
                <div className="w-1 h-1 rounded-full" style={{ background: selected.color }} />
                {t}
              </div>
            ))}
          </div>
          <button
            onClick={() => onSelectArtist(selected)}
            className="w-full btn-neon py-3 rounded-xl font-oswald font-bold text-lg tracking-widest"
            style={{
              background: selected.color,
              color: '#000',
              boxShadow: `0 0 20px ${selected.color}66`,
            }}
          >
            🎤 НАЧАТЬ КОНЦЕРТ
          </button>
        </div>
      )}
    </div>
  );
}
