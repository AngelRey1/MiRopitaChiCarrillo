import { Router } from 'express';
import { login, getUsers, getUser, getRoles, assignRole, removeRole, updateUserActiveStatus } from '../controllers';
import { authenticateToken, requireAdmin, requireRRHHPermission } from '../middleware/auth';

const router = Router();

// Rutas públicas
router.post('/login', login);

// Rutas protegidas
router.get('/users', authenticateToken, requireRRHHPermission, getUsers);
router.get('/users/:id', authenticateToken, requireRRHHPermission, getUser);
router.get('/roles', authenticateToken, requireAdmin, getRoles);
router.post('/users/:id/roles', authenticateToken, requireAdmin, assignRole);
router.delete('/users/:id/roles', authenticateToken, requireAdmin, removeRole);
router.patch('/users/:id/status', authenticateToken, requireAdmin, updateUserActiveStatus);

export default router; 