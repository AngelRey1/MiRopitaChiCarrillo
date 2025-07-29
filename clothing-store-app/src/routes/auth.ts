import { Router } from 'express';
import { login, getUsers, getUser, getRoles, assignRole, removeRole, updateUserActiveStatus, createUser, updateUser, createRole, updateRole } from '../controllers';
import { authenticateToken, requireAdmin, requireRRHHPermission } from '../middleware/auth';

const router = Router();

// Rutas públicas
router.post('/login', login);

// Rutas protegidas - Usuarios
router.get('/users', authenticateToken, requireRRHHPermission, getUsers);
router.get('/users/:id', authenticateToken, requireRRHHPermission, getUser);
router.post('/users', authenticateToken, requireAdmin, createUser);
router.put('/users/:id', authenticateToken, requireAdmin, updateUser);
router.patch('/users/:id/status', authenticateToken, requireAdmin, updateUserActiveStatus);
router.put('/users/:id/toggle', authenticateToken, requireAdmin, updateUserActiveStatus);
router.post('/users/:id/roles', authenticateToken, requireAdmin, assignRole);
router.delete('/users/:id/roles', authenticateToken, requireAdmin, removeRole);

// Rutas protegidas - Roles
router.get('/roles', authenticateToken, requireAdmin, getRoles);
router.post('/roles', authenticateToken, requireAdmin, createRole);
router.put('/roles/:id', authenticateToken, requireAdmin, updateRole);

export default router; 