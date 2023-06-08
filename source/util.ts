// source/util.ts
// Utility functions to help with the handling of input.

import { type Buffer } from 'node:buffer'
import { readFile as read } from 'node:fs/promises'
import { got as fetch } from 'got'

export const readFile = async (filePath: string): Promise<Buffer> =>
	read(filePath)
export const fetchUrl = async (url: string): Promise<Buffer> =>
	fetch(url).buffer()
