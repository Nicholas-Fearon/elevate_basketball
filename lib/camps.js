// Edit these cards freely. Live camps come from Supabase once configured.
export const placeholderCamps = [
  { id: 'preview-1', title: 'Discover the game', subtitle: 'A playful first step onto the court.', tag: 'PLAY & DISCOVER', tone: 'peach-card' },
  { id: 'preview-2', title: 'Build your confidence', subtitle: 'More movement. More moments to grow.', tag: 'LEARN & GROW', tone: 'green-card' },
  { id: 'preview-3', title: 'Keep the fun going', subtitle: 'Team up, join in and enjoy the game.', tag: 'CONNECT & PLAY', tone: 'yellow-card' },
];
export const formatDate = value => new Intl.DateTimeFormat('en-GB', { day:'numeric', month:'short', year:'numeric', timeZone:'Europe/London' }).format(new Date(value));
export const formatPrice = pennies => new Intl.NumberFormat('en-GB', { style:'currency', currency:'GBP', maximumFractionDigits:2 }).format(pennies / 100);
