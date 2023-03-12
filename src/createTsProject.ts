
import './lib/path'
import './lib/file'
import { file, folder } from './lib/file'
import { JsonObject } from './lib/JsonObject'

export class TsProjectConfig {
	static readonly Default = new TsProjectConfig()

	name = 'ts-project'
	outDir = 'build'
	srcDir = 'src'
	testsDir = 'tests'
	testNameMatch = '*.tests?.ts'
	testsTsConfigName = 'tsconfig.tests.json'
	version = '1.0.0'
	description = 'A TypeScript, ESLint, & Jest project'
	author = 'Your Name'
	email = 'Your Email'
	keywords = ['typescript', 'eslint', 'jest']
	license = 'MIT'

	scripts = (): JsonObject => ({
		test: `jest --no-color 2>${this.testsDir}/output/logs/tests.log`,
		coverage: `"${this.testsDir}/output/coverage/lcov-report/index.html"`,
		lint: 'eslint',
		clean: `rimraf ${this.outDir} && rimraf tsconfig.tsbuildinfo`,
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
		name: this.name,
		version: this.version,
		description: this.description,
		author: this.name && this.email
			? `${this.name} <${this.email}>`
			: this.name || this.email,
		keywords: this.keywords,
		license: this.license,
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
		'node_modules',
		'build',
		'tests/output'
	]

	tsConfig = (): JsonObject => ({
		compilerOptions: {
			rootDir: this.srcDir,
			outDir: this.outDir,
			declaration: true,
			declarationMap: true,
			sourceMap: true,
			composite: true,
			target: 'es2020',
			module: 'commonjs',
			noEmitOnError: true,
			esModuleInterop: true,
			strict: true
		},
		include: [`${this.srcDir}/**/*.ts`]
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
		'node_modules',
		'build',
		'tests'
	]

	jestConfig = (): JsonObject => ({
		clearMocks: true,
		collectCoverage: true,
		collectCoverageFrom: [
			`${this.srcDir}/**/*.ts`,
			`!${this.srcDir}/**/index.ts`
		],
		coverageDirectory: `${this.testsDir}/output/coverage`,
		coverageProvider: 'v8',
		preset: 'ts-jest',
		roots: [this.srcDir, this.testsDir],
		testEnvironment: 'jest-environment-node',
		testMatch: [`**/${this.testsDir}/**/${this.testNameMatch}`],
		verbose: true,
		transform: {
			'^.+\\.tsx?$': [
				'ts-jest', { tsconfig: this.testsTsConfigName }
			]
		}
	})

	jestTsConfig = (): JsonObject => ({
		extends: './tsconfig.json',
		compilerOptions: {
			rootDir: '.'
		},
		include: [
			`${this.srcDir}/**/*.ts`,
			`${this.testsDir}/**/*.ts`
		]
	})

	readme = [
		`# ${this.name}`,
		this.description
	]
}

export const createTsProject = async (config: TsProjectConfig = TsProjectConfig.Default) => {
	const {
		name,
		srcDir,
		testsDir,
		esLintIgnore,
		esLintConfig,
		gitIgnore,
		packageJson,
		readme,
		tsConfig,
		testsTsConfigName,
		jestTsConfig
	} = config

	const jsonTab = 2

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const rules = esLintConfig.rules as any
	const tsTab: number | string = rules
		&& rules.indent
		&& rules.indent.length > 1
		&& rules.indent[1] != 'tab'
		? 4
		: '\t'

	return name
		.resolvePath()
		.createFolder(folder({
			[srcDir]: folder(),

			[testsDir]: folder({
				'output': folder({
					'coverage': folder(),
					'logs': folder()
				}),
			}),

			'.eslintignore': file(esLintIgnore),

			'.eslintrc.json': file(esLintConfig, jsonTab),

			'.gitignore': file(gitIgnore),

			'jest.config.ts': file(config.jestConfig(), tsTab),

			'package.json': file(packageJson(), jsonTab),

			'README.md': file(readme),

			'tsconfig.json': file(tsConfig(), jsonTab),

			[testsTsConfigName]: file(jestTsConfig(), jsonTab)
		}))
}
