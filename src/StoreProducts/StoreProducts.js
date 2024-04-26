import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import './StoreProductsPageStyles.css';
import MenuBar from "../MenuBar/MenuBar";

const StoreProductsPage = () => {
    const [fetchError, setFetchError] = useState(null);
    const [storeProducts, setStoreProducts] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("upc");
    const [sortOrder, setSortOrder] = useState("ASC");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [totalSales, setTotalSales] = useState(false);
    const [popupProduct, setPopupProduct] = useState(null);
    const [showOnlySales, setShowOnlySales] = useState(null); // Changed initial state to null
    const navigate = useNavigate();

    const [role, setRole] = useState('');
    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        if (storedRole) {
            setRole(storedRole);
        }
    }, []);

    useEffect(() => {
        fetchStoreProducts();
    }, [sortBy, sortOrder, showOnlySales]);

    const fetchStoreProducts = async () => {
        try {
            let url = `http://localhost:8081/get-store-products?sortBy=${sortBy}&sortOrder=${sortOrder}`;
            if (showOnlySales === true) {
                url = `http://localhost:8081/get-store-products-with-sales?sortBy=${sortBy}&sortOrder=${"ASC"}`;
            } else if (showOnlySales === false) {
                url = `http://localhost:8081/get-store-products-without-sales?sortBy=${sortBy}&sortOrder=${"ASC"}`;
            }
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Could not fetch the store products');
            }
            const data = await response.json();
            setStoreProducts(data);
            setFetchError(null);
        } catch (error) {
            setFetchError(error.message);
            setStoreProducts(null);
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            if(searchQuery!==''){
                fetchByUPC(e.target.value)
            }else {
                fetchStoreProducts()
            }
        }
    };
    const fetchByUPC = async (search) => {
        try {
            const response = await fetch(`http://localhost:8081/search-store-product-by-upc?search=${search}&sortBy=${"products_number"}&sortOrder=${"ASC"}`);
            if (!response.ok) {
                throw new Error('Could not fetch the store products');
            }
            const data = await response.json();
            setStoreProducts(data);
            setFetchError(null);
        } catch (error) {
            setFetchError(error.message);
            setStoreProducts(null);
        }
    };

    const handleSort = (columnName) => {
        if (sortBy === columnName) {
            setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
        } else {
            setSortBy(columnName);
            setSortOrder("ASC");
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            const response = await fetch(`http://localhost:8081/delete-store-product/${productId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete product');
            }
            setStoreProducts(prevProducts => prevProducts.filter(product => product.upc !== productId));
        } catch (error) {
            console.error('Error deleting product:', error.message);
        }
    };

    const handlePopup = (productId) => {
        setShowPopup(true);
        let popup = storeProducts ? storeProducts.find(product => product.upc === productId) : null;
        setPopupProduct(popup);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setPopupProduct(null);
    };

    const handleEditProduct = (productId) => {
        navigate(`/edit-product/${productId}`);
    };

    const handleSearchByDatePeriod = () => {
        if (startDate && endDate) {
            fetchProductsByDatePeriod(startDate, endDate);
            setTotalSales(true);
        }else if(!startDate && !endDate){
            fetchStoreProducts();
            setTotalSales(false);
        } else {
            setFetchError("Please select both start and end dates.");
        }
    };

    const fetchProductsByDatePeriod = async (startDate, endDate) => {
        try {
            const response = await fetch(`http://localhost:8081/get-store-products-by-date-period?startDate=${startDate}&endDate=${endDate}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
            if (!response.ok) {
                throw new Error('Could not fetch store products');
            }
            const data = await response.json();
            setStoreProducts(data);
            setFetchError(null);
        } catch (error) {
            setFetchError(error.message);
            setStoreProducts(null);
        }
    };

    let filteredProducts = storeProducts ? [...storeProducts] : [];

    if (searchQuery.trim() !== "") {
        filteredProducts = filteredProducts.filter(product => product
            //product.upc.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="store-products page">
            <div id="menuBarWrapper">
                <MenuBar/>
            </div>
            {fetchError && (<p>{fetchError}</p>)}
            <input
                type="text"
                placeholder="Search products by UPC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
                className="search-bar-store-categories"
            />
            {role === "Manager" && (
                <button className="add-store-button">
                    <NavLink to="/add-store-product" className="add-employee-text">Add Store Product</NavLink>
                </button>
            )}
            {role === "Manager" && (
                <div className="date-search">
                    <input
                        type="text"
                        className="date-bar"
                        placeholder="Start Date (YYYY-MM-DD)"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                        type="text"
                        className="date-bar"
                        placeholder="End Date (YYYY-MM-DD)"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    <button onClick={handleSearchByDatePeriod} className="search-condition-button">Search by Date
                        Period
                    </button>
                </div>)}

            {!totalSales && (<div className="for-sales">
                <button onClick={() => setShowOnlySales(true)} className="add-employee-button">Sales</button>
                <button onClick={() => setShowOnlySales(false)} className="add-employee-button">No Sales</button>
                <button onClick={() => setShowOnlySales(null)} className="add-employee-button">All</button>
                {role === "Manager" &&(<button onClick={handlePrint} className="print-button">Print</button>)}
            </div>)}
            {showPopup && popupProduct && (
                <>
                <div className="overlay" onClick={handleClosePopup}></div>
                    <div className="popup-container">
                        <div className="popup">
                            <div className="popup-content">
                                <span className="close" onClick={handleClosePopup}>&times;</span>
                                <h2>Product Details</h2>
                                <p><strong>ID:</strong> {popupProduct.id_product}</p>
                                <p><strong>Product Name:</strong> {popupProduct.product_name}</p>
                                <p><strong>Category Number:</strong> {popupProduct.category_number}</p>
                                <p><strong>Manufacturer:</strong> {popupProduct.manufacturer}</p>
                                <p><strong>Characteristics:</strong> {popupProduct.characteristics}</p>
                                <p><strong>UPC:</strong> {popupProduct.upc}</p>
                                <p><strong>UPC
                                    Promotional:</strong> {popupProduct.upc_prom ? popupProduct.upc_prom : 'None'}</p>
                                <p><strong>Selling Price:</strong> {popupProduct.selling_price}</p>
                                <p><strong>Promotional
                                    Product:</strong> {popupProduct.promotional_product ? 'Yes' : 'No'}</p>
                                <p><strong>Products Number:</strong> {popupProduct.products_number}</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {filteredProducts.length > 0 && (
                <div className="products">
                    <div style={{width: '80%', margin: '0 auto'}}>
                        <table className="store-table">
                            <thead>
                            <tr>
                                <th className="title" title="Sort by UPC" onClick={() => handleSort("upc")}>UPC</th>
                                <th className="title" title="Sort by Product Name"
                                    onClick={() => handleSort("product_name")}>Product Name
                                </th>
                                {!totalSales && (<th className="title" title="Sort by Product ID"
                                                     onClick={() => handleSort("id_product")}>Product ID
                                </th>)}
                                {!totalSales && (<th className="title" title="Sort by Products Number"
                                                     onClick={() => handleSort("products_number")}>Products Number
                                </th>)}
                                {totalSales && (<th className="title" title="Sort by Total Units Sold"
                                                    onClick={() => handleSort("total_units_sold")}>Total Units Sold
                                </th>)}
                                {!totalSales && (<th className="title" title="Sort by Selling Price"
                                                     onClick={() => handleSort("selling_price")}>Selling Price
                                </th>)}
                                {role === "Manager" && !totalSales && (<th className="edit-product-print title" title="Actions"></th>)}
                                {role === "Manager" && !totalSales && (<th className="edit-product-print title" title="Actions"></th>)}

                            </tr>
                            </thead>
                            <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product.upc}>
                                    <td className="product-data"
                                        onClick={() => handlePopup(product.upc)}>{product.upc}</td>
                                    <td className="product-data" onClick={() => handlePopup(product.upc)}>
                                        {product.product_name}
                                        {product.upc_prom && (
                                            <div className="sale-sign">Sale</div>
                                        )}
                                    </td>
                                    {!totalSales && (<td className="product-data"
                                                         onClick={() => handlePopup(product.upc)}>{product.id_product}</td>)}
                                    {!totalSales && (<td className="product-data"
                                                         onClick={() => handlePopup(product.upc)}>{product.products_number}</td>)}
                                    {!totalSales && (<td className="product-data"
                                                         onClick={() => handlePopup(product.upc)}>{product.selling_price}</td>)}
                                    {totalSales && (<td className="product-data"
                                                        onClick={() => handlePopup(product.upc)}>{product.total_units_sold}</td>)}
                                    {role === "Manager" && !totalSales && (
                                        <td className="product-data actions">
                                            <button
                                                className="edit-product title"
                                                title="Edit product"
                                                onClick={() => handleEditProduct(product.upc)}>
                                                <NavLink to={"/store-products/" + product.upc}
                                                         className="add-product-text">✎</NavLink>
                                            </button>
                                        </td>)}
                                    {role === "Manager" && !totalSales && (
                                        <td className="product-data actions">
                                            <button
                                                className="delete-product title"
                                                title="Remove product"
                                                onClick={() => handleDeleteProduct(product.upc)}>⛌
                                            </button>
                                        </td>)}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {filteredProducts.length === 0 && <div className="error-message"><h2>No products found.</h2></div>}
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

export default StoreProductsPage;