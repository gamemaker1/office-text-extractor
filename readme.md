# <div align="center"> `office-text-extractor` </div>

<div align="center">
	<img alt="Github Workflow Status" src="https://img.shields.io/github/actions/workflow/status/gamemaker1/office-text-extractor/ci.yaml"/>
	<img alt="GitHub Stars" src="https://img.shields.io/github/stars/gamemaker1/office-text-extractor"/>
</div>
<br>

> Yet another library to extract text from MS Office (`docx`, `pptx`, `xlsx`)
> and PDF (`pdf`) files.

## Similar projects

There are other great projects that do the same job and have inspired this
project, such as:

- [`any-text`](https://github.com/abhinaba-ghosh/any-text)
- [`officeparser`](https://github.com/harshankur/officeParser)
- [`textract`](https://www.npmjs.com/package/textract)

### How is this project different?

- Parses file based on its mime type, not its file extension.
- Does not spawn a child process to use a tool installed on the device.
- Reads and returns text from the file if it contains plain text.

## Libraries used

This module uses some amazing existing libraries that perform better than the
ones that originally existed in this module, and are therefore used instead:

- [`pdf-parse`](https://www.npmjs.com/package/pdf-parse), for parsing PDF files
- [`xlsx`](https://www.npmjs.com/package/xlsx), for parsing MS Excel files
- [`mammoth`](https://www.npmjs.com/package/mammoth), for parsing MS Word files

This module also uses:

- [`xml2js`](https://www.npmjs.com/package/xml2js) - to convert the MS Office
  XML files into JSON
- [`js-yaml`](https://www.npmjs.com/package/js-yaml) - to convert JSON into YAML
- [`file-type`](https://www.npmjs.com/package/file-type) - to detect the mime
  type of files
- [`fflate`](https://www.npmjs.com/package/fflate) - to unzip files

A big thank you to the contributors of these projects!

## Installation

#### NodeJs

> **Note**
>
> This package is now pure ESM (from version 2.0.0 onwards). Please read
> [this article](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)
> for a guide on how to ensure your project can import this library.

To use this in an Node project, install it using `npm`/`pnpm`/`yarn`:

```sh
# Using npm
> npm install office-text-extractor

# Using pnpm
> pnpm add office-text-extractor

# Using yarn
> yarn add office-text-extractor
```

#### Browser

To use this package in the browser, fetch it using your preferred CDN:

```tsx
<script src="https://unpkg.com/office-text-extractor@latest/build/index.js"></script>
```

## Usage

```ts
import { getTextExtractor } from 'office-text-extractor'

// Create a new instance of the extractor.
const extractor = getTextExtractor()

// Extract text from a URL, file or buffer.
const location =
	'https://raw.githubusercontent.com/gamemaker1/office-text-extractor/rewrite/test/fixtures/docs/pptx.pptx'
const text = await extractor.extractText({
	input: location, // this can be a file path or a buffer
	type: 'url', // this is can be 'url', 'file' or 'buffer'
})

console.log(text)
```

## License

This project is licensed under the ISC license. Please see
[`license.md`](./license.md) for more details.
