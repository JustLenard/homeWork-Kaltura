import { ParsedData, RawJson } from './types'

const fs = require('fs')
const csv = require('csv-parser')

/**
 * Read and parse CSV
 **/
export const parseCSV = async (fileName = 'data.csv') => {
	return new Promise<ParsedData[]>((resolve, reject) => {
		const results: ParsedData[] = []

		fs.createReadStream(fileName)
			.pipe(
				csv({
					headers: ['capacity', 'monthlyPrice', 'startDate', 'endDate'],
					skipLines: 1,
				})
			)
			.on('data', (data: RawJson) => {
				const cleanedData: ParsedData = {
					capacity: parseInt(data.capacity),
					monthlyPrice: parseInt(data.monthlyPrice),
					startDate: new Date(data.startDate),
					endDate: data.endDate ? new Date(data.endDate) : new Date(),
				}
				results.push(cleanedData)
			})
			.on('end', () => {
				resolve(results)
			})
			.on('error', (error: Error) => {
				reject(error)
			})
	})
}