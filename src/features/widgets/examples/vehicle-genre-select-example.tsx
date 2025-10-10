import { useState } from 'react'
import { VehicleGenreSelect } from '../vehicle-genre-select'

export function VehicleGenreSelectExample() {
  const [selectedGenre, setSelectedGenre] = useState<string>('')

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">Exemples d'utilisation du VehicleGenreSelect</h3>
      
      {/* Exemple basique avec recherche */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Avec recherche (par défaut)</label>
        <VehicleGenreSelect
          value={selectedGenre}
          onValueChange={setSelectedGenre}
          placeholder="Sélectionner un genre de véhicule"
          showDescription={true}
        />
      </div>

      {/* Exemple sans recherche */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Sans recherche</label>
        <VehicleGenreSelect
          value={selectedGenre}
          onValueChange={setSelectedGenre}
          placeholder="Sélectionner un genre de véhicule"
          enableSearch={false}
        />
      </div>

      {/* Exemple avec placeholder personnalisé */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Avec placeholder personnalisé</label>
        <VehicleGenreSelect
          value={selectedGenre}
          onValueChange={setSelectedGenre}
          placeholder="Choisir un type de véhicule"
          searchPlaceholder="Tapez pour rechercher..."
          showDescription={true}
        />
      </div>

      {/* Affichage de la valeur sélectionnée */}
      {selectedGenre && (
        <div className="p-3 bg-gray-100 rounded-md">
          <p className="text-sm">
            <strong>Genre sélectionné :</strong> {selectedGenre}
          </p>
        </div>
      )}
    </div>
  )
}
