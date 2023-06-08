// test/integration/lib.ts
// This file contains the integration test for the library.

import { readFile } from 'node:fs/promises'
import { type Buffer } from 'node:buffer'
import test from 'ava'

import { getTextExtractor, type InputType } from '../../source/index.js'

const pdfFilePath = './test/fixtures/integration-test.pdf'
const pdfTextPath = './test/fixtures/pdf-text.txt'
const pdfUrl = ''
const pdfBuffer = await readFile(pdfFilePath)
const pdfContent = await readFile(pdfTextPath)

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

test('extracts text from pdf file', macro, pdfFilePath, 'file', pdfContent)
test('extracts text from pdf buffer', macro, pdfBuffer, 'file', pdfContent)
test('extracts text from url', macro, pdfUrl, 'file', pdfContent)
