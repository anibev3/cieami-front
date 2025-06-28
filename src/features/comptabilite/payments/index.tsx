/* eslint-disable no-console */
import PaymentsPage from "./PaymentDisplay";

export default function SettingsProfile() {
  return (
    <div className="h-full overflow-y-auto">
      <PaymentsPage onButtonClick={() => {
        console.log('Nouveau paiement')
      }} />
    </div>
  )
}
