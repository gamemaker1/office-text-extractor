// source/parsers/pdf.ts
// The text extracter for PDF files.

import { type Buffer } from 'node:buffer'
// @ts-expect-error There are no types for this package.
import parsePdf from 'pdf-parse/lib/pdf-parse.js'

import type {
	ExtractionPayload,
	InputType,
	TextExtractionMethod,
} from '../lib.js'
import { readFile, fetchUrl } from '../util.js'

export class PdfExtractor implements TextExtractionMethod {
	/**
	 * The type(s) of input acceptable to this method.
	 */
	acceptedInputMethods: InputType[] = ['buffer', 'file', 'url']

	/**
	 * Extract text from a PDF file if possible.
	 *
	 * @param payload The input and its type.
	 * @returns The text extracted from the input.
	 */
	apply = async ({ input, type }: ExtractionPayload): Promise<string> => {
		let preparedInput: string | Buffer = input

		if (typeof input === 'string') {
			if (type === 'file') preparedInput = await readFile(input)
			if (type === 'url') preparedInput = await fetchUrl(input)
		}

		// Convert the PDF to text and return the text.
		const parsedPdf = (await parsePdf(preparedInput, {
			pagerender: renderPage,
		})) as { text: string }
		return parsedPdf.text
	}
}

/**
 *
 * @param data The data stored in the PDF about the page.
 * @returns The text content on the page
 */
const renderPage = async (data: unknown): Promise<string> => {
	const options = {
		normalizeWhitespace: false,
		disableCombineTextItems: false,
	}

	// @ts-expect-error todo: figure out the types
	return data.getTextContent(options).then((textContent: unknown) => {
		let lastY = ''
		let text = ''

		// @ts-expect-error todo: figure out the types
		for (const item of textContent.items) {
			if (!(lastY === item.transform[5] || !lastY)) text += '\n'
			text += (item.str as string) + ' '

			lastY = item.transform[5] as string
		}

		return text
	})
}
