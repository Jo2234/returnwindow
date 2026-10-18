import { it, expect } from 'vitest';
import { makeSpan, verifySpan } from '../../src/domain/spans';
import { categorize, categoriesInText } from '../../src/domain/categories';
import { caseReducer, emptyCase } from '../../src/state/case-store';
import { computeCase } from '../../src/domain/engine';
import { demo, now } from './helpers';
it('span verification rejects bounds, empty, noninteger and text mismatch', () => { const source = '😀 café returns'; expect(makeSpan(source, 3, 7)).toEqual({ start: 3, end: 7, text: 'café' }); for (const s of [{ start: -1, end: 4, text: '😀 ' }, { start: 0, end: 0, text: '' }, { start: 0, end: 99, text: source }, { start: 3, end: 7, text: 'cafe' }, { start: 0.5, end: 2, text: '😀' }])
    expect(verifySpan(source, s)).toBe(false); expect(() => makeSpan(source, 0, 99)).toThrow(); });
it('category lexicon is whole-word and deterministic by priority', () => { expect(categorize('Home electronics shirt')).toEqual({ value: 'electronics', keyword: 'electronics' }); expect(categorize('Shoe shirt')).toEqual({ value: 'footwear', keyword: 'Shoe' }); expect(categorize('Shirt Mug')).toEqual({ value: 'apparel', keyword: 'Shirt' }); expect(categorize('mugshot')).toEqual({ value: 'other', keyword: null }); expect(categoriesInText('Apparel and footwear').map(x => x.category)).toEqual(['apparel', 'footwear']); });
it('reducer saves previous results, resets everything and derives from injected time', () => { const state = emptyCase(), initial = { case: state, result: computeCase(state, now), previousResult: null, revision: 0 }; const loaded = caseReducer(initial, { type: 'replace', state: demo(), now }); expect(loaded.previousResult).toEqual(initial.result); expect(loaded.result.items[1]!.outcome).toMatchObject({ deadline: '2026-11-07' }); const reset = caseReducer(loaded, { type: 'reset', now }); expect(reset.case).toEqual(emptyCase()); expect(reset.previousResult).toBeNull(); expect(reset.result.items).toEqual([]); });
it('lexicon recognizes singular/plural forms without substring matches',()=>{
 expect(categorize('Cotton Shirts').value).toBe('apparel');expect(categorize('Stoneware Mugs').value).toBe('home');expect(categorize('Leather Boot').value).toBe('footwear');expect(categorize('Smartwatches').value).toBe('electronics');expect(categorize('Cosmetic').value).toBe('beauty');expect(categorize('Dresses').value).toBe('apparel');expect(categorize('mugshots').value).toBe('other');expect(categoriesInText('Mugs may be returned').map(x=>x.category)).toEqual(['home']);
});
