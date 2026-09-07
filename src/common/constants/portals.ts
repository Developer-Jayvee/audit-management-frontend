
export const AvailablePortals = ['client', 'admin', 'auditor'];

/**
 * Maps each web-portal user type to the route path it lands on after login.
 * Admin and Auditor share the same `/admin` console shell (narrowed by RBAC
 * inside it, per Phase 1.4); Client has its own `/client` portal.
 */
export const PortalRoutePaths: Record<(typeof AvailablePortals)[number], string> = {
    admin: '/admin',
    auditor: '/admin',
    client: '/client',
};