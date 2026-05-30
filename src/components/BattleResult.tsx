import Icon from '@/components/ui/icon';

interface Props {
  won: boolean;
  myScore: number;
  opponentScore: number;
  onNavigate: (page: string) => void;
  onPlayAgain: () => void;
  artistColor: string;
}

export default function BattleResult({ won, myScore, opponentScore, onNavigate, onPlayAgain, artistColor }: Props) {
  const diff = myScore - opponentScore;

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center animate-fade-scale">

        {/* OUTCOME */}
        <div className="mb-8 relative">
          <div
            className="absolute inset-0 blur-3xl opacity-25 rounded-full"
            style={{ background: won ? '#39FF14' : '#FF006E' }}
          />
          <div
            className="font-oswald font-black leading-none relative"
            style={{
              fontSize: '7rem',
              color: won ? '#39FF14' : '#FF006E',
              textShadow: `0 0 40px ${won ? '#39FF14' : '#FF006E'}`,
            }}
          >
            {won ? '🏆' : '💀'}
          </div>
          <div
            className="font-oswald font-black text-4xl tracking-[0.2em] mt-2"
            style={{ color: won ? '#39FF14' : '#FF006E' }}
          >
            {won ? 'ПОБЕДА!' : 'ПОРАЖЕНИЕ'}
          </div>
          <div className="font-rubik text-rap-muted text-sm mt-1 tracking-wider">
            {won
              ? diff > 0 ? `+${diff.toLocaleString()} очков над соперником` : 'Соперник выбыл!'
              : 'Тренируйся и реванш!'
            }
          </div>
        </div>

        {/* SCORE COMPARE */}
        <div className="rap-card p-5 mb-6" style={{ border: `1px solid ${won ? '#39FF14' : '#FF006E'}33` }}>
          <div className="flex items-center justify-between gap-4">
            <div className="text-center flex-1">
              <div className="font-rubik text-xs text-rap-muted mb-1">ТЫ</div>
              <div className="font-oswald font-black text-3xl" style={{ color: won ? '#39FF14' : '#FF006E' }}>
                {myScore.toLocaleString()}
              </div>
            </div>
            <div className="font-oswald font-black text-2xl" style={{ color: '#FF006E' }}>VS</div>
            <div className="text-center flex-1">
              <div className="font-rubik text-xs text-rap-muted mb-1">СОПЕРНИК</div>
              <div className="font-oswald font-black text-3xl" style={{ color: won ? '#FF006E' : '#39FF14' }}>
                {opponentScore.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="space-y-3">
          <button
            onClick={onPlayAgain}
            className="w-full btn-neon py-4 rounded-xl font-oswald font-bold text-lg tracking-widest"
            style={{ background: won ? '#39FF14' : '#FF006E', color: '#000', boxShadow: `0 0 20px ${won ? '#39FF14' : '#FF006E'}66` }}
          >
            ⚔️ РЕВАНШ
          </button>
          <button
            onClick={() => onNavigate('battle')}
            className="w-full btn-neon rap-card py-3 rounded-xl font-oswald font-semibold text-base tracking-wider"
            style={{ color: '#FFD700', border: '1px solid rgba(255,215,0,0.3)' }}
          >
            Новый батл
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
