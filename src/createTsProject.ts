
import './lib/path'
import './lib/file'
import { file, folder } from './lib/file'
import { NewTsProject } from './NewTsProject'


export const createTsProject = (config = NewTsProject.DefaultConfig) => {
	const prj = new NewTsProject(config)
	const {
		parentFolder,
		name,
		srcDir,
		testsDir,
		testsTsConfigName,
	} = prj.config

	const {
		esLintIgnore,
		esLintConfig,
		gitIgnore,
		readme
	} = prj

	const packageJson = prj.packageJson()
	const tsConfig = prj.tsConfig()
	const jestConfig = prj.jestConfig()
	const jestKeys = Object.keys(jestConfig)
	const jestTsConfig = prj.jestTsConfig()

	const jsonTab = 2

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const rules = prj.esLintConfig.rules as any
	const tsTab: number | string =
		rules
			&& rules.indent
			&& rules.indent.length > 1
			&& rules.indent[1] != 'tab'
			? 4
			: '\t'

	return parentFolder.appendPath(name)
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

			'jest.config.ts': file([
				'',
				'export default {',
				...jestKeys.map((key, i) => {
					const result = `${tsTab}${key}: ${JSON.stringify(jestConfig[key])}`
					return i == jestKeys.length - 1
						? result
						: `${result},`
				}),
				'}'
			]),

			'package.json': file(packageJson, jsonTab),

			'README.md': file(readme),

			'tsconfig.json': file(tsConfig, jsonTab),

			[testsTsConfigName]: file(jestTsConfig, jsonTab)
		}))
}
