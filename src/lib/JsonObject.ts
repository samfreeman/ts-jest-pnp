
export type JsonValue = string | number | boolean | null
export type JsonObject = { [key: string]: JsonValue | JsonValue[] | JsonObject | JsonObject[] }

export const isJsonObject = (value: unknown): value is JsonObject =>
	!!value && typeof value == 'object' && !Array.isArray(value)
