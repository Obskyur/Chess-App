import { NextResponse } from 'next/server'

const AUTHORIZED_NUMBERS = process.env.AUTHORIZED_PHONE_NUMBERS?.split(',') || []

export async function POST(request: Request) {
  try {
    const { phoneNumber } = await request.json()
    
    // Add logging to debug the values
    console.log('Received phone number:', phoneNumber)
    console.log('Authorized numbers:', AUTHORIZED_NUMBERS)
    
    const isAuthorized = AUTHORIZED_NUMBERS.includes(phoneNumber)
    
    // Log the result
    console.log('Is authorized:', isAuthorized)

    return NextResponse.json({ 
      isAuthorized 
    }, { 
      status: isAuthorized ? 200 : 403 
    })
  } catch (error) {
    console.error('Validation error:', error)
    return NextResponse.json({ error: 'Validation failed' }, { status: 500 })
  }
}