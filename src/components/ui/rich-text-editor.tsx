import React, { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'

import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Highlighter,
  Palette,
  Type,

  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  label?: string
  error?: string
}

// Couleurs prédéfinies
const PREDEFINED_COLORS = [
  { name: 'Noir', value: '#000000' },
  { name: 'Rouge', value: '#FF0000' },
  { name: 'Orange', value: '#FF8C00' },
  { name: 'Jaune', value: '#FFD700' },
  { name: 'Vert', value: '#008000' },
  { name: 'Bleu', value: '#0000FF' },
  { name: 'Violet', value: '#800080' },
  { name: 'Rose', value: '#FFC0CB' },
  { name: 'Marron', value: '#8B4513' },
  { name: 'Gris', value: '#808080' },
  { name: 'Bleu clair', value: '#87CEEB' },
  { name: 'Vert clair', value: '#90EE90' },
]

const HIGHLIGHT_COLORS = [
  { name: 'Jaune', value: '#fef08a' },
  { name: 'Vert', value: '#bbf7d0' },
  { name: 'Bleu', value: '#bfdbfe' },
  { name: 'Rose', value: '#fecdd3' },
  { name: 'Orange', value: '#fed7aa' },
  { name: 'Violet', value: '#e9d5ff' },
]

const TEXT_SIZES = [
  { label: 'Très petit', value: '0.75rem' },
  { label: 'Petit', value: '0.875rem' },
  { label: 'Normal', value: '1rem' },
  { label: 'Grand', value: '1.125rem' },
  { label: 'Très grand', value: '1.25rem' },
  { label: 'Énorme', value: '1.5rem' },
]

const MenuBar = ({ editor }: { editor: any }) => {
  const [linkUrl, setLinkUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [showImageInput, setShowImageInput] = useState(false)

  if (!editor) {
    return null
  }

  const setLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl('')
      setShowLinkInput(false)
    }
  }

  const setImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl('')
      setShowImageInput(false)
    }
  }

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  return (
    <div className="border-b border-gray-200 bg-gray-50 p-2 rounded-t-lg rich-text-toolbar">
      <div className="flex items-center gap-1 flex-wrap">
        {/* Style de texte de base */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('bold') && "bg-blue-100 text-blue-700"
          )}
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('italic') && "bg-blue-100 text-blue-700"
          )}
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('underline') && "bg-blue-100 text-blue-700"
          )}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>



        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          disabled={!editor.can().chain().focus().toggleSubscript().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('subscript') && "bg-blue-100 text-blue-700"
          )}
        >
          <SubscriptIcon className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          disabled={!editor.can().chain().focus().toggleSuperscript().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('superscript') && "bg-blue-100 text-blue-700"
          )}
        >
          <SuperscriptIcon className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Alignement */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive({ textAlign: 'left' }) && "bg-blue-100 text-blue-700"
          )}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive({ textAlign: 'center' }) && "bg-blue-100 text-blue-700"
          )}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive({ textAlign: 'right' }) && "bg-blue-100 text-blue-700"
          )}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive({ textAlign: 'justify' }) && "bg-blue-100 text-blue-700"
          )}
        >
          <AlignJustify className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Sélecteur de couleur de texte */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Couleur du texte</Label>
              <div className="grid grid-cols-6 gap-2">
                {PREDEFINED_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => editor.chain().focus().setColor(color.value).run()}
                    className={cn(
                      "w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors",
                      editor.isActive('textStyle', { color: color.value }) && "border-blue-500"
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value="#000000"
                  onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                  className="w-12 h-8 p-1"
                />
                <span className="text-xs text-gray-500">Couleur personnalisée</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Sélecteur de couleur de surbrillance */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Highlighter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Surbrillance</Label>
              <div className="grid grid-cols-4 gap-2">
                {HIGHLIGHT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => editor.chain().focus().toggleHighlight({ color: color.value }).run()}
                    className={cn(
                      "w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors",
                      editor.isActive('highlight', { color: color.value }) && "border-blue-500"
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => editor.chain().focus().unsetHighlight().run()}
                className="w-full"
              >
                Supprimer la surbrillance
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6" />

        {/* Titres */}
        <Select
          value=""
          onValueChange={(value) => {
            if (value === 'paragraph') {
              editor.chain().focus().setParagraph().run()
            } else if (value.startsWith('heading')) {
              const level = parseInt(value.replace('heading', ''))
              editor.chain().focus().toggleHeading({ level }).run()
            }
          }}
        >
          <SelectTrigger className="w-20 h-8">
            <SelectValue placeholder="Style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paragraph">Normal</SelectItem>
            <SelectItem value="heading1">H1</SelectItem>
            <SelectItem value="heading2">H2</SelectItem>
            <SelectItem value="heading3">H3</SelectItem>
            <SelectItem value="heading4">H4</SelectItem>
            <SelectItem value="heading5">H5</SelectItem>
            <SelectItem value="heading6">H6</SelectItem>
          </SelectContent>
        </Select>

        {/* Taille de texte */}
        <Select
          value=""
          onValueChange={(value) => {
            editor.chain().focus().setMark('textStyle', { fontSize: value }).run()
          }}
        >
          <SelectTrigger className="w-24 h-2">
            <SelectValue placeholder="Taille" />
          </SelectTrigger>
          <SelectContent>
            {TEXT_SIZES.map((size) => (
              <SelectItem key={size.value} value={size.value}>
                {size.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6" />

        {/* Listes */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('bulletList') && "bg-blue-100 text-blue-700"
          )}
        >
          <Type className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('orderedList') && "bg-blue-100 text-blue-700"
          )}
        >
          <span className="text-xs font-bold">1.</span>
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Liens et images */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowLinkInput(true)}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('link') && "bg-blue-100 text-blue-700"
          )}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowImageInput(true)}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        {/* <Button
          variant="ghost"
          size="sm"
          onClick={addTable}
        >
          <TableIcon className="h-4 w-4" />
        </Button> */}
      </div>

      {/* Input pour les liens */}
      {showLinkInput && (
        <div className="mt-2 p-2 bg-white border rounded flex items-center gap-2">
          <Input
            placeholder="URL du lien..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setLink()}
            className="flex-1"
          />
          <Button size="sm" onClick={setLink}>Ajouter</Button>
          <Button size="sm" variant="ghost" onClick={() => setShowLinkInput(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Input pour les images */}
      {showImageInput && (
        <div className="mt-2 p-2 bg-white border rounded flex items-center gap-2">
          <Input
            placeholder="URL de l'image..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setImage()}
            className="flex-1"
          />
          <Button size="sm" onClick={setImage}>Ajouter</Button>
          <Button size="sm" variant="ghost" onClick={() => setShowImageInput(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

export function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Commencez à écrire...',
  className,
  disabled = false,
  label,
  error
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
              Subscript,
        Superscript,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 px-2 py-1',
        },
      }),
      
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange?.(html)
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false)
    }
  }, [value, editor])

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {label}
        </label>
      )}
      
      <div className={cn(
        "border border-gray-300 rounded-lg overflow-hidden",
        disabled && "opacity-50 cursor-not-allowed",
        error && "border-red-500"
      )}>
        <MenuBar editor={editor} />
        
        <div className="p-3 min-h-[120px] max-h-[300px] overflow-y-auto">
          <EditorContent 
            editor={editor} 
            className={cn(
              "prose prose-sm max-w-none",
              "focus:outline-none",
              "[&_.ProseMirror]:min-h-[80px]",
              "[&_.ProseMirror]:outline-none",
              "[&_.ProseMirror_p]:mb-2",
              "[&_.ProseMirror_p:last-child]:mb-0",
              "[&_.ProseMirror_ul]:mb-2",
              "[&_.ProseMirror_ol]:mb-2",
              "[&_.ProseMirror_li]:mb-1",
              "[&_.ProseMirror_h1]:text-xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mb-3",
              "[&_.ProseMirror_h2]:text-lg [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:mb-2",
              "[&_.ProseMirror_h3]:text-base [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mb-2",
              "[&_.ProseMirror_h4]:text-sm [&_.ProseMirror_h4]:font-semibold [&_.ProseMirror_h4]:mb-2",
              "[&_.ProseMirror_h5]:text-xs [&_.ProseMirror_h5]:font-semibold [&_.ProseMirror_h5]:mb-2",
              "[&_.ProseMirror_h6]:text-xs [&_.ProseMirror_h6]:font-semibold [&_.ProseMirror_h6]:mb-2",
              "[&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-gray-300 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:mb-2",
              "[&_.ProseMirror_code]:bg-gray-100 [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:text-sm",
              "[&_.ProseMirror_pre]:bg-gray-100 [&_.ProseMirror_pre]:p-2 [&_.ProseMirror_pre]:rounded [&_.ProseMirror_pre]:mb-2 [&_.ProseMirror_pre]:overflow-x-auto",
              "[&_.ProseMirror_hr]:border-gray-300 [&_.ProseMirror_hr]:my-4",
              "[&_.ProseMirror_table]:border-collapse [&_.ProseMirror_table]:border [&_.ProseMirror_table]:border-gray-300 [&_.ProseMirror_table]:mb-2",
              "[&_.ProseMirror_th]:bg-gray-100 [&_.ProseMirror_th]:font-semibold",
              "[&_.ProseMirror_.is-editor-empty:first-child::before]:text-gray-400",
              "[&_.ProseMirror_.is-editor-empty:first-child::before]:float-left",
              "[&_.ProseMirror_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
              "[&_.ProseMirror_.is-editor-empty:first-child::before]:pointer-events-none",
              "[&_.ProseMirror_.is-editor-empty:first-child::before]:h-0"
            )}
          />
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  )
} 