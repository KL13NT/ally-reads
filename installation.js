browser.runtime.onInstalled.addListener(async ({ reason, temporary }) => {
	browser.storage.local.set({
		style: {
			'font-size': 16,
			'line-height': 1.1,
			'letter-spacing': 0,
			'word-spacing': 0
		},
		styleUnits: {
			'font-size': 'px',
			'line-height': 'px',
			'letter-spacing': 'px',
			'word-spacing': 'px',
		},

		linesPerParagraph: 3,
		wordsPerLine: 8,

		autoScan: true,
		styleEnable: true,
		DOMEnable: true
	})
})