/**
 * REPOSITORIO DE CLIENTES
 * 
 * Este archivo contiene las funciones de acceso a datos para la gestión de clientes.
 * Todas las funciones interactúan directamente con la tabla 'cliente' en la base de datos.
 * 
 * Base de datos: Tabla 'cliente'
 * - Campos principales: id_cliente (PK), nombre_cliente, apellido_cliente, telefono
 * - Campos de dirección: calle, cruzado, colonia, codigo_postal, municipio, estado
 * - Campo especial: frecuente (boolean para identificar clientes frecuentes)
 */

import { pool } from '../config/database';

/**
 * Obtiene todos los clientes de la base de datos
 * @returns {Promise<Array>} Array con todos los clientes
 * 
 * Consulta SQL: SELECT * FROM cliente
 * Uso: Para mostrar lista completa de clientes en el frontend
 */
export async function getAllClients() {
  const [rows] = await pool.query('SELECT * FROM cliente');
  return rows;
}

/**
 * Obtiene un cliente específico por su ID
 * @param {number} id_cliente - ID del cliente a obtener
 * @returns {Promise<Object|null>} Cliente encontrado o null si no existe
 * 
 * Consulta SQL: SELECT * FROM cliente WHERE id_cliente = ?
 * Uso: Para obtener datos de un cliente específico (edición, detalles)
 */
export async function getClientById(id_cliente: number) {
  const [rows] = await pool.query('SELECT * FROM cliente WHERE id_cliente = ?', [id_cliente]);
  return (rows as any[])[0] || null;
}

/**
 * Crea un nuevo cliente en la base de datos
 * @param {Object} client - Objeto con datos del cliente
 * @param {string} client.nombre_cliente - Nombre del cliente
 * @param {string} client.apellido_cliente - Apellido del cliente
 * @param {string} client.telefono - Teléfono del cliente
 * @param {string} client.calle - Calle de la dirección
 * @param {string} client.cruzado - Cruzado con (opcional)
 * @param {string} client.colonia - Colonia
 * @param {string} client.codigo_postal - Código postal
 * @param {string} client.municipio - Municipio
 * @param {string} client.estado - Estado
 * @param {boolean} client.frecuente - Si es cliente frecuente
 * @returns {Promise<Object>} Cliente recién creado con ID
 * 
 * Consulta SQL: INSERT INTO cliente (...) VALUES (...)
 * Uso: Formulario de nuevo cliente
 */
export async function createClient(client: { 
  nombre_cliente: string; 
  apellido_cliente: string;
  telefono?: string;
  calle?: string;
  cruzado?: string;
  colonia?: string;
  codigo_postal?: string;
  municipio?: string;
  estado?: string;
  frecuente?: boolean;
}) {
  const [result] = await pool.query(
    'INSERT INTO cliente (nombre_cliente, apellido_cliente, telefono, calle, cruzado, colonia, codigo_postal, municipio, estado, frecuente) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [client.nombre_cliente, client.apellido_cliente, client.telefono, client.calle, client.cruzado, client.colonia, client.codigo_postal, client.municipio, client.estado, client.frecuente]
  );
  
  // Obtener el cliente recién creado
  const [rows] = await pool.query('SELECT * FROM cliente WHERE id_cliente = ?', [(result as any).insertId]);
  return (rows as any[])[0];
}

/**
 * Actualiza un cliente existente en la base de datos
 * @param {number} id_cliente - ID del cliente a actualizar
 * @param {Object} client - Objeto con datos actualizados del cliente
 * @returns {Promise<Object|null>} Cliente actualizado o null si no existe
 * 
 * Consulta SQL: UPDATE cliente SET ... WHERE id_cliente = ?
 * Uso: Formulario de edición de cliente
 */
export async function updateClient(id_cliente: number, client: { 
  nombre_cliente: string; 
  apellido_cliente: string;
  telefono?: string;
  calle?: string;
  cruzado?: string;
  colonia?: string;
  codigo_postal?: string;
  municipio?: string;
  estado?: string;
  frecuente?: boolean;
}) {
  await pool.query(
    'UPDATE cliente SET nombre_cliente = ?, apellido_cliente = ?, telefono = ?, calle = ?, cruzado = ?, colonia = ?, codigo_postal = ?, municipio = ?, estado = ?, frecuente = ? WHERE id_cliente = ?',
    [client.nombre_cliente, client.apellido_cliente, client.telefono, client.calle, client.cruzado, client.colonia, client.codigo_postal, client.municipio, client.estado, client.frecuente, id_cliente]
  );
  
  // Obtener el cliente actualizado
  const [rows] = await pool.query('SELECT * FROM cliente WHERE id_cliente = ?', [id_cliente]);
  return (rows as any[])[0];
}

/**
 * Elimina un cliente de la base de datos
 * @param {number} id_cliente - ID del cliente a eliminar
 * @returns {Promise<Object|null>} Cliente eliminado o null si no existe
 * 
 * Consulta SQL: DELETE FROM cliente WHERE id_cliente = ?
 * Uso: Botón eliminar en lista de clientes
 */
export async function deleteClient(id_cliente: number) {
  const [rows] = await pool.query('SELECT * FROM cliente WHERE id_cliente = ?', [id_cliente]);
  if ((rows as any[]).length > 0) {
    await pool.query('DELETE FROM cliente WHERE id_cliente = ?', [id_cliente]);
    return (rows as any[])[0];
  }
  return null;
} 