import {iconType} from "../shared/component/material-icon/material-icon.component";

export interface Links {
  label: string;
  children?: {
    path: string;
    label: string;
    icon: string;
    iconType: iconType;
    badge?: number;
    color?: string | any;
    hideOnMobile?: boolean;
  }[]
}

export const MENU: Links[] = [
  {
    label: 'MENU',
    children: [
      {path: '/accueil', label: 'Accueil', icon: 'window', iconType: 'outlined'},
      {path: '/catalogue', label: 'Catalogue', icon: 'ballot', iconType: 'outlined'},
      {path: '/comparateur', label: 'Comparateur', icon: 'compare_arrows', iconType: 'outlined'},
      {path: '/panier', label: 'Bon de commande', icon: 'shopping_cart', iconType: 'outlined'},
      {path: '/facturation', label: 'Facturation', icon: 'receipt', iconType: 'outlined'},
      {path: '/map', label: 'Map fournisseur', icon: 'room', iconType: 'outlined'},
      {path: '/etl', label: 'Etl', icon: 'undo', iconType: 'outlined'},
      {path: '/stats', label: 'Stats', icon: 'query_stats', iconType: 'outlined'},
      {path: '/references-xts', label: 'References-xts', icon: 'dvr',iconType: 'outlined'},
      {path: '/analytics', label: 'Analytics', icon: 'list_alt',iconType: 'outlined'}

    ]
  },
  {
    label: 'PHARMABOOK',
    children: [
      {path: '/chat', label: 'Chat', icon: 'chat', iconType: 'outlined', hideOnMobile: true},
      // {path: '/promotions', label: 'Promotions', icon: 'redeem', iconType: 'outlined', hideOnMobile: true},
      // {path: '/annuaires', label: 'Annuaires', icon: 'book', iconType: 'outlined', hideOnMobile: true},
    ]
  },
  {
    label: 'ADMIN',
    children: [
      {path: '/utilisateurs', label: 'Utilisateurs', icon: 'people', iconType: 'outlined', hideOnMobile: true},
      {path: '/fournisseurs', label: 'Fournisseurs', icon: 'store', iconType: 'outlined', hideOnMobile: true},
      {path: '/clients', label: 'Clients', icon: 'contacts', iconType: 'outlined', hideOnMobile: true},
      {path: '/gestion-catalogue', label: 'Gestion catalogue', icon: 'list', iconType: 'outlined', hideOnMobile: true},
      {path: '/roles', label: 'Rôles', icon: 'admin_panel_settings', iconType: 'outlined', hideOnMobile: true},
      {path: '/historiques', label: 'Historiques', icon: 'history', iconType: 'outlined', hideOnMobile: true}
    ]
  }
  // {
  //   label: 'PREMIUM',
  //   children: [
  //     {path: '/', label: 'Votre panier', icon: 'home'},
  //     {path: '/', label: 'Commander', icon: 'home'},
  //     {path: '/', label: 'Stock', icon: 'home'},
  //     {path: '/', label: 'Vente', icon: 'home'},
  //     {path: '/', label: 'Achat', icon: 'home'},
  //   ]
  // },
  // {
  //   label: 'VIP',
  //   children: [
  //     {path: '/', label: 'Stats vente', icon: 'home'},
  //     {path: '/', label: 'Stats achat', icon: 'home'},
  //     {path: '/', label: 'Stats produit', icon: 'home'},
  //     {path: '/', label: 'Prédiction', icon: 'home'},
  //   ]
  // }
]
