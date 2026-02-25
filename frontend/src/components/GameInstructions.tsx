import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Target, Zap, RotateCcw } from 'lucide-react';

interface GameInstructionsProps {
  onClose: () => void;
}

export default function GameInstructions({ onClose }: GameInstructionsProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 shadow-lg border-2">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-2xl">🏀</span>
          How to Play
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-accent">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
            <Target className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Aim for the Hoop</h3>
            <p className="text-sm text-muted-foreground">
              Your goal is to shoot the basketball through the hoop to score points.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
            <Zap className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Adjust Shot Power</h3>
            <p className="text-sm text-muted-foreground">
              Use the power slider to control how hard you shoot. Find the perfect power level!
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
            <RotateCcw className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Reset Anytime</h3>
            <p className="text-sm text-muted-foreground">
              Click the Reset Game button to start fresh and try to beat your high score!
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
          <p className="text-sm font-medium text-center">
            💡 <span className="font-bold">Pro Tip:</span> Experiment with different power levels to find the sweet spot!
          </p>
        </div>
      </div>
    </Card>
  );
}
