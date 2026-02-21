export const stringifyWithoutQuotes = (value: any) => {
	if (typeof value === 'string') return value
	return JSON.stringify(value)
}
