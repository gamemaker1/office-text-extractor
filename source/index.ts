// source/index.ts
// This file contains the public API for the library.

import { TextExtractor } from './lib.js'
import { PdfExtractor } from './parsers/pdf.js'

/**
 * Create and returns a text extractor instance with the default extraction
 * methods.
 */
export const getTextExtractor = async (): Promise<TextExtractor> => {
	const textExtractor = new TextExtractor()
	const methods = [new PdfExtractor()]
	methods.map((method) => textExtractor.addMethod(method))

	return textExtractor
}
