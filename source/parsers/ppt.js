// Source/parsers/ppt.js
// The text extracter for MS Power Point files.

import { tmpdir as getTemporaryDirectory } from 'node:os'
import { existsSync as fileExists } from 'node:fs'
import {
	readFile,
	realpath as resolvePath,
	readdir as listFiles,
} from 'node:fs/promises'

import { parseStringPromise as convertXmlToJson } from 'xml2js'
import decompressFile from 'decompress'

// Surround using realpath as the temp dir may be a symlink
// (see https://github.com/nodejs/node/issues/11422)
const temporaryPath = await resolvePath(getTemporaryDirectory())

/**
 * Extract text from an MS Power Point file if possible.
 *
 * @param {string} filePath - The path to the PPT file.
 *
 * @returns {Promise<string>} - The text extracted from the file.
 */
export const parse = async (filePath) => {
	// Extract the PPT file into a temporary directory.
	// TODO: Make the file path more collision-resistant
	const pathToExtractedPpt = `${temporaryPath}/office-text-extractor-${Date.now()}`
	await decompressFile(filePath, pathToExtractedPpt)

	// Check if the ppt/slides/ directory exists.
	if (fileExists(`${pathToExtractedPpt}/ppt/slides`)) {
		// Get the number of slides within that directory.
		const slides = (await listFiles(`${pathToExtractedPpt}/ppt/slides`)) ?? []
		const numberOfSlides = slides.length

		// Now loop through the slides, extracting their text and then adding that
		// to a final string.
		const parsedSlides = []
		for (let index = 1; index < numberOfSlides; index++) {
			// Read the contents of the slide.
			const slideContent = await readFile(
				`${pathToExtractedPpt}/ppt/slides/slide${index}.xml`,
			)

			// Convert the XML from the slide to JSON.
			const slideJson = await convertXmlToJson(slideContent)
			// Parse the slide file, and collect the lines of text from it.
			const linesOfText = await parseSlideSection(slideJson)

			parsedSlides.push(linesOfText.join('\n'))
		}

		// Format the text (separate each slide's text with a ---)
		const formattedText = parsedSlides.join('\n---\n') + '\n'

		// Return the text from all the slides.
		return formattedText
	}
}

/**
 * Extracts text from a section of the slide, recursively.
 *
 * @param {any} slideSection - The section of the slide, converted to JSON from XML.
 * @param {Array<string>} collectedText - The lines of text parsed from the slide so far.
 *
 * @returns {Promise<Array<string>>} - The lines of text on the slide.
 */
const parseSlideSection = async (slideSection, collectedText = null) => {
	// Keep track of the text being collected.
	const beingCollectedText = collectedText || []

	// Parse the section according to what type it is.
	if (Array.isArray(slideSection)) {
		// If it is, loop through the elements of the array.
		for (const element of slideSection) {
			// Collect all the pieces of text from the array.
			if (typeof element === 'string' && element !== '') {
				beingCollectedText.push(element)
			} else {
				// However, if it is an object or another array, call this function
				// again to parse that.
				await parseSlideSection(element, beingCollectedText)
			}
		}

		// Finally, return the collected text.
		return beingCollectedText
	}

	// If the section is an object, loop through its properties.
	if (typeof slideSection === 'object') {
		for (const property of Object.keys(slideSection)) {
			// Get the value of the property.
			const value = slideSection[property]

			// The `pptx` format stores the actual text inside the `a:t` or `_`
			// properties, so extract text from those properties.

			// Check if it is a string or array that contains a string. If it is
			// either, then collect the text content.
			if (typeof value === 'string') {
				if ((property === 'a:t' || property === '_') && value !== '') {
					beingCollectedText.push(value)
				}
			} else if (typeof value[0] === 'string') {
				if ((property === 'a:t' || property === '_') && value[0] !== '') {
					beingCollectedText.push(value[0])
				}
			} else {
				// However, if it is an object or another array, call this function
				// again to parse that.
				await parseSlideSection(value, beingCollectedText)
			}
		}

		// Finally, return the collected text.
		return beingCollectedText
	}
}
