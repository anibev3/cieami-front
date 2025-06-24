import ContentSection from '../components/content-section'
import UserProfileDisplay from './user-profile-display'

export default function SettingsProfile() {
  return (
    <ContentSection
      title='Profil utilisateur'
      desc='Informations détaillées sur votre profil et votre entité.'
    >
      <UserProfileDisplay />
    </ContentSection>
  )
}
