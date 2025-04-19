import { NextResponse } from 'next/server'

const AUTHORIZED_NUMBERS = process.env.AUTHORIZED_PHONE_NUMBERS?.split(',') || []

export async function POST(request: Request) {
  try {
    const { phoneNumber } = await request.json()
    const isAuthorized = AUTHORIZED_NUMBERS.includes(phoneNumber)

    return NextResponse.json({ 
      isAuthorized 
    }, { 
      status: isAuthorized ? 200 : 403 
    })
  } catch {
    return NextResponse.json({ error: 'Validation failed' }, { status: 500 })
  }
}