
import { TsProjectConfig } from './TsProjectConfig'
import { NewTsProject } from './NewTsProject'
import './lib/file'
import './lib/prompt'


const checkPath = (name: string, path: string) => {
	if (!path)
		throw new Error(`${name} is required`)
	if (!path.isValidPath())
		throw new Error(`${name} '${path}' contains invalid characters`)
	return path
}

const checkPathName = (name: string, path: string) => {
	checkPath(name, path)
	if (path != path.toLowerCase())
		throw new Error(`${name} '${path}' should be lowercase`)
	if (/\/|\\/.test(path))
		throw new Error(`${name} '${path}' should not contain path separators`)
	return path
}

const checkPathDoesNotExist = (name: string, path: string) => {
	checkPathName(name, path)
	if (path.resolvePath().pathExists())
		throw new Error(`${name} '${path}' already exists`)
	return path
}

const checkPathExists = (name: string, path: string) => {
	checkPath(name, path)
	path = path.resolvePath()
	if (!path.pathExists())
		throw new Error(`${name} '${path}' does not exist`)
	return path
}

export const getTsProjectConfig = (): TsProjectConfig => {
	const def = NewTsProject.DefaultConfig

	const parentFolder = 'Parent folder'.prompt(def.parentFolder, checkPathExists)
	return parentFolder.useFolder(() => {
		const name = 'Project name'.prompt(checkPathDoesNotExist)
		const version = 'Version'.prompt(def.version)
		const description = 'Description'.prompt(def.description)
		const author = 'Author name'.prompt(def.author)
		const email = 'Author email'.prompt(def.email)
		const outDir = 'Output folder'.prompt(def.outDir, checkPathName)
		const srcDir = 'Source folder'.prompt(def.srcDir, checkPathName)
		const testsDir = 'Tests folder'.prompt(def.testsDir, checkPathName)
		const testNameMatch = 'Test name match'.prompt(def.testNameMatch)
		const testsTsConfigName = 'Tests tsconfig name'.prompt(def.testsTsConfigName, checkPath)

		return {
			...def,
			parentFolder,
			name,
			outDir,
			srcDir,
			testsDir,
			testNameMatch,
			testsTsConfigName,
			version,
			description,
			author,
			email
		}
	})
}
