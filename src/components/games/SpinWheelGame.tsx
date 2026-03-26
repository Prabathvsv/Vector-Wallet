import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onWin: (amount: string) => void;
  onBack: () => void;
}

export const SpinWheelGame: React.FC<Props> = ({ onWin, onBack }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const SLICES = [
    { label: '0 ETH', color: '#EF4444', value: '0' },
    { label: '0.001 ETH', color: '#10B981', value: '0.001' },
    { label: '0 ETH', color: '#EF4444', value: '0' },
    { label: '0.005 ETH', color: '#8B5CF6', value: '0.005' },
    { label: '0 ETH', color: '#EF4444', value: '0' },
    { label: '0.01 ETH', color: '#F59E0B', value: '0.01' }
  ];

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);

    // Calculate a random slice to land on
    const sliceAngle = 360 / SLICES.length;
    const randomSliceIdx = Math.floor(Math.random() * SLICES.length);
    
    // We want the wheel to spin at least 5 full times (1800 deg)
    const extraSpins = 360 * 5;
    // We want to land EXACTLY in the middle of the selected slice
    const landingOffset = (randomSliceIdx * sliceAngle) + (sliceAngle / 2);
    // Since CSS rotates clockwise, to land on slice N, we need the wheel to be offset backwards by landingOffset.

    // To prevent the wheel from just jumping to modulus 360, we add to current rotation
    const baseRotation = Math.floor(rotation / 360) * 360;
    const finalRotation = baseRotation + extraSpins + (360 - landingOffset);

    setRotation(finalRotation);

    // Wait for the animation to finish
    setTimeout(() => {
      setSpinning(false);
      const wonAmount = SLICES[randomSliceIdx].value;
      if (parseFloat(wonAmount) > 0) {
        onWin(wonAmount);
      } else {
        alert('Better luck next time! You won 0 ETH.');
      }
    }, 4000);
  };

  return (
    <div className="flex-col gap-6" style={{ width: '100%', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={18} /> Back to Hub
        </button>
        <span style={{ fontWeight: 600, color: 'var(--accent-color)' }}>Spin The Wheel</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', flex: 1, gap: '2rem' }}>
        
        {/* The Wheel Container */}
        <div style={{ position: 'relative', width: '300px', height: '300px' }}>
          {/* Pointer */}
          <div style={{ 
            position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', 
            width: 0, height: 0, borderLeft: '15px solid transparent', borderRight: '15px solid transparent', 
            borderTop: '30px solid var(--text-main)', zIndex: 10 
          }} />

          {/* The Conic Wheel */}
          <div style={{ 
            width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', position: 'relative',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)', border: '4px solid var(--panel-border)',
            background: `conic-gradient(
              #EF4444 0deg 60deg, 
              #10B981 60deg 120deg, 
              #EF4444 120deg 180deg, 
              #8B5CF6 180deg 240deg, 
              #EF4444 240deg 300deg, 
              #F59E0B 300deg 360deg
            )`,
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 4s cubic-bezier(0.1, 0.7, 0.1, 1)'
          }}>
            {SLICES.map((slice, i) => {
              const sliceCenterAngle = (i * 60) + 30; // center of each 60deg slice
              return (
                <div key={i} style={{
                  position: 'absolute', 
                  top: '50%', left: '50%',
                  width: '130px',
                  textAlign: 'right',
                  transformOrigin: '0% 50%',
                  transform: `translateY(-50%) rotate(${sliceCenterAngle - 90}deg)`,
                  color: 'white', fontWeight: 'bold', fontSize: '0.85rem',
                  textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                }}>
                  {slice.label}
                </div>
              );
            })}
          </div>
        </div>

        <button 
          className="btn btn-primary" 
          onClick={handleSpin} 
          disabled={spinning}
          style={{ width: '200px', padding: '1rem', fontSize: '1.2rem' }}
        >
          {spinning ? 'Spinning...' : 'SPIN NOW'}
        </button>
      </div>
    </div>
  );
};
