/**
 * Constantes de rutas de la aplicación
 * Centraliza las rutas para evitar errores de escritura y facilitar cambios
 */
export const APP_ROUTES = {
  HOME: '/',
  AUTH: {
    BASE: '/auth',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password'
  },
  CART: {
    BASE: '/carts',
    DETAIL: (id: string) => `/carts/id/${id}`
  },
  CHECKOUT: '/checkout',
  CATEGORIES: {
    BASE: '/categories',
    FEATURE: '/categories/feature',
    OUTLET: '/categories/outlet',
    MEN: '/categories/men',
    WOMEN: '/categories/women',
    ELECTRONICS: '/categories/electronics',
    JEWELRY: '/categories/jewelry'
  },
  FEATURED: '/category/featured',
  DASHBOARD: '/dashboard',
  FAVORITES: '/favorites'
};
