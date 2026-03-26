import React, { useEffect, useState } from 'react';
import { getEthBalance } from '../lib/wallet';
import type { Network } from '../lib/wallet';
import { Activity, Copy, ExternalLink, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface DashboardViewProps {
  address: string;
  network: Network;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ address, network }) => {
  const [balance, setBalance] = useState<string>('0.0');

  const fetchBalance = async () => {
    try {
      const bal = await getEthBalance(address, network);
      setBalance(Number(bal).toFixed(4));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, [address, network]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    // Could add toast here
  };

  return (
    <div className="flex-col gap-6" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Hero Balance Card */}
      <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--accent-glow)', filter: 'blur(50px)', borderRadius: '50%' }}></div>
        <div className="flex-between">
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Available Balance</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
              <h1 style={{ fontSize: '3rem', margin: 0 }}>{balance}</h1>
              <span style={{ fontSize: '1.25rem', color: 'var(--accent-color)', fontWeight: 600 }}>ETH</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
                <button onClick={copyToClipboard} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer' }}>
                  <Copy size={14} />
                </button>
              </div>
              <a href={`https://${network}.etherscan.io/address/${address}`} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
          
          <div style={{ padding: '0.5rem', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <QRCodeSVG value={`ethereum:${address}`} size={80} level="L" includeMargin={false} />
          </div>
        </div>
      </div>

      {/* Grid for Actions or Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
         <div className="glass-card flex-center flex-col" style={{ gap: '1rem', padding: '2rem' }}>
            <Activity color="var(--accent-color)" size={32} />
            <h3 style={{ margin: 0 }}>Network Status</h3>
            <span style={{ color: 'var(--success)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }}></span>
              {network.charAt(0).toUpperCase() + network.slice(1)} Active
            </span>
         </div>
         <div className="glass-card flex-center flex-col" style={{ gap: '1rem', padding: '2rem' }}>
            <ShieldCheck color="var(--success)" size={32} />
            <h3 style={{ margin: 0 }}>Security Agent</h3>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center' }}>Transactions monitored & protected</span>
         </div>
      </div>

    </div>
  );
};
