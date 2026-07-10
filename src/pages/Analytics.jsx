import React, { useState } from 'react';
import { Clock, Eye, MousePointer, ThumbsUp, AlertCircle } from 'lucide-react';

const Analytics = ({ posts = [], analytics = [], onNavigate }) => {
  const [metricTab, setMetricTab] = useState('impressions'); // 'impressions' | 'clicks' | 'engagement'

  const publishedPosts = posts.filter(p => p.status === 'published');
  
  // Retrieve 30 days history data from props
  const chartData = analytics;

  // Pick top posts by likes or impressions
  const topPosts = [...publishedPosts]
    .sort((a, b) => ((b.metrics?.likes || 0) + (b.metrics?.shares || 0) * 2) - ((a.metrics?.likes || 0) + (a.metrics?.shares || 0) * 2))
    .slice(0, 4);

  // Best Posting times recommendation
  const bestTimes = [
    { platform: 'Twitter / X', time: 'Tuesday 9:15 AM', rate: 'High Engagement' },
    { platform: 'LinkedIn', time: 'Wednesday 1:00 PM', rate: 'Maximum CTR' },
    { platform: 'Facebook', time: 'Friday 6:30 PM', rate: 'Good Impressions' }
  ];

  // SVG Chart drawing helper
  const renderSVGChart = () => {
    const width = 600;
    const height = 220;
    const padding = 30;

    const values = chartData.map(d => d[metricTab]);
    const maxVal = Math.max(...values, 10); // default fallback
    const minVal = Math.min(...values, 0);

    const xStep = (width - padding * 2) / (chartData.length - 1);
    const yScale = (height - padding * 2) / (maxVal - minVal);

    // Calculate coordinates
    const points = chartData.map((d, i) => {
      const x = padding + i * xStep;
      const y = height - padding - (d[metricTab] - minVal) * yScale;
      return { x, y, label: d.date.split('-')[2] }; // day of month
    });

    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="analytics-svg-graph">
        <defs>
          <linearGradient id="chart-glow-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-indigo)" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="var(--accent-indigo)" stopOpacity="0"/>
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.03)" />
        <line x1={padding} y1={(height) / 2} x2={width - padding} y2={(height) / 2} stroke="rgba(255,255,255,0.03)" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.08)" />

        {/* Visual Line */}
        <path 
          d={pathData} 
          fill="none" 
          stroke="var(--accent-indigo)" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        {/* Glow fill */}
        <path 
          d={`${pathData} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`} 
          fill="url(#chart-glow-gradient)" 
        />

        {/* Small Data Dot points */}
        {points.map((p, i) => {
          if (i % 3 !== 0) return null; // reduce clutter
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill="var(--bg-primary)" stroke="var(--accent-indigo)" strokeWidth="2" />
              <text x={p.x} y={height - 10} fill="var(--text-muted)" fontSize="9" textAnchor="middle">
                d{p.label}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="analytics-page animate-fade-in">
      <div className="analytics-layout-grid">
        {/* Chart Card */}
        <div className="analytics-main-chart glass-panel">
          <div className="chart-header-row">
            <h3 className="chart-title">Workspace Audience Metrics</h3>
            <div className="metric-tabs">
              <button 
                className={`tab-btn ${metricTab === 'impressions' ? 'active' : ''}`}
                onClick={() => setMetricTab('impressions')}
              >
                Reach
              </button>
              <button 
                className={`tab-btn ${metricTab === 'clicks' ? 'active' : ''}`}
                onClick={() => setMetricTab('clicks')}
              >
                Clicks
              </button>
              <button 
                className={`tab-btn ${metricTab === 'engagement' ? 'active' : ''}`}
                onClick={() => setMetricTab('engagement')}
              >
                Eng. %
              </button>
            </div>
          </div>
          
          <div className="svg-container">
            {renderSVGChart()}
          </div>
          <span className="x-axis-lbl">30 Days Social History Timeline</span>
        </div>

        {/* Best Times Recommendation Card */}
        <div className="analytics-recommendations glass-panel">
          <div className="card-header-with-icon">
            <Clock size={16} className="text-pink" />
            <h3>Optimal Schedule Slots</h3>
          </div>
          <p className="rec-desc">Calculated post hours matching maximum follower online metrics.</p>

          <div className="rec-list">
            {bestTimes.map((item, i) => (
              <div key={i} className="rec-row">
                <div className="rec-left">
                  <h4>{item.platform}</h4>
                  <span>Best Engagement Slot</span>
                </div>
                <span className="rec-badge flex-center">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Card */}
        <div className="analytics-leaderboard glass-panel">
          <div className="card-header">
            <h3>Top Performing Content</h3>
          </div>
          
          <div className="leaderboard-list">
            {topPosts.length > 0 ? (
              topPosts.map((post, index) => (
                <div key={post.id} className="leaderboard-item">
                  <div className="leader-rank flex-center">#{index + 1}</div>
                  <div className="leader-details">
                    <p className="leader-text">{post.content}</p>
                    <div className="leader-metrics flex-center">
                      <span className="metric"><Eye size={11} /> {post.metrics?.impressions.toLocaleString()}</span>
                      <span className="metric"><ThumbsUp size={11} /> {post.metrics?.likes.toLocaleString()}</span>
                      <span className="metric"><MousePointer size={11} /> {post.metrics?.clicks.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-leaderboard flex-center">
                <AlertCircle size={24} />
                <p>No published metrics found yet.</p>
                <button className="btn btn-glass btn-sm" onClick={() => onNavigate('generator')}>
                  Generate Post
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .analytics-page {
          width: 100%;
        }

        .analytics-layout-grid {
          display: grid;
          grid-template-columns: 2fr 1.2fr;
          gap: 1.5rem;
        }

        @media (max-width: 992px) {
          .analytics-layout-grid {
            grid-template-columns: 1fr;
          }
        }

        .analytics-main-chart {
          padding: 1.5rem;
          background: rgba(18, 22, 47, 0.65);
          grid-column: 1 / -1;
        }

        .chart-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 0.75rem;
        }

        .chart-title {
          font-size: 1rem;
          font-family: var(--font-display);
        }

        .metric-tabs {
          display: flex;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 0.2rem;
          border-radius: 6px;
        }

        .tab-btn {
          padding: 0.3rem 0.75rem;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          border-radius: 4px;
          transition: all var(--transition-fast);
        }

        .tab-btn.active {
          background: var(--accent-indigo);
          color: white;
        }

        .svg-container {
          width: 100%;
          padding: 0.5rem;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.02);
        }

        .analytics-svg-graph {
          display: block;
        }

        .x-axis-lbl {
          display: block;
          text-align: center;
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-top: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .analytics-recommendations, .analytics-leaderboard {
          padding: 1.5rem;
          background: rgba(18, 22, 47, 0.65);
          min-height: 280px;
        }

        .card-header-with-icon {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .card-header-with-icon h3 {
          font-size: 1rem;
          font-family: var(--font-display);
        }

        .text-pink {
          color: var(--accent-pink);
        }

        .rec-desc {
          font-size: 0.775rem;
          color: var(--text-muted);
          margin-bottom: 1.25rem;
        }

        .rec-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .rec-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 0.75rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .rec-left h4 {
          font-size: 0.825rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .rec-left span {
          font-size: 0.675rem;
          color: var(--text-muted);
        }

        .rec-badge {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--accent-pink);
          background: rgba(236, 72, 153, 0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          border: 1px solid rgba(236, 72, 153, 0.15);
        }

        .leaderboard-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .leaderboard-item {
          display: flex;
          gap: 0.75rem;
          padding: 0.65rem 0.75rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          align-items: center;
        }

        .leader-rank {
          width: 24px;
          height: 24px;
          background: var(--grad-primary);
          color: white;
          font-size: 0.7rem;
          font-weight: 800;
          border-radius: 50%;
        }

        .leader-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          overflow: hidden;
        }

        .leader-text {
          font-size: 0.775rem;
          color: var(--text-secondary);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .leader-metrics {
          display: flex;
          justify-content: flex-start;
          gap: 0.75rem;
        }

        .leader-metrics .metric {
          font-size: 0.675rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        .empty-leaderboard {
          flex-direction: column;
          gap: 0.75rem;
          padding: 2rem;
          text-align: center;
          color: var(--text-muted);
        }

        .empty-leaderboard p {
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
};

export default Analytics;
