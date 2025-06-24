import { createFileRoute } from '@tanstack/react-router'
import TarifsProduitsPeinturePage from '@/features/reparation/tarifs-produits-peinture'

export const Route = createFileRoute('/_authenticated/reparation/tarifs-produits-peinture')({
  component: TarifsProduitsPeinturePage,
}) 