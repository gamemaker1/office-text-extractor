// test/integration.ts
// This file contains the integration test for the library.

import { readFile } from 'node:fs/promises'

import { getTextExtractor } from '../source/index.js'

const extractor = await getTextExtractor()
const text = await extractor.extractText({
	input: './test/fixtures/file.pdf',
	type: 'file',
})

console.log(text)
