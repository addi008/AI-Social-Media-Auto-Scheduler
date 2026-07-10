const STORAGE_KEY_PREFIX = 'aether_';

const KEYS = {
  POSTS: `${STORAGE_KEY_PREFIX}posts`,
  ACCOUNTS: `${STORAGE_KEY_PREFIX}accounts`,
  SETTINGS: `${STORAGE_KEY_PREFIX}settings`,
  SLOTS: `${STORAGE_KEY_PREFIX}slots`,
};

// Default posting slots
const DEFAULT_SLOTS = ['09:00', '13:00', '18:00'];

// Seed profiles
const DEFAULT_ACCOUNTS = {
  twitter: {
    id: 'twitter',
    name: 'Aether Brand',
    handle: '@aether_scheduler',
    connected: true,
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    followers: 12480,
    growth: 8.2,
    platform: 'twitter'
  },
  linkedin: {
    id: 'linkedin',
    name: 'Aether Software Corp',
    handle: 'aether-publishing',
    connected: true,
    avatar: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=120&q=80',
    followers: 4320,
    growth: 14.5,
    platform: 'linkedin'
  },
  instagram: {
    id: 'instagram',
    name: 'Aether Visuals',
    handle: '@aether.gallery',
    connected: false,
    avatar: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=120&q=80',
    followers: 0,
    growth: 0,
    platform: 'instagram'
  },
  facebook: {
    id: 'facebook',
    name: 'Aether Hub',
    handle: 'aether.official',
    connected: false,
    avatar: 'https://images.unsplash.com/photo-1614850727173-1f191b9fa76b?auto=format&fit=crop&w=120&q=80',
    followers: 0,
    growth: 0,
    platform: 'facebook'
  }
};

const DEFAULT_SETTINGS = {
  geminiApiKey: '',
  unsplashApiKey: '',
  theme: 'dark',
};

// Generate 30 days of analytics seed data
const generateAnalyticsData = () => {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    
    // Create organic-looking curve with daily variance
    const dayFactor = (30 - i) / 30; // overall upwards trend
    const baseImpressions = 1500 + Math.sin(i * 0.8) * 400 + Math.random() * 300;
    const baseClicks = 80 + Math.cos(i * 0.5) * 20 + Math.random() * 15;
    const baseFollowers = 16800 + Math.floor(i * 12 + Math.sin(i) * 5);

    data.push({
      date: d.toISOString().split('T')[0],
      impressions: Math.floor(baseImpressions * (1 + dayFactor * 0.25)),
      clicks: Math.floor(baseClicks * (1 + dayFactor * 0.15)),
      engagement: parseFloat((3.2 + Math.sin(i * 1.2) * 0.5 + Math.random() * 0.3).toFixed(2)),
      followers: baseFollowers
    });
  }
  return data;
};

// Seed posts
const getSeedPosts = () => {
  const now = new Date();
  
  const d1 = new Date(now); d1.setDate(now.getDate() - 1); d1.setHours(9, 15, 0);
  const d2 = new Date(now); d2.setDate(now.getDate() - 3); d2.setHours(13, 0, 0);
  const d3 = new Date(now); d3.setDate(now.getDate() - 5); d3.setHours(18, 45, 0);
  const d4 = new Date(now); d4.setDate(now.getDate() - 10); d4.setHours(9, 0, 0);
  const d5 = new Date(now); d5.setDate(now.getDate() - 15); d5.setHours(13, 30, 0);
  
  // Future dates
  const f1 = new Date(now); f1.setDate(now.getDate() + 1); f1.setHours(9, 0, 0);
  const f2 = new Date(now); f2.setDate(now.getDate() + 2); f2.setHours(18, 0, 0);

  return [
    {
      id: 'seed-post-1',
      content: 'Building products is 10% coding and 90% understanding who you are building for. What is the single biggest lesson you have learned about user research this year? Let us discuss below 👇 #buildinginpublic #startups #indiehackers',
      platforms: ['twitter', 'linkedin'],
      status: 'published',
      scheduledDate: d1.toISOString(),
      mediaUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date(d1.getTime() - 86400000).toISOString(),
      metrics: { impressions: 1824, likes: 112, shares: 14, clicks: 45 }
    },
    {
      id: 'seed-post-2',
      content: 'We are thrilled to announce that Aether Suite is rolling out its new collaborative workspace features today! Working in teams just became 10x faster and visually stunning. Check out the full breakdown in our bio. 🚀✨ #ProductRelease #DesignSystem #UIUX',
      platforms: ['linkedin'],
      status: 'published',
      scheduledDate: d2.toISOString(),
      mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date(d2.getTime() - 86400000).toISOString(),
      metrics: { impressions: 2450, likes: 184, shares: 32, clicks: 98 }
    },
    {
      id: 'seed-post-3',
      content: 'Aesthetic design is not just visual; it is functional psychology. A interface that is clean, responsive, and delightful builds subconscious trust. Here is a breakdown of 5 micro-interactions you can add to your web app to wow users instantly. 🧵👇',
      platforms: ['twitter'],
      status: 'published',
      scheduledDate: d3.toISOString(),
      mediaUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date(d3.getTime() - 86400000).toISOString(),
      metrics: { impressions: 1420, likes: 95, shares: 28, clicks: 31 }
    },
    {
      id: 'seed-post-4',
      content: 'Quick tip for developers building client-side dashboards: Always optimize your chart rerenders. Virtualize long lists and debounce resize event listeners to keep UI transitions buttery smooth (60fps). Your users will thank you! 📈💻 #javascript #reactjs #webdev',
      platforms: ['twitter', 'linkedin'],
      status: 'published',
      scheduledDate: d4.toISOString(),
      mediaUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date(d4.getTime() - 86400000).toISOString(),
      metrics: { impressions: 940, likes: 48, shares: 3, clicks: 12 }
    },
    {
      id: 'seed-post-5',
      content: 'We are expanding the team! Aether is looking for a Senior Product Engineer passionate about high-fidelity design systems, SVG animations, and polished client experiences. Work from anywhere, competitive equity, and an amazing culture. Apply now! 💼🌍',
      platforms: ['linkedin'],
      status: 'published',
      scheduledDate: d5.toISOString(),
      mediaUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date(d5.getTime() - 86400000).toISOString(),
      metrics: { impressions: 3820, likes: 245, shares: 48, clicks: 174 }
    },
    {
      id: 'seed-post-6',
      content: 'This post failed to publish due to an expired API authentication token. Please reconnect your Instagram business profile inside the accounts settings and try republishing.',
      platforms: ['instagram'],
      status: 'failed',
      scheduledDate: new Date(now.getTime() - 3600000 * 2).toISOString(),
      createdAt: new Date(now.getTime() - 3600000 * 6).toISOString(),
      mediaUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
      errorMessage: 'OAuth token has expired (error code 190).'
    },
    // Scheduled
    {
      id: 'seed-scheduled-1',
      content: 'AI is not going to replace content creators. But creators using AI to research, draft, outline, and schedule are going to replace creators who do not. The secret is keeping the human element front and center while scaling automation. Agree? 🤖💡',
      platforms: ['twitter', 'linkedin'],
      status: 'scheduled',
      scheduledDate: f1.toISOString(),
      mediaUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
      createdAt: now.toISOString()
    },
    {
      id: 'seed-scheduled-2',
      content: 'Coming soon: A look behind the curtain at how we engineered our custom layout engines. We are sharing our engineering whiteboard sessions, design sprint documents, and key architecture decisions next week. Stay tuned! 📐🎨',
      platforms: ['linkedin'],
      status: 'scheduled',
      scheduledDate: f2.toISOString(),
      mediaUrl: 'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=800&q=80',
      createdAt: now.toISOString()
    }
  ];
};

export const storageService = {
  // Initialize standard structures if empty
  init: async () => {
    try {
      const res = await fetch('/api/posts');
      if (!res.ok) throw new Error();
    } catch {
      // offline fallback
      if (!localStorage.getItem(KEYS.POSTS)) {
        localStorage.setItem(KEYS.POSTS, JSON.stringify(getSeedPosts()));
      }
      if (!localStorage.getItem(KEYS.ACCOUNTS)) {
        localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(DEFAULT_ACCOUNTS));
      }
      if (!localStorage.getItem(KEYS.SETTINGS)) {
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      }
      if (!localStorage.getItem(KEYS.SLOTS)) {
        localStorage.setItem(KEYS.SLOTS, JSON.stringify(DEFAULT_SLOTS));
      }
    }
  },

  // Getters
  getPosts: async () => {
    try {
      const res = await fetch('/api/posts');
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      // offline fallback
    }
    await storageService.init();
    return JSON.parse(localStorage.getItem(KEYS.POSTS)) || [];
  },

  getAccounts: async () => {
    try {
      const res = await fetch('/api/accounts');
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      // offline fallback
    }
    await storageService.init();
    return JSON.parse(localStorage.getItem(KEYS.ACCOUNTS)) || DEFAULT_ACCOUNTS;
  },

  getSettings: async () => {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      // offline fallback
    }
    await storageService.init();
    return JSON.parse(localStorage.getItem(KEYS.SETTINGS)) || DEFAULT_SETTINGS;
  },

  getSlots: async () => {
    try {
      const res = await fetch('/api/slots');
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      // offline fallback
    }
    await storageService.init();
    return JSON.parse(localStorage.getItem(KEYS.SLOTS)) || DEFAULT_SLOTS;
  },

  // Setters/Updaters
  savePosts: async (posts) => {
    localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
  },

  saveAccounts: async (accounts) => {
    try {
      const res = await fetch('/api/accounts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accounts)
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      // offline fallback
    }
    localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(accounts));
  },

  saveSettings: async (settings) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      // offline fallback
    }
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  saveSlots: async (slots) => {
    try {
      const res = await fetch('/api/slots', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slots)
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      // offline fallback
    }
    localStorage.setItem(KEYS.SLOTS, JSON.stringify(slots));
  },

  // CRUD for Posts
  addPost: async (post) => {
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      // offline fallback
    }
    const posts = await storageService.getPosts();
    const newPost = {
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      metrics: post.status === 'published' ? { impressions: 0, likes: 0, shares: 0, clicks: 0 } : undefined,
      ...post
    };
    posts.unshift(newPost);
    await storageService.savePosts(posts);
    return newPost;
  },

  updatePost: async (id, updatedFields) => {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      // offline fallback
    }
    const posts = await storageService.getPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...updatedFields };
      await storageService.savePosts(posts);
      return posts[index];
    }
    return null;
  },

  deletePost: async (id) => {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error();
      return true;
    } catch {
      // offline fallback
    }
    const posts = await storageService.getPosts();
    const filtered = posts.filter(p => p.id !== id);
    await storageService.savePosts(filtered);
    return true;
  },

  // Database Backup Actions
  exportData: async () => {
    try {
      const posts = await storageService.getPosts();
      const accounts = await storageService.getAccounts();
      const settings = await storageService.getSettings();
      const slots = await storageService.getSlots();
      const data = {
        posts,
        accounts,
        settings,
        slots,
        exportedAt: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `aether_scheduler_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      console.error('Failed to export data');
    }
  },

  importData: async (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.posts && parsed.accounts && parsed.settings && parsed.slots) {
        try {
          const res = await fetch('/api/import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsed)
          });
          if (!res.ok) throw new Error();
          return { success: true };
        } catch {
          // offline fallback
        }
        localStorage.setItem(KEYS.POSTS, JSON.stringify(parsed.posts));
        localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(parsed.accounts));
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(parsed.settings));
        localStorage.setItem(KEYS.SLOTS, JSON.stringify(parsed.slots));
        return { success: true };
      }
      return { success: false, error: 'Invalid backup file structure' };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMsg };
    }
  },

  resetAll: async () => {
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (!res.ok) throw new Error();
      return true;
    } catch {
      // offline fallback
    }
    localStorage.removeItem(KEYS.POSTS);
    localStorage.removeItem(KEYS.ACCOUNTS);
    localStorage.removeItem(KEYS.SETTINGS);
    localStorage.removeItem(KEYS.SLOTS);
    await storageService.init();
    return true;
  },

  // Helper for generating visual chart structures
  getAnalytics: async () => {
    try {
      const res = await fetch('/api/analytics');
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      // offline fallback
    }
    // Generate analytics based on published posts and follower trends
    const data = generateAnalyticsData();
    const posts = (await storageService.getPosts()).filter(p => p.status === 'published');
    
    // Add realistic weights to analytics if there are actual published posts
    posts.forEach((post) => {
      if (post.metrics && post.scheduledDate) {
        const dateStr = post.scheduledDate.split('T')[0];
        const dayRecord = data.find(d => d.date === dateStr);
        if (dayRecord) {
          dayRecord.impressions += post.metrics.impressions || 0;
          dayRecord.clicks += post.metrics.clicks || 0;
        }
      }
    });

    return data;
  }
};
