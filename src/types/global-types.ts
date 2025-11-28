// Statuts des dossiers
export enum AssignmentStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OPENED = 'opened',
  REALIZED = 'realized',
  PENDING_FOR_REPAIRER_QUOTE = 'pending_for_repairer_quote',
  PENDING_FOR_REPAIRER_QUOTE_VALIDATION = 'pending_for_repairer_quote_validation',
  IN_EDITING = 'in_editing',
  EDITED = 'edited',
  PENDING_FOR_REPAIRER_VALIDATION = 'pending_for_repairer_validation',
  PENDING_FOR_EXPERT_VALIDATION = 'pending_for_expert_validation',
  VALIDATED = 'validated',
  IN_PAYMENT = 'in_payment',
  PAID = 'paid',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
  DELETED = 'deleted',
  ARCHIVED = 'archived',
  DRAFT = 'draft',
  PENDING_FOR_REPAIRER_INVOICE = 'pending_for_repairer_invoice',
  PENDING_FOR_REPAIRER_INVOICE_VALIDATION = 'pending_for_repairer_invoice_validation',
  SUCCESS = 'success',
  FAILED = 'failed',
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

// Rôles des utilisateurs
export enum RoleEnum {
  SYSTEM_ADMIN = 'system_admin',           // "Administrateur système"  ---------------> ASACI
  SYSTEM_SUPPORT = 'system_support',       // "Technicien Support"      ---------------> ASACI
  ADMIN = 'admin',                         // "Administrateur"
  CEO = 'ceo',                             // "Directeur Général"
  EXPERT = 'expert',                       // "Expert"
  OPENER = 'opener',                       // "Ouvreur"
  EDITOR = 'editor',                       // "Éditeur"
  VALIDATOR = 'validator',                 // "Validateur"
  ACCOUNTANT = 'accountant',               // "Comptable"
  INSURER_ADMIN = 'insurer_admin',         // "Administrateur assureur"
  REPAIRER_ADMIN = 'repairer_admin',       // "Administrateur réparateur"
  UNASSIGNED = 'unassigned'                // "Non assigné"
}

// Types de bureaux
export enum OfficeTypeEnum {
  MAIN_OFFICE = 'main_office',
  SUB_OFFICE = 'sub_office'
}

// Types d'entités
export enum EntityTypeEnum {
  MAIN_ORGANIZATION = 'main_organization',   // "Chambre des experts automobiles de Côte d'Ivoire"
  ORGANIZATION = 'organization',             // "Cabinet d'expertise"
  INSURER = 'insurer',                       // "Compagnie d'assurance"
  REPAIRER = 'repairer',                     // "Réparateur"
}

// Statuts des demandes d'expertise
export enum AssignmentRequestStatusEnum {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export const AssignmentStatusesWithDescription = {
  [AssignmentStatusEnum.ACTIVE]: 'Actif',
  [AssignmentStatusEnum.INACTIVE]: 'Inactif',
  [AssignmentStatusEnum.OPENED]: 'Ouvert',
  [AssignmentStatusEnum.REALIZED]: 'Réalisé',
  [AssignmentStatusEnum.PENDING_FOR_REPAIRER_QUOTE]: 'En attente de devis',
  [AssignmentStatusEnum.PENDING_FOR_REPAIRER_QUOTE_VALIDATION]: 'En attente de validation du devis',
  [AssignmentStatusEnum.IN_EDITING]: 'En rédaction',
  [AssignmentStatusEnum.EDITED]: 'Rédigé',
  [AssignmentStatusEnum.PENDING_FOR_REPAIRER_VALIDATION]: 'En attente de validation réparateur',
  [AssignmentStatusEnum.PENDING_FOR_EXPERT_VALIDATION]: 'En attente de validation expert',
  [AssignmentStatusEnum.VALIDATED]: 'Validé',
  [AssignmentStatusEnum.IN_PAYMENT]: 'En paiement',
  [AssignmentStatusEnum.PAID]: 'Payé',
  [AssignmentStatusEnum.CLOSED]: 'Clôturé',
  [AssignmentStatusEnum.CANCELLED]: 'Annulé',
  [AssignmentStatusEnum.DELETED]: 'Supprimé',
  [AssignmentStatusEnum.ARCHIVED]: 'Archivé',
  [AssignmentStatusEnum.DRAFT]: 'Brouillon',
  [AssignmentStatusEnum.PENDING_FOR_REPAIRER_INVOICE]: 'En attente de facture réparateur',
  [AssignmentStatusEnum.PENDING_FOR_REPAIRER_INVOICE_VALIDATION]: 'Facture réparateur validée',
  [AssignmentStatusEnum.SUCCESS]: 'Succès',
  [AssignmentStatusEnum.FAILED]: 'Échec',
  [AssignmentStatusEnum.PENDING]: 'En attente',
  [AssignmentStatusEnum.ACCEPTED]: 'Accepté',
  [AssignmentStatusEnum.REJECTED]: 'Rejeté',
}