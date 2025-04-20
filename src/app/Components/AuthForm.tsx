import { useState } from "react"
import { auth } from "@/lib/firebase"
import { signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential, updateProfile } from "firebase/auth"
import { useRecaptcha } from "@/hooks/useRecaptcha"
import PhoneNumberForm from "@/app/components/PhoneNumberForm"
import VerificationForm from "@/app/components/VerificationForm"

interface AuthState {
  phoneNumber: string
  displayName?: string
  verificationCode: string
  verificationId: string
  loading: boolean
  error: string
}

const initialAuthState: AuthState = {
  phoneNumber: "",
  verificationCode: "",
  verificationId: "",
  loading: false,
  error: ""
}

export default function AuthForm() {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState)
  
  useRecaptcha('recaptcha-container')

  const updateAuthState = (updates: Partial<AuthState>) => {
    setAuthState(prev => ({ ...prev, ...updates }))
  }

  const validatePhoneNumber = async (phoneNumber: string): Promise<{isValid: boolean, displayName?: string}> => {
    try {
      const response = await fetch('/api/auth/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      })
      const data = await response.json()
      return { 
        isValid: response.ok,
        displayName: data.displayName 
      }
    } catch {
      return { isValid: false }
    }
  }

  const handlePhoneSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    
    const { isValid, displayName } = await validatePhoneNumber(authState.phoneNumber)
    if (!isValid) {
      updateAuthState({ error: "You're not my mom! 😠" })
      return
    }

    await executeAuthAction(async () => {
      const result = await signInWithPhoneNumber(
        auth, 
        authState.phoneNumber,
        window.recaptchaVerifier
      )
      updateAuthState({ 
        verificationId: result.verificationId,
        displayName 
      })
    })
  }

  const handleCodeVerification = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    await executeAuthAction(async () => {
      const credential = PhoneAuthProvider.credential(
        authState.verificationId, 
        authState.verificationCode
      )
      const userCredential = await signInWithCredential(auth, credential)
      
      if (userCredential.user && authState.displayName) {
        if (userCredential.user && authState.displayName) {
          await updateProfile(userCredential.user, {
            displayName: authState.displayName
          })
        }
      }
    })
  }

  const executeAuthAction = async (authAction: () => Promise<void>): Promise<void> => {
    updateAuthState({ error: "", loading: true })
    try {
      await authAction()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Authentication failed"
      updateAuthState({ error: errorMessage })
    } finally {
      updateAuthState({ loading: false })
    }
  }

  const handleInputChange = (field: keyof AuthState) => (value: string) => {
    updateAuthState({ [field]: value })
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-bg-light rounded-lg shadow-lg">
      {!authState.verificationId ? (
        <PhoneNumberForm
          phoneNumber={authState.phoneNumber}
          loading={authState.loading}
          onSubmit={handlePhoneSubmit}
          onChange={handleInputChange('phoneNumber')}
        />
      ) : (
        <VerificationForm
          verificationCode={authState.verificationCode}
          loading={authState.loading}
          onSubmit={handleCodeVerification}
          onChange={handleInputChange('verificationCode')}
        />
      )}
      {authState.error && (
        <p className="mt-4 text-red-500 text-sm text-center" role="alert">
          {authState.error}
        </p>
      )}
    </div>
  )
}
