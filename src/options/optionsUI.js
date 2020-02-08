const selectors = document.querySelectorAll('.c-input--range')
const checks = document.querySelectorAll('.c-input--check')
const textSample = document.querySelector('#text-sample')
/**
 * Updates selector values
 * @param {HTMLElement} selector
 * @param {object} storage destructured storage data
 */
function updateSelectorValue(selector, { style, styleUnits, ...settings }){
	if(determineNodeType(selector.children[1])) selector.children[1].checked = settings[selector.children[1].name]
	selector.children[1].value = style[selector.children[1].name]
}

/**
 * Sets defaults upon settings page load
 * @param {object} storage
 */
function updateVisualDefaults(storage){
	selectors.forEach(element => {
		updateSelectorValue(element, storage)
		updateValueDisplay(element)
		updatePreview(storage)
	})

	checks.forEach(element => {
		updateSelectorValue(element, storage)
		updateValueDisplay(element)
		updatePreview(storage)
	})
}

/**
 * returns true if checkbox
 * @param {HTMLElement} node
 * @returns {boolean} indicating if type is checkbox
 */
function determineNodeType(node){
	//REFACTORME: perhaps directly use type instead?
	return node.type === 'checkbox'
}

/**
 * Updates StorageArea with new settings
 * @async
 * @param {HTMLElement} updatedSelector element which value has changed
 */
async function updateStorage(updatedSelector){
	const selector = updatedSelector.children[1]
	const { value, checked, name } = updatedSelector.children[1]

	const oldStorage = await browser.storage.local.get()

	if(determineNodeType(selector))
		await browser.storage.local.set({
			...oldStorage,
			[name]: checked
		})

	else await browser.storage.local.set({
		...oldStorage,
		style: {
			...oldStorage.style, [name]: value
		}
	})

	updatePreview(await browser.storage.local.get())
}


/**
 * Updates the value textual display next to range selectors
 * @param {HTMLElement} selector
 */
function updateValueDisplay(selector){
	const [ , range, valueDisplay ] = selector.children
	const { value, name } = range

	browser.storage.local.get().then(({ styleUnits })=> {
		if(selector.children[2]) valueDisplay.textContent = `${value}${styleUnits[name]}`
	})
}


/**
 * Watches selectors for changes
 */
function watchSelector(){
	selectors.forEach(element => {
		element.children[1].addEventListener('input', (e)=>{
			updateValueDisplay(element, e)
		})

		element.children[1].addEventListener('change', (e)=>{
			updateStorage(element)
		})
	})

	checks.forEach(element => {
		element.children[1].addEventListener('change', async (e)=>{
			updateStorage(element)
		})
	})
}


/**
 * Updates sample preview text in reaction to settings changes
 * @param {ExtensionSettings} settings
 */
function updatePreview({ style, styleUnits }){
	for(const key in style){
		if(style[key] > 0) textSample.style[key] = `${style[key]}${styleUnits[key]}`
	}
}



window.addEventListener('load', async ()=>{
	const settings = await browser.storage.local.get()

	if(typeof settings.style === 'object' && typeof settings.styleEnable === 'boolean'){
		updateVisualDefaults(settings)
		watchSelector()
	}
})