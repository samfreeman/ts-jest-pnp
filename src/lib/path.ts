
import path from 'path'

declare global {
	interface String {
		isValidPath(): boolean;
		isRootPath(): boolean;
		isFullPath(): boolean;
		resolvePath(...paths: string[]): string;
		appendPath(...paths: string[]): string;
		parentFolder(): string;
		pathRoot(): string;
		pathExtension(withDot?: boolean): string;
		pathName(withExtension?: boolean): string;
	}
}

const validRoot = /^([a-zA-Z]:[/\\])|[/\\]$/
const validLeg = /^[^/\\:*?"<>|]+$/
const sep = /[/\\]/g

String.prototype.isRootPath = function(): boolean {
	const p = this.valueOf()
	if (p.length < 1)
		return false
	return validRoot.test(p)
}

String.prototype.isValidPath = function(): boolean {
	const p = this.valueOf()
	if (p.length < 1)
		return false
	if (validRoot.test(p))
		return true
	if (p.isFullPath())
		return validRoot.test(p.pathRoot())
			&& p.split(sep).every(n => validLeg.test(n))
	return p.split(sep).every(n => validLeg.test(n))
}

String.prototype.isFullPath = function(): boolean {
	const p = this.valueOf()
	if (p.length < 1)
		return false
	return validRoot.test(p)
}

String.prototype.resolvePath = function(...paths: string[]): string {
	return path.resolve(this.valueOf(), ...paths)
}

String.prototype.appendPath = function(...paths: string[]): string {
	return path.join(this.valueOf(), ...paths)
}

String.prototype.parentFolder = function(): string {
	return path.dirname(this.valueOf())
}

String.prototype.pathRoot = function(): string {
	return path.parse(this.valueOf()).root
}

String.prototype.pathExtension = function(withDot = true): string {
	const result = path.extname(this.valueOf())
	return withDot
		? result
		: result.startsWith('.') ? result.substring(1) : result
}

String.prototype.pathName = function(withExtension = true): string {
	const p = this.valueOf()
	return path.basename(p, withExtension ? '' : p.pathExtension())
}
