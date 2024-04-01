import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './AddCategoryPageStyles.css';

const AddCategoryPage = () => {
    const navigate = useNavigate();
    const [fetchError, setFetchError] = useState(null);
    const [categoryNumberOptions, setCategoryNumberOptions] = useState([]);
    const [selectedCategoryNumber, setSelectedCategoryNumber] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [formError, setFormError] = useState('');

    useEffect(() => {
        const fetchMaxId = async () => {
            try {
                const response = await fetch('http://localhost:8081/get-max-category-number');
                if (!response.ok) {
                    throw new Error('Could not fetch max category number');
                }
                const categoryNumbers = await response.json();

                const existingCategoryNumbers = categoryNumbers.map(category => category.category_number);
                const maxNumber = Math.max(...existingCategoryNumbers, 0);

                const availableNumbers = [];
                for (let i = 1; i <= maxNumber + 21; i++) {
                    if (!existingCategoryNumbers.includes(i)) {
                        availableNumbers.push(i);
                    }
                }

                setCategoryNumberOptions(availableNumbers);
            } catch (error) {
                console.error('Error fetching max category number:', error.message);
            }
        };

        fetchMaxId();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!categoryName || !selectedCategoryNumber) {
            setFormError("Please fill in all the fields correctly!");
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/add-category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category_number: selectedCategoryNumber,
                    category_name: categoryName }),
            });

            if (!response.ok) {
                throw new Error('An error occurred while adding a new category. Please try again.');
            }

            navigate('/categories');
        } catch (error) {
            console.error('Error inserting category:', error.message);
            setFormError("An error occurred while adding a new category. Please try again.");
        }
    };

    const handleCancel = () => {
        navigate('/categories');
    };

    return (
        <div className="add-category-form-container">
            {fetchError && (<p>{fetchError}</p>)}

            <div className="add-category-form">
                {formError && <p className="add-error-message">{formError}</p>}
                <h2 className="zlagoda-form">Zlagoda</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="category_number">Category number:</label>
                    <select
                        id="category_number"
                        value={selectedCategoryNumber}
                        onChange={(e) => setSelectedCategoryNumber(e.target.value)}
                    >
                        <option value="">Select category number</option>
                        {categoryNumberOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    <label htmlFor="category_name">Category Name:</label>
                    <input
                        type="text"
                        id="category_name"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                    <div className="action-buttons">
                        <button type="button" onClick={handleCancel}>Cancel</button>
                        <button type="submit">Add category</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCategoryPage;
