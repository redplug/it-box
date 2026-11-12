const DAY_MS = 86_400_000;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function fail(key: string): never {
  throw new Error(`tools.age-dday-calculator.errors.${key}`);
}

function pad(value: number, length = 2): string {
  return String(value).padStart(length, '0');
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// Days since 1970-01-01 for a 'YYYY-MM-DD' string, computed in UTC so the local time zone never matters.
function toDayNumber(value: string): number {
  if (!DATE_PATTERN.test(value)) {
    fail('invalidDate');
  }
  const [year, month, day] = value.split('-').map(Number);
  const ms = Date.UTC(year, month - 1, day);
  const date = new Date(ms);
  // Round-trip check rejects impossible dates such as 2026-02-30 and years 0000 to 0099.
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    fail('invalidDate');
  }
  return ms / DAY_MS;
}

function fromDayNumber(days: number): string {
  const date = new Date(days * DAY_MS);
  const year = date.getUTCFullYear();
  if (year < 1 || year > 9999) {
    fail('outOfRange');
  }
  return `${pad(year, 4)}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

// 0 = Sunday ... 6 = Saturday. 1970-01-01 was a Thursday.
function weekdayOfDayNumber(days: number): number {
  return ((days + 4) % 7 + 7) % 7;
}

function assertInteger(value: number): void {
  if (!Number.isInteger(value)) {
    fail('invalidNumber');
  }
}

function assertNotBefore(birth: string, ref: string): void {
  if (toDayNumber(ref) < toDayNumber(birth)) {
    fail('refBeforeBirth');
  }
}

// Feb 29 birthdays fall on Mar 1 in common years (the rule this tool documents).
function birthdayInYear(birth: string, year: number): string {
  const monthDay = birth.slice(5);
  if (monthDay === '02-29' && !isLeapYear(year)) {
    return `${pad(year, 4)}-03-01`;
  }
  return `${pad(year, 4)}-${monthDay}`;
}

export function localDateString(date: Date): string {
  return `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function daysBetween(a: string, b: string): number {
  return toDayNumber(b) - toDayNumber(a);
}

export function internationalAge(birth: string, ref: string): number {
  assertNotBefore(birth, ref);
  const refYear = Number(ref.slice(0, 4));
  const notYetBirthday = ref < birthdayInYear(birth, refYear);
  return refYear - Number(birth.slice(0, 4)) - (notYetBirthday ? 1 : 0);
}

export function yearAge(birth: string, ref: string): number {
  assertNotBefore(birth, ref);
  return Number(ref.slice(0, 4)) - Number(birth.slice(0, 4));
}

export function daysSinceBirth(birth: string, ref: string): number {
  assertNotBefore(birth, ref);
  return daysBetween(birth, ref) + 1;
}

export function daysUntilNextBirthday(birth: string, ref: string): number {
  assertNotBefore(birth, ref);
  const refYear = Number(ref.slice(0, 4));
  let next = birthdayInYear(birth, refYear);
  if (next < ref) {
    next = birthdayInYear(birth, refYear + 1);
  }
  return daysBetween(ref, next);
}

export function dday(target: string, ref: string): string {
  const diff = daysBetween(ref, target);
  if (diff === 0) {
    return 'D-Day';
  }
  return diff > 0 ? `D-${diff}` : `D+${-diff}`;
}

export function weeksAndDays(count: number): { weeks: number; days: number } {
  const abs = Math.abs(count);
  return { weeks: Math.floor(abs / 7), days: abs % 7 };
}

// Counts Monday to Friday in (a, b]. When b is before a, the count is negative.
export function businessDaysBetween(a: string, b: string): number {
  const from = toDayNumber(a);
  const to = toDayNumber(b);
  if (from === to) {
    return 0;
  }
  const lo = Math.min(from, to);
  const hi = Math.max(from, to);
  let count = 0;
  for (let day = lo + 1; day <= hi; day++) {
    const weekday = weekdayOfDayNumber(day);
    if (weekday !== 0 && weekday !== 6) {
      count++;
    }
  }
  return to > from ? count : -count;
}

export function addDays(date: string, count: number): string {
  assertInteger(count);
  return fromDayNumber(toDayNumber(date) + count);
}

// The n-th day counting the start date as day 1, e.g. dayCount('2026-01-01', 100) is the 100th day.
export function dayCount(start: string, n: number): string {
  assertInteger(n);
  if (n < 1) {
    fail('invalidDayCount');
  }
  return addDays(start, n - 1);
}

export function weekdayIndex(date: string): number {
  return weekdayOfDayNumber(toDayNumber(date));
}
