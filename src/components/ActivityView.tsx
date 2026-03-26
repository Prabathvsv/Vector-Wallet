import React, { useState, useEffect } from 'react';
import type { Network } from '../lib/wallet';
import { History, ArrowUpRight, ArrowDownLeft, ExternalLink, AlertTriangle } from 'lucide-react';
import { ethers } from 'ethers';

interface ActivityViewProps {
  address: string;
  network: Network;
}

const CHAIN_IDS = {
  sepolia: '11155111',
  mainnet: '1'
};

const WEB_EXPLORERS = {
  sepolia: 'https://sepolia.etherscan.io',
  mainnet: 'https://etherscan.io'
};

export const ActivityView: React.FC<ActivityViewProps> = ({ address, network }) => {
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, network]);

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const chainId = CHAIN_IDS[network];
      const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY || '';
      const keyParam = apiKey ? `&apikey=${apiKey}` : '';
      
      const res = await fetch(`https://api.etherscan.io/v2/api?chainid=${chainId}&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc${keyParam}`);
      const data = await res.json();
      
      if (data.status === '1' && Array.isArray(data.result)) {
        setTxs(data.result);
      } else {
        if (data.message === 'No transactions found') {
          setTxs([]);
        } else {
          setError(data.result || 'Failed to fetch transaction history. Note: Public APIs may be rate limited.');
        }
      }
    } catch (e: any) {
      setError('Network error: ' + e.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex-col gap-6" style={{ maxWidth: '900px', width: '100%', margin: '0 auto' }}>
      <div className="glass-panel" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <History color="var(--accent-color)" size={28} />
          <h2>Transaction History</h2>
        </div>
        <p style={{ color: 'var(--text-muted)' }}>
          Showing the last 50 transactions for your account on the {network.charAt(0).toUpperCase() + network.slice(1)} network.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        {error && (
          <div className="agent-alert warning" style={{ margin: '1.5rem' }}>
            <AlertTriangle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p className="animate-pulse-slow">Syncing ledger from Etherscan...</p>
          </div>
        ) : (
          <div>
            {txs.length === 0 && !error ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p>No transactions found for this address.</p>
              </div>
            ) : (
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {txs.map((tx) => {
                  const isIncoming = tx.to.toLowerCase() === address.toLowerCase();
                  const valueEth = ethers.formatEther(tx.value);
                  const date = new Date(parseInt(tx.timeStamp) * 1000).toLocaleString();
                  const isError = tx.isError === '1';

                  return (
                    <div 
                      key={tx.hash} 
                      style={{ 
                        padding: '1.5rem', 
                        borderBottom: '1px solid var(--panel-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        background: 'rgba(0,0,0,0.02)',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'}
                    >
                      {/* Left: Icon & Info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ 
                          width: '40px', height: '40px', borderRadius: '50%', 
                          background: isError ? 'rgba(239, 68, 68, 0.1)' : isIncoming ? 'rgba(16, 185, 129, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          {isIncoming ? <ArrowDownLeft color="var(--success)" size={20} /> : <ArrowUpRight color="var(--accent-color)" size={20} />}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: 600 }}>{isIncoming ? 'Received' : 'Sent'}</span>
                            {isError && <span style={{ fontSize: '0.7rem', background: 'var(--danger)', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>FAILED</span>}
                          </div>
                          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{date}</span>
                        </div>
                      </div>

                      {/* Right: Amounts & Link */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', textAlign: 'right' }}>
                        <div>
                          <strong style={{ display: 'block', color: isIncoming ? 'var(--success)' : 'var(--text-main)', fontSize: '1.1rem' }}>
                            {isIncoming ? '+' : '-'}{parseFloat(valueEth).toFixed(4)} ETH
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            To: {tx.to ? tx.to.slice(0, 6) + '...' + tx.to.slice(-4) : 'Contract Gen'}
                          </span>
                        </div>
                        <a 
                          href={`${WEB_EXPLORERS[network]}/tx/${tx.hash}`}
                          target="_blank" 
                          rel="noreferrer"
                          className="btn btn-secondary"
                          style={{ padding: '0.5rem', borderRadius: '10px' }}
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
