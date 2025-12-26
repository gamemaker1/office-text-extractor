// test/unit.ts
// This file contains the unit tests for the library.

import test from 'ava'
import esmock from 'esmock'
import encoding from 'text-encoding'

const { TextEncoder, TextDecoder } = encoding
const getTextExtractor = async (mocks = {}) => {
	const { TextExtractor } = await esmock('../source/lib.js', {
		'../source/util.js': {
			readFile: mocks.readFile ?? (async () => new Uint8Array()),
			fetchUrl: mocks.fetchUrl ?? (async () => new Uint8Array()),
		},
		'file-type': {
			fileTypeFromBuffer: mocks.getFileType ?? (async () => undefined),
		},
	})
	return new TextExtractor()
}

test('buffer with unknown mime', async (t) => {
	const extractor = await getTextExtractor()

	const input = 'may you live in interesting times'
	const buffer = new TextEncoder().encode(input)

	const result = await extractor.extractText({ type: 'buffer', input: buffer })
	t.is(result, input)
})

test('text input', async (t) => {
	const extractor = await getTextExtractor()

	const input = 'may you find what you are looking for'

	const result = await extractor.extractText({ type: 'buffer', input })
	t.is(result, input)
})

test('file input', async (t) => {
  const path = 'fairy.tale'
  const story = 'if you want a happy ending, that depends, of course, on where you stop your story'

	let capturedPath = ''
	const extractor = await getTextExtractor({
		readFile: async (path: string) => {
			capturedPath = path
			return new TextEncoder().encode(story)
		},
	})

	const result = await extractor.extractText({ type: 'file', input: path })
	t.is(result, story)
	t.is(capturedPath, path)
})

test('url input', async (t) => {
  const url = 'https://example.com'
  const note = 'fate has a way of putting in front of us, that which we most try to leave behind'

	let capturedUrl = ''
	const extractor = await getTextExtractor({
		fetchUrl: async (url: string) => {
			capturedUrl = url
			return new TextEncoder().encode(note)
		},
	})

	const result = await extractor.extractText({ type: 'url', input: url })
	t.is(result, note)
	t.is(capturedUrl, url)
})

test('method overrides', async (t) => {
	const extractor = await getTextExtractor({
		getFileType: async () => ({ mime: 'application/pdf' }),
	})

	extractor.addMethod({
		mimes: ['application/pdf'],
		apply: async () => 'the sky has fallen on our heads at last',
	})

	extractor.addMethod({
		mimes: ['application/pdf'],
		apply: async () => 'yay',
	})

	const result = await extractor.extractText({ type: 'buffer', input: new Uint8Array() })
	t.is(result, 'yay')
})

test('method chaining', async (t) => {
	const extractor = await getTextExtractor()
	const instance = extractor.addMethod({
	  mimes: ['guide/galaxy'], apply: async () => ''
	})

	t.is(instance, extractor)
})

test('error on missing method', async (t) => {
	const extractor = await getTextExtractor({
		getFileType: async () => ({ mime: 'image/png' }),
	})

	const error = await t.throwsAsync(
		extractor.extractText({ type: 'buffer', input: new Uint8Array() }),
	)
	t.regex(error?.message, /image\/png/)
})

test('error on missing node:fs', async (t) => {
	const { readFile } = await esmock('../source/util.js', {
		'node:fs/promises': null
	})

	const error = await t.throwsAsync(readFile('fairy.tale'))
	t.regex(error?.message, /node:fs/)
})

test('error on missing fetch', async (t) => {
	const { fetchUrl } = await import('../source/util.js')

	const originalFetch = globalThis.fetch
	// @ts-ignore
	globalThis.fetch = undefined

	const error = await t.throwsAsync(fetchUrl('https://example.com'))
	t.regex(error?.message, /fetch/)

	globalThis.fetch = originalFetch
})
