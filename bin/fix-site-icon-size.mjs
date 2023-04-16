/* eslint-disable no-console */
import path from 'path'
import fs from 'fs/promises'
import { execSync } from 'child_process'

const ICON_DIR = 'src/assets/site_icons'
const ICON_SIZE = 48

function execShell(command) {
  const output = execSync(command)
  return output.toString().trim()
}

function isIconFile(iconPath) {
  const output = execShell(`file -b --mime-type ${iconPath}`)
  return output.includes('image/vnd.microsoft.icon')
}

function getIconIndex(iconPath) {
  const output = execShell(`magick identify -format "%s:%w\\n" ${iconPath}`) 
  let lastIndex = 0
  for (const line of output.split('\n')) {
    const [index, width] = line.split(':')
    const size = parseInt(width)
    if (size >= ICON_SIZE) {
      return index
    }

    lastIndex = index
  }

  return lastIndex
}

function convertIcon(iconPath, outputPath) {
  const iconIndex = getIconIndex(iconPath)
  execShell(`magick convert -thumbnail "${ICON_SIZE}x${ICON_SIZE}>" ${iconPath}[${iconIndex}] ${outputPath}`)
}

async function fixSiteIcon(name) {
  const iconPath = path.join(ICON_DIR, name)
  if (!isIconFile(iconPath)) {
    return
  }

  const tmpPath = path.join(ICON_DIR, '_tmp.ico')
  await fs.copyFile(iconPath, tmpPath)
  try {
    convertIcon(tmpPath, iconPath)
  } finally {
    await fs.unlink(tmpPath)
  }

  console.log(`Converted ${name}`)
}

async function main() {
  let files = []
  if (process.argv.length > 2) {
    files = process.argv.slice(2)
  } else {
    files = await fs.readdir(ICON_DIR)
  }

  files = files.filter(name => {
    return name.endsWith('.png')
  })

  for (const name of files) {
    await fixSiteIcon(name)
  }
}

main()