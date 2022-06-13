// Source/parsers/excel.js
// The text extracter for MS Excel files.

import Xlsx, { utils as sheetUtils } from 'xlsx'
import { dump as convertToYaml } from 'js-yaml'

const { readFile: convertXlsxToJson } = Xlsx
const convertSheetToJson = sheetUtils.sheet_to_json

/**
 * Extract text from an MS Excel file if possible.
 *
 * @param {string} filePath - The path to the Excel file.
 *
 * @returns {Promise<string>} - The text extracted from the file.
 */
export const parse = (filePath) => {
	// Read the contents of the Excel file and convert them to JSON.
	const jsonWorkbook = convertXlsxToJson(filePath)

	// Get the names of all the sheets.
	const sheets = jsonWorkbook.SheetNames
	// Loop through the sheets and return nicely formatted text.
	let formattedText = ''
	for (const sheet of sheets) {
		// Add the sheet separator to indicate a new sheet has started.
		formattedText += '===\n'
		// Convert the sheet to JSON as well.
		const sheetJson = convertSheetToJson(jsonWorkbook.Sheets[sheet])
		// For each row in the JSON, convert it to YAML to make it more readable.
		for (const row of sheetJson) {
			// Add the row separator.
			formattedText += '---\n'
			// Add the YAML formatted text.
			formattedText += convertToYaml(row)
				// If the column header is empty, the YAML converter replaces it with '__EMPTY'.
				// Replace that with just underscore + the column number instead.
				.replace(/__EMPTY*:/g, ':')
				.replace(/__EMPTY_\d?:/g, ':')
		}
	}

	// Return the nicely formatted text to the user.
	return formattedText
}
