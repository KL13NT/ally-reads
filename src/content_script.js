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
			'line-height': 'px',
			'letter-spacing': 'px',
			'word-spacing': 'px',
		},

		linesPerParagraph: 3,
		wordsPerLine: 8,

		autoScan: true,
		styleEnable: true,
		DOMEnable: true
	},

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
		//TODO: grab all paragraph elements and compare them with the already tracked ones
		if(JSON.stringify(newState) === JSON.stringify(this.state)) return false
		return true
	}

	updateState(newState){
		this.state = { ...this.state, ...newState }

		this.reformatDOM()
	}

	/**
	 * Formats according to settings
	 * @param {DOMNode.TextContent} textContent Text content of paragraphs
	 */
	formatParagraph(textContent){
		const { wordsPerLine, linesPerParagraph } = this.settings
		// text content could be a paragraph
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

	reformatDOM(){
		this.state.trackedElements.forEach(node => {
			if(this.settings.DOMEnable) node.innerHTML = this.formatParagraph(node.innerHTML)
			if(this.settings.styleEnable) node.classList.add('ally-reads_improved_reading')
		})
	}

	scanDOM(){
		const newTrackingList = Array.from(document.getElementsByTagName('p'))
		this.setState(newTrackingList)

		//REFACTORME: Might be a potential loss of performance here. The DOM may have 1 mutations and instead of capturing one, I capture two times.
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
	 * Defers and updates state in an immutable fashion. Makes sure state is only changed when needed
	 */
	setState(newTrackingList){
		const newState = {
			trackedElements: [...this.state.trackedElements, ...newTrackingList]
		}

		if(this.shouldUpdate(newState)) this.updateState(newState)
	}
}


window.addEventListener('load', ()=>{
	setTimeout(async () => {

		const options = await browser.storage.local.get()
		const mod = new DOMManipulator(options)
		if(options.autoScan) mod.scanDOM()

	}, 3000)
	console.log(`called constrcutor`)
})



function parseAndAttachCSS(settings){
		const { style, styleUnits } = settings
		//TODO: perhaps use a new Stylesheet node OR explicitly define properties for each paragraph.
		//New stylesheet is prolly more performant
		const newStylesheet = document.createElement('style')
		newStylesheet.type = 'text/css'

		newStylesheet.innerHTML = `.ally-reads_improved_reading{\n`

		for(const key in style){
			if(style[key] > 0) newStylesheet.innerHTML += `${key}: ${style[key]}${styleUnits[key]};\n`
		}
		newStylesheet.innerHTML += `}`

		document.getElementsByTagName('head')[0].appendChild(newStylesheet)
		// create utility classes and add them to elements on the fly
		// newStylesheet add settings
		// append
}