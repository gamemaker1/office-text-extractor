// source/lib.ts
// The source code for the library.

import { Buffer } from 'node:buffer'
import { fileTypeFromBuffer as getFileType } from 'file-type'
import { readFile, fetchUrl } from './util.js'

/**
 * A method of text extraction.
 */
export type InputType = 'buffer' | 'file' | 'url'
export type ExtractionPayload = { type: InputType; input: string | Buffer }
export type TextExtractionMethod = {
	mimes: string[]
	apply: (_: Buffer) => Promise<string>
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
		// Turn the input into a buffer containing the file's contents.
		let preparedInput: Buffer
		if (typeof input === 'string') {
			if (type === 'file') preparedInput = await readFile(input)
			else if (type === 'url') preparedInput = await fetchUrl(input)
			else preparedInput = Buffer.from(input)
		} else {
			preparedInput = input
		}

		// Check the mime type of the file. If there is no mime type, it's most
		// likely a txt/csv files.
		const mimeDetails = await getFileType(preparedInput)
		if (!mimeDetails) return preparedInput.toString()

		// Find the extractor that can handle that mime type, and call it.
		const extractor = this.methods.find((method) =>
			method.mimes.includes(mimeDetails.mime),
		)
		if (!extractor?.apply) {
			const message = `text-extractor: could not find a method to handle ${mimeDetails.mime}`
			throw new Error(message)
		}

		return extractor.apply(preparedInput)
	}
}
