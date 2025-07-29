import { Router } from 'express';
import { 
  getTurnos, 
  getTurnosByUser, 
  getTurnoById,
  createTurno, 
  updateTurno,
  getAsistencias,
  getAsistenciasByUser,
  getAsistenciaById,
  createAsistencia,
  updateAsistencia
} from '../controllers/index';
import { authenticateToken, requireRRHHPermission } from '../middleware/auth';

const router = Router();

// Rutas para turnos
router.get('/turnos', authenticateToken, requireRRHHPermission, getTurnos);
router.get('/turnos/user/:userId', authenticateToken, getTurnosByUser);
router.post('/turnos', authenticateToken, createTurno);
router.get('/turnos/:id', authenticateToken, requireRRHHPermission, getTurnoById);
router.put('/turnos/:id', authenticateToken, updateTurno);

// Rutas para asistencias
router.get('/asistencias', authenticateToken, requireRRHHPermission, getAsistencias);
router.get('/asistencias/user/:userId', authenticateToken, getAsistenciasByUser);
router.post('/asistencias', authenticateToken, createAsistencia);
router.get('/asistencias/:id', authenticateToken, requireRRHHPermission, getAsistenciaById);
router.put('/asistencias/:id', authenticateToken, updateAsistencia);

export default router; 