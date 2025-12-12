import { TheoreticalValueCalculator } from '@/features/gestion/depreciation-tables/components/theoretical-value-calculator'
import { TheoreticalValueResult } from '@/features/gestion/depreciation-tables/components/theoretical-value-result'
import { useDepreciationTablesStore } from '@/stores/depreciationTablesStore'
import { Calculator } from 'lucide-react'

import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function TheoreticalValuePageContent() {
  const { theoreticalValueResult } = useDepreciationTablesStore()

  return (
    <>
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Calcul de valeur vénale théorique</h2>
            <p className='text-muted-foreground'>
              Calculez la valeur vénale théorique d'un véhicule basée sur les tableaux de dépréciation
            </p>
          </div>
        </div>
        
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <TheoreticalValueCalculator />
          <div className="lg:col-span-1">
            {theoreticalValueResult ? (
              <TheoreticalValueResult result={theoreticalValueResult} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Remplissez le formulaire et cliquez sur "Calculer" pour voir les résultats</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Main>
    </>
  )
}

export default function TheoreticalValuePage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_DEPRECIATION_TABLE}>
      <TheoreticalValuePageContent />
    </ProtectedRoute>
  )
} 