/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { repairerRelationshipService } from '@/services/repairerRelationshipService'
import { CreateRepairerRelationshipBody, RepairerRelationship, RepairerRelationshipsResponse } from '@/types/repairer-relationships'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { RepairerSelect } from '@/features/widgets/repairer-select'
import { Loader2, RefreshCcw, ShieldCheck, ShieldOff, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Main } from '@/components/layout/main'

export default function RepairerRelationshipsPage() {
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [page, setPage] = useState(1)
  const [data, setData] = useState<RepairerRelationshipsResponse | null>(null)
  const [selectedRepairerCode, setSelectedRepairerCode] = useState<string | number | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const fetchList = useCallback(async (targetPage = page) => {
    setLoading(true)
    try {
      const response = await repairerRelationshipService.list(targetPage)
      setData(response)
    } catch (error: unknown) {
      toast.error('Impossible de charger les rattachements')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchList(1)
  }, [fetchList])

  const handleCreate = async () => {
    if (!selectedRepairerCode) {
      toast.error('Sélectionnez un réparateur')
      return
    }
    setCreating(true)
    try {
      const body: CreateRepairerRelationshipBody = { repairer_id: selectedRepairerCode }
      await repairerRelationshipService.create(body)
      toast.success('Rattachement créé')
      setSelectedRepairerCode(null)
      setIsCreateModalOpen(false)
      fetchList(1)
      setPage(1)
    } catch (error: unknown) {
      // handled by axios global toast
    } finally {
      setCreating(false)
    }
  }

  const toggleStatus = async (item: RepairerRelationship, action: 'enable' | 'disable') => {
    try {
      if (action === 'enable') {
        await repairerRelationshipService.enable(item.id)
        toast.success('Rattachement activé')
      } else {
        await repairerRelationshipService.disable(item.id)
        toast.success('Rattachement désactivé')
      }
      fetchList(page)
    } catch (e) {
      toast.error('Erreur lors de la modification du statut')
    }
  }

  const rows = useMemo(() => data?.data ?? [], [data])

  return (
          <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
      <div className="space-y-6">
      <Card className='p-0 border-0 shadow-none'>
        <CardHeader className="flex flex-row items-center justify-between p-0">
          <div>
            <CardTitle>Rattachements réparateurs</CardTitle>
            <CardDescription>Gérez les relations réparateur ↔ cabinet d'expertise</CardDescription>
          </div>
          <Button variant="outline" onClick={() => fetchList(page)} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            Actualiser
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 p-0">
          <div className="flex justify-end">
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer le rattachement
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Créer un rattachement réparateur</DialogTitle>
                  <DialogDescription>
                    Sélectionnez un réparateur pour créer un nouveau rattachement avec votre cabinet d'expertise.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="repairer" className="text-right">
                      Réparateur
                    </label>
                    <div className="col-span-3">
                      <RepairerSelect 
                        value={selectedRepairerCode} 
                        onValueChange={setSelectedRepairerCode} 
                        placeholder="Sélectionner un réparateur..." 
                        valueKey="code" 
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreate} disabled={creating || !selectedRepairerCode}>
                    {creating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Créer le rattachement
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Réparateur</TableHead>
                  <TableHead>Cabinet</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.repairer?.name}</TableCell>
                    <TableCell>{item.expert_firm?.name}</TableCell>
                    <TableCell>
                      <Badge variant={item.status?.code === 'active' ? 'default' : 'secondary'}>
                        {item.status?.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      {item.status?.code === 'active' ? (
                        <Button variant="outline" size="sm" onClick={() => toggleStatus(item, 'disable')}>
                          <ShieldOff className="h-4 w-4" />
                          Désactiver
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => toggleStatus(item, 'enable')}>
                          <ShieldCheck className="h-4 w-4" />
                          Activer
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Aucun rattachement trouvé
                    </TableCell>
                  </TableRow>
                )}
                {loading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" /> Chargement...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
        </div>
      </Main>
    </>
  )
}


