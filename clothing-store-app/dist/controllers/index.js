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
exports.deleteItemById = exports.putItem = exports.postItem = exports.getItem = exports.getItems = void 0;
const itemRepository_1 = require("./itemRepository");
function getItems(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const items = yield (0, itemRepository_1.getAllItems)();
        res.json(items);
    });
}
exports.getItems = getItems;
function getItem(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id, 10);
        const item = yield (0, itemRepository_1.getItemById)(id);
        if (item) {
            res.json(item);
        }
        else {
            res.status(404).json({ error: 'Item not found' });
        }
    });
}
exports.getItem = getItem;
function postItem(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { nombre, precio } = req.body;
        const item = yield (0, itemRepository_1.createItem)(nombre, precio);
        res.status(201).json(item);
    });
}
exports.postItem = postItem;
function putItem(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id, 10);
        const { nombre, precio } = req.body;
        const item = yield (0, itemRepository_1.updateItem)(id, nombre, precio);
        if (item) {
            res.json(item);
        }
        else {
            res.status(404).json({ error: 'Item not found' });
        }
    });
}
exports.putItem = putItem;
function deleteItemById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id, 10);
        const item = yield (0, itemRepository_1.deleteItem)(id);
        if (item) {
            res.json({ message: 'Item deleted', item });
        }
        else {
            res.status(404).json({ error: 'Item not found' });
        }
    });
}
exports.deleteItemById = deleteItemById;
