import React, { useState } from 'react';
import { generateWallet, importWalletFromMnemonic, importWalletFromPk } from '../lib/wallet';
import { encryptPrivateKey } from '../lib/crypto';
import { Shield, Key, PlusCircle, ArrowRight, Lock } from 'lucide-react';

interface AuthViewProps {
  onUnlock: (privateKey: string, address: string) => void;
  hasExistingWallet: boolean;
  attemptUnlock (pin: string): boolean;
}

export const AuthView: React.FC<AuthViewProps> = ({ onUnlock, hasExistingWallet, attemptUnlock }) => {
  const [mode, setMode] = useState<'login' | 'create' | 'import'>(hasExistingWallet ? 'login' : 'create');
  const [pin, setPin] = useState('');
  const [importKey, setImportKey] = useState('');
  const [error, setError] = useState('');
  const [generated, setGenerated] = useState<{ address: string, privateKey: string, mnemonic?: string } | null>(null);

  const handleCreate = () => {
    try {
      const wallet = generateWallet();
      setGenerated(wallet);
      setMode('create');
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleSaveNewWallet = () => {
    if (pin.length < 4) {
      setError("PIN must be at least 4 characters");
      return;
    }
    if (generated) {
      const encrypted = encryptPrivateKey(generated.privateKey, pin);
      localStorage.setItem('vector_wallet_enc', encrypted);
      localStorage.setItem('vector_address', generated.address);
      localStorage.setItem('vector_network', 'sepolia');
      onUnlock(generated.privateKey, generated.address);
    }
  };

  const handleImport = () => {
    if (pin.length < 4) {
      setError("PIN must be at least 4 characters");
      return;
    }
    try {
      let wallet;
      if (importKey.includes(' ')) {
        wallet = importWalletFromMnemonic(importKey);
      } else {
        wallet = importWalletFromPk(importKey.startsWith('0x') ? importKey : '0x' + importKey);
      }
      const encrypted = encryptPrivateKey(wallet.privateKey, pin);
      localStorage.setItem('vector_wallet_enc', encrypted);
      localStorage.setItem('vector_address', wallet.address);
      localStorage.setItem('vector_network', 'sepolia');
      onUnlock(wallet.privateKey, wallet.address);
    } catch (e: any) {
      setError("Import failed: " + e.message);
    }
  };

  const handleLogin = () => {
    if (!attemptUnlock(pin)) {
      setError("Invalid PIN");
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', width: '100vw' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '480px' }}>
        <div className="flex-center" style={{ marginBottom: '2rem', gap: '1rem' }}>
          <Shield size={40} color="var(--accent-color)" className="animate-pulse-slow" />
          <h2 className="text-gradient">Vector Wallet</h2>
        </div>

        {error && (
          <div className="agent-alert danger">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {mode === 'login' && (
          <div className="flex-col gap-4">
            <div className="input-group">
              <label className="input-label">Enter PIN to Unlock</label>
              <div className="flex-center" style={{ gap: '0.5rem' }}>
                <Lock size={20} color="var(--text-muted)" />
                <input 
                  type="password" 
                  className="input-field" 
                  placeholder="••••" 
                  value={pin}
                  onChange={(e) => { setPin(e.target.value); setError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
            </div>
            <button className="btn btn-primary w-full mt-4" onClick={handleLogin}>
              Unlock Wallet <ArrowRight size={18} />
            </button>
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button className="btn btn-secondary text-sm" onClick={() => setMode('create')}>
                Reset / Create New
              </button>
            </div>
          </div>
        )}

        {mode === 'create' && !generated && (
          <div className="flex-col gap-4">
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.5rem' }}>
              Create a new secure, self-custodial wallet for the Sepolia network.
            </p>
            <button className="btn btn-primary w-full" onClick={handleCreate}>
              Generate New Wallet <PlusCircle size={18} />
            </button>
            <div style={{ margin: '1rem 0', textAlign: 'center', color: 'var(--panel-border)' }}>OR</div>
            <button className="btn btn-secondary w-full" onClick={() => setMode('import')}>
              Import Existing Wallet <Key size={18} />
            </button>
            {hasExistingWallet && (
              <button className="btn btn-secondary w-full" style={{ marginTop: '1rem' }} onClick={() => setMode('login')}>
                Back to Login
              </button>
            )}
          </div>
        )}

        {mode === 'create' && generated && (
          <div className="flex-col gap-4">
            <div className="agent-alert warning">
              <p className="text-sm"><strong>Backup Requirement:</strong> Save this recovery phrase securely. If you lose it, you lose access to your funds.</p>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', wordBreak: 'break-all', fontFamily: 'monospace', color: 'var(--accent-color)' }}>
              {generated.mnemonic || generated.privateKey}
            </div>
            <div className="input-group mt-4">
              <label className="input-label">Set a highly secure PIN</label>
              <input 
                type="password" 
                className="input-field" 
                placeholder="New PIN" 
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
            </div>
            <button className="btn btn-primary w-full" onClick={handleSaveNewWallet}>
              I've saved it, encrypt & continue
            </button>
          </div>
        )}

        {mode === 'import' && (
          <div className="flex-col gap-4">
            <div className="input-group">
              <label className="input-label">Mnemonic Phrase or Private Key</label>
              <textarea 
                className="input-field" 
                rows={3}
                placeholder="Enter 12-24 word phrase or 0x..." 
                value={importKey}
                onChange={(e) => setImportKey(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Set a local PIN</label>
              <input 
                type="password" 
                className="input-field" 
                placeholder="New PIN for this device" 
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
            </div>
            <button className="btn btn-primary w-full" onClick={handleImport}>
              Import & Encrypt <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary w-full" style={{ marginTop: '0.5rem' }} onClick={() => setMode('create')}>
              Cancel
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
