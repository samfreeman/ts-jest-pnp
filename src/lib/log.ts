
import 'path'

declare global {
	interface String {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		log(msg?: any, ...others: any[]): void
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
String.prototype.log = function (msg?: any, ...others: any[]): void {
	console.log(this.valueOf(), msg, ...others)
}
