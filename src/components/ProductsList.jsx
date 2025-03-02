// src/components/ProductList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import socket from "../config/sockets";
import ProductItem from "./ProductItem";

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getProducts = async () => {
            const resp = await axios.get("http://localhost:8000/api/products");
            console.log(resp);
            setProducts(resp.data.data);
        };
        getProducts();

        socket.on("stock-updated", (updatedProduct) => {
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === updatedProduct.id ? updatedProduct : product
                )
            );
        });

        return () => {
            socket.off("stock-updated");
        };
    }, []);

    const handleUpdateStock = (productId) => {
        socket.emit("update-stock", { productId });
    };

    return (
        <div>
            <h2>Lista de Productos</h2>
            {products?.map((product) => (
                <ProductItem
                    key={product.id}
                    product={product}
                    onUpdateStock={handleUpdateStock}
                />
            ))}
        </div>
    );
};

export default ProductList;
