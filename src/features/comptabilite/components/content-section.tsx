import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'

interface PaymentsContentSectionProps {
  title?: string
  desc?: string
  children: React.JSX.Element
  buttonText?: string
  onButtonClick?: () => void
}

export default function PaymentsContentSection({
  title,
  desc,
  children,
  buttonText,
  onButtonClick,
}: PaymentsContentSectionProps) {
  return (
    <div className='flex flex-1 flex-col'>
      {title && (
        <>
      <div className='flex-none flex items-center justify-between'>
        <div className='flex flex-col gap-2'>
          <h3 className='text-lg font-medium'>{title}</h3>
          <p className='text-muted-foreground text-sm'>{desc}</p>
        </div>
        {buttonText && (
        <div className='flex items-center gap-2'>
          <Button variant='outline' onClick={onButtonClick}>
            <Plus className='mr-2 h-4 w-4' />
            {buttonText}
          </Button>
        </div>)}
      </div>
      <Separator className='my-4 flex-none' />
        </>
      )}
      <div className='faded-bottom h-full w-full overflow-y-auto scroll-smooth pr-4 pb-12'>
        <div className='-mx-1 px-1.5 lg:max-w-xl'>{children}</div>
      </div>
    </div>
  )
}
