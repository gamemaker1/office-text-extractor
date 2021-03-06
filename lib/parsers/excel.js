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

// Library to convert XLSX files to JSON (we refer to the
// methods directly)
const convertXlsxToJson = require('xlsx').readFile
const convertSheetToJson = require('xlsx').utils.sheet_to_json
// Library to convert the JSON to YAML, as it looks better
const convertToYaml = require('js-yaml').dump

// MARK: Functions

// The parse function
async function parseTextFromExcelFile(filePath) {
  // Convert it to JSON
  const jsonWorkbook = convertXlsxToJson(filePath)
  // Get the names of all the sheets
  const sheets = jsonWorkbook.SheetNames

  // Loop through the sheets and return nicely formatted text
  let formattedText = ''
  for (let i = 0; i < sheets.length; i++) {
    // Add the sheet separator
    formattedText += '===\n'
    // Convert the sheet to JSON
    const sheetJson = convertSheetToJson(jsonWorkbook.Sheets[sheets[i]])
    // For each row in the JSON, convert it to YAML
    sheetJson.forEach((res) => {
      // Add the row separator
      formattedText += '---\n'
      // Add the YAML formatted text
      formattedText += convertToYaml(res)
        // If the column header is empty, the YAML converter replaces it with '__EMPTY'.
        // Replace that with just underscore + the column number instead
        .replace(/__EMPTY*:/g, ':')
        .replace(/__EMPTY_[0-9]?:/g, ':')
    })
  }

  // Return the nicely formatted text (sheets are separated by ===, rows by ---)
  return formattedText
}

// MARK: Exports

// Export it
exports.parseTextFromExcelFile = parseTextFromExcelFile
