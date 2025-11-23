/* eslint-disable no-console */
import { useState, useEffect, useRef, useCallback } from 'react'
import { useAssignmentMessagesStore } from '@/stores/assignmentMessages'
import { useUser } from '@/stores/authStore'
import { AssignmentMessage } from '@/types/assignment-messages'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Send,
  Loader2,
  MessageSquare,
  X,
} from 'lucide-react'
import { formatDate } from '@/utils/format-date'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

interface AssignmentChatProps {
  assignmentId: string
  onClose?: () => void
}

export function AssignmentChat({ assignmentId, onClose }: AssignmentChatProps) {
  const currentUser = useUser()
  const {
    messages,
    loading,
    fetchMessages,
    createMessage,
    updateMessage,
    deleteMessage,
  } = useAssignmentMessagesStore()

  const [messageText, setMessageText] = useState('')
  const [editingMessage, setEditingMessage] = useState<AssignmentMessage | null>(null)
  const [editText, setEditText] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState<AssignmentMessage | null>(null)
  const [sending, setSending] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastMessageIdRef = useRef<string | null>(null)

  // Charger les messages au montage et quand assignmentId change
  useEffect(() => {
    if (assignmentId) {
      fetchMessages(assignmentId).then(() => {
        // La référence sera mise à jour dans le useEffect suivant
      })
    }
    
    // Nettoyer le polling quand le composant se démonte ou assignmentId change
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [assignmentId, fetchMessages])
  
  // Mettre à jour la référence du dernier message quand les messages changent
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage) {
        lastMessageIdRef.current = lastMessage.id
      }
    }
  }, [messages])

  // Polling toutes les 30 secondes pour mettre à jour les messages
  useEffect(() => {
    if (!assignmentId) return

    // Nettoyer l'intervalle existant
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
    }

    // Créer un nouvel intervalle
    pollingIntervalRef.current = setInterval(() => {
      const previousLastMessageId = lastMessageIdRef.current
      fetchMessages(assignmentId).then(() => {
        // Vérifier si un nouveau message est arrivé en comparant avec la référence précédente
        // La référence sera mise à jour dans le useEffect qui surveille messages
        // Scroll automatique seulement si un nouveau message arrive
        setTimeout(() => {
          if (lastMessageIdRef.current !== previousLastMessageId && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
      }).catch((error) => {
        console.error('Erreur lors du polling des messages:', error)
      })
    }, 30000) // 30 secondes

    // Nettoyer l'intervalle à la destruction
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [assignmentId, fetchMessages])

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    if (messagesEndRef.current) {
      // Petit délai pour s'assurer que le DOM est mis à jour
      setTimeout(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [messages])

  const handleSendMessage = useCallback(async () => {
    if (!messageText.trim() || sending) return

    try {
      setSending(true)
      await createMessage({
        assignment_id: assignmentId,
        message: messageText.trim(),
      })
      setMessageText('')
      // Rafraîchir les messages après l'envoi pour s'assurer que tout est à jour
      await fetchMessages(assignmentId)
      // Scroll vers le bas après l'envoi
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
      }, 200)
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error)
    } finally {
      setSending(false)
    }
  }, [messageText, assignmentId, createMessage, sending, fetchMessages])

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }, [handleSendMessage])

  // const handleEdit = useCallback((message: AssignmentMessage) => {
  //   setEditingMessage(message)
  //   setEditText(message.message)
  // }, [])

  const handleSaveEdit = useCallback(async () => {
    if (!editingMessage || !editText.trim()) return

    try {
      await updateMessage(editingMessage.id, {
        message: editText.trim(),
      })
      setEditingMessage(null)
      setEditText('')
    } catch (error) {
      console.error('Erreur lors de la modification du message:', error)
    }
  }, [editingMessage, editText, updateMessage])

  // const handleDeleteClick = useCallback((message: AssignmentMessage) => {
  //   setMessageToDelete(message)
  //   setDeleteDialogOpen(true)
  // }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!messageToDelete) return

    try {
      await deleteMessage(messageToDelete.id)
      setDeleteDialogOpen(false)
      setMessageToDelete(null)
    } catch (error) {
      console.error('Erreur lors de la suppression du message:', error)
    }
  }, [messageToDelete, deleteMessage])

  const isCurrentUserMessage = useCallback((message: AssignmentMessage) => {
    if (!currentUser?.id || !message.created_by?.id) return false
    // Comparer les IDs (peuvent être des hash IDs, donc conversion en string pour être sûr)
    return String(currentUser.id) === String(message.created_by.id)
  }, [currentUser])

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return 'À l\'instant'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `Il y a ${minutes} min`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `Il y a ${hours}h`
    } else {
      return formatDate(dateString)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className="h-full flex flex-col shadow-sm border-l bg-background w-full py-0">
      <CardHeader className="px-4 sm:px-6 py-3 bg-muted/30 flex-shrink-0 gap-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Messages</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {messages.length} message{messages.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-muted"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden bg-muted/20">
        {/* Zone de messages */}
        <ScrollArea className="flex-1 px-3 sm:px-4" ref={scrollAreaRef}>
          <div className="space-y-3 py-4">
            {loading && messages.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <div className="p-4 bg-primary/5 rounded-full mb-4">
                  <MessageSquare className="h-10 w-10 text-primary/60" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Aucun message pour le moment
                </p>
                <p className="text-xs text-muted-foreground max-w-[200px]">
                  Commencez la conversation en envoyant un message ci-dessous
                </p>
              </div>
            ) : (
              // Les messages sont déjà triés par date croissante dans le store
              messages.map((message, index) => {
                const isCurrentUser = isCurrentUserMessage(message)
                const prevMessage = index > 0 ? messages[index - 1] : null
                const showAvatar = !prevMessage || 
                  String(prevMessage.created_by?.id) !== String(message.created_by?.id) || 
                  new Date(message.created_at).getTime() - new Date(prevMessage.created_at).getTime() > 300000 // 5 minutes
                
                return (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-2 sm:gap-3 group',
                      isCurrentUser ? 'flex-row-reverse' : 'flex-row'
                    )}
                  >
                    {showAvatar ? (
                      <Avatar className="h-9 w-9 flex-shrink-0 border-2 border-background shadow-sm">
                        <AvatarImage
                          src={message.created_by?.photo_url}
                          alt={message.created_by?.name || 'Utilisateur'}
                        />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                          {getInitials(message.created_by?.name || 'U')}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-9 flex-shrink-0" />
                    )}

                    <div
                      className={cn(
                        'flex flex-col gap-1.5 max-w-[75%] sm:max-w-[80%]',
                        isCurrentUser ? 'items-end' : 'items-start'
                      )}
                    >
                      {showAvatar && (
                        <div className={cn(
                          'flex items-center gap-2 px-1',
                          isCurrentUser ? 'flex-row-reverse' : 'flex-row'
                        )}>
                          <span className="text-xs font-semibold text-foreground">
                            {message.created_by?.name || 'Utilisateur inconnu'}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {formatMessageTime(message.created_at)}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-end gap-2 group">
                        <div
                          className={cn(
                            'rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all',
                            isCurrentUser
                              ? 'bg-primary text-primary-foreground rounded-br-md'
                              : 'bg-background border border-border rounded-bl-md'
                          )}
                        >
                          <p className="whitespace-pre-wrap break-words leading-relaxed">
                            {message.message}
                          </p>
                        </div>
                        
                        {/* {isCurrentUser && (
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 hover:bg-muted"
                              onClick={() => handleEdit(message)}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteClick(message)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )} */}
                      </div>

                      {!showAvatar && (
                        <span className={cn(
                          'text-[10px] text-muted-foreground px-1',
                          isCurrentUser ? 'text-right' : 'text-left'
                        )}>
                          {formatMessageTime(message.created_at)}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Zone de saisie */}
        <div className="border-t bg-background p-0 px-3 sm:px-4 py-3 flex-shrink-0">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <Textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Tapez votre message..."
                className="min-h-[52px] max-h-[120px] resize-none pr-12 border-2 focus:border-primary/50"
                disabled={sending}
              />
              <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground">
                {messageText.length > 0 && `${messageText.length} caractères`}
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!messageText.trim() || sending}
              size="icon"
              className="h-[52px] w-[52px] flex-shrink-0 shadow-sm hover:shadow-md transition-shadow"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          {/* <p className="text-[10px] text-muted-foreground mt-2 px-1">
            Appuyez sur <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Entrée</kbd> pour envoyer, <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Shift + Entrée</kbd> pour une nouvelle ligne
          </p> */}
        </div>
      </CardContent>

      {/* Dialog d'édition */}
      <Dialog open={!!editingMessage} onOpenChange={() => setEditingMessage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le message</DialogTitle>
            <DialogDescription>
              Modifiez votre message ci-dessous
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="min-h-[100px]"
            placeholder="Votre message..."
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditingMessage(null)
                setEditText('')
              }}
            >
              Annuler
            </Button>
            <Button onClick={handleSaveEdit} disabled={!editText.trim()}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le message</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

