import React, { useEffect, useState } from 'react'

import { Address, Product } from '../../types';
import { Link } from 'react-router';
import { ArrowRightIcon } from 'lucide-react';
import ProductCard from '../ProductCard';
import API from '../../config/api';


const PopularProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    
    

    useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await API.get(
        "/products?limit=10&sort=rating"
      );

      setProducts(response?.data?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  fetchProducts();
}, []);

  return (
    <section className='pb-16'>
        <div className='max-w-7xl mx-auto'>
        <div className='flex items-center justify-between mb-8'>
            <div>
                <h2 className='text-3xl font-semibold '>Popular Products</h2>
                <p  className='text-sm text-app-text-light mt-1'>Top-rated products
                    this season</p>
            </div>
            <Link to="/products" className='text-sm font-semibold text-app-green 
            hover:text-app-orange-dark flex items-center gap-1 transition-colors'>
                View All   <ArrowRightIcon className='size-4'/>
            </Link>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-4
            xl:gap-8'>
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>

    </section>
  )
}

export default PopularProducts
