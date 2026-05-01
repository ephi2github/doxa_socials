// Single source of truth for supported platforms.
// Same shape for the editor (input list) and the viewer (link rendering).

const clean = (v: string) => v.trim();
const strip = (v: string, p: string) => {
  const next = clean(v);
  return next.startsWith(p) ? next.slice(p.length) : next;
};
const isHttpUrl = (v: string) => /^https?:\/\//i.test(clean(v));
const asUrl = (v: string, fallback: (value: string) => string) => {
  const next = clean(v);
  return isHttpUrl(next) ? next : fallback(next);
};
const atHandle = (v: string) => strip(clean(v), "@");
const slugifySpaces = (v: string) => clean(v).replace(/\s+/g, "-");

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
  keywords?: string[];
  url: (v: string) => string;
};

export const PLATFORMS: Platform[] = [
  // Major social networks
  { id:'ig', name:'Instagram',       icon:'instagram',      color:'E4405F', ph:'username',                     url:v => `https://instagram.com/${atHandle(v)}` },
  { id:'tt', name:'TikTok',          icon:'tiktok',         color:'000000', ph:'username',                     url:v => `https://tiktok.com/@${atHandle(v)}` },
  { id:'yt', name:'YouTube',         icon:'youtube',        color:'FF0000', ph:'@channel',                     url:v => `https://youtube.com/@${atHandle(v)}` },
  { id:'tw', name:'X / Twitter',     icon:'x',              color:'000000', ph:'username',                     keywords:['twitter', 'tweet'], url:v => `https://x.com/${atHandle(v)}` },
  { id:'fb', name:'Facebook',        icon:'facebook',       color:'1877F2', ph:'username or page',             url:v => `https://facebook.com/${clean(v)}` },
  { id:'li', name:'LinkedIn',        icon:'linkedin',       color:'0A66C2', ph:'in/username',                  keywords:['company', 'resume'], url:v => `https://linkedin.com/${/^(in|company)\//.test(clean(v)) ? clean(v) : 'in/' + atHandle(v)}` },
  { id:'th', name:'Threads',         icon:'threads',        color:'000000', ph:'username',                     url:v => `https://threads.net/@${atHandle(v)}` },
  { id:'sn', name:'Snapchat',        icon:'snapchat',       color:'FFFC00', ph:'username',                     url:v => `https://snapchat.com/add/${clean(v)}` },
  { id:'pi', name:'Pinterest',       icon:'pinterest',      color:'BD081C', ph:'username',                     url:v => `https://pinterest.com/${clean(v)}` },
  { id:'tu', name:'Tumblr',          icon:'tumblr',         color:'36465D', ph:'blog name or URL',            keywords:['blog'], url:v => asUrl(v, value => `https://${value}.tumblr.com`) },
  { id:'bs', name:'Bluesky',         icon:'bluesky',        color:'0285FF', ph:'handle.bsky.social',           keywords:['bsky'], url:v => `https://bsky.app/profile/${atHandle(v)}` },
  { id:'fc', name:'Farcaster',       icon:'farcaster',      color:'855DCD', ph:'@username',                    keywords:['warpcast'], url:v => `https://warpcast.com/${atHandle(v)}` },
  { id:'mt', name:'Mastodon',        icon:'mastodon',       color:'6364FF', ph:'@user@instance',               keywords:['fediverse'], url:v => {
      if (isHttpUrl(v)) return clean(v);
      const m = clean(v).match(/^@?([^@]+)@(.+)$/);
      return m ? `https://${m[2]}/@${m[1]}` : `https://mastodon.social/@${atHandle(v)}`;
    }
  },
  { id:'ch', name:'Clubhouse',       icon:'clubhouse',      color:'FCD34D', ph:'@username',                    keywords:['audio'], url:v => `https://www.clubhouse.com/@${atHandle(v)}` },
  { id:'vk', name:'VK',              icon:'vk',             color:'0077FF', ph:'username or id',               url:v => `https://vk.com/${clean(v)}` },
  { id:'ok', name:'Odnoklassniki',   icon:'odnoklassniki',  color:'EE8208', ph:'username or group',            keywords:['ok.ru'], url:v => `https://ok.ru/${clean(v)}` },
  { id:'wb', name:'Weibo',           icon:'sinaweibo',      color:'E6162D', ph:'username or profile id',       keywords:['sina weibo'], url:v => `https://weibo.com/${clean(v)}` },
  { id:'rd', name:'Reddit',          icon:'reddit',         color:'FF4500', ph:'username',                     url:v => `https://reddit.com/user/${strip(atHandle(v), 'u/')}` },
  { id:'qr', name:'Quora',           icon:'quora',          color:'B92B27', ph:'profile slug or full URL',     url:v => asUrl(v, value => `https://www.quora.com/profile/${slugifySpaces(value)}`) },
  { id:'me', name:'Medium',          icon:'medium',         color:'000000', ph:'@username',                    url:v => `https://medium.com/@${atHandle(v)}` },
  { id:'ss', name:'Substack',        icon:'substack',       color:'FF6719', ph:'subdomain',                    keywords:['newsletter'], url:v => asUrl(v, value => `https://${value}.substack.com`) },
  { id:'mb', name:'Micro.blog',      icon:'microdotblog',   color:'FF8800', ph:'@username',                    keywords:['microblog'], url:v => `https://micro.blog/${atHandle(v)}` },

  // Messaging and community
  { id:'wa', name:'WhatsApp',        icon:'whatsapp',       color:'25D366', ph:'+12025550123',                 keywords:['chat', 'message'], url:v => `https://wa.me/${clean(v).replace(/[^0-9]/g, '')}` },
  { id:'tg', name:'Telegram',        icon:'telegram',       color:'26A5E4', ph:'username',                     url:v => `https://t.me/${atHandle(v)}` },
  { id:'sg', name:'Signal',          icon:'signal',         color:'3A76F0', ph:'signal.me link or code',       url:v => asUrl(v, value => `https://signal.me/#p/${value}`) },
  { id:'dc', name:'Discord',         icon:'discord',        color:'5865F2', ph:'invite code or link',          keywords:['server'], url:v => asUrl(v, value => `https://discord.gg/${value}`) },
  { id:'ms', name:'Messenger',       icon:'messenger',      color:'00B2FF', ph:'username or page',             keywords:['facebook messenger'], url:v => `https://m.me/${clean(v)}` },
  { id:'ln', name:'LINE',            icon:'line',           color:'06C755', ph:'@id or share URL',             keywords:['line app'], url:v => asUrl(v, value => `https://line.me/ti/p/~${atHandle(value)}`) },
  { id:'mx', name:'Matrix',          icon:'matrix',         color:'000000', ph:'@user:server.tld',             keywords:['matrix.to'], url:v => asUrl(v, value => `https://matrix.to/#/${value.startsWith('@') ? value : '@' + value}`) },

  // Video, streaming, and music
  { id:'tv', name:'Twitch',          icon:'twitch',         color:'9146FF', ph:'username',                     url:v => `https://twitch.tv/${clean(v)}` },
  { id:'kk', name:'Kick',            icon:'kick',           color:'53FC18', ph:'username',                     url:v => `https://kick.com/${clean(v)}` },
  { id:'vm', name:'Vimeo',           icon:'vimeo',          color:'1AB7EA', ph:'username',                     url:v => `https://vimeo.com/${clean(v)}` },
  { id:'sp', name:'Spotify',         icon:'spotify',        color:'1DB954', ph:'profile URL or id',            url:v => asUrl(v, value => `https://open.spotify.com/user/${value}`) },
  { id:'am', name:'Apple Music',     icon:'applemusic',     color:'FA243C', ph:'profile URL',                  url:v => asUrl(v, value => `https://music.apple.com/profile/${value}`) },
  { id:'sc', name:'SoundCloud',      icon:'soundcloud',     color:'FF7700', ph:'username',                     url:v => `https://soundcloud.com/${clean(v)}` },
  { id:'bd', name:'Bandcamp',        icon:'bandcamp',       color:'408294', ph:'artist subdomain or full URL', keywords:['music'], url:v => asUrl(v, value => `https://${value}.bandcamp.com`) },
  { id:'lf', name:'Last.fm',         icon:'lastdotfm',      color:'D51007', ph:'username',                     url:v => `https://www.last.fm/user/${clean(v)}` },
  { id:'dz', name:'Deezer',          icon:'deezer',         color:'A238FF', ph:'profile id or URL',            url:v => asUrl(v, value => `https://www.deezer.com/profile/${value}`) },
  { id:'mc', name:'Mixcloud',        icon:'mixcloud',       color:'5000FF', ph:'username',                     url:v => `https://www.mixcloud.com/${clean(v)}` },

  // Creator, developer, and portfolio platforms
  { id:'gh', name:'GitHub',          icon:'github',         color:'181717', ph:'username',                     keywords:['code'], url:v => `https://github.com/${clean(v)}` },
  { id:'gl', name:'GitLab',          icon:'gitlab',         color:'FC6D26', ph:'username',                     keywords:['code'], url:v => `https://gitlab.com/${clean(v)}` },
  { id:'pr', name:'Product Hunt',    icon:'producthunt',    color:'DA552F', ph:'@username',                    keywords:['startup'], url:v => `https://www.producthunt.com/@${atHandle(v)}` },
  { id:'dv', name:'Dev.to',          icon:'devdotto',       color:'0A0A0A', ph:'@username',                    keywords:['developer', 'blog'], url:v => `https://dev.to/${atHandle(v)}` },
  { id:'hn', name:'Hashnode',        icon:'hashnode',       color:'2962FF', ph:'@username',                    keywords:['developer', 'blog'], url:v => `https://hashnode.com/@${atHandle(v)}` },
  { id:'so', name:'Stack Overflow',  icon:'stackoverflow',  color:'F58025', ph:'user id or full URL',          keywords:['developer', 'programming'], url:v => asUrl(v, value => `https://stackoverflow.com/users/${value}`) },
  { id:'sx', name:'Stack Exchange',  icon:'stackexchange',  color:'1E5397', ph:'user id or full URL',          keywords:['developer', 'programming'], url:v => asUrl(v, value => `https://stackexchange.com/users/${value}`) },
  { id:'cp', name:'CodePen',         icon:'codepen',        color:'000000', ph:'username',                     keywords:['frontend'], url:v => `https://codepen.io/${clean(v)}` },
  { id:'rp', name:'Replit',          icon:'replit',         color:'F26207', ph:'@username',                    keywords:['developer'], url:v => `https://replit.com/@${atHandle(v)}` },
  { id:'lc', name:'LeetCode',        icon:'leetcode',       color:'FFA116', ph:'username',                     keywords:['coding interview'], url:v => `https://leetcode.com/u/${clean(v)}` },
  { id:'kg', name:'Kaggle',          icon:'kaggle',         color:'20BEFF', ph:'username',                     keywords:['data science'], url:v => `https://www.kaggle.com/${clean(v)}` },
  { id:'hf', name:'Hugging Face',    icon:'huggingface',    color:'FFD21E', ph:'username or org',              keywords:['ai', 'machine learning'], url:v => `https://huggingface.co/${clean(v)}` },
  { id:'pl', name:'Peerlist',        icon:'peerlist',       color:'00AA45', ph:'username',                     keywords:['professional'], url:v => `https://peerlist.io/${clean(v)}` },
  { id:'xg', name:'Xing',            icon:'xing',           color:'006567', ph:'profile slug',                 keywords:['professional'], url:v => `https://www.xing.com/profile/${clean(v)}` },
  { id:'bh', name:'Behance',         icon:'behance',        color:'1769FF', ph:'username',                     keywords:['design'], url:v => `https://behance.net/${clean(v)}` },
  { id:'dr', name:'Dribbble',        icon:'dribbble',       color:'EA4C89', ph:'username',                     keywords:['design'], url:v => `https://dribbble.com/${clean(v)}` },
  { id:'as', name:'ArtStation',      icon:'artstation',     color:'13AFF0', ph:'username',                     keywords:['art', 'portfolio'], url:v => `https://www.artstation.com/${clean(v)}` },
  { id:'da', name:'DeviantArt',      icon:'deviantart',     color:'05CC47', ph:'username',                     keywords:['art', 'portfolio'], url:v => `https://www.deviantart.com/${clean(v)}` },
  { id:'px', name:'Pixiv',           icon:'pixiv',          color:'0096FA', ph:'user id or full URL',          keywords:['art', 'illustration'], url:v => asUrl(v, value => `https://www.pixiv.net/en/users/${value}`) },
  { id:'fp', name:'500px',           icon:'500px',          color:'222222', ph:'username',                     keywords:['photography'], url:v => `https://500px.com/p/${clean(v)}` },
  { id:'fl', name:'Flickr',          icon:'flickr',         color:'FF0084', ph:'username, NSID, or URL',       keywords:['photography'], url:v => asUrl(v, value => `https://www.flickr.com/people/${value}`) },
  { id:'un', name:'Unsplash',        icon:'unsplash',       color:'000000', ph:'@username',                    keywords:['photography'], url:v => `https://unsplash.com/@${atHandle(v)}` },
  { id:'vs', name:'VSCO',            icon:'vsco',           color:'000000', ph:'username',                     keywords:['photography'], url:v => `https://vsco.co/${clean(v)}` },
  { id:'lb', name:'Letterboxd',      icon:'letterboxd',     color:'00B020', ph:'username',                     keywords:['film'], url:v => `https://letterboxd.com/${clean(v)}` },
  { id:'gr', name:'Goodreads',       icon:'goodreads',      color:'372213', ph:'username',                     keywords:['books'], url:v => `https://goodreads.com/${clean(v)}` },

  // Research and education
  { id:'oc', name:'ORCID',           icon:'orcid',          color:'A6CE39', ph:'0000-0002-1825-0097',          keywords:['researcher'], url:v => `https://orcid.org/${clean(v)}` },
  { id:'rg', name:'ResearchGate',    icon:'researchgate',   color:'00CCBB', ph:'profile slug or full URL',     keywords:['researcher'], url:v => asUrl(v, value => `https://www.researchgate.net/profile/${slugifySpaces(value)}`) },
  { id:'gs', name:'Google Scholar',  icon:'googlescholar',  color:'4285F4', ph:'scholar user id',              keywords:['researcher', 'citations'], url:v => `https://scholar.google.com/citations?user=${clean(v)}` },

  // Gaming and hobby platforms
  { id:'sm', name:'Steam',           icon:'steam',          color:'000000', ph:'custom id or full URL',        keywords:['gaming'], url:v => asUrl(v, value => `https://steamcommunity.com/id/${value}`) },
  { id:'cc', name:'Chess.com',       icon:'chessdotcom',    color:'81B64C', ph:'username',                     keywords:['chess'], url:v => `https://www.chess.com/member/${clean(v)}` },
  { id:'lh', name:'Lichess',         icon:'lichess',        color:'B58863', ph:'username',                     keywords:['chess'], url:v => `https://lichess.org/@/${clean(v)}` },
  { id:'ou', name:'osu!',            icon:'osu',            color:'FF66AA', ph:'user id or full URL',          keywords:['gaming', 'rhythm'], url:v => asUrl(v, value => `https://osu.ppy.sh/users/${value}`) },
  { id:'ps', name:'PlayStation',     icon:'playstation',    color:'003791', ph:'PSN ID',                       keywords:['gaming', 'psn'], url:v => `https://my.playstation.com/profile/${clean(v)}` },
  { id:'rb', name:'Roblox',          icon:'roblox',         color:'000000', ph:'user id or full URL',          keywords:['gaming'], url:v => asUrl(v, value => `https://www.roblox.com/users/${value}/profile`) },
  { id:'st', name:'Strava',          icon:'strava',         color:'FC4C02', ph:'athlete id',                   keywords:['fitness'], url:v => `https://strava.com/athletes/${clean(v)}` },

  // Monetization and link hubs
  { id:'pa', name:'Patreon',         icon:'patreon',        color:'FF424D', ph:'username',                     keywords:['membership'], url:v => `https://patreon.com/${clean(v)}` },
  { id:'kf', name:'Ko-fi',           icon:'kofi',           color:'FF5E5B', ph:'username',                     keywords:['donations'], url:v => `https://ko-fi.com/${clean(v)}` },
  { id:'bc', name:'Buy Me a Coffee', icon:'buymeacoffee',   color:'FFDD00', ph:'username',                     keywords:['donations'], url:v => `https://buymeacoffee.com/${clean(v)}` },
  { id:'pp', name:'PayPal.me',       icon:'paypal',         color:'00457C', ph:'username',                     keywords:['payments'], url:v => `https://paypal.me/${clean(v)}` },
  { id:'cv', name:'Cash App',        icon:'cashapp',        color:'00C244', ph:'$cashtag',                     keywords:['payments'], url:v => `https://cash.app/${clean(v).startsWith('$') ? clean(v) : '$' + clean(v)}` },
  { id:'vn', name:'Venmo',           icon:'venmo',          color:'008CFF', ph:'@username',                    keywords:['payments'], url:v => `https://venmo.com/${atHandle(v)}` },
  { id:'lt', name:'Linktree',        icon:'linktree',       color:'43E55E', ph:'username',                     keywords:['bio link'], url:v => `https://linktr.ee/${clean(v)}` },
  { id:'gd', name:'Gumroad',         icon:'gumroad',        color:'FF90E8', ph:'creator name or full URL',     keywords:['digital products'], url:v => asUrl(v, value => `https://${value}.gumroad.com`) },
  { id:'et', name:'Etsy',            icon:'etsy',           color:'F1641E', ph:'shop name',                    keywords:['shop'], url:v => `https://www.etsy.com/shop/${clean(v)}` },
  { id:'fv', name:'Fiverr',          icon:'fiverr',         color:'1DBF73', ph:'username',                     keywords:['freelance'], url:v => `https://www.fiverr.com/${clean(v)}` },
  { id:'le', name:'Lens',            icon:'lens',           color:'54D62C', ph:'@handle',                      keywords:['web3'], url:v => `https://hey.xyz/u/${atHandle(v)}` },
  { id:'os', name:'OpenSea',         icon:'opensea',        color:'2081E2', ph:'username or profile slug',     keywords:['nft', 'web3'], url:v => `https://opensea.io/${clean(v)}` },

  // Personal sites and general profile pages
  { id:'cd', name:'Carrd',           icon:'carrd',          color:'596CAF', ph:'site name or URL',             keywords:['landing page'], url:v => asUrl(v, value => `https://${value}.carrd.co`) },
  { id:'ab', name:'About.me',        icon:'aboutdotme',     color:'00A98F', ph:'username',                     keywords:['bio'], url:v => `https://about.me/${clean(v)}` },
  { id:'wp', name:'WordPress',       icon:'wordpress',      color:'21759B', ph:'site slug or URL',             keywords:['blog'], url:v => asUrl(v, value => `https://${value}.wordpress.com`) },
  { id:'bg', name:'Blogger',         icon:'blogger',        color:'FF5722', ph:'site slug or URL',             keywords:['blog'], url:v => asUrl(v, value => `https://${value}.blogspot.com`) },
  { id:'go', name:'Ghost',           icon:'ghost',          color:'15171A', ph:'site slug or URL',             keywords:['blog', 'newsletter'], url:v => asUrl(v, value => `https://${value}.ghost.io`) },
  { id:'em', name:'Email',           svg:SVG.mail,          color:'7851A9', ph:'you@example.com',              keywords:['mail', 'contact'], url:v => `mailto:${clean(v)}` },
  { id:'ph', name:'Phone',           svg:SVG.phone,         color:'34A853', ph:'+12025550123',                 keywords:['call', 'telephone'], url:v => `tel:${clean(v).replace(/[^+0-9]/g, '')}` },
  { id:'ws', name:'Website',         svg:SVG.globe,         color:'4285F4', ph:'https://example.com',          keywords:['site', 'homepage'], url:v => asUrl(v, value => `https://${value}`) },
  { id:'lk', name:'Custom link',     svg:SVG.link,          color:'7851A9', ph:'https://...',                  keywords:['link', 'url'], url:v => asUrl(v, value => `https://${value}`) },
];

export function displayHandle(p: Platform, value: string): string {
  if (p.id === 'em' || p.id === 'ph' || p.id === 'ws' || p.id === 'lk') return value;
  if (/^https?:/.test(value)) return value;
  const handles = ['ig','tt','yt','tw','th','tg','bs','fc','mt','ch','rd','qr','me','mb','dv','hn','rp','un','vn','le'];
  if (handles.includes(p.id)) return '@' + strip(value, '@');
  return value;
}

export function matchesPlatformSearch(platform: Platform, query: string): boolean {
  const needle = clean(query).toLowerCase();
  if (!needle) return true;
  return [platform.name, platform.ph, ...(platform.keywords ?? [])].some((value) =>
    value.toLowerCase().includes(needle)
  );
}

const PLATFORM_MAP = new Map(PLATFORMS.map((platform) => [platform.id, platform]));

export const PLATFORM_KEYS = new Set(PLATFORMS.map(p => p.id));

export function getPlatformById(id: string): Platform | undefined {
  return PLATFORM_MAP.get(id);
}
