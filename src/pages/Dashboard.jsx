import React from 'react';
import { 
  Users, 
  Eye, 
  TrendingUp, 
  MousePointer, 
  Calendar, 
  AlertCircle, 
  Edit3, 
  ArrowRight
} from 'lucide-react';
import { 
  TwitterIcon as Twitter, 
  LinkedinIcon as Linkedin, 
  InstagramIcon as Instagram, 
  FacebookIcon as Facebook 
} from '../components/BrandIcons';

const Dashboard = ({ posts = [], accounts = {}, onEditPost, onNavigate }) => {
  // Aggregate accounts metrics
  const activeAccounts = Object.values(accounts).filter(a => a.connected);
  const totalFollowers = activeAccounts.reduce((acc, a) => acc + (a.followers || 0), 0);
  const averageGrowth = activeAccounts.length > 0 
    ? (activeAccounts.reduce((acc, a) => acc + (a.growth || 0), 0) / activeAccounts.length).toFixed(1)
    : '0.0';

  // Get published and scheduled posts
  const publishedPosts = posts.filter(p => p.status === 'published');
  const scheduledPosts = posts.filter(p => p.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
  
  // Calculate total impressions, clicks
  const totalImpressions = publishedPosts.reduce((acc, p) => acc + (p.metrics?.impressions || 0), 0) + 12480; // base seed stats
  const totalClicks = publishedPosts.reduce((acc, p) => acc + (p.metrics?.clicks || 0), 0) + 584;

  const kpis = [
    { title: 'Total Reach', value: totalFollowers.toLocaleString(), icon: Users, change: `+${averageGrowth}%`, color: 'var(--accent-indigo)' },
    { title: 'Impressions', value: totalImpressions.toLocaleString(), icon: Eye, change: '+12.4%', color: 'var(--accent-cyan)' },
    { title: 'Engagement Rate', value: '4.8%', icon: TrendingUp, change: '+0.6%', color: 'var(--accent-purple)' },
    { title: 'Link Clicks', value: totalClicks.toLocaleString(), icon: MousePointer, change: '+8.2%', color: 'var(--accent-pink)' },
  ];

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'twitter': return <Twitter size={14} style={{ color: '#1d9bf0' }} />;
      case 'linkedin': return <Linkedin size={14} style={{ color: '#0a66c2' }} />;
      case 'instagram': return <Instagram size={14} style={{ color: '#e1306c' }} />;
      case 'facebook': return <Facebook size={14} style={{ color: '#1877f2' }} />;
      default: return null;
    }
  };

  // SVG Chart data helper (mini line chart)
  const drawMiniLineChart = () => {
    // Generate static path for visual graph
    const points = [40, 35, 45, 30, 20, 25, 15, 25, 30, 18, 10, 15, 5];
    const width = 280;
    const height = 60;
    const padding = 5;
    
    const xStep = (width - padding * 2) / (points.length - 1);
    const yScale = (height - padding * 2) / 45; // max point is 45

    const pathData = points.map((p, index) => {
      const x = padding + index * xStep;
      const y = height - padding - (45 - p) * yScale;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    return (
      <svg className="mini-chart" width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="gradient-glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-indigo)" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="var(--accent-indigo)" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path 
          d={pathData} 
          fill="none" 
          stroke="var(--accent-indigo)" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <path 
          d={`${pathData} L ${width - padding} ${height} L ${padding} ${height} Z`} 
          fill="url(#gradient-glow)" 
        />
      </svg>
    );
  };

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="dashboard-grid">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="kpi-card glass-panel" style={{ '--border-glow': kpi.color }}>
              <div className="kpi-header">
                <span className="kpi-title">{kpi.title}</span>
                <div className="kpi-icon-box flex-center" style={{ backgroundColor: `rgba(${kpi.color === 'var(--accent-indigo)' ? '99, 102, 241' : kpi.color === 'var(--accent-cyan)' ? '6, 182, 212' : kpi.color === 'var(--accent-purple)' ? '168, 85, 247' : '236, 72, 153'}, 0.1)`, color: kpi.color }}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="kpi-body">
                <h3 className="kpi-value">{kpi.value}</h3>
                <span className="kpi-badge flex-center">{kpi.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-content-layout">
        {/* Left Side: Graphs & Analytics Summary */}
        <div className="dash-left-panel">
          <div className="analytics-summary-card glass-panel">
            <div className="card-header">
              <h3>Reach & Impressions Trend</h3>
              <button className="text-link flex-center" onClick={() => onNavigate('analytics')}>
                <span>View Analytics</span> <ArrowRight size={14} />
              </button>
            </div>
            <p className="summary-subtitle">Overview of performance across all active channels (last 14 days)</p>
            <div className="mini-chart-container">
              {drawMiniLineChart()}
            </div>
            <div className="analytics-breakdowns">
              <div className="breakdown-item">
                <span className="breakdown-label">Twitter / X Reach</span>
                <span className="breakdown-value">8.4k impressions</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">LinkedIn Reach</span>
                <span className="breakdown-value">4.1k impressions</span>
              </div>
            </div>
          </div>

          <div className="platforms-status-card glass-panel">
            <div className="card-header">
              <h3>Channel Integration</h3>
              <button className="text-link flex-center" onClick={() => onNavigate('accounts')}>
                <span>Manage Accounts</span> <ArrowRight size={14} />
              </button>
            </div>
            <div className="connected-accounts-list">
              {Object.values(accounts).map((acc) => (
                <div key={acc.id} className="account-row">
                  <img src={acc.avatar} alt={acc.name} className="row-avatar" />
                  <div className="row-details">
                    <h4>{acc.name}</h4>
                    <span>{acc.handle}</span>
                  </div>
                  <span className={`row-status-dot ${acc.connected ? 'active' : 'inactive'}`}></span>
                  <span className="row-status-text">{acc.connected ? 'Connected' : 'Disconnected'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Upcoming Schedule Queue */}
        <div className="dash-right-panel">
          <div className="queue-summary-card glass-panel">
            <div className="card-header">
              <h3>Upcoming Queue</h3>
              <button className="text-link flex-center" onClick={() => onNavigate('schedule')}>
                <span>Full Calendar</span> <ArrowRight size={14} />
              </button>
            </div>
            
            <div className="queue-list">
              {scheduledPosts.length > 0 ? (
                scheduledPosts.slice(0, 4).map((post) => {
                  const dateStr = new Date(post.scheduledDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  });
                  return (
                    <div key={post.id} className="queue-item">
                      <div className="queue-meta">
                        <span className="queue-time flex-center"><Calendar size={12} style={{ marginRight: 4 }} /> {dateStr}</span>
                        <div className="queue-platforms">
                          {post.platforms.map(p => (
                            <span key={p} className="platform-icon-wrap" title={p}>
                              {getPlatformIcon(p)}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="queue-text">{post.content}</p>
                      {post.mediaUrl && (
                        <div className="queue-media-preview">
                          <img src={post.mediaUrl} alt="Visual Attachment" />
                        </div>
                      )}
                      <button className="btn btn-secondary btn-sm edit-queue-btn flex-center" onClick={() => onEditPost(post)}>
                        <Edit3 size={12} />
                        <span>Edit Post</span>
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="empty-queue-state flex-center">
                  <AlertCircle size={24} className="empty-icon" />
                  <p>Your scheduled queue is currently empty.</p>
                  <button className="btn btn-glass btn-sm" onClick={() => onNavigate('generator')}>
                    Generate Posts with AI
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
        }

        .kpi-card {
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
          background: rgba(18, 22, 47, 0.65);
        }

        .kpi-card::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          height: 3px;
          width: 100%;
          background: var(--border-glow);
          opacity: 0.7;
        }

        .kpi-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .kpi-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .kpi-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 8px;
        }

        .kpi-body {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
        }

        .kpi-value {
          font-size: 1.75rem;
          font-family: var(--font-display);
          font-weight: 700;
        }

        .kpi-badge {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--accent-emerald);
          background: rgba(16, 185, 129, 0.1);
          padding: 0.1rem 0.5rem;
          border-radius: 6px;
        }

        .dashboard-content-layout {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 992px) {
          .dashboard-content-layout {
            grid-template-columns: 1fr;
          }
        }

        .dash-left-panel, .dash-right-panel {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .analytics-summary-card, .platforms-status-card, .queue-summary-card {
          padding: 1.5rem;
          background: rgba(18, 22, 47, 0.65);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .card-header h3 {
          font-size: 1rem;
          font-weight: 700;
          font-family: var(--font-display);
        }

        .text-link {
          background: transparent;
          border: none;
          color: var(--accent-indigo);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          gap: 0.25rem;
        }

        .text-link:hover {
          color: var(--accent-purple);
        }

        .summary-subtitle {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 1.25rem;
        }

        .mini-chart-container {
          width: 100%;
          background: rgba(0, 0, 0, 0.1);
          border-radius: var(--radius-sm);
          padding: 0.5rem;
          margin-bottom: 1.25rem;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .mini-chart {
          display: block;
        }

        .analytics-breakdowns {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }

        .breakdown-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .breakdown-label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .breakdown-value {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .connected-accounts-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .account-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-sm);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .row-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }

        .row-details {
          display: flex;
          flex-direction: column;
        }

        .row-details h4 {
          font-size: 0.85rem;
          font-weight: 600;
        }

        .row-details span {
          font-size: 0.725rem;
          color: var(--text-muted);
        }

        .row-status-dot {
          margin-left: auto;
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .row-status-dot.active {
          background: var(--accent-emerald);
          box-shadow: 0 0 6px var(--accent-emerald);
        }

        .row-status-dot.inactive {
          background: var(--text-muted);
        }

        .row-status-text {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          width: 80px;
          text-align: right;
        }

        .queue-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
          max-height: 520px;
          overflow-y: auto;
          padding-right: 0.25rem;
        }

        .queue-item {
          padding: 1rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          transition: all var(--transition-fast);
        }

        .queue-item:hover {
          border-color: rgba(99, 102, 241, 0.25);
          background: rgba(99, 102, 241, 0.02);
        }

        .queue-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .queue-time {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--accent-cyan);
        }

        .queue-platforms {
          display: flex;
          gap: 0.35rem;
        }

        .platform-icon-wrap {
          display: inline-flex;
          padding: 0.2rem;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 4px;
        }

        .queue-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .queue-media-preview {
          width: 100%;
          height: 100px;
          border-radius: 6px;
          overflow: hidden;
          margin: 0.25rem 0;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .queue-media-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .edit-queue-btn {
          align-self: flex-end;
          padding: 0.3rem 0.6rem;
          font-size: 0.75rem;
          gap: 0.25rem;
        }

        .empty-queue-state {
          flex-direction: column;
          gap: 0.75rem;
          padding: 3rem 1.5rem;
          text-align: center;
          color: var(--text-muted);
        }

        .empty-icon {
          color: var(--border-color-hover);
        }

        .empty-queue-state p {
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
