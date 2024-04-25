import React, { useEffect, useState } from "react";
import MenuBar from "../MenuBar/MenuBar";
import './CustomerCardPageStyles.css';
import { NavLink } from "react-router-dom";

const CardsPage = () => {
    const [fetchError, setFetchError] = useState(null);
    const [cards, setCards] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("card_number");
    const [sortOrder, setSortOrder] = useState("asc");
    const [showPopup, setShowPopup] = useState(false);
    const [showHiddenTable, setShowHiddenTable] = useState(false);
    const [popupData, setPopupData] = useState({});
    const [selectedMonth, setSelectedMonth] = useState("");



    const [role, setRole] = useState('');
    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        if (storedRole) {
            setRole(storedRole);
        }
    }, []);

    const handleMonthChange = async (e) => {
        const selectedMonthValue = e.target.value;
        setSelectedMonth(selectedMonthValue);

        if (selectedMonthValue !== "") {
            try {
                const response = await fetch(`http://localhost:8081/discount-card-usage-by-month?month=${selectedMonthValue}`);
                if (!response.ok) {
                    throw new Error('Could not fetch the cards');
                }
                const data = await response.json();
                console.log("Fetched cards:", data);
                setCards(data);
                setFetchError(null);
            } catch (error) {
                setFetchError(error.message);
                setCards(null);
            }
        } else {
            fetchCards();
        }
    };

    useEffect(() => {
        fetchCards();
    }, [sortBy, sortOrder]);

    const fetchCards = async () => {
        try {
            const response = await fetch(`http://localhost:8081/get-card?sortBy=${sortBy}&sortOrder=${sortOrder}`);
            if (!response.ok) {
                throw new Error('Could not fetch the cards');
            }
            const data = await response.json();
            setCards(data);
            setFetchError(null);
        } catch (error) {
            setFetchError(error.message);
            setCards(null);
        }
    };


    const handleDeleteCard = async (cardNumber) => {
        try {
            const response = await fetch(`http://localhost:8081/delete-card/${cardNumber}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Could not delete category');
            }
            setCards(prevCards => prevCards.filter(ca => ca.card_number !== cardNumber));
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setSortBy("card_number");
    };

    const handleSort = (columnName) => {
        if (sortBy === columnName) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(columnName);
            setSortOrder("asc");
        }
    };

    let filteredCards = cards ? cards.filter(card =>
        card.cust_surname.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
        card.card_number.toString().startsWith(searchQuery)
    ) : [];

    const handlePopup = async (cardNumber) => {
        setShowPopup(true);
        try {
            const response = await fetch(`http://localhost:8081/get-card-info/${cardNumber}`);
            if (!response.ok) {
                throw new Error('Could not fetch cards');
            }
            const data = await response.json();
            setPopupData(data);
        } catch (error) {
            console.error('Error fetching cards:', error.message);
        }
    };

    const handlePrint = () => {
        setShowHiddenTable(true);
        window.print();
        setShowHiddenTable(false);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setPopupData({});
    };



    return (
        <div className="categories page">
            <div id="menuBarWrapper">
                <MenuBar/>
            </div>
            {fetchError && (<p>{fetchError}</p>)}

            <input
                type="text"
                placeholder="Search category by name or category number..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-bar-categories"
            />

            {role === "Manager" && (
                <button className="add-category">
                    <NavLink to="/add-card" className="add-category-text">Add Card</NavLink>
                </button>
            )}

            <button className="sort add-category" onClick={() => handleSort("card_number")}>Sort by number</button>

            <button className="sort add-category" onClick={() => handleSort("cust_surname")}>Sort by Surname</button>

            <select onChange={handleMonthChange} value={selectedMonth} className="search-bar-categories">
                <option value="">All Months</option>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
            </select>
            <button onClick={handlePrint} className="print-button">Print</button>

            {showPopup && Object.keys(popupData).map(cardNumber => (
                <>
                    <div className="overlay"></div>
                    <div className="popup-container-category">
                        <div className="popup">
                            <div className="popup-content-category">
                                <span className="close" onClick={handleClosePopup}>&times;</span>
                                <h2>Customer Card Details</h2>
                                <p><strong>Card Number:</strong> {popupData.card_number}</p>
                                <p><strong>Surname:</strong> {popupData.cust_surname}</p>
                                <p><strong>Name:</strong> {popupData.cust_name}</p>
                                <p><strong>Patronymic:</strong> {popupData.cust_patronymic}</p>
                                <p><strong>Phone Number:</strong> {popupData.phone_number}</p>
                                <p><strong>City:</strong> {popupData.city}</p>
                                <p><strong>Street:</strong> {popupData.street}</p>
                                <p><strong>Zip Code:</strong> {popupData.zip_code}</p>
                                <p><strong>Percent:</strong> {popupData.percent}</p>
                                <button onClick={handlePrint} className="print-button-popup">Print</button>
                            </div>
                        </div>
                    </div>

                </>
            ))}

            <div className="category-cards">
                {filteredCards.map(card => (
                    <div key={card.card_number} className="category-card">
                        <h3>{card.cust_surname}</h3>
                        <p>Card Number: {card.card_number}</p>
                        {role === "Manager" && (
                            <button className="delete-category"
                                    onClick={() => handleDeleteCard(card.card_number)}>⛌</button>
                        )}
                        <button className="edit-category" title="Edit product">
                            <NavLink to={"/card/" + card.card_number} className="add-category-text">✎</NavLink>
                        </button>
                        <button className="show-products" onClick={() => handlePopup(card.card_number)}>More Info
                        </button>
                    </div>
                ))}
            </div>
            {filteredCards.length === 0 && <div className="error-message"><h2>No categories found.</h2></div>}
            {filteredCards.length !== 0 &&
                <footer className="footer">
                    <div className="contact-info">
                        <hr></hr>
                        <p>Contact us:</p>
                        <p>Email: yu.skip@ukma.edu.ua</p>
                        <p>Email: d.filozop@ukma.edu.ua</p>
                        <p>Phone: +1234567890</p>
                    </div>
                </footer>}
            <div className="hidden-table" style={{display: showHiddenTable ? 'block' : 'none'}}>
                <table className="product-table">
                <thead>
                <tr>
                    <th className="title" >Card Number
                    </th>
                    <th className="title" >Surname
                    </th>
                    <th className="title" >Name
                    </th>
                    <th className="title" >Patronymic
                    </th>
                    <th className="title" >Phone Number
                    </th>
                    <th className="title" >City
                    </th>
                    <th className="title" >Street
                    </th>
                    <th className="title" >Zip Code
                    </th>
                    <th className="title" >Percent
                    </th>
                </tr>
                </thead>
                <tbody>
                {filteredCards.map(product => (
                    <tr key={product.card_number}>
                        <td className="product-data">{product.card_number}</td>
                        <td className="product-data">{product.cust_surname}</td>
                        <td className="product-data">{product.cust_name}</td>
                        <td className="product-data">{product.cust_patronymic}</td>
                        <td className="product-data">{product.phone_number}</td>
                        <td className="product-data">{product.city}</td>
                        <td className="product-data">{product.street}</td>
                        <td className="product-data">{product.zip_code}</td>
                        <td className="product-data">{product.percent}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>

    );
};

export default CardsPage;
