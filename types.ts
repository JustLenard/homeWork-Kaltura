export type Headers = 'capacity' | 'monthlyPrice' | 'startDate' | 'endDate'

export type RawJson = Record<Headers, string>

export type ParsedData = {
	capacity: number
	monthlyPrice: number
	startDate: Date
	endDate: Date
}
