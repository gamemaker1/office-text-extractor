// test/integration/lib.ts
// This file contains the integration test for the library.

import { readFileSync } from 'node:fs'
import test from 'ava'

import { type Buffer } from 'buffer/'
import { getTextExtractor, type InputType } from '../../source/index.js'

const extractor = getTextExtractor()

const macro = test.macro(
	async (
		t,
		input: string | Buffer,
		type: InputType,
		expected: string | Buffer,
	) => {
		const text = await extractor.extractText({ input, type })

		t.is(typeof text, 'string')
		t.is(text, expected.toString())
	},
)

for (const fileType of ['pdf', 'txt', 'docx', 'pptx', 'xlsx']) {
	const filePath = `./test/fixtures/docs/${fileType}.${fileType}`
	const fileUrl = `https://raw.githubusercontent.com/gamemaker1/office-text-extractor/main/test/fixtures/docs/${fileType}.${fileType}`
	const fileBuffer = readFileSync(filePath)
	const fileContent = readFileSync(`./test/fixtures/texts/${fileType}.txt`)

	test(`${fileType} (file)`, macro, filePath, 'file', fileContent)
	test(`${fileType} (buffer)`, macro, fileBuffer, 'buffer', fileContent)
	test(`${fileType} (url)`, macro, fileUrl, 'url', fileContent)
}
