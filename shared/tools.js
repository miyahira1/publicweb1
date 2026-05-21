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
];

export const categories = ['all', ...new Set(tools.map(t => t.category))];
