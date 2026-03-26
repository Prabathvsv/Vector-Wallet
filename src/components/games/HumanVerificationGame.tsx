import React, { useState, useEffect } from 'react';
import { ArrowLeft, Target, Zap } from 'lucide-react';

interface Props {
  onWin: (amount: string) => void;
  onBack: () => void;
}

export const HumanVerificationGame: React.FC<Props> = ({ onWin, onBack }) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });

  const goal = 10;
  const rewardEth = "0.001";

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (gameState === 'playing' && timeLeft === 0) {
      setGameState('lost');
    }
    return () => clearTimeout(timer);
  }, [gameState, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(10);
    setGameState('playing');
    moveTarget();
  };

  const moveTarget = () => {
    setTargetPos({
      x: 15 + Math.random() * 70, // between 15% and 85%
      y: 15 + Math.random() * 70
    });
  };

  const handleClick = () => {
    if (gameState !== 'playing') return;
    
    const newScore = score + 1;
    setScore(newScore);
    
    if (newScore >= goal) {
      setGameState('won');
      onWin(rewardEth);
    } else {
      moveTarget();
    }
  };

  return (
    <div className="flex-col gap-4" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={18} /> Back to Hub
        </button>
        <span style={{ fontWeight: 600, color: 'var(--accent-color)' }}>Human Verification</span>
      </div>

      <div className="glass-panel" style={{ padding: '0', position: 'relative', overflow: 'hidden', height: '350px', background: 'rgba(0,0,0,0.2)', borderRadius: '16px' }}>
        
        {/* HUD */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', zIndex: 10 }}>
          <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap color="var(--warning)" size={16} /> {score}/{goal}
          </span>
          <span style={{ fontWeight: 600, color: timeLeft <= 3 ? 'var(--danger)' : 'white' }}>
            {timeLeft}s
          </span>
        </div>

        {/* Game Area */}
        {gameState === 'playing' && (
          <div 
            onClick={handleClick}
            style={{
              position: 'absolute',
              left: `${targetPos.x}%`,
              top: `${targetPos.y}%`,
              transform: 'translate(-50%, -50%)',
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, var(--accent-color), var(--accent-hover))',
              boxShadow: '0 0 15px var(--accent-glow)',
              cursor: 'crosshair',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.1s ease',
              zIndex: 5
            }}
          >
            <Target size={20} color="white" />
          </div>
        )}

        {/* Overlays */}
        {gameState === 'idle' && (
          <div className="flex-center flex-col" style={{ width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', zIndex: 20 }}>
            <button className="btn btn-primary" style={{ padding: '0.75rem 2rem' }} onClick={startGame}>
              Start Verification
            </button>
            <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click the target {goal} times in 10s</p>
          </div>
        )}

        {gameState === 'lost' && (
          <div className="flex-center flex-col" style={{ width: '100%', height: '100%', background: 'rgba(239, 68, 68, 0.1)', zIndex: 20, gap: '1rem' }}>
            <h3 style={{ color: 'var(--danger)' }}>Too slow!</h3>
            <button className="btn btn-primary" onClick={startGame}>Try Again</button>
          </div>
        )}

        {gameState === 'won' && (
          <div className="flex-center flex-col" style={{ width: '100%', height: '100%', background: 'rgba(16, 185, 129, 0.1)', zIndex: 20, gap: '1rem' }}>
            <h3 style={{ color: 'var(--success)' }}>Verified!</h3>
            <p style={{ color: 'var(--text-muted)' }}>Reward is being processed...</p>
          </div>
        )}

      </div>
    </div>
  );
};
