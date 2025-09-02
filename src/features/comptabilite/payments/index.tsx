/* eslint-disable no-console */
import { RequireAnyRoleGate } from "@/components/ui/permission-gate";
import PaymentsPage from "./PaymentDisplay";
import ForbiddenError from "@/features/errors/forbidden";
import { UserRole } from "@/stores/aclStore";

export default function SettingsProfile() {
  return (
    <div className="h-full w-full overflow-y-auto">
      <RequireAnyRoleGate
        roles={[UserRole.SYSTEM_ADMIN, UserRole.CEO, UserRole.ACCOUNTANT_MANAGER, UserRole.ACCOUNTANT, UserRole.OPENER]}
        fallback={<ForbiddenError />}
      >
        <PaymentsPage onButtonClick={() => {
          console.log('Nouveau paiement')
          }} />
      </RequireAnyRoleGate>
    </div>
  )
}
