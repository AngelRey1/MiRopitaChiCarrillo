import { Router } from 'express';
import { 
  getTurnos, 
  getTurnosByUser, 
  createTurno, 
  updateTurno,
  getAsistencias,
  getAsistenciasByUser,
  createAsistencia,
  updateAsistencia
} from '../controllers';
import { authenticateToken, requireRRHHPermission } from '../middleware/auth';

const router = Router();

// Rutas para turnos
router.get('/turnos', authenticateToken, requireRRHHPermission, getTurnos);
router.get('/turnos/user/:userId', authenticateToken, getTurnosByUser);
router.post('/turnos', authenticateToken, createTurno);
router.put('/turnos/:id', authenticateToken, updateTurno);

// Rutas para asistencias
router.get('/asistencias', authenticateToken, requireRRHHPermission, getAsistencias);
router.get('/asistencias/user/:userId', authenticateToken, getAsistenciasByUser);
router.post('/asistencias', authenticateToken, createAsistencia);
router.put('/asistencias/:id', authenticateToken, updateAsistencia);

export default router; 