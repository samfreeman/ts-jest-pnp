
import 'path'

declare global {
	interface String {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		log(msg?: any, ...others: any[]): void
	}

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
String.prototype.log = function (msg?: any, ...others: any[]): void {
	const args = msg && others.length > 0
		? [this.valueOf(), msg, ...others]
		: msg
			? [this.valueOf(), msg]
			: [this.valueOf()]
	console.log(...args)
}
