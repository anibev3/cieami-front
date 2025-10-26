'use client'

import React, { useState } from 'react'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function RichTextEditorExample() {
  const [content, setContent] = useState('<h2>Bienvenue dans l\'éditeur de texte riche !</h2><p>Cet éditeur offre de nombreuses fonctionnalités :</p><ul><li><strong>Formatage de texte</strong> (gras, italique, souligné)</li><li><em>Couleurs de texte</em> et surbrillance</li><li>Alignement du texte</li><li>Listes à puces et numérotées</li><li>Liens et images</li><li>Tableaux</li></ul>')

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
  }

  const clearContent = () => {
    setContent('')
  }

  const loadSampleContent = () => {
    setContent(`
      <h1>Titre principal</h1>
      <p>Ceci est un <strong>paragraphe</strong> avec du texte <em>formaté</em>.</p>
      
      <h2>Exemple de liste</h2>
      <ul>
        <li>Premier élément</li>
        <li>Deuxième élément</li>
        <li>Troisième élément</li>
      </ul>
      
      <h3>Exemple de tableau</h3>
      <table>
        <thead>
          <tr>
            <th>Colonne 1</th>
            <th>Colonne 2</th>
            <th>Colonne 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Donnée 1</td>
            <td>Donnée 2</td>
            <td>Donnée 3</td>
          </tr>
        </tbody>
      </table>
    `)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Éditeur de Texte Riche Avancé</h1>
        <p className="text-gray-600">
          Un éditeur de texte riche complet avec de nombreuses fonctionnalités
        </p>
      </div>

      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="editor">Éditeur</TabsTrigger>
          <TabsTrigger value="preview">Aperçu</TabsTrigger>
          <TabsTrigger value="html">Code HTML</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Éditeur de texte riche</CardTitle>
              <CardDescription>
                Utilisez la barre d'outils pour formater votre texte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={loadSampleContent} variant="outline">
                  Charger un exemple
                </Button>
                <Button onClick={clearContent} variant="outline">
                  Effacer le contenu
                </Button>
              </div>
              
              <RichTextEditor
                value={content}
                onChange={handleContentChange}
                placeholder="Commencez à écrire votre contenu..."
                label="Contenu"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Aperçu du contenu</CardTitle>
              <CardDescription>
                Voici comment votre contenu s'affichera
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="prose prose-sm max-w-none p-4 border rounded-lg min-h-[200px]"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="html" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Code HTML généré</CardTitle>
              <CardDescription>
                Le code HTML produit par l'éditeur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{content}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Fonctionnalités disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Formatage de texte</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Gras, italique, souligné</li>
                <li>• Indice et exposant</li>
                <li>• Tailles de texte</li>
                <li>• Couleurs de texte</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Mise en page</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Alignement du texte</li>
                <li>• Titres (H1 à H6)</li>
                <li>• Listes à puces et numérotées</li>
                <li>• Surbrillance</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Médias et liens</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Liens hypertextes</li>
                <li>• Images</li>
                <li>• Tableaux</li>
                <li>• Contenu interactif</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 