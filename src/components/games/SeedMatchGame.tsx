import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onWin: (amount: string) => void;
  onBack: () => void;
}

const WORDS = ['apple', 'ghost', 'block', 'chain', 'crypto', 'node', 'hash', 'peer'];

export const SeedMatchGame: React.FC<Props> = ({ onWin, onBack }) => {
  const [cards, setCards] = useState<{id: number, word: string}[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    // Initialize deck
    const deck = [...WORDS, ...WORDS]
      .sort(() => Math.random() - 0.5)
      .map((word, index) => ({ id: index, word }));
    setCards(deck);
  }, []);

  useEffect(() => {
    if (matched.length === WORDS.length && cards.length > 0) {
      setTimeout(() => onWin('0.005'), 500);
    }
  }, [matched, onWin, cards]);

  const handleCardClick = (id: number) => {
    if (disabled || flipped.includes(id) || matched.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      const firstCard = cards.find(c => c.id === newFlipped[0]);
      const secondCard = cards.find(c => c.id === newFlipped[1]);

      if (firstCard && secondCard && firstCard.word === secondCard.word) {
        setMatched(prev => [...prev, firstCard.id, secondCard.id]);
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
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
        <span style={{ fontWeight: 600, color: 'var(--success)' }}>Seed Phrase Match</span>
      </div>

      <div style={{ 
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px',
        maxWidth: '400px', margin: '0 auto', padding: '1rem',
        background: 'rgba(0,0,0,0.2)', borderRadius: '16px'
      }}>
        {cards.map(card => {
          const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
          const isMatched = matched.includes(card.id);

          return (
            <div 
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              style={{
                aspectRatio: '1',
                background: isFlipped ? 'var(--panel-bg)' : 'rgba(255,255,255,0.05)',
                border: isMatched ? '2px solid var(--success)' : isFlipped ? '2px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: disabled || isFlipped ? 'default' : 'pointer',
                transition: 'all 0.3s ease',
                color: isFlipped ? 'var(--text-main)' : 'transparent',
                fontSize: '0.8rem', fontWeight: 'bold'
              }}
            >
              {isFlipped ? card.word : '?'}
            </div>
          );
        })}
      </div>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        Match all pairs of Seed Words to win!
      </p>
    </div>
  );
};
