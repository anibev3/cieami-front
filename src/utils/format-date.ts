export function formatDate(dateString: string): string {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  
  if (isNaN(date.getTime())) {
    return dateString
  }
  
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatDateOnly(dateString: string): string {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  
  if (isNaN(date.getTime())) {
    return dateString
  }
  
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export function formatTimeOnly(dateString: string): string {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  
  if (isNaN(date.getTime())) {
    return dateString
  }
  
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
} 