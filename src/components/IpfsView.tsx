import React, { useState, useEffect } from 'react';
import { uploadIdentityToIpfs, getAllIdentities, getIpfsUrl } from '../lib/ipfs';
import { HardDrive, UserCheck, ShieldAlert, CheckCircle, Link as LinkIcon, AlertTriangle, FileText } from 'lucide-react';

interface IpfsViewProps {
  address: string;
}

export const IpfsView: React.FC<IpfsViewProps> = ({ address }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedCid, setUploadedCid] = useState('');
  const [error, setError] = useState('');

  // Admin state
  const [adminData, setAdminData] = useState<any[]>([]);
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  const adminAddress = import.meta.env.VITE_ADMIN_ADDRESS;
  const isAdmin = adminAddress && address.toLowerCase() === adminAddress.toLowerCase();

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const loadAdminData = async () => {
    setLoadingAdmin(true);
    try {
      const data = await getAllIdentities();
      setAdminData(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoadingAdmin(false);
  };

  const handleUploadPAN = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    setUploadedCid('');
    try {
      const cid = await uploadIdentityToIpfs(address, file);
      setUploadedCid(cid);
    } catch (err: any) {
      setError(err.message);
    }
    setUploading(false);
  };

  if (isAdmin) {
    return (
      <div className="flex-col gap-6" style={{ maxWidth: '1000px', width: '100%', margin: '0 auto' }}>
        <div className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <ShieldAlert color="var(--success)" size={28} />
            <h2>Admin Dashboard: User Identities</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            As the admin, you have exclusive access to view the uploaded PAN identity documents of all users across the platform.
          </p>

          {error && <div className="agent-alert danger mb-4"><p>{error}</p></div>}

          {loadingAdmin ? (
            <p className="animate-pulse-slow">Pinging Pinata network for user data...</p>
          ) : (
            <div style={{ background: 'rgba(0,0,0,0.1)', borderRadius: '12px', padding: '1rem' }}>
              {adminData.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No user identities found.</p>
              ) : (
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--panel-border)' }}>
                      <th style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>Date</th>
                      <th style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>User Address</th>
                      <th style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>Document CID</th>
                      <th style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminData.map((item) => (
                      <tr key={item.ipfs_pin_hash} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '1rem 0', fontSize: '0.875rem' }}>{new Date(item.date_pinned).toLocaleDateString()}</td>
                        <td style={{ padding: '1rem 0', fontFamily: 'monospace', color: 'var(--accent-color)' }}>
                          {item.metadata?.keyvalues?.address || 'Unknown'}
                        </td>
                        <td style={{ padding: '1rem 0', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                          {item.ipfs_pin_hash.slice(0, 8)}...{item.ipfs_pin_hash.slice(-8)}
                        </td>
                        <td style={{ padding: '1rem 0' }}>
                          <a href={getIpfsUrl(item.ipfs_pin_hash)} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                            View PAN
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Normal User View
  return (
    <div className="flex-col gap-6" style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
      
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <UserCheck color="var(--accent-color)" size={28} />
          <h2>Identity Verification (KYC)</h2>
        </div>
        
        <p style={{ color: 'var(--text-muted)', marginBottom: '0' }}>
          To comply with regulatory requirements, please upload a copy of your PAN card. 
          Your document will be securely pinned to IPFS and visible only to the platform admin.
        </p>
      </div>

      <div className="glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <HardDrive color="var(--accent-color)" size={24} />
          <h3>Upload PAN Document</h3>
        </div>

        {error && (
          <div className="agent-alert danger mb-4">
            <AlertTriangle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div style={{ 
          border: '2px dashed var(--panel-border)', 
          borderRadius: '16px', 
          padding: '3rem', 
          textAlign: 'center',
          cursor: 'pointer',
          background: 'rgba(0,0,0,0.05)',
          transition: 'all 0.2s ease',
          marginBottom: '1.5rem'
        }}
        onClick={() => document.getElementById('panUpload')?.click()}
        >
          <input 
            id="panUpload" 
            type="file" 
            accept="image/*,.pdf"
            style={{ display: 'none' }} 
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
          />
          <FileText size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
          {file ? (
            <div>
              <p style={{ fontWeight: 600 }}>{file.name}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Click to select your PAN Card file</p>
          )}
        </div>

        <button 
          className="btn btn-primary w-full" 
          onClick={handleUploadPAN}
          disabled={!file || uploading}
        >
          {uploading ? 'Encrypting & Pinning to IPFS...' : 'Securely Upload PAN'}
        </button>

        {uploadedCid && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', borderLeft: '4px solid var(--success)' }}>
            <h4 style={{ color: 'var(--success)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={18} /> Verification Submitted
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Your document has been sent to the admin for review.</p>
            <div className="input-group">
              <label className="input-label">Document CID Reference</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" className="input-field" readOnly value={uploadedCid} style={{ fontFamily: 'monospace' }} />
                <a href={getIpfsUrl(uploadedCid)} target="_blank" rel="noreferrer" className="btn btn-secondary">
                  <LinkIcon size={18} />
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
