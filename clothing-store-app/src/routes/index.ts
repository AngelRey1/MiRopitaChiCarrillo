import { Router } from 'express';
import {
  getProducts,
  getProduct,
  postProduct,
  putProduct,
  deleteProductById,
  postVenta,
  getVentasList,
  getVentaDetalle,
  getClients,
  postClient,
  putClient,
  deleteClientById,
  getSuppliers,
  postSupplier,
  putSupplier,
  deleteSupplierById
} from '../controllers';

const router = Router();

router.get('/productos', getProducts);
router.get('/productos/:id', getProduct);
router.post('/productos', postProduct);
router.put('/productos/:id', putProduct);
router.delete('/productos/:id', deleteProductById);
router.post('/ventas', postVenta);
router.get('/ventas', getVentasList);
router.get('/ventas/:id', getVentaDetalle);
router.get('/clientes', getClients);
router.post('/clientes', postClient);
router.put('/clientes/:id', putClient);
router.delete('/clientes/:id', deleteClientById);
router.get('/proveedores', getSuppliers);
router.post('/proveedores', postSupplier);
router.put('/proveedores/:id', putSupplier);
router.delete('/proveedores/:id', deleteSupplierById);

export default router;