import React, { useEffect, useState } from "react";
import './ProductsPageStyles.css';
import MenuBar from "../MenuBar/MenuBar";
import {NavLink, useNavigate} from "react-router-dom";

const ProductsPage = () => {
    const navigate = useNavigate()

    const [fetchError, setFetchError] = useState(null);
    const [products, setProducts] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("id_product");
    const [sortOrder, setSortOrder] = useState("asc");

    const [role, setRole] = useState('');
    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        if (storedRole) {
            setRole(storedRole);
        }
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`http://localhost:8081/get-products?sortBy=${sortBy}&sortOrder=${sortOrder}`);
                if (!response.ok) {
                    throw new Error('Could not fetch the products');
                }
                const data = await response.json();
                setProducts(data);
                setFetchError(null);
            } catch (error) {
                setFetchError(error.message);
                setProducts(null);
            }
        };

        fetchProducts();
    }, [sortBy, sortOrder]);

    const handleDeleteProduct = async (productId) => {
        try {
            const response = await fetch(`http://localhost:8081/delete-product/${productId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete product');
            }
            setProducts(prevProducts => prevProducts.filter(product => product.id_product !== productId));
        } catch (error) {
            console.error('Error deleting product:', error.message);
        }
    };
    const handlePrint = () => {
        window.print();
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setSortBy("product_name")
    };

    const handleSort = (columnName) => {
        if (sortBy === columnName) {
            setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
        } else {
            setSortBy(columnName);
            setSortOrder("ASC");
        }
    };

    let filteredProducts = products ? products.filter(product =>
        product.product_name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
        product.category_number === parseInt(searchQuery)
    ) : [];

    return (
        <div className="products page">
            <div id="menuBarWrapper">
            <MenuBar />
            </div>
            {fetchError && (<p>{fetchError}</p>)}

            <input
                type="text"
                placeholder="Search products by name or category number..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-bar"
            />


            {role === "Manager" && (
            <button className="add-product">
                <NavLink to="/add-product" className="add-product-text">Add Product</NavLink>
            </button>

            )}

            {filteredProducts.length > 0 && (
                <div className="products">
                    <div style={{width: '80%', margin: '0 auto'}}>

                        <table className="product-table">
                            <thead>
                            <tr>
                                <th className="title" title="Sort by ID" onClick={() => handleSort("id_product")}>ID
                                </th>
                                <th className="title" title="Sort by Product Name"
                                    onClick={() => handleSort("product_name")}>Product Name
                                </th>
                                <th className="space"></th>
                                <th className="title" title="Sort by Category Number"
                                    onClick={() => handleSort("category_number")}>Category Number
                                </th>
                                <th className="title" title="Sort by Manufacturer"
                                    onClick={() => handleSort("manufacturer")}>Manufacturer
                                </th>
                                <th className="title" title="Sort by Characteristics"
                                    onClick={() => handleSort("characteristics")}>Characteristics
                                </th>
                                {role === "Manager" && (
                                    <th className="title delete-product" title="⛌"></th>
                                )}
                                {role === "Manager" && (
                                    <th className="title edit-product" title="✎"></th>
                                )}
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
                                    {role === "Manager" && (
                                        <td className="product-data delete-product">
                                            <button
                                                className="delete-product title"
                                                title="Remove product"
                                                onClick={() => handleDeleteProduct(product.id_product)}>⛌
                                            </button>
                                        </td>
                                    )}
                                    {role === "Manager" && (
                                        <td className="product-data edit-product">
                                            <button
                                                className="edit-product title"
                                                title="Edit product">
                                                <NavLink to={"/products/" + product.id_product}
                                                         className="add-product-text">✎</NavLink>
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {role === "Manager" &&(
                        <button onClick={handlePrint} className="print-button">Print</button>
                            )}
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

export default ProductsPage;
