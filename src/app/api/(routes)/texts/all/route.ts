import { handleApiError } from '@/app/api/exceptions/handleApiError'
import { prisma } from '@/prisma/prisma-client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const texts = await prisma.textField.findMany()
    return NextResponse.json(texts, { status: 200 })
  } catch (error) {
    return handleApiError(error)
  }
}
