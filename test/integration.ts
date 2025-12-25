// test/integration/lib.ts
// This file contains the integration test for the library.

import { readFileSync } from 'node:fs'
import test from 'ava'
import { getTextExtractor } from '../source/index.js'

const extractor = getTextExtractor()

const macro = test.macro(
	async (t, input: Uint8Array, expected: string | Uint8Array) => {
		const text = await extractor.extractText(input)
		t.is(typeof text, 'string')
		t.is(text, expected.toString())
	},
)

for (const fileType of ['pdf', 'txt', 'docx', 'pptx', 'xlsx']) {
	const input = readFileSync(`./test/fixtures/docs/${fileType}.${fileType}`)
	const expected = readFileSync(`./test/fixtures/texts/${fileType}.txt`)
	test(`${fileType} (buffer)`, macro, input, expected)
}
