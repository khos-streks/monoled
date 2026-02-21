'use client'

import { TextField } from '@prisma/client'
import React, { createContext, useContext } from 'react'

const TextContext = createContext<TextField[] | undefined>([])

export const useTexts = () => useContext(TextContext)

export function TextProvider({
	texts,
	children
}: {
	texts: TextField[] | undefined
	children: React.ReactNode
}) {
	return <TextContext.Provider value={texts}>{children}</TextContext.Provider>
}
