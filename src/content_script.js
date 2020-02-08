/* eslint-env browser, webextensions */

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

/**
 * Extension settings custom schema
 * @typedef {array} MutationList
 * @property {MutationRecord} MutationRecord defines style values
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
			'word-spacing': 'px'
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

		try{
			if(
				Object.keys(style).length !== Object.keys(schemaStyle).length
				|| Object.keys(styleUnits).length !== Object.keys(schemaStyleUnits).length
				|| Object.keys(pluginSettings).length !== Object.keys(schemaSettings).length
			) return false

			return true
		}
		catch(err){
			return false
		}
	}
}

/**
 * @property {boolean} observationEnabled
 * @property {ExtensionSettings} settings
 * @property {ExtensionSettings} settings
 */
class DOMManipulator{
	/**
	 * @param {ExtensionSettings} settings
	 */
	constructor (settings){
		this.state = {
			trackedElements: []
		}

		if(!OptionsSchema.verifySchema(settings))
			throw Error ('Settings passed to DOMManipulator does not match schema')

		this.settings = { ...settings }
		this.observationEnabled = false
		this.currentURL = null

		this.toggleObservation = this.toggleObservation.bind(this)

		parseAndAttachCSS(this.settings)
	}

	/**
	 *
	 * @param {DOMTree} newDOM
	 * @param {DOMTree} oldDOM
	 */
	shouldUpdate (newState){
		if(JSON.stringify(newState) === JSON.stringify(this.state)) return false
		return true
	}


	/**
	 * Formats paragraphs according to settings
	 * @param {HTMLElement} node Text content of paragraphs
	 */
	formatNode (node){
		const { wordsPerLine, linesPerParagraph } = this.settings

		//TODO: use an HTML parser to parse the DOM tree properly and replace inner text instead of inner children as a whole.
		node.childNodes.forEach( node => {
			if(node.nodeType === 3){
				const textContent = node.textContent || ''

				let wordCounter = 0
				let lineCounter = 1

				node.textContent = textContent.split(/\s/g).reduce((final, word) => {
					if(wordCounter++ < wordsPerLine) return final + word + ' '
					else {
						wordCounter = 1

						if(lineCounter++ < linesPerParagraph) return final + '\r\n' + word + ' '

						else {
							lineCounter = 1
							return final + '\r\n\r\n' + word + ' '
						}

					}
				}, '')
			}
		})

	}

	/**
	 * Uses the list of currently tracked <p> tags and formats them according to settings
	 */
	reformatDOM (){
		this.state.trackedElements.forEach(node => {
			if(this.settings.DOMEnable) this.formatNode(node)
			if(this.settings.styleEnable) node.classList.add('ally-reads_improved_reading')
		})

		setTimeout(this.toggleObservation, 1000)
	}

	//BUG: the observer catches modifications made by the extension itself.
	/**
	 * Observation handler
	 * @param {array} mutationList - Array of MutationRecord's
	 */

	observe (mutationList){
		//REFACTORME: Use a better detection model

		if(this.observationEnabled || window.location.href !== this.currentURL){
			if(this.observationEnabled) this.toggleObservation()

			setTimeout(() => {
				for(const mutation of mutationList){
					//Updating the tracking list will get the latest result regardless of current index in the iteration loop.

					if(mutation.type === 'childList') {

						this.setState({
							...this.state,
							trackedElements: this.getNewTrackingList()
						})

						this.reformatDOM()

						break
					}
				}
			}, 2000) // scans the dom after 2 second of detecting mutation. This is to avoid wasted scans.

		}
	}

	/**
	 * Gets the new tracking list based on whether it's the same page
	 * @returns {array} array of HTMLElement
	 */

	getNewTrackingList (){
		if(window.location.href === this.currentURL){
			return Array
				.from(document.querySelectorAll('p'))
				.slice(this.state.trackedElements.length)
		}
		else return Array.from(document.querySelectorAll('p'))
	}

	/**
	 * Toggles the observation handler
	 */
	toggleObservation (){
		this.observationEnabled = !this.observationEnabled
	}

	/**
	 * Scans the DOM for <p> tags and listens for changes to the dom. Uses MutationObserver to check for DOM mutations and an interval for older browsers.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver|Mutation Observer - MDN}
	 */
	scanDOM (){
		const newTrackingList = this.getNewTrackingList()
		this.setState({ ...this.state, trackedElements: newTrackingList })
		this.reformatDOM()

		if(window.MutationObserver){
			// calling using observe.call instead of direct to avoid setting MutationObserver as `this` for the handler.
			const observer = new MutationObserver(mutationList => this.observe.call(this, mutationList))
			observer.observe(document.querySelector('body'), { subtree: true, childList: true })

		}
		else {
			setInterval(() => {

				this.setState({
					...this.state,
					trackedElements: this.getNewTrackingList()
				})
				this.reformatDOM()

			}, 5000)
		}

	}

	/**
	 * Defers and updates state
	 * @param {array} newTrackingList A new list of <p> tags
	 */
	setState (nextState){
		if(this.shouldUpdate(nextState)){
			this.state = { ...nextState }
		}
	}
}

/**
 * Starts the extension content_script after a timeout. The timeout here is used to avoid expensive wasted scans for browsers that support MutationObserver.
 * @see {@link scanDOM}
 */
function start (){
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
function parseAndAttachCSS (settings){
	const { style, styleUnits } = settings

	const newStylesheet = document.createElement('style')
	newStylesheet.type = 'text/css'

	newStylesheet.innerHTML = '.ally-reads_improved_reading{\n'

	for(const key in style){
		if(style[key] > 0) newStylesheet.innerHTML += `${key}: ${style[key]}${styleUnits[key]} !important;\n`
	}

	newStylesheet.innerHTML += '}'

	document.getElementsByTagName('head')[0].appendChild(newStylesheet)
}


window.addEventListener('load', () => {
	start()
})

//TESTING: uncomment this line when testing
// module.exports = { DOMManipulator, OptionsSchema, parseAndAttachCSS }