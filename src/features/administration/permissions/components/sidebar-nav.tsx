import { type JSX } from 'react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    value: string
    title: string
    icon: JSX.Element
  }[]
  activeValue: string
  onValueChange: (value: string) => void
}

export function PermissionsSidebarNav({
  className,
  items,
  activeValue,
  onValueChange,
  ...props
}: SidebarNavProps) {
  return (
    <>
      {/* Mobile: Select dropdown */}
      <div className='p-1 md:hidden'>
        <Select value={activeValue} onValueChange={onValueChange}>
          <SelectTrigger className='h-12 sm:w-48'>
            <SelectValue placeholder='Sélectionner une section' />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                <div className='flex gap-x-4 px-2 py-1'>
                  <span className='scale-125'>{item.icon}</span>
                  <span className='text-md'>{item.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop: Vertical sidebar */}
      <ScrollArea className='hidden md:block'>
        <nav
          className={cn(
            'flex flex-col space-y-1',
            className
          )}
          {...props}
        >
          {items.map((item) => (
            <button
              key={item.value}
              onClick={() => onValueChange(item.value)}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                activeValue === item.value
                  ? 'bg-primary/10 text-primary font-semibold border-l-2 border-primary'
                  : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground',
                'justify-start w-full transition-all duration-200'
              )}
            >
              <span className='mr-3'>{item.icon}</span>
              {item.title}
            </button>
          ))}
        </nav>
      </ScrollArea>
    </>
  )
}

