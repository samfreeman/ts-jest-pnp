
import promptFn from 'prompt-sync'

const readLine = promptFn({ sigint: true })

type CheckFn = (n: string, v: string) => string

declare global {
	interface String {
		prompt(
			defaultValueOrCheckFn?: string | CheckFn,
			checkFnOrPostfix?: CheckFn | string,
			postfix?: string): string
		ask(
			defaultValueOrCheckFn?: string | CheckFn,
			checkFnOrPostfix?: CheckFn | string,
			postfix?: string): string
	}
}

const invalid = '<error>'

String.prototype.prompt = function (
	defaultValueOrCheckFn?: string | CheckFn,
	checkFnOrPostfix?: CheckFn | string,
	postfix = ': '
): string {
	const defValue = typeof defaultValueOrCheckFn == 'string'
		? defaultValueOrCheckFn
		: ''
	const checkFn: CheckFn = typeof defaultValueOrCheckFn == 'function'
		? defaultValueOrCheckFn
		: typeof checkFnOrPostfix == 'function'
			? checkFnOrPostfix
			: (n: string, v: string) => v
	postfix = typeof checkFnOrPostfix == 'string'
		? checkFnOrPostfix
		: postfix

	let answer = invalid
	const ask = `${this.valueOf()}${defValue ? ` (${defValue})`: ''}${postfix}`
	while (answer == invalid) {
		try{
			answer = checkFn(
				this.valueOf(),
				readLine(ask) || defValue)
		}
		catch (x) {
			if (x instanceof Error)
				console.log(x.message)
			else
				console.log(x)
			answer = invalid
		}
	}
	return answer
}

String.prototype.ask = function (
	defaultValueOrCheckFn?: string | CheckFn,
	checkFnOrPostfix?: CheckFn | string,
	postfix?: string
): string {
	return this.prompt(defaultValueOrCheckFn, checkFnOrPostfix, postfix)
}
