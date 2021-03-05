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

// The filesystem library
const Fs = require('fs-extra')
// Library to extract office files
const decompressFile = require('decompress')
// Library to convert the document's XML to
// JSON
const convertXmlToJson = require('xml2js').parseStringPromise
// The path to the OS' temporary directory
// Surround using Fs.realpath as the temp dir may be a
// symlink (see nodejs/node#11422)
const tempPath = Fs.realpathSync(require('os').tmpdir())

// MARK: Functions

// Extract the word file temporarily and return the XML file
// containing the actual content
async function extractWordFile(filePath) {
  // The name of the extracted-to folder
  // TODO: Make the file path more collision-resistant
  const pathToExtractedFile = `${tempPath}/tmp-word-${Date.now()}`
  // Extract the file to a temporary directory
  await decompressFile(filePath, pathToExtractedFile)

  // Read the contents of the word/document.xml file
  // First check if it exists
  if (Fs.existsSync(`${pathToExtractedFile}/word/document.xml`)) {
    // If it does, return the file's content
    return await Fs.readFile(`${pathToExtractedFile}/word/document.xml`)
  } else {
    // Else throw an error
    throw new Error('Could not extract XML files from document')
  }
}

// Recursively parse the JSON in the document
async function processDocumentObject(object, result = null) {
  // Add to the localResult and return that
  let localResult = result || []
  // Check if it is an array
  if (isArray(object)) {
    // If it is, loop through its elements
    for (const element of object) {
      // If you find a string, push it to the result
      if (typeof element == 'string' && element != '') {
        localResult.push(element)
      } else {
        // Else if it is an object or another array, parse
        // it again
        await processDocumentObject(element, localResult)
      }
    }

    // Return successfully
    return localResult
  }

  // If it is an object, loop through its properties
  if (typeof object == 'object') {
    // Loop through the properties
    for (const property of Object.keys(object)) {
      // Get the value of the property
      const value = object[property]
      // Check if it is a string
      if (typeof value == 'string') {
        // The docx format stores the actual text inside the
        // w:t or _ properties, so extract that if it exists
        if ((property == 'w:t' || property == '_') && value != '') {
          localResult.push(value)
        }
      } else {
        // Else if it is an array or another object, parse
        // it again
        await processDocumentObject(value, localResult)
      }
    }

    // Return succesfully
    return localResult
  }
}

// Convert the XML in the document to easily parse-able JSON
async function convertDocumentXmlToJson(buffer) {
  return await convertXmlToJson(buffer)
}

// Check if the object is an array
function isArray(obj) {
  return !!obj && obj.constructor === Array
}

// Bundle all the functions into one
async function parseTextFromWordFile(filePath) {
  return await new Promise((resolve, reject) => {
    extractWordFile(filePath)
      .then(convertDocumentXmlToJson)
      .then(processDocumentObject)
      .then((sentences) => {
        resolve(sentences.join('\n'))
      })
  })
}

// MARK: Exports

// Export it
exports.parseTextFromWordFile = parseTextFromWordFile
