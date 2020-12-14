import { shouldBeOn, getNextOn } from './timeManager.ts'
import phoneIsPresent from './lookForPhone.ts'
import { turnLightOn, turnLightOff } from './light.ts'

async function manage() {
	let timeout: number
	if (shouldBeOn()) {
		timeout = 10000
		if (await phoneIsPresent())
			turnLightOn()
		else
			turnLightOff()
	} else {
		timeout = getNextOn().getTime() - Date.now()
		turnLightOff()
		console.log(`Sleeping until ${getNextOn()}...`)
	}
	setTimeout(manage, timeout)
}

manage()

export {}
