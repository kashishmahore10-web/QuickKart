import { Leaf, Truck, Shield, Clock, MailIcon, PhoneIcon, MapPinIcon } from 'lucide-react';
import hero_bg from './hero_bg.png';
import fruitVeg from './fruits_vegetables.png';
import bakery from './bakery.png';
import dairy from './dairy_eggs.png';
import meat from './meat_seafood.png';
import frozen from './frozen_foods.png';
import drinks from './drinks.png';
import snacks from './snacks.png';
import pantry from './pantry_staples.png';
import personal from './personal_care.png';
import baby from './baby_care.png';
import { SiFacebook, SiInstagram, SiX } from '@icons-pack/react-simple-icons';

export const assests = {
    hero_bg,
};

export const heroSectionData = {
    description: "Fresh, organic groceries delivered from local farms to your doorstep. Quality you can  taste, convenience you deserve.",
    hero_title: "Fresh Groceries at Your Doorstep",
    hero_subtitle: "Get fresh, organic produce delivered to your home in minutes",
    hero_cta: "Shop Now",
    hero_features: [
        {
            icon: Leaf,
            title: "100% Fresh",
            desc: "Farm to table quality"
        },
        {
            icon: Truck,
            title: "Fast Delivery",
            desc: "Quick & reliable service"
        },
        {
            icon: Shield,
            title: "Quality Assured",
            desc: "Premium products only"
        },
        {
            icon: Clock,
            title: "24/7 Available",
            desc: "Shop anytime, anywhere"
        }
    ]
};

export const deliveryPartnerLoginImage =
  "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200";


export const appPromoBannerData = {
    title: "Get fresh groceries in minutes",
    description: "Download the Instacart app for exclusive deals, real-time tracking, and the freshest selection delivered right to your door."
};

export const categoriesData = [
    { slug: "fruits-vegetables", name: "Fruits & Vegetables", image: fruitVeg },
    { slug: "bakery", name: "Bakery", image: bakery },
    { slug: "dairy-eggs", name: "Dairy & Eggs", image: dairy },
    { slug: "meat-seafood", name: "Meat & Seafood", image: meat },
    { slug: "frozen-foods", name: "Frozen Foods", image: frozen },
    { slug: "drinks", name: "Drinks", image: drinks },
    { slug: "snacks", name: "Snacks", image: snacks },
    { slug: "pantry-staples", name: "Pantry Staples", image: pantry },
    { slug: "personal-care", name: "Personal Care", image: personal },
    { slug: "baby-care", name: "Baby Care", image: baby }
];


export const footerData = { 
  brand: {
    name: "Instacart",
    description: "Nourish your home with Earth's finest products.",
    socials: [
      { icon: SiFacebook, link: "#" },
      { icon: SiX, link: "#" },
      { icon: SiInstagram, link: "#" }
    ]
  },
  sections: [
    {
      title: "Quick Links",
      links: [
        { label: "Home", to: "/" },
        { label: "Products", to: "/products" },
        { label: "Deals", to: "/deals" }
      ]
    },
    {
      title: "Customer Service",
      links: [
        { label: "Contact Us", to: "/contact" },
        { label: "FAQs", to: "/faq" }
      ]
    }
  ],
  contact: [
    { icon: MapPinIcon, text: "123 Grocery St, Food City" },
    { icon: PhoneIcon, text: "+1 234 567 890" },
    { icon: MailIcon, text: "support@instacart.com" }
  ],
  bottom: {
    copyright: "© 2026 Instacart. All rights reserved.",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" }
    ]
  }
};

// Dynamic UI Status Colors [16]
export const statusColors: Record<string, string> = { 
  placed: "bg-blue-100 text-blue-700",
  confirmed: "bg-indigo-100 text-indigo-700",
  assigned: "bg-purple-100 text-indigo-700",
  packed: "bg-yellow-100 text-yellow-700",
  "out for delivery": "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700"
};

// Main Assets Object [17]
export const assets = {
  deliveryTruck: "delivery_truck_image_url" 
};
export const iconsForLeafpad = {
  truck: "https://cdn-icons-png.flaticon.com/512/3097/3097180.png",
  destination: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
};



export const dummyProducts = [
    {
        _id: "prod-001",
        name: "Organic Apples",
        description: "Fresh, juicy apples sourced from nearby farms.",
        price: 139,
        originalPrice: 159,
        image: fruitVeg,
        category: "fruits-vegetables",
        unit: "1 kg",
        stock: 28,
        isOrganic: true,
        rating: 4.8,
        reviewCount: 62,
        discount: 12,
        createdAt: "2024-05-14"
    },
    {
        _id: "prod-002",
        name: "Whole Wheat Bread",
        description: "Freshly baked whole wheat bread, soft and healthy.",
        price: 49,
        originalPrice: 59,
        image: bakery,
        category: "bakery",
        unit: "400 g",
        stock: 42,
        isOrganic: false,
        rating: 4.6,
        reviewCount: 38,
        discount: 16,
        createdAt: "2024-05-12"
    },
    {
        _id: "prod-003",
        name: "Farm Fresh Eggs",
        description: "A dozen cage-free eggs with premium nutrition.",
        price: 119,
        originalPrice: 129,
        image: dairy,
        category: "dairy-eggs",
        unit: "12 pcs",
        stock: 64,
        isOrganic: true,
        rating: 4.9,
        reviewCount: 81,
        discount: 8,
        createdAt: "2024-05-10"
    },
    {
        _id: "prod-004",
        name: "Fresh Chicken Breast",
        description: "Lean chicken breast, perfect for healthy meals.",
        price: 299,
        originalPrice: 349,
        image: meat,
        category: "meat-seafood",
        unit: "500 g",
        stock: 16,
        isOrganic: false,
        rating: 4.5,
        reviewCount: 47,
        discount: 14,
        createdAt: "2024-05-08"
    },
    {
        _id: "prod-005",
        name: "Frozen Mixed Vegetables",
        description: "Ready-to-cook frozen vegetables for quick meals.",
        price: 99,
        originalPrice: 119,
        image: frozen,
        category: "frozen-foods",
        unit: "1 kg",
        stock: 33,
        isOrganic: false,
        rating: 4.4,
        reviewCount: 25,
        discount: 17,
        createdAt: "2024-05-05"
    },
    {
        _id: "prod-006",
        name: "Sparkling Mineral Water",
        description: "Refreshing soft drink with natural mineral bubbles.",
        price: 59,
        originalPrice: 69,
        image: drinks,
        category: "drinks",
        unit: "1 L",
        stock: 80,
        isOrganic: false,
        rating: 4.2,
        reviewCount: 19,
        discount: 14,
        createdAt: "2024-05-03"
    },
    {
        _id: "prod-007",
        name: "Healthy Snack Bars",
        description: "Crunchy snack bars with nuts and seeds.",
        price: 129,
        originalPrice: 149,
        image: snacks,
        category: "snacks",
        unit: "6 pcs",
        stock: 55,
        isOrganic: false,
        rating: 4.7,
        reviewCount: 43,
        discount: 13,
        createdAt: "2024-05-02"
    },
    {
        _id: "prod-008",
        name: "Organic Multigrain Pasta",
        description: "Nutritious pasta made from whole grains.",
        price: 159,
        originalPrice: 179,
        image: pantry,
        category: "pantry-staples",
        unit: "500 g",
        stock: 60,
        isOrganic: true,
        rating: 4.6,
        reviewCount: 29,
        discount: 11,
        createdAt: "2024-05-01"
    },
    {
        _id: "prod-009",
        name: "Herbal Shampoo",
        description: "Gentle herbal shampoo for daily hair care.",
        price: 189,
        originalPrice: 209,
        image: personal,
        category: "personal-care",
        unit: "400 ml",
        stock: 72,
        isOrganic: false,
        rating: 4.3,
        reviewCount: 34,
        discount: 10,
        createdAt: "2024-04-30"
    },
    {
        _id: "prod-010",
        name: "Baby Care Essentials",
        description: "Soft baby wipes and lotion for delicate skin.",
        price: 249,
        originalPrice: 279,
        image: baby,
        category: "baby-care",
        unit: "bundle",
        stock: 48,
        isOrganic: true,
        rating: 4.8,
        reviewCount: 51,
        discount: 11,
        createdAt: "2024-04-28"
    }
];

export default heroSectionData;
