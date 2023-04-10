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

// 遵循 PTPP 站点命名, 若果
const sites: {[key: string]: SiteInfo} = {
  'tracker.m-team.cc': {
    name: 'M-Team',
    icon: getSiteIcon('m-team'),
  },
  'tracker.keepfrds.com': {
    name: 'PT@KEEPFRDS',
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
    name: '铃音Club',
    icon: getSiteIcon('soulvoice'),
  },
  'ourbits.club': {
    name: 'OurBits',
    icon: getSiteIcon('ourbits'),
  },
  'pt.btschool.club': {
    name: 'btschool',
    icon: getSiteIcon('btschool'),
  },
  'ptsbao.club': {
    name: '烧包',
    icon: getSiteIcon('ptsbao'),
  },
  'tp.msg.vg': {
    name: 'PTMSG',
    icon: getSiteIcon('msg'),
  },
  'tracker.pterclub.com': {
    name: 'PTer',
    icon: getSiteIcon('pterclub'),
  },
  'tracker.hdtime.org': {
    name: 'HDTime',
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
    name: 'HaresClub',
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
    name: 'PTHome',
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
    name: 'OpenCD',
    icon: getSiteIcon('opencd'),
  },
  '1ptba.com': {
    name: '1PTBar',
    icon: getSiteIcon('1ptba'),
  },
  'announce.haidan.video': {
    name: 'HaiDan',
    icon: getSiteIcon('haidan'),
  },
  'www.pttime.org': {
    name: 'pttime',
    icon: getSiteIcon('pttime'),
  },
  'www.beitai.pt': {
    name: '备胎',
    icon: getSiteIcon('beitai'),
  },
  'kamept.com': {
    name: 'kamept',
    icon: getSiteIcon('kamept'),
  },
  'www.nicept.net': {
    name: 'NicePT',
    icon: getSiteIcon('nicept'),
  },
  'pt.2xfree.org': {
    name: '2xfree',
    icon: getSiteIcon('2xfree'),
  },
};

export default sites;
