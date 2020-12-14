import { request } from './tuyaInterface.ts'
import getEnv from './getEnvOrThrow.ts'

const devId = getEnv("TUYA_DEVID")
let isLightOn: boolean = false

await request('QueryDevice', 'query', devId).then(resp => {
	if (resp.header.code != 'SUCCESS')
		throw new Error(`Could not find device with id ${devId}`)
	if (!resp.payload.data.online)
		throw new Error(`Device with id ${devId} is offline`)
	isLightOn = resp.payload.data.state
})

export function turnLightOn() {
	if (!isLightOn) {
		request('turnOnOff', 'control', devId, '1')
		isLightOn = true
	}
}

export function turnLightOff() {
	if (isLightOn) {
		request('turnOnOff', 'control', devId, '0')
		isLightOn = false
	}
}
