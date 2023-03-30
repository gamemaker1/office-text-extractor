// source/index.js
// This file contains all the public functions that the library exposes.

/**
 * The text extractor class.
 */
export class TextExtractor {
	methods = []

	addMethod = (method) => this.methods.push(method)
	extractText = ({ input, type }) => {
		const extractor = this.methods.find((method) => method.type === type)
		if (!extractor?.apply) {
			const message = `text-extractor: could not find a method to handle ${type} input`
			throw new Error(message)
		}

		return extractor.apply(input)
	}
}

/**
 * Create and returns a text extractor instance with the default extraction
 * methods.
 */
export const getTextExtractor = async () => {
	const textExtractor = new TextExtractor()
	const methods = [await import('./parsers/pdf.js')]
	methods.map((method) => textExtractor.addMethod(method))

	return textExtractor
}
