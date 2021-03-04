# Text Extraction from MS Office and PDF files

Yet another library to extract text from MS Office (`docx`, `pptx`, `xlsx`) and PDF (`pdf`) files.

## How this is different from other text extraction tools

- Parses file based on mime type, not file extension
- Does not spawn a child process to use a tool installed on the device
- Reads and returns text from file if it is a simple text file

## Installation

To use this in an npm project, simply type in:

```sh
npm install git+https://github.com/gamemaker1/office-text-extractor
```

**Notes:**

- NPM Publish in progress
- No support for browser environments yet. If you want to add support, please feel free to open a pull request.
- To parse PDFs, this module uses the amazing `pdf-parse` npm package.
- To parse Excel files, this module uses the amazing `xlsx` npm package.

## Usage

```js
// Importing the library:

// CommonJS import
const { extractText } = require('office-text-extractor');

// ES import
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

## Todos

- Publish to NPM (in progress)
- Add tests
- Add callback support
- Add support for Open Office formats
- Add support for browser environments

If you want to help out, please do [open a pull request](https://github.com/gamemaker1/office-text-extractor/pulls).

## License - ISC

Copyright (c) 2021, gamemaker1

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
