import { isPast } from 'https://deno.land/x/date_fns@v2.15.0/index.js'
import getEnv from './getEnvOrThrow.ts'

type TuyaToken = {
	access_token: string
	refresh_token: string
	token_type: "bearer"
	expires_in: number
	expires_at: Date
}

async function getToken(): Promise<TuyaToken> {
	const params = new URLSearchParams()
	params.append('userName', getEnv('TUYA_USER'))
	params.append('password', getEnv('TUYA_PASS'))
	params.append('countryCode', Deno.env.get('TUYA_COUNTRY') || '33')
	params.append('bizType', 'smart_life')
	params.append('from', 'tuya')
	
	const resp = await fetch('https://px1.tuyaeu.com/homeassistant/auth.do', {
		method: 'POST',
		body: params,
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	})
	const json = await resp.json()
	json.expires_at = new Date(Date.now() + json.expires_in * 1000)
	console.log(json)
	return json
}
	
let token: TuyaToken = { access_token: "", refresh_token: "", token_type: "bearer", expires_in: 0, expires_at: new Date(0) }

export async function request(name, namespace, devId?, value?) {
	if (isPast(token.expires_at))
		token = await getToken()

	const resp = await fetch('https://px1.tuyaeu.com/homeassistant/skill', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			header: { name, namespace, payloadVersion: 1 },
			payload: {
				accessToken: token.access_token,
				value,
				devId
			}
		})
	})
	const json = await resp.json()
	console.log(json)
	return json
}
