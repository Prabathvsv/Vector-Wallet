import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onWin: (amount: string) => void;
  onBack: () => void;
}

const COLORS = [
  { id: 0, name: 'Ethereum', color: '#627EEA' },
  { id: 1, name: 'Optimism', color: '#FF0420' },
  { id: 2, name: 'Polygon', color: '#8247E5' },
  { id: 3, name: 'Arbitrum', color: '#28A0F0' }
];

export const SimonSaysGame: React.FC<Props> = ({ onWin, onBack }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSeq, setPlayerSeq] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [message, setMessage] = useState('Press Start to Play');

  const WIN_ROUND = 6;

  const startGame = () => {
    setIsPlaying(true);
    const firstColor = Math.floor(Math.random() * 4);
    setSequence([firstColor]);
    setPlayerSeq([]);
    setMessage('Watch the sequence...');
    playSequence([firstColor]);
  };

  const playSequence = (seq: number[]) => {
    let i = 0;
    const interval = setInterval(() => {
      setActiveColor(seq[i]);
      setTimeout(() => setActiveColor(null), 400); // flash length
      
      i++;
      if (i >= seq.length) {
        clearInterval(interval);
        setTimeout(() => setMessage('Your turn!'), 500);
      }
    }, 800);
  };

  const handleColorClick = (colorId: number) => {
    if (!isPlaying || message !== 'Your turn!') return;

    setActiveColor(colorId);
    setTimeout(() => setActiveColor(null), 200);

    const newPlayerSeq = [...playerSeq, colorId];
    setPlayerSeq(newPlayerSeq);

    // Check if correct so far
    const currentIdx = newPlayerSeq.length - 1;
    if (newPlayerSeq[currentIdx] !== sequence[currentIdx]) {
      // Failed!
      setMessage(`Game Over! You reached round ${sequence.length}`);
      setIsPlaying(false);
      return;
    }

    // Check if completed the round
    if (newPlayerSeq.length === sequence.length) {
      if (sequence.length === WIN_ROUND) {
        setMessage('You Won!');
        setIsPlaying(false);
        onWin('0.005');
      } else {
        setMessage('Correct! Next round...');
        setPlayerSeq([]);
        const nextSequence = [...sequence, Math.floor(Math.random() * 4)];
        setSequence(nextSequence);
        setTimeout(() => {
          setMessage('Watch the sequence...');
          playSequence(nextSequence);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex-col gap-4" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={18} /> Back to Hub
        </button>
        <span style={{ fontWeight: 600, color: '#FF0420' }}>Web3 Simon Says</span>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>{message}</h3>
        {!isPlaying && <button className="btn btn-primary" onClick={startGame}>Start Game</button>}
      </div>

      <div style={{ 
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px',
        maxWidth: '300px', margin: '0 auto', padding: '1rem'
      }}>
        {COLORS.map(c => (
          <div 
            key={c.id}
            onClick={() => handleColorClick(c.id)}
            style={{
              aspectRatio: '1',
              borderRadius: '20px',
              background: c.color,
              opacity: activeColor === c.id ? 1 : 0.4,
              transform: activeColor === c.id ? 'scale(1.05)' : 'scale(1)',
              boxShadow: activeColor === c.id ? `0 0 30px ${c.color}` : 'none',
              cursor: isPlaying && message === 'Your turn!' ? 'pointer' : 'default',
              transition: 'all 0.1s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <span style={{ fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
