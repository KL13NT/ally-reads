//This file contains custom type definitions in JSDoc format. Should be imported in content_scripts file

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
 * A list of DOM mutations
 * @typedef {MutationRecord[]} MutationList
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord|Mutation Record - MDN}
 */