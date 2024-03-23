import React, { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
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
        const fetchCategory = async () => {
            let query = supabase.from('Category').select();
            const { data, error } = await query;
            if (error) {
                setFetchError('Could not fetch the categories');
                setCategoryArray(null);
                console.log(error);
            }
            if (data) {
                setCategoryArray(data);
                setFetchError(null);
                console.log(data);
            }
        };

        fetchCategory();
    }, []);

    useEffect(() => {
        const fetchMaxId = async () => {
            const { data, error } = await supabase
                .from('Product')
                .select('id_product', { count: 'exact' })
                .order('id_product', { ascending: false })
                .limit(1);

            if (error) {
                console.error('Error fetching max id:', error.message);
                return;
            }

            const maxId = data.length > 0 ? data[0].id_product : 0;
            setId(maxId + 1);
        };

        fetchMaxId();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!id || !category || !prodName || !characteristics || !manufacturer) {
            setFormError("Please fill in all the fields correctly!");
            return;
        }

        const { data, error } = await supabase
            .from("Product")
            .insert([{ id_product:id, category_number:category, product_name:prodName, characteristics:characteristics, manufacturer:manufacturer }]);

        if (error) {
            console.error('Error inserting product:', error.message);
            setFormError("An error occurred while adding the product. Please try again.");
            return;
        }

        navigate('/products')
        console.log('Product added successfully:', data);
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
