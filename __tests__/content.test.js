/* eslint-env jest */

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
	DOMEnable: true
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

	test('formatText should return correct respective to wordsPerLine in schema', () => {

		testSchema.wordsPerLine = 2
		const manip = new DOMManipulator(testSchema)

		expect(stringify(manip.formatText('hello'))).toEqual(stringify('hello'))
		expect(stringify(manip.formatText('hello world'))).toEqual(stringify('hello world'))
		expect(stringify(manip.formatText('hello world world'))).toEqual(stringify('hello world \r\nworld'))

		manip.settings.wordsPerLine = 3

		expect(stringify(manip.formatText('word1 word2 word3'))).toEqual(stringify('word1 word2 word3'))
	})

	test('formatText should return correct respective to linesPerParagraph in schema', () => {

		testSchema.wordsPerLine = 2
		testSchema.linesPerParagraph = 1

		const manip = new DOMManipulator(testSchema)

		expect(stringify(manip.formatText('word1 word2 word3'))).toEqual(stringify('word1 word2 \r\n\r\nword3'))
		expect(stringify(manip.formatText('word1 word2 word3 paragraph2'))).toEqual(stringify('word1 word2 \r\n\r\nword3 paragraph2'))

		manip.settings.linesPerParagraph = 2
		expect(stringify(manip.formatText('word1 word2 word3 word4'))).toEqual(stringify('word1 word2 \r\nword3 word4'))
		expect(stringify(manip.formatText('word1 word2 word3 word4 word5'))).toEqual(stringify('word1 word2 \r\nword3 word4 \r\n\r\nword5'))

		manip.settings.wordsPerLine = 4
		expect(stringify(manip.formatText('word1 word2 word3 word4'))).toEqual(stringify('word1 word2 word3 word4'))
		expect(stringify(manip.formatText('word1 word2 word3 word4 word5'))).toEqual(stringify('word1 word2 word3 word4 \r\nword5'))

		manip.settings.linesPerParagraph = 1
		expect(stringify(manip.formatText('word1 word2 word3 word4'))).toEqual(stringify('word1 word2 word3 word4'))
		expect(stringify(manip.formatText('word1 word2 word3 word4 word5'))).toEqual(stringify('word1 word2 word3 word4 \r\n\r\nword5'))
	})

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
		expect(document.getElementsByTagName('head')[0].children[0].textContent).toEqual('.ally-reads_improved_reading{\nfont-size: 16px !important;\n}')
	})
})