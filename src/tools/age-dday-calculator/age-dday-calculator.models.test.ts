import { describe, expect, it } from 'vitest';
import {
  addDays,
  businessDaysBetween,
  dayCount,
  daysBetween,
  daysSinceBirth,
  daysUntilNextBirthday,
  dday,
  internationalAge,
  localDateString,
  weekdayIndex,
  weeksAndDays,
  yearAge,
} from './age-dday-calculator.models';

describe('age', () => {
  it('counts the international age around the birthday', () => {
    expect(internationalAge('2000-06-15', '2026-06-14')).toBe(25);
    expect(internationalAge('2000-06-15', '2026-06-15')).toBe(26);
    expect(internationalAge('2000-06-15', '2026-06-16')).toBe(26);
  });

  it('handles year-end and new-year boundaries', () => {
    expect(internationalAge('2000-12-31', '2026-12-31')).toBe(26);
    expect(internationalAge('2000-12-31', '2027-01-01')).toBe(26);
    expect(internationalAge('2000-01-01', '2026-12-31')).toBe(26);
    expect(yearAge('2000-12-31', '2027-01-01')).toBe(27);
  });

  it('moves a Feb 29 birthday to Mar 1 in common years', () => {
    expect(internationalAge('2000-02-29', '2027-02-28')).toBe(26);
    expect(internationalAge('2000-02-29', '2027-03-01')).toBe(27);
    expect(internationalAge('2000-02-29', '2028-02-28')).toBe(27);
    expect(internationalAge('2000-02-29', '2028-02-29')).toBe(28);
    expect(daysUntilNextBirthday('2000-02-29', '2027-02-28')).toBe(1);
  });

  it('rejects a reference date before the birth date', () => {
    expect(() => internationalAge('2026-01-02', '2026-01-01')).toThrow('tools.age-dday-calculator.errors.refBeforeBirth');
    expect(() => daysSinceBirth('2026-01-02', '2026-01-01')).toThrow();
  });

  it('counts the days lived with the birth date as day 1', () => {
    expect(daysSinceBirth('2000-01-01', '2000-01-01')).toBe(1);
    expect(daysSinceBirth('2000-01-01', '2000-01-02')).toBe(2);
    expect(daysSinceBirth('2000-06-15', '2026-06-14')).toBe(9496);
  });

  it('counts days until the next birthday, 0 on the birthday itself', () => {
    expect(daysUntilNextBirthday('2000-06-15', '2026-06-15')).toBe(0);
    expect(daysUntilNextBirthday('2000-06-15', '2026-06-14')).toBe(1);
    expect(daysUntilNextBirthday('2000-06-15', '2026-06-16')).toBe(364);
  });
});

describe('d-day and date differences', () => {
  it('uses the sign of the difference for the label', () => {
    expect(dday('2026-12-10', '2026-11-12')).toBe('D-28');
    expect(dday('2026-11-12', '2026-11-12')).toBe('D-Day');
    expect(dday('2026-11-02', '2026-11-14')).toBe('D+12');
  });

  it('splits a day count into weeks and days', () => {
    expect(weeksAndDays(-30)).toEqual({ weeks: 4, days: 2 });
  });

  it('computes the difference in days as b minus a', () => {
    expect(daysBetween('2026-11-12', '2026-12-10')).toBe(28);
  });
});

describe('date arithmetic', () => {
  it('moves across months and leap-year February', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(addDays('2024-02-28', 1)).toBe('2024-02-29');
    expect(addDays('2025-02-28', 1)).toBe('2025-03-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
  });

  it('rejects impossible dates and fractional day counts', () => {
    expect(() => addDays('2026-02-30', 1)).toThrow();
    expect(() => addDays('2026-01-01', 1.5)).toThrow();
  });

  it('counts business days, excluding weekends', () => {
    expect(businessDaysBetween('2026-11-13', '2026-11-16')).toBe(1);
    expect(businessDaysBetween('2026-11-09', '2026-11-16')).toBe(5);
    expect(businessDaysBetween('2026-11-12', '2026-11-12')).toBe(0);
    expect(businessDaysBetween('2026-11-16', '2026-11-13')).toBe(-1);
  });

  it('treats the start date as day 1 for day counts', () => {
    expect(dayCount('2026-01-01', 1)).toBe('2026-01-01');
    expect(dayCount('2026-01-01', 100)).toBe('2026-04-10');
    expect(() => dayCount('2026-01-01', 0)).toThrow();
  });

  it('gives the weekday with Sunday as 0', () => {
    expect(weekdayIndex('2026-11-12')).toBe(4);
  });

  it('formats a local date without time zone shifts', () => {
    expect(localDateString(new Date(2026, 10, 12, 0, 0, 0))).toBe('2026-11-12');
  });
});
