// =====================================================
// ARCHIVO: auth.ts
// DESCRIPCIÓN: Middleware de autenticación y autorización
// FUNCIÓN: Verificar tokens, permisos y roles de usuarios
// =====================================================

// Importaciones necesarias para el middleware
import { Request, Response, NextFunction } from 'express';  // Tipos de Express
import { verifyToken, hasPermission } from '../controllers/userRepository'; // Funciones de verificación
import { Role } from '../types';                           // Tipos de roles

// =====================================================
// EXTENSIÓN DE TIPOS PARA EXPRESS
// =====================================================

// Extender la interfaz Request de Express para incluir información del usuario
// Esto permite acceder a req.user en cualquier middleware o ruta
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;           // ID único del usuario
        username: string;     // Nombre de usuario
        email: string;        // Email del usuario
        roles: string[];      // Array de roles asignados al usuario
      };
    }
  }
}

// =====================================================
// MIDDLEWARE DE AUTENTICACIÓN DE TOKEN
// =====================================================

// Middleware para verificar que el token JWT sea válido
// Se ejecuta antes de cualquier ruta protegida
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  // Obtener el header de autorización (formato: "Bearer TOKEN")
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extraer solo el token

  // Si no hay token, devolver error 401 (No autorizado)
  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  // Verificar que el token sea válido usando la función del repositorio
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Token inválido' });
  }

  // Si el token es válido, agregar la información del usuario a la request
  req.user = decoded;
  next(); // Continuar al siguiente middleware o ruta
}

// =====================================================
// MIDDLEWARE DE VERIFICACIÓN DE PERMISOS
// =====================================================

// Middleware para verificar que el usuario tenga un permiso específico
// Se puede usar para proteger rutas según los permisos del usuario
export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Verificar que el usuario esté autenticado
    if (!req.user) {
      console.log('❌ Usuario no autenticado');
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    console.log('🔍 Verificando permiso:', permission);
    console.log('🔍 Roles del usuario:', req.user.roles);

    // Verificar si el usuario tiene el permiso requerido
    // Recorre todos los roles del usuario y verifica sus permisos
    const hasRequiredPermission = req.user.roles.some(roleName => {
      const rolePermissions = getPermissionsForRole(roleName);
      console.log(`🔍 Rol: ${roleName}, Permisos:`, rolePermissions);
      // El permiso '*' significa acceso total (admin)
      return rolePermissions.includes('*') || rolePermissions.includes(permission);
    });

    console.log('🔍 Tiene permiso requerido:', hasRequiredPermission);

    // Si no tiene el permiso, devolver error 403 (Prohibido)
    if (!hasRequiredPermission) {
      console.log('❌ Permiso insuficiente');
      return res.status(403).json({ error: 'Permiso insuficiente' });
    }

    console.log('✅ Permiso verificado correctamente');
    next(); // Continuar si tiene el permiso
  };
}

// =====================================================
// MIDDLEWARE DE VERIFICACIÓN DE ROLES
// =====================================================

// Middleware para verificar que el usuario tenga un rol específico
// Más restrictivo que requirePermission, requiere el rol exacto
export function requireRole(roleName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Verificar que el usuario esté autenticado
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Verificar que el usuario tenga el rol requerido
    if (!req.user.roles.includes(roleName)) {
      return res.status(403).json({ error: 'Rol requerido no asignado' });
    }

    next(); // Continuar si tiene el rol
  };
}

// =====================================================
// FUNCIÓN AUXILIAR PARA PERMISOS DE ROLES
// =====================================================

// Función que mapea cada rol con sus permisos específicos
// Define qué puede hacer cada tipo de usuario en el sistema
function getPermissionsForRole(roleName: string): string[] {
  const rolePermissions: { [key: string]: string[] } = {
    'admin': ['*'],                                    // Admin tiene acceso total
    'vendedor': ['ventas', 'clientes', 'productos'],   // Vendedor puede gestionar ventas
    'inventario': ['productos', 'pedidos', 'proveedores'], // Inventario gestiona productos y compras
    'envios': ['envios', 'pedidos'],                   // Envíos gestiona logística
    'devoluciones': ['devoluciones', 'ventas'],        // Devoluciones gestiona devoluciones
    'rrhh': ['usuarios', 'asistencias', 'turnos']      // RRHH gestiona personal
  };

  return rolePermissions[roleName] || []; // Retornar permisos del rol o array vacío
}

// =====================================================
// MIDDLEWARES ESPECÍFICOS POR FUNCIONALIDAD
// =====================================================

// Middleware para verificar si el usuario es administrador
// Usa requireRole para verificar el rol 'admin' específicamente
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  return requireRole('admin')(req, res, next);
}

// Middleware para verificar permisos de gestión de ventas
// Permite acceso a usuarios con permiso 'ventas'
export function requireVentasPermission(req: Request, res: Response, next: NextFunction) {
  return requirePermission('ventas')(req, res, next);
}

// Middleware para verificar permisos de gestión de inventario
// Permite acceso a usuarios con permiso 'productos'
export function requireInventarioPermission(req: Request, res: Response, next: NextFunction) {
  return requirePermission('productos')(req, res, next);
}

// Middleware para verificar permisos de gestión de envíos
// Permite acceso a usuarios con permiso 'envios'
export function requireEnviosPermission(req: Request, res: Response, next: NextFunction) {
  return requirePermission('envios')(req, res, next);
}

// Middleware para verificar permisos de gestión de devoluciones
// Permite acceso a usuarios con permiso 'devoluciones'
export function requireDevolucionesPermission(req: Request, res: Response, next: NextFunction) {
  return requirePermission('devoluciones')(req, res, next);
}

// Middleware para verificar permisos de gestión de RRHH
// Permite acceso a usuarios con permiso 'usuarios'
export function requireRRHHPermission(req: Request, res: Response, next: NextFunction) {
  return requirePermission('usuarios')(req, res, next);
}

// Middleware para verificar permisos de gestión de turnos
// Permite acceso a usuarios con permiso 'turnos'
export function requireTurnosPermission(req: Request, res: Response, next: NextFunction) {
  return requirePermission('turnos')(req, res, next);
} 