import { useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export default function ForbiddenError() {
  const navigate = useNavigate()
  const { history } = useRouter()
  return (
    <div className='h-svh relative'>
      <div className='absolute inset-0'>
        <video
          autoPlay
          muted
          loop
          playsInline
          className='w-full h-full object-cover'
        >
          <source src='/videos/cover.mp4' type='video/mp4' />
        </video>
        <div className='absolute inset-0 bg-black/40' />
      </div>
      <div className='relative m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold text-primary'>403</h1>
        <span className='font-medium text-white text-[5rem]'>Accès refusé</span>
        <p className='text-white text-center'>
          Vous n'avez pas les permissions nécessaires <br />
          pour voir cette ressource.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => history.go(-1)}>
            Retour
          </Button>
          <Button onClick={() => navigate({ to: '/' })}>Retour à la page d'accueil</Button>
        </div>
      </div>
    </div>
  )
}
