import { describe, expect, it } from 'vitest';
import { additionalScreenCopy, screenText } from '@/locales/screenCopy';

describe('remaining studio prompt localization', () => {
  const keys = Object.keys(additionalScreenCopy.en);
  for (const locale of ['ar','fr','es','it']) {
    it(`has all ${keys.length} newly translated prompts for ${locale}`, () => {
      for (const key of keys) {
        expect(screenText(locale,key)).not.toBe(key);
        expect(screenText(locale,key).trim().length).toBeGreaterThan(8);
      }
    });
  }
  it('keeps English and unknown text usable', () => {
    for (const key of keys) expect(screenText('en',key)).toBe(key);
    expect(screenText('fr','A text not in dictionaries')).toBe('A text not in dictionaries');
  });
});
