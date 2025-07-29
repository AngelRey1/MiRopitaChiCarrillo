import { Request, Response } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from './itemRepository';
// import {
//   getVentas,
//   getVentaById,
//   crearVenta
// } from './salesRepository'; // Comentado - usando nuevas rutas de ventas
import {
  getAllClients,
  createClient,
  updateClient,
  deleteClient
} from './clientRepository';
import {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from './supplierRepository';
import {
  authenticateUser,
  getAllUsers,
  getUserById,
  getAllRoles,
  assignRoleToUser,
  removeRoleFromUser,
  updateUserStatus
} from './userRepository';
import {
  getAllTurnos,
  getTurnosByUser as getTurnosByUserRepo,
  createTurno as createTurnoRepo,
  updateTurno as updateTurnoRepo,
  getAllAsistencias,
  getAsistenciasByUser as getAsistenciasByUserRepo,
  createAsistencia as createAsistenciaRepo,
  updateAsistencia as updateAsistenciaRepo
} from './turnoRepository';
import {
  getAllPedidos,
  getPedidosByUser as getPedidosByUserRepo,
  getPedidoById as getPedidoByIdRepo,
  createPedido as createPedidoRepo,
  updatePedido as updatePedidoRepo,
  getDetallesPedido as getDetallesPedidoRepo
} from './pedidoRepository';

// Controladores existentes para productos
export async function getProducts(req: Request, res: Response) {
  const products = await getAllProducts();
  res.json(products);
}

export async function getProduct(req: Request, res: Response) {
  const id_producto = parseInt(req.params.id, 10);
  const product = await getProductById(id_producto);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
}

export async function postProduct(req: Request, res: Response) {
  const producto = req.body;
  const newProduct = await createProduct(producto);
  res.status(201).json(newProduct);
}

export async function putProduct(req: Request, res: Response) {
  const id_producto = parseInt(req.params.id, 10);
  const producto = req.body;
  const updatedProduct = await updateProduct(id_producto, producto);
  if (updatedProduct) {
    res.json(updatedProduct);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
}

export async function deleteProductById(req: Request, res: Response) {
  const id_producto = parseInt(req.params.id, 10);
  const deletedProduct = await deleteProduct(id_producto);
  if (deletedProduct) {
    res.json({ message: 'Producto eliminado', deletedProduct });
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
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

// Controladores existentes para clientes
export async function getClients(req: Request, res: Response) {
  const clients = await getAllClients();
  res.json(clients);
}

export async function postClient(req: Request, res: Response) {
  const client = req.body;
  const newClient = await createClient(client);
  res.status(201).json(newClient);
}

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