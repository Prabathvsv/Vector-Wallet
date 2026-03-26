import { useState, useEffect } from 'react';
import { AuthView } from './components/AuthView';
import { DashboardView } from './components/DashboardView';
import { SendView } from './components/SendView';
import { IpfsView } from './components/IpfsView';
import { AirdropView } from './components/AirdropView';
import { ActivityView } from './components/ActivityView';
import type { Network } from './lib/wallet';
import { decryptPrivateKey } from './lib/crypto';
import { Shield, Home, Send as SendIcon, HardDrive, Moon, Sun, LogOut, Gift, History } from 'lucide-react';
import './index.css';

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');
  const [network, setNetwork] = useState<Network>('sepolia');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'send' | 'ipfs' | 'airdrop' | 'settings'>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const savedNetwork = localStorage.getItem('vector_network') as Network;
    if (savedNetwork) setNetwork(savedNetwork);
  }, []);

  const hasExistingWallet = !!localStorage.getItem('vector_wallet_enc');

  const attemptUnlock = (pin: string): boolean => {
    const enc = localStorage.getItem('vector_wallet_enc');
    const addr = localStorage.getItem('vector_address');
    if (!enc || !addr) return false;
    
    const pk = decryptPrivateKey(enc, pin);
    if (pk) {
      setPrivateKey(pk);
      setAddress(addr);
      setIsUnlocked(true);
      return true;
    }
    return false;
  };

  const handleUnlock = (pk: string, addr: string) => {
    setPrivateKey(pk);
    setAddress(addr);
    setIsUnlocked(true);
  };

  const handleLock = () => {
    setPrivateKey('');
    setIsUnlocked(false);
  };

  if (!isUnlocked) {
    return (
      <AuthView 
        hasExistingWallet={hasExistingWallet} 
        attemptUnlock={attemptUnlock} 
        onUnlock={handleUnlock} 
      />
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <div className="sidebar" style={{ position: 'fixed', height: '100vh', left: 0, top: 0, zIndex: 10 }}>
        <div className="flex-center flex-col" style={{ padding: '2rem 0', gap: '1rem', borderBottom: '1px solid var(--panel-border)' }}>
          <Shield size={48} color="var(--accent-color)" className="animate-pulse-slow" />
          <h2 className="text-gradient" style={{ margin: 0 }}>Vector</h2>
          <span style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.2)', padding: '0.25rem 0.75rem', borderRadius: '12px' }}>
            {network.toUpperCase()}
          </span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '2rem', flex: 1 }}>
          <button 
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ justifyContent: 'flex-start', border: 'none' }}
            onClick={() => setActiveTab('dashboard')}
          >
            <Home size={18} /> Dashboard
          </button>
          <button 
            className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ justifyContent: 'flex-start', border: 'none' }}
            onClick={() => setActiveTab('history')}
          >
            <History size={18} /> History
          </button>
          <button 
            className={`btn ${activeTab === 'send' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ justifyContent: 'flex-start', border: 'none' }}
            onClick={() => setActiveTab('send')}
          >
            <SendIcon size={18} /> Send ETH
          </button>
          <button 
            className={`btn ${activeTab === 'ipfs' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ justifyContent: 'flex-start', border: 'none' }}
            onClick={() => setActiveTab('ipfs')}
          >
            <HardDrive size={18} /> IPFS Storage
          </button>
          <button 
            className={`btn ${activeTab === 'airdrop' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ justifyContent: 'flex-start', border: 'none' }}
            onClick={() => setActiveTab('airdrop')}
          >
            <Gift size={18} /> Airdrop Game
          </button>
        </nav>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            className="btn btn-secondary flex-center" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />} Toggle Theme
          </button>
          <button 
            className="btn btn-secondary flex-center" 
            style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
            onClick={handleLock}
          >
            <LogOut size={18} /> Lock Session
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content" style={{ marginLeft: '280px', width: 'calc(100% - 280px)' }}>
        <header style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '2rem', borderBottom: '1px solid var(--panel-border)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Network Switch:</span>
            <select 
              className="input-field" 
              style={{ padding: '0.5rem 1rem', width: 'auto' }}
              value={network}
              onChange={(e) => {
                const net = e.target.value as Network;
                setNetwork(net);
                localStorage.setItem('vector_network', net);
              }}
            >
              <option value="sepolia">Sepolia Testnet</option>
              <option value="mainnet">Ethereum Mainnet</option>
            </select>
          </div>
        </header>

        <main>
          {activeTab === 'dashboard' && <DashboardView address={address} network={network} />}
          {activeTab === 'history' && <ActivityView address={address} network={network} />}
          {activeTab === 'send' && <SendView address={address} privateKey={privateKey} network={network} />}
          {activeTab === 'ipfs' && <IpfsView address={address} />}
          {activeTab === 'airdrop' && <AirdropView address={address} network={network} />}
        </main>
      </div>
    </div>
  );
}

export default App;
