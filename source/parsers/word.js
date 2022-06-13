// Source/parsers/word.js
// The text extracter for MS Word files.

import { extractRawText as parseWordFile } from 'mammoth'

/**
 * Extract text from an MS Excel file if possible.
 *
 * @param {string} filePath - The path to the Excel file.
 *
 * @returns {Promise<string>} - The text extracted from the file.
 */
export const parse = async (filePath) => {
	// Read and parse the file.
	const parsedWordFile = await parseWordFile({ path: filePath })
	// Then return its text content.
	return parsedWordFile.value
}
