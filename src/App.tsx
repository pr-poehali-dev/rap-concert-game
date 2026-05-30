import { useState, useCallback, useMemo } from 'react';
import GeoBg from '@/components/GeoBg';
import MainMenu from '@/components/MainMenu';
import ArtistSelect from '@/components/ArtistSelect';
import GamePlay from '@/components/GamePlay';
import GameResult from '@/components/GameResult';
import Leaderboard from '@/components/Leaderboard';
import Profile from '@/components/Profile';
import Achievements from '@/components/Achievements';
import BattleLobby from '@/components/BattleLobby';
import BattleGame from '@/components/BattleGame';
import BattleResult from '@/components/BattleResult';

type Page = 'menu' | 'select' | 'game' | 'result' | 'leaderboard' | 'profile' | 'achievements' | 'battle' | 'battle-game' | 'battle-result';

interface Artist {
  id: string; name: string; emoji: string; genre: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  bpm: number; color: string; tracks: string[]; locked: boolean;
}
interface GameStats { score: number; combo: number; accuracy: number; }
interface BattleStats { myScore: number; opponentScore: number; won: boolean; }

// Stable player ID per session
function getPlayerId() {
  let id = sessionStorage.getItem('rap_player_id');
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem('rap_player_id', id);
  }
  return id;
}

export default function App() {
  const [page, setPage] = useState<Page>('menu');
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [lastResult, setLastResult] = useState<GameStats>({ score: 0, combo: 0, accuracy: 0 });

  const [playerName, setPlayerName] = useState('Игрок');
  const playerId = useMemo(() => getPlayerId(), []);
  const [totalScore, setTotalScore] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [bestAccuracy, setBestAccuracy] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  // Battle state
  const [battleRoomId, setBattleRoomId] = useState('');
  const [battleIsHost, setBattleIsHost] = useState(false);
  const [battleArtist, setBattleArtist] = useState<Artist | null>(null);
  const [battleResult, setBattleResult] = useState<BattleStats>({ myScore: 0, opponentScore: 0, won: false });

  const navigate = useCallback((target: string) => setPage(target as Page), []);

  const handleSelectArtist = useCallback((artist: Artist) => {
    setSelectedArtist(artist);
    setPage('game');
  }, []);

  const handleGameEnd = useCallback((score: number, combo: number, accuracy: number) => {
    setLastResult({ score, combo, accuracy });
    setTotalScore(prev => prev + score);
    setGamesPlayed(prev => prev + 1);
    setBestCombo(prev => Math.max(prev, combo));
    setBestAccuracy(prev => Math.max(prev, accuracy));
    setBestScore(prev => Math.max(prev, score));
    setPage('result');
  }, []);

  const handleBattleStart = useCallback((roomId: string, artist: Artist, isHost: boolean) => {
    setBattleRoomId(roomId);
    setBattleArtist(artist);
    setBattleIsHost(isHost);
    setPage('battle-game');
  }, []);

  const handleBattleEnd = useCallback((myScore: number, opponentScore: number, won: boolean) => {
    setBattleResult({ myScore, opponentScore, won });
    setTotalScore(prev => prev + myScore);
    setGamesPlayed(prev => prev + 1);
    setBestScore(prev => Math.max(prev, myScore));
    setPage('battle-result');
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: 'var(--rap-bg)' }}>
      <GeoBg />
      <div className="fixed inset-0 z-0 pointer-events-none flex">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex-1 border-r" style={{ borderColor: 'rgba(255,255,255,0.015)' }} />
        ))}
      </div>

      <div className="relative z-10">
        {page === 'menu' && <MainMenu onNavigate={navigate} playerName={playerName} />}

        {page === 'select' && <ArtistSelect onNavigate={navigate} onSelectArtist={handleSelectArtist} />}

        {page === 'game' && selectedArtist && (
          <GamePlay artist={selectedArtist} onNavigate={navigate} onGameEnd={handleGameEnd} />
        )}

        {page === 'result' && selectedArtist && (
          <GameResult
            score={lastResult.score} combo={lastResult.combo} accuracy={lastResult.accuracy}
            artistName={selectedArtist.name} artistEmoji={selectedArtist.emoji} artistColor={selectedArtist.color}
            onNavigate={navigate} onPlayAgain={() => setPage('game')}
          />
        )}

        {page === 'leaderboard' && <Leaderboard onNavigate={navigate} playerName={playerName} playerScore={bestScore} />}

        {page === 'profile' && (
          <Profile onNavigate={navigate} playerName={playerName} setPlayerName={setPlayerName}
            totalScore={totalScore} gamesPlayed={gamesPlayed} bestCombo={bestCombo} bestAccuracy={bestAccuracy} />
        )}

        {page === 'achievements' && (
          <Achievements onNavigate={navigate} gamesPlayed={gamesPlayed}
            bestCombo={bestCombo} bestAccuracy={bestAccuracy} totalScore={totalScore} />
        )}

        {page === 'battle' && (
          <BattleLobby
            onNavigate={navigate}
            onBattleStart={handleBattleStart}
            playerName={playerName}
            playerId={playerId}
            selectedArtist={selectedArtist}
          />
        )}

        {page === 'battle-game' && battleArtist && (
          <BattleGame
            roomId={battleRoomId}
            artist={battleArtist}
            isHost={battleIsHost}
            playerId={playerId}
            playerName={playerName}
            onNavigate={navigate}
            onBattleEnd={handleBattleEnd}
          />
        )}

        {page === 'battle-result' && battleArtist && (
          <BattleResult
            won={battleResult.won}
            myScore={battleResult.myScore}
            opponentScore={battleResult.opponentScore}
            artistColor={battleArtist.color}
            onNavigate={navigate}
            onPlayAgain={() => setPage('battle')}
          />
        )}
      </div>
    </div>
  );
}
