export interface Item {
    id: number;
    name: string;
    description: string;
    price: number;
    size: string;
    color: string;
    quantity: number;
}

export interface ItemRequest {
    name: string;
    description: string;
    price: number;
    size: string;
    color: string;
    quantity: number;
}

// Tipos para el sistema de usuarios (usando usuarios existentes)
export enum UserRole {
    ADMIN = 'admin',
    VENDEDOR = 'vendedor',
    INVENTARIO = 'inventario',
    ENVIOS = 'envios',
    DEVOLUCIONES = 'devoluciones',
    RRHH = 'rrhh'
}

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    nombre: string;
    apellido: string;
    telefono: string;
    ultimo_login?: Date;
    activo: boolean;
    roles?: Role[];
}

export interface Role {
    id: number;
    nombre: string;
    descripcion: string;
    permisos: string[];
}

export interface UserWithRoles extends User {
    roles: Role[];
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: number;
        username: string;
        email: string;
        nombre: string;
        apellido: string;
        roles: Role[];
    };
}

// Tipos para turnos y asistencias
export interface Turno {
    id: number;
    usuario_id: number;
    fecha: Date;
    hora_entrada: string;
    hora_salida?: string;
    estado: 'activo' | 'completado' | 'ausente';
    observaciones?: string;
    created_at: Date;
    updated_at: Date;
    usuario?: {
        nombre: string;
        apellido: string;
    };
}

export interface Asistencia {
    id: number;
    usuario_id: number;
    fecha: Date;
    hora_entrada?: string;
    hora_salida?: string;
    estado: 'presente' | 'ausente' | 'tardanza' | 'salida_temprana';
    observaciones?: string;
    created_at: Date;
    updated_at: Date;
    usuario?: {
        nombre: string;
        apellido: string;
    };
}

// Tipos para pedidos y devoluciones (Added)
export interface Pedido {
  id: number;
  usuario_id: number;
  proveedor_id?: number;
  fecha_pedido: Date;
  fecha_entrega_esperada?: Date;
  estado: 'pendiente' | 'confirmado' | 'en_camino' | 'entregado' | 'cancelado';
  total: number;
  observaciones?: string;
  created_at: Date;
  detalles?: DetallePedido[];
  proveedor?: {
    nombre: string;
  };
  usuario?: {
    nombre: string;
    apellido: string;
  };
}

export interface DetallePedido {
    id: number;
    pedido_id: number;
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    created_at: Date;
    producto?: {
        nombre: string;
        descripcion?: string;
    };
}

export interface Devolucion {
  id: number;
  usuario_id: number;
  venta_id?: number;
  cliente_id?: number;
  fecha_devolucion: Date;
  motivo: 'defecto' | 'talla_incorrecta' | 'no_satisfecho' | 'otro';
  estado: 'pendiente' | 'aprobada' | 'rechazada' | 'completada';
  total_devolucion: number;
  observaciones?: string;
  created_at: Date;
  detalles?: DetalleDevolucion[];
  cliente?: {
    nombre: string;
    apellido: string;
  };
  usuario?: {
    nombre: string;
    apellido: string;
  };
}

export interface DetalleDevolucion {
    id: number;
    devolucion_id: number;
    producto_id: number;
    cantidad_devuelta: number;
    precio_unitario: number;
    subtotal: number;
    motivo_especifico?: string;
    created_at: Date;
    producto?: {
        nombre: string;
        descripcion?: string;
    };
}

// Tipos para ventas
export interface Venta {
    id: number;
    usuario_id: number;
    cliente_id?: number;
    fecha_venta: Date;
    total: number;
    metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia' | 'otro';
    estado: 'completada' | 'pendiente' | 'cancelada';
    observaciones?: string;
    created_at: Date;
    detalles?: DetalleVenta[];
    cliente?: {
        nombre: string;
        apellido: string;
        email: string;
    };
    usuario?: {
        nombre: string;
        apellido: string;
    };
}

export interface DetalleVenta {
    id: number;
    venta_id: number;
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    created_at: Date;
    producto?: {
        nombre: string;
        descripcion?: string;
    };
}

// Tipos para requests
export interface CreatePedidoRequest {
    proveedor_id?: number;
    fecha_entrega_esperada?: Date;
    observaciones?: string;
    detalles: {
        producto_id: number;
        cantidad: number;
        precio_unitario: number;
    }[];
}

export interface UpdatePedidoRequest {
    estado?: 'pendiente' | 'confirmado' | 'en_camino' | 'entregado' | 'cancelado';
    fecha_entrega_esperada?: Date;
    observaciones?: string;
}

export interface CreateDevolucionRequest {
    venta_id?: number;
    cliente_id?: number;
    fecha_devolucion: Date;
    motivo: 'defecto' | 'talla_incorrecta' | 'no_satisfecho' | 'otro';
    observaciones?: string;
    detalles: {
        producto_id: number;
        cantidad_devuelta: number;
        precio_unitario: number;
        motivo_especifico?: string;
    }[];
}

export interface UpdateDevolucionRequest {
    estado?: 'pendiente' | 'aprobada' | 'rechazada' | 'completada';
    observaciones?: string;
}

export interface CreateVentaRequest {
    cliente_id?: number;
    fecha_venta: Date;
    metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia' | 'otro';
    observaciones?: string;
    detalles: {
        producto_id: number;
        cantidad: number;
        precio_unitario: number;
    }[];
}

export interface UpdateVentaRequest {
    estado?: 'completada' | 'pendiente' | 'cancelada';
    observaciones?: string;
}