import { useState, useCallback, useEffect } from 'react'

interface OtherCost {
  other_cost_type_id: number
  amount: number
}

export function useOtherCosts(initialOtherCosts?: OtherCost[]) {
  const [otherCosts, setOtherCosts] = useState<OtherCost[]>([
    { other_cost_type_id: 0, amount: 0 }
  ])

  // Initialiser avec des données pré-remplies
  useEffect(() => {
    if (initialOtherCosts && initialOtherCosts.length > 0) {
      setOtherCosts(initialOtherCosts)
    }
  }, [initialOtherCosts])

  // Ajouter un coût autre
  const addOtherCost = useCallback(() => {
    setOtherCosts(prev => [...prev, { other_cost_type_id: 0, amount: 0 }])
  }, [])

  // Supprimer un coût autre
  const removeOtherCost = useCallback((index: number) => {
    setOtherCosts(prev => prev.filter((_, i) => i !== index))
  }, [])

  // Mettre à jour un coût autre
  const updateOtherCost = useCallback((index: number, field: keyof OtherCost, value: number) => {
    setOtherCosts(prev => prev.map((cost, i) => 
      i === index ? { ...cost, [field]: value } : cost
    ))
  }, [])

  // Nettoyer les coûts autres (supprimer les doublons et les entrées vides)
  const cleanOtherCosts = useCallback(() => {
    return otherCosts
      .filter(cost => cost.other_cost_type_id && cost.other_cost_type_id !== 0)
      .reduce((acc, cost) => {
        const existingIndex = acc.findIndex(c => c.other_cost_type_id === cost.other_cost_type_id)
        if (existingIndex === -1) {
          acc.push(cost)
        } else {
          acc[existingIndex] = cost
        }
        return acc
      }, [] as OtherCost[])
  }, [otherCosts])

  return {
    otherCosts,
    setOtherCosts,
    addOtherCost,
    removeOtherCost,
    updateOtherCost,
    cleanOtherCosts
  }
} 