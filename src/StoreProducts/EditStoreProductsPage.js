import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './AddStoreProductsPageStyles.css';

const EditStoreProductsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formError, setFormError] = useState('');
    const [productUPC, setProductUPC] = useState('');
    const [upcProm, setUpcProm] = useState('');
    const [sellingPrice, setSellingPrice] = useState('');
    const [promotionalProduct, setPromotionalProduct] = useState('');
    const [productsNumber, setProductsNumber] = useState('');
    const [upcOptions, setUpcOptions] = useState([]); // State to store all UPC options
    const [productId, setProductId] = useState(null); // State to store the selected product's id_product

    useEffect(() => {
        const fetchStoreProduct = async () => {
            try {
                const response = await fetch(`http://localhost:8081/get-store-products?sortBy=${"upc"}&sortOrder=${"ASC"}`);
                if (!response.ok) {
                    throw new Error('Could not fetch store products');
                }
                const data = await response.json();
                const product = data.find(product => product.upc === id);

                setProductUPC(product.upc);
                setSellingPrice(product.selling_price);
                setPromotionalProduct(product.promotional_product);
                setProductsNumber(product.products_number);
                setProductId(product.id_product);

                const upcResponse = await fetch(`http://localhost:8081/get-all-upc-by-product-id/${product.id_product}`);
                if (!upcResponse.ok) {
                    throw new Error('Could not fetch UPC options');
                }
                const upcData = await upcResponse.json();

                const filteredUpcOptions = upcData.filter(option => option !== product.upc);

                setUpcOptions(filteredUpcOptions);
            } catch (error) {
                console.error(error);
            }
        };

        fetchStoreProduct();
    }, [id]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!productUPC || !sellingPrice || !productsNumber) {
            setFormError("Please fill in all the fields correctly!");
            return;
        }

        try {
            const upcPromValue = String(promotionalProduct).toLowerCase() === 'false' ? null : upcProm;

            const response = await fetch(`http://localhost:8081/update-store-products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    upc: productUPC,
                    upc_prom: upcPromValue,
                    selling_price: sellingPrice,
                    promotional_product: promotionalProduct,
                    products_number: productsNumber
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update employee');
            }

            navigate('/store-products');
        } catch (error) {
            console.error('Error updating employee:', error.message);
        }
    };

    const handleCancel = () => {
        navigate('/store-products');
    };

    return (
        <div className="add-employee-form-container">
            <div className="edit-employee-form">
                {formError && <p className="add-error-message">{formError}</p>}
                <h2 className="zlagoda-form">Zlagoda</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="upc">UPC:</label>
                    <input type="text"
                           id="upc"
                           value={productUPC}
                           onChange={(e) => setProductUPC(e.target.value)}
                    />
                    <label htmlFor="upc_prom">UPC Prom:</label>
                    <select
                        id="upc_prom"
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
                    <label htmlFor="selling_price">Selling Price:</label>
                    <input type="text"
                           id="selling_price"
                           value={sellingPrice}
                           onChange={(e) => setSellingPrice(e.target.value)}
                    />
                    <label htmlFor="promotional_product">Promotional Product:</label>
                    <select
                        id="promotional_product"
                        value={promotionalProduct}
                        onChange={(e) => setPromotionalProduct(e.target.value)}
                    >
                        <option value="">Select Promotional Product</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                    <label htmlFor="products_number">Products Number:</label>
                    <input type="text"
                           id="products_number"
                           value={productsNumber}
                           onChange={(e) => setProductsNumber(e.target.value)}
                    />
                    <div className="action-buttons">
                        <button type="button" onClick={handleCancel}>Cancel</button>
                        <button type="submit">Edit Store Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditStoreProductsPage;
