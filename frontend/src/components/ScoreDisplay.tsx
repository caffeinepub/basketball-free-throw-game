import React from 'react';
import { Card } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface ScoreDisplayProps {
  score: number;
}

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Score</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              {score}
            </p>
          </div>
        </div>
      </div>
      {score > 0 && (
        <div className="mt-4 pt-4 border-t border-orange-500/20">
          <p className="text-sm text-muted-foreground">
            {score === 1 && "Great shot! Keep it up! 🎯"}
            {score >= 2 && score < 5 && "You're on fire! 🔥"}
            {score >= 5 && score < 10 && "Amazing streak! 🌟"}
            {score >= 10 && "Legendary performance! 🏆"}
          </p>
        </div>
      )}
    </Card>
  );
}
