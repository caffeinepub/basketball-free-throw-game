import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw, Info } from 'lucide-react';
import { SiCaffeine } from 'react-icons/si';
import GameCanvas from '@/components/GameCanvas';
import GameInstructions from '@/components/GameInstructions';
import ScoreDisplay from '@/components/ScoreDisplay';

export default function BasketballGame() {
  const [score, setScore] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const gameCanvasRef = useRef<{ resetGame: () => void; shoot: (power: number) => void } | null>(null);

  const handleScore = useCallback(() => {
    setScore((prev) => prev + 1);
    setSuccessMessage('🎯 Swish! Great shot!');
    setTimeout(() => setSuccessMessage(''), 2000);
  }, []);

  const handleMiss = useCallback(() => {
    setSuccessMessage('');
  }, []);

  const handleReset = useCallback(() => {
    setScore(0);
    setSuccessMessage('');
    gameCanvasRef.current?.resetGame();
  }, []);

  const handleShoot = useCallback((power: number) => {
    gameCanvasRef.current?.shoot(power);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col">
      {/* Header */}
      <header className="w-full border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <span className="text-2xl">🏀</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              Basketball Free Throw
            </h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowInstructions(!showInstructions)}
            className="hover:bg-accent"
          >
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Instructions Card */}
        {showInstructions && <GameInstructions onClose={() => setShowInstructions(false)} />}

        {/* Success Message */}
        {successMessage && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-20 animate-in fade-in slide-in-from-top-4 duration-300">
            <Card className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-2xl border-0">
              <p className="text-lg font-bold">{successMessage}</p>
            </Card>
          </div>
        )}

        {/* Game Canvas and Controls */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 items-stretch">
          {/* Canvas Container */}
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-4xl aspect-[4/3] overflow-hidden shadow-2xl border-2">
              <GameCanvas ref={gameCanvasRef} onScore={handleScore} onMiss={handleMiss} />
            </Card>
          </div>

          {/* Side Panel */}
          <div className="lg:w-80 flex flex-col gap-4">
            <ScoreDisplay score={score} />
            
            <Card className="p-6 space-y-4 shadow-lg">
              <h3 className="font-semibold text-lg">Controls</h3>
              <ShootControl onShoot={handleShoot} />
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Game
              </Button>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-card/50 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            © 2025. Built with <SiCaffeine className="text-orange-500" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

interface ShootControlProps {
  onShoot: (power: number) => void;
}

function ShootControl({ onShoot }: ShootControlProps) {
  const [power, setPower] = useState(65);
  const [isShooting, setIsShooting] = useState(false);

  const handleShoot = () => {
    setIsShooting(true);
    onShoot(power);
    setTimeout(() => setIsShooting(false), 1000);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Shot Power</label>
          <span className="text-sm font-bold text-orange-600">{power}%</span>
        </div>
        <input
          type="range"
          min="30"
          max="100"
          value={power}
          onChange={(e) => setPower(Number(e.target.value))}
          disabled={isShooting}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
        <p className="text-xs text-muted-foreground">
          Adjust power to find the perfect shot!
        </p>
      </div>
      <Button
        onClick={handleShoot}
        disabled={isShooting}
        className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-lg"
        size="lg"
      >
        {isShooting ? 'Shooting...' : '🏀 Shoot'}
      </Button>
    </div>
  );
}
