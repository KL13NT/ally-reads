/* eslint-env jest, browser */

const { JSDOM } = require('jsdom')
const { stringify } = JSON

const { DOMManipulator, OptionsSchema, parseAndAttachCSS } = require('../src/content_script.js')

const testSchema = {
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
	wordsPerLine: 1,

	autoScan: true,
	styleEnable: true,
	DOMEnable: true,
	enabled: true
}

describe('content_browser contents testing', () => {
	test('verifySchema should return false when given incorrect object and true when given correct', () => {

		expect(OptionsSchema.verifySchema({})).toEqual(false)
		expect(OptionsSchema.verifySchema(testSchema)).toEqual(true)

	})

	test('DOMManipulator() constructor should throw when schema is wrong', () => {

		expect(() => {
			new DOMManipulator()
		}).toThrow()

		expect(() => {
			new DOMManipulator({})
		}).toThrow()

		expect(() => {
			new DOMManipulator(testSchema)
		}).not.toThrow()


	})

	test('shouldUpdate should return true when state is different and false when equivalent', () => {

		const manip = new DOMManipulator(testSchema)

		expect(manip.shouldUpdate({ trackedElements: [] })).toEqual(false)
		expect(manip.shouldUpdate({})).toEqual(true)
		expect(manip.shouldUpdate({ trackedElements: [ 1, 2, 3 ] })).toEqual(true)

	})

	/**
	 * Testing formatNode depends on user interaction and settings
	 * When testing it, inspect the visual aspects and the HTML
	 */

	test('setState should update state accordingly', () => {
		const manip = new DOMManipulator(testSchema) //has empty state

		manip.setState({ trackedElements: [ 1,2,3 ] })
		expect(manip.state).toEqual({ trackedElements: [ 1,2,3 ] })

		manip.setState({ trackedElements: [ 1,2,3 ] })
		expect(manip.state).toEqual({ trackedElements: [ 1,2,3 ] })

		manip.setState({ trackedElements: [] })
		expect(manip.state).not.toEqual({ trackedElements: [ 1,2,3 ] })
	})

	test('parseAndAttachCSS should attach new CSS stylesheet element to <HEAD/>', () => {
		parseAndAttachCSS(testSchema)
		const parsedCSS = '.ally-reads_improved_reading, .ally-reads_improved_reading *{\nfont-size: 16px !important;\n}'

		expect(document.getElementsByTagName('head')[0].children[0].textContent).toEqual(parsedCSS)
	})
})