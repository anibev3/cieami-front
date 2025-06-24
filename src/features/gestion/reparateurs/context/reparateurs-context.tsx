import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Reparateur } from '../types'

type ReparateursDialogType = 'create' | 'update' | 'delete' | 'view'

interface ReparateursContextType {
  open: ReparateursDialogType | null
  setOpen: (str: ReparateursDialogType | null) => void
  currentRow: Reparateur | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Reparateur | null>>
}

const ReparateursContext = React.createContext<ReparateursContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function ReparateursProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<ReparateursDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Reparateur | null>(null)
  return (
    <ReparateursContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ReparateursContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useReparateurs = () => {
  const reparateursContext = React.useContext(ReparateursContext)

  if (!reparateursContext) {
    throw new Error('useReparateurs has to be used within <ReparateursProvider>')
  }

  return reparateursContext
} 