"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.updateItem = exports.createItem = exports.getItemById = exports.getAllItems = void 0;
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: 'TU_USUARIO',
    host: 'localhost',
    database: 'TU_BASE_DE_DATOS',
    password: 'TU_CONTRASEÑA',
    port: 5432,
});
function getAllItems() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield pool.query('SELECT * FROM items');
        return res.rows;
    });
}
exports.getAllItems = getAllItems;
function getItemById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield pool.query('SELECT * FROM items WHERE id = $1', [id]);
        return res.rows[0];
    });
}
exports.getItemById = getItemById;
function createItem(nombre, precio) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield pool.query('INSERT INTO items (nombre, precio) VALUES ($1, $2) RETURNING *', [nombre, precio]);
        return res.rows[0];
    });
}
exports.createItem = createItem;
function updateItem(id, nombre, precio) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield pool.query('UPDATE items SET nombre = $2, precio = $3 WHERE id = $1 RETURNING *', [id, nombre, precio]);
        return res.rows[0];
    });
}
exports.updateItem = updateItem;
function deleteItem(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
        return res.rows[0];
    });
}
exports.deleteItem = deleteItem;
