import { useEffect } from 'react'
import { auth } from "@/lib/firebase"
import { RecaptchaVerifier } from "firebase/auth"

export function useRecaptcha(containerId: string) {
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'normal',
        callback: () => {
          // reCAPTCHA solved
        }
      })
    }
  }, [containerId])
}