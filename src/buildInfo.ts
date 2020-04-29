let buildInfo = process.env.COMMIT_ID

if (!buildInfo) {
  buildInfo = 'dev'
}

// eslint-disable-next-line no-console
console.log(`%c qb-web Build %c ${buildInfo} `, 
  'background-color: #555; color: #fff; border-radius: 3px 0 0 3px;',
  'background-color: #1976d2; color: #fff; border-radius: 0 3px 3px 0;',
)