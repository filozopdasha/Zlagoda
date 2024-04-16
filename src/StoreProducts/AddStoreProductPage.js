import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './AddStoreProductsPageStyles.css';

const AddStoreProductPage = () => {
    const navigate = useNavigate();
    const [formError, setFormError] = useState('');
    const [productOptions, setProductOptions] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [upc, setUpc] = useState('');
    const [upcProm, setUpcProm] = useState('');
    const [sellingPrice, setSellingPrice] = useState('');
    const [promotionalProduct, setPromotionalProduct] = useState('');
    const [productsNumber, setProductsNumber] = useState('');
    const [upcOptions, setUpcOptions] = useState([]);

    useEffect(() => {
        fetchProductOptions();
    }, []);

    const fetchProductOptions = async () => {
        try {
            const response = await fetch('http://localhost:8081/get-all-product-ids');
            if (!response.ok) {
                throw new Error('Failed to fetch product IDs');
            }
            const data = await response.json();
            setProductOptions(data);
        } catch (error) {
            console.error('Error fetching product IDs:', error.message);
        }
    };

    const fetchUpcOptions = async (productId) => {
        try {
            const response = await fetch(`http://localhost:8081/get-all-upc-by-product-id/${productId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch UPC options');
            }
            const data = await response.json();

            const filteredUpcOptions = data.filter(option => option !== upc);

            setUpcOptions(filteredUpcOptions);
        } catch (error) {
            console.error('Error fetching UPC options:', error.message);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedProductId || !upc || !sellingPrice || !productsNumber) {
            setFormError("Please fill in all the fields correctly!");
            return;
        }

        try {
            const upcPromValue = String(promotionalProduct).toLowerCase() === 'false' ? null : upcProm;

            const response = await fetch('http://localhost:8081/add-store-product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: selectedProductId,
                    upc,
                    upcProm: upcPromValue,
                    sellingPrice,
                    promotionalProduct,
                    productsNumber
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add store product');
            }

            navigate('/store-products');
        } catch (error) {
            console.error('Error adding store product:', error.message);
        }
    };

    const handleCancel = () => {
        navigate('/store-products');
    };

    const handleProductChange = (e) => {
        const productId = e.target.value;
        setSelectedProductId(productId);
        if (productId) {
            fetchUpcOptions(productId);
        } else {
            setUpcOptions([]);
        }
    };

    useEffect(() => {
        if (selectedProductId) {
            fetchUpcOptions(selectedProductId);
        }
    }, [selectedProductId]);

    return (
        <div className="add-empoyee-form-container">
            <div className="add-employee-form">
                {formError && <p className="add-error-message">{formError}</p>}
                <h2 className="zlagoda-form">Zlagoda</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="productId">Product ID:</label>
                    <select
                        id="productId"
                        value={selectedProductId}
                        onChange={handleProductChange}
                    >
                        <option value="">Select Product ID</option>
                        {productOptions.map(option => (
                            <option key={option.id_product} value={option.id_product}>{option.id_product}</option>
                        ))}
                    </select>
                    <label htmlFor="upc">UPC:</label>
                    <input type="text"
                           id="upc"
                           value={upc}
                           onChange={(e) => setUpc(e.target.value)}
                    />
                    <label htmlFor="upcProm">UPC Prom:</label>
                    <select
                        id="upcProm"
                        value={upcProm}
                        onChange={(e) => setUpcProm(e.target.value)}
                        disabled={String(promotionalProduct).toLowerCase() === 'false'}
                        className={String(promotionalProduct).toLowerCase() === 'false' ? 'disabled' : ''}
                    >
                        <option value="">Select UPC Prom</option>
                        {upcOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    <label htmlFor="sellingPrice">Selling Price:</label>
                    <input type="text"
                           id="sellingPrice"
                           value={sellingPrice}
                           onChange={(e) => setSellingPrice(e.target.value)}
                    />
                    <label htmlFor="promotionalProduct">Promotional Product:</label>
                    <select
                        id="promotionalProduct"
                        value={promotionalProduct}
                        onChange={(e) => setPromotionalProduct(e.target.value)}
                    >
                        <option value="">Select Promotional Product</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                    <label htmlFor="productsNumber">Products Number:</label>
                    <input type="text"
                           id="productsNumber"
                           value={productsNumber}
                           onChange={(e) => setProductsNumber(e.target.value)}
                    />
                    <div className="action-buttons">
                        <button type="button" onClick={handleCancel}>Cancel</button>
                        <button type="submit">Add store product</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStoreProductPage;
