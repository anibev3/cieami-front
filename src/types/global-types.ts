// Statuts des dossiers
export enum AssignmentStatusEnum {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OPENED = 'opened',
  REALIZED = 'realized',
  EDITED = 'edited',
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
  IN_EDITING = 'in_editing',
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
