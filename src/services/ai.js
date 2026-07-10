import { GoogleGenerativeAI } from '@google/generative-ai';

// Clean markdown bold syntax since social media platforms don't support markdown bold (**text**)
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

// Highly realistic mock generator in case the user hasn't provided a Gemini API Key.
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

  // Apply tone alterations
  if (tone === 'witty') {
    postText = "Hot take: " + postText.replace(/\./g, '... or maybe not. 😉');
  } else if (tone === 'professional') {
    postText = postText.replace(/!/g, '.').replace(/🚀|✨|👇|🔥|💾/g, ''); // professional tone removes hype emojis
  } else if (tone === 'hype') {
    postText = "🔥🔥 ATTENTION CRITICS: " + postText.toUpperCase() + " !!! 🚀🚀";
  }

  // Emojis check
  if (!includeEmojis) {
    // Strip emojis
    postText = postText.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, '');
  }

  // Platform limits & tweaks
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
    // Facebook
    if (includeHashtags) {
      postText += "\n\n#AetherScheduler #AIPublisher";
    }
  }

  return cleanMarkdownForSocial(postText);
};

export const aiService = {
  generateSocialPost: async ({
    prompt,
    tone = 'professional',
    platform = 'twitter',
    audience = 'general tech founders',
    includeEmojis = true,
    includeHashtags = true,
    apiKey = ''
  }) => {
    // Try to hit the backend generation endpoint first
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, tone, platform, audience, includeEmojis, includeHashtags })
      });
      if (response.ok) {
        const data = await response.json();
        return data.content;
      }
    } catch (e) {
      console.warn('Backend AI generation offline, falling back to client-side...', e);
    }

    // If no API key is provided, return simulated content instantly
    if (!apiKey) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(generateMockPost(prompt, tone, platform, audience, includeEmojis, includeHashtags));
        }, 1500); // realistic latency simulation
      });
    }

    try {
      // Initialize the Gemini SDK
      const ai = new GoogleGenerativeAI(apiKey);
      const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

      // Platform specific details for instruction
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
      return cleanMarkdownForSocial(responseText.trim());
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error(`AI generation failed: ${error.message}. Please verify your API key or connection.`);
    }
  }
};
