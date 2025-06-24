import ContentSection from '../components/content-section'
import UserAccountDisplay from './user-account-display'

export default function SettingsAccount() {
  return (
    <ContentSection
      title='Compte utilisateur'
      desc='Informations détaillées sur votre compte et vos permissions.'
    >
      <UserAccountDisplay />
    </ContentSection>
  )
}
