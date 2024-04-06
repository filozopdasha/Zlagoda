import React, { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import './AddCustomerCardPageStyles.css';

const EditCustomerCardPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [fetchError, setFetchError] = useState(null);
    const [cardArray, setCardArray] = useState(null);

    const [cardNumber, setCardNumber] = useState('');
    const [custSurname, setCustSurname] = useState('');
    const [formError, setFormError] = useState('');
    const [custName, setCustName] = useState('');
    const [custPatronymic, setCustPatronymic] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [custCity, setCustCity] = useState('');
    const [custStreet, setCustStreet] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [custPercent, setCustPercent] = useState('');

    useEffect(() => {
        const fetchCard = async () => {
            try {
                const response = await fetch(`http://localhost:8081/get-card?sortBy=${"card_number"}&sortOrder=${"ASC"}`);
                if (!response.ok) {
                    throw new Error('Could not fetch the cards');
                }
                const data = await response.json();
                setCardArray(data);
                setFetchError(null);
            } catch (error) {
                setFetchError(error.message);
                setCardArray(null);
            }
        };

        fetchCard();
    }, []);

    useEffect(() => {
        const fetchCardData = async () => {
            try {
                const response = await fetch(`http://localhost:8081/get-single-card/${id}`);
                if (!response.ok) {
                    throw new Error('Could not fetch category data');
                }
                const data = await response.json();

                const cardNumbers = data.map(card => card.card_number);
                const custSurnames = data.map(card => card.cust_surname);
                const custNames = data.map(card => card.cust_name);
                const custPatronymics = data.map(card => card.cust_patronymic);
                const phoneNumbers = data.map(card => card.phone_number);
                const custCitys = data.map(card => card.city);
                const custStreets = data.map(card => card.street);
                const zipCodes = data.map(card => card.zip_code);
                const custPercents = data.map(card => card.percent);

                setCardNumber(cardNumbers[0]);
                setCustSurname(custSurnames[0]);
                setCustName(custNames[0]);
                setCustPatronymic(custPatronymics[0]);
                setPhoneNumber(phoneNumbers[0]);
                setCustCity(custCitys[0]);
                setCustStreet(custStreets[0]);
                setZipCode(zipCodes[0]);
                setCustPercent(custPercents[0]);
                console.log(data)
            } catch (error) {
                console.error('Error fetching category data:', error.message);
            }
        };

        fetchCardData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!custSurname) {
            setFormError("Please fill in all the fields correctly!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8081/update-card/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    card_number: cardNumber,
                    cust_surname: custSurname,
                    cust_name: custName,
                    cust_patronymic: custPatronymic,
                    phone_number: phoneNumber,
                    city: custCity,
                    street: custStreet,
                    zip_code: zipCode,
                    percent: custPercent
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update card');
            }

            navigate('/cards');
        } catch (error) {
            console.error('Error updating card:', error.message);
            setFormError("An error occurred while updating the card. Please try again.");
        }
    };


    const handleCancel = () => {
        navigate('/cards');
    };

    return (
        <div className="add-product-form-container">
            <div className="add-product-form">
                {formError && <p className="add-error-message">{formError}</p>}
                <h2 className="zlagoda-form">Zlagoda</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="card_number">Category Number:</label>
                    <input
                        type="text"
                        id="card_number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                    />
                    <label htmlFor="cust_surname">Customer Surname:</label>
                    <input
                        type="text"
                        id="cust_surname"
                        value={custSurname}
                        onChange={(e) => setCustSurname(e.target.value)}
                    />
                    <label htmlFor="cust_surname">Customer Name:</label>
                    <input
                        type="text"
                        id="cust_name"
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                    />
                    <label htmlFor="cust_patronymic">Customer Patronymic:</label>
                    <input
                        type="text"
                        id="cust_patronymic"
                        value={custPatronymic}
                        onChange={(e) => setCustPatronymic(e.target.value)}
                    />
                    <label htmlFor="phone_number">Phone Number:</label>
                    <input
                        type="text"
                        id="phone_number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <label htmlFor="city">City:</label>
                    <input
                        type="text"
                        id="city"
                        value={custCity}
                        onChange={(e) => setCustCity(e.target.value)}
                    />
                    <label htmlFor="street">Street:</label>
                    <input
                        type="text"
                        id="street"
                        value={custStreet}
                        onChange={(e) => setCustStreet(e.target.value)}
                    />
                    <label htmlFor="zip_code">Zip Code:</label>
                    <input
                        type="text"
                        id="zip_code"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                    />
                    <label htmlFor="percent">Percent:</label>
                    <input
                        type="text"
                        id="percent"
                        value={custPercent}
                        onChange={(e) => setCustPercent(e.target.value)}
                    />
                    <div className="action-buttons">
                        <button type="button" onClick={handleCancel}>Cancel</button>
                        <button type="submit">Edit Customer Card</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCustomerCardPage;
