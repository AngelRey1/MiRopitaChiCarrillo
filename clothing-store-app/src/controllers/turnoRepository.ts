import { pool } from '../config/database';
import { Turno, Asistencia } from '../types';

// Función para verificar y crear la tabla turnos si no existe
async function ensureTurnosTable() {
  try {
    // Verificar si la tabla turnos existe
    const [tables] = await pool.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'turnos'
    `);
    
    if ((tables as any[]).length === 0) {
      console.log('Tabla turnos no existe, creándola...');
      
      // Crear la tabla turnos con la estructura exacta de la base de datos
      await pool.query(`
        CREATE TABLE turnos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          usuario_id INT NOT NULL,
          fecha DATE NOT NULL,
          hora_entrada TIME NOT NULL,
          hora_salida TIME NULL,
          estado ENUM('activo', 'completado', 'ausente') DEFAULT 'activo',
          observaciones TEXT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
        )
      `);
      
      console.log('Tabla turnos creada exitosamente');
    } else {
      console.log('Tabla turnos ya existe');
    }
  } catch (error) {
    console.error('Error al verificar/crear tabla turnos:', error);
    throw error;
  }
}

// Función para verificar y crear la tabla asistencias si no existe
async function ensureAsistenciasTable() {
  try {
    // Verificar si la tabla asistencias existe
    const [tables] = await pool.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'asistencias'
    `);
    
    if ((tables as any[]).length === 0) {
      console.log('Tabla asistencias no existe, creándola...');
      
      // Crear la tabla asistencias con la estructura exacta de la base de datos
      await pool.query(`
        CREATE TABLE asistencias (
          id INT AUTO_INCREMENT PRIMARY KEY,
          usuario_id INT NOT NULL,
          fecha DATE NOT NULL,
          hora_entrada TIME NOT NULL,
          hora_salida TIME NULL,
          estado ENUM('presente', 'ausente', 'tardanza', 'salida_temprana') DEFAULT 'presente',
          observaciones TEXT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
        )
      `);
      
      console.log('Tabla asistencias creada exitosamente');
    } else {
      console.log('Tabla asistencias ya existe');
    }
  } catch (error) {
    console.error('Error al verificar/crear tabla asistencias:', error);
    throw error;
  }
}

// Funciones para Turnos
export async function getAllTurnos(): Promise<Turno[]> {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM turnos
      ORDER BY created_at DESC
    `);
    
    return (rows as any[]).map((row: any) => {
      const fecha = new Date(row.fecha);
      const horaEntrada = row.hora_entrada;
      
      // Calcular fecha_inicio y fecha_fin para el frontend
      const fechaInicio = new Date(fecha);
      fechaInicio.setHours(parseInt(horaEntrada.split(':')[0]));
      fechaInicio.setMinutes(parseInt(horaEntrada.split(':')[1]));
      
      const fechaFin = new Date(fechaInicio);
      fechaFin.setHours(fechaFin.getHours() + 8); // Asumir 8 horas de turno
      
      return {
        id: row.id,
        usuario_id: row.usuario_id,
        fecha: fecha.toISOString().split('T')[0],
        hora_entrada: row.hora_entrada,
        hora_salida: row.hora_salida,
        estado: row.estado,
        observaciones: row.observaciones,
        created_at: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : null,
        // Campos adicionales para el frontend
        empleado: 'Empleado ' + row.usuario_id, // Nombre temporal
        fecha_inicio: fechaInicio.toISOString().slice(0, 16), // Formato YYYY-MM-DDTHH:MM
        fecha_fin: fechaFin.toISOString().slice(0, 16),
        tipo: row.observaciones ? row.observaciones.replace('Turno ', '') : 'normal',
        duracion: '8h 0m' // Duración fija por ahora
      };
    });
  } catch (error) {
    console.error('Error en getAllTurnos:', error);
    throw error;
  }
}

export async function getTurnosByUser(userId: number): Promise<Turno[]> {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM turnos
      WHERE usuario_id = ?
      ORDER BY created_at DESC
    `, [userId]);
    
    return (rows as any[]).map((row: any) => {
      const fecha = new Date(row.fecha);
      const horaEntrada = row.hora_entrada;
      
      // Calcular fecha_inicio y fecha_fin para el frontend
      const fechaInicio = new Date(fecha);
      fechaInicio.setHours(parseInt(horaEntrada.split(':')[0]));
      fechaInicio.setMinutes(parseInt(horaEntrada.split(':')[1]));
      
      const fechaFin = new Date(fechaInicio);
      fechaFin.setHours(fechaFin.getHours() + 8); // Asumir 8 horas de turno
      
      return {
        id: row.id,
        usuario_id: row.usuario_id,
        fecha: fecha.toISOString().split('T')[0],
        hora_entrada: row.hora_entrada,
        hora_salida: row.hora_salida,
        estado: row.estado,
        observaciones: row.observaciones,
        created_at: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : null,
        // Campos adicionales para el frontend
        empleado: 'Empleado ' + row.usuario_id, // Nombre temporal
        fecha_inicio: fechaInicio.toISOString().slice(0, 16),
        fecha_fin: fechaFin.toISOString().slice(0, 16),
        tipo: row.observaciones ? row.observaciones.replace('Turno ', '') : 'normal',
        duracion: '8h 0m'
      };
    });
  } catch (error) {
    console.error('Error en getTurnosByUser:', error);
    throw error;
  }
}

export async function getTurnoById(id: number): Promise<Turno | null> {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM turnos
      WHERE id = ?
    `, [id]);
    
    if ((rows as any[]).length === 0) return null;
    
    const row = (rows as any[])[0];
    const fecha = new Date(row.fecha);
    const horaEntrada = row.hora_entrada;
    
    // Calcular fecha_inicio y fecha_fin para el frontend
    const fechaInicio = new Date(fecha);
    fechaInicio.setHours(parseInt(horaEntrada.split(':')[0]));
    fechaInicio.setMinutes(parseInt(horaEntrada.split(':')[1]));
    
    const fechaFin = new Date(fechaInicio);
    fechaFin.setHours(fechaFin.getHours() + 8); // Asumir 8 horas de turno
    
    return {
      id: row.id,
      usuario_id: row.usuario_id,
      fecha: fecha.toISOString().split('T')[0],
      hora_entrada: row.hora_entrada,
      hora_salida: row.hora_salida,
      estado: row.estado,
      observaciones: row.observaciones,
      created_at: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : null,
      // Campos adicionales para el frontend
      empleado: 'Empleado ' + row.usuario_id, // Nombre temporal
      fecha_inicio: fechaInicio.toISOString().slice(0, 16),
      fecha_fin: fechaFin.toISOString().slice(0, 16),
      tipo: row.observaciones ? row.observaciones.replace('Turno ', '') : 'normal',
      duracion: '8h 0m'
    } as Turno;
  } catch (error) {
    console.error('Error en getTurnoById:', error);
    throw error;
  }
}

export async function createTurno(turno: {
  usuario_id: number;
  fecha: Date;
  hora_entrada: string;
  estado?: 'activo' | 'completado' | 'ausente';
  observaciones?: string;
}): Promise<Turno> {
  try {
    console.log('Datos recibidos en createTurno:', turno);
    
    // Asegurar que la tabla turnos existe
    await ensureTurnosTable();
    
    // Validar que el usuario existe
    const [userCheck] = await pool.query(
      'SELECT id FROM usuarios WHERE id = ?',
      [turno.usuario_id]
    );
    
    if ((userCheck as any[]).length === 0) {
      throw new Error(`Usuario con ID ${turno.usuario_id} no existe`);
    }

    const [result] = await pool.query(
      `INSERT INTO turnos (usuario_id, fecha, hora_entrada, estado, observaciones)
       VALUES (?, ?, ?, ?, ?)`,
      [
        turno.usuario_id,
        turno.fecha,
        turno.hora_entrada,
        turno.estado || 'activo',
        turno.observaciones || ''
      ]
    );
    
    console.log('Turno creado con ID:', (result as any).insertId);
    
    const [rows] = await pool.query('SELECT * FROM turnos WHERE id = ?', [(result as any).insertId]);
    const createdTurno = (rows as any[])[0];
    
    // Formatear la respuesta para el frontend
    const fecha = new Date(createdTurno.fecha);
    const horaEntrada = createdTurno.hora_entrada;
    
    // Calcular fecha_inicio y fecha_fin para el frontend
    const fechaInicio = new Date(fecha);
    fechaInicio.setHours(parseInt(horaEntrada.split(':')[0]));
    fechaInicio.setMinutes(parseInt(horaEntrada.split(':')[1]));
    
    const fechaFin = new Date(fechaInicio);
    fechaFin.setHours(fechaFin.getHours() + 8); // Asumir 8 horas de turno
    
    return {
      id: createdTurno.id,
      usuario_id: createdTurno.usuario_id,
      fecha: fecha.toISOString().split('T')[0],
      hora_entrada: createdTurno.hora_entrada,
      hora_salida: createdTurno.hora_salida,
      estado: createdTurno.estado,
      observaciones: createdTurno.observaciones,
      created_at: new Date(createdTurno.created_at).toISOString().split('T')[0],
      // Campos adicionales para el frontend
      empleado: 'N/A', // Se calculará cuando se obtenga la lista
      fecha_inicio: fechaInicio.toISOString().slice(0, 16),
      fecha_fin: fechaFin.toISOString().slice(0, 16),
      tipo: createdTurno.observaciones ? createdTurno.observaciones.replace('Turno ', '') : 'normal',
      duracion: '8h 0m'
    } as Turno;
  } catch (error) {
    console.error('Error detallado en createTurno:', error);
    throw error;
  }
}

export async function updateTurno(id: number, turno: {
  hora_salida?: string;
  estado?: 'activo' | 'completado' | 'ausente';
  observaciones?: string;
}): Promise<Turno | null> {
  try {
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
  } catch (error) {
    console.error('Error en updateTurno:', error);
    throw error;
  }
}

export async function getTurnoActivoByUser(userId: number, fecha: Date): Promise<Turno | null> {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM turnos 
      WHERE usuario_id = ? AND fecha = ? AND estado = 'activo'
    `, [userId, fecha]);
    
    if ((rows as any[]).length === 0) return null;
    return (rows as any[])[0] as Turno;
  } catch (error) {
    console.error('Error en getTurnoActivoByUser:', error);
    throw error;
  }
}

// Funciones para Asistencias
export async function getAllAsistencias(): Promise<Asistencia[]> {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM asistencias
      ORDER BY created_at DESC
    `);
    
    return (rows as any[]).map((row: any) => ({
      id: row.id,
      usuario_id: row.usuario_id,
      fecha: row.fecha,
      hora_entrada: row.hora_entrada,
      hora_salida: row.hora_salida,
      estado: row.estado,
      observaciones: row.observaciones,
      created_at: row.created_at
    }));
  } catch (error) {
    console.error('Error en getAllAsistencias:', error);
    throw error;
  }
}

export async function getAsistenciasByUser(userId: number): Promise<Asistencia[]> {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM asistencias
      WHERE usuario_id = ?
      ORDER BY created_at DESC
    `, [userId]);
    
    return (rows as any[]).map((row: any) => ({
      id: row.id,
      usuario_id: row.usuario_id,
      fecha: row.fecha,
      hora_entrada: row.hora_entrada,
      hora_salida: row.hora_salida,
      estado: row.estado,
      observaciones: row.observaciones,
      created_at: row.created_at
    }));
  } catch (error) {
    console.error('Error en getAsistenciasByUser:', error);
    throw error;
  }
}

export async function getAsistenciaById(id: number): Promise<Asistencia | null> {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM asistencias
      WHERE id = ?
    `, [id]);
    
    if ((rows as any[]).length === 0) return null;
    return (rows as any[])[0] as Asistencia;
  } catch (error) {
    console.error('Error en getAsistenciaById:', error);
    throw error;
  }
}

export async function createAsistencia(asistencia: {
  usuario_id: number;
  fecha: Date;
  hora_entrada: string; // Ahora es obligatorio
  estado?: 'presente' | 'ausente' | 'tardanza';
  observaciones?: string;
}): Promise<Asistencia> {
  try {
    console.log('Datos recibidos en createAsistencia:', asistencia);
    
    // Asegurar que la tabla asistencias existe
    await ensureAsistenciasTable();
    
    // Validar que el usuario existe
    const [userCheck] = await pool.query(
      'SELECT id FROM usuarios WHERE id = ?',
      [asistencia.usuario_id]
    );
    
    if ((userCheck as any[]).length === 0) {
      throw new Error(`Usuario con ID ${asistencia.usuario_id} no existe`);
    }

    // Validar que hora_entrada esté presente
    if (!asistencia.hora_entrada) {
      throw new Error('El campo hora_entrada es obligatorio');
    }

    console.log('Insertando asistencia con datos:', {
      usuario_id: asistencia.usuario_id,
      fecha: asistencia.fecha,
      hora_entrada: asistencia.hora_entrada,
      estado: asistencia.estado || 'presente',
      observaciones: asistencia.observaciones || ''
    });

    const [result] = await pool.query(
      `INSERT INTO asistencias (usuario_id, fecha, hora_entrada, estado, observaciones)
       VALUES (?, ?, ?, ?, ?)`,
      [
        asistencia.usuario_id,
        asistencia.fecha,
        asistencia.hora_entrada,
        asistencia.estado || 'presente',
        asistencia.observaciones || ''
      ]
    );
    
    console.log('Asistencia creada con ID:', (result as any).insertId);
    
    const [rows] = await pool.query('SELECT * FROM asistencias WHERE id = ?', [(result as any).insertId]);
    return (rows as any[])[0] as Asistencia;
  } catch (error) {
    console.error('Error detallado en createAsistencia:', error);
    console.error('Stack trace:', (error as Error).stack);
    throw error;
  }
}

export async function updateAsistencia(id: number, asistencia: {
  hora_salida?: string;
  estado?: 'presente' | 'ausente' | 'tardanza';
  observaciones?: string;
}): Promise<Asistencia | null> {
  try {
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
  } catch (error) {
    console.error('Error en updateAsistencia:', error);
    throw error;
  }
}

export async function getAsistenciaByUserAndDate(userId: number, fecha: Date): Promise<Asistencia | null> {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM asistencias 
      WHERE usuario_id = ? AND fecha = ?
    `, [userId, fecha]);
    
    if ((rows as any[]).length === 0) return null;
    return (rows as any[])[0] as Asistencia;
  } catch (error) {
    console.error('Error en getAsistenciaByUserAndDate:', error);
    throw error;
  }
}

export async function getAsistenciasByDateRange(startDate: Date, endDate: Date): Promise<Asistencia[]> {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM asistencias
      WHERE fecha BETWEEN ? AND ?
      ORDER BY fecha DESC, hora_entrada DESC
    `, [startDate, endDate]);
    return rows as Asistencia[];
  } catch (error) {
    console.error('Error en getAsistenciasByDateRange:', error);
    throw error;
  }
} 