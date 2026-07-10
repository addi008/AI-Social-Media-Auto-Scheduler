const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('./db.cjs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper: Clean markdown bold/italic syntax since social media doesn't support them
const cleanMarkdownForSocial = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // remove **bold**
    .replace(/\*(.*?)\*/g, '$1')   // remove *italic*
    .replace(/__(.*?)__/g, '$1')   // remove __bold__
    .replace(/_(.*?)_/g, '$1')     // remove _italic_
    .replace(/`(.*?)`/g, '$1')     // remove `code`
    .replace(/#\s+(.*?)\n/g, '$1\n') // remove headers
    .replace(/##\s+(.*?)\n/g, '$1\n');
};

// Helper: Generate mock post when no API key is set
const generateMockPost = (prompt, tone, platform, audience, includeEmojis, includeHashtags) => {
  const topics = {
    launch: {
      hooks: [
        "It is finally here! 🚀 We have been working behind the scenes on something game-changing.",
        "Big announcement! Today, we are launching Aether scheduler. Here is why we built it:👇",
        "Say goodbye to messy social media management. Say hello to seamless, AI-assisted publication. 🌟"
      ],
      bodies: [
        "Aether is designed to help you create, preview, schedule, and optimize your posts across all channels in one dark-mode dashboard. Build custom queue slots, drag-and-drop posts in calendar, and query analytics in seconds.",
        "We built this app to solve our own frustrations: scheduling posts shouldn't feel like a chore. That is why we added direct Gemini AI synthesis, offline template fallbacks, and local storage import/export backups.",
        "Whether you are an indie founder, marketing team, or developer building in public, Aether gives you the control and beauty you need to scale your social footprint effortlessly."
      ],
      ctas: [
        "Join our open beta today. Link in bio!",
        "Try it out for free and let us know what you think. We are live on Product Hunt today!",
        "What feature are you most excited about? Drop a comment and tell us! 👇"
      ]
    },
    general: {
      hooks: [
        `Thinking about "${prompt}" today. Here is a quick breakdown of how to tackle this:`,
        `Let us talk about "${prompt}". There is a massive misconception about how this works.`,
        `Struggling with "${prompt}"? You are not alone. Here are three actionable strategies to try right now:`
      ],
      bodies: [
        "1️⃣ Define the core problem clearly before writing any solution.\n2️⃣ Optimize for clarity and visual layout instead of filler words.\n3️⃣ Test, analyze, and iterate based on actual user engagement data.",
        "Focus on building high-fidelity client interactions. Every small details - from the subtle glow of a button to the smooth transition of a sidebar - builds immense trust with your audience.",
        "Keep your pipeline simple. Start with local database storage, test the UX with real users, and scale to heavy cloud infrastructures only when you reach real bottlenecks."
      ],
      ctas: [
        "What is your take on this? Let us discuss.",
        "Save this post if you found it valuable! 💾",
        "If you liked this post, follow along for more daily insights."
      ]
    }
  };

  const selectedTopic = prompt.toLowerCase().includes('launch') || prompt.toLowerCase().includes('release') || prompt.toLowerCase().includes('product') ? 'launch' : 'general';
  
  const hList = topics[selectedTopic].hooks;
  const bList = topics[selectedTopic].bodies;
  const cList = topics[selectedTopic].ctas;

  // Pick pseudo-random entries based on character sum of prompt
  const sum = prompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hook = hList[sum % hList.length];
  const body = bList[(sum + 1) % bList.length];
  const cta = cList[(sum + 2) % cList.length];

  let postText = `${hook}\n\n${body}\n\n${cta}`;

  if (tone === 'witty') {
    postText = "Hot take: " + postText.replace(/\./g, '... or maybe not. 😉');
  } else if (tone === 'professional') {
    postText = postText.replace(/!/g, '.').replace(/🚀|✨|👇|🔥|💾/g, ''); 
  } else if (tone === 'hype') {
    postText = "🔥🔥 ATTENTION CRITICS: " + postText.toUpperCase() + " !!! 🚀🚀";
  }

  if (!includeEmojis) {
    postText = postText.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, '');
  }

  if (platform === 'twitter') {
    if (includeHashtags) {
      postText += "\n\n#buildinpublic #solopreneur";
    }
    if (postText.length > 280) {
      postText = postText.substring(0, 260) + "... Read the full thread below! 👇";
    }
  } else if (platform === 'linkedin') {
    if (includeHashtags) {
      postText += "\n\n#startups #founderlife #personalbranding #webdev";
    }
  } else if (platform === 'instagram') {
    if (includeHashtags) {
      postText += "\n\n#socialmedia #ai #automation #marketingtips #growthhacking";
    }
  } else {
    if (includeHashtags) {
      postText += "\n\n#AetherScheduler #AIPublisher";
    }
  }

  return cleanMarkdownForSocial(postText);
};

// Helper: Generate 30 days of analytics seed data
const generateAnalyticsData = () => {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    
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


/* REST ENDPOINTS */

// 1. Posts CRUD
app.get('/api/posts', (req, res) => {
  try {
    res.json(db.getPosts());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/posts', (req, res) => {
  try {
    const posts = db.getPosts();
    const newPost = {
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      metrics: req.body.status === 'published' ? { impressions: 0, likes: 0, shares: 0, clicks: 0 } : undefined,
      ...req.body
    };
    posts.unshift(newPost);
    db.savePosts(posts);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/posts/:id', (req, res) => {
  try {
    const posts = db.getPosts();
    const index = posts.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...req.body };
      db.savePosts(posts);
      res.json(posts[index]);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/posts/:id', (req, res) => {
  try {
    const posts = db.getPosts();
    const filtered = posts.filter(p => p.id !== req.params.id);
    db.savePosts(filtered);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Social Accounts
app.get('/api/accounts', (req, res) => {
  try {
    res.json(db.getAccounts());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/accounts', (req, res) => {
  try {
    db.saveAccounts(req.body);
    res.json(req.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Settings
app.get('/api/settings', (req, res) => {
  try {
    res.json(db.getSettings());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/settings', (req, res) => {
  try {
    db.saveSettings(req.body);
    res.json(req.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Slots
app.get('/api/slots', (req, res) => {
  try {
    res.json(db.getSlots());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/slots', (req, res) => {
  try {
    db.saveSlots(req.body);
    res.json(req.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Backup Export / Import & System Reset
app.post('/api/import', (req, res) => {
  try {
    const { posts, accounts, settings, slots } = req.body;
    if (posts && accounts && settings && slots) {
      db.importAll({ posts, accounts, settings, slots });
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid backup file structure' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/reset', (req, res) => {
  try {
    db.resetAll();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Analytics API
app.get('/api/analytics', (req, res) => {
  try {
    const data = generateAnalyticsData();
    const posts = db.getPosts().filter(p => p.status === 'published');
    
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

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. AI Generate API
app.post('/api/generate', async (req, res) => {
  const {
    prompt,
    tone = 'professional',
    platform = 'twitter',
    audience = 'general tech founders',
    includeEmojis = true,
    includeHashtags = true
  } = req.body;

  // Retrieve Gemini API Key from settings or environment
  const settings = db.getSettings();
  const apiKey = settings.geminiApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Return mock post after simulated delay
    setTimeout(() => {
      res.json({ content: generateMockPost(prompt, tone, platform, audience, includeEmojis, includeHashtags) });
    }, 1200);
    return;
  }

  try {
    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

    let characterLimit = '280 characters';
    if (platform === 'linkedin') characterLimit = '3000 characters';
    if (platform === 'instagram') characterLimit = '2200 characters';
    if (platform === 'facebook') characterLimit = '5000 characters';

    const systemPrompt = `You are a social media copywriter. Write a single, highly engaging post for the social platform: "${platform.toUpperCase()}".
Target Audience: ${audience}.
Tone of Voice: ${tone} (e.g. casual, professional, hype, informative).
Length constraints: Maximum ${characterLimit}. Keep it concise and formatted with natural line breaks.
Emoji usage: ${includeEmojis ? 'Include contextually relevant emojis' : 'Do NOT include any emojis'}.
Hashtags usage: ${includeHashtags ? 'Include 3-4 popular hashtags at the bottom' : 'Do NOT include any hashtags'}.

CRITICAL: Return ONLY the final post copy. Do not include markdown headers, quotes, or prefaces. Remove bold markdown tags (**word**) from the text since social platforms do not render markdown.

User prompt/topic: "${prompt}"`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: systemPrompt }] }]
    });

    const responseText = result.response.text();
    const content = cleanMarkdownForSocial(responseText.trim());
    res.json({ content });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: `AI generation failed: ${error.message}` });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`[Aether Server] Backend running on http://localhost:${PORT}`);
});
