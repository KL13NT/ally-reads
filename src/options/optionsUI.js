/*eslint-env browser */
/*global browser */

const selectors = document.querySelectorAll('.c-input--range')
const checks = document.querySelectorAll('.c-input--check')
const numbers = document.querySelectorAll('.c-input--number')
const textSample = document.querySelector('#text-sample')
/**
 * Updates selector values
 * @param {HTMLElement} selector
 * @param {object} storage destructured storage data
 */
function updateSelectorValue (selector, { style, ...settings }){
	const [ , childSelector ] = selector.children

	if(childSelector.type === 'checkbox') childSelector.checked = settings[childSelector.name]
	else if(childSelector.type === 'number') childSelector.value = settings[childSelector.name]
	else childSelector.value = style[childSelector.name]
}

/**
 * Sets defaults upon settings page load
 * @param {object} storage
 */
function updateVisualDefaults (storage){
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

	numbers.forEach(element => {
		updateSelectorValue(element, storage)
		updateValueDisplay(element)
		updatePreview(storage)
	})
}


/**
 * Updates StorageArea with new settings
 * @async
 * @param {HTMLElement} updatedSelector element which value has changed
 */
async function updateStorage (updatedSelector){
	const selector = updatedSelector.children[1]
	const { value, checked, name } = updatedSelector.children[1]

	const oldStorage = await browser.storage.local.get()

	if(selector.type === 'check')
		await browser.storage.local.set({
			...oldStorage,
			[name]: checked
		})

	else if(selector.type === 'number')
		await browser.storage.local.set({
			...oldStorage,
			[name]: value
		})

	else if(selector.type === 'range')
		await browser.storage.local.set({
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
function updateValueDisplay (selector){
	const [ , range, valueDisplay ] = selector.children
	const { value, name } = range

	browser.storage.local.get().then(({ styleUnits }) => {
		if(selector.children[2]) valueDisplay.textContent = `${value}${styleUnits[name] || ''}`
	})
}


/**
 * Watches selectors for changes
 */
function watchSelector (){
	selectors.forEach(element => {
		element.children[1].addEventListener('input', () => {
			updateValueDisplay(element)
		})

		element.children[1].addEventListener('change', () => {
			updateStorage(element)
		})
	})

	checks.forEach(element => {
		element.children[1].addEventListener('change', async () => {
			updateStorage(element)
		})
	})


	numbers.forEach(element => {
		element.children[1].addEventListener('input', async () => {
			updateStorage(element)
			updateValueDisplay(element)
		})
	})
}


/**
 * Updates sample preview text in reaction to settings changes
 * @param {ExtensionSettings} settings
 */
function updatePreview ({ style, styleUnits }){
	for(const key in style){
		if(style[key] > 0) textSample.style[key] = `${style[key]}${styleUnits[key]}`
	}
}



window.addEventListener('load', async () => {
	const settings = await browser.storage.local.get()

	if(typeof settings.style === 'object' && typeof settings.styleEnable === 'boolean'){
		updateVisualDefaults(settings)
		watchSelector()
	}
})