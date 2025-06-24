import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Assureur } from '../types'

type AssureursDialogType = 'create' | 'update' | 'delete' | 'view'

interface AssureursContextType {
  open: AssureursDialogType | null
  setOpen: (str: AssureursDialogType | null) => void
  currentRow: Assureur | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Assureur | null>>
}

const AssureursContext = React.createContext<AssureursContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function AssureursProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<AssureursDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Assureur | null>(null)
  return (
    <AssureursContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </AssureursContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAssureurs = () => {
  const assureursContext = React.useContext(AssureursContext)

  if (!assureursContext) {
    throw new Error('useAssureurs has to be used within <AssureursProvider>')
  }

  return assureursContext
} 