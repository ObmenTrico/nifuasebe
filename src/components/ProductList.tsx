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
        <table>
            <thead>
            <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
            </tr>
            </thead>
            <tbody>
                products
            </tbody>
        </table>
    );
};
