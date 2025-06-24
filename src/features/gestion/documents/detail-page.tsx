import { useParams, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useDocumentsTransmisStore } from './store'

export default function DocumentTransmisDetailPage() {
  const { id } = useParams({ from: '/gestion/documents/$id' })
  const navigate = useNavigate()
  const { selectedDocument, fetchDocument, deleteDocument } = useDocumentsTransmisStore()

  useEffect(() => {
    fetchDocument(Number(id))
  }, [id, fetchDocument])

  if (!selectedDocument) return <div>Chargement...</div>

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Détail du document transmis</h2>
      <div className="mb-2"><b>Libellé :</b> {selectedDocument.label}</div>
      <div className="mb-2"><b>Code :</b> {selectedDocument.code}</div>
      <div className="mb-2"><b>Description :</b> {selectedDocument.description}</div>
      <div className="mb-2"><b>Statut :</b> {selectedDocument.status.label}</div>
      <div className="flex gap-2 mt-4">
        <button className="btn btn-primary" onClick={() => navigate({ to: `/gestion/documents/${id}/edit` })}>Éditer</button>
        <button className="btn btn-danger" onClick={async () => { if (window.confirm('Supprimer ce document ?')) { await deleteDocument(Number(id)); navigate({ to: '/gestion/documents' }) } }}>Supprimer</button>
        <button className="btn" onClick={() => navigate({ to: '/gestion/documents' })}>Retour</button>
      </div>
    </div>
  )
} 