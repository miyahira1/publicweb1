export const tools = [
  {
    id: 'snake',
    title: 'Snake',
    description: 'Classic snake — smooth canvas rendering, Web Audio sound effects, mobile swipe support.',
    category: 'game',
    icon: '🐍',
    url: './games/snake/',
    tags: ['canvas', 'audio', 'classic'],
    featured: true,
  },
  {
    id: 'kunkunshi',
    title: 'Kunkunshi',
    description: 'Okinawan sanshin notation — browse and read songs in the traditional 工工四 format. Includes Western adaptations.',
    category: 'tool',
    icon: '🎵',
    url: './tools/kunkunshi/',
    tags: ['music', 'okinawa', 'notation'],
    featured: false,
  },
  {
    id: 'how-it-works',
    title: 'How It Works',
    description: 'How this playground is built — Claude Code on a phone, git push to GitHub, served free via Pages. Advantages and limitations.',
    category: 'note',
    icon: '📖',
    url: './notes/how-it-works/',
    tags: ['meta', 'devlog', 'github-pages'],
    featured: false,
  },
];

export const categories = ['all', ...new Set(tools.map(t => t.category))];
