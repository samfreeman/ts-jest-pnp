#! /usr/bin/env node

import './lib/log'
import './lib/path'
import './lib/file'

import { getTsProjectConfig } from './getTsProjectConfig'
import { createTsProject } from './createTsProject'


'-- Create TypeScript Project --'.log()
'-- Version 1.0.0'.log()
''.log()

const config = getTsProjectConfig()

const prjFolder = config.name.resolvePath()

''.log()
''.log(`-- Creating project at '${prjFolder}'...`)
''.log()

prjFolder.createFolder().useFolder(() => {
	createTsProject(config)
})
