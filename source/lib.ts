// source/lib.ts
// The source code for the library.

import { type Buffer } from 'node:buffer'

/**
 * A method of text extraction.
 */
export type InputType = 'buffer' | 'file' | 'url'
export type ExtractionPayload = { type: InputType; input: string | Buffer }
export type TextExtractionMethod = {
	acceptedInputMethods: InputType[]
	apply: (_: ExtractionPayload) => Promise<string>
}

/**
 * The text extractor class.
 */
export class TextExtractor {
	// The list of methods supported by this instance of the extractor.
	methods: TextExtractionMethod[] = []

	/**
	 * Registers a new method to this instance of the extractor.
	 *
	 * @param method The method of text extraction to add.
	 * @returns The current instance, for method chaining.
	 */
	addMethod = (method: TextExtractionMethod): this => {
		this.methods.push(method)
		return this
	}

	/**
	 * Extracts text from the given input.
	 *
	 * @param payload The input and type of input to extract text from.
	 * @returns The extracted text as a simple string.
	 */
	extractText = async ({ input, type }: ExtractionPayload): Promise<string> => {
		const extractor = this.methods.find((method) =>
			method.acceptedInputMethods.includes(type),
		)
		if (!extractor?.apply) {
			const message = `text-extractor: could not find a method to handle ${type} input`
			throw new Error(message)
		}

		return extractor.apply({ input, type })
	}
}
