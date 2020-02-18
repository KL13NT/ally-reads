/* global browser */


function setBadge (){
	browser.storage.local.get().then(({ enabled, ...settings }) => {

		if(enabled) {
			browser.browserAction.setBadgeText({ text: 'ON' })
			browser.browserAction.setBadgeBackgroundColor({ color:[ 0, 255, 0, 230 ] })
		}

		else {
			browser.browserAction.setBadgeText({ text: 'OFF' })
			browser.browserAction.setBadgeBackgroundColor({ color:[ 255, 0, 0, 230 ] })
		}

	})
}
browser.runtime.onStartup.addListener(async () => {
	setBadge()
})


browser.runtime.onInstalled.addListener(async () => {
	browser.storage.local.set({
		style: {
			'font-size': 16,
			'line-height': 1.1,
			'letter-spacing': 0,
			'word-spacing': 0
		},
		styleUnits: {
			'font-size': 'px',
			'line-height': '',
			'letter-spacing': 'px',
			'word-spacing': 'px'
		},

		linesPerParagraph: 3,
		wordsPerLine: 4,

		autoScan: true,
		styleEnable: true,
		DOMEnable: true,
		enabled: true
	}).then(() => {
		setBadge()
	})
})