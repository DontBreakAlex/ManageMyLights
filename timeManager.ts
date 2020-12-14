import { getSunrise, getSunset } from "https://raw.githubusercontent.com/udivankin/sunrise-sunset/master/src/index.ts";
import { endOfDay, isWithinInterval, addDays, isPast, isAfter, isBefore } from 'https://deno.land/x/date_fns@v2.15.0/index.js'

let lat: number
let long: number
let sunrise: Date
let sunset: Date
let start: Date
let end: Date

if (Deno.env.get("LAT_LONG")) {
	[lat, long] = Deno.env.get("LAT_LONG")!.split(",").map((string) => parseFloat(string))
	sunrise = getSunrise(lat, long)
	sunset = getSunset(lat, long)
} else {
    throw new Error("LAT_LONG not set")
}

start = new Date()
start.setHours(8, 40)
end = endOfDay(new Date())

function updateDates(): void {
	if (isPast(sunrise))
		sunrise = getSunrise(lat, long, addDays(sunrise, 1))
	if (isPast(start))
		start = addDays(start, 1)
	if (isPast(end)) {
		end = addDays(end, 1)
		sunset = getSunset(lat, long, addDays(sunset, 1))
	}
}

function shouldBeOn(): boolean {
	updateDates()
	if (isAfter(sunrise, start) && isWithinInterval(new Date(), { start, end: sunrise }))
		return true
	if (isWithinInterval(new Date(), { start: sunset, end }))
		return true
	return false
}

function getNextOn(): Date {
	return isBefore(start, sunset) ? start : sunset
}

export { shouldBeOn, getNextOn }
