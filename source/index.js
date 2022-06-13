// Source/index.js
// This file contains all the public functions that the library exposes.

import { readFile } from 'node:fs/promises'

import { fileTypeFromBuffer as getFileType } from 'file-type'
import { readChunk } from 'read-chunk'

import { parse as parseTextFromWordFile } from './parsers/word.js'
import { parse as parseTextFromPptFile } from './parsers/ppt.js'
import { parse as parseTextFromExcelFile } from './parsers/excel.js'
import { parse as parseTextFromPdfFile } from './parsers/pdf.js'

/**
 * Extract text from a file if possible.
 *
 * @param {string} filePath - The path to the file to extract text from.
 *
 * @returns {Promise<string>} - The text extracted from the file.
 * @throws {UnsupportedMimeTypeError} - If the file type is unsupported.
 */
export const extractText = async (filePath) => {
	// Use `readChunk` to get only a small part of the file. Usually, the 4200
	// bytes are enough to determine the mime type.
	const chunk = await readChunk(filePath, { length: 4200, startPosition: 0 })
	// Call `getFileType` to determine the mime type from the buffer we read.
	const mimeDetails = await getFileType(chunk)
	// If the mime type library was not able to parse the file, it is most
	// probably a file with plain text content. So return the file's content
	// directly.
	if (!mimeDetails) {
		return readFile(filePath, 'utf8')
	}

	// Check the mime type and call the appropriate function.
	switch (mimeDetails.mime) {
		case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
			return parseTextFromWordFile(filePath)
		case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
			return parseTextFromPptFile(filePath)
		case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
			return parseTextFromExcelFile(filePath)
		case 'application/pdf':
			return parseTextFromPdfFile(filePath)
		default:
			throw new Error(
				`Unsupported mime type ${mimeDetails.mime} (.${mimeDetails.ext})`,
			)
	}
}
