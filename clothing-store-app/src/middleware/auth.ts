import { Request, Response, NextFunction } from 'express';
import { verifyToken, hasPermission } from '../controllers/userRepository';
import { Role } from '../types';

// Extender la interfaz Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        email: string;
        roles: string[];
      };
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Token inválido' });
  }

  req.user = decoded;
  next();
}

export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Convertir roles de string a objetos Role para usar hasPermission
    const userRoles: Role[] = req.user.roles.map(roleName => ({
      id: 0, // No necesitamos el ID para la verificación
      nombre: roleName,
      descripcion: '',
      permisos: getPermissionsForRole(roleName)
    }));

    if (!hasPermission(userRoles, permission)) {
      return res.status(403).json({ error: 'Permiso insuficiente' });
    }

    next();
  };
}

export function requireRole(roleName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!req.user.roles.includes(roleName)) {
      return res.status(403).json({ error: 'Rol requerido no asignado' });
    }

    next();
  };
}

// Función auxiliar para obtener permisos según el rol
function getPermissionsForRole(roleName: string): string[] {
  const rolePermissions: { [key: string]: string[] } = {
    'admin': ['*'],
    'vendedor': ['ventas', 'clientes', 'productos'],
    'inventario': ['productos', 'pedidos', 'proveedores'],
    'envios': ['envios', 'pedidos'],
    'devoluciones': ['devoluciones', 'ventas'],
    'rrhh': ['usuarios', 'asistencias', 'turnos']
  };

  return rolePermissions[roleName] || [];
}

// Middleware para verificar si el usuario es admin
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  return requireRole('admin')(req, res, next);
}

// Middleware para verificar si el usuario puede gestionar ventas
export function requireVentasPermission(req: Request, res: Response, next: NextFunction) {
  return requirePermission('ventas')(req, res, next);
}

// Middleware para verificar si el usuario puede gestionar inventario
export function requireInventarioPermission(req: Request, res: Response, next: NextFunction) {
  return requirePermission('productos')(req, res, next);
}

// Middleware para verificar si el usuario puede gestionar envíos
export function requireEnviosPermission(req: Request, res: Response, next: NextFunction) {
  return requirePermission('envios')(req, res, next);
}

// Middleware para verificar si el usuario puede gestionar devoluciones
export function requireDevolucionesPermission(req: Request, res: Response, next: NextFunction) {
  return requirePermission('devoluciones')(req, res, next);
}

// Middleware para verificar si el usuario puede gestionar RRHH
export function requireRRHHPermission(req: Request, res: Response, next: NextFunction) {
  return requirePermission('usuarios')(req, res, next);
} 