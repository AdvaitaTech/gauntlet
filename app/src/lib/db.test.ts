import { describe, expect, it } from 'vitest';
import { getParameterizedQuery } from './db';

describe('DB Utils', () => {
	describe('getParameterizedQuery', () => {
		it('should concatenate params', () => {
			const [query, params] = getParameterizedQuery({ userId: 5, title: 'a' });
			expect(query).toBe('WHERE userId=$1 AND title=$2');
			expect(params).toStrictEqual([5, 'a']);
		});

		it('should ignore undefined params', () => {
			const [query, params] = getParameterizedQuery({ test: true, name: undefined });
			expect(query).toBe('WHERE test=$1');
			expect(params).toStrictEqual([true]);
		});

		it('should return empty query for empty params', () => {
			const [query, params] = getParameterizedQuery({});
			expect(query).toBe('');
			expect(params).toHaveLength(0);
		});

		it('should return prefixed params', () => {
			const [query, params] = getParameterizedQuery(
				{ test: 'abc', success: false },
				{ prefix: 't' }
			);
			expect(query).toBe('WHERE t.test=$1 AND t.success=$2');
			expect(params).toHaveLength(2);
			expect(params).toStrictEqual(['abc', false]);
		});
	});
});
