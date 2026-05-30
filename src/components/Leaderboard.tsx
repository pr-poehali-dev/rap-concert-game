import Icon from '@/components/ui/icon';

interface LeaderEntry {
  rank: number;
  name: string;
  score: number;
  accuracy: number;
  combo: number;
  artist: string;
  grade: string;
  gradeColor: string;
}

const MOCK_LEADERS: LeaderEntry[] = [
  { rank: 1, name: 'XxDarkBoyxX', score: 142800, accuracy: 97, combo: 312, artist: 'Oxxxymiron', grade: 'S', gradeColor: '#FFD700' },
  { rank: 2, name: 'MoscowRapper', score: 118500, accuracy: 93, combo: 245, artist: 'SLAVA MARLOW', grade: 'A', gradeColor: '#00FFFF' },
  { rank: 3, name: 'BeatKiller99', score: 97200, accuracy: 89, combo: 198, artist: 'FACE', grade: 'A', gradeColor: '#00FFFF' },
  { rank: 4, name: 'RhymeWizard', score: 84100, accuracy: 85, combo: 156, artist: 'Noize MC', grade: 'B', gradeColor: '#39FF14' },
  { rank: 5, name: 'TrapGod2024', score: 71300, accuracy: 81, combo: 134, artist: 'gone.Fludd', grade: 'B', gradeColor: '#39FF14' },
  { rank: 6, name: 'FlowMaster', score: 62800, accuracy: 77, combo: 112, artist: 'FACE', grade: 'C', gradeColor: '#BF5FFF' },
  { rank: 7, name: 'Бро_из_Ростова', score: 54400, accuracy: 72, combo: 89, artist: 'SLAVA MARLOW', grade: 'C', gradeColor: '#BF5FFF' },
  { rank: 8, name: 'StreetPhilosopher', score: 43200, accuracy: 68, combo: 67, artist: 'Oxxxymiron', grade: 'C', gradeColor: '#BF5FFF' },
  { rank: 9, name: 'Кирилл228', score: 31700, accuracy: 61, combo: 45, artist: 'Noize MC', grade: 'D', gradeColor: '#FF006E' },
  { rank: 10, name: 'BassDropper', score: 22100, accuracy: 55, combo: 32, artist: 'gone.Fludd', grade: 'D', gradeColor: '#FF006E' },
];

const DIFFICULTY_FILTERS = ['Все', 'Лёгкий', 'Средний', 'Сложный'];

interface Props {
  onNavigate: (page: string) => void;
  playerName: string;
  playerScore: number;
}

export default function Leaderboard({ onNavigate, playerName, playerScore }: Props) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

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
            ЛИДЕРБОРД
          </h2>
          <p className="font-rubik text-rap-muted text-xs tracking-wider">Лучшие рэп-герои мира</p>
        </div>
        <Icon name="Trophy" size={28} className="ml-auto" style={{ color: '#FFD700' }} />
      </div>

      {/* TOP 3 PODIUM */}
      <div className="flex items-end justify-center gap-3 mb-8">
        {[MOCK_LEADERS[1], MOCK_LEADERS[0], MOCK_LEADERS[2]].map((entry, i) => {
          const heights = ['h-24', 'h-32', 'h-20'];
          const positions = ['2nd', '1st', '3rd'];
          const colors = ['#00FFFF', '#FFD700', '#39FF14'];
          return (
            <div key={entry.rank} className="flex flex-col items-center gap-2">
              <div className="text-2xl">{i === 1 ? '👑' : '🎤'}</div>
              <div className="font-oswald font-bold text-sm text-center" style={{ color: colors[i] }}>
                {entry.name.length > 10 ? entry.name.slice(0, 10) + '…' : entry.name}
              </div>
              <div className="font-rubik text-xs text-rap-muted">{entry.score.toLocaleString()}</div>
              <div
                className={`w-20 ${heights[i]} rounded-t-lg flex items-center justify-center`}
                style={{
                  background: `${colors[i]}22`,
                  border: `1px solid ${colors[i]}44`,
                  boxShadow: i === 1 ? `0 0 20px ${colors[i]}44` : 'none',
                }}
              >
                <span className="font-oswald font-black text-2xl" style={{ color: colors[i] }}>
                  {positions[i] === '1st' ? '1' : positions[i] === '2nd' ? '2' : '3'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* FULL LIST */}
      <div className="space-y-2 mb-6">
        {MOCK_LEADERS.map((entry, i) => {
          const isPlayer = entry.name === playerName;
          return (
            <div
              key={entry.rank}
              className="rap-card px-4 py-3 flex items-center gap-3"
              style={{
                animationDelay: `${i * 0.04}s`,
                animation: `slide-up 0.3s ease-out ${i * 0.04}s both`,
                border: isPlayer ? '1px solid #FFD70066' : '1px solid var(--rap-border)',
                background: isPlayer ? 'rgba(255,215,0,0.05)' : 'var(--rap-card)',
              }}
            >
              <div className="w-8 text-center font-oswald font-bold text-sm text-rap-muted">
                {getRankIcon(entry.rank)}
              </div>
              <div
                className="w-8 h-8 rounded flex items-center justify-center font-oswald font-black text-base"
                style={{
                  background: `${entry.gradeColor}22`,
                  color: entry.gradeColor,
                  border: `1px solid ${entry.gradeColor}44`,
                }}
              >
                {entry.grade}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-rubik font-medium text-sm text-rap-text truncate">
                  {entry.name} {isPlayer && <span style={{ color: '#FFD700' }}>← ты</span>}
                </div>
                <div className="font-rubik text-xs text-rap-muted">{entry.artist}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-oswald font-bold text-sm text-rap-text">{entry.score.toLocaleString()}</div>
                <div className="font-rubik text-xs text-rap-muted">{entry.accuracy}% | x{entry.combo}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PLAYER ENTRY */}
      {playerScore > 0 && (
        <div
          className="rap-card px-4 py-4 text-center"
          style={{ border: '1px solid rgba(255,215,0,0.3)', background: 'rgba(255,215,0,0.05)' }}
        >
          <p className="font-rubik text-rap-muted text-xs mb-1">Твой лучший результат</p>
          <p className="font-oswald font-black text-2xl" style={{ color: '#FFD700' }}>
            {playerScore.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
