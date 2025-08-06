// =====================================================
// ARCHIVO: index.ts
// DESCRIPCIÓN: Controlador principal que maneja todas las operaciones CRUD
// FUNCIÓN: Coordina las peticiones HTTP con los repositorios de datos
// =====================================================

// Importaciones necesarias para Express
import { Request, Response } from 'express';

// =====================================================
// IMPORTACIONES DE REPOSITORIOS
// =====================================================

// Importar funciones del repositorio de productos
import {
  getAllProducts,      // Obtener todos los productos
  getProductById,      // Obtener producto por ID
  createProduct,       // Crear nuevo producto
  updateProduct,       // Actualizar producto existente
  deleteProduct        // Eliminar producto
} from './itemRepository';

// Importar funciones del repositorio de clientes
import {
  getAllClients,       // Obtener todos los clientes
  getClientById,       // Obtener cliente por ID
  createClient,        // Crear nuevo cliente
  updateClient,        // Actualizar cliente existente
  deleteClient         // Eliminar cliente
} from './clientRepository';

// Importar funciones del repositorio de proveedores
import {
  getAllSuppliers,     // Obtener todos los proveedores
  createSupplier,      // Crear nuevo proveedor
  updateSupplier,      // Actualizar proveedor existente
  deleteSupplier       // Eliminar proveedor
} from './supplierRepository';

// Importar funciones del repositorio de usuarios y autenticación
import {
  authenticateUser,    // Autenticar usuario (login)
  getAllUsers,         // Obtener todos los usuarios
  getUserById,         // Obtener usuario por ID
  getAllRoles,         // Obtener todos los roles
  assignRoleToUser,    // Asignar rol a usuario
  removeRoleFromUser,  // Remover rol de usuario
  updateUserStatus,    // Actualizar estado de usuario
  createUserInRepo,    // Crear nuevo usuario
  updateUserInRepo,    // Actualizar usuario existente
  createRoleInRepo,    // Crear nuevo rol
  updateRoleInRepo     // Actualizar rol existente
} from './userRepository';

// Importar funciones del repositorio de turnos y asistencias
import {
  getAllTurnos,        // Obtener todos los turnos
  getTurnosByUser as getTurnosByUserRepo,      // Obtener turnos por usuario
  getTurnoById as getTurnoByIdRepo,            // Obtener turno por ID
  createTurno as createTurnoRepo,              // Crear nuevo turno
  updateTurno as updateTurnoRepo,              // Actualizar turno existente
  getAllAsistencias,   // Obtener todas las asistencias
  getAsistenciasByUser as getAsistenciasByUserRepo, // Obtener asistencias por usuario
  getAsistenciaById as getAsistenciaByIdRepo,  // Obtener asistencia por ID
  createAsistencia as createAsistenciaRepo,    // Crear nueva asistencia
  updateAsistencia as updateAsistenciaRepo     // Actualizar asistencia existente
} from './turnoRepository';

// Importar funciones del repositorio de pedidos
import {
  getAllPedidos,       // Obtener todos los pedidos
  getPedidosByUser as getPedidosByUserRepo,    // Obtener pedidos por usuario
  getPedidoById as getPedidoByIdRepo,          // Obtener pedido por ID
  createPedido as createPedidoRepo,            // Crear nuevo pedido
  updatePedido as updatePedidoRepo,            // Actualizar pedido existente
  getDetallesPedido as getDetallesPedidoRepo   // Obtener detalles de pedido
} from './pedidoRepository';

// =====================================================
// CONTROLADORES PARA PRODUCTOS
// =====================================================

// Controlador para obtener todos los productos
// GET /api/productos
export async function getProducts(req: Request, res: Response) {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
}

// Controlador para obtener un producto específico por ID
// GET /api/productos/:id
export async function getProduct(req: Request, res: Response) {
  try {
    const id_producto = parseInt(req.params.id, 10);
    const product = await getProductById(id_producto);
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto' });
  }
}

// Controlador para crear un nuevo producto
// POST /api/productos
export async function postProduct(req: Request, res: Response) {
  try {
    const producto = req.body;
    const newProduct = await createProduct(producto);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
}

// Controlador para actualizar un producto existente
// PUT /api/productos/:id
export async function putProduct(req: Request, res: Response) {
  try {
    const id_producto = parseInt(req.params.id, 10);
    const producto = req.body;
    const updatedProduct = await updateProduct(id_producto, producto);
    
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
}

// Controlador para eliminar un producto
// DELETE /api/productos/:id
export async function deleteProductById(req: Request, res: Response) {
  try {
    const id_producto = parseInt(req.params.id, 10);
    const deletedProduct = await deleteProduct(id_producto);
    
    if (deletedProduct) {
      res.json({ message: 'Producto eliminado', deletedProduct });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
}

// Controladores existentes para ventas
// export async function postVenta(req: Request, res: Response) {
//   try {
//     const venta = await crearVenta(req.body);
//     res.status(201).json(venta);
//   } catch (err) {
//     res.status(500).json({ error: 'Error al registrar la venta', details: err });
//   }
// }

// export async function getVentasList(req: Request, res: Response) {
//   try {
//     const ventas = await getVentas();
//     res.json(ventas);
//   } catch (err) {
//     res.status(500).json({ error: 'Error al obtener las ventas', details: err });
//   }
// }

// export async function getVentaDetalle(req: Request, res: Response) {
//   try {
//     const id_venta = parseInt(req.params.id, 10);
//     const venta = await getVentaById(id_venta);
//     if (venta) {
//       res.json(venta);
//     } else {
//       res.status(404).json({ error: 'Venta no encontrada' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: 'Error al obtener la venta', details: err });
//   }
// }

/**
 * CONTROLADORES PARA GESTIÓN DE CLIENTES
 * 
 * Base de datos: Tabla 'cliente'
 * - Campos principales: id_cliente, nombre_cliente, apellido_cliente, telefono
 * - Campos de dirección: calle, cruzado, colonia, codigo_postal, municipio, estado
 * - Campo especial: frecuente (boolean para clientes frecuentes)
 * 
 * Funciones CRUD completas para gestión de clientes
 */

/**
 * GET /api/clientes
 * Obtiene todos los clientes de la base de datos
 * - Consulta: SELECT * FROM cliente
 * - Retorna: Array con todos los clientes
 * - Uso: Para mostrar lista de clientes en el frontend
 */
export async function getClients(req: Request, res: Response) {
  const clients = await getAllClients();
  res.json(clients);
}

/**
 * GET /api/clientes/:id
 * Obtiene un cliente específico por su ID
 * - Parámetros: ID del cliente en la URL
 * - Consulta: SELECT * FROM cliente WHERE id_cliente = ?
 * - Retorna: Cliente específico o error 404
 * - Uso: Para obtener datos de un cliente para edición o detalles
 */
export async function getClient(req: Request, res: Response) {
  try {
    const id_cliente = parseInt(req.params.id, 10);
    const client = await getClientById(id_cliente);
    
    if (client) {
      res.json(client);
    } else {
      res.status(404).json({ error: 'Cliente no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cliente' });
  }
}

/**
 * POST /api/clientes
 * Crea un nuevo cliente en la base de datos
 * - Parámetros: nombre_cliente, apellido_cliente, telefono, dirección completa
 * - Consulta: INSERT INTO cliente (...)
 * - Retorna: Cliente recién creado con ID
 * - Uso: Formulario de nuevo cliente
 */
export async function postClient(req: Request, res: Response) {
  const client = req.body;
  const newClient = await createClient(client);
  res.status(201).json(newClient);
}

/**
 * PUT /api/clientes/:id
 * Actualiza un cliente existente en la base de datos
 * - Parámetros: ID del cliente + datos actualizados
 * - Consulta: UPDATE cliente SET ... WHERE id_cliente = ?
 * - Retorna: Cliente actualizado o error 404
 * - Uso: Formulario de edición de cliente
 */
export async function putClient(req: Request, res: Response) {
  const id_cliente = parseInt(req.params.id, 10);
  const client = req.body;
  const updatedClient = await updateClient(id_cliente, client);
  if (updatedClient) {
    res.json(updatedClient);
  } else {
    res.status(404).json({ error: 'Cliente no encontrado' });
  }
}

/**
 * DELETE /api/clientes/:id
 * Elimina un cliente de la base de datos
 * - Parámetros: ID del cliente a eliminar
 * - Consulta: DELETE FROM cliente WHERE id_cliente = ?
 * - Retorna: Cliente eliminado o error 404
 * - Uso: Botón eliminar en lista de clientes
 */
export async function deleteClientById(req: Request, res: Response) {
  const id_cliente = parseInt(req.params.id, 10);
  const deletedClient = await deleteClient(id_cliente);
  if (deletedClient) {
    res.json({ message: 'Cliente eliminado', deletedClient });
  } else {
    res.status(404).json({ error: 'Cliente no encontrado' });
  }
}

// Controladores existentes para proveedores
export async function getSuppliers(req: Request, res: Response) {
  const suppliers = await getAllSuppliers();
  res.json(suppliers);
}

export async function postSupplier(req: Request, res: Response) {
  const supplier = req.body;
  const newSupplier = await createSupplier(supplier);
  res.status(201).json(newSupplier);
}

export async function putSupplier(req: Request, res: Response) {
  const id_proveedor = parseInt(req.params.id, 10);
  const supplier = req.body;
  const updatedSupplier = await updateSupplier(id_proveedor, supplier);
  if (updatedSupplier) {
    res.json(updatedSupplier);
  } else {
    res.status(404).json({ error: 'Proveedor no encontrado' });
  }
}

export async function deleteSupplierById(req: Request, res: Response) {
  const id_proveedor = parseInt(req.params.id, 10);
  const deletedSupplier = await deleteSupplier(id_proveedor);
  if (deletedSupplier) {
    res.json({ message: 'Proveedor eliminado', deletedSupplier });
  } else {
    res.status(404).json({ error: 'Proveedor no encontrado' });
  }
}

// Nuevos controladores para usuarios y autenticación
export async function login(req: Request, res: Response) {
  try {
    console.log('🔐 Login attempt:', req.body);
    
    const authResult = await authenticateUser(req.body);
    console.log('🔐 Auth result:', authResult ? 'Success' : 'Failed');
    
    if (authResult) {
      res.json(authResult);
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' });
    }
  } catch (err) {
    console.error('💥 Login error:', err);
    res.status(500).json({ error: 'Error en la autenticación', details: err });
  }
}

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios', details: err });
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const user = await getUserById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuario', details: err });
  }
}

export async function getRoles(req: Request, res: Response) {
  try {
    const roles = await getAllRoles();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener roles', details: err });
  }
}

export async function assignRole(req: Request, res: Response) {
  try {
    const { userId, roleId } = req.body;
    await assignRoleToUser(userId, roleId);
    res.json({ message: 'Rol asignado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al asignar rol', details: err });
  }
}

export async function removeRole(req: Request, res: Response) {
  try {
    const { userId, roleId } = req.body;
    await removeRoleFromUser(userId, roleId);
    res.json({ message: 'Rol removido correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al remover rol', details: err });
  }
}

export async function updateUserActiveStatus(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.id, 10);
    const { activo } = req.body;
    await updateUserStatus(userId, activo);
    res.json({ message: 'Estado de usuario actualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar estado de usuario', details: err });
  }
}

// Controladores para turnos
export async function getTurnos(req: Request, res: Response) {
  try {
    const turnos = await getAllTurnos();
    res.json(turnos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener turnos', details: err });
  }
}

export async function getTurnosByUser(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.userId, 10);
    const turnos = await getTurnosByUserRepo(userId);
    res.json(turnos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener turnos del usuario', details: err });
  }
}

export async function createTurno(req: Request, res: Response) {
  try {
    const turno = await createTurnoRepo(req.body);
    res.status(201).json(turno);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear turno', details: err });
  }
}

export async function updateTurno(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const turno = await updateTurnoRepo(id, req.body);
    if (turno) {
      res.json(turno);
    } else {
      res.status(404).json({ error: 'Turno no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar turno', details: err });
  }
}

export async function getTurnoById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const turno = await getTurnoByIdRepo(id);
    if (turno) {
      res.json(turno);
    } else {
      res.status(404).json({ error: 'Turno no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener turno', details: err });
  }
}

// Controladores para asistencias
export async function getAsistencias(req: Request, res: Response) {
  try {
    const asistencias = await getAllAsistencias();
    res.json(asistencias);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener asistencias', details: err });
  }
}

export async function getAsistenciasByUser(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.userId, 10);
    const asistencias = await getAsistenciasByUserRepo(userId);
    res.json(asistencias);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener asistencias del usuario', details: err });
  }
}

export async function createAsistencia(req: Request, res: Response) {
  try {
    const asistencia = await createAsistenciaRepo(req.body);
    res.status(201).json(asistencia);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear asistencia', details: err });
  }
}

export async function updateAsistencia(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const asistencia = await updateAsistenciaRepo(id, req.body);
    if (asistencia) {
      res.json(asistencia);
    } else {
      res.status(404).json({ error: 'Asistencia no encontrada' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar asistencia', details: err });
  }
}

export async function getAsistenciaById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const asistencia = await getAsistenciaByIdRepo(id);
    if (asistencia) {
      res.json(asistencia);
    } else {
      res.status(404).json({ error: 'Asistencia no encontrada' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener asistencia', details: err });
  }
}

// Controladores para pedidos
export async function getPedidos(req: Request, res: Response) {
  try {
    const pedidos = await getAllPedidos();
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener pedidos', details: err });
  }
}

export async function getPedidosByUser(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.userId, 10);
    const pedidos = await getPedidosByUserRepo(userId);
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener pedidos del usuario', details: err });
  }
}

export async function createPedido(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const pedido = await createPedidoRepo(userId, req.body);
    res.status(201).json(pedido);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear pedido', details: err });
  }
}

export async function updatePedido(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const pedido = await updatePedidoRepo(id, req.body);
    if (pedido) {
      res.json(pedido);
    } else {
      res.status(404).json({ error: 'Pedido no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar pedido', details: err });
  }
}

export async function getDetallesPedido(req: Request, res: Response) {
  try {
    const pedidoId = parseInt(req.params.pedidoId, 10);
    const detalles = await getDetallesPedidoRepo(pedidoId);
    res.json(detalles);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener detalles del pedido', details: err });
  }
}

// Exportar funciones de ventas
export {
  getVentas,
  getVentaById,
  crearVenta
} from './salesRepository';

// Exportar funciones de pedidos
export {
  getAllPedidos,
  getPedidosByUser as getPedidosByUserRepo,
  getPedidoById as getPedidoByIdRepo,
  createPedido as createPedidoRepo,
  updatePedido as updatePedidoRepo,
  getDetallesPedido as getDetallesPedidoRepo,
  getPedidosStats
} from './pedidoRepository';

// Exportar funciones de devoluciones
export {
  getAllDevoluciones,
  getDevolucionesByUser,
  getDevolucionById,
  createDevolucion,
  updateDevolucion,
  getDetallesDevolucion,
  getDevolucionesByVenta,
  getDevolucionesStats
} from './devolucionRepository';

// Nuevas funciones para CRUD completo de usuarios y roles
export async function createUser(req: Request, res: Response) {
  try {
    const { username, password, nombre, apellido, email, activo = true } = req.body;
    
    // Validar campos requeridos
    if (!username || !password || !nombre || !apellido || !email) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    
    // Crear usuario usando la función del repositorio
    const newUser = await createUserInRepo({ username, password, nombre, apellido, email, activo });
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error creando usuario:', err);
    res.status(500).json({ error: 'Error al crear usuario', details: err });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.id, 10);
    const { username, nombre, apellido, email, activo } = req.body;
    
    // Validar campos requeridos
    if (!username || !nombre || !apellido || !email) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    
    // Actualizar usuario usando la función del repositorio
    const updatedUser = await updateUserInRepo(userId, { username, nombre, apellido, email, activo });
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (err) {
    console.error('Error actualizando usuario:', err);
    res.status(500).json({ error: 'Error al actualizar usuario', details: err });
  }
}

export async function createRole(req: Request, res: Response) {
  try {
    const { nombre, descripcion, permisos = [] } = req.body;
    
    // Validar campos requeridos
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre del rol es requerido' });
    }
    
    // Crear rol usando la función del repositorio
    const newRole = await createRoleInRepo({ nombre, descripcion, permisos });
    res.status(201).json(newRole);
  } catch (err) {
    console.error('Error creando rol:', err);
    res.status(500).json({ error: 'Error al crear rol', details: err });
  }
}

export async function updateRole(req: Request, res: Response) {
  try {
    const roleId = parseInt(req.params.id, 10);
    const { nombre, descripcion, permisos = [] } = req.body;
    
    // Validar campos requeridos
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre del rol es requerido' });
    }
    
    // Actualizar rol usando la función del repositorio
    const updatedRole = await updateRoleInRepo(roleId, { nombre, descripcion, permisos });
    if (updatedRole) {
      res.json(updatedRole);
    } else {
      res.status(404).json({ error: 'Rol no encontrado' });
    }
  } catch (err) {
    console.error('Error actualizando rol:', err);
    res.status(500).json({ error: 'Error al actualizar rol', details: err });
  }
}