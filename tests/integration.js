// Tests/integration.js
// Tests all the types of documents.

import { fileURLToPath } from 'node:url'

import test from 'ava'

import { extractText } from '../source/index.js'

const fixturesDirectory = `${fileURLToPath(
	new URL('.', import.meta.url),
)}/fixtures/`

const fixtures = [
	{
		name: 'docx',
		file: 'Test.docx',
		text: 'A BIG HEADING\n\n\n\nNormal text\n\n\n\nAnd more text here, and more text there\n\n\n\nThere’s a nice table below\n\n\n\nTable Heading A\n\nTable Heading B\n\nTable Heading C\n\nTable Heading D\n\nRow 1A\n\nRow 1B\n\nRow 1C\n\nRow 1D\n\nRow 2A\n\nRow 2B\n\nRow 2C\n\nRow 2D\n\n\n\nWhat else can we do?\n\n\n\nI guess this is the end, thank you.\n\n',
	},
	{
		name: 'pptx',
		file: 'Test.pptx',
		text: 'A BIG HEADING\nA subtitle\n---\nAnother slide\nThere’s a few shapes below\nSomething in a box\nSomething in a text bubble\nA text box\n---\nTable test\nTable Heading A\nTable Heading B\nTable Heading C\nTable Heading D\nRow 1A\nRow 1B\nRow 1C\nRow 1D\nRow 2A\nRow 2B\nRow 2C\nRow 2D\n',
	},
	{
		name: 'xlsx',
		file: 'Test.xlsx',
		text: '===\n---\nNormal text heading A: Row 1A\nNormal text heading B: Row 1B\nNormal text heading C: Row 1C\nNormal text heading D: Row 1D\n---\nNormal text heading A: Row 2A\nNormal text heading B: Row 2B\nNormal text heading C: Row 2C\nNormal text heading D: Row 2D\n===\n---\nFormula tests: 1\n: 2\n: 3\n: 4\n---\nFormula tests: 3\n: 5\n: 7\n: 0\n',
	},
	{
		name: 'pdf',
		file: 'Test.pdf',
		text: `\n\nA BIG HEADING\nNormal text\nAnd more text here, and more text there\nThere’s a nice table below\nTable Heading ATable Heading BTable Heading CTable Heading D\nRow 1ARow 1BRow 1CRow 1D\nRow 2ARow 2BRow 2CRow 2D\nWhat else can we do?\nI guess this is the end, thank you.`,
	},
	{
		name: 'txt',
		file: 'Test.unknown_extension',
		text: 'OOOOOOO, the claw!\n',
	},
]

/**
 * Generate tests for all the fixtures.
 */
for (const fix of fixtures)
	test(fix.name, async (t) => {
		const extractedText = await extractText(fixturesDirectory + fix.file)
		t.is(fix.text, extractedText)
	})

/**
 * Test that the parser throws when the file type is unsupported.
 */
test('png', async (t) => {
	const error = await t.throwsAsync(
		extractText(`${fixturesDirectory}/Test.png`),
	)

	// Check if the correct error message is returned.
	if (error.message && error.message.includes('Unsupported mime type')) t.pass()
	else t.fail('Unsupported mime type was not caught')
})
