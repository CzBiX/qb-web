import dayjs from 'dayjs';
import Vue from 'vue';

export function formatSize(value: number) {
  const units = 'KMGTP';
  let index = -1;

  while (value >= 1024) {
    index++;
    value /= 1024;
  }

  const unit = index < 0 ? 'B' : units[index] + 'iB';

  return `${value.toFixed(2)} ${unit}`;
}

Vue.filter('formatSize', formatSize);

Vue.filter('formatDuration', (value: number) => {
  const minute = 60;
  const hour = 3600;
  const day = 3600 * 24;

  const durations = [day, hour, minute, 1];
  const units = 'dhms';

  let index = 0;
  let unitSize = 0;
  const parts = [];

  while (true) {
    if (unitSize === 2 || index === durations.length) {
      break;
    }

    const duration = durations[index];
    if (value < duration) {
      index++;
      continue;
    }
    const result = Math.floor(value / duration);
    if (index === 0 && result >= 100) {
      return '∞';
    }
    parts.push(result + units[index]);

    value %= duration;
    index++;
    unitSize++;
  }

  if (unitSize < 2 && index !== durations.length) {
    const result = Math.floor(value / durations[index]);
    parts.push(result + units[index]);
  }

  return parts.join(' ');
});

Vue.filter('formatTimestamp', (timestamp: number) => {
  if (timestamp === null) {
    return '';
  }

  const m = dayjs.unix(timestamp);
  return m.format('YYYY-MM-DD HH:mm:ss');
});
