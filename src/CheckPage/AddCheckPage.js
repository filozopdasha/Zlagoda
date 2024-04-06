import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddCheckStyles.css';
import {useNavigate} from "react-router-dom";

const AddCheckAndSalePage = () => {
    const navigate = useNavigate();
    const [checkData, setCheckData] = useState({
        check_number: '',
        id_employee: '',
        card_number: ''
    });

    const [saleData, setSaleData] = useState({
        check_number:'',
        UPC: '',
        product_number: ''
    });

    const [fetchError, setFetchError] = useState(null);
    const [upcOptions, setUpcOptions] = useState([]);
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [cardOptions, setCardOptions] = useState([]);
    const [checkCreated, setCheckCreated] = useState(false);
    const [sales, setSales] = useState([]);
    const [salesToDisplay, setSalesToDispaly] = useState([]);
    const [totalCheckPrice, setTotalCheckPrice] = useState(0);
    const [actualPrice, setActualPrice] = useState(0);
    const [vat, setVat] = useState(0);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchMaxCheckNumber();
        fetchUpcOptions();
        fetchEmployeeDetails();
        fetchCardNumbers();
    }, []);

    const fetchMaxCheckNumber = async () => {
        try {
            const response = await axios.get('http://localhost:8081/get-max-check-number');
            const maxCheckNumber = response.data.maxchecknumber;

            setCheckData({ ...checkData, check_number: parseInt(maxCheckNumber) + 1 });
            setSaleData({...saleData, check_number: parseInt(maxCheckNumber) + 1 });
            setFetchError(null);
        } catch (error) {
            setFetchError(error.message);
        }
    };

    const fetchUpcOptions = async () => {
        try {
            const response = await fetch('http://localhost:8081/get-upc-options');
            if (!response.ok) {
                throw new Error('Failed to fetch UPC options');
            }
            const data = await response.json();
            setUpcOptions(data)
            setFetchError(null);
        } catch (error) {
            setFetchError(error.message);
        }
    };

    const fetchEmployeeDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8081/get-employees?sortBy=${"id_employee"}&sortOrder=${"ASC"}`);
            if (!response.ok) {
                throw new Error('Failed to fetch employee details');
            }
            const data = await response.json();
            const cashiers = data.filter(employee => employee.empl_role === "Cashier");
            setEmployeeOptions(cashiers);
            setFetchError(null);
        } catch (error) {
            setFetchError(error.message);
        }
    };

    const fetchCardNumbers = async () => {
        try {
            const response = await fetch('http://localhost:8081/get-customer-cards');
            if (!response.ok) {
                throw new Error('Failed to fetch card numbers');
            }
            const data = await response.json();
            let cards = data.map(data => data)
            setCardOptions(cards)
            setFetchError(null);
        } catch (error) {
            setFetchError(error.message);
            return [];
        }
    };

    const fetchSales = async (checkNum) => {
        try {
            const response = await fetch(`http://localhost:8081/get-sales/${checkNum}`);
            if (!response.ok) {
                throw new Error('Could not fetch the sales');
            }
            const data = await response.json();
            const salesdata = data.map(sale => sale);
            setSalesToDispaly(salesdata);
            setFetchError(null);
            let total = 0;
            salesdata.forEach(sale => {
                total += sale.selling_price * sale.product_number;
            });
            setTotalCheckPrice(total);

            const lastSale = salesdata[salesdata.length - 1];
            if (lastSale) {
                setActualPrice(lastSale.sum_total);
                setVat(lastSale.vat)
            } else {
                setActualPrice(0);
                setVat(0)
            }
        } catch (error) {
            setFetchError(error.message);
            setSalesToDispaly([]);
        }
    };

    const handleCheckInputChange = (event) => {
        const { name, value } = event.target;
        setCheckData({ ...checkData, [name]: value });
    };

    const handleSaleInputChange = (event) => {
        const { name, value } = event.target;
        setSaleData({ ...saleData, [name]: value });
    };

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };
    const handlePhoneNumberSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    const addCheck = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8081/add-check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(checkData),
            });

            if (!response.ok) {
                throw new Error('An error occurred while adding a new check. Please try again.');
            }

            setCheckCreated(true)
            setFetchError(null);
        } catch (error) {
            setFetchError(error.message);
        }
    };

    const addSale = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8081/add-sale', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saleData),
            });

            if (!response.ok) {
                throw new Error('An error occurred while adding a new sale. Please try again.');
            }

            const newSale = { ...saleData };
            setSales([...sales, newSale]);

            setSaleData({
                check_number: checkData.check_number,
                UPC: '',
                product_number: ''
            });

            fetchSales(checkData.check_number);
            const totalCheckPrice = await fetchSales(checkData.check_number);
            setCheckData({ ...checkData, sum_total: totalCheckPrice });
            setFetchError(null);
        } catch (error) {
            setFetchError(error.message);
        }
    };

    const handleHome = () =>{
        navigate('/checks');
    }


    return (
        <div>{fetchError && (<p className="error-message-check">{fetchError}</p>)}
            <div>
                {!checkCreated && (
                    <div className="check-container">
                        <h2 className="check-form">Add New Check</h2>
                        <select
                            className="check-input"
                            name="id_employee"
                            value={checkData.id_employee}
                            onChange={handleCheckInputChange}
                        >
                            <option value="">Select Employee ID</option>
                            {employeeOptions.map(employee => (
                                <option key={employee.id_employee} value={employee.id_employee}>
                                    {employee.id_employee} - {employee.empl_name} {employee.empl_surname}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder="Search Phone Numbers"
                            value={searchText}
                            onChange={handlePhoneNumberSearchChange}
                            className="check-input"
                        />

                        <select
                            className="check-input"
                            name="card_number"
                            value={checkData.card_number}
                            onChange={handleCheckInputChange}
                        >
                            <option value="">Select Card Number</option>
                            {cardOptions
                                .filter(card => card.phone_number.toLowerCase().includes(searchText.toLowerCase()))
                                .map(card => (
                                    <option key={card.card_number} value={card.card_number}>
                                        {card.card_number} - {card.cust_surname} {card.cust_name} - {card.phone_number}
                                    </option>
                                ))}
                        </select>
                        <button className="check-button" onClick={addCheck}>Add Check</button>
                        <button className="check-button" onClick={handleHome}>Cancel</button>
                    </div>
                )}
                {checkCreated && (
                    <div className="check-container-sale">
                        <h2 className="check-form">Add New Sale</h2>
                        <input
                            type="text"
                            placeholder="Search UPC options"
                            value={searchText}
                            onChange={handleSearchChange}
                            className="check-input" />

                        <select
                            className="check-input"
                            name="UPC"
                            value={saleData.UPC}
                            onChange={handleSaleInputChange}
                        >
                            <option value="">Select UPC</option>
                            {upcOptions.filter(option => option.upc.toLowerCase().includes(searchText.toLowerCase())).map(option => (
                                <option key={option.upc} value={option.upc}>
                                    {option.upc} - {option.product_name}
                                </option>
                            ))}
                        </select>

                        <input
                            className="check-input"
                            type="text"
                            placeholder="Product Number"
                            name="product_number"
                            value={saleData.product_number}
                            onChange={handleSaleInputChange}
                        />
                        <button className="check-button" onClick={addSale}>Add Sale</button>
                        <button className="check-button" onClick={handleHome}>OK</button>
                        <div className="total-sales">
                            <div className="receipt">
                                <div className="zigzag-top"></div>
                                <div className="header">
                                    <h2>Zlagoda</h2>
                                    <p>Address: Olexandra Exter, 14B<br/>
                                        Tel: +380987654321</p>
                                </div>
                                <div className="item">
                                    <p>Check №</p>
                                    <p>{checkData.check_number}</p>
                                </div>
                                <div className="item">
                                    <p>Cashier</p>
                                    <p>{checkData.id_employee}</p>
                                </div>
                                <h3 className="delimiter">*****************************************</h3>
                                <div className="items">
                                    {salesToDisplay.map(sale => (
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
                                <h3 className="delimiter">*****************************************</h3>
                                {checkData.card_number &&(
                                    <div>
                                        <div className="item">
                                            <p>Customer card №:</p>
                                            <p> {checkData.card_number}</p>
                                        </div>
                                        <div className="item">
                                            <p>Discount:</p>
                                            <p> - {totalCheckPrice - parseInt(actualPrice)} ₴</p>
                                        </div>
                                        <h3 className="delimiter">*****************************************</h3>
                                    </div>
                                )}

                                <div className="payment-details">
                                    <div className="item">
                                        <p>Total:</p>
                                        <p>{actualPrice} ₴</p> {/* Display total price */}
                                    </div>
                                    <div className="item">
                                        <p>VAT(included in above total)</p>
                                        <p>{vat} ₴</p>
                                    </div>
                                </div>
                                <div className="zigzag-bottom"></div>
                            </div>
                        </div>
                    </div>

                )}

            </div>
        </div>
    );

};

export default AddCheckAndSalePage;
