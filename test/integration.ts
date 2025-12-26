// test/integration/lib.ts
// This file contains the integration test for the library.

import { readFileSync } from 'node:fs'
import test from 'ava'
import { getTextExtractor, type InputType } from '../source/index.js'

const extractor = getTextExtractor()

const macro = test.macro(
	async (t, type: InputType, input: string | Uint8Array, answer: string | Uint8Array) => {
		const text = await extractor.extractText({ type, input })
		t.is(typeof text, 'string')
		t.snapshot(text)
	},
)

for (const type of ['pdf', 'txt', 'docx', 'pptx', 'xlsx']) {
	const repo = 'https://raw.githubusercontent.com/gamemaker1/office-text-extractor/main'
	const file = `test/fixtures/${type}`

	const url = `${repo}/${file}.${type}`
	const path = `./${file}.${type}`

	const input = readFileSync(path)

	test(`${type} (buffer)`, macro, 'buffer', input)
	test(`${type} (file)`, macro, 'file', path)
	test(`${type} (url)`, macro, 'url', url)
}
