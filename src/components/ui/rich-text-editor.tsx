import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
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
  Type
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
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

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="border-b border-gray-200 bg-gray-50 p-2 rounded-t-lg rich-text-toolbar">
      <div className="flex items-center gap-1 flex-wrap">
        {/* Style de texte */}
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

        {/* Couleurs */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setColor('#958DF1').run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive('textStyle', { color: '#958DF1' }) && "bg-blue-100 text-blue-700"
            )}
          >
            <Palette className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive('highlight') && "bg-blue-100 text-blue-700"
            )}
          >
            <Highlighter className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Titres */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            "h-8 px-2 text-xs",
            editor.isActive('heading', { level: 2 }) && "bg-blue-100 text-blue-700"
          )}
        >
          H2
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(
            "h-8 px-2 text-xs",
            editor.isActive('heading', { level: 3 }) && "bg-blue-100 text-blue-700"
          )}
        >
          H3
        </Button>

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
      </div>
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
              "[&_.ProseMirror_h2]:text-lg [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:mb-2",
              "[&_.ProseMirror_h3]:text-base [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mb-2",
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