/** Date helpers used by the follow-up dashboard and KPI charts. No external deps. */

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayIso(): string {
  return toIsoDate(new Date());
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Monday-start end-of-week (Sunday) for the week containing `date`. */
export function endOfWeekIso(date: Date = new Date()): string {
  const d = startOfDay(date);
  const day = d.getDay(); // 0 = Sunday
  const daysUntilSunday = day === 0 ? 0 : 7 - day;
  d.setDate(d.getDate() + daysUntilSunday);
  return toIsoDate(d);
}

export function isOverdueOrToday(followUpDate: string): boolean {
  return followUpDate <= todayIso();
}

export function isLaterThisWeek(followUpDate: string): boolean {
  const today = todayIso();
  return followUpDate > today && followUpDate <= endOfWeekIso();
}

/** Monday-start week key, e.g. "2026-W30", for bucketing events by week. */
export function weekKey(isoDateTime: string): string {
  const d = startOfDay(new Date(isoDateTime));
  const dayNum = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - dayNum + 3); // nearest Thursday
  const firstThursday = new Date(d.getFullYear(), 0, 4);
  const firstDayNum = (firstThursday.getDay() + 6) % 7;
  firstThursday.setDate(firstThursday.getDate() - firstDayNum + 3);
  const week = 1 + Math.round((d.getTime() - firstThursday.getTime()) / (7 * 86400000));
  return `${d.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function monthKey(isoDateTime: string): string {
  const d = new Date(isoDateTime);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Returns the last `count` week keys ending with the current week, oldest first. */
export function lastWeekKeys(count: number, from: Date = new Date()): { key: string; label: string }[] {
  const result: { key: string; label: string }[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(from);
    d.setDate(d.getDate() - i * 7);
    const key = weekKey(d.toISOString());
    const label = key.split("-W")[1] ? `W${Number(key.split("-W")[1])}` : key;
    result.push({ key, label });
  }
  return result;
}

/** Returns the last `count` month keys ending with the current month, oldest first. */
export function lastMonthKeys(count: number, from: Date = new Date()): { key: string; label: string }[] {
  const result: { key: string; label: string }[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(from.getFullYear(), from.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    result.push({ key, label: `${d.getMonth() + 1}月` });
  }
  return result;
}
