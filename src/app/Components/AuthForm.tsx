import { useState } from "react"
import { auth } from "@/lib/firebase"
import { signInWithPhoneNumber, RecaptchaVerifier, PhoneAuthProvider, signInWithCredential } from "firebase/auth"
import { useRecaptcha } from "@/hooks/useRecaptcha"
import PhoneNumberForm from "@/app/components/PhoneNumberForm"
import VerificationForm from "@/app/components/VerificationForm"

export default function AuthForm() {
  const [authState, setAuthState] = useState({
    phoneNumber: "",
    verificationCode: "",
    verificationId: "",
    loading: false,
    error: ""
  })

  useRecaptcha('recaptcha-container')

  const handlePhoneSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    await handleAuth(async () => {
      const result = await signInWithPhoneNumber(
        auth, 
        authState.phoneNumber,
        window.recaptchaVerifier
      )
      setAuthState(prev => ({ ...prev, verificationId: result.verificationId }))
    })
  }

  const handleCodeVerification = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    await handleAuth(async () => {
      const credential = PhoneAuthProvider.credential(
        authState.verificationId, 
        authState.verificationCode
      )
      await signInWithCredential(auth, credential)
    })
  }

  const handleAuth = async (authAction: () => Promise<void>): Promise<void> => {
    setAuthState(prev => ({ ...prev, error: "", loading: true }))
    try {
      await authAction()
    } catch (err) {
      setAuthState(prev => ({ 
        ...prev, 
        error: err instanceof Error ? err.message : "Authentication failed"
      }))
    }
    setAuthState(prev => ({ ...prev, loading: false }))
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-bg-light rounded-lg shadow-lg">
      {!authState.verificationId ? (
        <PhoneNumberForm
          phoneNumber={authState.phoneNumber}
          loading={authState.loading}
          onSubmit={handlePhoneSubmit}
          onChange={(value) => setAuthState(prev => ({ ...prev, phoneNumber: value }))}
        />
      ) : (
        <VerificationForm
          verificationCode={authState.verificationCode}
          loading={authState.loading}
          onSubmit={handleCodeVerification}
          onChange={(value) => setAuthState(prev => ({ ...prev, verificationCode: value }))}
        />
      )}
      {authState.error && (
        <p className="mt-4 text-red-500 text-sm text-center">{authState.error}</p>
      )}
    </div>
  )
}
