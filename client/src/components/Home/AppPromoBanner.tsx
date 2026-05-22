import React from 'react'
import delivery_truck from "../../assets/grocery-assets/delivery_truck.svg"
import { appPromoBannerData } from "../../assets/grocery-assets"
const AppPromoBanner = () => {
  return (
    <section className='max-w-7xl mx-auto px-4 sm:px-8 py-20
    my-14 bg-green-950 rounded-2xl'>
        
        <div className='flex flex-col md:flex-row items-center justify-between
        gap-8 xl:px-10'>
            {/* Left side content */}
            <div className='text-center md:text-left'>
                <h2 className='text-3xl sm:text-4xl font-serif font-semibold tracking-tight leading-tight text-white mb-3'>{appPromoBannerData.title}</h2>
                <p className='text-sm sm:text-base md:text-lg font-serif font-medium text-white/75 leading-relaxed mb-6 max-w-xl'>{appPromoBannerData.description}</p>
                <div>
                  <button className='px-6 py-3 bg-white text-green-950
                  font-semibold rounded-xl hover:bg-orange-100'>App Store</button>
                    <button className='px-6 py-3 bg-white/10 text-white
                    font-semibold rounded-xl hover:bg-white/20 transition-colors
                    border border-white/20'>Google Play</button>
                </div>
            </div>
            {/* Right side content */}
            <img src={delivery_truck} alt="App Promo" className="max-w-60
            sm:max-w-120 xl:pr-10" />
        </div>

        
    </section>
  )
}

export default AppPromoBanner
