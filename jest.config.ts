
export default {
	clearMocks: true,
	collectCoverage: true,
	collectCoverageFrom: [
		'src/**/*.ts',
		'!src/**/index.ts',
	],
	coverageDirectory: 'tests/output/coverage',
	coverageProvider: 'v8',
	preset: 'ts-jest',
	roots: ['src', 'tests'],
	testEnvironment: 'jest-environment-node',
	testMatch: ['**/tests/**/*.test.ts'],
	verbose: true,
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest', { tsconfig: 'tsconfig.tests.json' }
		]
	}
}
