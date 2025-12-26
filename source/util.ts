// source/util.ts
// Utility functions to help with the handling of input.

import { readFile as read } from 'node:fs/promises'

export const readFile = async (filePath: string): Promise<Uint8Array> =>
	read(filePath)
export const fetchUrl = async (url: string): Promise<Uint8Array> =>
	(await fetch(url)).bytes()
