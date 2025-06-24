 import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/finances/cost-types')({
    component: () => (
        <div>
            <h1>Cost Types</h1>
        </div> 
  ),
}) 