/**
 * Extension settings custom schema
 * @typedef {Object} ExtensionSettings
 * @property {object} style defines style values
 * @property {number} style.font-size
 * @property {number} style.line-height
 * @property {number} style.letter-spacing
 * @property {number} style.word-spacing
 * @property {object} styleUnits defines style units
 * @property {string} styleUnits.font-size
 * @property {string} styleUnits.line-height
 * @property {string} styleUnits.letter-spacing
 * @property {string} styleUnits.word-spacing
 * @property {number} linesPerParagraph lines per paragraph
 * @property {number} wordsPerLine words per line
 * @property {boolean} autoScan auto scan page for p tags
 * @property {boolean} styleEnable enables style modifications
 * @property {boolean} DOMEnable enables dom modifications
 */


const OptionsSchema = {
	schema: {
		style: {
			'font-size': 16,
			'line-height': 0,
			'letter-spacing': 0,
			'word-spacing': 0
		},
		styleUnits: {
			'font-size': 'px',
			'line-height': '',
			'letter-spacing': 'px',
			'word-spacing': 'px',
		},

		linesPerParagraph: 3,
		wordsPerLine: 8,

		autoScan: true,
		styleEnable: true,
		DOMEnable: true
	},

	/**
	 * Enforces a schema for the extension's settings
	 * @param {ExtensionSettings} settings Settings object
	 */
	verifySchema: function ({ style, styleUnits, ...pluginSettings }){
		const { style: schemaStyle, styleUnits: schemaStyleUnits, ...schemaSettings } = this.schema

		if(
			Object.keys(style).length !== Object.keys(schemaStyle).length
			|| Object.keys(styleUnits).length !== Object.keys(schemaStyleUnits).length
			|| Object.keys(pluginSettings).length !== Object.keys(schemaSettings).length
		) return false

		return true
	}
}


class DOMManipulator{
	/**
	 *
	 * @param {ExtensionSettings} settings
	 */
	constructor(settings){
		this.state = {
			trackedElements: []
		}

		//TODO: idek, instead of throwing, maybe use defaults?
		if(!OptionsSchema.verifySchema(settings))
			throw Error ('Settings passed to DOMManipulator does not match schema')

		this.settings = { ...settings }

		parseAndAttachCSS(this.settings)
	}

	/**
	 * Parses the settings and sets them as state
	 * @param {object} settings Extension's settings set by user
	 */


	/**
	 *
	 * @param {DOMTree} newDOM
	 * @param {DOMTree} oldDOM
	 */
	shouldUpdate(newState){
		if(JSON.stringify(newState) === JSON.stringify(this.state)) return false
		return true
	}

	/**
	 * Updates the state of the DOMManipulator using the new tracking list
	 * @param {object} newState updated state
	 */
	updateState(newState){
		this.state = { ...this.state, ...newState }

		this.reformatDOM()
	}

	/**
	 * Formats paragraphs according to settings
	 * @param {string} textContent Text content of paragraphs
	 */
	formatText(textContent){
		const { wordsPerLine, linesPerParagraph } = this.settings

		let wordCounter = 0
		let lineCounter = 0

		const modifiedParagraph = textContent.split(/\s/g).reduce((final, word) => {
			if(wordCounter++ < wordsPerLine) return final + word + ' '
			else {
				wordCounter = 0

				if(lineCounter++ < linesPerParagraph - 1) return final + '<br>' + word + ' '

				else {
					lineCounter = 0
					return final + '<br><br>' + word + ' '
				}

			}
		}, '')

		return modifiedParagraph.trim()
	}

	/**
	 * Uses the list of currently tracked <p> tags and formats them according to settings
	 */
	reformatDOM(){
		this.state.trackedElements.forEach(node => {
			if(this.settings.DOMEnable) node.innerHTML = this.formatText(node.innerHTML)
			if(this.settings.styleEnable) node.classList.add('ally-reads_improved_reading')
		})
	}

	/**
	 * Scans the DOM for <p> tags and listens for changes to the dom. Uses MutationObserver to check for DOM mutations and an interval for older browsers.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver|Mutation Observer - MDN}
	 */
	scanDOM(){
		const newTrackingList = Array.from(document.getElementsByTagName('p'))
		this.setState(newTrackingList)

		if(window.MutationObserver){
			const observer = new MutationObserver(mutationList => {
				for(const mutation of mutationList){
					//Updating the tracking list will get the latest result regardless of current index in the iteration loop.

					if(mutation.type === 'childList') {
						//REFACTORME: Could use some tree-based algorithm to search the DOM for added `p` nodes instead of scanning the whole DOM again

						const newTrackingList = Array.from(document.getElementsByTagName('p'))
						this.setState(newTrackingList)

						break
					}
				}
			})

			observer.observe(document.querySelector('body'), { subtree: true, childList: true })
		}
		else {
			setInterval(()=>{
				const newTrackingList = Array.from(document.getElementsByTagName('p'))
				this.setState(newTrackingList)
			}, 5000)
		}

	}

	/**
	 * Defers and updates state
	 * @param {array} newTrackingList A new list of <p> tags
	 */
	setState(newTrackingList){
		const newState = {
			trackedElements: [...this.state.trackedElements, ...newTrackingList]
		}

		if(this.shouldUpdate(newState)) this.updateState(newState)
	}
}

/**
 * Starts the extension content_script after a timeout. The timeout here is used to avoid expensive wasted scans for browsers that support MutationObserver.
 * @see {@link scanDOM}
 */
function start(){
	setTimeout(async () => {

		const options = await browser.storage.local.get()
		const mod = new DOMManipulator(options)

		if(options.autoScan) mod.scanDOM()

	}, 3000)
}


/**
 * Parses extension settings and creates a new stylesheet before attaching it to the DOM
 * @param {ExtensionSettings} settings
 */
function parseAndAttachCSS(settings){
	const { style, styleUnits } = settings

	const newStylesheet = document.createElement('style')
	newStylesheet.type = 'text/css'

	newStylesheet.innerHTML = `.ally-reads_improved_reading{\n`

	for(const key in style){
		if(style[key] > 0) newStylesheet.innerHTML += `${key}: ${style[key]}${styleUnits[key]};\n`
	}

	newStylesheet.innerHTML += `}`

	document.getElementsByTagName('head')[0].appendChild(newStylesheet)
}


window.addEventListener('load', ()=>{
	start()
})