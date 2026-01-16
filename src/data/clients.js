export const OS = {
  windows: 'windows',
  macos: 'macos',
  linux: 'linux',
  ios: 'ios',
  android: 'android',
};

export const osMeta = {
  [OS.windows]: { label: 'Windows', icon: 'windows' },
  [OS.macos]: { label: 'macOS', icon: 'apple' },
  [OS.linux]: { label: 'Linux', icon: 'linux' },
  [OS.ios]: { label: 'iOS', icon: 'mobile-screen-button' },
  [OS.android]: { label: 'Android', icon: 'android' },
};

export const CLIENT_CATEGORY = {
  clash: 'clash',
  v2ray: 'v2ray',
};

export const categoryMeta = {
  [CLIENT_CATEGORY.clash]: {
    label: 'Clash / Mihomo',
    description: '偏图形化代理客户端（Clash / Mihomo 生态）',
    icon: 'bolt',
  },
  [CLIENT_CATEGORY.v2ray]: {
    label: 'V2Ray / Xray',
    description: '偏协议生态客户端（V2Ray / Xray / sing-box 等）',
    icon: 'network-wired',
  },
};

const links = ({ url, label }) => ({ url, label });

export const clients = [
  {
    id: 'clash-verge-rev',
    name: 'Clash Verge Rev',
    category: CLIENT_CATEGORY.clash,
    description: '桌面三端，现代 GUI（Tauri），功能全面',
    platforms: [OS.windows, OS.macos, OS.linux],
    recommended: [OS.windows, OS.macos, OS.linux],
    downloads: [
      links({ label: 'GitHub', url: 'https://github.com/Clash-Verge-rev/clash-verge-rev/releases' }),
      links({ label: '中文网', url: 'https://clashcn.com/clash-verge-rev-official' }),
      links({ label: '镜像', url: 'https://getclashvergerev.org/download.html' }),
    ],
    tutorials: {
      [OS.windows]: 'https://8mkhkm.mikasadocs.com/tutorials/windows/clash-verge/',
      [OS.macos]: 'https://8mkhkm.mikasadocs.com/tutorials/macos/clash-verge/',
      [OS.linux]: 'https://8mkhkm.mikasadocs.com/tutorials/linux/clash-verge/',
    },
  },
  {
    id: 'clash-nyanpasu',
    name: 'Clash Nyanpasu',
    category: CLIENT_CATEGORY.clash,
    description: '桌面三端，基于 Tauri 的 Clash MD3 GUI',
    platforms: [OS.windows, OS.macos, OS.linux],
    downloads: [
      links({ label: 'GitHub', url: 'https://github.com/LibNyanpasu/clash-nyanpasu' }),
      links({ label: '官网', url: 'https://nyanpasu.elaina.moe/' }),
    ],
  },
  {
    id: 'clash-mac',
    name: 'Clash Mac',
    category: CLIENT_CATEGORY.clash,
    description: '为 macOS 打造的原生代理体验',
    platforms: [OS.macos],
    recommended: [OS.macos],
    downloads: [
      links({ label: 'GitHub', url: 'https://github.com/666OS/ClashMac' }),
      links({ label: '官网', url: 'https://clashmac.app/' }),
    ],
  },
  {
    id: 'mihomo-android',
    name: 'Mihomo（Android）',
    category: CLIENT_CATEGORY.clash,
    description: 'Clash Meta for Android（Mihomo）',
    platforms: [OS.android],
    recommended: [OS.android],
    downloads: [
      links({ label: 'GitHub', url: 'https://github.com/MetaCubeX/ClashMetaForAndroid' }),
    ],
    tutorials: {
      [OS.android]: 'https://8mkhkm.mikasadocs.com/tutorials/android/cmfa/',
    },
  },
  {
    id: 'mihomo-desktop',
    name: 'Mihomo（桌面）',
    category: CLIENT_CATEGORY.clash,
    description: '一个简易的 Mihomo 桌面客户端（Pandora Box）',
    platforms: [OS.windows, OS.macos, OS.linux],
    downloads: [
      links({ label: 'GitHub', url: 'https://github.com/snakem982/Pandora-Box' }),
      links({ label: 'Mihomo 官网', url: 'https://wiki.metacubex.one/' }),
      links({ label: 'Mihomo 下载', url: 'https://wiki.metacubex.one/startup/' }),
    ],
  },
  {
    id: 'v2rayn',
    name: 'v2rayN',
    category: CLIENT_CATEGORY.v2ray,
    description: '桌面三端 GUI，支持 Xray、sing-box 等核心',
    platforms: [OS.windows, OS.macos, OS.linux],
    recommended: [OS.windows],
    downloads: [
      links({ label: 'GitHub', url: 'https://github.com/2dust/v2rayN/releases' }),
    ],
    tutorials: {
      [OS.windows]: 'https://8mkhkm.mikasadocs.com/tutorials/windows/v2rayN7/',
      [OS.linux]: 'https://8mkhkm.mikasadocs.com/tutorials/linux/v2rayN7/',
      [OS.macos]: 'https://8mkhkm.mikasadocs.com/tutorials/macos/v2rayN7/',
    },
  },
  {
    id: 'v2rayng',
    name: 'v2rayNG',
    category: CLIENT_CATEGORY.v2ray,
    description: 'Android 客户端，支持 Xray 核心与 v2fly 核心',
    platforms: [OS.android],
    recommended: [OS.android],
    downloads: [
      links({ label: 'GitHub', url: 'https://github.com/2dust/v2rayNG' }),
    ],
    tutorials: {
      [OS.android]: 'https://8mkhkm.mikasadocs.com/tutorials/android/v2rayNG/',
    },
  },
  {
    id: 'v2raya',
    name: 'v2rayA',
    category: CLIENT_CATEGORY.v2ray,
    description: 'Web GUI（Linux），支持 VMess/VLESS/SS/SSR/Trojan/TUIC 等',
    platforms: [OS.linux],
    recommended: [OS.linux],
    downloads: [
      links({ label: 'GitHub', url: 'https://github.com/v2rayA/v2rayA' }),
    ],
    tutorials: {
      [OS.linux]: 'https://v2raya.org',
    },
  },
  {
    id: 'shadowrocket',
    name: 'Shadowrocket',
    category: CLIENT_CATEGORY.v2ray,
    description: 'iOS 客户端（App Store）',
    platforms: [OS.ios],
    recommended: [OS.ios],
    downloads: [
      links({ label: 'App Store', url: 'https://apps.apple.com/us/app/shadowrocket/id932747118' }),
    ],
    tutorials: {
      [OS.ios]: 'https://8mkhkm.mikasadocs.com/tutorials/ios/shadowrocket/',
    },
  },
  {
    id: 'stash',
    name: 'Stash',
    category: CLIENT_CATEGORY.v2ray,
    description: 'iOS 客户端（规则增强）',
    platforms: [OS.ios],
    downloads: [
      links({ label: 'App Store', url: 'https://apps.apple.com/us/app/stash-rule-based-proxy/id1596063349' }),
    ],
    tutorials: {
      [OS.ios]: 'https://stash.wiki',
    },
  },
];

export const recommendedByOs = {
  [OS.windows]: ['clash-verge-rev', 'v2rayn'],
  [OS.macos]: ['clash-mac', 'clash-verge-rev'],
  [OS.linux]: ['clash-verge-rev', 'v2raya'],
  [OS.ios]: ['shadowrocket', 'stash'],
  [OS.android]: ['mihomo-android', 'v2rayng'],
};

export function getClientById(id) {
  return clients.find((client) => client.id === id) ?? null;
}

export function getRecommendedClientsForOs(os) {
  const ids = recommendedByOs[os] ?? [];
  return ids.map(getClientById).filter(Boolean);
}

export function getClientsByCategory(category) {
  return clients.filter((client) => client.category === category);
}

