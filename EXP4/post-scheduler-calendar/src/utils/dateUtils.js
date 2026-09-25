// Date/time utility helpers for the calendar.
// Kept pure and dependency-free so they are cheap to test and to memoize around.

/** Returns a 'YYYY-MM-DD' key for a given Date, in local time. */
export function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Returns the number of days in the given month (0-indexed month). */
export function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Builds a 6x7 grid (42 cells) of day-cell descriptors for a month view,
 * including the leading/trailing days from adjacent months so every week
 * row is fully populated.
 *
 * Each cell: { date: Date, dateKey: string, isCurrentMonth: boolean }
 */
export function buildMonthGrid(year, month) {
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
  const totalDaysThisMonth = daysInMonth(year, month);

  const prevMonthDays = daysInMonth(year, month - 1 < 0 ? 11 : month - 1);
  const prevMonthYear = month === 0 ? year - 1 : year;
  const prevMonth = month === 0 ? 11 : month - 1;

  const nextMonthYear = month === 11 ? year + 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;

  const cells = [];

  // Leading days from previous month
  for (let i = 0; i < startWeekday; i++) {
    const day = prevMonthDays - startWeekday + i + 1;
    const date = new Date(prevMonthYear, prevMonth, day);
    cells.push({ date, dateKey: toDateKey(date), isCurrentMonth: false });
  }

  // Days of current month
  for (let day = 1; day <= totalDaysThisMonth; day++) {
    const date = new Date(year, month, day);
    cells.push({ date, dateKey: toDateKey(date), isCurrentMonth: true });
  }

  // Trailing days from next month to complete a 42-cell (6-week) grid
  while (cells.length < 42) {
    const day = cells.length - (startWeekday + totalDaysThisMonth) + 1;
    const date = new Date(nextMonthYear, nextMonth, day);
    cells.push({ date, dateKey: toDateKey(date), isCurrentMonth: false });
  }

  return cells;
}

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** True if the two Date objects fall on the same calendar day. */
export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
