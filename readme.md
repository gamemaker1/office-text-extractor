# Text Extraction from MS Office and PDF files

[![Node.js Tests](https://github.com/gamemaker1/office-text-extractor/actions/workflows/ci.yaml/badge.svg)](https://github.com/gamemaker1/office-text-extractor/actions/workflows/ci.yaml)

Yet another library to extract text from MS Office (`docx`, `pptx`, `xlsx`) and PDF (`pdf`) files.

## Similar libraries

There are other great libraries that do the same job and have inspired this project, such as:

- [`any-text`](https://github.com/abhinaba-ghosh/any-text)
- [`officeparser`](https://github.com/harshankur/officeParser)
- [`textract`](https://www.npmjs.com/package/textract)

### How this is different from other text extraction tools

- Parses file based on mime type, not file extension
- Does not spawn a child process to use a tool installed on the device
- Reads and returns text from file if it is a simple text file

## Libraries used

This module uses some amazing existing libraries that perform better than the ones that originally existed in this module, and are therefore used instead:

- [`pdf-parse`](https://www.npmjs.com/package/pdf-parse), for parsing PDF files
- [`xlsx`](https://www.npmjs.com/package/xlsx), for parsing MS Excel files
- [`mammoth`](https://www.npmjs.com/package/mammoth), for parsing MS Word files

This module also uses:

- [`xml2js`](https://www.npmjs.com/package/xml2js) - to convert the MS Office XML files into JSON
- [`js-yaml`](https://www.npmjs.com/package/js-yaml) - to convert JSON into YAML
- [`file-type`](https://www.npmjs.com/package/file-type) - to detect the mime type of files
- [`decompress`](https://www.npmjs.com/package/decompress) - to unzip files
- [`read-chunk`](https://www.npmjs.com/package/read-chunk) - to read chunks of data from large files

A big thank you to the contributors of these projects.

## Installation

To use this in an npm project, simply type in:

```sh
npm install office-text-extractor
```

**There is no support for browser environments yet. If you want to add support, please feel free to [open a pull request](https://github.com/gamemaker1/office-text-extractor/pulls).**

## Usage

```js
// Importing the library:

// CommonJS import
const extractText = require('office-text-extractor');

// ES/TS import
import extractText from 'office-text-extractor';

// Extracting text:

// Async-await way
const text = await extractText('path/to/file');
console.log(text);

// Promise way
extractText('path/to/file');
  .then((text) => {
    console.log(text);
  })
  .catch((err) => {
    console.error(err);
  })
```

## Tests

To run tests (using Ava), type the following:

```sh
npm test
```

## Todos

- [x] ~~Add tests~~
- [x] ~~Add typescript typings~~
- [ ] Add callback support
- [ ] Add support for Open Office formats
- [ ] Add support for browser environments

If you want to help out, please do [open a pull request](https://github.com/gamemaker1/office-text-extractor/pulls).

## License - ISC

Copyright (c) 2021, Vedant K (gamemaker1) <gamemaker0042@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
