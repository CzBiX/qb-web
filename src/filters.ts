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

export interface DurationOptions {
  dayLimit?: number;
  maxUnitSize?: number;
}

export function formatDuration(value: number, options?: DurationOptions) {
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const year = day * 365;

  const durations = [year, day, hour, minute, 1];
  const units = 'ydhms';

  let index = 0;
  let unitSize = 0;
  const parts = [];

  const defaultOptions: DurationOptions = {
    maxUnitSize: 1,
    dayLimit: 0,
  };

  const opt = options ? Object.assign(defaultOptions, options) : defaultOptions;

  if (opt.dayLimit && value >= opt.dayLimit * day) {
    return '∞';
  }

  while (true) {
    if ((opt.maxUnitSize && unitSize === opt.maxUnitSize) || index === durations.length) {
      break;
    }

    const duration = durations[index];
    if (value < duration) {
      index++;
      continue;
    }
    const result = Math.floor(value / duration);
    parts.push(result + units[index]);

    value %= duration;
    index++;
    unitSize++;
  }

  // if (unitSize < 2 && index !== durations.length) {
  //   const result = Math.floor(value / durations[index]);
  //   parts.push(result + units[index]);
  // }

  return parts.join(' ');
};

Vue.filter('formatDuration', formatDuration);

Vue.filter('formatTimestamp', (timestamp: number) => {
  if (timestamp === null) {
    return '';
  }

  const m = dayjs.unix(timestamp);
  return m.format('YYYY-MM-DD HH:mm:ss');
});

export function formatAsDuration(date: number, options?: DurationOptions) {
    const duration = (Date.now() / 1000) - date;
    return formatDuration(duration, options);
};

Vue.filter('formatAsDuration', formatAsDuration);
