import Icon from '@/components/ui/icon';

interface Achievement {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  color: string;
  unlocked: boolean;
  condition: string;
}

interface Props {
  onNavigate: (page: string) => void;
  gamesPlayed: number;
  bestCombo: number;
  bestAccuracy: number;
  totalScore: number;
}

export default function Achievements({ onNavigate, gamesPlayed, bestCombo, bestAccuracy, totalScore }: Props) {
  const achievements: Achievement[] = [
    {
      id: 'first_game',
      title: 'Первый шаг',
      desc: 'Сыграй свою первую игру',
      emoji: '🎤',
      color: '#39FF14',
      unlocked: gamesPlayed >= 1,
      condition: 'Сыграть 1 игру',
    },
    {
      id: 'combo_10',
      title: 'В ритме',
      desc: 'Набери комбо x10',
      emoji: '🔥',
      color: '#FFD700',
      unlocked: bestCombo >= 10,
      condition: 'Комбо x10',
    },
    {
      id: 'combo_50',
      title: 'Нон-стоп',
      desc: 'Набери комбо x50',
      emoji: '⚡',
      color: '#00FFFF',
      unlocked: bestCombo >= 50,
      condition: 'Комбо x50',
    },
    {
      id: 'combo_100',
      title: 'Машина',
      desc: 'Набери комбо x100',
      emoji: '🤖',
      color: '#BF5FFF',
      unlocked: bestCombo >= 100,
      condition: 'Комбо x100',
    },
    {
      id: 'accuracy_90',
      title: 'Снайпер',
      desc: 'Точность 90%+ в одной игре',
      emoji: '🎯',
      color: '#FF006E',
      unlocked: bestAccuracy >= 90,
      condition: 'Точность 90%',
    },
    {
      id: 'accuracy_100',
      title: 'Идеал',
      desc: 'Точность 100% в одной игре',
      emoji: '💎',
      color: '#FFD700',
      unlocked: bestAccuracy >= 100,
      condition: 'Точность 100%',
    },
    {
      id: 'score_10k',
      title: 'Начинающий',
      desc: 'Набери 10,000 очков',
      emoji: '🌱',
      color: '#39FF14',
      unlocked: totalScore >= 10000,
      condition: '10,000 очков',
    },
    {
      id: 'score_50k',
      title: 'Середнячок',
      desc: 'Набери 50,000 очков суммарно',
      emoji: '🌟',
      color: '#00FFFF',
      unlocked: totalScore >= 50000,
      condition: '50,000 очков',
    },
    {
      id: 'score_100k',
      title: 'Звезда',
      desc: 'Набери 100,000 очков суммарно',
      emoji: '⭐',
      color: '#FFD700',
      unlocked: totalScore >= 100000,
      condition: '100,000 очков',
    },
    {
      id: 'games_5',
      title: 'Упорный',
      desc: 'Сыграй 5 игр',
      emoji: '💪',
      color: '#BF5FFF',
      unlocked: gamesPlayed >= 5,
      condition: '5 игр',
    },
    {
      id: 'games_20',
      title: 'Ветеран',
      desc: 'Сыграй 20 игр',
      emoji: '🎖️',
      color: '#FF006E',
      unlocked: gamesPlayed >= 20,
      condition: '20 игр',
    },
    {
      id: 'legend',
      title: 'ЛЕГЕНДА РЭПА',
      desc: 'Открой все достижения',
      emoji: '👑',
      color: '#FFD700',
      unlocked: false,
      condition: 'Все остальные достижения',
    },
  ];

  const unlocked = achievements.filter(a => a.unlocked).length;
  const total = achievements.length;
  const progress = Math.round((unlocked / total) * 100);

  return (
    <div className="relative z-10 min-h-screen px-4 py-8">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6 animate-slide-down">
        <button
          onClick={() => onNavigate('menu')}
          className="w-10 h-10 rap-card flex items-center justify-center"
        >
          <Icon name="ArrowLeft" size={18} style={{ color: '#FFD700' }} />
        </button>
        <div>
          <h2 className="font-oswald font-bold text-3xl tracking-widest" style={{ color: '#39FF14' }}>
            ДОСТИЖЕНИЯ
          </h2>
          <p className="font-rubik text-rap-muted text-xs tracking-wider">
            Открыто: {unlocked} / {total}
          </p>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="rap-card p-4 mb-6" style={{ border: '1px solid rgba(57,255,20,0.2)' }}>
        <div className="flex justify-between mb-2">
          <span className="font-oswald text-sm font-semibold text-rap-muted">ПРОГРЕСС</span>
          <span className="font-oswald text-sm font-bold" style={{ color: '#39FF14' }}>{progress}%</span>
        </div>
        <div className="health-bar">
          <div
            className="health-fill"
            style={{ width: `${progress}%`, background: 'linear-gradient(to right, #39FF14, #00cc00)' }}
          />
        </div>
      </div>

      {/* ACHIEVEMENTS GRID */}
      <div className="grid grid-cols-1 gap-3">
        {achievements.map((ach, i) => (
          <div
            key={ach.id}
            className="rap-card px-4 py-3 flex items-center gap-4"
            style={{
              border: ach.unlocked ? `1px solid ${ach.color}44` : '1px solid var(--rap-border)',
              background: ach.unlocked ? `${ach.color}08` : 'var(--rap-card)',
              opacity: ach.unlocked ? 1 : 0.5,
              animation: `slide-up 0.3s ease-out ${i * 0.03}s both`,
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 relative"
              style={{
                background: ach.unlocked ? `${ach.color}22` : 'rgba(255,255,255,0.05)',
                border: `1px solid ${ach.unlocked ? ach.color + '44' : 'rgba(255,255,255,0.05)'}`,
              }}
            >
              {ach.unlocked ? ach.emoji : '🔒'}
              {ach.unlocked && (
                <div
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: ach.color }}
                >
                  <Icon name="Check" size={10} style={{ color: '#000' }} />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div
                className="font-oswald font-semibold text-base"
                style={{ color: ach.unlocked ? ach.color : 'var(--rap-muted)' }}
              >
                {ach.title}
              </div>
              <div className="font-rubik text-xs text-rap-muted">{ach.desc}</div>
            </div>

            {!ach.unlocked && (
              <div
                className="flex-shrink-0 text-right font-rubik text-xs text-rap-muted px-3 py-1 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                {ach.condition}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
