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
// Library to detect mime type
const FileType = require('file-type')
// Library to get only a small portion of the file
const readChunk = require('read-chunk')

// Parsers defined in ./parsers/
const { parseTextFromWordFile } = require('./parsers/word.js')
const { parseTextFromPptFile } = require('./parsers/ppt.js')
const { parseTextFromExcelFile } = require('./parsers/excel.js')
const { parseTextFromPdfFile } = require('./parsers/pdf.js')

// MARK: Functions

// Extract the text for any file, if the file is not supported, it will
// return null
async function extractText(filePath) {
  // Use readChunk to get only a small part of the file
  const chunk = await readChunk(filePath, 0, 4200)
  // Get the mime type of the file
  const mimeDetails = await FileType.fromBuffer(chunk)
  if (!mimeDetails) {
    // If the library was not able to parse the file, it is
    // most probably a txt, csv, etc. So return the file data
    // directly
    return await (await Fs.readFile(filePath)).toString('ascii')
  }

  // Check the mime type and call the appropriate function
  switch (mimeDetails.mime) {
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return await parseTextFromWordFile(filePath)
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      return await parseTextFromPptFile(filePath)
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return await parseTextFromExcelFile(filePath)
    case 'application/pdf':
      return await parseTextFromPdfFile(filePath)
    default:
      throw new Error(
        `Unsupported mime type ${mimeDetails.mime} (.${mimeDetails.ext})`
      )
  }
}

// MARK: Exports

// Export the function as the default export
module.exports = extractText
