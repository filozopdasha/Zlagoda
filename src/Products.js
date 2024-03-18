import React, { useEffect, useState } from "react";
import supabase from "./config/supabaseClient";

const Products = () => {
    console.log(supabase)
    const [fetchError, setFetchError] = useState(null)
    const [products, setProducts] = useState(null)

    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error} = await supabase
                .from('Product')
                .select()

            if(error){
                setFetchError('Could not fetch the products')
                setProducts(null)
                console.log(error)
            }
            if(data){
                setProducts(data)
                setFetchError(null)
                console.log(data)
            }
        }

        fetchProducts()
    }, [])

    return (
        <div className="products page">
            {fetchError && (<p>{fetchError}</p>)}
            {products && (
                <div className="products">
                    <h2>Products</h2>

                    <div style={{ width: '80%', margin: '0 auto' }}>
                        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                            <thead>
                            <tr>
                                <th style={{border: '1px solid black', padding: '8px'}}>ID</th>
                                <th style={{border: '1px solid black', padding: '8px'}}>Category Number</th>
                                <th style={{border: '1px solid black', padding: '8px'}}>Product Name</th>
                                <th style={{border: '1px solid black', padding: '8px'}}>Manufacturer</th>
                                <th style={{border: '1px solid black', padding: '8px'}}>Characteristics</th>
                            </tr>
                            </thead>
                            <tbody>
                            {products.map(product => (
                                <tr key={product.id_product}>
                                    <td style={{border: '1px solid black', padding: '8px'}}>{product.id_product}</td>
                                    <td style={{border: '1px solid black', padding: '8px'}}>{product.category_number}</td>
                                    <td style={{border: '1px solid black', padding: '8px'}}>{product.product_name}</td>
                                    <td style={{border: '1px solid black', padding: '8px'}}>{product.manufacturer}</td>
                                    <td style={{border: '1px solid black', padding: '8px'}}>{product.characteristics}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );



};

export default Products;