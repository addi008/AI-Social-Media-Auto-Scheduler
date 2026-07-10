import React, { useState } from 'react';
import { 
  Key, 
  Clock, 
  Trash2, 
  Plus, 
  Download, 
  Upload, 
  AlertTriangle, 
  Save, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import { storageService } from '../services/storage';

const Settings = ({ settings = {}, timeSlots = [], onUpdateSettings, onUpdateSlots }) => {
  const [geminiKey, setGeminiKey] = useState(settings.geminiApiKey || '');
  const [newSlot, setNewSlot] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  const handleSaveKeys = (e) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      geminiApiKey: geminiKey
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAddSlot = () => {
    if (!newSlot) return;
    
    // Validate 24h format (HH:MM)
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    let formatted = newSlot.trim();
    
    if (formatted.length === 4 && !formatted.includes(':')) {
      formatted = `${formatted.substring(0, 2)}:${formatted.substring(2)}`;
    }
    
    if (!formatted.includes(':') && Number(formatted) < 24) {
      formatted = `${String(formatted).padStart(2, '0')}:00`;
    }

    if (!regex.test(formatted)) {
      alert('Invalid time format. Please use HH:MM format (e.g. 15:30).');
      return;
    }

    if (timeSlots.includes(formatted)) {
      alert('This slot already exists.');
      return;
    }

    const updated = [...timeSlots, formatted].sort();
    onUpdateSlots(updated);
    setNewSlot('');
  };

  const handleDeleteSlot = (slot) => {
    const updated = timeSlots.filter(s => s !== slot);
    onUpdateSlots(updated);
  };

  const handleExport = async () => {
    await storageService.exportData();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = await storageService.importData(event.target.result);
      if (result.success) {
        setImportSuccess(true);
        setImportError('');
        setTimeout(() => {
          setImportSuccess(false);
          window.location.reload(); // refresh to load new data
        }, 1500);
      } else {
        setImportError(result.error);
        setImportSuccess(false);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = async () => {
    const confirm = window.confirm('DANGER: This will delete all your scheduled posts, custom time slots, connected accounts, and settings. Are you sure you want to restore default seed values?');
    if (confirm) {
      await storageService.resetAll();
      window.location.reload();
    }
  };

  return (
    <div className="settings-page animate-fade-in">
      <div className="settings-layout-grid">
        
        {/* Left Side: Keys and Slots */}
        <div className="settings-left-col">
          {/* API Keys */}
          <div className="settings-section-card glass-panel">
            <div className="card-header-with-icon">
              <Key size={16} className="text-indigo" />
              <h3>Integrations & API Keys</h3>
            </div>
            
            <form onSubmit={handleSaveKeys} className="keys-form">
              <div className="form-group">
                <label>Gemini API Key</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your Gemini API key (AI Studio)..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                />
                <span className="input-helper-text">
                  Your key is saved locally in your browser and used directly for client-side content generation. If left blank, Aether will run in offline simulation mode.
                </span>
              </div>

              <button type="submit" className="btn btn-primary btn-sm flex-center">
                {isSaved ? (
                  <>
                    <Check size={14} />
                    <span>Credentials Saved!</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save Key</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Time Slots */}
          <div className="settings-section-card glass-panel">
            <div className="card-header-with-icon">
              <Clock size={16} className="text-cyan" />
              <h3>Queue Posting Slots</h3>
            </div>
            <p className="section-desc">Create default daily slots. Added posts will auto-fit the next free slot chronologically.</p>
            
            <div className="slots-editor-layout">
              <div className="slots-grid-setting">
                {timeSlots.map((slot) => (
                  <div key={slot} className="slot-badge flex-center">
                    <span>{slot}</span>
                    <button className="delete-slot-btn flex-center" onClick={() => handleDeleteSlot(slot)}>
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="add-slot-row flex-center">
                <input
                  type="text"
                  placeholder="e.g. 15:30"
                  className="form-control time-input"
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSlot()}
                />
                <button className="btn btn-glass btn-sm flex-center" onClick={handleAddSlot}>
                  <Plus size={14} />
                  <span>Add Slot</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Backups and Actions */}
        <div className="settings-right-col">
          {/* Backup */}
          <div className="settings-section-card glass-panel">
            <div className="card-header">
              <h3>Database Export / Import</h3>
            </div>
            <p className="section-desc">Take your scheduled calendar, queue slots, and social analytics database with you.</p>

            <div className="backup-actions-group">
              <button className="btn btn-glass flex-center" onClick={handleExport}>
                <Download size={15} />
                <span>Export Backup (.json)</span>
              </button>

              <div className="file-import-container flex-center">
                <label htmlFor="import-file" className="btn btn-secondary flex-center label-btn">
                  <Upload size={15} />
                  <span>Import Backup (.json)</span>
                </label>
                <input
                  id="import-file"
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  style={{ display: 'none' }}
                />
              </div>

              {importSuccess && (
                <div className="import-status-banner success flex-center">
                  <Check size={14} />
                  <span>Backup restored! Syncing layout...</span>
                </div>
              )}
              {importError && (
                <div className="import-status-banner error flex-center">
                  <AlertTriangle size={14} />
                  <span>{importError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Reset System */}
          <div className="settings-section-card glass-panel danger-border">
            <div className="card-header">
              <h3 className="danger-text">System Reset</h3>
            </div>
            <p className="section-desc">Wipe all stored social media posts, custom analytics history and connection variables.</p>
            
            <button className="btn btn-danger flex-center reset-trigger-btn" onClick={handleReset}>
              <RefreshCw size={15} />
              <span>Reset Local Database</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .settings-page {
          width: 100%;
        }

        .settings-layout-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 1.5rem;
          align-items: start;
        }

        @media (max-width: 900px) {
          .settings-layout-grid {
            grid-template-columns: 1fr;
          }
        }

        .settings-section-card {
          padding: 1.5rem;
          background: rgba(18, 22, 47, 0.65);
          margin-bottom: 1.5rem;
        }

        .settings-section-card.danger-border {
          border-color: rgba(244, 63, 94, 0.25);
        }

        .card-header-with-icon {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 0.5rem;
        }

        .card-header-with-icon h3 {
          font-size: 1rem;
          font-family: var(--font-display);
        }

        .section-desc {
          font-size: 0.775rem;
          color: var(--text-muted);
          margin-bottom: 1.25rem;
          line-height: 1.45;
        }

        .keys-form {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .input-helper-text {
          font-size: 0.7rem;
          color: var(--text-muted);
          line-height: 1.35;
          margin-top: 0.25rem;
        }

        .text-indigo {
          color: var(--accent-indigo);
        }

        .text-cyan {
          color: var(--accent-cyan);
        }

        /* Slots Editor Styles */
        .slots-editor-layout {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .slots-grid-setting {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .slot-badge {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 0.4rem 0.65rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--accent-cyan);
          gap: 0.5rem;
        }

        .delete-slot-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          transition: color var(--transition-fast);
        }

        .delete-slot-btn:hover {
          color: var(--accent-rose);
        }

        .add-slot-row {
          gap: 0.5rem;
          justify-content: flex-start;
        }

        .time-input {
          max-width: 100px;
          text-align: center;
        }

        /* Backup actions */
        .backup-actions-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .backup-actions-group .btn, .file-import-container, .label-btn {
          width: 100%;
        }

        .label-btn {
          cursor: pointer;
        }

        .import-status-banner {
          padding: 0.75rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }

        .import-status-banner.success {
          background: rgba(16, 185, 129, 0.1);
          color: var(--accent-emerald);
          border: 1px solid rgba(16, 185, 129, 0.15);
        }

        .import-status-banner.error {
          background: rgba(244, 63, 94, 0.1);
          color: var(--accent-rose);
          border: 1px solid rgba(244, 63, 94, 0.15);
        }

        .danger-text {
          color: #f43f5e !important;
        }

        .reset-trigger-btn {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default Settings;
