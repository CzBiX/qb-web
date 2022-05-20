import { RootPath, SavePlace, Torrent } from '@/types';
import { startsWith, sortBy, reduce, split, has, forEach, sumBy, trimEnd, uniqBy } from 'lodash';

const PATH_SEP = '/'

export function walkdir(dir: SavePlace, fn: (dir: SavePlace) => void): void {
  fn(dir);
  forEach(dir.subdirs, (dir) => walkdir(dir, fn));
}

function mergeNode(links: Record<string, SavePlace>, prefix: string[], intree: SavePlace, newNode: SavePlace): SavePlace {
  if (startsWith(intree.key, newNode.key)) {
    intree.dirname.splice(0, newNode.dirname.length);
    newNode.subdirs.push(intree);
    return newNode;
  }
  if (startsWith(newNode.key, intree.key)) {
    newNode.dirname.splice(0, intree.dirname.length);
    intree.subdirs.push(newNode);
    intree.subdirs = sortBy(intree.subdirs, x => x.key);
    return intree;
  }
  const parentDirname: string[] = prefix;
  const minLength = Math.min(intree.dirname.length, newNode.dirname.length);
  let index = 0;
  for (; index < minLength; ++index) {
    if (intree.dirname[index] !== newNode.dirname[index]) {
      index -= 1;
      break;
    }
    parentDirname.push(intree.dirname[index]);
  }
  const key = parentDirname.join(PATH_SEP);
  intree.dirname.splice(0, parentDirname.length);
  newNode.dirname.splice(0, parentDirname.length);
  const sharedParent: SavePlace = {
    key,
    size: 0,
    realSize: 0,
    dirname: parentDirname as [string, ...string[]],
    torrents: [],
    subdirs: sortBy([newNode, intree], 'key'),
  };
  links[key] = sharedParent;
  return sharedParent;
}

function countSameSegment(segs0: string[], segs1: string[]): number {
  let n = 0;
  while(segs0[n]!=undefined && segs1[n] !== undefined && segs0[n] === segs1[n]) n++;
  return n;
}

function insertNode(links: Record<string, SavePlace>, prefix: string[], parent: SavePlace, newNode: SavePlace) {
  const tIndex = reduce(parent.subdirs, ([maxSameSegment, bestIndex], item, index) => {
    const sames = countSameSegment(item.dirname, newNode.dirname);
    if (sames > maxSameSegment) {
      return [sames, index];
    }
    return [maxSameSegment, bestIndex];
  }, [0, -1])[1];
  if (tIndex === -1) {
    parent.subdirs.push(newNode);
    return;
  }
  const t = parent.subdirs[tIndex];
  if (t.key === newNode.key) {
    t.torrents.push(newNode.torrents[0]);
    return;
  }
  if (startsWith(newNode.key, t.key)) {
    prefix.push(...newNode.dirname.splice(0, t.dirname.length));
    insertNode(links, prefix, t, newNode);
  } else {
    parent.subdirs[tIndex] = mergeNode(links, prefix, t, newNode);
  }
}

function calcSize(node: SavePlace) {
  forEach(node.subdirs, calcSize);
  node.size = sumBy(node.torrents, 'size') + sumBy(node.subdirs, 'size');
  node.realSize = sumBy(uniqBy(node.torrents, 'name'), 'size') + sumBy(node.subdirs, 'realSize');
}

export function buildSavePlace(torrents?: Torrent[]): RootPath {
  const root: RootPath = {
    key: '',
    size: 0,
    realSize: 0,
    link: {},
    dirname: [''],
    subdirs: [],
    torrents: [],
  };
  if (!torrents) {
    return root;
  }
  for (const torrent of torrents) {
    const newNode: SavePlace = {
      key: trimEnd(torrent.save_path, PATH_SEP),
      dirname: split(trimEnd(torrent.save_path, PATH_SEP), PATH_SEP) as [string, ...string[]],
      torrents: [torrent],
      size: 0,
      realSize: 0,
      subdirs: [],
    };
    if (has(root.link, newNode.key)) {
      root.link[newNode.key].torrents.push(torrent);
      continue;
    }
    root.link[newNode.key] = newNode;
    insertNode(root.link, [], root, newNode);
  }
  calcSize(root);
  return root;
}
