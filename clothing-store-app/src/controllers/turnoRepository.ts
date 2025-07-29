import mysql from 'mysql2/promise';
import { Turno, Asistencia } from '../types';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'J4flores24',
  database: 'myropitacarrillochi',
  port: 3306,
});

// Funciones para Turnos
export async function getAllTurnos(): Promise<Turno[]> {
  const [rows] = await pool.query(`
    SELECT t.*, u.nombre as usuario_nombre, u.apellido as usuario_apellido
    FROM turnos t
    LEFT JOIN usuarios u ON t.usuario_id = u.id
    ORDER BY t.created_at DESC
  `);
  
  return (rows as any[]).map((row: any) => ({
    id: row.id,
    usuario_id: row.usuario_id,
    fecha: row.fecha,
    hora_entrada: row.hora_entrada,
    hora_salida: row.hora_salida,
    estado: row.estado,
    observaciones: row.observaciones,
    created_at: row.created_at,
    updated_at: row.updated_at,
    usuario: row.usuario_id ? {
      nombre: row.usuario_nombre,
      apellido: row.usuario_apellido
    } : undefined
  }));
}

export async function getTurnosByUser(userId: number): Promise<Turno[]> {
  const [rows] = await pool.query(`
    SELECT t.*, u.nombre as usuario_nombre, u.apellido as usuario_apellido
    FROM turnos t
    LEFT JOIN usuarios u ON t.usuario_id = u.id
    WHERE t.usuario_id = ?
    ORDER BY t.created_at DESC
  `, [userId]);
  
  return (rows as any[]).map((row: any) => ({
    id: row.id,
    usuario_id: row.usuario_id,
    fecha: row.fecha,
    hora_entrada: row.hora_entrada,
    hora_salida: row.hora_salida,
    estado: row.estado,
    observaciones: row.observaciones,
    created_at: row.created_at,
    updated_at: row.updated_at,
    usuario: row.usuario_id ? {
      nombre: row.usuario_nombre,
      apellido: row.usuario_apellido
    } : undefined
  }));
}

export async function getTurnoById(id: number): Promise<Turno | null> {
  const [rows] = await pool.query(`
    SELECT t.*, u.nombre as usuario_nombre, u.apellido as usuario_apellido
    FROM turnos t
    JOIN usuarios u ON t.usuario_id = u.id
    WHERE t.id = ?
  `, [id]);
  
  if ((rows as any[]).length === 0) return null;
  return (rows as any[])[0] as Turno;
}

export async function createTurno(turno: {
  usuario_id: number;
  fecha: Date;
  hora_entrada: string;
  estado?: 'activo' | 'completado' | 'ausente';
  observaciones?: string;
}): Promise<Turno> {
  const [result] = await pool.query(
    `INSERT INTO turnos (usuario_id, fecha, hora_entrada, estado, observaciones)
     VALUES (?, ?, ?, ?, ?)`,
    [
      turno.usuario_id,
      turno.fecha,
      turno.hora_entrada,
      turno.estado || 'activo',
      turno.observaciones
    ]
  );
  
  const [rows] = await pool.query('SELECT * FROM turnos WHERE id = ?', [(result as any).insertId]);
  return (rows as any[])[0] as Turno;
}

export async function updateTurno(id: number, turno: {
  hora_salida?: string;
  estado?: 'activo' | 'completado' | 'ausente';
  observaciones?: string;
}): Promise<Turno | null> {
  const updateFields = [];
  const values = [];
  
  if (turno.hora_salida !== undefined) {
    updateFields.push('hora_salida = ?');
    values.push(turno.hora_salida);
  }
  
  if (turno.estado !== undefined) {
    updateFields.push('estado = ?');
    values.push(turno.estado);
  }
  
  if (turno.observaciones !== undefined) {
    updateFields.push('observaciones = ?');
    values.push(turno.observaciones);
  }
  
  if (updateFields.length === 0) return null;
  
  values.push(id);
  
  await pool.query(
    `UPDATE turnos SET ${updateFields.join(', ')} WHERE id = ?`,
    values
  );
  
  const [rows] = await pool.query('SELECT * FROM turnos WHERE id = ?', [id]);
  if ((rows as any[]).length === 0) return null;
  return (rows as any[])[0] as Turno;
}

export async function getTurnoActivoByUser(userId: number, fecha: Date): Promise<Turno | null> {
  const [rows] = await pool.query(`
    SELECT * FROM turnos 
    WHERE usuario_id = ? AND fecha = ? AND estado = 'activo'
  `, [userId, fecha]);
  
  if ((rows as any[]).length === 0) return null;
  return (rows as any[])[0] as Turno;
}

// Funciones para Asistencias
export async function getAllAsistencias(): Promise<Asistencia[]> {
  const [rows] = await pool.query(`
    SELECT a.*, u.nombre as usuario_nombre, u.apellido as usuario_apellido
    FROM asistencias a
    LEFT JOIN usuarios u ON a.usuario_id = u.id
    ORDER BY a.created_at DESC
  `);
  
  return (rows as any[]).map((row: any) => ({
    id: row.id,
    usuario_id: row.usuario_id,
    fecha: row.fecha,
    hora_entrada: row.hora_entrada,
    hora_salida: row.hora_salida,
    estado: row.estado,
    observaciones: row.observaciones,
    created_at: row.created_at,
    updated_at: row.updated_at,
    usuario: row.usuario_id ? {
      nombre: row.usuario_nombre,
      apellido: row.usuario_apellido
    } : undefined
  }));
}

export async function getAsistenciasByUser(userId: number): Promise<Asistencia[]> {
  const [rows] = await pool.query(`
    SELECT a.*, u.nombre as usuario_nombre, u.apellido as usuario_apellido
    FROM asistencias a
    LEFT JOIN usuarios u ON a.usuario_id = u.id
    WHERE a.usuario_id = ?
    ORDER BY a.created_at DESC
  `, [userId]);
  
  return (rows as any[]).map((row: any) => ({
    id: row.id,
    usuario_id: row.usuario_id,
    fecha: row.fecha,
    hora_entrada: row.hora_entrada,
    hora_salida: row.hora_salida,
    estado: row.estado,
    observaciones: row.observaciones,
    created_at: row.created_at,
    updated_at: row.updated_at,
    usuario: row.usuario_id ? {
      nombre: row.usuario_nombre,
      apellido: row.usuario_apellido
    } : undefined
  }));
}

export async function getAsistenciaById(id: number): Promise<Asistencia | null> {
  const [rows] = await pool.query(`
    SELECT a.*, u.nombre as usuario_nombre, u.apellido as usuario_apellido
    FROM asistencias a
    JOIN usuarios u ON a.usuario_id = u.id
    WHERE a.id = ?
  `, [id]);
  
  if ((rows as any[]).length === 0) return null;
  return (rows as any[])[0] as Asistencia;
}

export async function createAsistencia(asistencia: {
  usuario_id: number;
  fecha: Date;
  hora_entrada: string;
  estado?: 'presente' | 'ausente' | 'tardanza';
  observaciones?: string;
}): Promise<Asistencia> {
  const [result] = await pool.query(
    `INSERT INTO asistencias (usuario_id, fecha, hora_entrada, estado, observaciones)
     VALUES (?, ?, ?, ?, ?)`,
    [
      asistencia.usuario_id,
      asistencia.fecha,
      asistencia.hora_entrada,
      asistencia.estado || 'presente',
      asistencia.observaciones
    ]
  );
  
  const [rows] = await pool.query('SELECT * FROM asistencias WHERE id = ?', [(result as any).insertId]);
  return (rows as any[])[0] as Asistencia;
}

export async function updateAsistencia(id: number, asistencia: {
  hora_salida?: string;
  estado?: 'presente' | 'ausente' | 'tardanza';
  observaciones?: string;
}): Promise<Asistencia | null> {
  const updateFields = [];
  const values = [];
  
  if (asistencia.hora_salida !== undefined) {
    updateFields.push('hora_salida = ?');
    values.push(asistencia.hora_salida);
  }
  
  if (asistencia.estado !== undefined) {
    updateFields.push('estado = ?');
    values.push(asistencia.estado);
  }
  
  if (asistencia.observaciones !== undefined) {
    updateFields.push('observaciones = ?');
    values.push(asistencia.observaciones);
  }
  
  if (updateFields.length === 0) return null;
  
  values.push(id);
  
  await pool.query(
    `UPDATE asistencias SET ${updateFields.join(', ')} WHERE id = ?`,
    values
  );
  
  const [rows] = await pool.query('SELECT * FROM asistencias WHERE id = ?', [id]);
  if ((rows as any[]).length === 0) return null;
  return (rows as any[])[0] as Asistencia;
}

export async function getAsistenciaByUserAndDate(userId: number, fecha: Date): Promise<Asistencia | null> {
  const [rows] = await pool.query(`
    SELECT * FROM asistencias 
    WHERE usuario_id = ? AND fecha = ?
  `, [userId, fecha]);
  
  if ((rows as any[]).length === 0) return null;
  return (rows as any[])[0] as Asistencia;
}

export async function getAsistenciasByDateRange(startDate: Date, endDate: Date): Promise<Asistencia[]> {
  const [rows] = await pool.query(`
    SELECT a.*, u.nombre as usuario_nombre, u.apellido as usuario_apellido
    FROM asistencias a
    JOIN usuarios u ON a.usuario_id = u.id
    WHERE a.fecha BETWEEN ? AND ?
    ORDER BY a.fecha DESC, a.hora_entrada DESC
  `, [startDate, endDate]);
  return rows as Asistencia[];
} 