
export type JsonValue = string | number | boolean | null
export interface JsonObject {
	[key: string]: JsonValue | JsonObject | (JsonValue|JsonObject)[] 
}

export const isJsonObject = (value: unknown): value is JsonObject =>
	!!value && typeof value == 'object' && !Array.isArray(value)
