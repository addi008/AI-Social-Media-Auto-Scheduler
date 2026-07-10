import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Image as ImageIcon, Send } from 'lucide-react';
import PostPreview from './PostPreview';

const PostModal = ({ isOpen, onClose, postToEdit = null, onSave, connectedAccounts = {}, timeSlots = [] }) => {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [mediaUrl, setMediaUrl] = useState('');
  const [previewPlatform, setPreviewPlatform] = useState('twitter');
  const [status, setStatus] = useState('draft');

  useEffect(() => {
    if (postToEdit) {
      setContent(postToEdit.content || '');
      setSelectedPlatforms(postToEdit.platforms || []);
      setMediaUrl(postToEdit.mediaUrl || '');
      setStatus(postToEdit.status || 'draft');
      
      if (postToEdit.scheduledDate) {
        const dt = new Date(postToEdit.scheduledDate);
        const yyyy = dt.getFullYear();
        const mm = String(dt.getMonth() + 1).padStart(2, '0');
        const dd = String(dt.getDate()).padStart(2, '0');
        setScheduledDate(`${yyyy}-${mm}-${dd}`);
        
        const hrs = String(dt.getHours()).padStart(2, '0');
        const mins = String(dt.getMinutes()).padStart(2, '0');
        setScheduledTime(`${hrs}:${mins}`);
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setScheduledDate(tomorrow.toISOString().split('T')[0]);
        setScheduledTime(timeSlots[0] || '09:00');
      }
    } else {
      setContent('');
      // Default to connected platforms
      const connected = Object.keys(connectedAccounts).filter(k => connectedAccounts[k].connected);
      setSelectedPlatforms(connected.slice(0, 2));
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setScheduledDate(tomorrow.toISOString().split('T')[0]);
      setScheduledTime(timeSlots[0] || '09:00');
      setMediaUrl('');
      setStatus('draft');
    }
  }, [postToEdit, isOpen, connectedAccounts, timeSlots]);

  // Set default preview platform based on selected platforms
  useEffect(() => {
    if (selectedPlatforms.length > 0 && !selectedPlatforms.includes(previewPlatform)) {
      setPreviewPlatform(selectedPlatforms[0]);
    }
  }, [selectedPlatforms, previewPlatform]);

  if (!isOpen) return null;

  const handlePlatformToggle = (platform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleSave = (postStatus) => {
    if (!content.trim()) return alert('Post content cannot be empty.');
    if (selectedPlatforms.length === 0) return alert('Select at least one social media channel.');

    let fullScheduledDate = null;
    if (postStatus === 'scheduled') {
      const [year, month, day] = scheduledDate.split('-').map(Number);
      const [hours, minutes] = scheduledTime.split(':').map(Number);
      const dateObj = new Date(year, month - 1, day, hours, minutes);
      fullScheduledDate = dateObj.toISOString();
    } else if (postStatus === 'published') {
      fullScheduledDate = new Date().toISOString();
    }

    onSave({
      id: postToEdit?.id,
      content,
      platforms: selectedPlatforms,
      scheduledDate: fullScheduledDate,
      mediaUrl,
      status: postStatus,
    });
    onClose();
  };

  return (
    <div className="modal-overlay flex-center animate-fade-in">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h2>{postToEdit ? 'Edit Social Post' : 'Compose Social Post'}</h2>
          <button className="close-btn flex-center" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body-layout">
          {/* Form Side */}
          <div className="modal-form-panel">
            <div className="form-group">
              <label>Select Target Channels</label>
              <div className="platform-checkbox-group">
                {Object.keys(connectedAccounts).map((platform) => {
                  const account = connectedAccounts[platform];
                  const isChecked = selectedPlatforms.includes(platform);
                  const isDisabled = !account.connected;
                  
                  return (
                    <button
                      key={platform}
                      type="button"
                      disabled={isDisabled}
                      className={`platform-checkbox-btn flex-center ${isChecked ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                      onClick={() => handlePlatformToggle(platform)}
                      title={isDisabled ? 'Connect account in settings first' : `Post to ${account.name}`}
                    >
                      <img src={account.avatar} alt={platform} className="checkbox-avatar" />
                      <span className="checkbox-label">{account.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label>Post Copy</label>
              <textarea
                className="form-control post-textarea"
                placeholder="Share your startup milestones, coding achievements, or AI thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="character-counter">
                Characters: <span className={content.length > 280 && previewPlatform === 'twitter' ? 'danger-text' : ''}>{content.length}</span>
                {previewPlatform === 'twitter' && ' / 280 (Twitter Limit)'}
              </div>
            </div>

            <div className="form-group">
              <label><ImageIcon size={14} /> Image URL (Optional)</label>
              <input
                type="text"
                className="form-control"
                placeholder="https://images.unsplash.com/photo-..."
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
              />
            </div>

            <div className="scheduler-fields">
              <div className="form-group">
                <label><Calendar size={14} /> Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label><Clock size={14} /> Time</label>
                <select
                  className="form-control"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                >
                  {timeSlots.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                  {/* Append custom inputs if not in slots */}
                  {!timeSlots.includes(scheduledTime) && (
                    <option value={scheduledTime}>{scheduledTime}</option>
                  )}
                </select>
              </div>
            </div>

            <div className="modal-actions-footer">
              {status !== 'published' && (
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleSave('draft')}
                >
                  Save Draft
                </button>
              )}
              <button 
                className="btn btn-glass btn-sm flex-center"
                onClick={() => handleSave('published')}
              >
                <Send size={14} />
                <span>Post Now</span>
              </button>
              <button 
                className="btn btn-primary btn-sm flex-center"
                onClick={() => handleSave('scheduled')}
              >
                <Calendar size={14} />
                <span>Schedule Post</span>
              </button>
            </div>
          </div>

          {/* Preview Side */}
          <div className="modal-preview-panel">
            <div className="preview-platform-tabs">
              {selectedPlatforms.map((p) => (
                <button
                  key={p}
                  className={`preview-tab-btn ${previewPlatform === p ? 'active' : ''}`}
                  onClick={() => setPreviewPlatform(p)}
                >
                  {connectedAccounts[p]?.name.split(' ')[0] || p}
                </button>
              ))}
              {selectedPlatforms.length === 0 && (
                <span className="no-platforms-label">No preview channel selected</span>
              )}
            </div>

            <div className="preview-wrapper flex-center">
              <PostPreview
                content={content}
                mediaUrl={mediaUrl}
                platform={previewPlatform}
                profile={connectedAccounts[previewPlatform]}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(4, 5, 12, 0.8);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 1000;
        }

        .modal-content {
          width: 90%;
          max-width: 960px;
          max-height: 90vh;
          background: var(--bg-surface-opaque);
          border: 1px solid var(--border-color-hover);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .modal-header h2 {
          font-size: 1.25rem;
          background: var(--grad-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.05);
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .close-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.1);
        }

        .modal-body-layout {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          height: 100%;
          overflow: hidden;
        }

        @media (max-width: 820px) {
          .modal-body-layout {
            grid-template-columns: 1fr;
            overflow-y: auto;
          }
          .modal-content {
            height: 95vh;
          }
        }

        .modal-form-panel {
          padding: 1.5rem;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .platform-checkbox-group {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .platform-checkbox-btn {
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--text-secondary);
          gap: 0.4rem;
          font-family: var(--font-main);
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .platform-checkbox-btn.active {
          background: rgba(99, 102, 241, 0.15);
          border-color: var(--accent-indigo);
          color: white;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.1);
        }

        .platform-checkbox-btn.disabled {
          opacity: 0.35;
          cursor: not-allowed;
          background: transparent;
        }

        .checkbox-avatar {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          object-fit: cover;
        }

        .post-textarea {
          min-height: 140px;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .character-counter {
          align-self: flex-end;
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .character-counter span.danger-text {
          color: var(--accent-rose);
          font-weight: 700;
        }

        .scheduler-fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .modal-actions-footer {
          margin-top: 1rem;
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .modal-preview-panel {
          padding: 1.5rem;
          background: rgba(4, 6, 17, 0.3);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .preview-platform-tabs {
          display: flex;
          gap: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 0.5rem;
        }

        .preview-tab-btn {
          padding: 0.4rem 0.8rem;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          border-radius: 4px;
        }

        .preview-tab-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.04);
        }

        .preview-tab-btn.active {
          color: var(--accent-indigo);
          background: rgba(99, 102, 241, 0.1);
        }

        .no-platforms-label {
          color: var(--text-muted);
          font-size: 0.8rem;
          padding: 0.4rem 0;
        }

        .preview-wrapper {
          flex: 1;
          width: 100%;
          min-height: 250px;
          border: 1px dashed rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-md);
          padding: 1rem;
          background: rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};

export default PostModal;
