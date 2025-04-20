import { useEffect } from 'react'
import { auth } from "@/lib/firebase"
import { RecaptchaVerifier } from "firebase/auth"

export function useRecaptcha(containerId: string) {
  useEffect(() => {
    let verifier: RecaptchaVerifier | null = null;

    const setupRecaptcha = async () => {
      const container = document.getElementById(containerId)
      if (!container) return

      // Create new verifier only if one doesn't exist
      if (!window.recaptchaVerifier) {
        verifier = new RecaptchaVerifier(auth, containerId, {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved
          }
        })
        
        window.recaptchaVerifier = verifier
        await verifier.render()
      }
    }

    setupRecaptcha()

    return () => {
      if (verifier) {
        verifier.clear()
        window.recaptchaVerifier = null
      }
    }
  }, [containerId])
}