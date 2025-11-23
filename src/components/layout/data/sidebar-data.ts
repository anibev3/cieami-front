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
  // IconReceipt,
  IconCheck,
  IconWallet,
  IconDownload,
} from '@tabler/icons-react'
import { AudioWaveform, Command, GalleryVerticalEnd } from 'lucide-react'
import { type SidebarData } from '../types'
import { Permission } from '@/types/auth'

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
          requiredPermission: Permission.DASHBOARD,
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
          // requiredRoles: [
          //   UserRole.SYSTEM_ADMIN,
          // ],
          requiredPermission: Permission.VIEW_ASSIGNMENT,
        },

        {
          title: 'Dossiers edition expirés',
          url: '/assignments/edition-expired',
          icon: IconFolder,
          // requiredRoles: [
          //   UserRole.SYSTEM_ADMIN,
          // ],
          requiredPermission: Permission.VIEW_ASSIGNMENT,
        },
        {
          title: 'Dossiers recouvrement expirés',
          url: '/assignments/recovery-expired',
          icon: IconFolder,
          // requiredRoles: [
          //   UserRole.SYSTEM_ADMIN,
          // ],
          requiredPermission: Permission.VIEW_ASSIGNMENT,
        },
        {
          title: 'Liste des constats',
          url: '/administration/constat',
          icon: IconFolder,
          requiredPermission: Permission.VIEW_ASCERTAINMENT,
        },
        {
          title: 'Demandes d\'expertise',
          url: '/assignment-requests',
          icon: IconFileText,
          // requiredRoles: [
          //   UserRole.SYSTEM_ADMIN,
          // ],
          requiredPermission: Permission.VIEW_ASSIGNMENT_REQUEST,
        },
        {
          title: 'Rattachements assureurs',
          url: '/relationship',
          icon: IconBuilding,
          requiredPermission: Permission.VIEW_INSURER_RELATIONSHIP,
        },
        {
          title: 'Rattachements réparateurs',
          url: '/relationship/repairers',
          icon: IconTool,
          requiredPermission: Permission.VIEW_REPAIRER_RELATIONSHIP,
        },
        {
          title: 'Coût de fourniture',
          url: '/assignments/cost-of-supply',
          icon: IconCheck,
          requiredPermission: Permission.VIEW_ASSIGNMENT,
        },
        {
          title: 'Statistiques',
          icon: IconCalculator,
          // requiredRoles: [
          //   UserRole.SYSTEM_ADMIN,
          // ],
          items: [
            {
              title: 'Dossiers',
              url: '/assignments/statistics-assignments',
              icon: IconCalculator,
              requiredPermission: Permission.ASSIGNMENT_STATISTICS,
            },
            {
              title: 'Paiements',
              url: '/assignments/statistics/payments',
              // requiredRoles: [UserRole.SYSTEM_ADMIN, UserRole.CEO, UserRole.ACCOUNTANT_MANAGER, UserRole.ACCOUNTANT],
              icon: IconCalculator,
              requiredPermission: Permission.PAYMENT_STATISTICS,
            },
            {
              title: 'Factures',
              url: '/assignments/statistics/invoices',
              // requiredRoles: [UserRole.SYSTEM_ADMIN, UserRole.CEO, UserRole.ACCOUNTANT_MANAGER, UserRole.ACCOUNTANT],
              icon: IconCalculator,
              requiredPermission: Permission.INVOICE_STATISTICS,
            },
          ],
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
              requiredPermission: Permission.VIEW_DEPRECIATION_TABLE,
            },
            {
              title: 'Calcul de valeur vénale',
              url: '/gestion/depreciation-tables/theoretical-value',
              icon: IconPalette,
              requiredPermission: Permission.VIEW_ASSIGNMENT,
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
              requiredPermission: Permission.VIEW_PHOTO,
            },
            {
              title: 'Types de photos',
              url: '/gestion/photo-types',
              icon: IconPalette,
              requiredPermission: Permission.VIEW_PHOTO_TYPE,
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
              requiredPermission: Permission.VIEW_VEHICLE,
            },
            {
              title: 'Couleurs',
              url: '/administration/colors',
              icon: IconPalette,
              requiredPermission: Permission.VIEW_COLOR,
            },
            {
              title: 'Marques',
              url: '/administration/brands',
              icon: IconPackages,
              requiredPermission: Permission.VIEW_BRAND,
            },
            {
              title: 'États de véhicules',
              url: '/administration/vehicle-states',
              icon: IconTool,
              requiredPermission: Permission.VIEW_VEHICLE_STATE,
            },
            {
              title: 'Modèles de véhicules',
              url: '/administration/vehicle-models',
              icon: IconCategory,
              requiredPermission: Permission.VIEW_VEHICLE_MODEL,
            },
            {
              title: 'Genre de véhicule',
              url: '/administration/vehicule/genre',
              icon: IconCategory,
              requiredPermission: Permission.VIEW_VEHICLE_GENRE,
            },
            {
              title: 'Énergie de véhicule',
              url: '/administration/vehicule/energie',
              icon: IconCategory,
              requiredPermission: Permission.VIEW_VEHICLE_ENERGY,
            },
            {
              title: 'Âge de véhicule',
              url: '/administration/vehicule/age',
              icon: IconCategory,
              requiredPermission: Permission.VIEW_VEHICLE_AGE,
            },
          ],
        },
      ],
    },
        {
      title: 'Comptabilité',
      items: [
        {
          title: 'Paiements',
          url: '/comptabilite/payments',
          icon: IconCreditCard,
          // requiredRoles: [UserRole.ACCOUNTANT, UserRole.SYSTEM_ADMIN, UserRole.CEO, UserRole.ACCOUNTANT_MANAGER, UserRole.OPENER],
          requiredPermission: Permission.VIEW_PAYMENT,
        },
        {
          title: 'Chèques',
          url: '/comptabilite/checks',
          icon: IconCheck,
          requiredPermission: Permission.VIEW_CHECK,
        },
        {
          title: 'Factures',
          url: '/comptabilite/invoices',
          icon: IconFileText,
          requiredPermission: Permission.VIEW_INVOICE,
        },
        {
          title: 'Configuration',
          icon: IconCalculator,
          // requiredRoles: [UserRole.ACCOUNTANT, UserRole.SYSTEM_ADMIN, UserRole.CEO, UserRole.ACCOUNTANT_MANAGER],

          items: [
            {
              title: 'Types de paiement',
              url: '/comptabilite/payment-types',
              icon: IconWallet,
              requiredPermission: Permission.VIEW_PAYMENT_TYPE,
            },
            {
              title: 'Méthodes de paiement',
              url: '/comptabilite/payment-methods',
              icon: IconCreditCard,
              requiredPermission: Permission.VIEW_PAYMENT_METHOD,
            },
            {
              title: 'Banques',
              url: '/comptabilite/banks',
              icon: IconBuildingBank,
              requiredPermission: Permission.VIEW_BANK,
            },
          ],
        },
        // {
        //   title: 'Rapports',
        //   icon: IconReceipt,
        //   // requiredPermissions: [Permission.PAYMENT_STATISTICS, Permission.INVOICE_STATISTICS],
        //   // requireAllPermissions: false,
        //   requiredRoles: [UserRole.ACCOUNTANT, UserRole.ADMIN, UserRole.SYSTEM_ADMIN, UserRole.CEO, UserRole.ACCOUNTANT_MANAGER],

        //   items: [
        //     {
        //       title: 'Rapport des paiements',
        //       url: '/comptabilite/reports/payments',
        //       icon: IconReceipt,
        //     },
        //     {
        //       title: 'Rapport des chèques',
        //       url: '/comptabilite/reports/checks',
        //       icon: IconCheck,
        //     },
        //     {
        //       title: 'État de trésorerie',
        //       url: '/comptabilite/reports/treasury',
        //       icon: IconCalculator,
        //     },
        //   ],
        // },
        {
          title: 'Statistiques',
          icon: IconCalculator,
          // requiredPermissions: [Permission.PAYMENT_STATISTICS, Permission.INVOICE_STATISTICS],
          // requireAllPermissions: false,
          // requiredRoles: [UserRole.ACCOUNTANT, UserRole.SYSTEM_ADMIN, UserRole.CEO, UserRole.ACCOUNTANT_MANAGER],

          items: [
            {
              title: 'Statistiques des dossiers',
              url: '/assignments/statistics-assignments',
              icon: IconWallet,
              requiredPermission: Permission.ASSIGNMENT_STATISTICS,
            }
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
          requiredPermission: Permission.VIEW_CLIENT,
        },
        {
          title: 'Assureurs',
          url: '/gestion/assureurs',
          icon: IconBuilding,
          requiredPermission: Permission.VIEW_ENTITY,
        },
        {
          title: 'Réparateurs',
          url: '/gestion/reparateurs',
          icon: IconTool,
          requiredPermission: Permission.VIEW_ENTITY,
        },
        {
          title: 'Photos',
          url: '/gestion/photos',
          icon: IconPalette,
          requiredPermission: Permission.VIEW_PHOTO,
        },
        {
          title: 'Nature des sinistres',
          url: '/gestion/sinistre/nature-sinistre',
          icon: IconFileText,
          requiredPermission: Permission.VIEW_CLAIM_NATURE,
        },
        {
          title: 'Remarques experts',
          url: '/gestion/remarque',
          icon: IconFileText,
          requiredPermission: Permission.VIEW_ASSIGNMENT,
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
          requiredPermission: Permission.VIEW_SHOCK_POINT,
        },
        {
          title: 'Types d\'expertise',
          url: '/expertise/types',
          icon: IconFileText,
          requiredPermission: Permission.VIEW_EXPERTISE_TYPE,
        },
        {
          title: 'Conclusions techniques',
          url: '/expertise/conclusions-techniques',
          icon: IconClipboardList,
          requiredPermission: Permission.VIEW_TECHNICAL_CONCLUSION,
        },
        {
          title: 'Fournitures',
          url: '/expertise/fournitures',
          icon: IconCategory,
          requiredPermission: Permission.VIEW_SUPPLY,
        },
        {
          title: 'Type main d\'oeuvre',
          url: '/expertise/type-main-oeuvre',
          icon: IconTool,
          requiredPermission: Permission.VIEW_WORKFORCE_TYPE,
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
          requiredPermission: Permission.VIEW_BODYWORK,
        },  
        {
          title: 'Peinture',
          icon: IconPalette,
          items: [
            {
              title: 'Types de peinture',
              url: '/reparation/types-peinture',
              icon: IconPalette,
              requiredPermission: Permission.VIEW_PAINT_TYPE,
            },
            {
              title: 'Prix de peinture',
              url: '/reparation/prix-peinture',
              icon: IconCategory,
              requiredPermission: Permission.VIEW_PAINTING_PRICE,
            },
            {
              title: 'Éléments de peinture',
              url: '/reparation/elements-peinture',
              icon: IconChecklist,
              requiredPermission: Permission.VIEW_NUMBER_PAINT_ELEMENT,
            },
            {
              title: 'Tarifs produits peinture',
              url: '/reparation/tarifs-produits-peinture',
              icon: IconPalette,
              requiredPermission: Permission.VIEW_PAINT_PRODUCT_PRICE,
            },
            {
              title: 'Horaires peinture',
              url: '/reparation/horaires-peinture',
              icon: IconBrowserCheck,
              requiredPermission: Permission.VIEW_HOURLY_RATE,
            },
          ],
        },
        {
          title: 'Tarification Honoraire',
          url: '/reparation/tarification-honoraire',
          icon: IconFileText,
          requiredPermission: Permission.VIEW_WORK_FEE,
        },
      ],
    },
    {
      title: 'Finances',
      items: [
        {
          title: 'Quittances',
          icon: IconFileText,
          items: [
            {
              title: 'Quittance',
              url: '/finances/receipts',
              icon: IconFileText,
              requiredPermission: Permission.VIEW_RECEIPT,
            },
            {
              title: 'Types de quittances',
              url: '/finances/receipt-types',
              icon: IconCategory,
              requiredPermission: Permission.VIEW_RECEIPT_TYPE,
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
              requiredPermission: Permission.VIEW_OTHER_COST,
            },
            {
              title: 'Types de coûts',
              url: '/finances/cost-types',
              icon: IconClipboardList,
              requiredPermission: Permission.VIEW_OTHER_COST_TYPE,
            },
          ],
        },
      ],
    },
    {
      title: 'Administration',
      // requiredRoles: [UserRole.SYSTEM_ADMIN],
      items: [
        {
          title: 'Utilisateurs',
          url: '/administration/users',
          icon: IconUsers,
          // requiredRoles: [
          //   UserRole.SYSTEM_ADMIN,
          
          // ],
          requiredPermission: Permission.VIEW_USER,
        },
        {
          title: 'Rôles et Permissions',
          url: '/administration/permissions',
          icon: IconShield,
          requiredPermission: Permission.VIEW_ROLE,
        },
        {
          title: 'Documents',
          icon: IconFileText,
          items: [
            {
              title: 'Document transmis',
              url: '/administration/documents',
              icon: IconFileText,
              requiredPermission: Permission.VIEW_DOCUMENT_TRANSMITTED,
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
              requiredPermission: Permission.VIEW_GENERAL_STATE,
            },
            {
              title: 'Statut',
              url: '/administration/statuses',
              icon: IconShield,
              requiredPermission: Permission.VIEW_STATUS,
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
              requiredPermission: Permission.VIEW_ENTITY,
            },
            {
              title: 'Type d\'entité',
              url: '/administration/entity-types',
              icon: IconCategory,
              requiredPermission: Permission.VIEW_ENTITY_TYPE,
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
              requiredPermission: Permission.VIEW_ASCERTAINMENT_TYPE,
            },
          ],
        },
        {
          title: 'Types de missions',
          url: '/administration/assignment-types',
          icon: IconFileText,
          requiredPermission: Permission.VIEW_ASSIGNMENT_TYPE,
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
            // {
            //   title: 'Appearance',
            //   url: '/settings/appearance',
            //   icon: IconPalette,
            //   // Accessible à tous les utilisateurs connectés
            // },
          ],
        },
        {
          title: 'Contact developpeur',
          url: '/help-center',
          icon: IconHelp,
          requiredPermission: Permission.MANAGE_APP,
          // Accessible à tous les utilisateurs connectés
        },
      ],
    },
  ],
}
