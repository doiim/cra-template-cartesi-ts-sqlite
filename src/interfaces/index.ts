export type ProductAction = {
    id: string;
    name: string;
    action: 'add' | 'delete';
};

export type Product = {
    id: string;
    name: string;
};