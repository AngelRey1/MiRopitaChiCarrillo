import { Request, Response } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from './itemRepository';
import { crearVenta, getVentas, getVentaById } from './salesRepository';
import { getAllClients, createClient, updateClient, deleteClient } from './clientRepository';
import { getAllSuppliers, createSupplier, updateSupplier, deleteSupplier } from './supplierRepository';

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

export async function postVenta(req: Request, res: Response) {
  try {
    const venta = await crearVenta(req.body);
    res.status(201).json(venta);
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar la venta', details: err });
  }
}

export async function getVentasList(req: Request, res: Response) {
  try {
    const ventas = await getVentas();
    res.json(ventas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener ventas', details: err });
  }
}

export async function getVentaDetalle(req: Request, res: Response) {
  try {
    const venta = await getVentaById(Number(req.params.id));
    if (venta) {
      res.json(venta);
    } else {
      res.status(404).json({ error: 'Venta no encontrada' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener detalle de venta', details: err });
  }
}

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