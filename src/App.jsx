import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Generator from './pages/Generator';
import Schedule from './pages/Schedule';
import Accounts from './pages/Accounts';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import PostModal from './components/PostModal';
import { storageService } from './services/storage';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [posts, setPosts] = useState([]);
  const [accounts, setAccounts] = useState({});
  const [settings, setSettings] = useState({});
  const [slots, setSlots] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('aether_sidebar_collapsed') === 'true';
  });

  // Initialize and load databases
  useEffect(() => {
    const initAndLoad = async () => {
      await storageService.init();
      await loadAllData();
    };
    initAndLoad();
  }, []);

  // Sync sidebar collapse state to localStorage
  useEffect(() => {
    localStorage.setItem('aether_sidebar_collapsed', sidebarCollapsed);
  }, [sidebarCollapsed]);

  const loadAllData = async () => {
    try {
      const [postsData, accountsData, settingsData, slotsData, analytics] = await Promise.all([
        storageService.getPosts(),
        storageService.getAccounts(),
        storageService.getSettings(),
        storageService.getSlots(),
        storageService.getAnalytics()
      ]);
      setPosts(postsData);
      setAccounts(accountsData);
      setSettings(settingsData);
      setSlots(slotsData);
      setAnalyticsData(analytics);
    } catch (error) {
      console.error('Failed to load application data:', error);
    }
  };

  const handleSavePost = async (postData) => {
    if (postData.id) {
      // Edit mode
      await storageService.updatePost(postData.id, postData);
    } else {
      // Create mode
      await storageService.addPost(postData);
    }
    await loadAllData();
  };

  const handleDeletePost = async (id) => {
    const confirmation = window.confirm('Are you sure you want to delete this post from your schedule?');
    if (confirmation) {
      await storageService.deletePost(id);
      await loadAllData();
    }
  };

  const handleUpdateAccounts = async (updatedAccounts) => {
    await storageService.saveAccounts(updatedAccounts);
    setAccounts(updatedAccounts);
  };

  const handleUpdateSettings = async (updatedSettings) => {
    await storageService.saveSettings(updatedSettings);
    setSettings(updatedSettings);
  };

  const handleUpdateSlots = async (updatedSlots) => {
    await storageService.saveSlots(updatedSlots);
    setSlots(updatedSlots);
  };

  const handleOpenCreateModal = (presetDate = null) => {
    setPostToEdit(presetDate ? { scheduledDate: presetDate, platforms: [], content: '', status: 'scheduled' } : null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (post) => {
    setPostToEdit(post);
    setIsModalOpen(true);
  };

  // Connected accounts counter
  const connectedCount = Object.values(accounts).filter(a => a.connected).length;

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <Dashboard
            posts={posts}
            accounts={accounts}
            onEditPost={handleOpenEditModal}
            onNavigate={setActivePage}
          />
        );
      case 'generator':
        return (
          <Generator
            connectedAccounts={accounts}
            settings={settings}
            timeSlots={slots}
            onAddPost={handleSavePost}
            onNavigate={setActivePage}
          />
        );
      case 'schedule':
        return (
          <Schedule
            posts={posts}
            timeSlots={slots}
            onEditPost={handleOpenEditModal}
            onDeletePost={handleDeletePost}
            onOpenCreateModal={handleOpenCreateModal}
          />
        );
      case 'accounts':
        return (
          <Accounts
            accounts={accounts}
            onUpdateAccounts={handleUpdateAccounts}
          />
        );
      case 'analytics':
        return (
          <Analytics
            posts={posts}
            analytics={analyticsData}
            onNavigate={setActivePage}
          />
        );
      case 'settings':
        return (
          <Settings
            settings={settings}
            timeSlots={slots}
            onUpdateSettings={handleUpdateSettings}
            onUpdateSlots={handleUpdateSlots}
          />
        );
      default:
        return <Dashboard posts={posts} accounts={accounts} onEditPost={handleOpenEditModal} onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        connectedCount={connectedCount} 
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Topbar 
          activePage={activePage} 
          onOpenCreateModal={() => handleOpenCreateModal()}
          connectedAccounts={accounts}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />
        
        {renderActivePage()}
      </div>

      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        postToEdit={postToEdit}
        onSave={handleSavePost}
        connectedAccounts={accounts}
        timeSlots={slots}
      />
    </div>
  );
}

export default App;
