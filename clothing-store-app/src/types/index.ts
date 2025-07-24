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