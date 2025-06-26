import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { ClerkFullLogo } from '@/assets/clerk-full-logo'
import { LearnMore } from '@/components/learn-more'

export const Route = createFileRoute('/clerk/(auth)')({
  component: ClerkAuthLayout,
})

function ClerkAuthLayout() {
  return (
    <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r'>
        <div className='absolute inset-0 bg-slate-500' />
        <Link
          to='/'
          className='relative z-20 flex items-center text-lg font-medium'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='mr-2 h-6 w-6'
          >
            <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
          </svg>
          Expert Auto
        </Link>

        <ClerkFullLogo className='relative m-auto size-96' />

        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
              &ldquo; L'expertise automobile est essentielle pour garantir la sécurité et la fiabilité des véhicules. 
              Faites confiance à nos experts pour une évaluation précise et professionnelle. &rdquo;
            </p>
            <footer className='text-sm'>EXPERT AUTO CIV</footer>
          </blockquote>
        </div>
      </div>
      <div className='lg:p-8'>
        <div className='relative mx-auto flex w-full flex-col items-center justify-center gap-4'>
          <LearnMore
            defaultOpen
            triggerProps={{
              className: 'absolute -top-12 right-0 sm:right-20 size-6',
            }}
            contentProps={{ side: 'top', align: 'end', className: 'w-auto' }}
          >
            Bienvenue sur la page d'authentification de Expert Auto. <br />
            Retour à{' '} 
            <Link
              to='/'
              className='underline decoration-dashed underline-offset-2'
            >
              l'accueil
            </Link>{' '}
            ?
          </LearnMore>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
