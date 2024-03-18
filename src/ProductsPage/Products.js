import React, { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import './ProductsPageStyles.css';
import MenuBar from "../MenuBar/MenuBar";

const Products = () => {
    console.log(supabase)
    const [fetchError, setFetchError] = useState(null)
    const [products, setProducts] = useState(null)

    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error} = await supabase
                .from('Product')
                .select()
                .order('category_number')

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

            <MenuBar />
            {fetchError && (<p>{fetchError}</p>)}
            {products && (
                <div className="products">
                    <div style={{width: '80%', margin: '0 auto'}}>
                        <table className="product-table">
                            <thead>
                            <tr>
                                <th className="title">ID</th>
                                <th className="title">Product Name</th>
                                <th className="space"></th>
                                <th className="title">Category Number</th>
                                <th className="title">Manufacturer</th>
                                <th className="title">Characteristics</th>
                            </tr>
                            </thead>
                            <tbody>
                            {products.map(product => (
                                <tr key={product.id_product}>
                                    <td className="product-data">{product.id_product}</td>
                                    <td className="product-data">{product.product_name}</td>
                                    <td className="space"></td>
                                    <td className="product-data">{product.category_number}</td>
                                    <td className="product-data">{product.manufacturer}</td>
                                    <td className="product-data">{product.characteristics}</td>
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