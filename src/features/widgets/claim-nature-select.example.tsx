import { useState } from 'react'
import { ClaimNatureSelect } from './claim-nature-select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export function ClaimNatureSelectExample() {
  const [selectedNature1, setSelectedNature1] = useState<number | null>(null)
  const [selectedNature2, setSelectedNature2] = useState<number | null>(null)
  const [selectedNature3, setSelectedNature3] = useState<number | null>(null)

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Exemples d'utilisation de ClaimNatureSelect</h1>
      
      {/* Exemple basique */}
      <Card>
        <CardHeader>
          <CardTitle>Sélection basique</CardTitle>
          <CardDescription>
            Sélection simple d'une nature de sinistre
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nature de sinistre</Label>
            <ClaimNatureSelect
              value={selectedNature1}
              onValueChange={setSelectedNature1}
              placeholder="Choisir une nature de sinistre..."
            />
          </div>
          {selectedNature1 && (
            <div className="text-sm text-muted-foreground">
              ID sélectionné : {selectedNature1}
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
            <Label>Nature de sinistre (avec statut)</Label>
            <ClaimNatureSelect
              value={selectedNature2}
              onValueChange={setSelectedNature2}
              showStatus={true}
              placeholder="Choisir une nature de sinistre..."
            />
          </div>
          {selectedNature2 && (
            <div className="text-sm text-muted-foreground">
              ID sélectionné : {selectedNature2}
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
            <Label>Nature de sinistre (avec description)</Label>
            <ClaimNatureSelect
              value={selectedNature3}
              onValueChange={setSelectedNature3}
              showStatus={true}
              showDescription={true}
              placeholder="Choisir une nature de sinistre..."
            />
          </div>
          {selectedNature3 && (
            <div className="text-sm text-muted-foreground">
              ID sélectionné : {selectedNature3}
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
            <Label>Nature de sinistre (désactivé)</Label>
            <ClaimNatureSelect
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