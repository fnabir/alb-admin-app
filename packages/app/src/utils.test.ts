import {
  formatCurrency,
  formatDate,
  fromISODate,
  getCurrentDate,
  getLabelByValue,
  getTotalValue,
  toISODate,
} from './utils';

// formatDate
describe('formatDate', () => {
  it('formats a date correctly', () => {
    expect(formatDate(new Date(2026, 0, 1))).toBe('January 1, 2026');
  });

  it('formats end of year correctly', () => {
    expect(formatDate(new Date(2025, 11, 31))).toBe('December 31, 2025');
  });
});

// formatCurrency
describe('formatCurrency', () => {
  it('formats a positive integer', () => {
    expect(formatCurrency(1000)).toBe('৳ 1,000');
  });

  it('formats a negative value with minus sign', () => {
    expect(formatCurrency(-500)).toBe('- ৳ 500');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('৳ 0');
  });

  it('formats large numbers with correct comma grouping', () => {
    expect(formatCurrency(1000000)).toBe('৳ 10,00,000');
  });

  it('returns empty string for undefined', () => {
    expect(formatCurrency(undefined)).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(formatCurrency('')).toBe('');
  });

  it('returns the value as string if not a number', () => {
    expect(formatCurrency('abc')).toBe('abc');
  });

  it('formats with custom symbol', () => {
    expect(formatCurrency(500, { symbol: '$' })).toBe('$ 500');
  });

  it('formats with null symbol (no symbol)', () => {
    expect(formatCurrency(500, { symbol: null })).toBe('500');
  });

  it('formats with decimals', () => {
    expect(formatCurrency(1000, { decimals: 2 })).toBe('৳ 1,000.00');
  });

  it('formats a string number', () => {
    expect(formatCurrency('2500')).toBe('৳ 2,500');
  });
});

// getTotalValue
const mockSnap = (value: any) =>
  ({
    val: () => value,
  }) as any;

describe('getTotalValue', () => {
  it('returns 0 when data is undefined', () => {
    expect(getTotalValue(undefined)).toBe(0);
  });

  it('sums the "amount" field when dataName is "amount"', () => {
    const data = [
      mockSnap({ amount: 10 }),
      mockSnap({ amount: 20 }),
      mockSnap({ amount: 5 }),
    ];

    expect(getTotalValue(data, 'amount')).toBe(35);
  });

  it('treats missing "amount" as 0', () => {
    const data = [
      mockSnap({ amount: 10 }),
      mockSnap({}), // no amount
      mockSnap({ amount: 5 }),
    ];

    expect(getTotalValue(data, 'amount')).toBe(15);
  });

  it('sums the "value" field when dataName is not "amount"', () => {
    const data = [
      mockSnap({ value: 3 }),
      mockSnap({ value: 7 }),
      mockSnap({ value: -10 }),
    ];

    expect(getTotalValue(data)).toBe(0);
  });

  it('treats missing "value" as 0', () => {
    const data = [
      mockSnap({ value: 3 }),
      mockSnap({}), // no value
      mockSnap({ value: 10 }),
    ];

    expect(getTotalValue(data)).toBe(13);
  });
});

// getCurrentDate
describe('getCurrentDate', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('formats the current date in Asia/Dhaka timezone', () => {
    jest.setSystemTime(new Date('2026-01-01T10:00:00Z'));

    const result = getCurrentDate('yyyy-MM-dd hh:mm:ss a');

    expect(result).toBe('2026-01-01 04:00:00 PM'); // Dhaka is +6h
  });

  it('formats the current date to next date in Asia/Dhaka timezone', () => {
    jest.setSystemTime(new Date('2026-01-01T20:00:00Z'));

    const result = getCurrentDate('yyyy-MM-dd hh:mm:ss a');

    expect(result).toBe('2026-01-02 02:00:00 AM'); // Dhaka is +6h
  });

  it('throws for invalid format', () => {
    jest.setSystemTime(new Date('2026-01-01T20:00:00Z'));

    expect(() => getCurrentDate('tr')).toThrow();
  });

  it('throws for empty format', () => {
    jest.setSystemTime(new Date('2026-01-01T20:00:00Z'));

    expect(() => getCurrentDate('')).toThrow();
  });
});

// toISODate
describe('toISODate', () => {
  it('converts dd.MM.yy to yyyy-MM-dd', () => {
    expect(toISODate('dd.MM.yy', '19.06.26')).toBe('2026-06-19');
  });

  it('converts dd.MM.yyyy to yyyy-MM-dd', () => {
    expect(toISODate('dd.MM.yyyy', '19.06.2026')).toBe('2026-06-19');
  });

  it('returns empty string for empty value', () => {
    expect(toISODate('dd.MM.yy', '')).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(toISODate('dd.MM.yy', undefined)).toBe('');
  });

  it('returns empty string for invalid date', () => {
    expect(toISODate('dd.MM.yy', 'invalid')).toBe('');
  });
});

// fromISODate
describe('fromISODate', () => {
  it('converts yyyy-MM-dd to dd.MM.yy', () => {
    expect(fromISODate('dd.MM.yy', '2026-06-19')).toBe('19.06.26');
  });

  it('converts yyyy-MM-dd to dd MMM yyyy', () => {
    expect(fromISODate('dd MMM yyyy', '2026-06-19')).toBe('19 Jun 2026');
  });

  it('converts yyyy-MM-dd to MMMM yyyy', () => {
    expect(fromISODate('MMMM yyyy', '2026-06-01')).toBe('June 2026');
  });

  it('returns empty string for empty value', () => {
    expect(fromISODate('dd.MM.yy', '')).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(fromISODate('dd.MM.yy', undefined)).toBe('');
  });

  it('returns empty string for invalid date', () => {
    expect(fromISODate('dd.MM.yy', 'invalid')).toBe('');
  });
});

// getLabelByValue
describe('getLabelByValue', () => {
  const options = [
    { value: 'offer', label: 'Offer' },
    { value: 'contact', label: 'Contact' },
    { value: 'quote', label: 'Quote' },
  ];

  it('returns the correct label for a matching value', () => {
    expect(getLabelByValue(options, 'offer')).toBe('Offer');
  });

  it('returns empty string for a non-matching value', () => {
    expect(getLabelByValue(options, 'unknown')).toBe('');
  });

  it('returns empty string for empty string value', () => {
    expect(getLabelByValue(options, '')).toBe('');
  });

  it('returns empty string for empty options array', () => {
    expect(getLabelByValue([], 'offer')).toBe('');
  });
});
