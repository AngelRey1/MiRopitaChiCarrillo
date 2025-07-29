import express from 'express';
import routes from './routes';
import path from 'path';
import cors from 'cors';
import { testConnection } from './config/database';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Sirve archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

testConnection();

app.use('/api', routes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

// Rutas para las páginas de gestión
app.get('/ventas', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/ventas.html'));
});

app.get('/ventas/nueva', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/ventas.html'));
});

app.get('/pedidos', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pedidos.html'));
});

app.get('/pedidos/nuevo', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pedidos.html'));
});

app.get('/devoluciones', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/devoluciones.html'));
});

app.get('/devoluciones/nueva', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/devoluciones.html'));
});

// Rutas para productos
app.get('/productos', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/productos.html'));
});

app.get('/productos/nuevo', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/productos.html'));
});

// Rutas para proveedores
app.get('/proveedores', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/proveedores.html'));
});

app.get('/proveedores/nuevo', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/proveedores.html'));
});

// Rutas para RRHH
app.get('/rrhh/turnos', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/rrhh.html'));
});

app.get('/rrhh/asistencias', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/rrhh.html'));
});

// Rutas para administración
app.get('/admin/usuarios', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

app.get('/admin/roles', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});