import Input from "@/app/components/ui/Input"
import Button from "@/app/components/ui/Button"

interface VerificationFormProps {
  verificationCode: string
  loading: boolean
  onSubmit: (e: React.FormEvent) => Promise<void>
  onChange: (value: string) => void
}

export default function VerificationForm({ verificationCode, loading, onSubmit, onChange }: VerificationFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Verification Code"
        type="text"
        id="verification-code"
        placeholder="123456"
        value={verificationCode}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Verifying..." : "Verify Code"}
      </Button>
    </form>
  )
}