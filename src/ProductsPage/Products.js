import React, { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import './ProductsPageStyles.css';
import MenuBar from "../MenuBar/MenuBar";

const Products = () => {
    const [fetchError, setFetchError] = useState(null);
    const [products, setProducts] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error } = await supabase
                .from('Product')
                .select()
                .order('category_number');

            if (error) {
                setFetchError('Could not fetch the products');
                setProducts(null);
                console.log(error);
            }
            if (data) {
                setProducts(data);
                setFetchError(null);
                console.log(data);
            }
        };

        fetchProducts();
    }, []);

    const handleDeleteProduct = async (productId) => {
        console.log("Deleting product with ID:", productId);
    };

    const handleEditProduct = async (productId) => {
        console.log("Editing product with ID:", productId);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredProducts = products ? products.filter(product =>
        product.product_name.toLowerCase().startsWith(searchQuery.toLowerCase())
    ) : [];

    return (
        <div className="products page">
            <MenuBar />
            {fetchError && (<p>{fetchError}</p>)}
            <input
                type="text"
                placeholder="Search products by name..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-bar"
            />
            {filteredProducts.length > 0 && (
                <div className="products">
                    <div style={{width: '80%', margin: '0 auto'}}>
                        <table className="product-table">
                            <thead>
                            <tr>
                                <th className="title" title="Sort by ID">ID</th>
                                <th className="title" title="Sort by Product Name">Product Name</th>
                                <th className="space"></th>
                                <th className="title" title="Sort by Category Number">Category Number</th>
                                <th className="title" title="Sort by Manufacturer">Manufacturer</th>
                                <th className="title" title="Sort by Characteristics">Characteristics</th>
                                <th className="title" title="⛌"></th>
                                <th className="title" title="✎"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product.id_product}>
                                    <td className="product-data">{product.id_product}</td>
                                    <td className="product-data">{product.product_name}</td>
                                    <td className="space"></td>
                                    <td className="product-data">{product.category_number}</td>
                                    <td className="product-data">{product.manufacturer}</td>
                                    <td className="product-data">{product.characteristics}</td>
                                    <td className="product-data delete-product">
                                        <button
                                            className="delete-product title"
                                            title="Remove product"
                                            onClick={() => handleDeleteProduct(product.id_product)}>⛌
                                        </button>
                                    </td>
                                    <td className="product-data edit-product">
                                        <button
                                            className="edit-product title"
                                            title="Edit product"
                                            onClick={() => handleEditProduct(product.id_product)}>✎
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {filteredProducts.length === 0 && <div className="error-message"><h2 >No products found.</h2></div>}
            {filteredProducts.length !== 0 &&
            <footer className="footer">
                <div className="contact-info">
                    <hr></hr>
                    <p>Contact us:</p>
                    <p>Email: yu.skip@ukma.edu.ua</p>
                    <p>Email: d.filozop@ukma.edu.ua</p>
                    <p>Phone: +1234567890</p>
                </div>
            </footer>}
        </div>
    );
};

export default Products;
