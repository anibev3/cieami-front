import React from 'react'
import { cn } from '@/lib/utils'
// import { Analytics } from '@vercel/analytics/next';
interface MainProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export const Main = ({ fixed, className, ...props }: MainProps) => {
  return (
    <>
      <main
        className={cn(
          'peer-[.header-fixed]/header:mt-16',
          'px-4 py-6',
          fixed && 'fixed-main flex grow flex-col overflow-hidden',
          className
        )}
        {...props}
      />
      {/* <Analytics /> */}
    </>
  )
}

Main.displayName = 'Main'
