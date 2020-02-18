/* eslint-env browser */
/* global browser */

function toggle (){

	browser.storage.local.get().then(({ enabled, ...settings }) => {
		const newStorage = {
			...settings,
			enabled: !enabled
		}

		browser.storage.local.set(newStorage)

		if(newStorage.enabled) {
			browser.browserAction.setBadgeText({ text: 'ON' })
			browser.browserAction.setBadgeBackgroundColor({ color:[ 0, 255, 0, 230 ] })
		}
		if(!newStorage.enabled) {
			browser.browserAction.setBadgeText({ text: 'OFF' })
			browser.browserAction.setBadgeBackgroundColor({ color:[ 255, 0, 0, 230 ] })
		}
	})
}

browser.browserAction.onClicked.addListener(toggle)