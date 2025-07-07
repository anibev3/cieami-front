import { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { AlertTriangle } from 'lucide-react'

interface CountdownAlertProps {
  label: string
  expireAt: string // ISO date string
}

function getTimeLeft(expireAt: string) {
  const now = new Date()
  const end = new Date(expireAt)
  const diff = end.getTime() - now.getTime()
  if (diff <= 0) return { expired: true, days: 0, hours: 0, minutes: 0 }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  return { expired: false, days, hours, minutes }
}

export function CountdownAlert({ label, expireAt }: CountdownAlertProps) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(expireAt))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(expireAt))
    }, 60000) // update every minute
    return () => clearInterval(interval)
  }, [expireAt])

  if (timeLeft.expired) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1 bg-red-100 text-red-800 border-red-300">
        <AlertTriangle className="h-4 w-4 mr-1" />
        {label} expiré
      </Badge>
    )
  }

  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 24

  return (
    <Badge
      variant={isUrgent ? 'destructive' : 'outline'}
      className={
        isUrgent
          ? 'flex items-center gap-1 bg-red-100 text-red-800 border-red-300 animate-pulse w-full'
          : 'flex items-center gap-1 bg-blue-100 text-blue-800 border-blue-300 w-full'
      }
    >
      {isUrgent && <AlertTriangle className="h-4 w-4 mr-1" />}
      {label} :
      {timeLeft.days > 0 && ` ${timeLeft.days}j`}
      {timeLeft.hours > 0 && ` ${timeLeft.hours}h`}
      {timeLeft.minutes > 0 && ` ${timeLeft.minutes}min`}
      {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && ' <1min'}
      { " " } restants
    </Badge>
  )
}

export default CountdownAlert; 