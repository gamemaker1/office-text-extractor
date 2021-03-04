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
async function extractPptFile(filePath, callback) {
  // The name of the extracted-to folder
  // TODO: Make the file path more collision-resistant
  const pathToExtractedFile = `${tempPath}/tmp-ppt-${Date.now()}`
  // Extract the file to a temporary directory
  await decompressFile(filePath, pathToExtractedFile)

  // Check if the ppt/slides/ directory exists
  if (Fs.existsSync(`${pathToExtractedFile}/ppt/slides`)) {
    // Get the number of slides within that directory
    let slides = (
      (await Fs.readdir(`${pathToExtractedFile}/ppt/slides`)) || []
    ).length
    // Loop through them and add the results to an array
    let textFromSlides = []
    // We are hardcoding the names of the slides as:
    // - that is a part of the format
    // - Fs.readdir doesn't sort the files properly
    for (let i = 1; i < slides; i++) {
      textFromSlides.push(
        await callback(
          await Fs.readFile(
            `${pathToExtractedFile}/ppt/slides/slide${i}.xml`
          )
        )
      )
    }

    // Format the text (separate each slide's text with a ---)
    let formattedText = ''
    for (const text of textFromSlides) {
      formattedText += `---\n${text.join('\n')}\n`
    }

    // Return the text form all those slides
    return formattedText
  }
}

async function processSlideFile(data) {
  // Convert the XML from the slide to JSON
  const object = await convertXmlToJson(data)
  // Extract the text from JSON
  const slideText = await processSlideObject(object)
  // Return the text
  return slideText
}

// Recursively parse the JSON in a slide
async function processSlideObject(object, result = null) {
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
        await processSlideObject(element, localResult)
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

      // The pptx format stores the actual text inside the
      // a:t or _ properties, so extract that if it exists

      // Check if it is a string or array that contains a string
      if (typeof value == 'string') {
        if ((property == 'a:t' || property == '_') && value != '') {
          localResult.push(value)
        }
      } else if (typeof value[0] == 'string') {
        if ((property == 'a:t' || property == '_') && value[0] != '') {
          localResult.push(value[0])
        }
      } else {
        // Else if it is an array or another object, parse
        // it again
        await processSlideObject(value, localResult)
      }
    }

    // Return succesfully
    return localResult
  }
}

// Check if the object is an array
function isArray(obj) {
  return !!obj && obj.constructor === Array
}

// Bundle all the functions into one
async function parseTextFromPptFile(filePath) {
  return await extractPptFile(filePath, processSlideFile)
}

// MARK: Exports

// Export it
exports.parseTextFromPptFile = parseTextFromPptFile
