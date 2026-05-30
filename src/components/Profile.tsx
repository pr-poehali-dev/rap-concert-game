import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface Props {
  onNavigate: (page: string) => void;
  playerName: string;
  setPlayerName: (name: string) => void;
  totalScore: number;
  gamesPlayed: number;
  bestCombo: number;
  bestAccuracy: number;
}

const RANK_TIERS = [
  { name: 'НОВИЧОК', minScore: 0, color: '#4a4a6a', icon: '🎧' },
  { name: 'АНДЕРГРАУНД', minScore: 10000, color: '#39FF14', icon: '🎤' },
  { name: 'ЛЕЙБЛ', minScore: 50000, color: '#00FFFF', icon: '💿' },
  { name: 'ЗОЛОТОЙ', minScore: 150000, color: '#FFD700', icon: '🥇' },
  { name: 'ПЛАТИНОВЫЙ', minScore: 400000, color: '#BF5FFF', icon: '💎' },
  { name: 'ЛЕГЕНДА', minScore: 1000000, color: '#FF006E', icon: '👑' },
];

function getCurrentRank(score: number) {
  let tier = RANK_TIERS[0];
  for (const t of RANK_TIERS) {
    if (score >= t.minScore) tier = t;
  }
  return tier;
}

function getNextRank(score: number) {
  for (let i = 0; i < RANK_TIERS.length; i++) {
    if (score < RANK_TIERS[i].minScore) return RANK_TIERS[i];
  }
  return null;
}

export default function Profile({ onNavigate, playerName, setPlayerName, totalScore, gamesPlayed, bestCombo, bestAccuracy }: Props) {
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(playerName);

  const currentRank = getCurrentRank(totalScore);
  const nextRank = getNextRank(totalScore);
  const progress = nextRank
    ? ((totalScore - currentRank.minScore) / (nextRank.minScore - currentRank.minScore)) * 100
    : 100;

  const saveName = () => {
    if (tempName.trim()) setPlayerName(tempName.trim());
    setEditing(false);
  };

  const stats = [
    { label: 'Игр сыграно', value: gamesPlayed, icon: 'Gamepad2', color: '#00FFFF' },
    { label: 'Лучший комбо', value: `x${bestCombo}`, icon: 'Zap', color: '#FFD700' },
    { label: 'Лучшая точность', value: `${bestAccuracy}%`, icon: 'Target', color: '#39FF14' },
    { label: 'Общий счёт', value: totalScore.toLocaleString(), icon: 'Star', color: '#BF5FFF' },
  ];

  return (
    <div className="relative z-10 min-h-screen px-4 py-8">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8 animate-slide-down">
        <button
          onClick={() => onNavigate('menu')}
          className="w-10 h-10 rap-card flex items-center justify-center"
        >
          <Icon name="ArrowLeft" size={18} style={{ color: '#FFD700' }} />
        </button>
        <h2 className="font-oswald font-bold text-3xl tracking-widest" style={{ color: '#FF006E' }}>
          ПРОФИЛЬ
        </h2>
      </div>

      {/* AVATAR + NAME */}
      <div className="flex flex-col items-center mb-8 animate-fade-scale">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-4 relative"
          style={{
            background: `linear-gradient(135deg, ${currentRank.color}44, ${currentRank.color}11)`,
            border: `2px solid ${currentRank.color}`,
            boxShadow: `0 0 30px ${currentRank.color}44`,
          }}
        >
          {currentRank.icon}
        </div>

        {editing ? (
          <div className="flex items-center gap-2">
            <input
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveName()}
              className="font-oswald font-bold text-xl text-center bg-transparent border-b-2 outline-none px-2 py-1"
              style={{ borderColor: '#FFD700', color: '#FFD700', width: 180 }}
              autoFocus
              maxLength={20}
            />
            <button onClick={saveName}>
              <Icon name="Check" size={20} style={{ color: '#39FF14' }} />
            </button>
          </div>
        ) : (
          <button
            className="flex items-center gap-2 group"
            onClick={() => { setTempName(playerName); setEditing(true); }}
          >
            <span className="font-oswald font-bold text-2xl" style={{ color: '#FFD700' }}>
              {playerName || 'Игрок'}
            </span>
            <Icon
              name="Pencil"
              size={14}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: '#FFD700' }}
            />
          </button>
        )}

        <div
          className="mt-2 px-4 py-1 rounded-full font-oswald font-semibold text-sm tracking-widest"
          style={{
            background: `${currentRank.color}22`,
            color: currentRank.color,
            border: `1px solid ${currentRank.color}44`,
          }}
        >
          {currentRank.icon} {currentRank.name}
        </div>
      </div>

      {/* RANK PROGRESS */}
      {nextRank && (
        <div className="rap-card p-4 mb-6" style={{ border: `1px solid ${currentRank.color}33` }}>
          <div className="flex justify-between mb-2">
            <span className="font-rubik text-xs text-rap-muted">
              До ранга <span style={{ color: nextRank.color }}>{nextRank.name}</span>
            </span>
            <span className="font-oswald text-xs" style={{ color: currentRank.color }}>
              {totalScore.toLocaleString()} / {nextRank.minScore.toLocaleString()}
            </span>
          </div>
          <div className="health-bar">
            <div
              className="health-fill"
              style={{
                width: `${Math.min(100, progress)}%`,
                background: `linear-gradient(to right, ${currentRank.color}aa, ${currentRank.color})`,
              }}
            />
          </div>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className="rap-card p-4"
            style={{
              border: `1px solid ${s.color}22`,
              animation: `fade-in-scale 0.3s ease-out ${i * 0.08}s both`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon name={s.icon} fallback="Circle" size={16} style={{ color: s.color }} />
              <span className="font-rubik text-xs text-rap-muted">{s.label}</span>
            </div>
            <div className="font-oswald font-black text-xl" style={{ color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* RANK TIERS */}
      <div className="rap-card p-4">
        <h3 className="font-oswald font-semibold text-sm tracking-widest text-rap-muted mb-3">СИСТЕМА РАНГОВ</h3>
        <div className="space-y-2">
          {RANK_TIERS.map((tier, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2 px-3 rounded-lg"
              style={{
                background: currentRank.name === tier.name ? `${tier.color}11` : 'transparent',
                border: currentRank.name === tier.name ? `1px solid ${tier.color}33` : '1px solid transparent',
              }}
            >
              <span className="text-lg">{tier.icon}</span>
              <div className="flex-1">
                <div className="font-oswald font-semibold text-sm" style={{ color: tier.color }}>
                  {tier.name}
                </div>
                <div className="font-rubik text-xs text-rap-muted">
                  {tier.minScore.toLocaleString()}+ очков
                </div>
              </div>
              {currentRank.name === tier.name && (
                <div className="font-oswald text-xs font-bold" style={{ color: tier.color }}>← ТЫ</div>
              )}
              {totalScore >= tier.minScore && currentRank.name !== tier.name && (
                <Icon name="Check" size={14} style={{ color: '#39FF14' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
