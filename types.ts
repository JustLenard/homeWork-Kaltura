export type Rows = 'capacity' | 'monthlyPrice' | 'startDate' | 'endDate'

export type RawJson = Record<Rows, string>

export type ParsedData = {
	capacity: number
	monthlyPrice: number
	startDate: Date
	endDate: Date
}
