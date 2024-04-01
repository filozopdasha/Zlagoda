import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './AddProductPageStyles.css';

const AddProductPage = () => {
    const navigate = useNavigate();
    const [fetchError, setFetchError] = useState(null);
    const [categoryArray, setCategoryArray] = useState(null);

    // Table attributes
    const [id, setId] = useState('');
    const [category, setCategory] = useState('');
    const [prodName, setName] = useState('');
    const [characteristics, setCharacteristics] = useState('');
    const [manufacturer, setManufacturer] = useState('');
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
                console.log(data);
            } catch (error) {
                setFetchError(error.message);
                setCategoryArray(null);
                console.error(error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchMaxId = async () => {
            try {
                const response = await fetch('http://localhost:8081/get-products-id');
                if (!response.ok) {
                    throw new Error('Failed to fetch maximum product ID');
                }
                const data = await response.json();
                const maxId = Math.max(...data.map(item => item.id_product), 0);
                setId(maxId + 1);
            } catch (error) {
                console.error('Error fetching max id:', error.message);
            }
        };

        fetchMaxId();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!id || !category || !prodName || !characteristics || !manufacturer) {
            setFormError("Please fill in all the fields correctly!");
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/add-product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_product: id,
                    category_number: category,
                    product_name: prodName,
                    characteristics: characteristics,
                    manufacturer: manufacturer
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add product');
            }

            navigate('/products');
            console.log('Product added successfully');
        } catch (error) {
            console.error('Error adding product:', error.message);
            setFormError("An error occurred while adding the product. Please try again.");
        }
    };


    const handleCancel = () => {
        navigate('/products');
    };

    return (
        <div className="add-product-form-container">
            <div className="add-product-form">
                {formError && <p className="add-error-message">{formError}</p>}
                <h2 className="zlagoda-form">Zlagoda</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="category">Category:</label>
                    <select
                        id="category_number"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}>
                        <option value=""></option>
                        {categoryArray &&
                            categoryArray.map((categoryItem, index) => (
                                <option key={index} value={categoryItem.category_number}>
                                    {categoryItem.category_number} - {categoryItem.category_name}
                                </option>
                            ))}
                    </select>
                    <label htmlFor="product_name">Product Name:</label>
                    <input type="text"
                           id="product_name"
                           value={prodName}
                           onChange={(e) => setName(e.target.value)}
                    />
                    <label htmlFor="characteristics">Characteristics:</label>
                    <input type="text"
                           id="characteristics"
                           value={characteristics}
                           onChange={(e) => setCharacteristics(e.target.value)}
                    />
                    <label htmlFor="manufacturer">Manufacturer:</label>
                    <input type="text"
                           id="manufacturer"
                           value={manufacturer}
                           onChange={(e) => setManufacturer(e.target.value)}
                    />
                    <div className="action-buttons">
                        <button type="button" onClick={handleCancel}>Cancel</button>
                        <button type="submit">Add product</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductPage;
