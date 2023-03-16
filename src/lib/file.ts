
import os from 'os'
import fs from 'fs'

import { JsonObject } from './JsonObject'
import './path'

export type File = string
export interface Folder { [name: string]: File | Folder }

export const folder = (f?: Folder): Folder => f ?? {}
export const file = (text: string | string[] | JsonObject | undefined, tab: number|string='\t'): File => {
	if (!text)
		return ''
	if (typeof text == 'string'){
		const indent = typeof tab == 'number' ? ' '.repeat(tab) : tab
		return text
			.replace(/\r?\n/g, os.EOL)
			.replace(/\t/g, indent)
	}
	if (Array.isArray(text))
		return file(text.join('\n') + '\n')
	return file(JSON.stringify(text, null, tab) + '\n')
}

declare global {
	interface String {
		eol: string;
		currentFolder(): string;
		pathExists(): boolean;
		isFile(): boolean;
		isFolder(): boolean;
		deletePath(): string;
		readFile(): string;
		writeFile(content: string): void;
		appendFile(content: string): void;
		readFolder(recursive?: boolean): string[];
		createFolder(f?: Folder): string;
		useFolder<T>(fn: () => T): T;
	}
}

String.prototype.eol = os.EOL

String.prototype.currentFolder = function(): string {
	return process.cwd()
}

String.prototype.pathExists = function(): boolean {
	return fs.existsSync(this.valueOf())
}

String.prototype.isFile = function(): boolean {
	const p = this.valueOf()
	return p.pathExists() && fs.statSync(p).isFile()
}

String.prototype.isFolder = function(): boolean {
	const p = this.valueOf()
	return p.pathExists() && fs.statSync(p).isDirectory()
}

String.prototype.deletePath = function(): string {
	const p = this.valueOf()
	if (p.isFile())
		fs.rmSync(p)
	else if (p.isFolder())
		fs.rmSync(p, { recursive: true, force: true })
	return p
}

String.prototype.readFile = function(): string {
	return fs.readFileSync(this.valueOf(), 'utf8')
}

String.prototype.writeFile = function(content: string): void {
	fs.writeFileSync(this.valueOf(), content)
}

String.prototype.appendFile = function(content: string): void {
	fs.appendFileSync(this.valueOf(), content)
}

String.prototype.readFolder = function(recursive: boolean): string[] {
	const p = this.valueOf()
	if (!p.isFolder())
		return []
	const entries = fs.readdirSync(p, { withFileTypes: true })
		.filter(e => e.isFile() || e.isDirectory())
	if (!recursive)
		return entries.map(f => f.name)
	return entries.map(e => 
		e.isFile()
			? e.name
			: p.appendPath(e.name).readFolder(true))
		.flat()
}

String.prototype.createFolder = function(f?: Folder): string {
	const p = this.valueOf()
	if (!p.isFolder())
		fs.mkdirSync(p, { recursive: true })
	if (!f)
		return p
	for (const name in f){
		const item = f[name]
		if (typeof item == 'string')
			p.appendPath(name).writeFile(item)
		else
			p.appendPath(name).createFolder(item)
	}
	return p
}

String.prototype.useFolder = function<T>(fn: () => T): T {
	const p = this.valueOf()
	const cwd = process.cwd()
	process.chdir(p)
	try {
		return fn()
	} finally {
		process.chdir(cwd)
	}
}
