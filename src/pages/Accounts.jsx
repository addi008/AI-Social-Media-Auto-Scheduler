import React, { useState } from 'react';
import { 
  Share2, 
  Link2, 
  Link2Off,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { 
  TwitterIcon as Twitter, 
  LinkedinIcon as Linkedin, 
  InstagramIcon as Instagram, 
  FacebookIcon as Facebook 
} from '../components/BrandIcons';

const Accounts = ({ accounts = {}, onUpdateAccounts }) => {
  const [connectingPlatform, setConnectingPlatform] = useState(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const getPlatformIcon = (platform, size = 20) => {
    switch (platform) {
      case 'twitter': return <Twitter size={size} style={{ color: '#1d9bf0' }} />;
      case 'linkedin': return <Linkedin size={size} style={{ color: '#0a66c2' }} />;
      case 'instagram': return <Instagram size={size} style={{ color: '#e1306c' }} />;
      case 'facebook': return <Facebook size={size} style={{ color: '#1877f2' }} />;
      default: return <Share2 size={size} />;
    }
  };

  const handleConnectClick = (platform) => {
    setConnectingPlatform(platform);
    setIsAuthorizing(false);
  };

  const handleMockAuthorize = () => {
    setIsAuthorizing(true);
    
    // Simulate OAuth consent loading
    setTimeout(() => {
      const updated = { ...accounts };
      let handle = '@aether_pub';
      let name = 'Aether Brand';
      let followers = 1500;
      let avatar = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80';

      if (connectingPlatform === 'instagram') {
        handle = '@aether.gallery';
        name = 'Aether Visuals';
        followers = 2840;
        avatar = 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=120&q=80';
      } else if (connectingPlatform === 'facebook') {
        handle = 'aether.official';
        name = 'Aether Hub';
        followers = 5400;
        avatar = 'https://images.unsplash.com/photo-1614850727173-1f191b9fa76b?auto=format&fit=crop&w=120&q=80';
      }

      updated[connectingPlatform] = {
        id: connectingPlatform,
        name: name,
        handle: handle,
        connected: true,
        avatar: avatar,
        followers: followers,
        growth: 5.0,
        platform: connectingPlatform
      };

      onUpdateAccounts(updated);
      setConnectingPlatform(null);
      setIsAuthorizing(false);
    }, 2000);
  };

  const handleDisconnect = (platform) => {
    const confirmation = window.confirm(`Are you sure you want to disconnect your ${platform.toUpperCase()} profile? Upcoming scheduled posts for this platform will not be published.`);
    if (confirmation) {
      const updated = { ...accounts };
      updated[platform] = {
        ...updated[platform],
        connected: false,
        followers: 0,
        growth: 0
      };
      onUpdateAccounts(updated);
    }
  };

  return (
    <div className="accounts-page animate-fade-in">
      <div className="accounts-header">
        <p className="accounts-description">Connect your social media accounts to enable AI scheduling and synchronization. Credentials are stored securely in your browser.</p>
      </div>

      <div className="accounts-grid">
        {Object.values(accounts).map((acc) => {
          const isConnected = acc.connected;
          
          return (
            <div key={acc.id} className={`account-card glass-panel ${isConnected ? 'connected' : 'disconnected'}`}>
              <div className="card-top-info">
                <div className="platform-icon-shield flex-center">
                  {getPlatformIcon(acc.platform, 24)}
                </div>
                <span className={`status-badge ${isConnected ? 'connected' : ''}`}>
                  {isConnected ? 'Active' : 'Not Linked'}
                </span>
              </div>

              {isConnected ? (
                /* Connected Profile Visuals */
                <div className="profile-details-active flex-center">
                  <img src={acc.avatar} alt={acc.name} className="profile-avatar-big" />
                  <h3 className="profile-name-text">{acc.name}</h3>
                  <span className="profile-handle-text">{acc.handle}</span>

                  <div className="profile-mini-stats">
                    <div className="mini-stat">
                      <span className="stat-num">{acc.followers.toLocaleString()}</span>
                      <span className="stat-lbl">Followers</span>
                    </div>
                    <div className="mini-stat">
                      <span className="stat-num">+{acc.growth}%</span>
                      <span className="stat-lbl">Weekly Growth</span>
                    </div>
                  </div>

                  <button className="btn btn-danger btn-sm disconnect-btn flex-center" onClick={() => handleDisconnect(acc.platform)}>
                    <Link2Off size={13} />
                    <span>Disconnect Channel</span>
                  </button>
                </div>
              ) : (
                /* Disconnected Placeholder UI */
                <div className="profile-details-inactive flex-center">
                  <h3 className="platform-label">{acc.platform.toUpperCase()} Integration</h3>
                  <p className="platform-pitch">Automate post publication, fetch follower statistics and track link clicks instantly.</p>
                  
                  <button className="btn btn-glass btn-sm connect-trigger-btn flex-center" onClick={() => handleConnectClick(acc.platform)}>
                    <Link2 size={13} />
                    <span>Connect Channel</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Simulated OAuth Authorization Consent Modal */}
      {connectingPlatform && (
        <div className="modal-overlay flex-center animate-fade-in">
          <div className="oauth-modal glass-panel">
            {isAuthorizing ? (
              <div className="oauth-loading flex-center">
                <RefreshCw size={36} className="animate-spin text-indigo" />
                <h3>Connecting to {connectingPlatform.toUpperCase()} Securely</h3>
                <p>Establishing handshake connection and retrieving profile credentials...</p>
              </div>
            ) : (
              <div className="oauth-consent-content">
                <div className="oauth-header-branding flex-center">
                  <div className="logo-badge flex-center">A</div>
                  <div className="connection-bar"></div>
                  <div className="platform-badge flex-center">{getPlatformIcon(connectingPlatform, 20)}</div>
                </div>

                <h2 className="oauth-title">Authorize AetherPublish?</h2>
                <p className="oauth-subtitle">AetherPublish is requesting permission to access your <strong>{connectingPlatform.toUpperCase()}</strong> developer application profile.</p>

                <div className="oauth-permissions-box">
                  <h4 className="permissions-label">This application will be able to:</h4>
                  <ul>
                    <li><ShieldCheck size={14} className="shield-icon" /> Publish post copy and upload visual media assets</li>
                    <li><ShieldCheck size={14} className="shield-icon" /> Access public follower metrics and click engagement rates</li>
                    <li><ShieldCheck size={14} className="shield-icon" /> Retrieve profile user handle, name, and avatar image</li>
                  </ul>
                </div>

                <div className="oauth-actions-footer">
                  <button className="btn btn-secondary btn-sm" onClick={() => setConnectingPlatform(null)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary btn-sm flex-center" onClick={handleMockAuthorize}>
                    Authorize App
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .accounts-page {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .accounts-description {
          color: var(--text-secondary);
          font-size: 0.9rem;
          max-width: 600px;
        }

        .accounts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 992px) {
          .accounts-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .accounts-grid {
            grid-template-columns: 1fr;
          }
        }

        .account-card {
          padding: 1.5rem;
          background: rgba(18, 22, 47, 0.65);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          min-height: 320px;
          transition: border-color var(--transition-normal);
        }

        .account-card.connected {
          border-color: rgba(16, 185, 129, 0.25);
        }

        .card-top-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .platform-icon-shield {
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
        }

        .status-badge {
          font-size: 0.725rem;
          font-weight: 700;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.04);
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
        }

        .status-badge.connected {
          background: rgba(16, 185, 129, 0.1);
          color: var(--accent-emerald);
        }

        .profile-details-active {
          flex-direction: column;
          flex: 1;
        }

        .profile-avatar-big {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: 2px solid var(--accent-indigo);
          object-fit: cover;
          margin-bottom: 0.75rem;
          box-shadow: var(--shadow-glow);
        }

        .profile-name-text {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.15rem;
          font-family: var(--font-display);
        }

        .profile-handle-text {
          font-size: 0.775rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }

        .profile-mini-stats {
          display: flex;
          justify-content: space-around;
          width: 100%;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding: 0.75rem 0;
          margin-bottom: 1.25rem;
        }

        .mini-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.15rem;
        }

        .stat-num {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          font-family: var(--font-display);
        }

        .stat-lbl {
          font-size: 0.675rem;
          color: var(--text-muted);
        }

        .disconnect-btn {
          width: 100%;
        }

        .profile-details-inactive {
          flex-direction: column;
          text-align: center;
          flex: 1;
          justify-content: center;
          gap: 0.75rem;
        }

        .platform-label {
          font-size: 1rem;
          font-family: var(--font-display);
          color: var(--text-primary);
        }

        .platform-pitch {
          font-size: 0.775rem;
          color: var(--text-muted);
          line-height: 1.45;
          max-width: 220px;
        }

        .connect-trigger-btn {
          width: 100%;
          margin-top: 0.5rem;
        }

        /* OAuth Consent Dialog modal Specifics */
        .oauth-modal {
          width: 90%;
          max-width: 440px;
          background: var(--bg-surface-opaque);
          border: 1px solid var(--border-color-hover);
          padding: 2rem;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
        }

        .oauth-loading {
          flex-direction: column;
          gap: 1rem;
          text-align: center;
          padding: 1.5rem 0;
        }

        .oauth-loading h3 {
          font-size: 1.05rem;
          font-family: var(--font-display);
        }

        .oauth-loading p {
          font-size: 0.8rem;
          color: var(--text-muted);
          max-width: 260px;
        }

        .text-indigo {
          color: var(--accent-indigo);
        }

        .oauth-header-branding {
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .logo-badge {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--grad-primary);
          color: white;
          font-weight: 800;
          font-size: 0.85rem;
        }

        .connection-bar {
          flex: 1;
          height: 2px;
          background: dashed rgba(255, 255, 255, 0.15);
          border-top: 1px dashed rgba(255, 255, 255, 0.15);
        }

        .platform-badge {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .oauth-title {
          font-size: 1.15rem;
          font-family: var(--font-display);
          text-align: center;
          margin-bottom: 0.5rem;
        }

        .oauth-subtitle {
          font-size: 0.8rem;
          color: var(--text-secondary);
          text-align: center;
          line-height: 1.45;
          margin-bottom: 1.25rem;
        }

        .oauth-permissions-box {
          background: rgba(0, 0, 0, 0.15);
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.03);
          margin-bottom: 1.5rem;
        }

        .permissions-label {
          font-size: 0.775rem;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .oauth-permissions-box ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .oauth-permissions-box li {
          font-size: 0.75rem;
          color: var(--text-secondary);
          display: flex;
          align-items: flex-start;
          gap: 0.35rem;
          line-height: 1.35;
        }

        .shield-icon {
          color: var(--accent-indigo);
          flex-shrink: 0;
          margin-top: 1px;
        }

        .oauth-actions-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default Accounts;
