import React, { useState, useEffect } from 'react';
import { estimateGasForTransfer, sendEth } from '../lib/wallet';
import type { Network } from '../lib/wallet';
import { checkSuspiciousAddress, analyzeTransactionError } from '../lib/agent';
import { Send, ArrowRight, Info, AlertTriangle, CheckCircle } from 'lucide-react';

interface SendViewProps {
  address: string;
  privateKey: string;
  network: Network;
}

export const SendView: React.FC<SendViewProps> = ({ address, privateKey, network }) => {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [gasEstimate, setGasEstimate] = useState<string | null>(null);
  
  const [agentMsg, setAgentMsg] = useState<{type: 'warning' | 'info' | 'error' | 'success', text: string} | null>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // Agentic validation on address
    if (toAddress.length === 42 && toAddress.startsWith('0x')) {
      const suspicious = checkSuspiciousAddress(toAddress);
      if (suspicious) {
        setAgentMsg({ type: 'error', text: suspicious });
      } else {
        setAgentMsg({ type: 'info', text: 'Address format looks good.' });
        // Estimate Gas
        if (amount && Number(amount) > 0) {
          estimate();
        }
      }
    } else {
      setGasEstimate(null);
      if (toAddress.length > 0) {
        setAgentMsg({ type: 'warning', text: 'Waiting for valid 42-character Ethereum address.' });
      } else {
        setAgentMsg(null);
      }
    }
  }, [toAddress, amount, network]);

  const estimate = async () => {
    try {
      const est = await estimateGasForTransfer(address, toAddress, amount, network);
      setGasEstimate(est);
    } catch (e: any) {
      setAgentMsg({ type: 'error', text: analyzeTransactionError(e.message) });
      setGasEstimate(null);
    }
  };

  const handleSend = async () => {
    setIsSending(true);
    setAgentMsg({ type: 'info', text: 'Broadcasting transaction to ' + network + '...' });
    try {
      const tx = await sendEth(privateKey, toAddress, amount, network);
      setAgentMsg({ type: 'success', text: 'Transaction Sent! Hash: ' + tx.hash });
      setAmount('');
      setToAddress('');
    } catch (e: any) {
      setAgentMsg({ type: 'error', text: analyzeTransactionError(e.message) });
    }
    setIsSending(false);
  };

  return (
    <div className="flex-col gap-6" style={{ maxWidth: '600px', width: '100%', margin: '0 auto' }}>
      <div className="glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <Send color="var(--accent-color)" size={28} />
          <h2>Send ETH</h2>
        </div>

        {agentMsg && (
          <div className={`agent-alert ${agentMsg.type === 'error' ? 'danger' : agentMsg.type === 'warning' ? 'warning' : ''}`} style={{ marginBottom: '1.5rem' }}>
            {agentMsg.type === 'error' && <AlertTriangle size={20} />}
            {agentMsg.type === 'info' && <Info size={20} />}
            {agentMsg.type === 'success' && <CheckCircle size={20} />}
            <p className="text-sm font-medium" style={{ wordBreak: 'break-all' }}>{agentMsg.text}</p>
          </div>
        )}

        <div className="input-group">
          <label className="input-label">Recipient Address</label>
          <input 
            type="text" 
            className="input-field" 
            placeholder="0x..." 
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Amount (ETH)</label>
          <input 
            type="number" 
            className="input-field" 
            placeholder="0.0" 
            min="0"
            step="0.0001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {gasEstimate && (
          <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.1)', borderRadius: '12px', margin: '1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Estimated Gas Fee:</span>
            <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>~{Number(gasEstimate).toFixed(6)} ETH</span>
          </div>
        )}

        <button 
          className="btn btn-primary w-full" 
          onClick={handleSend}
          disabled={isSending || !toAddress || !amount || !gasEstimate}
          style={{ padding: '1rem' }}
        >
          {isSending ? 'Sending...' : 'Confirm Transaction'} <ArrowRight size={18} />
        </button>

      </div>
    </div>
  );
};
