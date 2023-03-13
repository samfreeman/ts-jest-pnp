
import { JsonObject } from './lib/JsonObject'
import { TsProjectConfig } from './TsProjectConfig'

export class NewTsProject {
	static readonly DefaultConfig: TsProjectConfig = {
		parentFolder: '.',
		name: 'ts-project',
		outDir: 'build',
		srcDir: 'src',
		testsDir: 'tests',
		testNameMatch: '*.tests?.ts',
		testsTsConfigName: 'tsconfig.tests.json',
		version: '1.0.0',
		description: 'A TypeScript, ESLint, & Jest project',
		author: '',
		email: '',
		keywords: ['typescript', 'eslint', 'jest'],
		license: 'MIT'
	}

	constructor(readonly config: TsProjectConfig=NewTsProject.DefaultConfig) {}

	scripts = (): JsonObject => ({
		test: `jest --no-color 2>${this.config.testsDir}/output/logs/tests.log`,
		coverage: `"${this.config.testsDir}/output/coverage/lcov-report/index.html"`,
		lint: 'eslint',
		clean: `rimraf ${this.config.outDir} && rimraf tsconfig.tsbuildinfo`,
		build: 'tsc --build --verbose',
		're-build': 'yarn clean && yarn build'
	})

	dependencies: JsonObject = {}

	devDependencies: JsonObject = {
		'@types/jest': 'latest',
		'@types/node': 'latest',
		'@typescript-eslint/eslint-plugin': 'latest',
		'@typescript-eslint/parser': 'latest',
		eslint: 'latest',
		jest: 'latest',
		'ts-jest': 'latest',
		'ts-node': 'latest',
		typescript: 'latest'
	}

	packageJson = (): JsonObject => ({
		name: this.config.name,
		version: this.config.version,
		description: this.config.description,
		author: this.config.author && this.config.email
			? `${this.config.author} <${this.config.email}>`
			: this.config.author || this.config.email,
		keywords: this.config.keywords,
		license: this.config.license,
		scripts: this.scripts(),
		dependencies: this.dependencies,
		devDependencies: this.devDependencies
	})

	gitIgnore = [
		'.yarn/cache',
		'.yarn/sdks',
		'.yarn/unplugged',
		'.yarn/build-state.yml',
		'.yarn/install-state.gz',
		'.pnp.*',
		'*.tsbuildinfo',
		'node_modules',
		'build',
		'tests/output'
	]

	tsConfig = (): JsonObject => ({
		compilerOptions: {
			rootDir: this.config.srcDir,
			outDir: this.config.outDir,
			declaration: true,
			declarationMap: true,
			sourceMap: true,
			composite: true,
			target: 'es2020',
			module: 'commonjs',
			noEmitOnError: true,
			esModuleInterop: true,
			forceConsistentCasingInFileNames: true,
			strict: true
		},
		include: [`${this.config.srcDir}/**/*.ts`]
	})

	esLintConfig: JsonObject = {
		env: {
			browser: true,
			es2021: true
		},
		extends: [
			'eslint:recommended',
			'plugin:@typescript-eslint/recommended'
		],
		overrides: [],
		parser: '@typescript-eslint/parser',
		parserOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module'
		},
		plugins: ['@typescript-eslint'],
		rules: {
			indent: ['error', 'tab'],
			'linebreak-style': ['error', 'windows'],
			quotes: ['error', 'single'],
			semi: ['error', 'never'],
			'@typescript-eslint/no-unused-vars': 'error',
			'@typescript-eslint/consistent-type-definitions': ['error', 'interface']
		}
	}

	esLintIgnore = [
		'.yarn',
		'.pnp.*',
		'*.tsbuildinfo',
		'node_modules',
		'build',
		'tests'
	]

	jestConfig = (): JsonObject => ({
		clearMocks: true,
		collectCoverage: true,
		collectCoverageFrom: [
			`${this.config.srcDir}/**/*.ts`,
			`!${this.config.srcDir}/**/index.ts`
		],
		coverageDirectory: `${this.config.testsDir}/output/coverage`,
		coverageProvider: 'v8',
		preset: 'ts-jest',
		roots: [this.config.srcDir, this.config.testsDir],
		testEnvironment: 'jest-environment-node',
		testMatch: [`**/${this.config.testsDir}/**/${this.config.testNameMatch}`],
		verbose: true,
		transform: {
			'^.+\\.tsx?$': [
				'ts-jest', { tsconfig: this.config.testsTsConfigName }
			]
		}
	})

	jestTsConfig = (): JsonObject => ({
		extends: './tsconfig.json',
		compilerOptions: {
			rootDir: '.'
		},
		include: [
			`${this.config.srcDir}/**/*.ts`,
			`${this.config.testsDir}/**/*.ts`
		]
	})

	readme = [
		`# ${this.config.name}`,
		this.config.description
	]
}
