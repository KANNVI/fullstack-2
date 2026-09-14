import {
  toDateKey,
  daysInMonth,
  buildMonthGrid,
  isSameDay,
} from "../dateUtils";

describe("toDateKey", () => {
  it("formats a date as YYYY-MM-DD with zero-padding", () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe("2026-01-05");
    expect(toDateKey(new Date(2026, 11, 31))).toBe("2026-12-31");
  });
});

describe("daysInMonth", () => {
  it("returns 31 for January", () => {
    expect(daysInMonth(2026, 0)).toBe(31);
  });

  it("returns 28 for February in a non-leap year", () => {
    expect(daysInMonth(2026, 1)).toBe(28);
  });

  it("returns 29 for February in a leap year", () => {
    expect(daysInMonth(2024, 1)).toBe(29);
  });

  it("returns 30 for April", () => {
    expect(daysInMonth(2026, 3)).toBe(30);
  });
});

describe("buildMonthGrid", () => {
  it("always returns exactly 42 cells (a full 6-week grid)", () => {
    const grid = buildMonthGrid(2026, 8); // September 2026
    expect(grid).toHaveLength(42);
  });

  it("marks the correct number of days as belonging to the current month", () => {
    const grid = buildMonthGrid(2026, 8); // September 2026 has 30 days
    const currentMonthCells = grid.filter((c) => c.isCurrentMonth);
    expect(currentMonthCells).toHaveLength(30);
  });

  it("produces dateKeys in strictly ascending calendar order", () => {
    const grid = buildMonthGrid(2026, 8);
    for (let i = 1; i < grid.length; i++) {
      expect(grid[i].date.getTime()).toBeGreaterThan(grid[i - 1].date.getTime());
    }
  });

  it("includes leading days from the previous month when the 1st isn't a Sunday", () => {
    const grid = buildMonthGrid(2026, 8); // Sept 1, 2026 is a Tuesday
    const leading = grid.filter((c) => !c.isCurrentMonth && c.date.getMonth() === 7);
    expect(leading.length).toBeGreaterThan(0);
  });
});

describe("isSameDay", () => {
  it("returns true for the same calendar day at different times", () => {
    const a = new Date(2026, 8, 14, 9, 0);
    const b = new Date(2026, 8, 14, 23, 59);
    expect(isSameDay(a, b)).toBe(true);
  });

  it("returns false for different days", () => {
    const a = new Date(2026, 8, 14);
    const b = new Date(2026, 8, 15);
    expect(isSameDay(a, b)).toBe(false);
  });
});
