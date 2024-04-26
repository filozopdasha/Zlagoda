import React, { useEffect, useState } from "react";
import MenuBar from "../MenuBar/MenuBar";
import './CheckPageStyles.css';
import { NavLink, useNavigate } from "react-router-dom";

const CheckPage = () => {
    const [checks, setChecks] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [selectedCheck, setSelectedCheck] = useState(null);
    const [sales, setSales] = useState([]);
    const [totalCheckPrice, setTotalCheckPrice] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [cashierId, setCashierId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [totalSales, setTotalSales] = useState(0);
    const [cashiers, setCashiers] = useState([]);
    const [storedId, setStoredId] = useState("");

    const [role, setRole] = useState('');
    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        const storedIdCas = localStorage.getItem('id');

        if (storedRole) {
            setRole(storedRole);
        }
        if(storedIdCas){
            setStoredId(storedIdCas)
        }
    }, []);

    const fetchChecks = async () => {
        try {
            let url = `http://localhost:8081/get-checks?sortBy=${"check_number"}&sortOrder=${"ASC"}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Could not fetch the checks');
            }
            const data = await response.json();
            const checksDataWithFormattedDate = data.map(check => {
                const printDate = new Date(check.print_date);
                const formattedPrintDate = printDate.toLocaleString();
                return { ...check, print_date: formattedPrintDate };
            });
            setChecks(checksDataWithFormattedDate);
            setFetchError(null);
        } catch (error) {
            setFetchError(error.message);
            setChecks([]);
        }
    };
    useEffect(() => {
        fetchChecks();
    }, []);

    useEffect(() => {
        const fetchSales = async (checkNum) => {
            try {
                const response = await fetch(`http://localhost:8081/get-sales/${checkNum}`);
                if (!response.ok) {
                    throw new Error('Could not fetch the sales');
                }
                const data = await response.json();
                const salesdata = data.map(sale => sale)
                setSales(salesdata);
                setFetchError(null);
                let total = 0;
                salesdata.forEach(sale => {
                    total += sale.selling_price * sale.product_number;
                });
                setTotalCheckPrice(total);
            } catch (error) {
                setFetchError(error.message);
                setSales([]);
            }
        };
        if (selectedCheck !== null) {
            fetchSales(selectedCheck.check_number);
        }
    }, [selectedCheck]);

    const fetchChecksByCashierPeriod = async (cashierId, startDate, endDate) => {
        try {
            const response = await fetch(`http://localhost:8081/get-checks-by-cashier-period?cashierId=${cashierId}&startDate=${startDate}&endDate=${endDate}&sortBy=${"check_number"}&sortOrder=${"ASC"}`);
            if (!response.ok) {
                throw new Error('Could not fetch the checks');
            }
            const data = await response.json();
            const checksDataWithFormattedDate = data.map(check => {
                const printDate = new Date(check.print_date);
                const formattedPrintDate = printDate.toLocaleString();
                return { ...check, print_date: formattedPrintDate };
            });
            setChecks(checksDataWithFormattedDate);
            setFetchError(null);
        } catch (error) {
            setFetchError(error.message);
            setChecks([]);
        }
    };
    const fetchChecksByCashier = async (cashierId) => {
        try {
            const response = await fetch(`http://localhost:8081/get-checks-by-cashier?cashierId=${cashierId}&sortBy=${"check_number"}&sortOrder=${"ASC"}`);
            if (!response.ok) {
                throw new Error('Could not fetch the checks');
            }
            const data = await response.json();
            const checksDataWithFormattedDate = data.map(check => {
                const printDate = new Date(check.print_date);
                const formattedPrintDate = printDate.toLocaleString();
                return { ...check, print_date: formattedPrintDate };
            });
            setChecks(checksDataWithFormattedDate);
            setFetchError(null);
        } catch (error) {
            setFetchError(error.message);
            setChecks([]);
        }
    };
    const fetchChecksByPeriod = async (startDate, endDate) => {
        try {
            const response = await fetch(`http://localhost:8081/get-checks-by-period?startDate=${startDate}&endDate=${endDate}&sortBy=${"check_number"}&sortOrder=${"ASC"}`);
            if (!response.ok) {
                throw new Error('Could not fetch the checks');
            }
            const data = await response.json();
            const checksDataWithFormattedDate = data.map(check => {
                const printDate = new Date(check.print_date);
                const formattedPrintDate = printDate.toLocaleString();
                return { ...check, print_date: formattedPrintDate };
            });
            setChecks(checksDataWithFormattedDate);
            setFetchError(null);
        } catch (error) {
            setFetchError(error.message);
            setChecks([]);
        }
    };

    const handleSearchByConditions = (e) => {
        setTotalSales(0);
        if(role === 'Cashier'){
            setCashierId(storedId)
        }
        if(cashierId && startDate && endDate){
            fetchChecksByCashierPeriod(cashierId,startDate,endDate)
        }else if(cashierId && startDate && !endDate){
            fetchChecksByCashierPeriod(cashierId, startDate, startDate)
        }else if(!cashierId && !startDate && !endDate){
            fetchChecks()
        }else if(!cashierId && startDate && endDate){
            fetchChecksByPeriod(startDate,endDate)
        }else if(role !== 'Cashier' && cashierId && !startDate && !endDate){
            fetchChecksByCashier(cashierId)
        }else if(role === 'Cashier' && cashierId && !startDate && !endDate){
            fetchChecks()
        }else{
            setFetchError("Please, fill in all fields correctly!")
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const showTotalSum = (e) => {
        if(totalSales === 0) {
            const totalSalesAmount = checks.reduce((total, check) => total + parseFloat(check.sum_total), 0);
            setTotalSales(totalSalesAmount);
        }else{
            setTotalSales(0);
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            if(searchQuery!==''){
                fetchChecksByNumber(e.target.value)
            }else {
                fetchChecks()
            }
        }
    };

    const fetchChecksByNumber = async (search) => {
        try {
            const response = await fetch(`http://localhost:8081/search-store?search=${search}&sortBy=${"check_number"}&sortOrder=${"ASC"}`);
            if (!response.ok) {
                throw new Error('Could not fetch the checks');
            }
            const data = await response.json();
            const checksDataWithFormattedDate = data.map(check => {
                const printDate = new Date(check.print_date);
                const formattedPrintDate = printDate.toLocaleString();
                return { ...check, print_date: formattedPrintDate };
            });
            setChecks(checksDataWithFormattedDate);
            setFetchError(null);
        } catch (error) {
            setFetchError(error.message);
            setChecks([]);
        }
    };

    let filteredChecks = checks ? (searchQuery.trim() === '' ? checks : checks.filter(check => check
        //check.check_number.trim() === searchQuery.trim()
    )) : [];

    const handleOpenPopup = (check) => {
        setSelectedCheck(check);
    };
    const handleClosePopup = () => {
        setSelectedCheck(null);
    };

    const handleDelete = async (checkNumber) =>{
        console.log("deleted")
        try {
            const response = await fetch(`http://localhost:8081/delete-check/${checkNumber}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Could not delete check');
            }
            fetchChecks();
        } catch (error) {
            console.error(error.message);
        }
    }
    const handleCashierChange = (e) => {
        setCashierId(e.target.value);
    };
    useEffect(() => {
        fetchCashiers();
    }, []);

    const fetchCashiers = async () => {
        try {
            const response = await fetch(`http://localhost:8081/get-cashiers?sortBy=${"id_employee"}&sortOrder=${"ASC"}`);
            if (!response.ok) {
                throw new Error('Could not fetch cashiers');
            }
            const data = await response.json();
            setCashiers(data);
            setFetchError(null);
        } catch (error) {
            setFetchError(error.message);
            setCashiers([]);
        }
    };

    return (
        <div className="check page">
            <div id="menuBarWrapper">
                <MenuBar/>
            </div>
            {fetchError && (<p>{fetchError}</p>)}
            <input
                type="text"
                placeholder="Search check by number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
                className="search-bar-categories"
            />
            {role === "Cashier" && (
                <button className="add-check-button">
                    <NavLink to="/add-check" className="add-employee-text">Add Check</NavLink>
                </button>
            )}
            <div>
                {role === "Manager" && (
                <select
                    value={cashierId}
                    onChange={handleCashierChange}
                    className="select-cashiers"
                >
                    <option value="">Select Cashier</option>
                    {cashiers.map(cashier => (
                        <option key={cashier.id_employee} value={cashier.id_employee}>
                            {cashier.empl_name} {cashier.empl_surname}, id - {cashier.id_employee}
                        </option>
                    ))}
                </select>
                )}
                <input
                    type="text"
                    placeholder="Start (YYYY-MM-DD)"
                    value={startDate}
                    className="date-bar"
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="End (YYYY-MM-DD)"
                    value={endDate}
                    className="date-bar"
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <button onClick={handleSearchByConditions} className="search-condition-button">Search</button>
                {searchQuery.trim() === '' && totalSales === 0 && role === "Manager" && (
                    <button onClick={showTotalSum} className="search-condition-button">Show total sum</button>
                )}
                {searchQuery.trim() === '' && totalSales > 0 && role === "Manager" && (
                    <button onClick={showTotalSum} className="search-condition-button">Hide total sum</button>
                )}
            </div>
            {totalSales > 0 && (
                <div className="total-sales-section">
                    <p>Total Sales Amount: {totalSales} ₴</p>
                </div>
            )}

            {selectedCheck && (
                <div className="overlay">
                    <div className="total-check">
                        <div className="receipt">
                            <div className="zigzag-top"></div>
                            <span className="close" onClick={handleClosePopup}>&times;</span>
                            <div className="header">
                                <h2>Zlagoda</h2>
                                <p>Address: Olexandra Exter, 14B<br/>
                                    Tel: +380987654321</p>
                            </div>
                            <div className="item">
                                <p>Check №</p>
                                <p>{selectedCheck.check_number}</p>
                            </div>
                            <div className="item">
                                <p>Cashier</p>
                                <p>{selectedCheck.id_employee}</p>
                            </div>
                            <h3 className="delimiter">*****************************************</h3>
                            <div className="items">
                                {sales.map(sale => (
                                    <div>
                                        <div className="item" key={sale.id}>
                                            <p>{sale.product_name}, {sale.manufacturer}, {sale.characteristics}</p>
                                        </div>
                                        <div className="item" key={sale.id}>
                                            <p className="amount">{sale.selling_price} x {sale.product_number}</p>
                                            <p>{sale.selling_price * sale.product_number}</p>
                                        </div>

                                    </div>
                                ))}
                            </div>
                            {selectedCheck.card_number && (
                                <div>
                                    <h3 className="delimiter">*****************************************</h3>
                                    <div className="item">
                                        <p>Customer card №:</p>
                                        <p> {selectedCheck.card_number}</p>
                                    </div>
                                    <div className="item">
                                        <p>Discount:</p>
                                        <p> - {totalCheckPrice - selectedCheck.sum_total} ₴</p>
                                    </div>
                                </div>
                            )}
                            <h3 className="delimiter">*****************************************</h3>
                            <div className="payment-details">
                                <div className="item">
                                    <p>Total:</p>
                                    <p>{selectedCheck.sum_total} ₴</p> {/* Display total price */}
                                </div>
                                <div className="item">
                                    <p>VAT(included in above total)</p>
                                    <p>{selectedCheck.vat} ₴</p>
                                </div>
                                <button onClick={handlePrint} className="print-button">Print</button>
                            </div>
                            <div className="zigzag-bottom"></div>
                        </div>
                    </div>
                </div>
            )}

            <div className="check-cards">
                {filteredChecks.map(check => (
                    <div className="check-card" key={check.check_number}>
                        <h3>Check № {check.check_number}</h3>
                        <p className="print-date">{check.print_date}</p>
                        <p className="sum-total">{check.sum_total} грн</p>
                        {role === "Manager" && (
                            <button className="delete-check" onClick={() => handleDelete(check.check_number)}>⛌</button>
                        )}
                        <button className="open-check" onClick={() => handleOpenPopup(check)}>⇲</button>
                    </div>
                ))}
            </div>
            {filteredChecks.length === 0 && <div className="error-message"><h2>No checks found.</h2></div>}
            {filteredChecks.length !== 0 &&
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

export default CheckPage;
