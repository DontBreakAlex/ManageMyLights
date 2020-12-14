import getEnv from './getEnvOrThrow.ts'

const cookie = getEnv("KISMET_COOKIE")
const host = Deno.env.get("KISMET_HOST") || "127.0.0.1"
const port = Deno.env.get("KISMET_PORT") || "2501"
const macs = getEnv("PHONE_MACS").split(',')

const fields = [
	["kismet.device.base.macaddr", "mac"],
	["kismet.device.base.signal/kismet.common.signal.last_signal", "signal"],
	["kismet.device.base.last_time", "last_seen"]
]

const params = new URLSearchParams(`json=${JSON.stringify({fields})}`);

async function phoneIsPresent() {
	const resp = await fetch(`http://${host}:${port}/devices/views/all/devices.json`, {
		method: 'POST',
		body: params,
		headers: {
			'Cookie': `KISMET=${cookie}`,
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		}
	})
	const json = await resp.json()
	const clients = json.filter(elem => macs.includes(elem.mac)).sort((a, b) => b.last_seen - a.last_seen)
	console.log(Date.now() / 1000 - clients[0].last_seen, clients[0].signal)
	return clients[0] && clients[0].signal >= -65 && (Date.now() / 1000 - clients[0].last_seen) <= 120 ? true : false
}

export default phoneIsPresent
