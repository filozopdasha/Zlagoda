import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './AddCustomerCardPageStyles.css';

const AddCustomerCardPage = () => {
    const navigate = useNavigate();
    const [fetchError, setFetchError] = useState(null);
    const [cardNumberOptions, setCardNumberOptions] = useState([]);
    const [selectedCardNumber, setSelectedCardNumber] = useState('');
    const [custSurname, setCustSurname] = useState('');
    const [custName, setCustName] = useState('');
    const [custPatronymic, setCustPatronymic] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [custCity, setCustCity] = useState('');
    const [custStreet, setCustStreet] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [custPercent, setCustPercent] = useState('');
    const [formError, setFormError] = useState('');

    useEffect(() => {
        const fetchMaxId = async () => {
            try {
                const response = await fetch(`http://localhost:8081/get-card?sortBy=${"card_number"}&sortOrder=${"ASC"}`);
                if (!response.ok) {
                    throw new Error('Could not fetch card numbers');
                }
                const cardNumbers = await response.json();

                const existingCardNumbers = cardNumbers.map(card => parseInt(card.card_number)).filter(cardNum => !isNaN(cardNum));
                const maxNumber = Math.max(...existingCardNumbers, 0);

                const availableNumbers = [];
                const MAX_RANDOM_ATTEMPTS = 100;

                while (availableNumbers.length < maxNumber + 21) {
                    const randomNumber = Math.floor(Math.random() * (maxNumber + 21)) + 1;
                    if (!existingCardNumbers.includes(randomNumber) && !availableNumbers.includes(randomNumber)) {
                        availableNumbers.push(randomNumber);
                    }

                    if (availableNumbers.length >= maxNumber + 21 || availableNumbers.length >= MAX_RANDOM_ATTEMPTS) {
                        break;
                    }
                }

                setCardNumberOptions(availableNumbers);
            } catch (error) {
                console.error('Error fetching card numbers:', error.message);
            }
        };

        fetchMaxId();
    }, []);



    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Form submitted');

        if (!custSurname || !selectedCardNumber) {
            console.log('Form validation failed:', 'Please fill in all the fields correctly!');
            setFormError("Please fill in all the fields correctly!");
            return;
        }

        try {
            console.log('Sending request to add card...');
            const response = await fetch('http://localhost:8081/add-card', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    card_number: selectedCardNumber,
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
                console.error('Request failed:', 'An error occurred while adding a new customer card. Please try again.');
                throw new Error('An error occurred while adding a new customer card. Please try again.');
            }

            console.log('Card added successfully');
            navigate('/cards');
        } catch (error) {
            console.error('Error inserting card:', error.message);
            setFormError("An error occurred while adding a new customer card. Please try again.");
        }
    };


    const handleCancel = () => {
        navigate('/cards')
    };

    return (
        <div className="add-category-form-container">
            {fetchError && (<p>{fetchError}</p>)}

            <div className="add-category-form">
                {formError && <p className="add-error-message">{formError}</p>}
                <h2 className="zlagoda-form">Zlagoda</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="card_number">Card Number:</label>
                    <select
                        id="category_number"
                        value={selectedCardNumber}
                        onChange={(e) => setSelectedCardNumber(e.target.value)}
                    >
                        <option value="">Select card number</option>
                        {cardNumberOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    <label htmlFor="cust_surname">Customer Surname:</label>
                    <input
                        type="text"
                        id="cust_surname"
                        value={custSurname}
                        onChange={(e) => setCustSurname(e.target.value)}
                    />
                    <label htmlFor="cust_name">Customer Name:</label>
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
                        type="number"
                        id="percent"
                        value={custPercent}
                        onChange={(e) => setCustPercent(e.target.value)}
                    />
                    <div className="action-buttons">
                        <button type="button" onClick={handleCancel}>Cancel</button>
                        <button type="submit">Add card</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCustomerCardPage;
