import Icon from '@/components/ui/icon';

interface Props {
  score: number;
  combo: number;
  accuracy: number;
  artistName: string;
  artistEmoji: string;
  artistColor: string;
  onNavigate: (page: string) => void;
  onPlayAgain: () => void;
}

function getRank(accuracy: number, score: number): { label: string; color: string; desc: string } {
  if (accuracy >= 95 && score > 50000) return { label: 'S', color: '#FFD700', desc: 'ЛЕГЕНДА' };
  if (accuracy >= 85) return { label: 'A', color: '#00FFFF', desc: 'ПРОФИ' };
  if (accuracy >= 70) return { label: 'B', color: '#39FF14', desc: 'ХОРОШ' };
  if (accuracy >= 55) return { label: 'C', color: '#BF5FFF', desc: 'НЕПЛОХО' };
  return { label: 'D', color: '#FF006E', desc: 'ТРЕНИРУЙСЯ' };
}

export default function GameResult({ score, combo, accuracy, artistName, artistEmoji, artistColor, onNavigate, onPlayAgain }: Props) {
  const rank = getRank(accuracy, score);

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center animate-fade-scale">
        {/* RANK */}
        <div className="mb-6 relative">
          <div
            className="absolute inset-0 blur-3xl opacity-30 rounded-full"
            style={{ background: rank.color }}
          />
          <div
            className="font-oswald font-black text-[10rem] leading-none relative"
            style={{ color: rank.color, textShadow: `0 0 40px ${rank.color}, 0 0 80px ${rank.color}55` }}
          >
            {rank.label}
          </div>
          <div
            className="font-oswald font-bold text-xl tracking-[0.4em]"
            style={{ color: rank.color }}
          >
            {rank.desc}
          </div>
        </div>

        {/* ARTIST */}
        <div className="rap-card p-4 mb-4" style={{ border: `1px solid ${artistColor}44` }}>
          <div className="text-3xl mb-1">{artistEmoji}</div>
          <div className="font-oswald font-semibold text-lg" style={{ color: artistColor }}>{artistName}</div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'СЧЁТ', value: score.toLocaleString(), color: '#FFD700' },
            { label: 'COMBO', value: `x${combo}`, color: '#00FFFF' },
            { label: 'ТОЧНОСТЬ', value: `${accuracy}%`, color: '#39FF14' },
          ].map((s, i) => (
            <div key={i} className="rap-card p-3" style={{ border: `1px solid ${s.color}22` }}>
              <div className="font-oswald font-black text-xl" style={{ color: s.color }}>{s.value}</div>
              <div className="font-rubik text-xs text-rap-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="space-y-3">
          <button
            onClick={onPlayAgain}
            className="w-full btn-neon py-4 rounded-xl font-oswald font-bold text-lg tracking-widest"
            style={{ background: artistColor, color: '#000', boxShadow: `0 0 20px ${artistColor}66` }}
          >
            🔄 СНОВА
          </button>
          <button
            onClick={() => onNavigate('select')}
            className="w-full btn-neon rap-card py-3 rounded-xl font-oswald font-semibold text-base tracking-wider"
            style={{ color: '#FFD700', border: '1px solid rgba(255,215,0,0.3)' }}
          >
            Другой исполнитель
          </button>
          <button
            onClick={() => onNavigate('leaderboard')}
            className="w-full btn-neon rap-card py-3 rounded-xl font-oswald font-semibold text-base tracking-wider"
            style={{ color: '#00FFFF', border: '1px solid rgba(0,255,255,0.3)' }}
          >
            <Icon name="Trophy" size={16} className="inline mr-2" />
            Лидерборд
          </button>
          <button
            onClick={() => onNavigate('menu')}
            className="font-rubik text-rap-muted text-sm underline underline-offset-4"
          >
            В главное меню
          </button>
        </div>
      </div>
    </div>
  );
}
