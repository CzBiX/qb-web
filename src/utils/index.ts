import { StateType } from '@/consts';
import { Torrent } from '@/types';

const dlState = ['downloading', 'metaDL', 'stalledDL', 'checkingDL', 'pausedDL', 'queuedDL', 'forcedDL', 'allocating'];
const upState = ['uploading', 'stalledUP', 'checkingUP', 'queuedUP', 'forcedUP'];
const completeState = ['uploading', 'stalledUP', 'checkingUP', 'pausedUP', 'queuedUP', 'forcedUP'];
const activeState = ['metaDL', 'downloading', 'forcedDL', 'uploading', 'forcedUP', 'moving'];
const errorState = ['error', 'missingFiles'];

export function torrentIsState(type: StateType, state: string) {
  let result;
  switch (type) {
    case StateType.Downloading: {
      result = dlState.includes(state);
      break;
    }
    case StateType.Seeding: {
      result = upState.includes(state);
      break;
    }
    case StateType.Completed: {
      result = completeState.includes(state);
      break;
    }
    case StateType.Resumed:
    case StateType.Paused: {
      const paused = state.startsWith('paused');
      result = type === StateType.Paused ? paused : !paused;
      break;
    }
    case StateType.Active:
    case StateType.Inactive: {
      const active = activeState.includes(state);
      result = type === StateType.Active ? active : !active;
      break;
    }
    case StateType.Errored: {
      result = errorState.includes(state);
      break;
    }
    default:
      throw Error('Invalid type');
  }

  return result;
}

export function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * @deprecated renamed to `timeout`
 */
export const sleep = timeout;

export function codeToFlag(code: string) {
  const magicNumber = 0x1F1A5;

  // eslint-disable-next-line
  code = code.toUpperCase();
  const codePoints = [...code].map(c => magicNumber + c.charCodeAt(0));
  const char = String.fromCodePoint(...codePoints);
  const url = 'https://cdn.jsdelivr.net/npm/twemoji/2/svg/'
    + `${codePoints[0].toString(16)}-${codePoints[1].toString(16)}.svg`;

  return {
    char,
    url,
  };
}

export const isWindows = navigator.userAgent.includes('Windows');

export function findSameNamedTorrents(allTorrents: Torrent[], torrents: Torrent[]) {
  const hashes = torrents.map(t => t.hash);
  const result = [];
  for (const t1 of torrents) {
    for (const t2 of allTorrents) {
      if (hashes.includes(t2.hash)) {
        continue;
      }

      if (t1.name !== t2.name) {
        continue;
      }

      result.push(t2);
      hashes.push(t2.hash);
    }
  }

  return result;
}

export function typed<T>(value: T): T {
  return value;
}
