import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Role, UserWithRoles, LoginRequest, AuthResponse } from '../types';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'J4flores24',
  database: 'myropitacarrillochi',
  port: 3306,
});

const JWT_SECRET = process.env.JWT_SECRET || 'miropita-secret-key-2024';

export async function getAllUsers(): Promise<User[]> {
  const [rows] = await pool.query(`
    SELECT u.*, GROUP_CONCAT(r.nombre) as roles
    FROM usuarios u
    LEFT JOIN usuarios_roles ur ON u.id = ur.usuario_id
    LEFT JOIN roles r ON ur.role_id = r.id
    WHERE u.activo = true
    GROUP BY u.id
  `);
  return rows as User[];
}

export async function getUserById(id: number): Promise<UserWithRoles | null> {
  const [rows] = await pool.query(`
    SELECT u.*, r.id as role_id, r.nombre as role_nombre, r.descripcion as role_descripcion, r.permisos
    FROM usuarios u
    LEFT JOIN usuarios_roles ur ON u.id = ur.usuario_id
    LEFT JOIN roles r ON ur.role_id = r.id
    WHERE u.id = ? AND u.activo = true
  `, [id]);
  
  if ((rows as any[]).length === 0) return null;
  
  const userData = (rows as any[])[0];
  const roles: Role[] = [];
  
  // Procesar roles
  (rows as any[]).forEach((row: any) => {
    if (row.role_id) {
      roles.push({
        id: row.role_id,
        nombre: row.role_nombre,
        descripcion: row.role_descripcion,
        permisos: JSON.parse(row.permisos || '[]')
      });
    }
  });
  
  return {
    ...userData,
    roles
  };
}

export async function getUserByUsername(username: string): Promise<UserWithRoles | null> {
  const [rows] = await pool.query(`
    SELECT u.*, r.id as role_id, r.nombre as role_nombre, r.descripcion as role_descripcion, r.permisos
    FROM usuarios u
    LEFT JOIN usuarios_roles ur ON u.id = ur.usuario_id
    LEFT JOIN roles r ON ur.role_id = r.id
    WHERE u.username = ? AND u.activo = true
  `, [username]);
  
  if ((rows as any[]).length === 0) return null;
  
  const userData = (rows as any[])[0];
  const roles: Role[] = [];
  
  // Procesar roles
  (rows as any[]).forEach((row: any) => {
    if (row.role_id) {
      let permisos: string[] = [];
      try {
        // Intentar parsear como JSON
        if (row.permisos && typeof row.permisos === 'string') {
          permisos = JSON.parse(row.permisos);
        } else if (row.permisos && Array.isArray(row.permisos)) {
          permisos = row.permisos;
        } else {
          // Si no es JSON válido, usar un array vacío
          permisos = [];
        }
      } catch (error) {
        console.warn('Error parsing permisos for role:', row.role_nombre, error);
        permisos = [];
      }
      
      roles.push({
        id: row.role_id,
        nombre: row.role_nombre,
        descripcion: row.role_descripcion,
        permisos: permisos
      });
    }
  });
  
  return {
    ...userData,
    roles
  };
}

export async function authenticateUser(loginData: LoginRequest): Promise<AuthResponse | null> {
  try {
    console.log('🔍 Authenticating user:', loginData.username);
    
    const user = await getUserByUsername(loginData.username);
    console.log('🔍 User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('❌ User not found');
      return null;
    }
    
    console.log('🔍 Comparing passwords...');
    const isValidPassword = await bcrypt.compare(loginData.password, user.password);
    console.log('🔍 Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('❌ Invalid password');
      return null;
    }
    
    console.log('🔍 Updating last login...');
    // Actualizar último login
    await updateLastLogin(user.id);
    
    console.log('🔍 Generating JWT token...');
    // Generar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles.map(role => role.nombre)
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    console.log('✅ Authentication successful');
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        roles: user.roles
      }
    };
  } catch (error) {
    console.error('💥 Authentication error:', error);
    throw error;
  }
}

export async function updateLastLogin(userId: number): Promise<void> {
  await pool.query(
    'UPDATE usuarios SET ultimo_login = NOW() WHERE id = ?',
    [userId]
  );
}

export async function assignRoleToUser(userId: number, roleId: number): Promise<void> {
  await pool.query(
    'INSERT INTO usuarios_roles (usuario_id, role_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE role_id = role_id',
    [userId, roleId]
  );
}

export async function removeRoleFromUser(userId: number, roleId: number): Promise<void> {
  await pool.query(
    'DELETE FROM usuarios_roles WHERE usuario_id = ? AND role_id = ?',
    [userId, roleId]
  );
}

export async function getAllRoles(): Promise<Role[]> {
  const [rows] = await pool.query('SELECT * FROM roles');
  return (rows as any[]).map((row: any) => {
    let permisos: string[] = [];
    try {
      // Intentar parsear como JSON
      if (row.permisos && typeof row.permisos === 'string') {
        permisos = JSON.parse(row.permisos);
      } else if (row.permisos && Array.isArray(row.permisos)) {
        permisos = row.permisos;
      } else {
        // Si no es JSON válido, usar un array vacío
        permisos = [];
      }
    } catch (error) {
      console.warn('Error parsing permisos for role:', row.nombre, error);
      permisos = [];
    }
    
    return {
      id: row.id,
      nombre: row.nombre,
      descripcion: row.descripcion,
      permisos: permisos
    };
  });
}

export async function getRoleById(id: number): Promise<Role | null> {
  const [rows] = await pool.query('SELECT * FROM roles WHERE id = ?', [id]);
  if ((rows as any[]).length === 0) return null;
  
  const row = (rows as any[])[0];
  let permisos: string[] = [];
  try {
    // Intentar parsear como JSON
    if (row.permisos && typeof row.permisos === 'string') {
      permisos = JSON.parse(row.permisos);
    } else if (row.permisos && Array.isArray(row.permisos)) {
      permisos = row.permisos;
    } else {
      // Si no es JSON válido, usar un array vacío
      permisos = [];
    }
  } catch (error) {
    console.warn('Error parsing permisos for role:', row.nombre, error);
    permisos = [];
  }
  
  return {
    id: row.id,
    nombre: row.nombre,
    descripcion: row.descripcion,
    permisos: permisos
  };
}

export async function createRole(role: { nombre: string; descripcion: string; permisos: string[] }): Promise<Role> {
  const [result] = await pool.query(
    'INSERT INTO roles (nombre, descripcion, permisos) VALUES (?, ?, ?)',
    [role.nombre, role.descripcion, JSON.stringify(role.permisos)]
  );
  
  const [rows] = await pool.query('SELECT * FROM roles WHERE id = ?', [(result as any).insertId]);
  const row = (rows as any[])[0];
  
  return {
    id: row.id,
    nombre: row.nombre,
    descripcion: row.descripcion,
    permisos: JSON.parse(row.permisos || '[]')
  };
}

export async function updateUserStatus(userId: number, activo: boolean): Promise<void> {
  await pool.query(
    'UPDATE usuarios SET activo = ? WHERE id = ?',
    [activo, userId]
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function hasPermission(userRoles: Role[], requiredPermission: string): boolean {
  return userRoles.some(role => 
    role.permisos.includes('*') || role.permisos.includes(requiredPermission)
  );
} 