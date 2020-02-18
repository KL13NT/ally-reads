import { deepCompare } from './utils'

export class ExtensionSettings {
	schema = {
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
		DOMEnable: true,
		enabled: true
	}

	constructor (options){
		if(!deepCompare(this.schema, options)) throw Error('Passed options object doesn\'t match schema')

		Object.assign(this, options)
		delete this.schema
	}
}