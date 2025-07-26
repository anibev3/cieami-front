/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'

interface CalculationResult {
  shocks: unknown[]
  other_costs: unknown[]
  shock_works?: any[]
  workforces?: any[]
  // Montants globaux des chocs
  total_shock_amount_excluding_tax?: number
  total_shock_amount_tax?: number
  total_shock_amount?: number
  // Montants globaux de la main d'œuvre
  total_workforce_amount_excluding_tax?: number
  total_workforce_amount_tax?: number
  total_workforce_amount?: number
  // Montants globaux des produits peinture
  total_paint_product_amount_excluding_tax?: number
  total_paint_product_amount_tax?: number
  total_paint_product_amount?: number
  // Montants globaux des petites fournitures
  total_small_supply_amount_excluding_tax?: number
  total_small_supply_amount_tax?: number
  total_small_supply_amount?: number
  // Montants globaux des autres coûts
  total_other_costs_amount_excluding_tax?: number
  total_other_costs_amount_tax?: number
  total_other_costs_amount?: number
  // Montants globaux totaux
  shocks_amount_excluding_tax?: number
  shocks_amount_tax?: number
  shocks_amount?: number
  total_amount_excluding_tax?: number
  total_amount_tax?: number
  total_amount?: number
  // Nouveaux champs basés sur la réponse de l'API
  total_obsolescence_amount_excluding_tax?: number
  total_obsolescence_amount_tax?: number
  total_obsolescence_amount?: number
  total_recovery_amount_excluding_tax?: number
  total_recovery_amount_tax?: number
  total_recovery_amount?: number
  total_discount_amount_excluding_tax?: number
  total_discount_amount_tax?: number
  total_discount_amount?: number
  total_new_amount_excluding_tax?: number
  total_new_amount_tax?: number
  total_new_amount?: number
}

interface Shock {
  uid: string
  shock_point_id: number
  shock_works: unknown[]
  paint_type_id: number
  hourly_rate_id: number
  workforces: unknown[]
  comment: string
  with_tax: boolean
}

interface OtherCost {
  other_cost_type_id: number
  amount: number
}

export function useCalculations() {
  const [calculationResults, setCalculationResults] = useState<{ [key: number]: CalculationResult }>({})
  const [loadingCalculation, setLoadingCalculation] = useState(false)

  // Calculer globalement tous les points de choc
  const calculateAll = useCallback(async (shocks: Shock[], otherCosts: OtherCost[]) => {
    if (shocks.length === 0) {
      toast.error('Ajoutez au moins un point de choc avant de calculer')
      return false
    }

    setLoadingCalculation(true)

    try {
      const payload = {
        fournitures: [],
        shocks: shocks.map(shock => ({
          shock_point_id: shock.shock_point_id,
          shock_works: shock.shock_works.map((work: any) => ({
            supply_id: work.supply_id,
            disassembly: work.disassembly,
            replacement: work.replacement,
            repair: work.repair,
            paint: work.paint,
            control: work.control,
            obsolescence: work.obsolescence || false,
            comment: work.comment,
            obsolescence_rate: work.obsolescence_rate,
            recovery_amount: work.recovery_amount || work.recovery_amoun || 0,
            amount: work.amount
          })),
          paint_type_id: shock.paint_type_id,
          hourly_rate_id: shock.hourly_rate_id,
          workforces: shock.workforces.map((workforce: any) => ({
            workforce_type_id: workforce.workforce_type_id,
            nb_hours: workforce.nb_hours,
            discount: workforce.discount
          })),
          with_tax: shock.with_tax
        })),
        other_costs: otherCosts.map(cost => ({
          other_cost_type_id: Number(cost.other_cost_type_id),
          amount: Number(cost.amount)
        }))
      }

      const response = await axiosInstance.post(`${API_CONFIG.ENDPOINTS.CALCULATIONS}`, payload)
      
      // Mettre à jour les résultats de calcul avec les montants globaux de l'API
      const newResults: { [key: number]: CalculationResult } = {}
      if (response.data.data.shocks && response.data.data.shocks.length > 0) {
        response.data.data.shocks.forEach((apiShock: any, index: number) => {
          newResults[index] = {
            ...response.data.data, // Inclure tous les montants globaux
            shocks: response.data.data.shocks,
            other_costs: response.data.data.other_costs,
            shock_works: apiShock.shock_works,
            workforces: apiShock.workforces
          }
        })
      }
      
      setCalculationResults(newResults)
      
      toast.success(`Calcul global effectué pour ${Object.keys(newResults).length} point(s) de choc`)
      return true
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erreur lors du calcul global:', error)
      toast.error('Erreur lors du calcul global')
      return false
    } finally {
      setLoadingCalculation(false)
    }
  }, [])

  // Supprimer un calcul
  const removeCalculation = useCallback((index: number) => {
    setCalculationResults(prev => {
      const newResults = { ...prev }
      delete newResults[index]
      return newResults
    })
  }, [])

  // Mettre à jour un calcul
  const updateCalculation = useCallback((index: number, result: CalculationResult) => {
    setCalculationResults(prev => ({
      ...prev,
      [index]: result
    }))
  }, [])

  // Nettoyer tous les calculs
  const clearAllCalculations = useCallback(() => {
    setCalculationResults({})
  }, [])

  // Obtenir le nombre de calculs effectués
  const getCalculatedCount = useCallback(() => {
    return Object.keys(calculationResults).length
  }, [calculationResults])

  // Calculer le montant total de tous les calculs
  const getTotalAmount = useCallback(() => {
    return Object.values(calculationResults).reduce((total, result) => {
      return total + (result.total_amount || 0)
    }, 0)
  }, [calculationResults])

  return {
    calculationResults,
    loadingCalculation,
    calculateAll,
    removeCalculation,
    updateCalculation,
    clearAllCalculations,
    getCalculatedCount,
    getTotalAmount
  }
} 