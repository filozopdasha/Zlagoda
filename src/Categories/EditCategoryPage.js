import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './AddCategoryPageStyles.css';

const EditCategoryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [fetchError, setFetchError] = useState(null);
    const [categoryArray, setCategoryArray] = useState(null);

    // Table attributes
    const [categoryNumber, setCategoryNumber] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [formError, setFormError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`http://localhost:8081/get-category?sortBy=${"category_number"}&sortOrder=${"ASC"}`);
                if (!response.ok) {
                    throw new Error('Could not fetch the categories');
                }
                const data = await response.json();
                setCategoryArray(data);
                setFetchError(null);
            } catch (error) {
                setFetchError(error.message);
                setCategoryArray(null);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const response = await fetch(`http://localhost:8081/get-single-category/${id}`);
                if (!response.ok) {
                    throw new Error('Could not fetch category data');
                }
                const data = await response.json();

                const categoryNumbers = data.map(category => category.category_number);
                const categoryNames = data.map(category => category.category_name);

                setCategoryNumber(categoryNumbers[0]);
                setCategoryName(categoryNames[0]);
                console.log(data)
            } catch (error) {
                console.error('Error fetching category data:', error.message);
            }
        };

        fetchCategoryData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!categoryName) {
            setFormError("Please fill in all the fields correctly!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8081/update-category/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category_number: categoryNumber,
                    category_name: categoryName }),
            });

            if (!response.ok) {
                throw new Error('Failed to update category');
            }

            navigate('/categories');
        } catch (error) {
            console.error('Error updating category:', error.message);
            setFormError("An error occurred while updating the category. Please try again.");
        }
    };

    const handleCancel = () => {
        navigate('/categories');
    };

    // Generate category number options
    let maxCategoryNumber = categoryArray ? Math.max(...categoryArray.map(category => category.category_number)) : 0;
    let categoryNumberOptions = [id];

    // Numbers from 1 to max category number that do not exist in the category table
    for (let i = 1; i <= maxCategoryNumber; i++) {
        if (!categoryArray.find(category => category.category_number === i)) {
            categoryNumberOptions.push(i);
        }
    }

    // Range [max category number + 1, max category number + 21]
    for (let i = maxCategoryNumber + 1; i <= maxCategoryNumber + 21; i++) {
        categoryNumberOptions.push(i);
    }

    return (
        <div className="add-product-form-container">
            <div className="add-product-form">
                {formError && <p className="add-error-message">{formError}</p>}
                <h2 className="zlagoda-form">Zlagoda</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="category_number">Category Number:</label>
                    <select
                        id="category_number"
                        value={categoryNumber}
                        onChange={(e) => setCategoryNumber(e.target.value)}>
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
                        <button type="submit">Edit category</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCategoryPage;
