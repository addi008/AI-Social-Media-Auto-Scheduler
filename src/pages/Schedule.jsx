import React, { useState } from 'react';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  Edit3, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { 
  TwitterIcon as Twitter, 
  LinkedinIcon as Linkedin, 
  InstagramIcon as Instagram, 
  FacebookIcon as Facebook 
} from '../components/BrandIcons';

const Schedule = ({ posts = [], timeSlots = [], onEditPost, onDeletePost, onOpenCreateModal }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'queue'

  // Extract scheduled posts
  const scheduledPosts = posts.filter(p => p.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const prevDaysInMonth = new Date(year, month, 0).getDate();

  const calendarDays = [];

  // Previous month padding days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarDays.push({
      day: prevDaysInMonth - i,
      month: month === 0 ? 11 : month - 1,
      year: month === 0 ? year - 1 : year,
      isCurrentMonth: false
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      month: month,
      year: year,
      isCurrentMonth: true
    });
  }

  // Next month padding days to complete grid (usually 42 cells for 6 weeks)
  const remainingCells = 42 - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.push({
      day: i,
      month: month === 11 ? 0 : month + 1,
      year: month === 11 ? year + 1 : year,
      isCurrentMonth: false
    });
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'twitter': return <Twitter size={10} style={{ color: '#1d9bf0' }} />;
      case 'linkedin': return <Linkedin size={10} style={{ color: '#0a66c2' }} />;
      case 'instagram': return <Instagram size={10} style={{ color: '#e1306c' }} />;
      case 'facebook': return <Facebook size={10} style={{ color: '#1877f2' }} />;
      default: return null;
    }
  };

  // Get posts for a specific calendar cell
  const getPostsForDay = (cell) => {
    return scheduledPosts.filter(post => {
      const postDate = new Date(post.scheduledDate);
      return postDate.getDate() === cell.day &&
             postDate.getMonth() === cell.month &&
             postDate.getFullYear() === cell.year;
    });
  };

  // Trigger composer modal on calendar cell click
  const handleCellClick = (cell) => {
    if (!cell.isCurrentMonth) return;
    const formattedDate = `${cell.year}-${String(cell.month + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;
    onOpenCreateModal(formattedDate);
  };

  return (
    <div className="schedule-page animate-fade-in">
      <div className="schedule-header-controls">
        <div className="schedule-views-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => setViewMode('calendar')}
          >
            Calendar Grid
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'queue' ? 'active' : ''}`}
            onClick={() => setViewMode('queue')}
          >
            Chronological Queue ({scheduledPosts.length})
          </button>
        </div>

        {viewMode === 'calendar' && (
          <div className="month-picker flex-center">
            <button className="icon-btn flex-center" onClick={handlePrevMonth}>
              <ChevronLeft size={16} />
            </button>
            <h3 className="current-month-label">{monthNames[month]} {year}</h3>
            <button className="icon-btn flex-center" onClick={handleNextMonth}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {viewMode === 'calendar' ? (
        /* Calendar Grid View */
        <div className="calendar-container glass-panel">
          <div className="calendar-weekdays">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="calendar-grid">
            {calendarDays.map((cell, index) => {
              const dayPosts = getPostsForDay(cell);
              const isToday = new Date().getDate() === cell.day &&
                              new Date().getMonth() === cell.month &&
                              new Date().getFullYear() === cell.year;
              return (
                <div 
                  key={index} 
                  className={`calendar-cell ${cell.isCurrentMonth ? '' : 'outside-month'} ${isToday ? 'today' : ''}`}
                  onClick={() => handleCellClick(cell)}
                >
                  <div className="cell-header">
                    <span className="day-number">{cell.day}</span>
                    {cell.isCurrentMonth && (
                      <span className="quick-add-indicator"><Plus size={10} /></span>
                    )}
                  </div>
                  <div className="cell-posts">
                    {dayPosts.map(post => (
                      <div 
                        key={post.id} 
                        className="calendar-post-badge"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent opening compose on cell
                          onEditPost(post);
                        }}
                        title={post.content}
                      >
                        <div className="badge-platforms-row">
                          {post.platforms.map(p => (
                            <span key={p} className="badge-platform-bullet">{getPlatformIcon(p)}</span>
                          ))}
                        </div>
                        <span className="badge-text">{post.content}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Chronological Queue List View */
        <div className="timeline-queue-container">
          <div className="queue-slots-sidebar glass-panel">
            <div className="slots-header flex-center">
              <Clock size={16} className="text-cyan" />
              <h3>Daily Posting Slots</h3>
            </div>
            <div className="slots-list">
              {timeSlots.map((slot, index) => (
                <div key={index} className="slot-pill flex-center">
                  <span>Slot #{index + 1}: {slot}</span>
                </div>
              ))}
            </div>
            <p className="slots-note">Configure scheduling slots inside Settings.</p>
          </div>

          <div className="queue-list-full">
            {scheduledPosts.length > 0 ? (
              scheduledPosts.map((post) => {
                const dateObj = new Date(post.scheduledDate);
                const dateStr = dateObj.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                });
                const timeStr = dateObj.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit'
                });

                return (
                  <div key={post.id} className="queue-card-full glass-panel">
                    <div className="card-left-time">
                      <span className="queue-date">{dateStr}</span>
                      <span className="queue-clock"><Clock size={12} style={{ marginRight: 4 }} />{timeStr}</span>
                    </div>

                    <div className="card-main-content">
                      <div className="platforms-header-row">
                        {post.platforms.map(p => (
                          <span key={p} className="platform-tag flex-center">
                            {getPlatformIcon(p)}
                            <span className="platform-tag-label">{p}</span>
                          </span>
                        ))}
                      </div>
                      <p className="card-post-text">{post.content}</p>
                      {post.mediaUrl && (
                        <div className="card-media-attachment">
                          <img src={post.mediaUrl} alt="Attached asset" />
                        </div>
                      )}
                    </div>

                    <div className="card-actions-side">
                      <button className="icon-btn flex-center action-edit" onClick={() => onEditPost(post)} title="Edit Post">
                        <Edit3 size={15} />
                      </button>
                      <button className="icon-btn flex-center action-delete" onClick={() => onDeletePost(post.id)} title="Delete Post">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-scheduler-state glass-panel flex-center">
                <AlertCircle size={32} />
                <h3>No Scheduled Posts Found</h3>
                <p>Compose a new post or use the AI Creative Studio to queue content.</p>
                <button className="btn btn-primary" onClick={() => onOpenCreateModal()}>
                  Schedule a Post
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .schedule-page {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .schedule-header-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .schedule-views-toggle {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          padding: 0.25rem;
          border-radius: var(--radius-sm);
          display: flex;
          gap: 0.25rem;
        }

        .toggle-btn {
          padding: 0.5rem 1rem;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.8rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .toggle-btn.active {
          background: var(--accent-indigo);
          color: white;
          box-shadow: 0 4px 10px rgba(99, 102, 241, 0.2);
        }

        .month-picker {
          gap: 1rem;
        }

        .current-month-label {
          font-size: 1.1rem;
          min-width: 150px;
          text-align: center;
        }

        /* Calendar Styling */
        .calendar-container {
          padding: 1.5rem;
          background: rgba(18, 22, 47, 0.65);
        }

        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          margin-bottom: 0.75rem;
          color: var(--text-muted);
          font-weight: 700;
          font-size: 0.85rem;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          grid-template-rows: repeat(6, 110px);
          gap: 1px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          overflow: hidden;
        }

        .calendar-cell {
          background: var(--bg-surface-opaque);
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          position: relative;
          overflow: hidden;
        }

        .calendar-cell:hover {
          background: var(--bg-surface-hover);
        }

        .calendar-cell.outside-month {
          opacity: 0.3;
        }

        .calendar-cell.today {
          background: rgba(99, 102, 241, 0.08);
          border: 1px solid rgba(99, 102, 241, 0.3);
        }

        .calendar-cell.today .day-number {
          color: var(--accent-indigo);
          font-weight: 800;
        }

        .cell-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .day-number {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .quick-add-indicator {
          opacity: 0;
          color: var(--text-muted);
          transition: opacity var(--transition-fast);
        }

        .calendar-cell:hover .quick-add-indicator {
          opacity: 1;
        }

        .cell-posts {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          overflow-y: auto;
          flex: 1;
          scrollbar-width: none; /* Hide scrollbars inside calendar cells */
        }

        .cell-posts::-webkit-scrollbar {
          display: none;
        }

        .calendar-post-badge {
          background: rgba(99, 102, 241, 0.15);
          border: 1px solid rgba(99, 102, 241, 0.25);
          padding: 0.2rem 0.35rem;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          transition: all var(--transition-fast);
        }

        .calendar-post-badge:hover {
          background: rgba(99, 102, 241, 0.25);
          transform: translateY(-1px);
        }

        .badge-platforms-row {
          display: flex;
          gap: 0.2rem;
        }

        .badge-platform-bullet {
          display: inline-flex;
        }

        .badge-text {
          font-size: 0.65rem;
          font-weight: 600;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          color: var(--text-primary);
        }

        /* Queue / Timeline Layout */
        .timeline-queue-container {
          display: grid;
          grid-template-columns: 1fr 2.5fr;
          gap: 1.5rem;
          align-items: start;
        }

        @media (max-width: 900px) {
          .timeline-queue-container {
            grid-template-columns: 1fr;
          }
        }

        .queue-slots-sidebar {
          padding: 1.25rem;
          background: rgba(18, 22, 47, 0.65);
        }

        .slots-header {
          gap: 0.5rem;
          margin-bottom: 1rem;
          justify-content: flex-start;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 0.5rem;
        }

        .slots-header h3 {
          font-size: 0.95rem;
        }

        .text-cyan {
          color: var(--accent-cyan);
        }

        .slots-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .slot-pill {
          padding: 0.6rem;
          background: rgba(6, 182, 212, 0.05);
          border: 1px solid rgba(6, 182, 212, 0.15);
          border-radius: 6px;
          color: var(--accent-cyan);
          font-size: 0.8rem;
          font-weight: 700;
          justify-content: flex-start;
          gap: 0.5rem;
        }

        .slots-note {
          font-size: 0.725rem;
          color: var(--text-muted);
        }

        .queue-list-full {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .queue-card-full {
          padding: 1.25rem;
          display: flex;
          gap: 1.25rem;
          background: rgba(18, 22, 47, 0.65);
        }

        @media (max-width: 600px) {
          .queue-card-full {
            flex-direction: column;
            gap: 0.75rem;
          }
        }

        .card-left-time {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 120px;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          padding-right: 1rem;
        }

        @media (max-width: 600px) {
          .card-left-time {
            border-right: none;
            padding-right: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            padding-bottom: 0.5rem;
          }
        }

        .queue-date {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .queue-clock {
          font-size: 0.75rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
        }

        .card-main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .platforms-header-row {
          display: flex;
          gap: 0.4rem;
        }

        .platform-tag {
          padding: 0.2rem 0.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 700;
          gap: 0.3rem;
          text-transform: capitalize;
          color: var(--text-secondary);
        }

        .platform-tag-label {
          line-height: 1;
        }

        .card-post-text {
          font-size: 0.875rem;
          line-height: 1.45;
          color: var(--text-secondary);
          white-space: pre-wrap;
        }

        .card-media-attachment {
          width: 100%;
          max-height: 160px;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.05);
          margin-top: 0.25rem;
        }

        .card-media-attachment img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-actions-side {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        @media (max-width: 600px) {
          .card-actions-side {
            flex-direction: row;
            justify-content: flex-end;
          }
        }

        .action-edit:hover {
          color: var(--accent-indigo);
          border-color: rgba(99, 102, 241, 0.3);
        }

        .action-delete:hover {
          color: var(--accent-rose);
          border-color: rgba(244, 63, 94, 0.3);
        }

        .empty-scheduler-state {
          padding: 4rem 2rem;
          flex-direction: column;
          gap: 1rem;
          text-align: center;
          background: rgba(18, 22, 47, 0.65);
          color: var(--text-muted);
        }

        .empty-scheduler-state h3 {
          color: var(--text-primary);
          font-size: 1.1rem;
          font-family: var(--font-display);
        }

        .empty-scheduler-state p {
          font-size: 0.85rem;
          max-width: 320px;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default Schedule;
