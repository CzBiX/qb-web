import dayjs from 'dayjs';
import Vue from 'vue';

/* eslint-disable no-param-reassign */
export function toPrecision(value: number, precision: number) {
  if (value >= (10 ** precision)) {
    return value.toString();
  } if (value >= 1) {
    return value.toPrecision(precision);
  }

  return value.toFixed(precision - 1);
}

export function formatSize(value: number) {
  const units = 'KMGTP';
  let index = -1;

  while (value >= 1000) {
    value /= 1024;
    index++;
  }

  const unit = index < 0 ? 'B' : `${units[index]}iB`;

  if (index < 0) {
    return `${value} ${unit}`;
  }
  return `${toPrecision(value, 3)} ${unit}`;
}

Vue.filter('formatSize', formatSize);
Vue.filter('size', formatSize);

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
    maxUnitSize: 2,
    dayLimit: 0,
  };

  const opt = options ? Object.assign(defaultOptions, options) : defaultOptions;

  if (opt.dayLimit && value >= opt.dayLimit * day) {
    return '∞';
  }

  while ((!opt.maxUnitSize || unitSize !== opt.maxUnitSize) && index !== durations.length) {
    const duration = durations[index];
    if (value < duration) {
      index++;
      continue;
    }
    const result = Math.floor(value / duration);
    parts.push(result + units[index]);

    // eslint-disable-next-line
    value %= duration;
    index++;
    unitSize++;
  }

  // if (unitSize < 2 && index !== durations.length) {
  //   const result = Math.floor(value / durations[index]);
  //   parts.push(result + units[index]);
  // }

  if (!parts.length) {
    return '0';
  }

  return parts.join(' ');
}

Vue.filter('formatDuration', formatDuration);

export function formatTimestamp(timestamp: number | null) {
  if (timestamp == null || timestamp === -1) {
    return '';
  }

  const m = dayjs.unix(timestamp);
  return m.format('YYYY-MM-DD HH:mm:ss');
}

Vue.filter('formatTimestamp', formatTimestamp);

export function formatAsDuration(timestamp: number, options?: DurationOptions) {
  const duration = (Date.now() / 1000) - timestamp;
  return formatDuration(duration, options);
}

Vue.filter('formatAsDuration', formatAsDuration);

export function formatProgress(progress: number) {
  // eslint-disable-next-line
  progress *= 100;
  return `${toPrecision(progress, 3)}%`;
}

Vue.filter('progress', formatProgress);
