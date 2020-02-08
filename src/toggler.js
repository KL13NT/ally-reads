function toggle(){

	browser.storage.local.get().then(({ DOMEnable, styleEnable, autoScan, ...settings }) => {
		const newStorage = {
			...settings,
			styleEnable: !styleEnable,
			DOMEnable: !DOMEnable,
			autoScan: !autoScan
		}

		browser.storage.local.set(newStorage)
	})
}

browser.browserAction.onClicked.addListener(toggle)