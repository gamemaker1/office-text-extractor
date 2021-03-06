/*
 * Copyright (c) 2021, gamemaker1
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

// MARK: Imports

// Import the library
const extractText = require('../lib/')
// The library to run tests
const test = require('ava')

// MARK: Helper functions

// The function to test the extraction of a docx file (no images)
async function testDocx() {
  // Extract text from the test docx file
  let extractedText = await extractText(`${__dirname}/files/Test.docx`)
  // The expected text from the docx file
  let expectedText =
    'A BIG HEADING\nNormal text\nAnd more text here, and more text there\nThere’s a nice table below\nWhat else can we do?\nI guess this is the end, thank you.\nTable Heading A\nTable Heading B\nTable Heading C\nTable Heading D\nRow 1A\nRow 1B\nRow 1C\nRow 1D\nRow 2A\nRow 2B\nRow 2C\nRow 2D'

  // Check if the two match
  if (expectedText === extractedText) {
    // If they do, pass the test
    return true
  } else {
    // Else return false
    return false
  }
}

// The function to test the extraction of a pptx file (no images)
async function testPptx() {
  // Extract text from the test pptx file
  let extractedText = await extractText(`${__dirname}/files/Test.pptx`)
  // The expected text from the pptx file
  let expectedText =
    '---\nA BIG HEADING\nA subtitle\n---\nAnother slide\nThere’s a few shapes below\nSomething in a box\nSomething in a text bubble\nA text box\n---\nTable test\nTable Heading A\nTable Heading B\nTable Heading C\nTable Heading D\nRow 1A\nRow 1B\nRow 1C\nRow 1D\nRow 2A\nRow 2B\nRow 2C\nRow 2D\n'

  // Check if the two match
  if (expectedText === extractedText) {
    // If they do, pass the test
    return true
  } else {
    // Else return false
    return false
  }
}

// The function to test the extraction of a xlsx file (with multiple sheets)
async function testXlsx() {
  // Extract text from the test xlsx file
  let extractedText = await extractText(`${__dirname}/files/Test.xlsx`)
  // The expected text from the xlsx file
  let expectedText =
    '===\n---\nNormal text heading A: Row 1A\nNormal text heading B: Row 1B\nNormal text heading C: Row 1C\nNormal text heading D: Row 1D\n---\nNormal text heading A: Row 2A\nNormal text heading B: Row 2B\nNormal text heading C: Row 2C\nNormal text heading D: Row 2D\n===\n---\nFormula tests: 1\n: 2\n: 3\n: 4\n---\nFormula tests: 3\n: 5\n: 7\n: 0\n'

  // Check if the two match
  if (expectedText === extractedText) {
    // If they do, pass the test
    return true
  } else {
    // Else return false
    return false
  }
}

// The function to test the extraction of a pdf file (no images)
async function testPdf() {
  // Extract text from the test pdf file
  let extractedText = await extractText(`${__dirname}/files/Test.pdf`)
  // The expected text from the pdf file
  let expectedText = `\n\nA BIG HEADING\nNormal text\nAnd more text here, and more text there\nThere’s a nice table below\nTable Heading ATable Heading BTable Heading CTable Heading D\nRow 1ARow 1BRow 1CRow 1D\nRow 2ARow 2BRow 2CRow 2D\nWhat else can we do?\nI guess this is the end, thank you.`

  // Check if the two match
  if (expectedText === extractedText) {
    // If they do, pass the test
    return true
  } else {
    // Else return false
    return false
  }
}

// The function to test the extraction of a text content file
async function testNoMime() {
  // Extract text from the test pdf file
  let extractedText = await extractText(
    `${__dirname}/files/Test.unknown_extension`
  )
  // The expected text from the file
  let expectedText = `Random text, thank you.`

  // Check if the two match
  if (expectedText === extractedText) {
    // If they do, pass the test
    return true
  } else {
    // Else return false
    return false
  }
}

// The function to test the extraction of an unsupported file
async function testUnsupportedMime() {
  // Extract text from the test file
  await extractText(`${__dirname}/files/Test.png`)
  // It should throw an error
}

// MARK: Tests
// The actual tests using ava

test('test parsing for docx files', async (t) => {
  t.true(await testDocx())
})

test('test parsing for pptx files', async (t) => {
  t.true(await testDocx())
})

test('test parsing for xlsx files', async (t) => {
  t.true(await testDocx())
})

test('test parsing for pdf files', async (t) => {
  t.true(await testDocx())
})

test('test parsing for files with unknown mime', async (t) => {
  t.true(await testNoMime())
})

test('test parsing for files with unsupported mime', async (t) => {
  // Run the test on the unsupported mime type
  const error = await t.throwsAsync(testUnsupportedMime)
  // Check if the correct error message is returned
  if (
    error.message &&
    error.message.includes('Unsupported mime type')
  ) {
    // If so, pass the test
    t.pass()
  } else {
    // Else fail the test
    t.fail('Unsupported mime type was not caught')
  }
})
