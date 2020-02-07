const selectors = document.querySelectorAll('.c-input--range')
const checks = document.querySelectorAll('.c-input--check')
const textSample = document.querySelector('#text-sample')
/**
 *
 * @param {DOMNode} selector
 * @param {Storage} storage destructured storage data
 */
function setSelector(selector, { style, styleUnits, ...settings }){
	if(determineNodeType(selector.children[1])) selector.children[1].checked = settings[selector.children[1].name]
	selector.children[1].value = style[selector.children[1].name]
}

function updateVisualDefaults(storage){
	selectors.forEach(element => {
		setSelector(element, storage)
		updateValueDisplay(element)
		updatePreview(storage)
	})

	checks.forEach(element => {
		setSelector(element, storage)
		updateValueDisplay(element)
		updatePreview(storage)
	})
}

/**
 * returns true if checkbox
 * @param {} node
 */
function determineNodeType(node){
	return node.type === 'checkbox'
}

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

function updateValueDisplay(selector, e){
	if(selector.children[2]) selector.children[2].textContent = `${selector.children[1].value}px`
}

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
			console.log(await browser.storage.local.get())
		})
	})
}


window.addEventListener('load', async ()=>{
	const settings = await browser.storage.local.get()

	updateVisualDefaults(settings)
	watchSelector()
})




function updatePreview({ style, styleUnits }){
	for(const key in style){
		if(style[key] > 0) textSample.style[key] = `${style[key]}${styleUnits[key]}`
	}
}