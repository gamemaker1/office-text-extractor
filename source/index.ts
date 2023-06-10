// source/index.ts
// This file contains the public API for the library.

import { TextExtractor } from './lib.js'
import { DocExtractor } from './parsers/doc.js'
import { PdfExtractor } from './parsers/pdf.js'

/**
 * Create and returns a text extractor instance with the default extraction
 * methods.
 */
export const getTextExtractor = (): TextExtractor => {
	const textExtractor = new TextExtractor()
	const methods = [new PdfExtractor(), new DocExtractor()]
	methods.map((method) => textExtractor.addMethod(method))

	return textExtractor
}

export type {
	InputType,
	ExtractionPayload,
	TextExtractionMethod,
	TextExtractor,
} from './lib.js'
