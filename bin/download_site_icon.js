/**
 * 生成站点图标下载命令
 * 1. 需要下载的图标的网站手动从 src/sites.ts 中复制出来
 * 2. 手动处理要下载的 icon
 * 3. 复制到终端下载
 * 4. commit, pr
 */
const fs = require('fs')
const path = require('path')

function getSiteIcon(s) { return s }
const opts = {
    // 是否下载已经存在的站点图标, 默认 false
    downloadExist: false,
}
const node = {
    'pt.btschool.club': {
        name: 'btschool',
        icon: getSiteIcon('btschool'),
    },
    'www.hddolby.com': {
        name: 'hddolby',
        icon: getSiteIcon('hddolby'),
    },
    
    'tracker.hd.ai': {
        name: 'haidai',
        icon: getSiteIcon('haidai'),
    },
};

for (let i in node) {
    let output = path.resolve(__dirname, 'site_icons', `${node[i].icon}.png`)
    if (!opts.downloadExist && fs.existsSync(output)) {
        console.log(`#ignore exist: ${output}`);
    } else {
        console.log(`wget http://${i}/favicon.ico -O ${output}`);
    }
}
