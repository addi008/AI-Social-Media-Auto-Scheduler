import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  Calendar, 
  Share2, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ activePage, setActivePage, connectedCount, collapsed, setCollapsed }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'generator', label: 'AI Generator', icon: Sparkles },
    { id: 'schedule', label: 'Queue & Calendar', icon: Calendar },
    { id: 'accounts', label: 'Social Channels', icon: Share2, count: connectedCount },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className={`sidebar glass-panel ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo">
        <div className="logo-icon flex-center">
          <Sparkles size={20} className="logo-spark" />
        </div>
        <div className="logo-text">
          <h2>Aether</h2>
          <span>Publish</span>
        </div>
        <button 
          className="sidebar-toggle-btn flex-center"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
            >
              <Icon size={18} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span className="nav-badge flex-center">{item.count}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="profile-card">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
            alt="User avatar" 
            className="avatar" 
          />
          <div className="profile-info">
            <h4 className="profile-name">Alex Rivera</h4>
            <span className="profile-role">Digital Creator</span>
          </div>
        </div>
      </div>
      
      <style>{`
        .sidebar {
          width: 260px;
          height: calc(100vh - 2rem);
          margin: 1rem;
          display: flex;
          flex-direction: column;
          padding: 1.5rem 1rem;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
          border-radius: var(--radius-lg);
          background: rgba(12, 15, 34, 0.7);
          transition: width var(--transition-normal), padding var(--transition-normal);
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          margin-bottom: 2rem;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--grad-primary);
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
          color: white;
          flex-shrink: 0;
        }

        .logo-spark {
          animation: pulse-glow 2s infinite ease-in-out;
        }

        .logo-text {
          transition: opacity var(--transition-fast);
          overflow: hidden;
        }

        .logo-text h2 {
          font-size: 1.25rem;
          font-family: var(--font-display);
          line-height: 1;
        }

        .logo-text span {
          font-size: 0.75rem;
          color: var(--accent-cyan);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 700;
        }

        .sidebar-toggle-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          color: var(--text-secondary);
          cursor: pointer;
          width: 24px;
          height: 24px;
          margin-left: auto;
          transition: all var(--transition-fast);
        }

        .sidebar-toggle-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1rem;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-family: var(--font-main);
          font-weight: 600;
          font-size: 0.9rem;
          text-align: left;
          width: 100%;
          transition: all var(--transition-fast);
          position: relative;
          overflow: hidden;
        }

        .nav-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 25%;
          height: 50%;
          width: 3px;
          background: var(--accent-indigo);
          border-radius: 0 4px 4px 0;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform var(--transition-fast);
        }

        .nav-item:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.03);
        }

        .nav-item.active {
          color: white;
          background: rgba(99, 102, 241, 0.12);
          border: 1px solid rgba(99, 102, 241, 0.1);
        }

        .nav-item.active::before {
          transform: scaleX(1);
        }

        .nav-icon {
          color: var(--text-secondary);
          transition: color var(--transition-fast);
          flex-shrink: 0;
        }

        .nav-item:hover .nav-icon,
        .nav-item.active .nav-icon {
          color: var(--accent-indigo);
        }

        .nav-badge {
          margin-left: auto;
          background: var(--grad-pink);
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.1rem 0.5rem;
          border-radius: 10px;
          min-width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          overflow: hidden;
        }

        .profile-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
        }

        .profile-card .avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 2px solid var(--accent-indigo);
          object-fit: cover;
          flex-shrink: 0;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: opacity var(--transition-fast);
        }

        .profile-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .profile-role {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        /* Collapsed Sidebar Styles */
        .sidebar.collapsed {
          width: 70px;
          padding: 1.5rem 0.5rem;
        }

        .sidebar.collapsed .logo-text,
        .sidebar.collapsed .nav-label,
        .sidebar.collapsed .profile-info {
          display: none;
        }

        .sidebar.collapsed .sidebar-logo {
          justify-content: center;
          margin-bottom: 1.5rem;
          flex-direction: column;
          gap: 0.5rem;
        }

        .sidebar.collapsed .sidebar-toggle-btn {
          margin-left: 0;
          margin-top: 0.25rem;
        }

        .sidebar.collapsed .nav-item {
          justify-content: center;
          padding: 0.85rem 0;
        }

        .sidebar.collapsed .nav-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          margin-left: 0;
        }

        .sidebar.collapsed .profile-card {
          justify-content: center;
          padding: 0.5rem 0;
        }

        @media (max-width: 992px) {
          .sidebar {
            width: 70px;
            padding: 1.5rem 0.5rem;
          }
          .logo-text, .nav-label, .profile-info, .sidebar-footer {
            display: none;
          }
          .nav-badge {
            position: absolute;
            top: 4px;
            right: 4px;
            margin-left: 0;
          }
          .sidebar-logo {
            justify-content: center;
            margin-bottom: 1.5rem;
          }
          .nav-item {
            justify-content: center;
            padding: 0.85rem 0;
          }
          .sidebar-toggle-btn {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
