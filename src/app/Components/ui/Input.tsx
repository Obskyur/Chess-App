import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label htmlFor={props.id} className="text-fg font-medium">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`px-4 py-2 bg-bg-dark text-fg border border-accent rounded-md 
          focus:outline-none focus:ring-2 focus:ring-accent2 
          disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}