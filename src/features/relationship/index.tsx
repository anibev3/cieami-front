/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { insurerRelationshipService } from '@/services/insurerRelationshipService'
import { CreateInsurerRelationshipBody, InsurerRelationship, InsurerRelationshipsResponse } from '@/types/insurer-relationships'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { InsurerSelect } from '@/features/widgets/insurer-select'
import { Loader2, RefreshCcw, ShieldCheck, ShieldOff, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Header } from '@/components/layout/header'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'
import { Search } from '@/components/search'

function InsurerRelationshipsPageContent() {
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [page, setPage] = useState(1)
  const [data, setData] = useState<InsurerRelationshipsResponse | null>(null)
  const [selectedInsurerId, setSelectedInsurerId] = useState<string | number | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const fetchList = useCallback(async (targetPage = page) => {
    setLoading(true)
    try {
      const response = await insurerRelationshipService.list(targetPage)
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
    if (!selectedInsurerId) {
      toast.error('Sélectionnez un assureur')
      return
    }
    setCreating(true)
    try {
      const body: CreateInsurerRelationshipBody = { insurer_id: selectedInsurerId }
      await insurerRelationshipService.create(body)
      toast.success('Rattachement créé')
      setSelectedInsurerId(null)
      setIsCreateModalOpen(false)
      fetchList(1)
      setPage(1)
    } catch (error: any) {
      // toasts are handled globally in axios; keep minimal
    } finally {
      setCreating(false)
    }
  }

  const toggleStatus = async (item: InsurerRelationship, action: 'enable' | 'disable') => {
    try {
      if (action === 'enable') {
        await insurerRelationshipService.enable(item.id)
        toast.success('Rattachement activé')
      } else {
        await insurerRelationshipService.disable(item.id)
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
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
    <div className="">
      <Card className="shadow-none p-0 border-0">
        <CardHeader className="flex flex-row items-center justify-between p-0">
          <div>
            <CardTitle>Rattachements assureurs</CardTitle>
            <CardDescription>Gérez les relations assureur ↔ cabinet d'expertise</CardDescription>
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
                  <DialogTitle>Créer un rattachement assureur</DialogTitle>
                  <DialogDescription>
                    Sélectionnez un assureur pour créer un nouveau rattachement avec votre cabinet d'expertise.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="insurer" className="text-right">
                      Assureur
                    </label>
                    <div className="col-span-3">
                      <InsurerSelect 
                        value={selectedInsurerId} 
                        onValueChange={setSelectedInsurerId} 
                        placeholder="Sélectionner un assureur..." 
                        valueKey="id" 
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreate} disabled={creating || !selectedInsurerId}>
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
                  <TableHead>Assureur</TableHead>
                  <TableHead>Cabinet</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.insurer?.name}</TableCell>
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

export default function InsurerRelationshipsPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_INSURER_RELATIONSHIP}>
      <InsurerRelationshipsPageContent />
    </ProtectedRoute>
  )
}
