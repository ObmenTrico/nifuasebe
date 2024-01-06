import React, {FC} from "react";

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    createdAt: string;
    updatedAt: string;
}

export const ProductList: FC = () => {
    return (
        <div>
            products
        </div>
    );
};
