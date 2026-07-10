import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, ImageIcon, RefreshCw, Send, Check } from 'lucide-react';
import { aiService } from '../services/ai';
import PostPreview from '../components/PostPreview';

const Generator = ({ connectedAccounts = {}, settings = {}, timeSlots = [], onAddPost, onNavigate }) => {
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('professional');
  const [platform, setPlatform] = useState('twitter');
  const [audience, setAudience] = useState('tech startup founders');
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [selectedMedia, setSelectedMedia] = useState('');
  const [imageQuery, setImageQuery] = useState('');
  const [isSearchingImages, setIsSearchingImages] = useState(false);
  
  // Stock Image library of real high-quality Unsplash URLs
  const [stockImages, setStockImages] = useState([
    { id: 1, category: 'startup', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80' },
    { id: 2, category: 'coding', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80' },
    { id: 3, category: 'workspace', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80' },
    { id: 4, category: 'launch', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400&q=80' },
    { id: 5, category: 'analytics', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80' },
    { id: 6, category: 'team', url: 'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=400&q=80' }
  ]);

  const promptTemplates = [
    { title: 'Launch', text: 'Launch of Aether Scheduler beta platform. Highlighting AI features and queue slots.' },
    { title: 'Milestone', text: 'Celebrating reaching our first 100 users in just 48 hours! A big thank you to our community.' },
    { title: 'Tip/Thread', text: '5 actionable design secrets that increase user trust on landing pages. Design psychology tips.' },
    { title: 'Hiring', text: 'We are looking for a remote Full Stack Engineer to join our core product team. Equity + high autonomy.' }
  ];

  // Sync default preview platform with connected ones
  useEffect(() => {
    const connected = Object.keys(connectedAccounts).filter(k => connectedAccounts[k].connected);
    if (connected.length > 0 && !connected.includes(platform)) {
      setPlatform(connected[0]);
    }
  }, [connectedAccounts, platform]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return alert('Please enter a topic or prompt for the AI.');
    
    setIsGenerating(true);
    try {
      const result = await aiService.generateSocialPost({
        prompt,
        tone,
        platform,
        audience,
        includeEmojis,
        includeHashtags,
        apiKey: settings.geminiApiKey
      });
      setGeneratedText(result);
    } catch (e) {
      alert(e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSearchImages = () => {
    if (!imageQuery.trim()) return;
    setIsSearchingImages(true);
    
    // Simulate keyword-based stock photos search by picking/replacing URLs
    setTimeout(() => {
      const keywords = imageQuery.toLowerCase();
      const mockResult = [
        { id: 101, category: keywords, url: `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80` }, // coding/office
        { id: 102, category: keywords, url: `https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80` }, // team/workspace
        { id: 103, category: keywords, url: `https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80` }, // data/charts
        { id: 104, category: keywords, url: `https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=400&q=80` }, // startup/meeting
      ];
      setStockImages(mockResult);
      setIsSearchingImages(false);
    }, 1000);
  };

  const handleQueuePost = (status) => {
    if (!generatedText.trim()) return alert('Please generate or write content first.');
    
    // Calculate schedule date: Tomorrow at first time slot
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const slot = timeSlots[0] || '09:00';
    const [hours, minutes] = slot.split(':').map(Number);
    tomorrow.setHours(hours, minutes, 0);

    onAddPost({
      content: generatedText,
      platforms: [platform],
      mediaUrl: selectedMedia,
      status: status,
      scheduledDate: status === 'scheduled' ? tomorrow.toISOString() : new Date().toISOString()
    });

    alert(status === 'scheduled' ? 'Post added to upcoming queue!' : 'Post published successfully!');
    onNavigate('dashboard');
  };

  return (
    <div className="generator-page animate-fade-in">
      <div className="generator-grid-layout">
        {/* Settings column */}
        <div className="generator-settings glass-panel">
          <div className="settings-header">
            <h3>AI Configuration</h3>
            <Sparkles size={16} className="spark-purple" />
          </div>

          <div className="form-group">
            <label>Choose Platform Formatting</label>
            <div className="platform-toggle-group">
              {Object.keys(connectedAccounts).map((plat) => {
                const isSelected = platform === plat;
                return (
                  <button
                    key={plat}
                    className={`platform-btn flex-center ${isSelected ? 'active' : ''}`}
                    onClick={() => setPlatform(plat)}
                  >
                    <span className="platform-btn-label">{plat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label>Topic Templates</label>
            <div className="template-chips">
              {promptTemplates.map((t) => (
                <button
                  key={t.title}
                  className="template-chip-btn"
                  onClick={() => setPrompt(t.text)}
                >
                  {t.title}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Topic / Prompt</label>
            <textarea
              className="form-control prompt-textarea"
              placeholder="What do you want to publish today? E.g., 'Writing about my startup growth metrics...'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="generator-row-fields">
            <div className="form-group">
              <label>Tone of Voice</label>
              <select className="form-control" value={tone} onChange={(e) => setTone(e.target.value)}>
                <option value="professional">💼 Professional</option>
                <option value="casual">☕ Casual</option>
                <option value="witty">⚡ Witty</option>
                <option value="hype">🔥 Hype / Viral</option>
                <option value="inspirational">🌟 Inspirational</option>
              </select>
            </div>

            <div className="form-group">
              <label>Target Audience</label>
              <input
                type="text"
                className="form-control"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </div>
          </div>

          <div className="form-checkbox-row">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={includeEmojis}
                onChange={(e) => setIncludeEmojis(e.target.checked)}
              />
              <span className="checkmark"></span>
              Include Emojis
            </label>
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={includeHashtags}
                onChange={(e) => setIncludeHashtags(e.target.checked)}
              />
              <span className="checkmark"></span>
              Generate Hashtags
            </label>
          </div>

          <button
            className="btn btn-primary generate-submit-btn flex-center"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Synthesizing Copy...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Generate Social Post</span>
              </>
            )}
          </button>
        </div>

        {/* Workspace column */}
        <div className="generator-editor-preview">
          <div className="editor-output-card glass-panel">
            <div className="card-header">
              <h3>AI Output Copy</h3>
              {generatedText && <span className="copy-ready-tag flex-center"><Check size={12} /> Ready</span>}
            </div>
            <textarea
              className="form-control generated-textarea"
              placeholder="Your generated content will appear here. You can manually edit it to fine-tune details..."
              value={generatedText}
              onChange={(e) => setGeneratedText(e.target.value)}
            />
            
            {/* Visual Attachment Gallery */}
            <div className="media-selector-section">
              <label className="section-label"><ImageIcon size={14} /> Attach Visual Asset</label>
              
              <div className="unsplash-search-box flex-center">
                <input
                  type="text"
                  placeholder="Search stock photos (e.g. startup, desk, metrics)..."
                  className="form-control image-search-input"
                  value={imageQuery}
                  onChange={(e) => setImageQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchImages()}
                />
                <button className="btn btn-secondary btn-sm" onClick={handleSearchImages} disabled={isSearchingImages}>
                  {isSearchingImages ? <RefreshCw size={14} className="animate-spin" /> : 'Search'}
                </button>
              </div>

              <div className="stock-images-grid">
                {stockImages.map((img) => (
                  <div 
                    key={img.id} 
                    className={`stock-image-card ${selectedMedia === img.url ? 'active' : ''}`}
                    onClick={() => setSelectedMedia(selectedMedia === img.url ? '' : img.url)}
                  >
                    <img src={img.url} alt="Stock option" />
                    {selectedMedia === img.url && (
                      <div className="selected-image-overlay flex-center">
                        <Check size={16} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="editor-footer-actions">
              <button 
                className="btn btn-secondary flex-center"
                disabled={!generatedText}
                onClick={() => handleQueuePost('published')}
              >
                <Send size={15} />
                <span>Publish Now</span>
              </button>
              <button 
                className="btn btn-primary flex-center"
                disabled={!generatedText}
                onClick={() => handleQueuePost('scheduled')}
              >
                <Calendar size={15} />
                <span>Add to Queue</span>
              </button>
            </div>
          </div>

          <div className="live-preview-box">
            <span className="preview-indicator flex-center">Live Preview Mockup</span>
            <div className="preview-inner-wrap flex-center">
              <PostPreview
                content={generatedText}
                mediaUrl={selectedMedia}
                platform={platform}
                profile={connectedAccounts[platform]}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .generator-page {
          width: 100%;
        }

        .generator-grid-layout {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 1.5rem;
          align-items: start;
        }

        @media (max-width: 1100px) {
          .generator-grid-layout {
            grid-template-columns: 1fr;
          }
        }

        .generator-settings, .editor-output-card {
          padding: 1.5rem;
          background: rgba(18, 22, 47, 0.65);
        }

        .settings-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 0.75rem;
        }

        .spark-purple {
          color: var(--accent-purple);
        }

        .platform-toggle-group {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.4rem;
        }

        .platform-btn {
          padding: 0.5rem 0.25rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: var(--text-secondary);
          border-radius: var(--radius-sm);
          font-family: var(--font-main);
          font-weight: 700;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          text-transform: capitalize;
        }

        .platform-btn.active {
          background: rgba(99, 102, 241, 0.15);
          border-color: var(--accent-indigo);
          color: white;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.15);
        }

        .template-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .template-chip-btn {
          padding: 0.35rem 0.7rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 9999px;
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .template-chip-btn:hover {
          background: rgba(99, 102, 241, 0.1);
          border-color: rgba(99, 102, 241, 0.3);
          color: var(--text-primary);
        }

        .prompt-textarea {
          min-height: 100px;
          font-size: 0.875rem;
        }

        .generator-row-fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 600px) {
          .generator-row-fields {
            grid-template-columns: 1fr;
          }
        }

        .form-checkbox-row {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.25rem;
        }

        /* Checkbox styling */
        .checkbox-container {
          display: flex;
          align-items: center;
          position: relative;
          padding-left: 28px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          user-select: none;
        }

        .checkbox-container input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        .checkmark {
          position: absolute;
          top: 0;
          left: 0;
          height: 18px;
          width: 18px;
          background-color: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 4px;
          transition: all var(--transition-fast);
        }

        .checkbox-container:hover input ~ .checkmark {
          border-color: var(--accent-indigo);
          background-color: rgba(99, 102, 241, 0.05);
        }

        .checkbox-container input:checked ~ .checkmark {
          background-color: var(--accent-indigo);
          border-color: var(--accent-indigo);
        }

        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
        }

        .checkbox-container input:checked ~ .checkmark:after {
          display: block;
        }

        .checkbox-container .checkmark:after {
          left: 6px;
          top: 2px;
          width: 4px;
          height: 8px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .generate-submit-btn {
          width: 100%;
          margin-top: 0.5rem;
        }

        .generator-editor-preview {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .generated-textarea {
          min-height: 120px;
          font-size: 0.95rem;
          line-height: 1.5;
          margin-top: 0.5rem;
        }

        .copy-ready-tag {
          font-size: 0.75rem;
          font-weight: 700;
          background: rgba(16, 185, 129, 0.1);
          color: var(--accent-emerald);
          padding: 0.1rem 0.5rem;
          border-radius: 6px;
          gap: 0.25rem;
        }

        .media-selector-section {
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .section-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin-bottom: 0.75rem;
        }

        .unsplash-search-box {
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .image-search-input {
          flex: 1;
        }

        .stock-images-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 0.5rem;
        }

        @media (max-width: 600px) {
          .stock-images-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .stock-image-card {
          aspect-ratio: 1 / 1;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          position: relative;
          border: 2px solid transparent;
          transition: all var(--transition-fast);
        }

        .stock-image-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .stock-image-card:hover {
          transform: scale(1.05);
          border-color: rgba(99, 102, 241, 0.5);
        }

        .stock-image-card.active {
          border-color: var(--accent-indigo);
          box-shadow: var(--shadow-glow);
        }

        .selected-image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(99, 102, 241, 0.4);
          color: white;
        }

        .editor-footer-actions {
          margin-top: 1.5rem;
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .live-preview-box {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .preview-indicator {
          align-self: flex-start;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .preview-inner-wrap {
          width: 100%;
          background: rgba(0, 0, 0, 0.15);
          border: 1px dashed rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-md);
          padding: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default Generator;
