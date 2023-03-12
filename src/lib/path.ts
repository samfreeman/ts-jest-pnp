
import path from 'path'

declare global {
	interface String {
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

String.prototype.isRootPath = function(): boolean {
	const p = this.valueOf()
	if (p.length < 1)
		return false
	return p == '/'
		|| p == '\\'
		|| /^[a-zA-Z]:(?:[/]|\\)?$/.test(p)
}

String.prototype.isFullPath = function(): boolean {
	const p = this.valueOf()
	if (p.length < 1)
		return false
	return p.startsWith('/')
		|| p.startsWith('\\')
		|| /^[a-zA-Z]:(?:[/]|\\)/.test(p)
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
