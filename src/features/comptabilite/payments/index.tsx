/* eslint-disable no-console */
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import PaymentsPage from "./PaymentDisplay";
import { Permission } from "@/types/auth";

export default function PaymentsPageWrapper() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_PAYMENT}>
      <div className="h-full w-full overflow-y-auto">
        <PaymentsPage onButtonClick={() => {
          console.log('Nouveau paiement')
        }} />
      </div>
    </ProtectedRoute>
  )
}
