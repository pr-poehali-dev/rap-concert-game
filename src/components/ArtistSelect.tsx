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
  // ─── ЛЁГКИЕ ───────────────────────────────────────────────
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
    id: 'morgenshtern',
    name: 'MORGENSHTERN',
    emoji: '⭐',
    genre: 'Поп-рэп',
    difficulty: 'easy',
    bpm: 110,
    color: '#FFEE00',
    tracks: ['Cadillac', 'Vitaminka', 'Saudi Arabia'],
    locked: false,
  },
  {
    id: 'pharaoh',
    name: 'PHARAOH',
    emoji: '🐍',
    genre: 'Дрим-рэп',
    difficulty: 'medium',
    bpm: 138,
    color: '#FF6B35',
    tracks: ['Грязь', 'Дико, например', 'Crystal'],
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
    id: 'miyagi',
    name: 'Miyagi & Andy Panda',
    emoji: '🌴',
    genre: 'Хип-хоп',
    difficulty: 'medium',
    bpm: 132,
    color: '#00CED1',
    tracks: ['I Got Love', 'Рапапам', 'Minor'],
    locked: false,
  },
  {
    id: 'scryptonite',
    name: 'Скриптонит',
    emoji: '🎹',
    genre: 'Альт-рэп',
    difficulty: 'hard',
    bpm: 142,
    color: '#9B59B6',
    tracks: ['Дыши', 'Уйдём на рассвете', 'Уголовный кодекс'],
    locked: false,
  },
  {
    id: 'ic3peak',
    name: 'IC3PEAK',
    emoji: '🖤',
    genre: 'Хоррор-рэп',
    difficulty: 'hard',
    bpm: 150,
    color: '#E74C3C',
    tracks: ['Смерти больше нет', 'Ничто', 'Плак Плак'],
    locked: false,
  },
  {
    id: 'husky',
    name: 'Хаски',
    emoji: '🐺',
    genre: 'Рэп-панк',
    difficulty: 'hard',
    bpm: 155,
    color: '#E67E22',
    tracks: ['Пуля', 'Ай', 'Панелька'],
    locked: false,
  },

  // ─── ЕЩЁ ЛЁГКИЕ ────────────────────────────────────────────
  {
    id: 'jah',
    name: 'Jah Khalib',
    emoji: '🌙',
    genre: 'Хип-хоп',
    difficulty: 'easy',
    bpm: 108,
    color: '#7B68EE',
    tracks: ['Leila', 'Медина', 'Было бы лето'],
    locked: false,
  },
  {
    id: 'niletto',
    name: 'Niletto',
    emoji: '💫',
    genre: 'Поп-рэп',
    difficulty: 'easy',
    bpm: 112,
    color: '#FF69B4',
    tracks: ['Любимка', 'Видел', 'Долетай'],
    locked: false,
  },
  {
    id: 'markul',
    name: 'Markul',
    emoji: '🌑',
    genre: 'Эмо-рэп',
    difficulty: 'easy',
    bpm: 105,
    color: '#708090',
    tracks: ['Внутри', 'Пустой', 'Тихо'],
    locked: false,
  },
  {
    id: 'kizaru',
    name: 'Kizaru',
    emoji: '😴',
    genre: 'Лоу-фай рэп',
    difficulty: 'easy',
    bpm: 98,
    color: '#48D1CC',
    tracks: ['Hollywood', 'Реки', 'Монако'],
    locked: false,
  },
  {
    id: 'eldzhey',
    name: 'Элджей',
    emoji: '🌈',
    genre: 'Поп-рэп',
    difficulty: 'easy',
    bpm: 118,
    color: '#FF1493',
    tracks: ['Розовое вино', 'Минимал', 'Kia'],
    locked: false,
  },
  {
    id: 'babyface',
    name: 'Баста',
    emoji: '🎭',
    genre: 'Хип-хоп',
    difficulty: 'easy',
    bpm: 114,
    color: '#DAA520',
    tracks: ['Выхода нет', 'Сансара', 'Мама'],
    locked: false,
  },
  {
    id: 'garik',
    name: 'Гарик Харламов (рэп)',
    emoji: '😂',
    genre: 'Комик-рэп',
    difficulty: 'easy',
    bpm: 100,
    color: '#32CD32',
    tracks: ['Рэп батла', 'Смехорэп', 'Хайп'],
    locked: false,
  },
  {
    id: 'timatishow',
    name: 'Тимати',
    emoji: '🐯',
    genre: 'Хип-хоп',
    difficulty: 'easy',
    bpm: 116,
    color: '#FFD700',
    tracks: ['Лондон', 'Не сходи с ума', 'Мой лучший друг'],
    locked: false,
  },

  // ─── ЕЩЁ СРЕДНИЕ ────────────────────────────────────────────
  {
    id: 'tvboy',
    name: 'T-Fest',
    emoji: '🌊',
    genre: 'Хип-хоп',
    difficulty: 'medium',
    bpm: 128,
    color: '#20B2AA',
    tracks: ['Простой', 'Кофе', 'Экстаз'],
    locked: false,
  },
  {
    id: 'drozd',
    name: 'Дрозд (Ант)',
    emoji: '🦅',
    genre: 'Классический рэп',
    difficulty: 'medium',
    bpm: 126,
    color: '#CD853F',
    tracks: ['25-й кадр', 'Дом', 'Моя игра'],
    locked: false,
  },
  {
    id: 'guf',
    name: 'Гуф',
    emoji: '☁️',
    genre: 'Хип-хоп',
    difficulty: 'medium',
    bpm: 122,
    color: '#87CEEB',
    tracks: ['Я куплю тебе дом', 'Экспедиция', 'Небеса'],
    locked: false,
  },
  {
    id: 'lizer',
    name: 'Lizer',
    emoji: '🔱',
    genre: 'Трэп',
    difficulty: 'medium',
    bpm: 135,
    color: '#8A2BE2',
    tracks: ['Грустная', 'Фея', 'Фантастика'],
    locked: false,
  },
  {
    id: 'cream_soda',
    name: 'Cream Soda',
    emoji: '🍦',
    genre: 'Поп-рэп',
    difficulty: 'medium',
    bpm: 124,
    color: '#FF7F50',
    tracks: ['Плачь', 'Я иду', 'Невозможно'],
    locked: false,
  },
  {
    id: 'feduk',
    name: 'Feduk',
    emoji: '🎲',
    genre: 'Поп-рэп',
    difficulty: 'medium',
    bpm: 120,
    color: '#40E0D0',
    tracks: ['Розовое вино', 'Хлопья', 'Нет проблем'],
    locked: false,
  },
  {
    id: 'allj',
    name: 'Allj (Элджей)',
    emoji: '🌀',
    genre: 'Трэп',
    difficulty: 'medium',
    bpm: 133,
    color: '#DA70D6',
    tracks: ['Минимал', 'Эдема нет', 'Горький'],
    locked: false,
  },
  {
    id: 'basta',
    name: 'Нэйт57',
    emoji: '🔐',
    genre: 'Андерграунд',
    difficulty: 'medium',
    bpm: 130,
    color: '#556B2F',
    tracks: ['Кирпич', 'Пробки', 'Эфир'],
    locked: false,
  },
  {
    id: 'bh',
    name: 'Big Baby Tape',
    emoji: '📼',
    genre: 'Трэп',
    difficulty: 'medium',
    bpm: 137,
    color: '#FF4500',
    tracks: ['Gimme The Loot', 'KARI', 'Drip'],
    locked: false,
  },
  {
    id: 'mayot',
    name: 'Mayot',
    emoji: '🌿',
    genre: 'Трэп',
    difficulty: 'medium',
    bpm: 129,
    color: '#3CB371',
    tracks: ['ТОПЧИК', 'Снова', 'Мечты'],
    locked: false,
  },
  {
    id: 'instasamka',
    name: 'Instasamka',
    emoji: '💅',
    genre: 'Поп-рэп',
    difficulty: 'medium',
    bpm: 125,
    color: '#FF6EB4',
    tracks: ['За деньги да', 'Поорём', 'GTG'],
    locked: false,
  },
  {
    id: 'yanix',
    name: 'Yanix',
    emoji: '🌲',
    genre: 'Хип-хоп',
    difficulty: 'medium',
    bpm: 131,
    color: '#228B22',
    tracks: ['Реп про рэп', 'Зелёный', 'Летим'],
    locked: false,
  },

  // ─── ЕЩЁ СЛОЖНЫЕ ────────────────────────────────────────────
  {
    id: 'dizaster',
    name: 'Dizaster',
    emoji: '💥',
    genre: 'Баттл-рэп',
    difficulty: 'hard',
    bpm: 160,
    color: '#FF3300',
    tracks: ['Battle Rap Vol.1', 'Chaos', 'No Mercy'],
    locked: false,
  },
  {
    id: 'dollar',
    name: 'ATL (Баттл)',
    emoji: '⚔️',
    genre: 'Баттл-рэп',
    difficulty: 'hard',
    bpm: 158,
    color: '#B22222',
    tracks: ['Слова убивают', 'Финал', 'Раунд'],
    locked: false,
  },
  {
    id: 'sbpch',
    name: 'СБПЧ',
    emoji: '🌐',
    genre: 'Артхаус-рэп',
    difficulty: 'hard',
    bpm: 148,
    color: '#1E90FF',
    tracks: ['Голос', 'Вечер', 'Отчаяние'],
    locked: false,
  },
  {
    id: 'gnoyniy',
    name: 'Гнойный',
    emoji: '🗡️',
    genre: 'Баттл-рэп',
    difficulty: 'hard',
    bpm: 162,
    color: '#8B0000',
    tracks: ['Эльдорадо', 'Мой рэп', 'Дисс'],
    locked: false,
  },
  {
    id: 'slovetsky',
    name: 'Словетский',
    emoji: '📖',
    genre: 'Олд-скул',
    difficulty: 'hard',
    bpm: 153,
    color: '#B8860B',
    tracks: ['Чистый лист', 'Слова', 'Ритм'],
    locked: false,
  },
  {
    id: 'witt_lowry',
    name: 'Стереотип',
    emoji: '🎭',
    genre: 'Лирический рэп',
    difficulty: 'hard',
    bpm: 147,
    color: '#6A5ACD',
    tracks: ['Образ', 'Игра слов', 'Поток'],
    locked: false,
  },
  {
    id: 'drago',
    name: 'Drago',
    emoji: '🐉',
    genre: 'Хардкор-рэп',
    difficulty: 'hard',
    bpm: 165,
    color: '#DC143C',
    tracks: ['Дракон', 'Огонь', 'Пепел'],
    locked: false,
  },
  {
    id: 'porchy',
    name: 'Porchy',
    emoji: '🌑',
    genre: 'Дарк-трэп',
    difficulty: 'hard',
    bpm: 152,
    color: '#4B0082',
    tracks: ['Мрак', 'Ночь', 'Тени'],
    locked: false,
  },

  // ─── ЛЕГЕНДАРНЫЕ ─────────────────────────────────────────────
  {
    id: 'tupac_ru',
    name: 'Legenda 2Pac RU',
    emoji: '✊',
    genre: 'Легенда',
    difficulty: 'legendary',
    bpm: 175,
    color: '#FFD700',
    tracks: ['All Eyez', 'Смысл', 'Бессмертный'],
    locked: true,
  },
  {
    id: 'legendary',
    name: '???',
    emoji: '👑',
    genre: 'Легенда',
    difficulty: 'legendary',
    bpm: 185,
    color: '#BF5FFF',
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