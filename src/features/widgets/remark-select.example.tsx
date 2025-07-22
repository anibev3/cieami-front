import { useState } from 'react'
import { RemarkSelect } from './remark-select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export function RemarkSelectExample() {
  const [selectedRemark1, setSelectedRemark1] = useState<number | null>(null)
  const [selectedRemark2, setSelectedRemark2] = useState<number | null>(null)
  const [selectedRemark3, setSelectedRemark3] = useState<number | null>(null)

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Exemples d'utilisation de RemarkSelect</h1>
      
      {/* Exemple basique */}
      <Card>
        <CardHeader>
          <CardTitle>Sélection basique</CardTitle>
          <CardDescription>
            Sélection simple d'une remarque d'expert
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Remarque d'expert</Label>
            <RemarkSelect
              value={selectedRemark1}
              onValueChange={setSelectedRemark1}
              placeholder="Choisir une remarque..."
            />
          </div>
          {selectedRemark1 && (
            <div className="text-sm text-muted-foreground">
              ID sélectionné : {selectedRemark1}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Exemple avec statut */}
      <Card>
        <CardHeader>
          <CardTitle>Avec affichage du statut</CardTitle>
          <CardDescription>
            Affiche le badge de statut (actif/inactif)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Remarque d'expert (avec statut)</Label>
            <RemarkSelect
              value={selectedRemark2}
              onValueChange={setSelectedRemark2}
              showStatus={true}
              placeholder="Choisir une remarque..."
            />
          </div>
          {selectedRemark2 && (
            <div className="text-sm text-muted-foreground">
              ID sélectionné : {selectedRemark2}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Exemple avec description */}
      <Card>
        <CardHeader>
          <CardTitle>Avec description</CardTitle>
          <CardDescription>
            Affiche la description dans la liste déroulante
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Remarque d'expert (avec description)</Label>
            <RemarkSelect
              value={selectedRemark3}
              onValueChange={setSelectedRemark3}
              showStatus={true}
              showDescription={true}
              placeholder="Choisir une remarque..."
            />
          </div>
          {selectedRemark3 && (
            <div className="text-sm text-muted-foreground">
              ID sélectionné : {selectedRemark3}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Exemple désactivé */}
      <Card>
        <CardHeader>
          <CardTitle>État désactivé</CardTitle>
          <CardDescription>
            Composant en état désactivé
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Remarque d'expert (désactivé)</Label>
            <RemarkSelect
              value={null}
              onValueChange={() => {}}
              disabled={true}
              placeholder="Composant désactivé..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 