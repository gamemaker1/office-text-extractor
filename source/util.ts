// source/util.ts
// Utility functions to help with the handling of input.

import { readFile as read } from 'node:fs/promises'
import { got as fetch } from 'got'
import { type Buffer } from 'buffer/'

export const readFile = async (filePath: string): Promise<Buffer> =>
	(await read(filePath)) as unknown as Buffer
export const fetchUrl = async (url: string): Promise<Buffer> =>
	(await fetch(url).buffer()) as unknown as Buffer
