# <div align="center"> `office-text-extractor` </div>

<div align="center">
	<img alt="Github Workflow Status" src="https://img.shields.io/github/workflow/status/gamemaker1/office-text-extractor/CI"/>
	<img alt="GitHub Stars" src="https://img.shields.io/github/stars/gamemaker1/office-text-extractor"/>
</div>
<br>

> Yet another library to extract text from MS Office (`docx`, `pptx`, `xlsx`) and PDF (`pdf`) files.

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
- [`decompress`](https://www.npmjs.com/package/decompress) - to unzip files
- [`read-chunk`](https://www.npmjs.com/package/read-chunk) - to read chunks of
  data from large files

A big thank you to the contributors of these projects!

## Installation

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

## Usage

```js
import { extractText } from 'office-text-extractor'

// Extract the text using `async-await`.
const text = await extractText('path/to/file')
console.log(text)

// Extract the text using Promises.
extractText('path/to/file')
	.then((text) => console.log(text))
	.catch((error) => console.error(error))
```

> **Note**
>
> There is no support for browser environments yet. If you want to add support,
> please feel free to
> [open a pull request](https://github.com/gamemaker1/office-text-extractor/pulls).

## License

This project is licensed under the ISC license. Please see
[`license.md`](./license.md) for more details.
