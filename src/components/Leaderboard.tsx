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
  { rank: 1,  name: 'XxDarkBoyxX',       score: 198400, accuracy: 98, combo: 412, artist: 'Oxxxymiron',       grade: 'S', gradeColor: '#FFD700' },
  { rank: 2,  name: 'MoscowRapper',       score: 175200, accuracy: 95, combo: 356, artist: 'Гнойный',          grade: 'S', gradeColor: '#FFD700' },
  { rank: 3,  name: 'BeatKiller99',       score: 152800, accuracy: 93, combo: 298, artist: 'Хаски',            grade: 'A', gradeColor: '#00FFFF' },
  { rank: 4,  name: 'RhymeWizard',        score: 138100, accuracy: 91, combo: 267, artist: 'Скриптонит',       grade: 'A', gradeColor: '#00FFFF' },
  { rank: 5,  name: 'TrapGod2025',        score: 124600, accuracy: 89, combo: 234, artist: 'IC3PEAK',          grade: 'A', gradeColor: '#00FFFF' },
  { rank: 6,  name: 'FlowMaster',         score: 111300, accuracy: 87, combo: 212, artist: 'FACE',             grade: 'A', gradeColor: '#00FFFF' },
  { rank: 7,  name: 'Бро_из_Ростова',     score: 98700,  accuracy: 85, combo: 189, artist: 'SLAVA MARLOW',     grade: 'B', gradeColor: '#39FF14' },
  { rank: 8,  name: 'StreetPhilosopher',  score: 87400,  accuracy: 83, combo: 167, artist: 'Big Baby Tape',    grade: 'B', gradeColor: '#39FF14' },
  { rank: 9,  name: 'Кирилл228',          score: 76200,  accuracy: 81, combo: 145, artist: 'PHARAOH',          grade: 'B', gradeColor: '#39FF14' },
  { rank: 10, name: 'BassDropper',        score: 68100,  accuracy: 78, combo: 128, artist: 'Miyagi & Andy Panda', grade: 'B', gradeColor: '#39FF14' },
  { rank: 11, name: 'DragonSlayer',       score: 59800,  accuracy: 75, combo: 112, artist: 'Noize MC',         grade: 'C', gradeColor: '#BF5FFF' },
  { rank: 12, name: 'НикитаБит',          score: 51200,  accuracy: 72, combo: 98,  artist: 'Lizer',            grade: 'C', gradeColor: '#BF5FFF' },
  { rank: 13, name: 'RapStar_777',        score: 43900,  accuracy: 69, combo: 84,  artist: 'Instasamka',       grade: 'C', gradeColor: '#BF5FFF' },
  { rank: 14, name: 'Vladik_flow',        score: 36500,  accuracy: 66, combo: 71,  artist: 'T-Fest',           grade: 'C', gradeColor: '#BF5FFF' },
  { rank: 15, name: 'PunterMC',           score: 29100,  accuracy: 62, combo: 57,  artist: 'gone.Fludd',       grade: 'D', gradeColor: '#FF006E' },
  { rank: 16, name: 'AlexStreet',         score: 22700,  accuracy: 58, combo: 43,  artist: 'Элджей',           grade: 'D', gradeColor: '#FF006E' },
  { rank: 17, name: 'ГришаМск',           score: 16400,  accuracy: 54, combo: 31,  artist: 'Тимати',           grade: 'D', gradeColor: '#FF006E' },
  { rank: 18, name: 'NewbiePlayer',       score: 9800,   accuracy: 48, combo: 18,  artist: 'Jah Khalib',       grade: 'D', gradeColor: '#FF006E' },
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