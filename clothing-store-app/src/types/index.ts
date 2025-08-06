// =====================================================
// ARCHIVO: index.ts
// DESCRIPCIÓN: Definición de tipos TypeScript para toda la aplicación
// FUNCIÓN: Interfaces y tipos para validación de datos y autocompletado
// =====================================================

// =====================================================
// TIPOS PARA PRODUCTOS/ITEMS (LEGACY - MANTENER COMPATIBILIDAD)
// =====================================================

// Interfaz para productos genéricos (usado en algunas partes del sistema)
export interface Item {
    id: number;           // Identificador único del producto
    name: string;         // Nombre del producto
    description: string;  // Descripción detallada
    price: number;        // Precio de venta
    size: string;         // Talla del producto
    color: string;        // Color del producto
    quantity: number;     // Cantidad disponible en inventario
}

// Interfaz para crear nuevos productos (sin ID)
export interface ItemRequest {
    name: string;         // Nombre del producto
    description: string;  // Descripción detallada
    price: number;        // Precio de venta
    size: string;         // Talla del producto
    color: string;        // Color del producto
    quantity: number;     // Cantidad inicial en inventario
}

// =====================================================
// TIPOS PARA SISTEMA DE USUARIOS Y AUTENTICACIÓN
// =====================================================

// Enum para roles del sistema (valores constantes)
export enum UserRole {
    ADMIN = 'admin',           // Administrador con acceso total
    VENDEDOR = 'vendedor',     // Vendedor con acceso a ventas
    INVENTARIO = 'inventario', // Gestión de inventario
    ENVIOS = 'envios',         // Gestión de envíos
    DEVOLUCIONES = 'devoluciones', // Gestión de devoluciones
    RRHH = 'rrhh'             // Recursos Humanos
}

// Interfaz para usuarios del sistema
export interface User {
    id: number;           // Identificador único del usuario
    username: string;     // Nombre de usuario para login
    email: string;        // Correo electrónico
    password: string;     // Contraseña encriptada
    nombre: string;       // Nombre real del usuario
    apellido: string;     // Apellido real del usuario
    telefono: string;     // Número de teléfono
    ultimo_login?: Date;  // Fecha del último acceso (opcional)
    activo: boolean;      // Estado del usuario (activo/inactivo)
    roles?: Role[];       // Roles asignados al usuario (opcional)
}

// Interfaz para roles del sistema
export interface Role {
    id: number;           // Identificador único del rol
    nombre: string;       // Nombre del rol
    descripcion: string;  // Descripción del rol
    permisos: string[];   // Array de permisos del rol
}

// Interfaz que extiende User para incluir roles obligatorios
export interface UserWithRoles extends User {
    roles: Role[];        // Roles del usuario (obligatorio)
}

// Interfaz para solicitud de login
export interface LoginRequest {
    username: string;     // Nombre de usuario
    password: string;     // Contraseña
}

// Interfaz para respuesta de autenticación exitosa
export interface AuthResponse {
    token: string;        // Token JWT para autenticación
    user: {
        id: number;       // ID del usuario
        username: string; // Nombre de usuario
        email: string;    // Email del usuario
        nombre: string;   // Nombre real
        apellido: string; // Apellido real
        roles: Role[];    // Roles del usuario
    };
}

// =====================================================
// TIPOS PARA GESTIÓN DE TURNOS Y ASISTENCIAS (RRHH)
// =====================================================

// Interfaz para turnos de trabajo
export interface Turno {
    id: number;           // Identificador único del turno
    usuario_id: number;   // ID del usuario (empleado)
    fecha: string | Date | null; // Fecha del turno (formato YYYY-MM-DD o Date)
    hora_entrada: string; // Hora de entrada (formato HH:MM)
    hora_salida?: string; // Hora de salida (opcional, formato HH:MM)
    estado: 'activo' | 'completado' | 'ausente'; // Estado del turno
    observaciones?: string; // Observaciones adicionales
    created_at: string | Date | null; // Fecha de creación del registro
    // Campos adicionales para el frontend
    empleado?: string;    // Nombre completo del empleado
    fecha_inicio?: string; // Fecha y hora de inicio (formato YYYY-MM-DDTHH:MM)
    fecha_fin?: string;   // Fecha y hora de fin (formato YYYY-MM-DDTHH:MM)
    tipo?: string;        // Tipo de turno (mañana, tarde, noche, etc.)
    duracion?: string;    // Duración del turno (ej: "8h 0m")
    usuario?: {           // Información del usuario (opcional)
        nombre: string;   // Nombre del empleado
        apellido: string; // Apellido del empleado
    };
}

// Interfaz para asistencias de empleados
export interface Asistencia {
    id: number;           // Identificador único de la asistencia
    usuario_id: number;   // ID del usuario (empleado)
    fecha: string | Date | null; // Fecha de la asistencia (formato YYYY-MM-DD o Date)
    hora_entrada: string; // Hora de entrada real
    hora_salida?: string; // Hora de salida real (opcional)
    estado: 'presente' | 'ausente' | 'tardanza' | 'salida_temprana'; // Estado de asistencia
    observaciones?: string; // Observaciones adicionales
    created_at: string | Date | null; // Fecha de creación del registro
    usuario?: {           // Información del usuario (opcional)
        nombre: string;   // Nombre del empleado
        apellido: string; // Apellido del empleado
    };
}

// =====================================================
// TIPOS PARA GESTIÓN DE PEDIDOS Y DEVOLUCIONES
// =====================================================

// Interfaz para pedidos a proveedores
export interface Pedido {
  id: number;             // Identificador único del pedido
  usuario_id: number;     // ID del usuario que creó el pedido
  proveedor_id?: number;  // ID del proveedor (opcional)
  fecha_pedido: Date;     // Fecha en que se realizó el pedido
  fecha_entrega_esperada?: Date; // Fecha esperada de entrega
  estado: 'pendiente' | 'confirmado' | 'en_camino' | 'entregado' | 'cancelado'; // Estado del pedido
  total: number;          // Total del pedido
  observaciones?: string; // Observaciones del pedido
  created_at: Date;       // Fecha de creación
  detalles?: DetallePedido[]; // Detalles del pedido (opcional)
  proveedor?: {           // Información del proveedor (opcional)
    nombre: string;       // Nombre del proveedor
  };
  usuario?: {             // Información del usuario (opcional)
    nombre: string;       // Nombre del usuario
    apellido: string;     // Apellido del usuario
  };
}

// Interfaz para detalles de pedidos
export interface DetallePedido {
    id: number;           // Identificador único del detalle
    pedido_id: number;    // ID del pedido al que pertenece
    producto_id: number;  // ID del producto pedido
    cantidad: number;     // Cantidad pedida
    precio_unitario: number; // Precio unitario acordado
    subtotal: number;     // Subtotal del producto
    created_at: Date;     // Fecha de creación
    producto?: {          // Información del producto (opcional)
        nombre: string;   // Nombre del producto
        descripcion?: string; // Descripción del producto
    };
}

// Interfaz para devoluciones de productos
export interface Devolucion {
  id: number;             // Identificador único de la devolución
  usuario_id: number;     // ID del usuario que procesó la devolución
  venta_id?: number;      // ID de la venta relacionada (opcional)
  cliente_id?: number;    // ID del cliente que devuelve (opcional)
  fecha_devolucion: Date; // Fecha de la devolución
  motivo: 'defecto' | 'talla_incorrecta' | 'no_satisfecho' | 'otro'; // Motivo de devolución
  estado: 'pendiente' | 'aprobada' | 'rechazada' | 'completada'; // Estado de la devolución
  total_devolucion: number; // Monto total a devolver
  observaciones?: string; // Observaciones de la devolución
  created_at: Date;       // Fecha de creación
  detalles?: DetalleDevolucion[]; // Detalles de la devolución (opcional)
  cliente?: {             // Información del cliente (opcional)
    nombre: string;       // Nombre del cliente
    apellido: string;     // Apellido del cliente
  };
  usuario?: {             // Información del usuario (opcional)
    nombre: string;       // Nombre del usuario
    apellido: string;     // Apellido del usuario
  };
}

// Interfaz para detalles de devoluciones
export interface DetalleDevolucion {
    id: number;           // Identificador único del detalle
    devolucion_id: number; // ID de la devolución al que pertenece
    producto_id: number;  // ID del producto devuelto
    cantidad_devuelta: number; // Cantidad devuelta
    precio_unitario: number; // Precio unitario al momento de la devolución
    subtotal: number;     // Subtotal del producto devuelto
    motivo_especifico?: string; // Motivo específico de la devolución
    created_at: Date;     // Fecha de creación
    producto?: {          // Información del producto (opcional)
        nombre: string;   // Nombre del producto
        descripcion?: string; // Descripción del producto
    };
}

// =====================================================
// TIPOS PARA GESTIÓN DE VENTAS
// =====================================================

// Interfaz para ventas
export interface Venta {
    id: number;           // Identificador único de la venta
    usuario_id: number;   // ID del usuario que realizó la venta
    cliente_id?: number;  // ID del cliente (opcional)
    fecha_venta: Date;    // Fecha de la venta
    total: number;        // Total de la venta
    metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia' | 'otro'; // Método de pago
    estado: 'completada' | 'pendiente' | 'cancelada'; // Estado de la venta
    observaciones?: string; // Observaciones de la venta
    created_at: Date;     // Fecha de creación
    detalles?: DetalleVenta[]; // Detalles de la venta (opcional)
    cliente?: {           // Información del cliente (opcional)
        nombre: string;   // Nombre del cliente
        apellido: string; // Apellido del cliente
        email: string;    // Email del cliente
    };
    usuario?: {           // Información del usuario (opcional)
        nombre: string;   // Nombre del usuario
        apellido: string; // Apellido del usuario
    };
}

// Interfaz para detalles de ventas
export interface DetalleVenta {
    id: number;           // Identificador único del detalle
    venta_id: number;     // ID de la venta al que pertenece
    producto_id: number;  // ID del producto vendido
    cantidad: number;     // Cantidad vendida
    precio_unitario: number; // Precio unitario al momento de la venta
    subtotal: number;     // Subtotal del producto
    created_at: Date;     // Fecha de creación
    producto?: {          // Información del producto (opcional)
        nombre: string;   // Nombre del producto
        descripcion?: string; // Descripción del producto
    };
}

// =====================================================
// TIPOS PARA REQUESTS (PETICIONES HTTP)
// =====================================================

// Interfaz para crear nuevos pedidos
export interface CreatePedidoRequest {
    proveedor_id?: number; // ID del proveedor (opcional)
    fecha_entrega_esperada?: Date; // Fecha esperada de entrega
    observaciones?: string; // Observaciones del pedido
    detalles: {            // Array de detalles del pedido
        producto_id: number; // ID del producto
        cantidad: number;     // Cantidad pedida
        precio_unitario: number; // Precio unitario
    }[];
}

// Interfaz para actualizar pedidos existentes
export interface UpdatePedidoRequest {
    estado?: 'pendiente' | 'confirmado' | 'en_camino' | 'entregado' | 'cancelado'; // Nuevo estado
    fecha_entrega_esperada?: Date; // Nueva fecha de entrega
    observaciones?: string; // Nuevas observaciones
}

// Interfaz para crear nuevas devoluciones
export interface CreateDevolucionRequest {
    venta_id?: number;    // ID de la venta relacionada (opcional)
    cliente_id?: number;  // ID del cliente (opcional)
    fecha_devolucion: Date; // Fecha de la devolución
    motivo: 'defecto' | 'talla_incorrecta' | 'no_satisfecho' | 'otro'; // Motivo
    observaciones?: string; // Observaciones
    detalles: {            // Array de detalles de la devolución
        producto_id: number; // ID del producto
        cantidad_devuelta: number; // Cantidad devuelta
        precio_unitario: number; // Precio unitario
        motivo_especifico?: string; // Motivo específico
    }[];
}

// Interfaz para actualizar devoluciones existentes
export interface UpdateDevolucionRequest {
    estado?: 'pendiente' | 'aprobada' | 'rechazada' | 'completada'; // Nuevo estado
    observaciones?: string; // Nuevas observaciones
}

// Interfaz para crear nuevas ventas
export interface CreateVentaRequest {
    cliente_id?: number;  // ID del cliente (opcional)
    fecha_venta: Date;    // Fecha de la venta
    metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia' | 'otro'; // Método de pago
    observaciones?: string; // Observaciones
    detalles: {            // Array de detalles de la venta
        producto_id: number; // ID del producto
        cantidad: number;     // Cantidad vendida
        precio_unitario: number; // Precio unitario
    }[];
}

// Interfaz para actualizar ventas existentes
export interface UpdateVentaRequest {
    estado?: 'completada' | 'pendiente' | 'cancelada'; // Nuevo estado
    observaciones?: string; // Nuevas observaciones
}