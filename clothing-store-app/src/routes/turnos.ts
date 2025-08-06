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
import { authenticateToken, requireRRHHPermission, requireTurnosPermission } from '../middleware/auth';

const router = Router();

// Rutas para turnos
router.get('/turnos', authenticateToken, requireTurnosPermission, getTurnos);
router.get('/turnos/user/:userId', authenticateToken, getTurnosByUser);
router.post('/turnos', authenticateToken, requireTurnosPermission, async (req, res) => {
  try {
    await createTurno(req, res);
  } catch (error) {
    console.error('Error en ruta POST /turnos:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error });
  }
});
router.get('/turnos/:id', authenticateToken, requireTurnosPermission, getTurnoById);
router.put('/turnos/:id', authenticateToken, updateTurno);

// Rutas para asistencias
router.get('/asistencias', authenticateToken, requireRRHHPermission, getAsistencias);
router.get('/asistencias/user/:userId', authenticateToken, getAsistenciasByUser);
router.post('/asistencias', authenticateToken, requireRRHHPermission, async (req, res) => {
  try {
    await createAsistencia(req, res);
  } catch (error) {
    console.error('Error en ruta POST /asistencias:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error });
  }
});
router.get('/asistencias/:id', authenticateToken, requireRRHHPermission, getAsistenciaById);
router.put('/asistencias/:id', authenticateToken, updateAsistencia);

export default router; 