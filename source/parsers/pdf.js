// Source/parsers/pdf.js
// The text extracter for PDF files.

import { readFile } from 'node:fs/promises'

import parsePdf from 'pdf-parse/lib/pdf-parse.js'

/**
 * Extract text from a PDF file if possible.
 *
 * @param {string} filePath - The path to the PDF file.
 *
 * @returns {Promise<string>} - The text extracted from the file.
 */
export const parse = async (filePath) => {
	// Read the contents of the PDF file.
	const fileData = await readFile(filePath)

	// Convert the PDF to text and return the text.
	const parsedPdf = await parsePdf(fileData)
	return parsedPdf.text
}
