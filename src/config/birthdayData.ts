import { BirthdayConfig } from '../types';

// Aesthetic illustrated placeholder photos for the scrapbook
// These can easily be replaced by uploading photos directly in the app or modifying this file
export const DEFAULT_PHOTOS = [
  {
    id: 'photo-1',
    url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop', // celebratory pastel confetti & cozy vibe
    caption: 'Little moments, big memories.',
    date: 'Memories',
    tag: 'Cozy moments',
    rotation: -3,
  },
  {
    id: 'photo-2',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop', // stylish glasses portrait vibe
    caption: 'Some moments deserve to be remembered.',
    date: 'Good Vibes',
    tag: 'Smiles & Sunshine',
    rotation: 2.5,
  },
  {
    id: 'photo-3',
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop', // warm friends laughing together
    caption: 'Good times, great friendship.',
    date: 'Always Grateful',
    tag: 'Pure Joy',
    rotation: -1.5,
  },
  {
    id: 'photo-4',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop', // peaceful cafe & warm beverage
    caption: 'Conversations that feel like home.',
    date: 'Cozy Chats',
    tag: 'Favorite Days',
    rotation: 3,
  },
  {
    id: 'photo-5',
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop', // festive sparklers & celebration
    caption: 'Here is to celebrating you today!',
    date: 'Celebrate',
    tag: 'Special Day',
    rotation: -2,
  },
  {
    id: 'photo-6',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop', // dreamy clouds and golden sunset
    caption: 'Wishing you all the happiness ahead.',
    date: 'Bright Future',
    tag: 'New Horizons',
    rotation: 1.8,
  },
];

export const DEFAULT_APPRECIATION_CARDS = [
  {
    id: 'card-1',
    title: 'Genuine Kindness',
    message: 'Your kindness makes a difference.',
    iconName: 'HeartHandshake',
    accentColor: '#D8B4F8', // Lavender
  },
  {
    id: 'card-2',
    title: 'Radiant Positivity',
    message: 'Your smile can brighten an ordinary day.',
    iconName: 'Sun',
    accentColor: '#FDE047', // Soft Gold
  },
  {
    id: 'card-3',
    title: 'Unmistakable Spark',
    message: 'You bring your own unique energy.',
    iconName: 'Sparkles',
    accentColor: '#FDBA74', // Peach
  },
  {
    id: 'card-4',
    title: 'Authentic Spirit',
    message: "You're genuinely one of a kind.",
    iconName: 'Gem',
    accentColor: '#BAE6FD', // Sky pastel
  },
  {
    id: 'card-5',
    title: 'True to Yourself',
    message: 'Never stop being yourself.',
    iconName: 'Compass',
    accentColor: '#DDD6FE', // Lilac
  },
  {
    id: 'card-6',
    title: 'A Rare Presence',
    message: 'The world needs more people like you.',
    iconName: 'Globe',
    accentColor: '#BBF7D0', // Mint
  },
];

export const DEFAULT_STICKY_NOTES = [
  {
    id: 'note-1',
    text: 'May all your exams, projects, and ambitious goals turn out brilliantly! 🌟',
    author: 'A friendly wish',
    color: 'yellow' as const,
    x: 40,
    y: 35,
    rotation: -3,
  },
  {
    id: 'note-2',
    text: 'Reminder: Take a break today, eat good food, and do what makes you happiest! 🍰',
    author: 'Birthday rule',
    color: 'lavender' as const,
    x: 290,
    y: 25,
    rotation: 4,
  },
  {
    id: 'note-3',
    text: 'Super proud of everything you have accomplished this past year. Keep shining! ✨',
    author: 'Good vibes',
    color: 'peach' as const,
    x: 540,
    y: 45,
    rotation: -2,
  },
  {
    id: 'note-4',
    text: 'Stylin’ in those glasses as always! Never stop rocking your signature look. 👓',
    author: 'Style note',
    color: 'mint' as const,
    x: 120,
    y: 220,
    rotation: 2.5,
  },
  {
    id: 'note-5',
    text: 'May this year be packed with spontaneous laughter and unforgettable coffee breaks. ☕',
    author: 'Friendship note',
    color: 'cream' as const,
    x: 380,
    y: 240,
    rotation: -4,
  },
  {
    id: 'note-6',
    text: 'Stay curious, confident, and unapologetically you. Happy Birthday Afreen! 🎉',
    author: 'Big cheer',
    color: 'yellow' as const,
    x: 630,
    y: 210,
    rotation: 3,
  },
];

export const DEFAULT_LETTER = `Dear Afreen,

Happy Birthday!

I hope this new chapter of your life brings you happiness, success, good health and countless reasons to smile.

Keep being the amazing person you are. May you achieve everything you've been working towards, discover new opportunities and create memories worth remembering.

Never lose your individuality, kindness and confidence.

Have an absolutely wonderful birthday!

Your friend ❤️`;

export const INITIAL_CONFIG: BirthdayConfig = {
  recipientName: 'Afreen',
  greetingTitle: 'A Little Something for Afreen 🎂',
  letterContent: DEFAULT_LETTER,
  photos: DEFAULT_PHOTOS,
  appreciationCards: DEFAULT_APPRECIATION_CARDS,
  stickyNotes: DEFAULT_STICKY_NOTES,
};
