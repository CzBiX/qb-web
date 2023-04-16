function getSiteIcon(name: string): string {
  return require(`@/assets/site_icons/${name}.png`);
}

export interface SiteInfo {
  name: string;
  icon?: string;
}

const sites: {[key: string]: SiteInfo} = {
  'm-team.cc': {
    name: 'M-Team',
    icon: getSiteIcon('m-team'),
  },
  'keepfrds.com': {
    name: 'PT@KEEPFRDS',
    icon: getSiteIcon('keepfrds'),
  },
  'springsunday.net': {
    name: 'SSD',
    icon: getSiteIcon('springsunday'),
  },
  'hdchina.org': {
    name: 'HDChina',
    icon: getSiteIcon('hdchina'),
  },
  'chdbits.co': {
    name: 'CHDBits',
    icon: getSiteIcon('chdbits'),
  },
  'hdhome.org': {
    name: 'HDHome',
    icon: getSiteIcon('nexusphp'),
  },
  'dmhy.org': {
    name: 'U2',
    icon: getSiteIcon('u2'),
  },
  'dmhy.best': {
    name: 'U2',
    icon: getSiteIcon('u2'),
  },
  'totheglory.im': {
    name: 'TTG',
    icon: getSiteIcon('totheglory'),
  },
  'oshen.win': {
    name: 'OshenPT',
    icon: getSiteIcon('nexusphp'),
  },
  'soulvoice.club': {
    name: '铃音Club',
    icon: getSiteIcon('soulvoice'),
  },
  'ourbits.club': {
    name: 'OurBits',
    icon: getSiteIcon('ourbits'),
  },
  'btschool.club': {
    name: 'BTSCHOOL',
  },
  'ptsbao.club': {
    name: '烧包',
    icon: getSiteIcon('ptsbao'),
  },
  'pterclub.com': {
    name: 'PTer',
    icon: getSiteIcon('pterclub'),
  },
  'hdtime.org': {
    name: 'HDTime',
    icon: getSiteIcon('hdtime'),
  },
  'hddolby.com': {
    name: 'HD Dolby',
  },
  'lemonhd.org': {
    name: 'LemonHD',
    icon: getSiteIcon('lemonhd'),
  },
  'hares.top': {
    name: 'HaresClub',
    icon: getSiteIcon('hares'),
  },
  'pthome.net': {
    name: 'PTHOME',
    icon: getSiteIcon('pthome'),
  },
  'hdsky.me': {
    name: 'HDSky',
    icon: getSiteIcon('hdsky'),
  },
  'hdfans.org': {
    name: 'HDFans',
    icon: getSiteIcon('nexusphp'),
  },
  'hdatmos.club': {
    name: 'HDAtmos',
    icon: getSiteIcon('nexusphp'),
  },
  'hdzone.me': {
    name: 'HDZone',
    icon: getSiteIcon('nexusphp'),
  },
  'open.cd': {
    name: 'OpenCD',
    icon: getSiteIcon('opencd'),
  },
  '1ptba.com': {
    name: '1PTBar',
    icon: getSiteIcon('nexusphp'),
  },
  'pttime.org': {
    name: 'PTTime',
    icon: getSiteIcon('pttime'),
  },
  'beitai.pt': {
    name: '备胎',
    icon: getSiteIcon('nexusphp'),
  },
  'kamept.com': {
    name: 'kamept',
    icon: getSiteIcon('kamept'),
  },
  'nicept.net': {
    name: 'NicePT',
    icon: getSiteIcon('nexusphp'),
  },
  '2xfree.org': {
    name: '2xfree',
    icon: getSiteIcon('2xfree'),
  },
};

export default sites;
