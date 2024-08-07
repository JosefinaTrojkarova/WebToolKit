import { describe, it, expect } from 'vitest';
import { calculateRating } from '~/composables/useHandleRating';

describe('calculateRating', () => {
  it('calculates correct width for 0 and 5', () => {
    expect(calculateRating(0)).toBe('0%');
    expect(calculateRating(5)).toBe('100%');
  });

  it('calculates correct width for fractional ratings', () => {
    expect(calculateRating(2.5)).toBe('50%');
    expect(calculateRating(3.75)).toBe('75%');
    expect(calculateRating(1.25)).toBe('25%');
  });
});
