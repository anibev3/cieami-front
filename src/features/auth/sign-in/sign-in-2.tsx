import ViteLogo from '@/assets/vite.svg'
import { UserAuthForm } from './components/user-auth-form'
import { RedirectIfAuthenticated } from '@/components/auth/RedirectIfAuthenticated'

export default function SignIn2() {
  return (
    <RedirectIfAuthenticated>
      <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
        <div className='bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r overflow-hidden'>
          <video
            autoPlay
            muted
            loop
            playsInline
            className='absolute inset-0 w-full h-full object-cover'
          >
            <source src='/videos/cover.mp4' type='video/mp4' />
          </video>
          {/* <div className='absolute inset-0 bg-zinc-900/70' /> */}
          <div className='relative z-20 flex items-center text-lg font-medium'>
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
          </div>

          {/* <img
            src={ViteLogo}
            className='relative m-auto'
            width={301}
            height={60}
            alt='Vite'
          /> */}

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
          <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]'>
            <div className='flex flex-col space-y-2 text-left'>
              <h1 className='text-2xl font-semibold tracking-tight'>Connexion</h1>
              <p className='text-muted-foreground text-sm'>
                Entrez votre email et votre mot de passe ci-dessous <br />
                pour vous connecter à votre compte
              </p>
            </div>
            <UserAuthForm />
            <p className='text-muted-foreground px-8 text-center text-sm'>
              En cliquant sur connexion, vous acceptez nos{' '}
              <a
                href='/terms'
                className='hover:text-primary underline underline-offset-4'
              >
                Conditions d'utilisation
              </a>{' '}
              et{' '}
              <a
                href='/privacy'
                className='hover:text-primary underline underline-offset-4'
              >
                Politique de confidentialité
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </RedirectIfAuthenticated>
  )
}
