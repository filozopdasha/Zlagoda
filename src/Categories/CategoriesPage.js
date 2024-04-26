import React, { useEffect, useState } from "react";
import MenuBar from "../MenuBar/MenuBar";
import './CategoriesPageStyles.css';
import { NavLink } from "react-router-dom";

const CategoriesPage = () => {
    const [fetchError, setFetchError] = useState(null);
    const [categories, setCategories] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("category_number");
    const [sortOrder, setSortOrder] = useState("ASC");
    const [showPopup, setShowPopup] = useState(false);
    const [popupCategory, setPopupCategory] = useState(null);


    const [role, setRole] = useState('');
    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        if (storedRole) {
            setRole(storedRole);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [sortBy, sortOrder]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`http://localhost:8081/get-category?sortBy=${sortBy}&sortOrder=${sortOrder}`);
            if (!response.ok) {
                throw new Error('Could not fetch the categories');
            }
            const data = await response.json();
            setCategories(data);
            setFetchError(null);
        } catch (error) {
            setFetchError(error.message);
            setCategories(null);
        }
    };


    const handleDeleteCategory = async (categoryNumber) => {
        try {
            const response = await fetch(`http://localhost:8081/delete-category/${categoryNumber}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Could not delete category');
            }
            setCategories(prevCategories => prevCategories.filter(ca => ca.category_number !== categoryNumber));
        } catch (error) {
            console.error(error.message);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleSort = (columnName) => {
        if (sortBy === columnName) {
            setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
        } else {
            setSortBy(columnName);
            setSortOrder("ASC");
        }
    };

    const handlePopup = async (categoryNumber) => {
        setShowPopup(true);
        try {
            const response = await fetch(`http://localhost:8081/get-products/${categoryNumber}?sortBy=id_product&sortOrder=asc`);
            if (!response.ok) {
                throw new Error('Could not fetch products');
            }
            const data = await response.json();
            setPopupCategory(data);
        } catch (error) {
            console.error('Error fetching category products:', error.message);
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setPopupCategory(null);
    };

    const [searchBy, setSearchBy] = useState("category_number");
    const toggleSearchBy = () => {
        setSearchBy(searchBy === "category_number" ? "category_name" : "category_number");
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            if(searchBy === "category_number" && searchQuery!==''){
                fetchByNumber(e.target.value)
            } else if(searchBy === "category_name" && searchQuery!=='') {
                fetchByName(e.target.value)
            } else {
                fetchCategories()
            }
            setSortBy('category_number');
        }
    };

    const fetchByName = async (search) => {
        try {
            const response = await fetch(`http://localhost:8081/search-category-by-name?search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
            if (!response.ok) {
                throw new Error('Could not fetch the categories');
            }
            const data = await response.json();
            setCategories(data);
            setFetchError(null);
        } catch (error) {
            setFetchError(error.message);
            setCategories(null);
        }
    };
    const fetchByNumber = async (search) => {
        try {
            const response = await fetch(`http://localhost:8081/search-category-by-number?search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
            if (!response.ok) {
                throw new Error('Could not fetch the categories');
            }
            const data = await response.json();
            setCategories(data);
            setFetchError(null);
        } catch (error) {
            setFetchError(error.message);
            setCategories(null);
        }
    };


    let filteredCategories = categories ? categories.filter(category => category
       // category.category_name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
        //category.category_number === parseInt(searchQuery)
    ) : [];


    return (
        <div className="categories page">
            <div id="menuBarWrapper">
                <MenuBar/>
            </div>
            {fetchError && (<p>{fetchError}</p>)}
            <div>
                <input
                    type="text"
                    placeholder={searchBy === "category_name" ? "Search category by name..." : "Search category by number..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearch}
                    className="search-bar-categories"
                />
                <button className="add-category" onClick={toggleSearchBy}>
                    Change condition
                </button>
                {role === "Cashier" && (
                    <button className="sort add-category" onClick={() => handleSort("category_number")}>Sort by
                        number</button>
                )}
                <button className="sort add-category" onClick={() => handleSort("category_name")}>Sort by name</button>
                {role === "Manager" && (<button onClick={handlePrint} className="print-button">Print</button>)}
                {role === "Manager" && (
                    <button className="add-category">
                        <NavLink to="/add-category" className="add-category-text">Add Category</NavLink>
                    </button>
                )}
            </div>
            {showPopup && (
                <>
                    <div className="overlay"></div>
                    <div className="popup-container-category">
                        <div className="popup">
                            <div className="popup-content-category">
                                <span className="close" onClick={handleClosePopup}>&times;</span>
                                <h2>Products in category</h2>
                                <table>
                                    <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Category Number</th>
                                        <th>Manufacturer</th>
                                        <th>Characteristics</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {popupCategory && popupCategory.map(product => (
                                        <tr key={product.id_product}>
                                            <td className="product-data">{product.id_product}</td>
                                            <td className="product-data">{product.product_name}</td>
                                            <td className="product-data">{product.category_number}</td>
                                            <td className="product-data">{product.manufacturer}</td>
                                            <td className="product-data">{product.characteristics}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className="category-cards-all">
                {filteredCategories.map(category => (
                    <div key={category.category_number} className="category-card">
                        <h3>{category.category_name}</h3>
                        <p>Category Number: {category.category_number}</p>
                        {role === "Manager" && (
                            <button className="delete-category"
                                    onClick={() => handleDeleteCategory(category.category_number)}>⛌</button>
                        )}
                        {role === "Manager" && (
                            <button className="edit-category" title="Edit product">
                                <NavLink to={"/categories/" + category.category_number}
                                         className="add-category-text">✎</NavLink>
                            </button>
                        )}
                        <button className="show-products"
                                onClick={() => handlePopup(category.category_number)}>Products
                        </button>
                    </div>
                ))}
            </div>
            {filteredCategories.length === 0 && <div className="error-message"><h2>No categories found.</h2></div>}
            {filteredCategories.length !== 0 &&
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

export default CategoriesPage;
