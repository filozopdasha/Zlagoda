import React, { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import MenuBar from "../MenuBar/MenuBar";
import './CategoriesPageStyles.css';
import { NavLink } from "react-router-dom";

const CategoriesPage = () => {
    const [fetchError, setFetchError] = useState(null);
    const [categories, setCategories] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("category_number");
    const [sortOrder, setSortOrder] = useState("asc");
    const [showPopup, setShowPopup] = useState(false);
    const [popupCategory, setPopupCategory] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            let query = supabase.from('Category').select();
            if (sortBy) query = query.order(sortBy, { ascending: sortOrder === "asc" });
            const { data, error } = await query;
            if (error) {
                setFetchError('Could not fetch the categories');
                setCategories(null);
                console.log(error);
            }
            if (data) {
                setCategories(data);
                setFetchError(null);
                console.log(data);
            }
        };

        fetchCategories();
    }, [sortBy, sortOrder]);

    const handleDeleteCategory = async (categoryNumber) => {
        const { data, error } = await supabase
            .from("Category")
            .delete()
            .eq('category_number', categoryNumber)
            .select();

        if (error) {
            console.log(error);
        }
        if (data) {
            console.log(data);
            setCategories(prevCategories => {
                return prevCategories.filter(ca => ca.category_number !== categoryNumber);
            });
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setSortBy("category_number");
    };

    const handleSort = (columnName) => {
        if (sortBy === columnName) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(columnName);
            setSortOrder("asc");
        }
    };

    let filteredCategories = categories ? categories.filter(category =>
        category.category_name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
        category.category_number === parseInt(searchQuery)
    ) : [];

    const handlePopup = async (categoryNumber) => {
        setShowPopup(true);
        const { data, error } = await supabase
            .from('Product')
            .select('*')
            .eq('category_number', categoryNumber);

        if (error) {
            console.error('Error fetching category products:', error.message);
            return;
        }

        if (data) {
            setPopupCategory(data);
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setPopupCategory(null);
    };

    return (
        <div className="categories page">
            <MenuBar />
            {fetchError && (<p>{fetchError}</p>)}

            <input
                type="text"
                placeholder="Search category by name or category number..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-bar-categories"
            />

            <button className="add-category">
                <NavLink to="/add-category" className="add-category-text">Add Category</NavLink>
            </button>

            <button className="sort add-category" onClick={() => handleSort("category_number")}>Sort by number</button>

            <button className="sort add-category" onClick={() => handleSort("category_name")}>Sort by name</button>

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

            <div className="category-cards">
                {filteredCategories.map(category => (
                    <div key={category.category_number} className="category-card">
                        <h3>{category.category_name}</h3>
                        <p>Category Number: {category.category_number}</p>
                        <button className="delete-category" onClick={() => handleDeleteCategory(category.category_number)}>⛌</button>
                        <button className="edit-category" title="Edit product">
                            <NavLink to={"/categories/" + category.category_number} className="add-category-text">✎</NavLink>
                        </button>
                        <button className="show-products" onClick={() => handlePopup(category.category_number)}>Products</button>
                    </div>
                ))}
            </div>
            {filteredCategories.length === 0 && <div className="error-message"><h2 >No categories found.</h2></div>}
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
