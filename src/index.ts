#! /usr/bin/env node

import './lib/log'
import './lib/path'
import './lib/file'

import { getTsProjectConfig } from './getTsProjectConfig'
import { createTsProject } from './createTsProject'

const rootFolder = __dirname.parentFolder()
const pkgJson = JSON.parse(rootFolder.appendPath('package.json').readFile())
const version = pkgJson.version ?? '1.0.0'

'-- Create TypeScript Project --'.log()
'-- Version'.log(version)
''.log()
'Press Ctrl+C at any time to exit'.log()
''.log()

const config = getTsProjectConfig()
const prjFolder = config.parentFolder.appendPath(config.name).resolvePath()

''.log()
''.log(`-- Creating project at '${prjFolder}'...`)
''.log()

prjFolder.createFolder().useFolder(() => {
	createTsProject(config)
})
