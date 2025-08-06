// =====================================================
// ARCHIVO: auth.ts
// DESCRIPCIÓN: Rutas de autenticación y gestión de usuarios/roles
// FUNCIÓN: Maneja login, gestión de usuarios y control de acceso
// =====================================================

// Importar Router de Express para crear rutas modulares
import { Router } from 'express';

// =====================================================
// IMPORTACIONES DE CONTROLADORES
// =====================================================

// Importar controladores de autenticación y gestión de usuarios
import { 
  login,                    // Autenticar usuario (login)
  getUsers,                 // Obtener todos los usuarios
  getUser,                  // Obtener usuario específico
  getRoles,                 // Obtener todos los roles
  assignRole,               // Asignar rol a usuario
  removeRole,               // Remover rol de usuario
  updateUserActiveStatus,   // Actualizar estado activo/inactivo
  createUser,               // Crear nuevo usuario
  updateUser,               // Actualizar usuario existente
  createRole,               // Crear nuevo rol
  updateRole                // Actualizar rol existente
} from '../controllers';

// =====================================================
// IMPORTACIONES DE MIDDLEWARE
// =====================================================

// Importar middleware de autenticación y autorización
import { 
  authenticateToken,        // Verificar token JWT
  requireAdmin,            // Requerir rol de administrador
  requireRRHHPermission    // Requerir permisos de RRHH
} from '../middleware/auth';

// =====================================================
// CONFIGURACIÓN DEL ROUTER
// =====================================================

// Crear instancia del router para rutas de autenticación
const router = Router();

// =====================================================
// RUTAS PÚBLICAS (SIN AUTENTICACIÓN)
// =====================================================

// Ruta para autenticar usuarios (login)
// POST /api/auth/login
// Body: { username: string, password: string }
// Response: { token: string, user: {...} }
router.post('/login', login);

// =====================================================
// RUTAS PROTEGIDAS - GESTIÓN DE USUARIOS
// =====================================================

// Obtener todos los usuarios (requiere permisos de RRHH)
// GET /api/auth/users
router.get('/users', authenticateToken, requireRRHHPermission, getUsers);

// Obtener usuario específico por ID (requiere permisos de RRHH)
// GET /api/auth/users/:id
router.get('/users/:id', authenticateToken, requireRRHHPermission, getUser);

// Crear nuevo usuario (solo administradores)
// POST /api/auth/users
// Body: { username, email, password, nombre, apellido, telefono }
router.post('/users', authenticateToken, requireAdmin, createUser);

// Actualizar usuario existente (solo administradores)
// PUT /api/auth/users/:id
// Body: { username, email, nombre, apellido, telefono }
router.put('/users/:id', authenticateToken, requireAdmin, updateUser);

// Actualizar estado activo/inactivo de usuario (solo administradores)
// PATCH /api/auth/users/:id/status
// Body: { activo: boolean }
router.patch('/users/:id/status', authenticateToken, requireAdmin, updateUserActiveStatus);

// Alternar estado activo/inactivo de usuario (solo administradores)
// PUT /api/auth/users/:id/toggle
router.put('/users/:id/toggle', authenticateToken, requireAdmin, updateUserActiveStatus);

// Asignar rol a usuario (solo administradores)
// POST /api/auth/users/:id/roles
// Body: { role_id: number }
router.post('/users/:id/roles', authenticateToken, requireAdmin, assignRole);

// Remover rol de usuario (solo administradores)
// DELETE /api/auth/users/:id/roles
// Body: { role_id: number }
router.delete('/users/:id/roles', authenticateToken, requireAdmin, removeRole);

// =====================================================
// RUTAS PROTEGIDAS - GESTIÓN DE ROLES
// =====================================================

// Obtener todos los roles (solo administradores)
// GET /api/auth/roles
router.get('/roles', authenticateToken, requireAdmin, getRoles);

// Crear nuevo rol (solo administradores)
// POST /api/auth/roles
// Body: { nombre, descripcion, permisos: string[] }
router.post('/roles', authenticateToken, requireAdmin, createRole);

// Actualizar rol existente (solo administradores)
// PUT /api/auth/roles/:id
// Body: { nombre, descripcion, permisos: string[] }
router.put('/roles/:id', authenticateToken, requireAdmin, updateRole);

// =====================================================
// EXPORTAR ROUTER CONFIGURADO
// =====================================================

// Exportar el router configurado para ser montado en /api/auth
export default router; 