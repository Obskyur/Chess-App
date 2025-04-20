import { NextResponse } from 'next/server'

interface AuthorizedUser {
  phoneNumber: string
  displayName: string
}

// Store mapping in environment variables for security
const AUTHORIZED_USERS: AuthorizedUser[] = [
  { 
    phoneNumber: process.env.PHONE_NUMBER_1 || '',
    displayName: process.env.DISPLAY_NAME_1 || ''
  },
  { 
    phoneNumber: process.env.PHONE_NUMBER_2 || '',
    displayName: process.env.DISPLAY_NAME_2 || ''
  }
]

export async function POST(request: Request) {
  try {
    const { phoneNumber } = await request.json()
    const user = AUTHORIZED_USERS.find(u => u.phoneNumber === phoneNumber)
    
    if (!user) {
      return NextResponse.json({ isAuthorized: false }, { status: 403 })
    }

    return NextResponse.json({ 
      isAuthorized: true,
      displayName: user.displayName 
    }, { 
      status: 200 
    })
  } catch {
    return NextResponse.json({ error: 'Validation failed' }, { status: 500 })
  }
}