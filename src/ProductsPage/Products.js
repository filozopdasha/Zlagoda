import React, { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import './ProductsPageStyles.css';
import MenuBar from "../MenuBar/MenuBar";

const Products = () => {
    const [fetchError, setFetchError] = useState(null);
    const [products, setProducts] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("id_product");
    const [sortOrder, setSortOrder] = useState("asc");

    useEffect(() => {
        const fetchProducts = async () => {
            let query = supabase.from('Product').select();
            if (sortBy) query = query.order(sortBy, { ascending: sortOrder === "asc" });
            const { data, error } = await query;
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
    }, [sortBy, sortOrder]);

    const handleDeleteProduct = async (productId) => {
        try {
            const { error } = await supabase
                .from('Product')
                .delete()
                .eq('id_product', productId);

            if (error) throw new Error('Could not delete product');
            setProducts(prevProducts => prevProducts.filter(product => product.id_product !== productId));
        } catch (error) {
            console.error('Error deleting product:', error.message);
        }
    };

    const handleEditProduct = async (productId) => {
        try {
            const { error } = await supabase
                .from('Product')
                .delete()
                .eq('id_product', productId);

            if (error) throw new Error('Could not delete product');
            setProducts(prevProducts => prevProducts.filter(product => product.id_product !== productId));
        } catch (error) {
            console.error('Error deleting product:', error.message);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setSortBy("product_name")
    };

    const handleSort = (columnName) => {
        if (sortBy === columnName) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(columnName);
            setSortOrder("asc");
        }
    };

    let filteredProducts = products ? products.filter(product =>
        product.product_name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
        product.category_number === parseInt(searchQuery)
    ) : [];

    return (
        <div className="products page">
            <MenuBar />
            {fetchError && (<p>{fetchError}</p>)}
            <input
                type="text"
                placeholder="Search products by name or category number..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-bar"
            />
            <button className="add-product">Add product</button>
            {filteredProducts.length > 0 && (
                <div className="products">
                    <div style={{width: '80%', margin: '0 auto'}}>
                        <table className="product-table">
                            <thead>
                            <tr>
                                <th className="title" title="Sort by ID" onClick={() => handleSort("id_product")}>ID</th>
                                <th className="title" title="Sort by Product Name" onClick={() => handleSort("product_name")}>Product Name</th>
                                <th className="space"></th>
                                <th className="title" title="Sort by Category Number" onClick={() => handleSort("category_number")}>Category Number</th>
                                <th className="title" title="Sort by Manufacturer" onClick={() => handleSort("manufacturer")}>Manufacturer</th>
                                <th className="title" title="Sort by Characteristics" onClick={() => handleSort("characteristics")}>Characteristics</th>
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
