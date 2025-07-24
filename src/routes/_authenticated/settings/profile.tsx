//   import ContentSection from '../../../features/settings/components/content-section'
//   import UserProfileEdit from '../../../features/settings/profile/user-profile-edit'

// export default function SettingsProfile() {
//   return (
//     <ContentSection
//       title='Modifier le profil'
//       desc='Mettez à jour vos informations personnelles et votre signature.'
//     >
//       <UserProfileEdit />
//     </ContentSection>
//   )
// } 


import { createFileRoute } from '@tanstack/react-router'
// import SettingsProfile from '@/features/settings/profile'
import UserProfileEdit from '@/features/settings/profile/user-profile-edit'
import ContentSection from '@/features/settings/components/content-section'

export const Route = createFileRoute('/_authenticated/settings/profile')({
  component: () => (  
    <ContentSection
      title='Modifier le profil'
      desc='Mettez à jour vos informations personnelles et votre signature.'
    >
      <UserProfileEdit />
    </ContentSection>
  ),
})
