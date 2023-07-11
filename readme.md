# <div align="center"> office-text-extractor </div>

<div align="center">

yet another library to extract text from docx, pptx, xlsx, and pdf files.

</div>

## similar libraries

there are other great libraries that do the same job and have inspired this
project, such as:

- [`any-text`](https://github.com/abhinaba-ghosh/any-text)
- [`officeparser`](https://github.com/harshankur/officeParser)
- [`textract`](https://www.npmjs.com/package/textract)

however, office-text-extractor has the following differences:

- parses file based on its **mime type**, not its file extension.
- **does not spawn** a child process to use a tool installed on the device.
- reads and returns text from the file if it contains **plain text**.

## libraries used

this package uses some amazing existing libraries that perform better than the
ones that originally existed in this module, and are therefore used instead:

- [`pdf-parse`](https://www.npmjs.com/package/pdf-parse), for parsing pdf files
- [`xlsx`](https://www.npmjs.com/package/xlsx), for parsing xlsx files
- [`mammoth`](https://www.npmjs.com/package/mammoth), for parsing docx files

a big thank you to the contributors of these projects!

## installation

#### node

> from version 2.0.0 onwards, this package is pure esm. please read
> [this article](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)
> for a guide on how to ensure your project can import this library.

to use office-text-extractor in an Node project, install it using `npm`/`pnpm`/`yarn`:

```sh
> npm install office-text-extractor
> pnpm add office-text-extractor
> yarn add office-text-extractor
```

#### browser

to use this package in the browser, fetch it using your preferred cdn:

```tsx
<script src="https://unpkg.com/office-text-extractor@latest/build/index.js"></script>
```

## usage

an example of using the library to extract text is as follows:

```ts
import { readFile } from 'node:fs/promises'
import { getTextExtractor } from 'office-text-extractor'

// this function returns a new instance of the `TextExtractor` class, with the default
// extraction methods (docx, pptx, xlsx, pdf) registered.
const extractor = getTextExtractor()

// extract text from a url, because that's a neat first example :p
const url = 'https://raw.githubusercontent.com/gamemaker1/office-text-extractor/rewrite/test/fixtures/docs/pptx.pptx'
const text = await extractor.extractText({ input: url, type: 'url' })

// you can extract text from a file too, like so:
const path = 'stuff/boring.pdf'
const text = await extractor.extractText({ input: path, type: 'file' })

// if you have a buffer with the file in it, you can pass that too:
const buffer = await readFile(path)
const text = await extractor.extractText({ input: buffer, type: 'buffer' })

console.log(text)
```

## license

this project is licensed under the ISC license. Please see [`license.md`](./license.md)
for more details.
