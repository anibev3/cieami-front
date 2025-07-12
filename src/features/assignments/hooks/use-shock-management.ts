import { useState, useCallback, useEffect } from 'react'

export interface ShockWork {
  uid: string
  supply_id: number
  disassembly: boolean
  replacement: boolean
  repair: boolean
  paint: boolean
  control: boolean
  comment: string
  obsolescence_rate: number
  recovery_rate: number
  discount: number
  amount: number
  // Données calculées
  obsolescence_amount_excluding_tax?: number
  obsolescence_amount_tax?: number
  obsolescence_amount?: number
  recovery_amount_excluding_tax?: number
  recovery_amount_tax?: number
  recovery_amount?: number
  new_amount_excluding_tax?: number
  new_amount_tax?: number
  new_amount?: number
}

export interface Workforce {
  uid: string
  workforce_type_id: number
  workforce_type_label: string
  nb_hours: number
  work_fee: string
  discount: number
  amount_excluding_tax: number
  amount_tax: number
  amount: number
}

export interface Shock {
  uid: string
  shock_point_id: number
  shock_works: ShockWork[]
  paint_type_id: number
  hourly_rate_id: number
  workforces: Workforce[]
  comment: string
  with_tax: boolean
}

export function useShockManagement(initialShocks?: Shock[]) {
  const [shocks, setShocks] = useState<Shock[]>([])

  // Initialiser avec des données pré-remplies
  useEffect(() => {
    if (initialShocks && initialShocks.length > 0) {
      setShocks(initialShocks)
    }
  }, [initialShocks])

  // Ajouter un point de choc
  const addShock = useCallback((shockPointId: number) => {
    if (!shockPointId) return

    const newShock: Shock = {
      uid: crypto.randomUUID(),
      shock_point_id: shockPointId,
      shock_works: [],
      paint_type_id: 1,
      hourly_rate_id: 1,
      workforces: [],
      comment: '',
      with_tax: false
    }
    
    setShocks(prev => [newShock, ...prev])
    return newShock
  }, [])

  // Supprimer un point de choc
  const removeShock = useCallback((index: number) => {
    setShocks(prev => prev.filter((_, i) => i !== index))
  }, [])

  // Mettre à jour un point de choc
  const updateShock = useCallback((index: number, updatedShock: Shock) => {
    setShocks(prev => prev.map((shock, i) => i === index ? updatedShock : shock))
  }, [])

  // Ajouter une fourniture à un point de choc
  const addShockWork = useCallback((shockIndex: number) => {
    const newWork: ShockWork = {
      uid: crypto.randomUUID(),
      supply_id: 0,
      disassembly: false,
      replacement: false,
      repair: false,
      paint: false,
      control: false,
      comment: '',
      obsolescence_rate: 0,
      recovery_rate: 0,
      discount: 0,
      amount: 0
    }
    
    setShocks(prev => prev.map((shock, i) => 
      i === shockIndex 
        ? { ...shock, shock_works: [...shock.shock_works, newWork] }
        : shock
    ))
  }, [])

  // Supprimer une fourniture d'un point de choc
  const removeShockWork = useCallback((shockIndex: number, workIndex: number) => {
    setShocks(prev => prev.map((shock, i) => 
      i === shockIndex 
        ? { ...shock, shock_works: shock.shock_works.filter((_, wi) => wi !== workIndex) }
        : shock
    ))
  }, [])

  // Mettre à jour une fourniture
  const updateShockWork = useCallback((shockIndex: number, workIndex: number, field: keyof ShockWork, value: unknown) => {
    setShocks(prev => prev.map((shock, i) => 
      i === shockIndex 
        ? {
            ...shock,
            shock_works: shock.shock_works.map((work, wi) => 
              wi === workIndex 
                ? { ...work, [field]: value }
                : work
            )
          }
        : shock
    ))
  }, [])

  // Ajouter de la main d'œuvre à un point de choc
  const addWorkforce = useCallback((shockIndex: number) => {
    const newWorkforce: Workforce = {
      uid: crypto.randomUUID(),
      workforce_type_id: 0,
      workforce_type_label: '',
      nb_hours: 0,
      work_fee: '0',
      discount: 0,
      amount_excluding_tax: 0,
      amount_tax: 0,
      amount: 0
    }
    
    setShocks(prev => prev.map((shock, i) => 
      i === shockIndex 
        ? { ...shock, workforces: [...shock.workforces, newWorkforce] }
        : shock
    ))
  }, [])

  // Supprimer de la main d'œuvre d'un point de choc
  const removeWorkforce = useCallback((shockIndex: number, workforceIndex: number) => {
    setShocks(prev => prev.map((shock, i) => 
      i === shockIndex 
        ? { ...shock, workforces: shock.workforces.filter((_, wi) => wi !== workforceIndex) }
        : shock
    ))
  }, [])

  // Mettre à jour de la main d'œuvre
  const updateWorkforce = useCallback((shockIndex: number, workforceIndex: number, field: keyof Workforce, value: unknown) => {
    setShocks(prev => prev.map((shock, i) => 
      i === shockIndex 
        ? {
            ...shock,
            workforces: shock.workforces.map((workforce, wi) => 
              wi === workforceIndex 
                ? { ...workforce, [field]: value }
                : workforce
            )
          }
        : shock
    ))
  }, [])

  return {
    shocks,
    setShocks,
    addShock,
    removeShock,
    updateShock,
    addShockWork,
    removeShockWork,
    updateShockWork,
    addWorkforce,
    removeWorkforce,
    updateWorkforce
  }
} 