
import { isJsonObject } from '../../src/lib/JsonObject'

describe('ts-jest-pnp', () => {
	test('isJsonObject', () => {
		expect(isJsonObject({})).toBe(true)
		expect(isJsonObject([])).toBe(false)
		expect(isJsonObject(null)).toBe(false)
		expect(isJsonObject(undefined)).toBe(false)
		expect(isJsonObject(0)).toBe(false)
		expect(isJsonObject('')).toBe(false)
		expect(isJsonObject(true)).toBe(false)
	})
})
