/* eslint-env browser, webextensions */

import './types.d'
import { ExtensionSettings } from './content/options'




/**
 * @property {boolean} observationEnabled
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

		this.settings = new ExtensionSettings(settings)

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
	formatNode (htmlNode){
		const { wordsPerLine, linesPerParagraph } = this.settings

		htmlNode.childNodes.forEach( node => {
			// if(node.nodeType !== 3) return this.formatNode(node)
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
							return final + '\r\n \r\n' + word + ' '
						}

					}
				}, '')

				htmlNode.setAttribute('style', 'white-space: pre-line !important;')
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
	 * @param {MutationList} mutationList - Array of MutationRecord's
	 */

	observe (mutationList){
		if(this.settings.enabled){
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
			//REFACTORME: Use a better detection model


		}
	}

	/**
	 * Gets the new tracking list based on whether it's the same page
	 * @returns {HTMLElement[]} array of HTMLElement
	 */

	getNewTrackingList (){
		if(window.location.href === this.currentURL){

			return Array
				.from(document.querySelectorAll('p'))
				.slice(this.state.trackedElements.length)
		}
		else {
			this.currentURL = window.location.href
			return Array.from(document.querySelectorAll('p'))
		}
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
	 * @param {HTMLElement[]} newTrackingList A new list of <p> tags
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

		if(options.enabled){
			const mod = new DOMManipulator(options)

			if(options.autoScan) mod.scanDOM()

			window.addEventListener('keypress', () => {
				mod.settings.enabled = false

				setTimeout(() => {
					mod.settings.enabled = true
				}, 5000)
			})
		}


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

	newStylesheet.innerHTML = '.ally-reads_improved_reading, .ally-reads_improved_reading *{\n'

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