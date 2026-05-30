import Icon from '@/components/ui/icon';

interface Props {
  onNavigate: (page: string) => void;
  playerName: string;
}

export default function MainMenu({ onNavigate, playerName }: Props) {
  const menuItems = [
    { label: 'Играть', icon: 'Play', page: 'select', color: '#FFD700', glow: 'box-glow-gold' },
    { label: 'Лидерборд', icon: 'Trophy', page: 'leaderboard', color: '#00FFFF', glow: 'box-glow-cyan' },
    { label: 'Профиль', icon: 'User', page: 'profile', color: '#FF006E', glow: 'box-glow-pink' },
    { label: 'Достижения', icon: 'Star', page: 'achievements', color: '#39FF14', glow: 'box-glow-green' },
  ];

  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
      {/* LOGO */}
      <div className="mb-16 text-center animate-slide-down">
        <div className="relative inline-block">
          <div
            className="absolute inset-0 blur-3xl opacity-20 rounded-full"
            style={{ background: 'radial-gradient(circle, #FFD700, #FF006E)' }}
          />
          <h1
            className="font-oswald font-black text-8xl md:text-9xl tracking-widest shimmer-text relative"
            style={{ lineHeight: 1 }}
          >
            RAP
          </h1>
          <h1
            className="font-oswald font-black text-8xl md:text-9xl tracking-widest relative"
            style={{ lineHeight: 1, color: '#FF006E', textShadow: '0 0 30px #FF006E, 0 0 60px #FF006E55' }}
          >
            HERO
          </h1>
        </div>
        <p className="font-rubik text-rap-muted text-sm tracking-[0.4em] mt-4 uppercase">
          Читай. Бейся. Побеждай.
        </p>
      </div>

      {/* PLAYER GREETING */}
      {playerName && (
        <div className="mb-8 animate-fade-scale">
          <span className="font-rubik text-rap-muted text-sm tracking-widest">
            С возвращением, <span style={{ color: '#FFD700' }}>{playerName}</span> 🎤
          </span>
        </div>
      )}

      {/* MENU ITEMS */}
      <div className="w-full max-w-sm space-y-3">
        {menuItems.map((item, i) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`w-full btn-neon rap-card ${item.glow} flex items-center gap-4 px-6 py-4 group`}
            style={{
              animationDelay: `${i * 0.08}s`,
              animation: `slide-up 0.4s ease-out ${i * 0.08}s both`,
            }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${item.color}22`, border: `1px solid ${item.color}44` }}
            >
              <Icon name={item.icon} fallback="Circle" size={20} style={{ color: item.color }} />
            </div>
            <span
              className="font-oswald font-semibold text-xl tracking-wider flex-1 text-left"
              style={{ color: item.color }}
            >
              {item.label}
            </span>
            <Icon
              name="ChevronRight"
              size={18}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: item.color }}
            />
          </button>
        ))}
      </div>

      {/* DECORATIVE BOTTOM */}
      <div className="mt-16 flex items-center gap-6 opacity-30">
        {['#FFD700', '#00FFFF', '#FF006E', '#39FF14', '#BF5FFF'].map((c, i) => (
          <div
            key={i}
            className="rounded-full animate-pulse-neon"
            style={{
              width: 8,
              height: 8,
              background: c,
              boxShadow: `0 0 10px ${c}`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <p className="mt-6 font-rubik text-xs text-rap-muted opacity-50 tracking-widest">
        PRESS S · D · F · SPACE · J · K TO PLAY
      </p>
    </div>
  );
}