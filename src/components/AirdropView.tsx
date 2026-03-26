import React, { useState } from 'react';
import type { Network } from '../lib/wallet';
import { sendEth } from '../lib/wallet';
import { Gamepad2, AlertTriangle, CheckCircle, CircleDashed, Key, RotateCw, Target } from 'lucide-react';

import { SpinWheelGame } from './games/SpinWheelGame';
import { SeedMatchGame } from './games/SeedMatchGame';
import { SimonSaysGame } from './games/SimonSaysGame';
import { HumanVerificationGame } from './games/HumanVerificationGame';
import { VaultOpener } from './games/VaultOpener';

interface AirdropViewProps {
  address: string;
  network: Network;
}

export const AirdropView: React.FC<AirdropViewProps> = ({ address, network }) => {
  const [activeGame, setActiveGame] = useState<'spin' | 'seed' | 'simon' | 'human' | null>(null);
  const [pendingReward, setPendingReward] = useState<string | null>(null);
  const [payoutStatus, setPayoutStatus] = useState<{ type: 'success' | 'error' | 'loading', msg: string } | null>(null);

  const handleWin = (amount: string) => {
    setActiveGame(null);
    setPendingReward(amount);
  };

  const claimAirdrop = async (amount: string) => {
    setPendingReward(null); // Clear vault to show loading
    
    const faucetKey = import.meta.env.VITE_FAUCET_PRIVATE_KEY;
    if (!faucetKey) {
      setPayoutStatus({ type: 'error', msg: 'Payout failed: Faucet private key not configured by admin.' });
      return;
    }
    
    if (network === 'mainnet') {
      setPayoutStatus({ type: 'error', msg: 'Airdrop is disabled on Mainnet! Switch to Sepolia.' });
      return;
    }

    setPayoutStatus({ type: 'loading', msg: `Winner! Claiming your ${amount} Sepolia ETH reward...` });
    try {
      const tx = await sendEth(faucetKey, address, amount, network);
      setPayoutStatus({ type: 'success', msg: `Reward Sent! Transaction Hash: ${tx.hash}` });
    } catch (err: any) {
      setPayoutStatus({ type: 'error', msg: `Transfer failed: ${err.message}` });
    }
  };

  if (pendingReward) return <VaultOpener amount={pendingReward} onOpen={() => claimAirdrop(pendingReward)} />;

  if (activeGame === 'spin') return <SpinWheelGame onWin={handleWin} onBack={() => setActiveGame(null)} />;
  if (activeGame === 'seed') return <SeedMatchGame onWin={handleWin} onBack={() => setActiveGame(null)} />;
  if (activeGame === 'simon') return <SimonSaysGame onWin={handleWin} onBack={() => setActiveGame(null)} />;
  if (activeGame === 'human') return <HumanVerificationGame onWin={handleWin} onBack={() => setActiveGame(null)} />;

  return (
    <div className="flex-col gap-6" style={{ maxWidth: '900px', width: '100%', margin: '0 auto' }}>
      
      <div className="glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Gamepad2 color="var(--accent-color)" size={32} />
          <h2>Web3 Mini-Arcade</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Select a minigame to play. Winning will automatically trigger an authentic smart-contract payout dropping Sepolia ETH into your wallet!
        </p>

        {payoutStatus && (
          <div className={`agent-alert ${payoutStatus.type === 'error' ? 'danger' : payoutStatus.type === 'success' ? '' : 'warning'}`} style={{ marginBottom: '2rem' }}>
            {payoutStatus.type === 'error' && <AlertTriangle size={20} />}
            {payoutStatus.type === 'success' && <CheckCircle size={20} />}
            <p className="text-sm font-medium" style={{ wordBreak: 'break-all' }}>{payoutStatus.msg}</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ cursor: 'pointer', transition: 'transform 0.2s ease', border: '1px solid rgba(139, 92, 246, 0.3)' }} onClick={() => setActiveGame('spin')} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <RotateCw size={32} color="#8B5CF6" style={{ marginBottom: '1rem' }} />
            <h3>Spin the Wheel</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Test your luck to win up to 0.01 ETH.</p>
          </div>

          <div className="glass-panel" style={{ cursor: 'pointer', transition: 'transform 0.2s ease', border: '1px solid rgba(16, 185, 129, 0.3)' }} onClick={() => setActiveGame('seed')} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <Key size={32} color="#10B981" style={{ marginBottom: '1rem' }} />
            <h3>Seed Match</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Flip cards and match BIP-39 mnemonic phrases perfectly.</p>
          </div>

          <div className="glass-panel" style={{ cursor: 'pointer', transition: 'transform 0.2s ease', border: '1px solid rgba(239, 68, 68, 0.3)' }} onClick={() => setActiveGame('simon')} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <CircleDashed size={32} color="#EF4444" style={{ marginBottom: '1rem' }} />
            <h3>Simon Says</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Memorize the sequence of flashing blockchain networks.</p>
          </div>

          <div className="glass-panel" style={{ cursor: 'pointer', transition: 'transform 0.2s ease', border: '1px solid rgba(100, 116, 139, 0.3)' }} onClick={() => setActiveGame('human')} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <Target size={32} color="#64748B" style={{ marginBottom: '1rem' }} />
            <h3>Human Verifier</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Prove you are human by clicking the moving target 10 times.</p>
          </div>

        </div>
      </div>
    </div>
  );
};
