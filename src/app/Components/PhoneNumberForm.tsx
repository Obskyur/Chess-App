import Input from "@/app/components/ui/Input"
import Button from "@/app/components/ui/Button"

interface PhoneNumberFormProps {
  phoneNumber: string
  loading: boolean
  onSubmit: (e: React.FormEvent) => Promise<void>
  onChange: (value: string) => void
}

export default function PhoneNumberForm({ phoneNumber, loading, onSubmit, onChange }: PhoneNumberFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Phone Number"
        type="tel"
        id="phone-number"
        placeholder="+1 555 869 5309"
        value={phoneNumber}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
      />
      <div id="recaptcha-container" className="my-4" />
      <Button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send Code"}
      </Button>
    </form>
  )
}