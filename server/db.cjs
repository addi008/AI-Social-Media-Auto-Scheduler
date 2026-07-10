const fs = require('fs');
const path = require('path');

const DATA_FILE_PATH = path.join(__dirname, 'data.json');

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

const getInitialData = () => ({
  posts: getSeedPosts(),
  accounts: DEFAULT_ACCOUNTS,
  settings: DEFAULT_SETTINGS,
  slots: DEFAULT_SLOTS
});

const readDB = () => {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      const initialData = getInitialData();
      writeDB(initialData);
      return initialData;
    }
    const dataStr = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    return JSON.parse(dataStr);
  } catch (error) {
    console.error('Error reading from JSON database:', error);
    return getInitialData();
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing to JSON database:', error);
    return false;
  }
};

module.exports = {
  getPosts: () => readDB().posts || [],
  savePosts: (posts) => {
    const data = readDB();
    data.posts = posts;
    return writeDB(data);
  },
  getAccounts: () => readDB().accounts || DEFAULT_ACCOUNTS,
  saveAccounts: (accounts) => {
    const data = readDB();
    data.accounts = accounts;
    return writeDB(data);
  },
  getSettings: () => readDB().settings || DEFAULT_SETTINGS,
  saveSettings: (settings) => {
    const data = readDB();
    data.settings = settings;
    return writeDB(data);
  },
  getSlots: () => readDB().slots || DEFAULT_SLOTS,
  saveSlots: (slots) => {
    const data = readDB();
    data.slots = slots;
    return writeDB(data);
  },
  importAll: (allData) => {
    return writeDB(allData);
  },
  resetAll: () => {
    const initialData = getInitialData();
    return writeDB(initialData);
  }
};
