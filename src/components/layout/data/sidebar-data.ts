import {
  IconBarrierBlock,
  IconBrowserCheck,
  IconChecklist,
  IconHelp,
  IconLayoutDashboard,
  IconPackages,
  IconPalette,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUsers,
  IconBuilding,
  IconFileText,
  IconClipboardList,
  IconShield,
  IconCategory,
  IconCar,
  IconFolder,
  IconCalculator,
  IconCreditCard,
  IconBuildingBank,
  IconReceipt,
  IconCheck,
  IconWallet,
  IconDownload,
} from '@tabler/icons-react'
import { AudioWaveform, Command, GalleryVerticalEnd } from 'lucide-react'
import { type SidebarData } from '../types'
import { UserRole } from '@/types/auth'
// import { Permission, UserRole } from '@/types/auth'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Expert Auto',
      logo: Command,
      plan: 'L\'expertise automobile',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'Général',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
          // Dashboard accessible à tous les utilisateurs connectés
        },
      ],
    },
    {
      title: 'Gestion des dossiers',
      // requiredPermission: Permission.VIEW_ASSIGNMENT,
      items: [
        {
          title: 'Dossiers',
          url: '/assignments',
          icon: IconFolder,
          // requiredPermission: Permission.VIEW_ASSIGNMENT,
        },
        {
          title: 'Dossiers edition expirés',
          url: '/assignments/edition-expired',
          icon: IconFolder,
          // requiredPermission: Permission.VIEW_ASSIGNMENT,
        },
        {
          title: 'Dossiers recouvrement expirés',
          url: '/assignments/recovery-expired',
          icon: IconFolder,
          // requiredPermission: Permission.VIEW_ASSIGNMENT,
        },
        {
          title: 'Liste des constats',
          url: '/administration/constat',
          icon: IconFolder,
          // requiredPermission: Permission.VIEW_ASSIGNMENT,
        },
        {
          title: 'Coût de fourniture',
          url: '/assignments/cost-of-supply',
          icon: IconCheck,
          // requiredPermission: Permission.VIEW_ASSIGNMENT,
        },
        {
          title: 'Statistiques',
          url: '/assignments/statistics',
          icon: IconCalculator,
          // requiredPermission: Permission.ASSIGNMENT_STATISTICS,
        },
        {
          title: 'Tableaux de dépréciation',
          icon: IconPalette,
          // requiredPermission: Permission.VIEW_ASSIGNMENT,
          items: [
            {
              title: 'Liste tous les tableaux',
              url: '/gestion/depreciation-tables',
              icon: IconPalette,
            },
            {
              title: 'Vénale théorique',
              url: '/gestion/depreciation-tables/theoretical-value',
              icon: IconPalette,
            },
          ],
        },
        {
          title: 'Gestion des photos',
          icon: IconPalette,
          // requiredPermission: Permission.VIEW_ASSIGNMENT,
          items: [
            {
              title: 'Photos',
              url: '/gestion/photos',
              icon: IconPalette,
            },
            {
              title: 'Types de photos',
              url: '/gestion/photo-types',
              icon: IconPalette,
            },
          ],
        },
      ],
    },
    {
      title: 'Gestion',
      items: [
        {
          title: 'Clients',
          url: '/gestion/clients',
          icon: IconUsers,
          // requiredPermissions: [Permission.VIEW_USER, Permission.VIEW_ASSIGNMENT],
          // requireAllPermissions: false,
        },
        {
          title: 'Assureurs',
          url: '/gestion/assureurs',
          icon: IconBuilding,
          // requiredPermission: Permission.VIEW_ASSIGNMENT,
        },
        {
          title: 'Réparateurs',
          url: '/gestion/reparateurs',
          icon: IconTool,
          // requiredPermission: Permission.VIEW_ASSIGNMENT,
        },
        {
          title: 'Photos',
          url: '/gestion/photos',
          icon: IconPalette,
          // requiredPermission: Permission.VIEW_ASSIGNMENT,
        },
        {
          title: 'Documents transmis',
          url: '/gestion/documents',
          icon: IconFileText,
          // requiredPermission: Permission.VIEW_ASSIGNMENT,
        },
        {
          title: 'Nature des sinistres',
          url: '/gestion/sinistre/nature-sinistre',
          icon: IconFileText,
          // requiredPermission: Permission.VIEW_ASSIGNMENT,
        },
        {
          title: 'Remarques experts',
          url: '/gestion/remarque',
          icon: IconFileText,
          // requiredPermission: Permission.VIEW_ASSIGNMENT,
        },
      ],
    },
    {
      title: 'Expertise',
      // requiredRoles: [UserRole.EXPERT, UserRole.EXPERT_MANAGER, UserRole.ADMIN, UserRole.SYSTEM_ADMIN],
      items: [
        {
          title: 'Points de choc',
          url: '/expertise/points-de-choc',
          icon: IconChecklist,
        },
        {
          title: 'Types d\'expertise',
          url: '/expertise/types',
          icon: IconFileText,
        },
        {
          title: 'Conclusions techniques',
          url: '/expertise/conclusions-techniques',
          icon: IconClipboardList,
        },
        {
          title: 'Fournitures',
          url: '/expertise/fournitures',
          icon: IconCategory,
        },
        {
          title: 'Type main d\'oeuvre',
          url: '/expertise/type-main-oeuvre',
          icon: IconTool,
        },
      ],
    },
    {
      title: 'Réparation',
      // requiredRoles: [UserRole.EXPERT, UserRole.EXPERT_MANAGER, UserRole.ADMIN, UserRole.SYSTEM_ADMIN],
      items: [
        {
          title: 'Carrosseries',
          url: '/reparation/carrosseries',
          icon: IconBarrierBlock,
        },
        {
          title: 'Peinture',
          icon: IconPalette,
          items: [
            {
              title: 'Types de peinture',
              url: '/reparation/types-peinture',
              icon: IconPalette,
            },
            {
              title: 'Prix de peinture',
              url: '/reparation/prix-peinture',
              icon: IconCategory,
            },
            {
              title: 'Éléments de peinture',
              url: '/reparation/elements-peinture',
              icon: IconChecklist,
            },
            {
              title: 'Tarifs produits peinture',
              url: '/reparation/tarifs-produits-peinture',
              icon: IconPalette,
            },
            {
              title: 'Horaires peinture',
              url: '/reparation/horaires-peinture',
              icon: IconBrowserCheck,
            },
          ],
        },
        {
          title: 'Tarification Honoraire',
          url: '/reparation/tarification-honoraire',
          icon: IconFileText,
        },
      ],
    },
    {
      title: 'Comptabilité',
      // requiredRoles: [UserRole.CEO],
      items: [
        {
          title: 'Paiements',
          url: '/comptabilite/payments',
          icon: IconCreditCard,
          // requiredPermission: Permission.VIEW_PAYMENT,
        },
        {
          title: 'Chèques',
          url: '/comptabilite/checks',
          icon: IconCheck,
          // requiredPermission: Permission.VIEW_PAYMENT,
        },
        {
          title: 'Factures',
          url: '/comptabilite/invoices',
          icon: IconFileText,
          // requiredPermission: Permission.VIEW_INVOICE,
        },
        {
          title: 'Configuration',
          icon: IconCalculator,
          // requiredRoles: [UserRole.ADMIN, UserRole.SYSTEM_ADMIN],
          items: [
            {
              title: 'Types de paiement',
              url: '/comptabilite/payment-types',
              icon: IconWallet,
            },
            {
              title: 'Méthodes de paiement',
              url: '/comptabilite/payment-methods',
              icon: IconCreditCard,
            },
            {
              title: 'Banques',
              url: '/comptabilite/banks',
              icon: IconBuildingBank,
            },
          ],
        },
        {
          title: 'Rapports',
          icon: IconReceipt,
          // requiredPermissions: [Permission.PAYMENT_STATISTICS, Permission.INVOICE_STATISTICS],
          // requireAllPermissions: false,
          items: [
            {
              title: 'Rapport des paiements',
              url: '/comptabilite/reports/payments',
              icon: IconReceipt,
            },
            {
              title: 'Rapport des chèques',
              url: '/comptabilite/reports/checks',
              icon: IconCheck,
            },
            {
              title: 'État de trésorerie',
              url: '/comptabilite/reports/treasury',
              icon: IconCalculator,
            },
          ],
        },
        {
          title: 'Statistiques',
          icon: IconCalculator,
          // requiredPermissions: [Permission.PAYMENT_STATISTICS, Permission.INVOICE_STATISTICS],
          // requireAllPermissions: false,
          items: [
            {
              title: 'Statistiques des dossiers',
              url: '/comptabilite/statistics/assignments',
              icon: IconWallet,
            }
          ],
        },
      ],
    },
    {
      title: 'Finances',
      // requiredRoles: [UserRole.ACCOUNTANT, UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.CEO],
      items: [
        {
          title: 'Quittances',
          icon: IconFileText,
          items: [
            {
              title: 'Quittance',
              url: '/finances/quittance',
              icon: IconFileText,
            },
            {
              title: 'Types de quittances',
              url: '/finances/receipt-types',
              icon: IconCategory,
            },
          ],
        },
        {
          title: 'Coûts',
          icon: IconClipboardList,
          items: [
            {
              title: 'Autres coûts',
              url: '/finances/other-costs',
              icon: IconFileText,
            },
            {
              title: 'Types de coûts',
              url: '/finances/cost-types',
              icon: IconClipboardList,
            },
          ],
        },
      ],
    },
    {
      title: 'Administration',
      // requiredRoles: [UserRole.ADMIN, UserRole.SYSTEM_ADMIN],
      items: [
        {
          title: 'Utilisateurs',
          url: '/administration/users',
          icon: IconUsers,
          // requiredPermission: Permission.VIEW_USER,
        },
        {
          title: 'Documents',
          icon: IconFileText,
          items: [
            {
              title: 'Document transmis',
              url: '/administration/documents',
              icon: IconFileText,
            },
            {
              title: 'Documents transmis (Gestion)',
              url: '/gestion/documents',
              icon: IconFileText,
            },
          ],
        },
        {
          title: 'États et statuts',
          icon: IconShield,
          items: [
            {
              title: 'État généraux',
              url: '/administration/general-states',
              icon: IconClipboardList,
            },
            {
              title: 'Statut',
              url: '/administration/statuses',
              icon: IconShield,
            },
          ],
        },
        {
          title: 'Entités',
          icon: IconBuilding,
          items: [
            {
              title: 'Entité',
              url: '/administration/entities',
              icon: IconBuilding,
            },
            {
              title: 'Type d\'entité',
              url: '/administration/entity-types',
              icon: IconCategory,
            },
          ],
        },
        {
          title: 'Véhicules',
          icon: IconCar,
          items: [
            {
              title: 'Liste des véhicules',
              url: '/administration/vehicles',
              icon: IconCar,
            },
            {
              title: 'Couleurs',
              url: '/administration/colors',
              icon: IconPalette,
            },
            {
              title: 'Marques',
              url: '/administration/brands',
              icon: IconPackages,
            },
            {
              title: 'États de véhicules',
              url: '/administration/vehicle-states',
              icon: IconTool,
            },
            {
              title: 'Modèles de véhicules',
              url: '/administration/vehicle-models',
              icon: IconCategory,
            },
            {
              title: 'Genre de véhicule',
              url: '/administration/vehicule/genre',
              icon: IconCategory,
            },
            {
              title: 'Énergie de véhicule',
              url: '/administration/vehicule/energie',
              icon: IconCategory,
            },
            {
              title: 'Âge de véhicule',
              url: '/administration/vehicule/age',
              icon: IconCategory,
            },
          ],
        },
        {
          title: 'Constat',
          icon: IconBuilding,
          items: [
            {
              title: 'Type de constat',
              url: '/administration/constat/type',
              icon: IconBuilding,
            },
          ],
        },
        {
          title: 'Types d\'affectation',
          url: '/administration/assignment-types',
          icon: IconFileText,
        },
      ],
    },
    {
      title: 'Paramètres',
      items: [
        {
          title: 'Préférences',
          icon: IconSettings,
          items: [
            {
              title: 'Profil',
              url: '/settings',
              icon: IconUserCog,
              // Accessible à tous les utilisateurs connectés
            },
            {
              title: 'Mise à jour',
              url: '/settings/update',
              icon: IconDownload,
              // requiredRoles: [UserRole.ADMIN, UserRole.SYSTEM_ADMIN],
            },
            {
              title: 'Compte',
              url: '/settings/account',
              icon: IconTool,
              // Accessible à tous les utilisateurs connectés
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: IconPalette,
              // Accessible à tous les utilisateurs connectés
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: IconHelp,
          // Accessible à tous les utilisateurs connectés
        },
      ],
    },
  ],
}
