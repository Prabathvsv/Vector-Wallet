import React, { useState } from 'react';
import { Lock, Sparkles } from 'lucide-react';

interface Props {
  amount: string;
  onOpen: () => void;
}

export const VaultOpener: React.FC<Props> = ({ amount, onOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);
    
    // Trigger opening animation
    setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
      onOpen(); // Trigger the actual payout logic
    }, 1500);
  };

  return (
    <div className="flex-center flex-col" style={{ width: '100%', height: '100%', minHeight: '400px', perspective: '1000px' }}>
      <h2 style={{ marginBottom: '2rem', color: 'var(--accent-color)', textAlign: 'center' }}>
        {isOpen ? 'REWARD REVEALED!' : 'YOU WON A VAULT!'}
      </h2>

      <div 
        onClick={handleOpen}
        style={{
          position: 'relative',
          width: '200px',
          height: '200px',
          transformStyle: 'preserve-3d',
          transform: isOpening ? 'rotateY(180deg) scale(1.1)' : isOpen ? 'rotateY(180deg) translateY(-20px)' : 'rotateY(0deg)',
          transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: isOpen ? 'default' : 'pointer'
        }}
      >
        {/* Front Face (Locked) */}
        <div style={{
          position: 'absolute', width: '100%', height: '100%',
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          border: '4px solid #334155',
          borderRadius: '12px',
          backfaceVisibility: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '1rem',
          boxShadow: '0 0 30px rgba(0,0,0,0.5)'
        }}>
          <div style={{ padding: '1rem', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Lock size={48} color="var(--accent-color)" />
          </div>
          <span style={{ fontWeight: 'bold', letterSpacing: '2px', color: 'var(--text-muted)' }}>CLICK TO UNLOCK</span>
        </div>

        {/* Back Face (Inside) */}
        <div style={{
          position: 'absolute', width: '100%', height: '100%',
          background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
          border: '4px solid var(--accent-color)',
          borderRadius: '12px',
          transform: 'rotateY(180deg)',
          backfaceVisibility: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '0.5rem',
          boxShadow: '0 0 50px var(--accent-glow)'
        }}>
          <Sparkles size={48} color="#F59E0B" />
          <h1 style={{ fontSize: '2.5rem', color: 'white', margin: 0 }}>{amount}</h1>
          <span style={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.8)' }}>ETH</span>
        </div>
      </div>

      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        {isOpening ? (
          <p className="animate-pulse" style={{ color: 'var(--accent-color)', fontWeight: 600 }}>UNLOCKING CRYPTOGRAPHIC VAULT...</p>
        ) : isOpen ? (
          <p style={{ color: 'var(--success)', fontWeight: 600 }}>TRANSACTION SENT TO NETWORK</p>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>Tap the vault to claim your prize</p>
        )}
      </div>

      {isOpen && (
        <div style={{ position: 'absolute', pointerEvents: 'none', width: '100%', height: '100%' }}>
           {/* Simple CSS particles could go here */}
        </div>
      )}
    </div>
  );
};
