import { parseCSV } from './parseCSV'
import { ParsedData } from './types'
import { getDaysInMonth } from './utils'

const consoleArg: string | undefined = process.argv[2]

const monthToCheck = consoleArg ?? '2018-01'
const parsedData: ParsedData[] = await parseCSV()

const calcultateRevenue = (rezervations: ParsedData[], targetMonth: string) => {
	const [year, month] = targetMonth.split('-')
	const daysInMonth = getDaysInMonth(Number(year), Number(month))
	const targetMonthStart = new Date(targetMonth)
	const targetMonthEnd = new Date(
		targetMonthStart.getFullYear(),
		targetMonthStart.getMonth() + 1,
		0
	)

	let totalRevenue = 0
	let totalUnreservedCapacity = 0

	rezervations.forEach((rezervation) => {
		const startDateMonth = new Date(
			`${rezervation.startDate.getFullYear()}-${rezervation.startDate.getMonth() + 1}-01`
		)

		/**
		 * Check if dates overlap
		 **/
		if (targetMonthStart >= startDateMonth && targetMonthStart <= rezervation.endDate) {
			let daysReserved = daysInMonth
			/**
			 * If rezervation doesn't start on the first of the month, substract from days reserved
			 **/
			if (targetMonthStart < rezervation.startDate) {
				daysReserved -= rezervation.startDate.getDate()
			}
			/**
			 * If rezervation last the whole month, substract from days reserved
			 **/
			if (rezervation.endDate <= targetMonthEnd) {
				daysReserved -= daysInMonth - rezervation.endDate.getDate()
			}

			/**
			 * Calcultae revenue based on reserved days in the month
			 **/
			if (daysReserved === daysInMonth) {
				totalRevenue += rezervation.monthlyPrice
			} else {
				totalRevenue += Number(
					((rezervation.monthlyPrice / daysInMonth) * daysReserved).toFixed(2)
				)
			}
		} else {
			totalUnreservedCapacity += rezervation.capacity
		}
	})

	return { totalRevenue, totalUnreservedCapacity }
}

const { totalRevenue, totalUnreservedCapacity } = calcultateRevenue(parsedData, monthToCheck)

console.log(
	`${monthToCheck}: expected revenue: $${totalRevenue.toLocaleString()}, expected total capacity of the unreserved offices: ${totalUnreservedCapacity}`
)
