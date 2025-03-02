// src/components/ProductList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";
import ProductItem from "./ProductItem";

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/products")
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });

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
        socket.emit("update-stock", productId);
    };

    return (
        <div>
            <h2>Lista de Productos</h2>
            {products.map((product) => (
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
