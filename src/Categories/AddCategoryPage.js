import React, { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
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
            const { data, error } = await supabase
                .from('Category')
                .select('category_number');

            if (error) {
                console.error('Error fetching category numbers:', error.message);
                return;
            }

            const existingCategoryNumbers = data.map(category => category.category_number);
            const maxCategoryNumber = Math.max(...existingCategoryNumbers, 0);

            // Generate numbers from 1 to max category number that don't exist in the table
            const availableNumbers = [];
            for (let i = 1; i <= maxCategoryNumber; i++) {
                if (!existingCategoryNumbers.includes(i)) {
                    availableNumbers.push(i);
                }
            }

            // Append the range [max category number + 1, max category number + 21]
            for (let i = maxCategoryNumber + 1; i <= maxCategoryNumber + 21; i++) {
                availableNumbers.push(i);
            }

            setCategoryNumberOptions(availableNumbers);
        };

        fetchMaxId();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!categoryName || !selectedCategoryNumber) {
            setFormError("Please fill in all the fields correctly!");
            return;
        }

        const { data, error } = await supabase
            .from("Category")
            .insert([{ category_number: selectedCategoryNumber, category_name: categoryName }]);

        if (error) {
            console.error('Error inserting category:', error.message);
            setFormError("An error occurred while adding a new category. Please try again.");
            return;
        }

        navigate('/categories');
        console.log('Category added successfully:', data);
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
