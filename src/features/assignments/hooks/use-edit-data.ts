import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'

interface ShockPoint {
  id: number
  label: string
  code: string
}

interface Supply {
  id: number
  label: string
  code: string
  price: number
}

interface WorkforceType {
  id: number
  label: string
  code: string
  hourly_rate: number
}

interface OtherCostType {
  id: number
  label: string
  code: string
}

interface PaintType {
  id: number
  label: string
  code: string
}

interface HourlyRate {
  id: number
  label: string
  value: string
}

export function useEditData() {
  const [loading, setLoading] = useState(false)
  const [shockPoints, setShockPoints] = useState<ShockPoint[]>([])
  const [supplies, setSupplies] = useState<Supply[]>([])
  const [workforceTypes, setWorkforceTypes] = useState<WorkforceType[]>([])
  const [otherCostTypes, setOtherCostTypes] = useState<OtherCostType[]>([])
  const [paintTypes, setPaintTypes] = useState<PaintType[]>([])
  const [hourlyRates, setHourlyRates] = useState<HourlyRate[]>([])

  // Charger toutes les données de référence
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Charger les points de choc
      const shockPointsResponse = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.SHOCK_POINTS}?per_page=50`)
      setShockPoints(shockPointsResponse.data.data)
      
      // Charger les fournitures
      const suppliesResponse = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.SUPPLIES}?per_page=50`)
      setSupplies(suppliesResponse.data.data)
      
      // Charger les types de main d'œuvre
      const workforceTypesResponse = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.WORKFORCE_TYPES}?per_page=50`)
      setWorkforceTypes(workforceTypesResponse.data.data)
      
      // Charger les types de coûts autres
      const otherCostTypesResponse = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.OTHER_COST_TYPES}?per_page=50`)
      setOtherCostTypes(otherCostTypesResponse.data.data)
      
      // Charger les types de peinture
      const paintTypesResponse = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.PAINT_TYPES}?per_page=50`)
      setPaintTypes(paintTypesResponse.data.data)
      
      // Charger les taux horaires
      const hourlyRatesResponse = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.HOURLY_RATES}?per_page=50`)
      setHourlyRates(hourlyRatesResponse.data.data)
      
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erreur lors du chargement des données:', error)
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }, [])

  // Charger les données au montage
  useEffect(() => {
    loadData()
  }, [loadData])

  return {
    loading,
    shockPoints,
    supplies,
    workforceTypes,
    otherCostTypes,
    paintTypes,
    hourlyRates,
    reloadData: loadData
  }
} 