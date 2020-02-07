function toggle(){
	console.log(`toggling!`)
	browser.storage.local.get().then(settings=> {
		browser.storage.local.set({
			...settings, !DOMEnable, !styleEnable
		})
	})
}

browser.browserAction.onClicked.addListener(toggle)