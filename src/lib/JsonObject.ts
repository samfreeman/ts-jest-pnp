
export type JsonValue = string | number | boolean | null
export interface JsonObject {
	[key: string]: JsonValue | JsonObject | (JsonValue | JsonObject)[]
}

export const isJsonObject = (value: unknown): value is JsonObject =>
	!!value && typeof value == 'object' && !Array.isArray(value)

const identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/
const jsonField = /^(\s*)"(.*)": (.*)$/
const jsonValue = /^(\s*)(.*)$/
export const toTs = (json: JsonObject, tab: number | string = '\t'): string[] => {
	const indent = typeof tab == 'number' ? ' '.repeat(tab) : tab
	const lines = JSON.stringify(json, null, 2).split(/\r?\n/g).slice(1, -1)
	return lines.map(line => {
		let spaces = ''
		let key: string | undefined = undefined
		let value = ''
		let match = jsonField.exec(line)
		if (match) {
			spaces = match.at(1) ?? ''
			key = match.at(2) ?? ''
			value = match.at(3) ?? ''
		}
		else {
			match = jsonValue.exec(line)
			if (match) {
				spaces = match.at(1) ?? ''
				value = match.at(2) ?? ''
			}
		}
		spaces = indent.repeat(spaces.length / 2)
		value = value.replace(/"/g, '\'')
		if (key){
			if (!identifier.test(key))
				key = `'${key}'`
			return `${spaces}${key}: ${value}`
		}
		return `${spaces}${value}`
	})
}
