// Single source of truth for supported platforms.
// Same shape for the editor (input list) and the viewer (link rendering).

const strip = (v: string, p: string) => (v.startsWith(p) ? v.slice(p.length) : v);

const SVG = {
  mail:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  link:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
};

export type Platform = {
  id: string;
  name: string;
  icon?: string;
  svg?: string;
  color: string;
  ph: string;
  url: (v: string) => string;
};

export const PLATFORMS: Platform[] = [
  { id:'ig', name:'Instagram',     icon:'instagram',   color:'E4405F', ph:'username',                  url:v => `https://instagram.com/${strip(v,'@')}` },
  { id:'tt', name:'TikTok',        icon:'tiktok',      color:'000000', ph:'username',                  url:v => `https://tiktok.com/@${strip(v,'@')}` },
  { id:'yt', name:'YouTube',       icon:'youtube',     color:'FF0000', ph:'@channel',                  url:v => `https://youtube.com/@${strip(v,'@')}` },
  { id:'tw', name:'X / Twitter',   icon:'x',           color:'000000', ph:'username',                  url:v => `https://x.com/${strip(v,'@')}` },
  { id:'fb', name:'Facebook',      icon:'facebook',    color:'1877F2', ph:'username or page',          url:v => `https://facebook.com/${v}` },
  { id:'li', name:'LinkedIn',      icon:'linkedin',    color:'0A66C2', ph:'in/username',               url:v => `https://linkedin.com/${/^(in|company)\//.test(v) ? v : 'in/' + strip(v,'@')}` },
  { id:'th', name:'Threads',       icon:'threads',     color:'000000', ph:'username',                  url:v => `https://threads.net/@${strip(v,'@')}` },
  { id:'sn', name:'Snapchat',      icon:'snapchat',    color:'FFFC00', ph:'username',                  url:v => `https://snapchat.com/add/${v}` },
  { id:'pi', name:'Pinterest',     icon:'pinterest',   color:'BD081C', ph:'username',                  url:v => `https://pinterest.com/${v}` },
  { id:'wa', name:'WhatsApp',      icon:'whatsapp',    color:'25D366', ph:'+12025550123',              url:v => `https://wa.me/${v.replace(/[^0-9]/g, '')}` },
  { id:'tg', name:'Telegram',      icon:'telegram',    color:'26A5E4', ph:'username',                  url:v => `https://t.me/${strip(v,'@')}` },
  { id:'sg', name:'Signal',        icon:'signal',      color:'3A76F0', ph:'signal.me link or code',    url:v => /^https?:/.test(v) ? v : `https://signal.me/#p/${v}` },
  { id:'dc', name:'Discord',       icon:'discord',     color:'5865F2', ph:'invite code or link',       url:v => /^https?:/.test(v) ? v : `https://discord.gg/${v}` },
  { id:'tv', name:'Twitch',        icon:'twitch',      color:'9146FF', ph:'username',                  url:v => `https://twitch.tv/${v}` },
  { id:'kk', name:'Kick',          icon:'kick',        color:'53FC18', ph:'username',                  url:v => `https://kick.com/${v}` },
  { id:'sm', name:'Steam',         icon:'steam',       color:'000000', ph:'profile id',                url:v => `https://steamcommunity.com/id/${v}` },
  { id:'sp', name:'Spotify',       icon:'spotify',     color:'1DB954', ph:'profile URL or id',         url:v => /^https?:/.test(v) ? v : `https://open.spotify.com/user/${v}` },
  { id:'am', name:'Apple Music',   icon:'applemusic',  color:'FA243C', ph:'profile URL',               url:v => /^https?:/.test(v) ? v : `https://music.apple.com/profile/${v}` },
  { id:'sc', name:'SoundCloud',    icon:'soundcloud',  color:'FF7700', ph:'username',                  url:v => `https://soundcloud.com/${v}` },
  { id:'rd', name:'Reddit',        icon:'reddit',      color:'FF4500', ph:'username',                  url:v => `https://reddit.com/user/${strip(strip(v,'u/'),'@')}` },
  { id:'me', name:'Medium',        icon:'medium',      color:'000000', ph:'@username',                 url:v => `https://medium.com/@${strip(v,'@')}` },
  { id:'ss', name:'Substack',      icon:'substack',    color:'FF6719', ph:'subdomain',                 url:v => /^https?:/.test(v) ? v : `https://${v}.substack.com` },
  { id:'gh', name:'GitHub',        icon:'github',      color:'181717', ph:'username',                  url:v => `https://github.com/${v}` },
  { id:'gl', name:'GitLab',        icon:'gitlab',      color:'FC6D26', ph:'username',                  url:v => `https://gitlab.com/${v}` },
  { id:'bh', name:'Behance',       icon:'behance',     color:'1769FF', ph:'username',                  url:v => `https://behance.net/${v}` },
  { id:'dr', name:'Dribbble',      icon:'dribbble',    color:'EA4C89', ph:'username',                  url:v => `https://dribbble.com/${v}` },
  { id:'vm', name:'Vimeo',         icon:'vimeo',       color:'1AB7EA', ph:'username',                  url:v => `https://vimeo.com/${v}` },
  { id:'lb', name:'Letterboxd',    icon:'letterboxd',  color:'00B020', ph:'username',                  url:v => `https://letterboxd.com/${v}` },
  { id:'gr', name:'Goodreads',     icon:'goodreads',   color:'372213', ph:'username',                  url:v => `https://goodreads.com/${v}` },
  { id:'st', name:'Strava',        icon:'strava',      color:'FC4C02', ph:'athlete id',                url:v => `https://strava.com/athletes/${v}` },
  { id:'bs', name:'Bluesky',       icon:'bluesky',     color:'0285FF', ph:'handle.bsky.social',        url:v => `https://bsky.app/profile/${strip(v,'@')}` },
  { id:'mt', name:'Mastodon',      icon:'mastodon',    color:'6364FF', ph:'@user@instance',            url:v => {
      if (/^https?:/.test(v)) return v;
      const m = v.match(/^@?([^@]+)@(.+)$/);
      return m ? `https://${m[2]}/@${m[1]}` : `https://mastodon.social/@${strip(v,'@')}`;
    }
  },
  { id:'pa', name:'Patreon',       icon:'patreon',     color:'FF424D', ph:'username',                  url:v => `https://patreon.com/${v}` },
  { id:'kf', name:'Ko-fi',         icon:'kofi',        color:'FF5E5B', ph:'username',                  url:v => `https://ko-fi.com/${v}` },
  { id:'bc', name:'Buy Me a Coffee',icon:'buymeacoffee',color:'FFDD00',ph:'username',                  url:v => `https://buymeacoffee.com/${v}` },
  { id:'pp', name:'PayPal.me',     icon:'paypal',      color:'00457C', ph:'username',                  url:v => `https://paypal.me/${v}` },
  { id:'cv', name:'Cash App',      icon:'cashapp',     color:'00C244', ph:'$cashtag',                  url:v => `https://cash.app/${v.startsWith('$') ? v : '$' + v}` },
  { id:'vn', name:'Venmo',         icon:'venmo',       color:'008CFF', ph:'@username',                 url:v => `https://venmo.com/${strip(v,'@')}` },
  { id:'em', name:'Email',         svg:SVG.mail,       color:'7851A9', ph:'you@example.com',           url:v => `mailto:${v}` },
  { id:'ph', name:'Phone',         svg:SVG.phone,      color:'34A853', ph:'+12025550123',              url:v => `tel:${v.replace(/[^+0-9]/g, '')}` },
  { id:'ws', name:'Website',       svg:SVG.globe,      color:'4285F4', ph:'https://example.com',       url:v => /^https?:/.test(v) ? v : `https://${v}` },
  { id:'lk', name:'Custom link',   svg:SVG.link,       color:'7851A9', ph:'https://...',               url:v => /^https?:/.test(v) ? v : `https://${v}` },
];

export function displayHandle(p: Platform, value: string): string {
  if (p.id === 'em' || p.id === 'ph' || p.id === 'ws' || p.id === 'lk') return value;
  if (/^https?:/.test(value)) return value;
  const handles = ['ig','tt','yt','tw','th','tg','bs','mt','me','rd','vn'];
  if (handles.includes(p.id)) return '@' + strip(value, '@');
  return value;
}

export const PLATFORM_KEYS = new Set(PLATFORMS.map(p => p.id));
