import { Input } from '@/components/ui/input'

interface DatePickerProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function DatePicker({
  value,
  onValueChange,
  placeholder = "Sélectionnez une date...",
  disabled = false
}: DatePickerProps) {
  return (
    <Input
      type="date"
      value={value || ''}
      onChange={(e) => onValueChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full"
    />
  )
} 