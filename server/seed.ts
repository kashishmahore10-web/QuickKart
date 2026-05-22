import {prisma} from './config/prisma.js';
import { Prisma } from './generated/prisma/client.js';

const seedDB = async () => {
  try {
    // Clear existing products to avoid duplicates during testing
    await prisma.product.deleteMany({});
    console.log('cleared existing products');

    // Define dummy products array
    // Note: IDs and timestamps are removed as the database generates them automatically
    const products: Prisma.ProductCreateManyInput[] = [
  
    {
        
        name: "Organic Apples",
        description: "Fresh, juicy apples sourced from nearby farms.",
        price: 139,
        originalPrice: 159,
        image: "C:\Users\Lenovo\OneDrive\Desktop\QuickKart\client\src\assets\grocery-assets\fruits_vegetables.png",
        category: "fruits-vegetables",
        unit: "1 kg",
        stock: 28,
        isOrganic: true,
        rating: 4.8,
        reviewCount: 62,
      
    },
    {
    
        name: "Whole Wheat Bread",
        description: "Freshly baked whole wheat bread, soft and healthy.",
        price: 49,
        originalPrice: 59,
        image: "C:\Users\Lenovo\OneDrive\Desktop\QuickKart\client\src\assets\grocery-assets\bakery.png",
        category: "bakery",
        unit: "400 g",
        stock: 42,
        isOrganic: false,
        rating: 4.6,
        reviewCount: 38,
       
    },
    {
        
        name: "Farm Fresh Eggs",
        description: "A dozen cage-free eggs with premium nutrition.",
        price: 119,
        originalPrice: 129,
        image: "C:\Users\Lenovo\OneDrive\Desktop\QuickKart\client\src\assets\grocery-assets\dairy.png",
        category: "dairy-eggs",
        unit: "12 pcs",
        stock: 64,
        isOrganic: true,
        rating: 4.9,
        reviewCount: 81,
     
    },
    {
       
        name: "Fresh Chicken Breast",
        description: "Lean chicken breast, perfect for healthy meals.",
        price: 299,
        originalPrice: 349,
        image: "C:\Users\Lenovo\OneDrive\Desktop\QuickKart\client\src\assets\grocery-assets\meat.png",
        category: "meat-seafood",
        unit: "500 g",
        stock: 16,
        isOrganic: false,
        rating: 4.5,
        reviewCount: 47,
       
    },
    {
      
        name: "Frozen Mixed Vegetables",
        description: "Ready-to-cook frozen vegetables for quick meals.",
        price: 99,
        originalPrice: 119,
        image: "C:\Users\Lenovo\OneDrive\Desktop\QuickKart\client\src\assets\grocery-assets\frozen.png",
        category: "frozen-foods",
        unit: "1 kg",
        stock: 33,
        isOrganic: false,
        rating: 4.4,
        reviewCount: 25,
      
    },
    {
       
        name: "Sparkling Mineral Water",
        description: "Refreshing soft drink with natural mineral bubbles.",
        price: 59,
        originalPrice: 69,
        image: "C:\Users\Lenovo\OneDrive\Desktop\QuickKart\client\src\assets\grocery-assets\drinks.png",
        category: "drinks",
        unit: "1 L",
        stock: 80,
        isOrganic: false,
        rating: 4.2,
        reviewCount: 19,
      
    },
    {
       
        name: "Healthy Snack Bars",
        description: "Crunchy snack bars with nuts and seeds.",
        price: 129,
        originalPrice: 149,
        image: "C:\Users\Lenovo\OneDrive\Desktop\QuickKart\client\src\assets\grocery-assets\snacks.png",
        category: "snacks",
        unit: "6 pcs",
        stock: 55,
        isOrganic: false,
        rating: 4.7,
        reviewCount: 43,
    
    },
    {
        
        name: "Organic Multigrain Pasta",
        description: "Nutritious pasta made from whole grains.",
        price: 159,
        originalPrice: 179,
        image: "C:\Users\Lenovo\OneDrive\Desktop\QuickKart\client\src\assets\grocery-assets\pantry.png",
        category: "pantry-staples",
        unit: "500 g",
        stock: 60,
        isOrganic: true,
        rating: 4.6,
        reviewCount: 29,
        
    },
    {
       
        name: "Herbal Shampoo",
        description: "Gentle herbal shampoo for daily hair care.",
        price: 189,
        originalPrice: 209,
        image: "C:\Users\Lenovo\OneDrive\Desktop\QuickKart\client\src\assets\grocery-assets\personal_care.png",
        category: "personal-care",
        unit: "400 ml",
        stock: 72,
        isOrganic: false,
        rating: 4.3,
        reviewCount: 34,
     
    },
    {

        name: "Baby Care Essentials",
        description: "Soft baby wipes and lotion for delicate skin.",
        price: 249,
        originalPrice: 279,
        image: "C:\Users\Lenovo\OneDrive\Desktop\QuickKart\client\src\assets\grocery-assets\baby_care.png",
        category: "baby-care",
        unit: "bundle",
        stock: 48,
        isOrganic: true,
        rating: 4.8,
        reviewCount: 51,
    }
];

      // ... Add more product objects from your assets here


    // Insert dummy data into the database
    await prisma.product.createMany({
      data: products,
    });

    console.log(`created ${products.length} products`);
    console.log('seed completed successfully');
    process.exit(0);
  } catch (error: any) {
    console.error('seed error', error);
    process.exit(1);
  } finally {
    // Ensure the database connection is closed after seeding
    await prisma.$disconnect();
  }
};

// Execute the seeding function
seedDB();