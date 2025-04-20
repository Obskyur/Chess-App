'use client'

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { ReactNode } from "react";
import AuthForm from "@/app/components/AuthForm";

interface AuthenticatorProps {
  children: ReactNode;
}

export default function AuthWrapper({ children }: AuthenticatorProps) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Please sign in to continue</h1>
          <AuthForm />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}