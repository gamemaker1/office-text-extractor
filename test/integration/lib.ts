// test/integration/lib.ts
// This file contains the integration test for the library.

import { readFile } from 'node:fs/promises'
import { type Buffer } from 'node:buffer'
import test from 'ava'

import { getTextExtractor, type InputType } from '../../source/index.js'

const pdfFilePath = './test/fixtures/test-pdf.pdf'
const pdfUrl =
	'https://raw.githubusercontent.com/gamemaker1/office-text-extractor/rewrite/test/fixtures/test-pdf.pdf'
const pdfBuffer = await readFile(pdfFilePath)
const pdfContent = await readFile('./test/fixtures/text-pdf.txt')

const txtFilePath = './test/fixtures/test-txt.txt'
const txtUrl =
	'https://raw.githubusercontent.com/gamemaker1/office-text-extractor/rewrite/test/fixtures/test-txt.txt'
const txtBuffer = await readFile(txtFilePath)
const txtContent = await readFile('./test/fixtures/text-txt.txt')

const docFilePath = './test/fixtures/test-doc.docx'
const docUrl =
	'https://raw.githubusercontent.com/gamemaker1/office-text-extractor/rewrite/test/fixtures/test-doc.docx'
const docBuffer = await readFile(docFilePath)
const docContent = await readFile('./test/fixtures/text-doc.txt')

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

test('extracts text from pdf (file)', macro, pdfFilePath, 'file', pdfContent)
test('extracts text from pdf (buffer)', macro, pdfBuffer, 'buffer', pdfContent)
test('extracts text from pdf (url)', macro, pdfUrl, 'url', pdfContent)

test('extracts text from txt (file)', macro, txtFilePath, 'file', txtContent)
test('extracts text from txt (buffer)', macro, txtBuffer, 'buffer', txtContent)
test('extracts text from txt (url)', macro, txtUrl, 'url', txtContent)

test('extracts text from doc (file)', macro, docFilePath, 'file', docContent)
test('extracts text from doc (buffer)', macro, docBuffer, 'buffer', docContent)
test('extracts text from doc (url)', macro, docUrl, 'url', docContent)
