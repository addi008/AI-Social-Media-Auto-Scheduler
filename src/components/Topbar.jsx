import React from 'react';
import { Plus, Bell, Menu } from 'lucide-react';

const Topbar = ({ activePage, onOpenCreateModal, connectedAccounts = {}, sidebarCollapsed, setSidebarCollapsed }) => {
  const pageTitles = {
    dashboard: 'Workspace Overview',
    generator: 'AI Creative Studio',
    schedule: 'Queue & Calendar',
    accounts: 'Connected Channels',
    analytics: 'Performance Intelligence',
    settings: 'System Configuration',
  };

  const title = pageTitles[activePage] || 'AetherPublish';

  return (
    <header className={`topbar glass-panel ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="topbar-left flex-center" style={{ gap: '0.75rem' }}>
        {sidebarCollapsed && (
          <button 
            className="icon-btn flex-center toggle-sidebar-top-btn" 
            onClick={() => setSidebarCollapsed(false)}
            title="Expand Sidebar"
          >
            <Menu size={18} />
          </button>
        )}
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="topbar-right">
        {/* Connected platforms status dots */}
        <div className="connected-indicator-group flex-center">
          {Object.entries(connectedAccounts).map(([platform, account]) => {
            if (!account.connected) return null;
            return (
              <div 
                key={platform} 
                className="platform-dot-badge flex-center"
                title={`${account.name} (${account.handle}) Connected`}
              >
                <img src={account.avatar} alt={account.name} className="platform-dot-avatar" />
                <span className="platform-active-ping"></span>
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <button className="icon-btn flex-center" title="Notifications">
          <Bell size={18} />
          <span className="bell-ping"></span>
        </button>

        <button className="btn btn-primary btn-sm flex-center" onClick={onOpenCreateModal}>
          <Plus size={16} />
          <span>Create Post</span>
        </button>
      </div>

      <style>{`
        .topbar {
          position: fixed;
          top: 0;
          right: 0;
          left: 280px; /* Width of sidebar + margins */
          height: 64px;
          margin: 1rem;
          margin-left: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          z-index: 90;
          border-radius: var(--radius-md);
          background: rgba(12, 15, 34, 0.7);
          transition: left var(--transition-normal);
        }

        .topbar.sidebar-collapsed {
          left: 90px;
        }

        .page-title {
          font-size: 1.25rem;
          font-family: var(--font-display);
          font-weight: 700;
          background: linear-gradient(135deg, white 0%, #cbd5e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .connected-indicator-group {
          display: flex;
          gap: 0.5rem;
          padding-right: 1rem;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
        }

        .platform-dot-badge {
          position: relative;
          width: 28px;
          height: 28px;
        }

        .platform-dot-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 1px solid rgba(99, 102, 241, 0.3);
          object-fit: cover;
        }

        .platform-active-ping {
          position: absolute;
          bottom: -1px;
          right: -1px;
          width: 8px;
          height: 8px;
          background: var(--accent-emerald);
          border-radius: 50%;
          border: 1.5px solid var(--bg-primary);
          box-shadow: 0 0 6px var(--accent-emerald);
        }

        .icon-btn {
          width: 34px;
          height: 34px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          color: var(--text-secondary);
          cursor: pointer;
          position: relative;
          transition: all var(--transition-fast);
        }

        .icon-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .bell-ping {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 6px;
          height: 6px;
          background: var(--accent-rose);
          border-radius: 50%;
        }

        @media (max-width: 992px) {
          .topbar {
            left: 90px;
          }
          .toggle-sidebar-top-btn {
            display: none;
          }
        }

        @media (max-width: 600px) {
          .topbar-left {
            display: none;
          }
          .topbar {
            padding: 0 1rem;
          }
        }
      `}</style>
    </header>
  );
};

export default Topbar;
