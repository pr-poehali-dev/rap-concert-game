import { useState, useCallback } from 'react';
import GeoBg from '@/components/GeoBg';
import MainMenu from '@/components/MainMenu';
import ArtistSelect from '@/components/ArtistSelect';
import GamePlay from '@/components/GamePlay';
import GameResult from '@/components/GameResult';
import Leaderboard from '@/components/Leaderboard';
import Profile from '@/components/Profile';
import Achievements from '@/components/Achievements';

type Page = 'menu' | 'select' | 'game' | 'result' | 'leaderboard' | 'profile' | 'achievements';

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

interface GameStats {
  score: number;
  combo: number;
  accuracy: number;
}

export default function App() {
  const [page, setPage] = useState<Page>('menu');
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [lastResult, setLastResult] = useState<GameStats>({ score: 0, combo: 0, accuracy: 0 });

  const [playerName, setPlayerName] = useState('Игрок');
  const [totalScore, setTotalScore] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [bestAccuracy, setBestAccuracy] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const navigate = useCallback((target: string) => {
    setPage(target as Page);
  }, []);

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

  const handlePlayAgain = useCallback(() => {
    setPage('game');
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: 'var(--rap-bg)' }}>
      <GeoBg />

      {/* Background grid lines */}
      <div className="fixed inset-0 z-0 pointer-events-none flex">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 border-r"
            style={{ borderColor: 'rgba(255,255,255,0.015)' }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {page === 'menu' && (
          <MainMenu onNavigate={navigate} playerName={playerName} />
        )}

        {page === 'select' && (
          <ArtistSelect onNavigate={navigate} onSelectArtist={handleSelectArtist} />
        )}

        {page === 'game' && selectedArtist && (
          <GamePlay
            artist={selectedArtist}
            onNavigate={navigate}
            onGameEnd={handleGameEnd}
          />
        )}

        {page === 'result' && selectedArtist && (
          <GameResult
            score={lastResult.score}
            combo={lastResult.combo}
            accuracy={lastResult.accuracy}
            artistName={selectedArtist.name}
            artistEmoji={selectedArtist.emoji}
            artistColor={selectedArtist.color}
            onNavigate={navigate}
            onPlayAgain={handlePlayAgain}
          />
        )}

        {page === 'leaderboard' && (
          <Leaderboard
            onNavigate={navigate}
            playerName={playerName}
            playerScore={bestScore}
          />
        )}

        {page === 'profile' && (
          <Profile
            onNavigate={navigate}
            playerName={playerName}
            setPlayerName={setPlayerName}
            totalScore={totalScore}
            gamesPlayed={gamesPlayed}
            bestCombo={bestCombo}
            bestAccuracy={bestAccuracy}
          />
        )}

        {page === 'achievements' && (
          <Achievements
            onNavigate={navigate}
            gamesPlayed={gamesPlayed}
            bestCombo={bestCombo}
            bestAccuracy={bestAccuracy}
            totalScore={totalScore}
          />
        )}
      </div>
    </div>
  );
}
