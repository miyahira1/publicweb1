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
];

export const categories = ['all', ...new Set(tools.map(t => t.category))];
