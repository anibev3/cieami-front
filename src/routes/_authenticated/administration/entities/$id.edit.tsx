import { EntityCreatePage } from "@/features/administration/entities/components/create.entity";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/_authenticated/administration/entities/$id/edit')({
  component: EntityCreatePage,
})

