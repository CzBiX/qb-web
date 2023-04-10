function getSiteIcon(name: string): string {
  try {
    return require(`@/assets/site_icons/${name}.png`);
  } catch (e) {
    return require(`@/assets/logo.png`);
  }
}

export interface SiteInfo {
  name: string;
  icon: string;
}

const sites: {[key: string]: SiteInfo} = {
  'tracker.m-team.cc': {
    name: 'M-Team',
    icon: getSiteIcon('m-team'),
  },
  'tracker.keepfrds.com': {
    name: 'FRDS',
    icon: getSiteIcon('keepfrds'),
  },
  'springsunday.net': {
    name: 'SSD',
    icon: getSiteIcon('springsunday'),
  },
  'on.springsunday.net': {
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
    icon: getSiteIcon('hdhome'),
  },
  'u2.dmhy.org': {
    name: 'U2',
    icon: getSiteIcon('u2'),
  },
  'daydream.dmhy.best': {
    name: 'U2',
    icon: getSiteIcon('u2'),
  },
  'tracker.totheglory.im': {
    name: 'TTG',
    icon: getSiteIcon('totheglory'),
  },
  'www.oshen.win': {
    name: 'oshen',
    icon: getSiteIcon('oshen'),
  },
  'pt.soulvoice.club': {
    name: 'soulvoice',
    icon: getSiteIcon('soulvoice'),
  },
  'ourbits.club': {
    name: 'ourbits',
    icon: getSiteIcon('ourbits'),
  },
  'pt.btschool.club': {
    name: 'btschool',
    icon: getSiteIcon('btschool'),
  },
  'ptsbao.club': {
    name: 'ptsbao',
    icon: getSiteIcon('ptsbao'),
  },
  'tp.msg.vg': {
    name: 'msg',
    icon: getSiteIcon('msg'),
  },
  'tracker.pterclub.com': {
    name: 'pterclub',
    icon: getSiteIcon('pterclub'),
  },
  'tracker.hdtime.org': {
    name: 'hdtime',
    icon: getSiteIcon('hdtime'),
  },
  'www.hddolby.com': {
    name: 'hddolby',
    icon: getSiteIcon('hddolby'),
  },
  'announce.leaguehd.com': {
    name: 'leaguehd',
    icon: getSiteIcon('leaguehd'),
  },
  'club.hares.top': {
    name: 'hares',
    icon: getSiteIcon('hares'),
  },
  'tracker.hd.ai': {
    name: 'haidai',
    icon: getSiteIcon('haidai'),
  },
  'www.pthome.net': {
    name: 'pthome',
    icon: getSiteIcon('pthome'),
  },
  't.pthome.net': {
    name: 'pthome',
    icon: getSiteIcon('pthome'),
  },
  'tracker.hdsky.me': {
    name: 'hdsky',
    icon: getSiteIcon('hdsky'),
  },
  'hdfans.org': {
    name: 'hdfans',
    icon: getSiteIcon('hdfans'),
  },
  'hdatmos.club': {
    name: 'hdatmos',
    icon: getSiteIcon('hdatmos'),
  },
  'hdzone.me': {
    name: 'hdzone',
    icon: getSiteIcon('hdzone'),
  },
  'tracker.open.cd': {
    name: 'opencd',
    icon: getSiteIcon('opencd'),
  },
  '1ptba.com': {
    name: '1ptba',
    icon: getSiteIcon('1ptba'),
  },
  'announce.haidan.video': {
    name: 'haidan',
    icon: getSiteIcon('haidan'),
  },
  'www.pttime.org': {
    name: 'pttime',
    icon: getSiteIcon('pttime'),
  },
  'www.beitai.pt': {
    name: 'beitai',
    icon: getSiteIcon('beitai'),
  },
};

export default sites;
