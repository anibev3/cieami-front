import {
  IconBarrierBlock,
  IconBrowserCheck,
  IconChecklist,
  IconHelp,
  IconLayoutDashboard,
  IconNotification,
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
} from '@tabler/icons-react'
import { AudioWaveform, Command, GalleryVerticalEnd } from 'lucide-react'
import { type SidebarData } from '../types'

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
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
        // {
        //   title: 'Tasks',
        //   url: '/tasks',
        //   icon: IconChecklist,
        // },
        // {
        //   title: 'Apps',
        //   url: '/apps',
        //   icon: IconPackages,
        // },
        // {
        //   title: 'Chats',
        //   url: '/chats',
        //   badge: '3',
        //   icon: IconMessages,
        // },
        // {
        //   title: 'Users',
        //   url: '/users',
        //   icon: IconUsers,
        // },
        // {
        //   title: 'Secured by Clerk',
        //   icon: ClerkLogo,
        //   items: [
        //     {
        //       title: 'Sign In',
        //       url: '/clerk/sign-in',
        //     },
        //     {
        //       title: 'Sign Up',
        //       url: '/clerk/sign-up',
        //     },
        //     {
        //       title: 'User Management',
        //       url: '/clerk/user-management',
        //     },
        //   ],
        // },
      ],
    },
    {
      title: 'Administration',
      items: [
        {
          title: 'Document transmis',
          url: '/administration/documents',
          icon: IconFileText,
        },
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
        {
          title: 'Utilisateurs',
          url: '/administration/users',
          icon: IconUsers,
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
          title: 'Véhicules',
          url: '/administration/vehicles',
          icon: IconCar,
        },
        {
          title: 'Types d\'affectation',
          url: '/administration/assignment-types',
          icon: IconFileText,
        },
      ],
    },
    {
      title: 'Finances',
      icon: IconCategory,
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
    // {
    //   title: 'Pages',
    //   items: [
    //     {
    //       title: 'Auth',
    //       icon: IconLockAccess,
    //       items: [
    //         {
    //           title: 'Sign In',
    //           url: '/sign-in',
    //         },
    //         {
    //           title: 'Sign In (2 Col)',
    //           url: '/sign-in-2',
    //         },
    //         {
    //           title: 'Sign Up',
    //           url: '/sign-up',
    //         },
    //         {
    //           title: 'Forgot Password',
    //           url: '/forgot-password',
    //         },
    //         {
    //           title: 'OTP',
    //           url: '/otp',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Errors',
    //       icon: IconBug,
    //       items: [
    //         {
    //           title: 'Unauthorized',
    //           url: '/401',
    //           icon: IconLock,
    //         },
    //         {
    //           title: 'Forbidden',
    //           url: '/403',
    //           icon: IconUserOff,
    //         },
    //         {
    //           title: 'Not Found',
    //           url: '/404',
    //           icon: IconError404,
    //         },
    //         {
    //           title: 'Internal Server Error',
    //           url: '/500',
    //           icon: IconServerOff,
    //         },
    //         {
    //           title: 'Maintenance Error',
    //           url: '/503',
    //           icon: IconBarrierBlock,
    //         },
    //       ],
    //     },
    //   ],
    // },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: IconUserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: IconTool,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: IconPalette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: IconNotification,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: IconBrowserCheck,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: IconHelp,
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
        },
        {
          title: 'Assureurs',
          url: '/gestion/assureurs',
          icon: IconBuilding,
        },
        {
          title: 'Réparateurs',
          url: '/gestion/reparateurs',
          icon: IconTool,
        },
        {
          title: 'Photos',
          url: '/gestion/photos',
          icon: IconPalette,
        },
        {
          title: 'Documents transmis',
          url: '/gestion/documents',
          icon: IconFileText,
        },
      ],
    },
    {
      title: 'Réparation',
      items: [
        {
          title: 'Carrosseries',
          url: '/reparation/carrosseries',
          icon: IconBarrierBlock,
        },
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
        {
          title: 'Tarification Honoraire',
          url: '/reparation/tarification-honoraire',
          icon: IconFileText,
        },
      ],
    },
    {
      title: 'Expertise',
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
  ],
}
