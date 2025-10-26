import { Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { ForgotPasswordForm } from './components/forgot-password-form'

export default function ForgotPassword() {
  return (
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
        <div className='absolute inset-0 bg-black/40' />
        <div className='relative z-20 flex items-center text-lg font-medium'>
          <img
            src='/images/logo/cieami_logo.jpg'
            alt='Expert Auto Logo'
            className='mr-3 h-40 w-auto'
          />
        </div>

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
          {/* Logo section pour mobile/tablette */}
          <div className='flex justify-center mb-6 lg:hidden'>
            <img
              src='/images/logo/cieami_logo.jpg'
              alt='Expert Auto Logo'
              className='h-16 w-auto'
            />
          </div>
          <div className='flex flex-col space-y-2 text-left'>
            <h1 className='text-2xl font-semibold tracking-tight'>Mot de passe oublié</h1>
            <p className='text-muted-foreground text-sm'>
              Entrez votre email enregistré et nous vous enverrons un lien pour
              réinitialiser votre mot de passe.
            </p>
          </div>
          <Card className='gap-4'>
            <CardContent className='pt-6'>
              <ForgotPasswordForm />
            </CardContent>
            <CardFooter>
              <p className='text-muted-foreground text-center text-sm'>
                Vous vous souvenez de votre mot de passe ?{' '}
                <Link
                  to='/sign-in-2'
                  className='hover:text-primary underline underline-offset-4'
                >
                  Se connecter
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
